const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), vm = require('node:vm');
const C = require('../assets/js/contact-core.js'), P = require('../assets/js/pricing.js');
const sandbox = { window: {} }; vm.runInNewContext(fs.readFileSync(require.resolve('../assets/js/config.js'), 'utf8'), sandbox);
const cfg = sandbox.window.VDG_CONFIG;
const data = { name: 'José & María', email: 'qa@example.com', phone: '+52 55 0000 0000', company: 'Equipo > prueba', service: 'web', channel: 'WhatsApp', message: 'Necesitamos un catálogo, con filtros y botón de contacto.', consent: true };
test('usa exactamente los canales extraídos del proyecto original', () => {
  assert.equal(cfg.email, 'victor.castro@grupovdg.com'); assert.equal(cfg.phone, '+525659865944'); assert.equal(cfg.whatsapp, '525659865944');
  const l = C.links(data, 'VD-TEST1234', 'SOL-TEST1234', cfg);
  assert.equal(l.call, 'tel:+525659865944'); assert.equal(new URL(l.whatsapp).pathname, '/525659865944');
  assert.ok(l.email.startsWith('mailto:victor.castro@grupovdg.com?'));
});
test('mensaje completo, referencia y acentos sobreviven a la codificación', () => {
  const l = C.links(data, 'VD-TEST1234', 'SOL-TEST1234', cfg);
  const w = new URL(l.whatsapp).searchParams.get('text'), m = new URL(l.email).searchParams.get('body');
  assert.equal(w, l.text); assert.equal(m, l.text); assert.match(w, /José & María/); assert.match(w, /VD-TEST1234/); assert.match(w, /catálogo/);
});
test('el borrador adjunto calcula con el motor existente sin guardar datos de contacto', () => {
  const state = { ...P.defaults('web'), design: 'standard', services: ['hosting'] };
  const storage = { getItem: () => JSON.stringify({ version: 1, state, ref: 'VD-20261024-ABCDEFGH' }) };
  const d = C.readDraft(storage, P); assert.equal(d.result.total, 16000); assert.equal(d.result.monthlyTotal, 350); assert.match(d.text, /\$16,000/); assert.doesNotMatch(d.text, /qa@example/);
});
test('un borrador corrupto no impide abrir contacto', () => {
  assert.equal(C.readDraft({ getItem: () => '{invalid' }, P), null);
  assert.equal(C.readDraft({ getItem: () => { throw Error('blocked'); } }, P), null);
});
test('vCard contiene datos válidos y termina con CRLF', () => {
  const v = C.vcard(cfg); assert.match(v, /BEGIN:VCARD\r\nVERSION:3.0/); assert.match(v, /TEL;TYPE=WORK,VOICE:\+525659865944/); assert.match(v, /END:VCARD\r\n$/);
});
test('una configuración vacía o con inyección de cabeceras no genera correo', () => {
  assert.equal(C.links(data, '', 'SOL-TEST1234', { email: 'bad@example.com\r\nBcc:x@example.com', phone: '', whatsapp: '' }).email, '');
  assert.equal(C.links(data, '', 'SOL-TEST1234', { email: '', phone: '', whatsapp: '' }).call, '');
});
