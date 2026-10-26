(function () {
  'use strict';
  var P = window.VDG_PRICING, U = window.VDG_UI, I = U.I, E = U.esc, M = P.money;
  var key = 'VDG.project.v1', state, step = 1, ref, created, storageOK = true, result;
  var names = ['Proyecto', 'Detalles', 'Diseño', 'Funciones', 'Alcance', 'Servicios', 'Resumen'];
  function newRef() { return 'VD-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + (window.crypto && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10)).toUpperCase(); }
  function save() {
    try { localStorage.setItem(key, JSON.stringify({ version: 1, state: state, step: step, ref: ref, created: created })); storageOK = true; }
    catch (e) { storageOK = false; }
    var el = document.getElementById('save-status');
    if (el) el.innerHTML = I(storageOK ? 'check' : 'info') + (storageOK ? 'Alcance guardado en este navegador. Los datos de contacto no se guardan.' : 'Tu navegador no permite guardar el borrador. Descarga el resumen para conservarlo.');
  }
  function restore() {
    state = P.defaults('web'); ref = newRef(); created = new Date().toISOString();
    try {
      var data = JSON.parse(localStorage.getItem(key) || 'null');
      if (data && data.version === 1 && data.state && typeof data.state === 'object') {
        state = P.normalize(data.state); step = Math.min(7, Math.max(1, Math.floor(Number(data.step) || 1)));
        if (/^VD-[A-Z0-9-]{8,45}$/.test(data.ref)) ref = data.ref;
        if (!Number.isNaN(Date.parse(data.created))) created = new Date(data.created).toISOString();
      }
    } catch (e) { storageOK = false; }
    var type = new URLSearchParams(location.search).get('tipo');
    if (P.TYPES[type] && type !== state.type) { state = P.defaults(type); step = 2; ref = newRef(); created = new Date().toISOString(); }
    state = P.normalize(state);
  }
  function choice(group, value, title, description, icon, selected, extra) {
    return '<button type="button" class="choice ' + (selected ? 'selected ' : '') + '" data-choice="' + group + '" data-value="' + E(value) + '" aria-pressed="' + (selected ? 'true' : 'false') + '">' + (icon ? I(icon) : '') + '<span><strong>' + E(title) + '</strong>' + (description ? '<small>' + E(description) + '</small>' : '') + (extra ? '<span class="choice-price">' + extra + '</span>' : '') + '</span></button>';
  }
  function labelFor(group, value) {
    if (group === 'platform') return (P.TYPES[state.type].platforms.find(function (a) { return a[0] === value; }) || ['', 'Por definir'])[1];
    var lists = { deadline: { flexible: 'Flexible, priorizar calidad', standard: 'Objetivo de 2 a 3 meses', priority: 'Prioritario, por evaluar' }, scope: { mvp: 'Primera versión (MVP)', full: 'Producto completo' }, assets: { none: 'Aún sin materiales', brand: 'Ya tengo marca y contenido', ready: 'Tengo diseño de referencia' } };
    return lists[group] && lists[group][value] || value;
  }
  function choices(group, items, icon) { return '<div class="choice-grid">' + items.map(function (a) { return choice(group, a[0], a[1], a[2] || '', a[3] || icon, state[group] === a[0], a[4]); }).join('') + '</div>'; }
  function notice(text, cls) { return '<div class="inline-notice ' + (cls || '') + '">' + I('info') + '<p>' + text + '</p></div>'; }
  function typeStep() {
    return '<h2>¿Qué te gustaría construir?</h2><p class="step-description">Elige el punto de partida. Después afinamos sus funciones.</p><div class="choice-grid">' + Object.keys(P.TYPES).map(function (k) { var t = P.TYPES[k]; return choice('type', k, t.label, t.desc, t.icon, k === state.type); }).join('') + '</div>';
  }
  function detailsStep() {
    var t = P.TYPES[state.type];
    return '<h2>Démosle un poco más de forma.</h2><p class="step-description">Selecciona el tipo de solución y dónde la necesitas.</p><div class="field-group"><h3>¿Cuál se parece más a tu idea?</h3>' + choices('subtype', Object.keys(t.subtypes).map(function (k) { return [k, t.subtypes[k].label, '', t.icon]; })) + '</div><div class="field-group"><h3>¿Dónde debe funcionar?</h3>' + choices('platform', t.platforms, 'layers') + '</div>' + (state.type === 'web' ? notice('Una web responsive ya se adapta a computadora, tableta y celular. Una app móvil independiente o una PWA con capacidades instalables requiere trabajo adicional.') : state.type === 'ai' ? notice('El desarrollo de una integración no incluye el consumo de modelos, APIs ni licencias. La información disponible y la supervisión humana se revisan antes de definir el alcance.') : '') + '<div class="field-group form-grid"><div class="field"><label for="industry">¿En qué contexto se usará?</label><select id="industry" data-field="industry">' + [['general', 'Por definir'], ['services', 'Servicios profesionales'], ['commerce', 'Comercio'], ['education', 'Educación'], ['logistics', 'Logística'], ['internal', 'Operación interna'], ['other', 'Otro sector']].map(function (a) { return '<option value="' + a[0] + '" ' + (state.industry === a[0] ? 'selected' : '') + '>' + a[1] + '</option>'; }).join('') + '</select></div></div>';
  }
  function designStep() {
    return '<h2>¿Cómo debería sentirse?</h2><p class="step-description">Elige el nivel de personalización. Todos contemplan claridad visual y uso en pantallas compatibles.</p><div class="choice-grid">' + Object.keys(P.DESIGNS).map(function (k, i) { var d = P.DESIGNS[k]; return choice('design', k, d.label, d.desc, ['grid', 'spark', 'bolt', 'sliders'][i], state.design === k, d.hours ? '+' + M(d.hours * P.RATE) + ' de referencia' : 'Incluido en la base'); }).join('') + '</div><div class="field-group"><h3>¿Con qué materiales cuentas?</h3>' + choices('assets', [['none', 'Aún sin materiales', 'Necesito definir contenido e identidad.', 'compass'], ['brand', 'Tengo marca y contenido', 'Logo, colores y textos disponibles.', 'document'], ['ready', 'Tengo un diseño', 'Referencia o pantallas para evaluar.', 'monitor']]) + '<p class="note">Los materiales ayudan a definir el trabajo. No reducen automáticamente el precio sin revisar su calidad y utilidad.</p></div>';
  }
  function featuresStep() {
    var included = P.TYPES[state.type].subtypes[state.subtype].included;
    if (state.type === 'advice') return '<h2>Primero, definamos la necesidad.</h2><p class="step-description">No necesitas elegir funciones técnicas todavía. Continúa para describir el objetivo y preparar una solicitud de orientación.</p>' + notice('Para proyectos sin alcance definido se requiere una revisión personalizada. No mostraremos un precio cerrado.');
    return '<h2>Las funciones que sí necesitas.</h2><p class="step-description">Selecciona varias. Las funciones incluidas en tu base no se vuelven a cobrar. Las dependencias necesarias se agregan de forma visible.</p><div class="choice-grid compact">' + Object.keys(P.FEATURES).filter(function (k) { return P.FEATURES[k].types.indexOf(state.type) >= 0; }).map(function (k) {
      var f = P.FEATURES[k], inc = included.indexOf(k) >= 0, active = state.features.indexOf(k) >= 0, blocked = k === 'offline' && state.type === 'web' && state.platform === 'responsive';
      return '<button type="button" class="choice ' + (inc ? 'included' : active ? 'selected' : '') + '" data-feature="' + k + '" ' + ((inc || blocked) ? 'disabled' : '') + ' aria-pressed="' + (inc || active ? 'true' : 'false') + '">' + I(f.icon) + '<span><strong>' + E(f.label) + '</strong><small>' + (inc ? 'Incluido en la base' : blocked ? 'Elige PWA en el paso Detalles' : f.requires ? 'Requiere: ' + f.requires.map(function (d) { return E(P.FEATURES[d].label); }).join(', ') : 'Adicional al desarrollo base') + '</small><span class="choice-price">' + (inc ? 'Sin costo duplicado' : blocked ? 'No disponible para web básica' : '+' + M(f.hours * P.RATE)) + '</span></span></button>';
    }).join('') + '</div>' + notice('Cada API seleccionada incluye una integración. El contador del paso Alcance solo agrega integraciones que aún no estén contempladas.');
  }
  function rangeField(id, label, value, min, max, desc) {
    return '<div class="field wide"><div class="range-top"><label for="' + id + '">' + label + '</label><output class="range-value" for="' + id + '" id="' + id + '-value">' + value + '</output></div><input type="range" id="' + id + '" data-field="' + id + '" min="' + min + '" max="' + max + '" value="' + value + '"><div class="range-labels"><span>' + min + '</span><span>' + max + '</span></div><small>' + desc + '</small></div>';
  }
  function scopeStep() {
    return '<h2>Delimitemos la primera entrega.</h2><p class="step-description">Estos datos ajustan el esfuerzo. El plazo solicitado necesita confirmación técnica.</p><div class="form-grid">' + rangeField('screens', 'Pantallas o páginas aproximadas', state.screens, 1, 80, 'La base incluye ' + P.TYPES[state.type].subtypes[state.subtype].screens + ' pantallas/páginas. Las secciones internas no se cuentan como páginas independientes.') + rangeField('roles', 'Tipos de usuario', state.roles, 1, 12, 'Por ejemplo: visitante, cliente, operador o administrador. Varios roles requieren cuentas y permisos.') + rangeField('integrations', 'Cantidad total de APIs externas', state.integrations, 0, 10, 'No contamos dos veces una API ya seleccionada. Pasarelas, mapas y funciones incluidas se desglosan de forma independiente.') + '</div><div class="field-group"><h3>¿Qué quieres construir primero?</h3>' + choices('scope', [['mvp', 'Primera versión', 'Resolver lo esencial y evaluar después.', 'rocket'], ['full', 'Producto completo', 'Un alcance más amplio desde la primera entrega.', 'layers']]) + '</div><div class="field-group"><h3>¿Cuándo te gustaría tenerlo?</h3>' + choices('deadline', [['flexible', 'Tengo flexibilidad', 'Podemos definir un calendario realista.', 'calendar'], ['standard', 'En 2 a 3 meses', 'Es un objetivo, sujeto a alcance y disponibilidad.', 'clock'], ['priority', 'Lo necesito pronto', 'Requiere evaluar viabilidad y prioridad.', 'bolt']]) + '</div><div class="field-group field"><label for="notes">¿Qué tarea o problema quieres resolver? <span class="note">(opcional)</span></label><textarea id="notes" data-field="notes" maxlength="2000" placeholder="Describe el objetivo sin incluir datos personales ni contraseñas.">' + E(state.notes) + '</textarea><small>Esta descripción forma parte del borrador que se guarda en este dispositivo.</small></div>';
  }
  function servicesStep() {
    return '<h2>¿Qué necesitarás para operar?</h2><p class="step-description">Servicios opcionales. Los costos mensuales y anuales se separan del desarrollo.</p><div class="choice-grid">' + Object.keys(P.SERVICES).map(function (k) {
      var f = P.SERVICES[k], active = state.services.indexOf(k) >= 0, icons = { hosting: 'cloud', maintenance: 'settings', domain: 'globe', monitoring: 'eye', backup: 'database', training: 'users' };
      return '<button type="button" class="choice ' + (active ? 'selected' : '') + '" data-service="' + k + '" aria-pressed="' + (active ? 'true' : 'false') + '">' + I(icons[k]) + '<span><strong>' + E(f.label) + '</strong><small>' + ({ 'month': 'Servicio mensual propuesto', 'year': 'Renovación anual propuesta', 'once': 'Pago único propuesto' }[f.period]) + '</small><span class="choice-price">' + M(f.amount) + (f.period === 'month' ? ' / mes' : f.period === 'year' ? ' / año' : '') + '</span></span></button>';
    }).join('') + '</div><div class="field-group field"><label for="budget">Presupuesto orientativo <span class="note">(no modifica el cálculo)</span></label><select id="budget" data-field="budget">' + [['undecided', 'Aún no lo he definido'], ['under15', 'Menos de $15,000 MXN'], ['15to40', '$15,000 a $40,000 MXN'], ['40to100', '$40,000 a $100,000 MXN'], ['100plus', 'Más de $100,000 MXN']].map(function (a) { return '<option value="' + a[0] + '" ' + (state.budget === a[0] ? 'selected' : '') + '>' + a[1] + '</option>'; }).join('') + '</select></div>' + notice('Estos importes son propuestas editables. La cotización final debe confirmar proveedor, cobertura, impuestos, licencias y consumo. No hay una promoción activa.');
  }
  function reviewRow(label, text, index) { return '<div class="review-row"><div><small>' + label + '</small>' + E(text) + '</div><button type="button" data-goto="' + index + '">Cambiar ' + I('diagonal') + '</button></div>'; }
  function reviewStep() {
    var r = result, t = P.TYPES[state.type], sub = t.subtypes[state.subtype], all = r.included.concat(state.features.map(function (k) { return P.FEATURES[k].label; }));
    return '<h2>Así toma forma tu proyecto.</h2><p class="step-description">Revisa tus decisiones, descarga el resumen o prepara tu solicitud.</p><div class="quote-ref">' + E(ref) + '</div><div class="quote-review-list">' + reviewRow('Tipo y objetivo', t.label + ' · ' + sub.label, 1) + reviewRow('Plataforma', labelFor('platform', state.platform), 2) + reviewRow('Diseño y materiales', P.DESIGNS[state.design].label + ' · ' + labelFor('assets', state.assets), 3) + reviewRow('Funciones', all.length ? all.join(', ') : 'Por definir', 4) + reviewRow('Alcance', state.screens + ' pantallas / ' + state.roles + ' roles / ' + state.integrations + ' APIs', 5) + reviewRow('Plan', labelFor('scope', state.scope) + ' · ' + labelFor('deadline', state.deadline), 5) + reviewRow('Servicios opcionales', state.services.length ? state.services.map(function (k) { return P.SERVICES[k].label; }).join(', ') : 'Sin servicios adicionales', 6) + '</div><h3 style="margin-top:30px;font-size:21px">Desglose de la estimación</h3><div class="breakdown">' + r.rows.map(function (row) { return '<div class="breakdown-row"><span>' + E(row.label) + ' <small>(' + row.hours + ' h)</small></span><b>' + M(row.amount) + '</b></div>'; }).join('') + (r.estimate ? '<div class="breakdown-row"><span>Descuento (sin promoción activa)</span><b>' + M(0) + '</b></div><div class="breakdown-row total"><span>Desarrollo y pagos únicos</span><b>' + M(r.total) + ' MXN</b></div><div class="breakdown-row"><span>Rango preliminar del desarrollo</span><b>' + M(r.low) + ' – ' + M(r.high) + '</b></div>' : '<div class="breakdown-row total"><span>Evaluación personalizada</span><b>Por definir</b></div>') + '<div class="breakdown-row"><span>Servicios mensuales</span><b>' + M(r.monthlyTotal) + ' / mes</b></div><div class="breakdown-row"><span>Servicios anuales</span><b>' + M(r.yearlyTotal) + ' / año</b></div></div>' + notice((r.review ? 'Este alcance necesita una evaluación personalizada. ' : '') + 'Estimación preliminar con tarifas propuestas; impuestos por definir. No incluye consumos de IA/APIs, comisiones, licencias, cuentas de tiendas ni gastos de terceros. No es una propuesta formal.' + (r.estimate ? ' La referencia de planeación es ' + r.weeks[0] + '–' + r.weeks[1] + ' semanas, sujeta a revisión.' : ' El plazo se definirá durante la asesoría.')) + '<div class="export-actions no-print"><button type="button" class="button secondary" data-export="txt">' + I('download') + 'Descargar resumen</button><button type="button" class="button secondary" data-export="json">' + I('code') + 'Exportar JSON</button><button type="button" class="button secondary" data-export="copy">' + I('copy') + 'Copiar</button><button type="button" class="button secondary" data-export="print">' + I('print') + 'Imprimir / PDF</button></div><div class="print-only"><p>Grupo VDG · ' + E(window.VDG_CONFIG.domain) + '<br>' + E(new Date(created).toLocaleDateString('es-MX')) + ' · Referencia ' + E(ref) + '</p></div><div class="quote-request-form no-print"><div class="form-heading">' + I('send') + '<h3>Solicita la revisión de tu proyecto.</h3></div><p class="note" style="margin-bottom:24px">Prepara un mensaje con tu estimación y elige un canal disponible. Tu información de contacto no se guarda en el borrador.</p><form id="quote-contact-form" method="post" action="#configurador" novalidate>' + window.VDG_FORM_FIELDS('quote') + '<div class="actions" style="margin-top:23px"><button class="button full" type="submit">Preparar solicitud ' + I('arrow') + '</button></div><div id="quote-contact-result" aria-live="polite"></div></form></div>';
  }
  function updateSummary() {
    result = P.calculate(state);
    var r = result, t = P.TYPES[state.type], sub = t.subtypes[state.subtype], el = document.getElementById('quote-summary');
    if (!el) return;
    el.innerHTML = U.eyebrow('Tu proyecto, en tiempo real') + '<div class="summary-type">' + E(t.label) + '</div><div class="summary-subtype">' + E(sub.label) + '</div><div class="estimate-value" id="estimate-value">' + (r.estimate ? M(r.total) : 'A tu medida') + '</div><div class="estimate-range">' + (r.estimate ? 'MXN · rango ' + M(r.low) + ' – ' + M(r.high) : 'Requiere orientación personalizada') + '</div><hr class="summary-divider"><div class="summary-lines"><div class="summary-line"><span>Diseño</span><b>' + E(P.DESIGNS[state.design].label.split(' ')[0]) + '</b></div><div class="summary-line"><span>Funciones adicionales</span><b>' + state.features.length + '</b></div><div class="summary-line"><span>Pantallas / páginas</span><b>' + state.screens + '</b></div><div class="summary-line"><span>Descuento activo</span><b>' + M(0) + '</b></div></div><div class="summary-recurring"><div>Servicios mensuales <b>' + M(r.monthlyTotal) + '</b></div><div>Servicios anuales <b>' + M(r.yearlyTotal) + '</b></div></div>' + (r.included.length ? '<div class="summary-features">' + r.included.map(function (f) { return '<span>' + I('check') + ' ' + E(f) + '</span>'; }).join('') + '</div>' : '') + '<p class="summary-note">' + (r.review ? 'Revisión personalizada necesaria. ' : '') + 'Estimación orientativa con tarifas propuestas. Impuestos y servicios externos por definir. No es un precio final.</p><button class="reset-quote" type="button" data-reset>' + I('refresh') + 'Reiniciar y borrar el borrador</button>';
  }
  function render(scroll) {
    state = P.normalize(state); save(); updateSummary();
    var renderStep = [typeStep, detailsStep, designStep, featuresStep, scopeStep, servicesStep, reviewStep][step - 1];
    var wizard = document.getElementById('wizard');
    wizard.innerHTML = '<div class="wizard-progress"><span>PASO ' + step + ' DE 7</span><b>' + names[step - 1] + '</b></div><div class="progress-track" role="progressbar" aria-label="Progreso del cotizador" aria-valuemin="0" aria-valuemax="7" aria-valuenow="' + step + '"><div class="progress-fill" style="--progress:' + (step / 7) + '"></div></div><nav class="step-nav" aria-label="Pasos del cotizador">' + names.map(function (n, i) { return '<button type="button" data-goto="' + (i + 1) + '" ' + (step === i + 1 ? 'aria-current="step"' : '') + ' class="' + (step > i + 1 ? 'completed' : '') + '">' + (i + 1) + '. ' + n + '</button>'; }).join('') + '</nav><div class="step-panel">' + renderStep() + '</div><div class="wizard-controls no-print">' + (step > 1 ? '<button type="button" class="button secondary" data-goto="' + (step - 1) + '">Anterior</button>' : '<span></span>') + (step < 7 ? '<button type="button" class="button" data-goto="' + (step + 1) + '">' + (step === 6 ? 'Ver resumen' : 'Continuar') + I('arrow') + '</button>' : '<a class="text-link" href="contacto.html">Ver contacto ' + I('diagonal') + '</a>') + '</div><div class="save-status no-print" id="save-status"></div>';
    save();
    var msg = document.getElementById('quote-message');
    if (msg && !msg.value) msg.value = state.notes || 'Me gustaría que revisaran el alcance de mi proyecto y la estimación ' + ref + '.';
    var contactService = document.getElementById('quote-service'); if (contactService) contactService.value = state.type;
    if (scroll) { wizard.scrollIntoView({ behavior: 'auto', block: 'start' }); wizard.focus({ preventScroll: true }); }
  }
  function choose(group, value) {
    if (group === 'type') {
      var previous = state;
      state = P.defaults(value); state.design = previous.design; state.services = previous.services; state.notes = previous.notes;
    } else if (group === 'subtype') {
      state.subtype = value; state.screens = P.TYPES[state.type].subtypes[value].screens;
    } else state[group] = value;
    render(false);
    var selected = document.querySelector('[data-choice="' + group + '"][data-value="' + value + '"]'); if (selected) selected.focus({ preventScroll: true });
  }
  function toggleFeature(feature) {
    var index = state.features.indexOf(feature);
    if (index >= 0) {
      state.features.splice(index, 1);
      var removed = [];
      var changing = true; while (changing) { changing = false; state.features = state.features.filter(function (k) { if ((P.FEATURES[k].requires || []).indexOf(feature) >= 0 || P.FEATURES[k].requires && P.FEATURES[k].requires.some(function (d) { return removed.indexOf(d) >= 0; })) { removed.push(k); changing = true; return false; } return true; }); }
      if (removed.length) window.VDG_APP.toast('También se quitaron las funciones que dependían de esta opción.');
    } else {
      state.features.push(feature);
      if (P.FEATURES[feature].requires) window.VDG_APP.toast('Se agregan las dependencias necesarias: ' + P.FEATURES[feature].requires.map(function (k) { return P.FEATURES[k].label; }).join(', ') + '.');
    }
    render(false); var selected = document.querySelector('[data-feature="' + feature + '"]'); if (selected) selected.focus({ preventScroll: true });
  }
  function textSummary() {
    var r = P.calculate(state), t = P.TYPES[state.type];
    var lines = ['GRUPO VDG · ESTIMACIÓN PRELIMINAR', ref, 'Fecha de creación: ' + new Date(created).toLocaleDateString('es-MX'), 'Tarifas propuestas; no aprobadas como oferta comercial.', '', t.label + ' · ' + t.subtypes[state.subtype].label, 'Plataforma: ' + labelFor('platform', state.platform), 'Diseño: ' + P.DESIGNS[state.design].label, 'Pantallas/páginas: ' + state.screens + ' | Roles: ' + state.roles + ' | APIs totales adicionales a funciones específicas: ' + state.integrations, 'Versión: ' + labelFor('scope', state.scope), 'Plazo solicitado: ' + labelFor('deadline', state.deadline), 'Materiales: ' + labelFor('assets', state.assets), 'Contexto: ' + state.industry, 'Presupuesto de referencia: ' + state.budget, '', 'INCLUIDO EN LA BASE', r.included.length ? r.included.join(', ') : 'Según definición de proyecto', '', 'DESGLOSE'];
    r.rows.forEach(function (row) { lines.push(row.label + ' (' + row.hours + ' h): ' + M(row.amount) + ' MXN'); });
    lines.push('', 'Descuento: ' + M(0) + ' (sin promoción activa)', 'Total inicial orientativo: ' + (r.estimate ? M(r.total) + ' MXN' : 'Por definir en asesoría'));
    if (r.estimate) lines.push('Rango orientativo: ' + M(r.low) + ' – ' + M(r.high) + ' MXN', 'Planeación orientativa: ' + r.weeks[0] + '–' + r.weeks[1] + ' semanas; sujeta a revisión.');
    lines.push('Mensual: ' + M(r.monthlyTotal) + ' MXN', 'Anual: ' + M(r.yearlyTotal) + ' MXN', '');
    r.monthly.concat(r.yearly).forEach(function (s) { lines.push(s.label + ': ' + M(s.amount) + ' MXN / ' + (s.period === 'month' ? 'mes' : 'año')); });
    if (state.notes) lines.push('', 'OBJETIVO', state.notes);
    lines.push('', 'CONDICIONES', 'Estimación orientativa. Requiere revisar alcance, integraciones, disponibilidad y materiales. No constituye una propuesta formal ni un contrato.', 'Impuestos por definir. Consumos de APIs/IA, comisiones, licencias, cuentas de tiendas y servicios externos no incluidos.', 'La vigencia comercial se establece únicamente en una propuesta formal. No hay promoción activa.');
    return lines.join('\n');
  }
  function exportData(kind) {
    if (kind === 'print') { window.print(); return; }
    if (kind === 'copy') { window.VDG_APP.copy(textSummary()); return; }
    if (kind === 'json') {
      var r = P.calculate(state);
      window.VDG_APP.download(ref + '.json', JSON.stringify({ schemaVersion: 1, company: 'Grupo VDG', reference: ref, createdAt: created, currency: 'MXN', status: 'preliminary_unapproved_rates', scope: state, estimate: r, conditions: ['Impuestos y terceros por definir', 'No es una propuesta formal', 'Sin promoción activa'] }, null, 2), 'application/json');
    } else window.VDG_APP.download(ref + '.txt', textSummary(), 'text/plain;charset=utf-8');
  }
  function init() {
    if (!document.getElementById('wizard')) return;
    restore(); render(false);
    document.getElementById('wizard').addEventListener('click', function (event) {
      var b = event.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-goto')) { step = Number(b.dataset.goto); render(true); }
      else if (b.hasAttribute('data-choice')) choose(b.dataset.choice, b.dataset.value);
      else if (b.hasAttribute('data-feature')) toggleFeature(b.dataset.feature);
      else if (b.hasAttribute('data-service')) { var k = b.dataset.service, i = state.services.indexOf(k); if (i >= 0) state.services.splice(i, 1); else state.services.push(k); render(false); var f = document.querySelector('[data-service="' + k + '"]'); if (f) f.focus({ preventScroll: true }); }
      else if (b.hasAttribute('data-export')) exportData(b.dataset.export);
    });
    document.getElementById('wizard').addEventListener('input', function (event) {
      var input = event.target; if (!input.dataset.field) return; var k = input.dataset.field;
      state[k] = input.type === 'range' ? Number(input.value) : input.value; state = P.normalize(state);
      var out = document.getElementById(k + '-value'); if (out) out.value = state[k]; save(); updateSummary();
    });
    document.getElementById('quote-summary').addEventListener('click', function (event) {
      if (event.target.closest('[data-reset]')) {
        var dlg = document.getElementById('reset-dialog');
        if (!dlg) { dlg = document.createElement('dialog'); dlg.id = 'reset-dialog'; dlg.className = 'modal'; dlg.innerHTML = '<h2>¿Empezamos de nuevo?</h2><p>Se borrará el alcance guardado en este navegador. Puedes descargar el resumen antes de continuar.</p><div class="actions"><button class="button" type="button" id="confirm-reset">Borrar y reiniciar</button><button class="button secondary" type="button" id="cancel-reset">Conservar proyecto</button></div>'; document.body.appendChild(dlg); document.getElementById('cancel-reset').onclick = function () { dlg.close(); }; document.getElementById('confirm-reset').onclick = function () { try { localStorage.removeItem(key); } catch (e) { } state = P.defaults(); step = 1; ref = newRef(); created = new Date().toISOString(); dlg.close(); render(true); window.VDG_APP.toast('Nuevo proyecto. El borrador anterior se borró.'); }; }
        dlg.showModal();
      }
    });
    document.addEventListener('submit', function (event) { if (event.target.id === 'quote-contact-form') { event.preventDefault(); window.VDG_CONTACT.prepare(event.target, document.getElementById('quote-contact-result'), textSummary()); } });
  }
  window.VDG_QUOTE = { init: init, textSummary: textSummary, getState: function () { return P.normalize(state); } };
}());
