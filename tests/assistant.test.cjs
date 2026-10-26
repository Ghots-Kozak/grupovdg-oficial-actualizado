const test=require('node:test'),assert=require('node:assert/strict');
const A=require('../assets/js/assistant-engine.js');
test('40 preguntas con identificadores únicos y respuestas completas',()=>{
  assert.equal(A.faq.length,40);assert.equal(new Set(A.faq.map(q=>q.key)).size,40);
  for(const q of A.faq){assert.ok(q.text.length>80);assert.ok(q.bullets.length>=2);const r=A.reply('q:'+q.id,{});assert.equal(r.context.lastKey,q.key);}
});
test('números del simulador original siguen seleccionando preguntas',()=>{
  assert.equal(A.reply('12',{}).context.lastKey,'contact');
  assert.equal(A.reply('pregunta 15',{}).context.lastKey,'brief');
  assert.equal(A.reply('opción 9',{}).context.lastKey,'integrations');
});
test('una consulta de costo y plazo responde ambos temas y reconoce Android+iOS',()=>{
  const r=A.reply('Quiero una app para Android y iPhone. ¿Cuánto cuesta y cuánto tarda?',{});
  assert.equal(r.context.service,'mobile');assert.equal(r.context.platform,'both');
  assert.ok(['costs','timelines'].includes(r.context.lastKey));assert.equal(r.cards.length,2);assert.ok(r.cards.some(c=>/Costo de tu/.test(c.title)));
  assert.ok(r.cards.some(c=>/Cuánto tardará/.test(c.title)));
});
test('mantiene contexto para una pregunta de seguimiento',()=>{
  const a=A.reply('Necesito una app Android',{}),b=A.reply('¿Y para iPhone?',a.context);
  assert.equal(b.context.service,'mobile');assert.equal(b.context.platform,'ios');
  assert.match(b.cards[0].text,/iPhone/);
});
test('una corrección explícita puede cambiar la solución',()=>{
  const r=A.reply('No quiero una app, quiero una página web',{service:'mobile'});
  assert.equal(r.context.service,'web');
});
test('admite faltas leves y expresiones coloquiales',()=>{
  assert.equal(A.reply('cuanto custa una pagina',{}).context.lastKey,'costs');
  assert.equal(A.reply('quiero hablar por watsap',{}).context.lastKey,'contact');
});
test('guía de elección completa sin perder el objetivo',()=>{
  const a=A.reply('guide',{}),b=A.reply('goal:sell',a.context),r=A.reply('stage:mvp',b.context);
  assert.equal(a.context.advisor,1);assert.equal(b.context.advisor,2);
  assert.equal(r.context.advisor,0);assert.equal(r.context.service,'web');
  assert.match(r.cards[0].text,/tienda web/);
});
test('un tema desconocido pide aclaración en vez de inventar',()=>{
  const r=A.reply('xyz blablabla',{});assert.match(r.cards[0].text,/suficiente seguridad/);assert.ok(r.choices.length);
});
test('contexto persistible conserva solo campos tipados de orientación',()=>{
  const c=A.context({service:'web',email:'private@example.com',name:'Private',text:'texto libre',lastKey:'constructor'});
  assert.equal(c.email,undefined);assert.equal(c.name,undefined);assert.equal(c.text,undefined);assert.equal(c.lastKey,'');
});
test('el asistente de reglas no depende de fetch, credenciales o modelos',()=>{
  const fs=require('node:fs');const source=fs.readFileSync(require.resolve('../assets/js/assistant-engine.js'),'utf8');assert.doesNotMatch(source,/\bfetch\s*\(|api[_-]?key|openai\.com/);
});
