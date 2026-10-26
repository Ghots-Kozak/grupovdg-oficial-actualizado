/* Funciones puras para mensajes, enlaces y alcance; no envían solicitudes. */
(function (root) {
  'use strict';
  var services = { web: 'Página web', mobile: 'Aplicación móvil', system: 'Sistema personalizado', ai: 'IA y automatización', advice: 'Necesito orientación', other: 'Otro proyecto' };
  function email(v) { return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && !/[\r\n]/.test(v); }
  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  function clean(v, max) { return String(v || '').replace(/\r/g, '').trim().slice(0, max || 4000); }
  function normalize(raw) {
    raw = raw || {};
    return { name: clean(raw.name, 100), email: clean(raw.email, 160), phone: clean(raw.phone, 25), company: clean(raw.company, 120), service: Object.prototype.hasOwnProperty.call(services, raw.service) ? raw.service : 'advice', reason: clean(raw.reason, 100) || 'Nuevo proyecto', channel: ['Correo', 'WhatsApp', 'Llamada'].indexOf(raw.channel) >= 0 ? raw.channel : 'Correo', message: clean(raw.message, 4000), contactTime: clean(raw.contactTime, 60), website: clean(raw.website, 200), consent: raw.consent === true };
  }
  function text(raw, estimate, reference) {
    var d = normalize(raw);
    return ['Hola, equipo de Grupo VDG.', 'Me gustaría revisar un proyecto.', 'Referencia: ' + reference, '', 'Nombre: ' + d.name, 'Correo: ' + d.email, 'Teléfono: ' + (d.phone || 'No proporcionado'), 'Empresa: ' + (d.company || 'No proporcionada'), 'Servicio: ' + services[d.service], 'Motivo: ' + d.reason, 'Contacto preferido: ' + d.channel, d.contactTime ? 'Horario preferido: ' + d.contactTime : '', 'Descripción:', d.message, estimate ? '\nESTIMACIÓN DEL PROYECTO\n' + estimate : ''].filter(function (v) { return v !== ''; }).join('\n');
  }
  function links(raw, estimate, reference, config) {
    var d = normalize(raw), body = text(d, estimate, reference), phone = digits(config.phone), wa = digits(config.whatsapp), subject = 'Proyecto ' + reference + ' · ' + services[d.service] + (d.company ? ' · ' + d.company : '');
    return { email: email(config.email) ? 'mailto:' + config.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) : '', whatsapp: wa.length >= 10 && wa.length <= 15 ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent(body) : '', call: phone.length >= 10 && phone.length <= 15 ? 'tel:+' + phone : '', text: body, subject: subject };
  }
  function escapeVCard(v) { return String(v || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\r/g, ''); }
  function vcard(c) { return ['BEGIN:VCARD', 'VERSION:3.0', 'FN:' + escapeVCard(c.name), 'ORG:' + escapeVCard(c.name), 'TEL;TYPE=WORK,VOICE:' + escapeVCard(c.phone), 'EMAIL;TYPE=WORK:' + escapeVCard(c.email), 'NOTE:Contacto comercial de ' + escapeVCard(c.name), 'END:VCARD', ''].join('\r\n'); }
  function draft(storage, pricing) {
    try {
      var raw = JSON.parse(storage.getItem('VDG.project.v1') || 'null');
      if (!raw || raw.version !== 1 || !raw.state || typeof raw.state !== 'object') return null;
      var s = pricing.normalize(raw.state), r = pricing.calculate(s), reference = /^VD-[A-Z0-9-]{8,45}$/.test(raw.ref) ? raw.ref : 'Estimación sin referencia', t = pricing.TYPES[s.type], money = pricing.money;
      var lines = [reference, t.label + ' · ' + t.subtypes[s.subtype].label, 'Plataforma: ' + (t.platforms.find(function (p) { return p[0] === s.platform; }) || ['', 'Por definir'])[1], 'Diseño: ' + pricing.DESIGNS[s.design].label, 'Alcance: ' + s.screens + ' pantallas, ' + s.roles + ' perfiles y ' + s.integrations + ' integraciones.'];
      var features = r.included.concat(s.features.map(function (k) { return pricing.FEATURES[k].label; })); if (features.length) lines.push('Funciones: ' + features.join(', '));
      lines.push(r.estimate ? 'Estimación inicial: ' + money(r.total) + ' MXN' : 'Importe: requiere orientación personalizada', 'Servicios: ' + money(r.monthlyTotal) + ' MXN/mes y ' + money(r.yearlyTotal) + ' MXN/año.', 'Tarifas propuestas; impuestos y terceros por definir. No es una oferta formal.');
      return { state: s, result: r, reference: reference, text: lines.join('\n') };
    } catch (e) { return null; }
  }
  var api = { services: services, validEmail: email, digits: digits, normalize: normalize, text: text, links: links, vcard: vcard, readDraft: draft };
  root.VDG_CONTACT_CORE = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis));
