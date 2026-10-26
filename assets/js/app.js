(function () {
  'use strict';
  var U = window.VDG_UI, I = U.I, toastTimer;
  function brand() { return '<a href="index.html" class="brand" aria-label="Grupo VDG, inicio"><svg class="brand-mark" viewBox="0 0 42 44" fill="none" aria-hidden="true"><path d="m3 6 9-5 9 5v14L12 36l-9-5 9-16V11L3 6Z" fill="currentColor"/><path d="m24 3 15 9v20L24 41l-9-5 15-9V17l-6-4V3Z" fill="currentColor"/></svg><span class="brand-word"><small>GRUPO</small><b>VDG</b></span></a>'; }
  function shell(page) {
    var nav = [['inicio', 'index.html', 'Inicio'], ['web', 'paginas-web.html', 'Páginas web'], ['mobile', 'aplicaciones.html', 'Apps móviles'], ['system', 'sistemas.html', 'Sistemas'], ['contact', 'contacto.html', 'Contacto'], ['quote', 'cotizar.html', 'Cotiza tu proyecto']];
    document.getElementById('site-header').innerHTML = '<div class="container header-inner">' + brand() + '<button class="menu-toggle" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false" aria-controls="main-nav" type="button">' + I('menu') + '</button><nav class="main-nav" id="main-nav" aria-label="Navegación principal">' + nav.map(function (n) { return '<a href="' + n[1] + '" ' + (page === n[0] ? 'aria-current="page"' : '') + ' class="' + (n[0] === 'quote' ? 'nav-quote' : '') + '">' + n[2] + '</a>'; }).join('') + '</nav><button type="button" class="motion-toggle" id="motion-toggle" aria-label="Pausar animaciones" aria-pressed="false" title="Pausar animaciones">' + I('pause') + '</button></div>';
    document.getElementById('site-footer').innerHTML = '<div class="container"><div class="footer-main"><div>' + brand() + '<p>Ideas con dirección.<br>Software con propósito.</p><div class="actions" style="margin-top:22px"><a class="text-link" href="cotizar.html">Construyamos tu idea ' + I('diagonal') + '</a></div></div><div><h3>EXPLORA</h3><div class="footer-links"><a href="paginas-web.html">Páginas web</a><a href="aplicaciones.html">Aplicaciones móviles</a><a href="sistemas.html">Sistemas personalizados</a><a href="cotizar.html?tipo=ai">IA y automatización</a></div></div><div><h3>CONVERSEMOS</h3><div class="footer-links"><a href="cotizar.html">Cotizar un proyecto</a><a href="contacto.html">Comunícate con nosotros</a><button type="button" data-open-chat>Abrir asistente</button><a href="#privacidad" data-privacy>Información sobre tus datos</a></div></div></div><div class="footer-word" aria-hidden="true">VDG<span>↗</span></div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Grupo VDG.<br>Ingeniería de software a tu medida.</span><span>Web / Móvil / Sistemas</span><a href="index.html">Volver al inicio ↑</a></div></div>';
    var toggle = document.getElementById('menu-toggle'), menu = document.getElementById('main-nav');
    function closeMenu() { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); toggle.innerHTML = I('menu'); }
    toggle.onclick = function (event) { event.stopPropagation(); var open = menu.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); toggle.innerHTML = I(open ? 'close' : 'menu'); };
    menu.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('click', function (event) { if (!event.target.closest('.site-header')) closeMenu(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); toggle.focus(); } });
    window.matchMedia('(min-width:981px)').addEventListener('change', closeMenu);
  }
  function toast(message) {
    var el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    clearTimeout(toastTimer); el.textContent = message; el.classList.add('visible'); toastTimer = setTimeout(function () { el.classList.remove('visible'); }, 4200);
  }
  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast('Resumen copiado.'); }
    catch (e) { var box = document.createElement('textarea'); box.value = text; box.style.position = 'fixed'; box.style.left = '-9999px'; document.body.appendChild(box); box.select(); var copied = false; try { copied = document.execCommand('copy'); } catch (err) { } box.remove(); toast(copied ? 'Resumen copiado.' : 'No se pudo copiar. Usa la descarga del resumen.'); }
  }
  function openPrivacy() {
    var dialog = document.getElementById('privacy-dialog');
    if (!dialog) { dialog = document.createElement('dialog'); dialog.id = 'privacy-dialog'; dialog.className = 'modal'; dialog.innerHTML = '<button type="button" class="modal-close" aria-label="Cerrar información">' + I('close') + '</button><h2>Tu información,<br>con claridad.</h2><p>El alcance del cotizador se guarda en el almacenamiento local de este navegador cuando está permitido. Incluye tus elecciones y la descripción del proyecto. Puedes borrarlo con “Reiniciar y borrar el borrador”.</p><p>El asistente conserva solo opciones de orientación durante la sesión, sin guardar el texto de la conversación. Los datos del formulario de contacto se mantienen en memoria durante esta visita. No se guardan en el borrador. Se incluyen en un archivo solo si eliges descargarlo y se comparten con un canal solo si eliges usarlo.</p><p>Abrir WhatsApp o correo lleva el mensaje a un servicio externo con sus propias políticas. El sitio no confirma la entrega de esos mensajes.</p><p>Este paquete no incorpora analítica, rastreadores ni conexiones con IA. Evita incluir contraseñas o información sensible.</p><p>Puedes solicitar a Grupo VDG su aviso de privacidad formal y los datos del responsable por sus canales de contacto.</p><div class="actions"><button type="button" class="button small" data-close-privacy>Entendido</button></div>'; document.body.appendChild(dialog); dialog.querySelector('.modal-close').onclick = function () { dialog.close(); }; dialog.querySelector('[data-close-privacy]').onclick = function () { dialog.close(); }; }
    if (window.VDG_CONFIG.privacyNoticeUrl && /^https:\/\//.test(window.VDG_CONFIG.privacyNoticeUrl)) {
      window.open(window.VDG_CONFIG.privacyNoticeUrl, '_blank', 'noopener,noreferrer'); return;
    }
    dialog.showModal();
  }
  function motion() {
    var mq = window.matchMedia('(prefers-reduced-motion: reduce)'), off = mq.matches;
    try { off = off || localStorage.getItem('VDG.motion') === 'off'; } catch (e) { }
    var btn = document.getElementById('motion-toggle');
    function apply() { document.body.classList.toggle('motion-off', off); btn.setAttribute('aria-pressed', String(off)); btn.setAttribute('aria-label', off ? 'Activar animaciones' : 'Pausar animaciones'); btn.title = off ? 'Activar animaciones' : 'Pausar animaciones'; btn.innerHTML = I(off ? 'play' : 'pause'); }
    btn.onclick = function () { off = !off; try { localStorage.setItem('VDG.motion', off ? 'off' : 'on'); } catch (e) { } apply(); };
    mq.addEventListener('change', function (e) { off = e.matches; apply(); }); apply();
    if ('IntersectionObserver' in window) {
      document.body.classList.add('js-motion');
      var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); } }); }, { threshold: .06, rootMargin: '0px 0px -15px' });
      document.querySelectorAll('.reveal').forEach(function (el, i) { el.classList.add('pending'); el.style.setProperty('--delay', Math.min(i % 3 * 55, 110) + 'ms'); observer.observe(el); });
      var artObserver = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { entry.target.classList.toggle('is-visible', entry.isIntersecting); }); }, { threshold: .05 });
      document.querySelectorAll('.hero-art').forEach(function (el) { artObserver.observe(el); });
    }
    document.addEventListener('visibilitychange', function () { document.body.classList.toggle('paused-motion', document.hidden); });
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var frame = 0, x = 0, y = 0, card = null;
      document.addEventListener('pointermove', function (event) {
        var target = event.target.closest('[data-glow]'); if (!target || document.body.classList.contains('motion-off')) return;
        x = event.clientX; y = event.clientY; card = target;
        if (!frame) frame = requestAnimationFrame(function () { var rect = card.getBoundingClientRect(); card.style.setProperty('--px', (x - rect.left) + 'px'); card.style.setProperty('--py', (y - rect.top) + 'px'); frame = 0; });
      }, { passive: true });
    }
  }
  function demos() {
    document.addEventListener('click', function (event) {
      var b = event.target.closest('[data-demo]'); if (b) { var parent = b.closest('[data-demo-tabs]'); parent.querySelectorAll('button').forEach(function (el) { el.setAttribute('aria-pressed', String(el === b)); }); var target = document.querySelector('[data-demo-display="' + parent.dataset.demoTabs + '"]'); if (target) target.innerHTML = U.browserDemo(b.dataset.demo); }
      b = event.target.closest('[data-system]'); if (b) { var tabs = b.closest('[data-system-tabs]'); tabs.querySelectorAll('button').forEach(function (el) { el.setAttribute('aria-pressed', String(el === b)); }); var system = document.querySelector('[data-system-display="' + tabs.dataset.systemTabs + '"]'); if (system) system.innerHTML = U.dashboard(b.dataset.system); }
      if (event.target.closest('[data-privacy]')) { event.preventDefault(); openPrivacy(); }
    });
  }
  window.VDG_APP = { toast: toast, download: download, copy: copy, openPrivacy: openPrivacy };
  function init() {
    var page = document.body.dataset.page || 'inicio', fn = window.VDG_PAGES[page];
    if (!fn) return;
    shell(page); document.getElementById('contenido').innerHTML = fn();
    demos(); window.VDG_CONTACT.init(); window.VDG_QUOTE.init(); window.VDG_CHAT.init(); motion();
  }
  init();
}());
