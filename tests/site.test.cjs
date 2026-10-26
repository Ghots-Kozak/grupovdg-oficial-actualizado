const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const pages=['index.html','paginas-web.html','aplicaciones.html','sistemas.html','cotizar.html','contacto.html'];
test('cada vista tiene al menos siete secciones y un solo título principal',()=>{
  for(const page of pages){
    const html=fs.readFileSync(path.join(root,page),'utf8');
    assert.ok((html.match(/data-section/g)||[]).length>=7,page);
    assert.equal((html.match(/<h1>/g)||[]).length,1,page);
    assert.match(html,/<html lang="es-MX">/);
    assert.doesNotMatch(html,/\bundefined\b/);
  }
});
test('los recursos, enlaces internos y destinos de sección existen',()=>{
  for(const page of pages){
    const html=fs.readFileSync(path.join(root,page),'utf8');
    for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
      const url=match[1];
      if(/^(?:https?:|mailto:|tel:|data:)/.test(url))continue;
      if(url==='#privacidad')continue;
      const [local,fragment]=url.split('#');
      if(local)assert.ok(fs.existsSync(path.join(root,local.split('?')[0])),page+': '+url);
      else if(fragment)assert.ok(html.includes('id="'+fragment+'"'),page+': '+url);
    }
  }
});
test('ningún script ni tipografía se descarga de un CDN',()=>{
  for(const page of pages){
    const html=fs.readFileSync(path.join(root,page),'utf8');
    assert.doesNotMatch(html,/<script[^>]+src="https?:/);
    assert.doesNotMatch(html,/fonts\.google|cdn\.jsdelivr|unpkg\.com/);
  }
});
test('contacto y tarifas no publican identidades inventadas ni promociones activas',()=>{
  const config=fs.readFileSync(path.join(root,'assets/js/config.js'),'utf8');
  assert.match(config,/victor\.castro@grupovdg\.com/);assert.match(config,/\+525659865944/);assert.match(config,/whatsapp: '525659865944'/);
  const pricing=require('../assets/js/pricing.js');
  assert.equal(pricing.calculate(pricing.defaults()).discount,0);
});
