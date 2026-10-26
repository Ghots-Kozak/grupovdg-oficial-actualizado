(function () {
  'use strict';
  var U = window.VDG_UI, I = U.I, E = U.esc, C = window.VDG_CONTACT_CORE, cfg = window.VDG_CONFIG, payloads = new WeakMap(), attachedDraft = null;
  function currentDraft() { try { return C.readDraft(localStorage, window.VDG_PRICING); } catch (e) { return null; } }
  function collect(form) { var fd = new FormData(form), raw = {};['name', 'email', 'phone', 'company', 'reason', 'channel', 'message', 'service', 'contactTime', 'website'].forEach(function (k) { raw[k] = fd.get(k); }); raw.consent = fd.get('consent') === 'on'; return C.normalize(raw); }
  function validate(form, d) {
    var f = form.elements; Array.from(form.querySelectorAll('input,select,textarea')).forEach(function (x) { x.setCustomValidity(''); });
    f.name.setCustomValidity(d.name.length >= 2 ? '' : 'Escribe tu nombre con al menos dos caracteres.');
    f.email.setCustomValidity(C.validEmail(d.email) ? '' : 'Escribe un correo electrónico válido.');
    f.message.setCustomValidity(d.message.length >= 15 ? '' : 'Describe tu idea en una frase de al menos 15 caracteres.');
    var n = C.digits(d.phone); if (d.phone && (n.length < 10 || n.length > 15)) f.phone.setCustomValidity('Usa entre 10 y 15 dígitos en el teléfono.');
    if (d.channel !== 'Correo' && !d.phone) f.phone.setCustomValidity('Agrega el teléfono para indicar WhatsApp o llamada como contacto preferido.');
    return !d.website && form.reportValidity();
  }
  function action(label, icon, url, kind, primary) { return !url ? '' : '<a class="button ' + (primary ? '' : 'secondary ') + 'small" href="' + E(url) + '" data-send-link="' + kind + '" ' + (kind === 'whatsapp' ? 'target="_blank" rel="noopener noreferrer"' : '') + '>' + I(icon) + label + '</a>'; }
  function prepare(form, target, estimate) {
    var d = collect(form); if (!validate(form, d)) return;
    estimate = estimate || (form.id === 'contact-form' && attachedDraft ? attachedDraft.text : '');
    var found = estimate && (estimate.match(/VD-[A-Z0-9-]{8,45}/) || [])[0], reference = found || 'SOL-' + Date.now().toString(36).toUpperCase(), p = C.links(d, estimate, reference, cfg);
    payloads.set(target, { data: d, estimate: estimate, reference: reference, text: p.text, form: form });
    var prefer = d.channel === 'WhatsApp' ? 'whatsapp' : d.channel === 'Llamada' ? 'call' : 'email', choices = [['email', 'Abrir correo', 'mail'], ['whatsapp', 'Continuar en WhatsApp', 'chat'], ['call', 'Llamar ahora', 'call']];
    choices.sort(function (a, b) { return a[0] === prefer ? -1 : b[0] === prefer ? 1 : 0; });
    target.innerHTML = '<div class="request-review"><div class="request-review-top"><div>' + U.eyebrow('Lista para revisar') + '<h3>Tu mensaje, bien preparado.</h3></div><span class="request-reference">' + E(reference) + '</span></div><p class="note">Elige el canal y envía desde tu aplicación. El mensaje todavía no se ha enviado.</p><details class="request-disclosure"><summary>Revisar el mensaje completo ' + I('chevron') + '</summary><pre class="request-preview">' + E(p.text) + '</pre></details><div class="export-actions request-delivery">' + choices.map(function (a) { return action(a[1], a[2], p[a[0]], a[0], a[0] === prefer); }).join('') + (cfg.contactEndpoint ? '<button type="button" class="button small" data-send-channel="backend">' + I('send') + 'Enviar desde el sitio</button>' : '') + '</div><div class="request-tools"><button type="button" data-send-channel="copy">' + I('copy') + 'Copiar mensaje</button><button type="button" data-send-channel="download">' + I('download') + 'Guardar TXT</button><button type="button" data-send-channel="edit">' + I('sliders') + 'Editar datos</button></div><div class="send-status" role="status"></div></div>';
    target.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }
  function status(target, text, cls) { var el = target.querySelector('.send-status'); if (el) el.innerHTML = '<div class="inline-notice ' + (cls || '') + '">' + I('info') + '<p>' + E(text) + '</p></div>'; }
  async function send(target, channel, button) {
    var p = payloads.get(target); if (!p) return;
    if (channel === 'copy') { window.VDG_APP.copy(p.text); return; }
    if (channel === 'download') { window.VDG_APP.download(p.reference + '-solicitud.txt', p.text, 'text/plain;charset=utf-8'); status(target, 'Solicitud preparada para descargar. Puedes conservarla o compartirla por el canal que prefieras.'); return; }
    if (channel === 'edit') { p.form.elements.name.focus(); p.form.scrollIntoView({ behavior: 'auto', block: 'start' }); return; }
    if (channel !== 'backend') return; button.disabled = true; button.textContent = 'Enviando…';
    try {
      var url = new URL(cfg.contactEndpoint, location.href); if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) throw new Error('No se pudo abrir el canal de envío. Usa correo o WhatsApp.');
      var controller = new AbortController(), timer = setTimeout(function () { controller.abort(); }, 15000), response;
      try { response = await fetch(url.href, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({}, p.data, { reference: p.reference, estimate: p.estimate })), signal: controller.signal, credentials: 'same-origin' }); } finally { clearTimeout(timer); }
      var data = await response.json(); if (!response.ok || data.ok !== true) throw new Error(data.message || 'No se pudo confirmar el envío. Usa correo o WhatsApp.');
      status(target, 'El servicio de correo aceptó la solicitud ' + p.reference + ' para envío. No confirma la entrega final ni su lectura.', 'success');
    } catch (error) { status(target, error.name === 'AbortError' ? 'No se confirmó el envío a tiempo. Conserva tu mensaje y vuelve a intentar.' : error.message, 'error'); }
    finally { button.disabled = false; button.innerHTML = I('send') + 'Enviar desde el sitio'; }
  }
  function serviceHint(form) {
    if (!form || !form.elements.service) return;
    var service = form.elements.service.value, hints = { web: '¿Quieres presentar tu marca, recibir consultas o vender por internet?', mobile: '¿Quién usará la app y qué tarea debería hacer desde su celular?', system: '¿Qué proceso organizas hoy en hojas de cálculo o herramientas separadas?', ai: '¿Qué tarea repetitiva quieres simplificar y con qué información cuentas?', advice: 'Cuéntanos qué problema quieres resolver, aunque todavía no sepas qué solución necesitas.', other: 'Describe qué necesitas y para quién será útil.' };
    var hint = document.getElementById('contact-context-hint'); if (hint) hint.textContent = hints[service] || hints.advice;
    form.elements.message.placeholder = hints[service] || hints.advice;
    document.querySelectorAll('[data-contact-service]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.contactService === service)); });
  }
  function invalidate(form) { if (!form) return; var result = document.getElementById(form.id === 'contact-form' ? 'contact-result' : 'quote-contact-result'); if (result && payloads.has(result)) { result.innerHTML = ''; payloads.delete(result); } }
  function init() {
    var form = document.getElementById('contact-form');
    if (form) { var params = new URLSearchParams(location.search), type = params.get('servicio') || params.get('service') || params.get('tipo'); type = { software: 'system', consultoria: 'advice', ia: 'ai', otro: 'other' }[type] || type; if (form.elements.service && Object.prototype.hasOwnProperty.call(C.services, type)) form.elements.service.value = type; serviceHint(form); var draft = currentDraft(), attach = document.getElementById('attach-estimate'); if (attach) { attach.disabled = !draft; attach.textContent = draft ? 'Adjuntar mi estimación ' + draft.reference : 'Primero crea una estimación en el cotizador'; } }
    document.addEventListener('input', function (event) { var f = event.target.form; if (!f || !/^(contact-form|quote-contact-form)$/.test(f.id)) return; if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity(''); var result = document.getElementById(f.id === 'contact-form' ? 'contact-result' : 'quote-contact-result'); if (result && payloads.has(result)) { result.innerHTML = ''; payloads.delete(result); } });
    document.addEventListener('change', function (event) { if (event.target.form && /^(contact-form|quote-contact-form)$/.test(event.target.form.id)) { invalidate(event.target.form); if (event.target.name === 'service') serviceHint(event.target.form); } });
    document.addEventListener('submit', function (event) { if (event.target.id === 'contact-form') { event.preventDefault(); prepare(event.target, document.getElementById('contact-result'), ''); } });
    document.addEventListener('click', function (event) {
      var b = event.target.closest('[data-send-channel]'); if (b) { var target = b.closest('#contact-result,#quote-contact-result'); if (target) send(target, b.dataset.sendChannel, b); }
      var link = event.target.closest('[data-send-link]'); if (link) { var box = link.closest('#contact-result,#quote-contact-result'); if (box) status(box, link.dataset.sendLink === 'call' ? 'Se solicitó iniciar una llamada. Su apertura depende de tu dispositivo.' : link.dataset.sendLink === 'email' ? 'Se solicitó abrir tu aplicación de correo. Revisa y envía el mensaje allí.' : 'Se abrirá WhatsApp con tu mensaje. Revisa el contenido antes de enviarlo.'); }
      b = event.target.closest('[data-copy-contact]'); if (b) window.VDG_APP.copy(b.dataset.copyContact === 'phone' ? cfg.phone : cfg.email);
      if (event.target.closest('[data-save-vcard]')) window.VDG_APP.download('Grupo-VDG-contacto.vcf', C.vcard(cfg), 'text/vcard;charset=utf-8');
      b = event.target.closest('[data-contact-service]'); if (b && form) { form.elements.service.value = b.dataset.contactService; form.elements.service.dispatchEvent(new Event('change', { bubbles: true })); form.elements.message.focus({ preventScroll: true }); }
      if (event.target.closest('#attach-estimate') && form) { invalidate(form); attachedDraft = currentDraft(); var summary = document.getElementById('attached-estimate'); if (summary && attachedDraft) { summary.hidden = false; summary.querySelector('[data-draft-text]').textContent = attachedDraft.text; var input = form.elements.service; if (input && C.services[attachedDraft.state.type]) input.value = attachedDraft.state.type; serviceHint(form); document.getElementById('attach-estimate').hidden = true; window.VDG_APP.toast('Estimación añadida al mensaje.'); } }
      if (event.target.closest('[data-remove-estimate]')) { invalidate(form); attachedDraft = null; document.getElementById('attached-estimate').hidden = true; document.getElementById('attach-estimate').hidden = false; }
      b = event.target.closest('[data-channel-guide]'); if (b) { var id = b.dataset.channelGuide; document.querySelectorAll('[data-channel-guide]').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); x.tabIndex = x === b ? 0 : -1; }); document.querySelectorAll('[data-guide-panel]').forEach(function (x) { x.hidden = x.dataset.guidePanel !== id; }); }
    });
    var tabs = document.getElementById('channel-guide-tabs'); if (tabs) tabs.addEventListener('keydown', function (event) { if (!/^(ArrowLeft|ArrowRight|Home|End)$/.test(event.key)) return; event.preventDefault(); var list = Array.from(tabs.querySelectorAll('button')), i = list.indexOf(document.activeElement); i = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : (i + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length; list[i].click(); list[i].focus(); });
  }
  window.VDG_CONTACT = { init: init, prepare: prepare, currentDraft: currentDraft };
}());
