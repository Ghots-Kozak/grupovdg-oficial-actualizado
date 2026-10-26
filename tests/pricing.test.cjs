const test=require('node:test');
const assert=require('node:assert/strict');
const P=require('../assets/js/pricing.js');
test('web responsive incluida sin cobrar plataforma móvil',()=>{
  const r=P.calculate({...P.defaults('web'),design:'standard'});
  assert.equal(r.total,16000);
  assert.equal(r.discount,0);
  assert.equal(r.rows.some(x=>/plataforma|móvil independiente|responsive/.test(x.label)),false);
});
test('tienda no vuelve a cobrar autenticación, datos, panel ni pagos',()=>{
  const input={...P.defaults('web'),subtype:'ecommerce',screens:8,design:'standard'};
  const base=P.calculate(input);
  const withDuplicates=P.calculate({...input,features:['auth','database','admin','payments','payments']});
  assert.equal(base.total,36000);
  assert.equal(withDuplicates.total,base.total);
  assert.deepEqual(withDuplicates.state.features,[]);
});
test('dependencias de suscripciones se cobran una vez en landing y se reutilizan en tienda',()=>{
  const r=P.calculate({...P.defaults('web'),subtype:'landing',screens:1,design:'standard',features:['subscriptions']});
  assert.deepEqual(r.state.features.sort(),['auth','payments','subscriptions']);
  assert.equal(r.total,(20+30+20+26)*P.RATE);
  const e=P.calculate({...r.state,subtype:'ecommerce',screens:8});
  assert.equal(e.total,(90+30)*P.RATE);
});
test('APIs totales descuentan la integración ya seleccionada',()=>{
  const common={...P.defaults('web'),design:'standard',features:['api']};
  const one=P.calculate({...common,integrations:1});
  const zero=P.calculate({...common,integrations:0});
  const two=P.calculate({...common,integrations:2});
  assert.equal(zero.total,one.total);
  assert.equal(two.total-one.total,P.FEATURES.api.hours*P.RATE);
});
test('varios roles agregan cuentas y permisos, sin duplicar módulos existentes',()=>{
  const common={...P.defaults('web'),design:'standard'};
  const r=P.calculate({...common,roles:2});
  assert.equal(r.total-16000,(20+18)*P.RATE);
  const withFeatures=P.calculate({...common,roles:2,features:['roles']});
  assert.equal(withFeatures.total,r.total);
  const system=P.calculate({...P.defaults('system'),design:'standard',roles:2});
  assert.equal(system.total,140*P.RATE);
});
test('recurrentes separados y capacitación como pago único',()=>{
  const r=P.calculate({...P.defaults('web'),design:'standard',services:['hosting','maintenance','domain','training','hosting']});
  assert.equal(r.monthlyTotal,2150);
  assert.equal(r.yearlyTotal,500);
  assert.equal(r.total,16800);
  assert.equal(r.rows.reduce((s,x)=>s+x.amount,0),r.total);
});
test('asesoría no inventa una cifra cerrada',()=>{
  const r=P.calculate(P.defaults('advice'));
  assert.equal(r.estimate,false);assert.equal(r.review,true);assert.equal(r.total,0);
});
test('offline se limita a plataformas compatibles y se quitan funciones irrelevantes',()=>{
  const basic=P.normalize({...P.defaults('web'),features:['offline','unrecognized']});
  assert.deepEqual(basic.features,[]);
  const pwa=P.normalize({...basic,platform:'pwa',features:['offline']});
  assert.deepEqual(pwa.features,['offline']);
  const ai=P.normalize({...P.defaults('ai'),features:['maps','cms']});
  assert.deepEqual(ai.features,[]);
});
test('la segunda plataforma móvil agrega esfuerzo; no replica el proyecto completo',()=>{
  const a=P.calculate({...P.defaults('mobile'),design:'standard',platform:'android'});
  const b=P.calculate({...a.state,platform:'both'});
  assert.equal(b.total-a.total,35*P.RATE);
});
test('datos restaurados corruptos se normalizan a rangos y valores finitos',()=>{
  const r=P.calculate({type:'unknown',subtype:'unknown',platform:'unknown',design:'unknown',screens:'NaN',roles:-55,integrations:9999,features:[null,'payments','payments'],services:['nonsense'],deadline:'invalid'});
  assert.equal(r.state.type,'web');assert.equal(r.state.roles,1);assert.equal(r.state.integrations,10);assert.ok(Number.isFinite(r.total));assert.equal(r.state.screens,7);assert.equal(r.state.deadline,'flexible');assert.deepEqual(r.state.services,[]);
});
test('proyectos grandes piden revisión',()=>{
  assert.equal(P.calculate({...P.defaults('web'),screens:40}).review,true);
  assert.equal(P.calculate({...P.defaults('system'),roles:7}).review,true);
});
test('nombres heredados del prototipo y entradas vacías no rompen un borrador',()=>{
  for(const type of ['__proto__','toString','constructor',null]) {
    const r=P.calculate({type,subtype:'constructor',design:'toString',features:['toString','__proto__',{},null],services:['constructor']});
    assert.equal(r.state.type,'web');assert.ok(Number.isFinite(r.total));
    assert.deepEqual(r.state.features,[]);assert.deepEqual(r.state.services,[]);
  }
  assert.ok(Number.isFinite(P.calculate(null).total));
});
test('todas las combinaciones básicas producen desgloses coherentes y ningún descuento',()=>{
  for(const [type,t] of Object.entries(P.TYPES))for(const subtype of Object.keys(t.subtypes))for(const platform of t.platforms)for(const design of Object.keys(P.DESIGNS)){
    const r=P.calculate({...P.defaults(type),subtype,platform:platform[0],design,features:Object.keys(P.FEATURES),screens:25,roles:3,integrations:3,services:Object.keys(P.SERVICES)});
    assert.ok(Number.isFinite(r.total)&&r.total>=0);
    assert.equal(r.total,r.rows.reduce((s,x)=>s+x.amount,0));
    assert.equal(r.discount,0);
    assert.ok(r.low<=r.total&&r.high>=r.total);
    assert.equal(new Set(r.state.features).size,r.state.features.length);
  }
});
