(function () {
  'use strict';
  var U = window.VDG_UI, I = U.I, A = window.VDG_ASSISTANT, panel, log, launcher, previousFocus, ctx, category = 'Todas', transcript = [], key = 'VDG.assistant.context.v2';
  function save() { try { sessionStorage.setItem(key, JSON.stringify(A.context(ctx))); } catch (e) { } updateContext(); }
  function restore() { var value = null; try { value = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { } ctx = A.context(value); ctx.page = document.body.dataset.page; if (!ctx.service && ['web', 'mobile', 'system'].indexOf(ctx.page) >= 0) ctx.service = ctx.page; }
  function button(label, value) { var b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.dataset.chatAction = value; return b; }
  function updateContext() {
    var el = document.getElementById('chat-context');
    if (el) el.textContent = ctx.service ? 'Explorando: ' + A.serviceNames[ctx.service] : 'Tu idea es el punto de partida';
  }
  function append(card, user) {
    var box = document.createElement('div'); box.className = 'chat-message ' + (user ? 'user' : 'assistant');
    if (card.title) { var title = document.createElement('strong'); title.className = 'chat-card-title'; title.textContent = card.title; box.appendChild(title); }
    if (card.text) { var p = document.createElement('p'); p.textContent = card.text; box.appendChild(p); }
    if (card.bullets && card.bullets.length) { var ul = document.createElement('ul'); card.bullets.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); }); box.appendChild(ul); }
    if (card.actions && card.actions.length) { var actions = document.createElement('div'); actions.className = 'chat-choices'; card.actions.forEach(function (a) { if (a.href) { var link = document.createElement('a'); link.href = a.href; link.textContent = a.label + ' ↗'; if (/^https?:/.test(a.href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; } actions.appendChild(link); } else actions.appendChild(button(a.label, a.value)); }); box.appendChild(actions); }
    log.appendChild(box); while (log.children.length > 45) log.firstChild.remove();
    transcript.push((user ? 'Tú: ' : 'Asistente: ') + [card.title, card.text].concat(card.bullets || []).filter(Boolean).join('\n')); if (transcript.length > 60) transcript.shift(); log.scrollTop = log.scrollHeight;
  }
  function choices(items) { var target = document.getElementById('chat-suggestions'); target.replaceChildren(); items.forEach(function (a) { target.appendChild(button(a.label, a.value)); }); }
  function renderResult(result) { ctx = result.context; result.cards.forEach(function (c) { append(c, false); }); choices(result.choices); save(); }
  function switchTab(which) {
    document.querySelectorAll('[data-chat-tab]').forEach(function (b) { var selected = b.dataset.chatTab === which; b.setAttribute('aria-selected', String(selected)); b.tabIndex = selected ? 0 : -1; });
    document.getElementById('chat-conversation-view').hidden = which !== 'conversation'; document.getElementById('chat-library-view').hidden = which !== 'library';
    if (which === 'library') renderLibrary();
  }
  function renderLibrary() {
    var query = A.normalize(document.getElementById('chat-library-search').value), target = document.getElementById('chat-library-list');
    var rows = A.faq.filter(function (q) { return (category === 'Todas' || q.category === category) && (!query || A.normalize(q.question + ' ' + q.text + ' ' + q.bullets.join(' ')).includes(query)); });
    target.replaceChildren(); rows.forEach(function (q) { var b = button(q.question, 'q:' + q.id); b.className = 'chat-faq-item'; var small = document.createElement('small'); small.textContent = String(q.id).padStart(2, '0') + ' / ' + q.category; b.prepend(small); target.appendChild(b); });
    document.getElementById('chat-library-count').textContent = rows.length + ' preguntas';
    if (!rows.length) { var p = document.createElement('p'); p.className = 'note'; p.textContent = 'Prueba con una palabra más general, como pagos, app, web o datos.'; target.appendChild(p); }
  }
  function showDraft() {
    var draft = window.VDG_CONTACT.currentDraft();
    if (!draft) { append({ title: 'Todavía no hay una estimación guardada.', text: 'Puedes crearla en el cotizador y después consultarla aquí. No necesitas compartir datos personales para explorar el alcance.', actions: [{ label: 'Abrir cotizador', href: 'cotizar.html' }] }, false); }
    else { ctx.service = draft.state.type; var r = draft.result; append({ title: 'Tu estimación · ' + draft.reference, text: window.VDG_PRICING.TYPES[draft.state.type].label + ' · ' + window.VDG_PRICING.TYPES[draft.state.type].subtypes[draft.state.subtype].label, bullets: [r.estimate ? 'Importe inicial orientativo: ' + window.VDG_PRICING.money(r.total) + ' MXN.' : 'Requiere asesoría para definir el precio.', 'Servicios: ' + window.VDG_PRICING.money(r.monthlyTotal) + ' MXN al mes y ' + window.VDG_PRICING.money(r.yearlyTotal) + ' MXN al año.', 'Tarifas propuestas. Impuestos y servicios externos por definir.'], actions: [{ label: 'Revisar el alcance', href: 'cotizar.html' }, { label: 'Compartir con el equipo', href: 'contacto.html#solicitud' }] }, false); save(); }
    choices([{ label: '¿Qué incluye el cálculo?', value: 'q:31' }, { label: 'Costos recurrentes', value: 'q:28' }, { label: 'Más preguntas', value: 'library' }]);
  }
  function ask(input, display) {
    if (display) append({ text: display }, true);
    switchTab('conversation');
    if (input === 'library') { switchTab('library'); return; }
    if (input === 'draft' || /mi (cotizacion|estimacion)|ultima (cotizacion|estimacion)/.test(A.normalize(input))) { showDraft(); return; }
    renderResult(A.reply(input, ctx));
  }
  function close() { panel.hidden = true; launcher.setAttribute('aria-expanded', 'false'); if (previousFocus && previousFocus.isConnected) previousFocus.focus(); else launcher.focus(); }
  function open(topic) { previousFocus = document.activeElement; panel.hidden = false; launcher.setAttribute('aria-expanded', 'true'); if (!log.children.length) renderResult(A.start(ctx)); if (topic) ask(topic); document.getElementById('chat-input').focus(); }
  function init() {
    restore();
    document.body.insertAdjacentHTML('beforeend', '<button class="chat-launch" type="button" id="chat-launch" aria-label="Abrir asistente de Grupo VDG" aria-expanded="false" aria-controls="chat-panel">' + I('chat') + '</button><aside class="chat-panel" id="chat-panel" aria-label="Asistente de Grupo VDG" hidden><div class="chat-head"><div class="chat-avatar">' + I('spark') + '</div><div class="chat-identity"><strong>Tu guía de proyecto <span class="accent">/</span></strong><small>Una idea, un siguiente paso.</small></div><button class="chat-close" id="chat-close" type="button" aria-label="Cerrar asistente">' + I('close') + '</button></div><div class="chat-tabbar" role="tablist" aria-label="Vistas del asistente"><button id="chat-conversation-tab" type="button" role="tab" data-chat-tab="conversation" aria-selected="true" aria-controls="chat-conversation-view">Conversación</button><button id="chat-library-tab" type="button" role="tab" data-chat-tab="library" aria-selected="false" aria-controls="chat-library-view" tabindex="-1">40 preguntas Frecuentes </button><button class="chat-context-reset" type="button" id="chat-reset" aria-label="Empezar una nueva conversación">' + I('refresh') + '</button></div><div class="chat-context"><span id="chat-context"></span><button type="button" data-chat-action="draft">Mi estimación ' + I('arrow') + '</button></div><div id="chat-conversation-view" class="chat-conversation-view" role="tabpanel" aria-labelledby="chat-conversation-tab"><div class="chat-messages" id="chat-messages" role="log" aria-label="Conversación" aria-live="polite" aria-relevant="additions"></div><div class="chat-suggestions" id="chat-suggestions" aria-label="Siguientes preguntas"></div><form class="chat-form" id="chat-form"><label class="sr-only" for="chat-input">Escribe tu consulta</label><input id="chat-input" placeholder="Por ejemplo: ¿web o app para vender?" maxlength="500" autocomplete="off"><button type="submit" aria-label="Enviar consulta">' + I('send') + '</button></form></div><div id="chat-library-view" class="chat-library-view" role="tabpanel" aria-labelledby="chat-library-tab" hidden><label class="sr-only" for="chat-library-search">Buscar preguntas</label><div class="chat-search">' + I('search') + '<input id="chat-library-search" placeholder="Busca por tema: pagos, app, dominio…" autocomplete="off"></div><div class="chat-categories" id="chat-categories" aria-label="Categorías de preguntas"></div><div class="chat-library-count" id="chat-library-count"></div><div class="chat-library-list" id="chat-library-list"></div></div><div class="chat-footer"><span>Respuestas por reglas, sin IA generativa.</span><button type="button" id="chat-export" title="Guardar esta conversación" aria-label="Guardar esta conversación">' + I('download') + '</button></div></aside>');
    panel = document.getElementById('chat-panel'); launcher = document.getElementById('chat-launch'); log = document.getElementById('chat-messages'); updateContext();
    launcher.onclick = function () { if (panel.hidden) open(); else close(); }; document.getElementById('chat-close').onclick = close;
    document.getElementById('chat-form').onsubmit = function (event) { event.preventDefault(); var input = document.getElementById('chat-input'), value = input.value.trim(); if (!value) return; input.value = ''; ask(value, value); };
    panel.addEventListener('click', function (event) {
      var b = event.target.closest('[data-chat-action]'); if (b) ask(b.dataset.chatAction, /^(q:|goal:|stage:)/.test(b.dataset.chatAction) ? b.textContent : undefined);
      b = event.target.closest('[data-chat-tab]'); if (b) switchTab(b.dataset.chatTab);
    });
    var tabs = panel.querySelector('.chat-tabbar'); tabs.onkeydown = function (event) { if (!/^(ArrowLeft|ArrowRight|Home|End)$/.test(event.key) || !event.target.hasAttribute('data-chat-tab')) return; event.preventDefault(); var selected = event.target.dataset.chatTab === 'conversation' ? 'library' : 'conversation'; if (event.key === 'Home') selected = 'conversation'; if (event.key === 'End') selected = 'library'; switchTab(selected); document.getElementById('chat-' + selected + '-tab').focus(); };
    var categories = document.getElementById('chat-categories');['Todas'].concat(Array.from(new Set(A.faq.map(function (q) { return q.category; })))).forEach(function (label) { var b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.setAttribute('aria-pressed', String(label === category)); b.onclick = function () { category = label; categories.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); renderLibrary(); }; categories.appendChild(b); });
    document.getElementById('chat-library-search').oninput = renderLibrary;
    document.getElementById('chat-reset').onclick = function () { ctx = A.context({ page: document.body.dataset.page }); log.replaceChildren(); transcript = []; save(); switchTab('conversation'); renderResult(A.start(ctx)); document.getElementById('chat-input').focus(); };
    document.getElementById('chat-export').onclick = function () { window.VDG_APP.download('Grupo-VDG-conversacion.txt', ['GRUPO VDG · GUÍA DE PROYECTO', 'Respuestas por reglas; no son una propuesta formal.', ''].concat(transcript).join('\n\n'), 'text/plain;charset=utf-8'); };
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !panel.hidden) close(); });
    document.addEventListener('click', function (event) { var b = event.target.closest('[data-open-chat]'); if (b) { event.preventDefault(); open(b.dataset.chatStart || ''); } });
  }
  window.VDG_CHAT = { init: init };
}());
