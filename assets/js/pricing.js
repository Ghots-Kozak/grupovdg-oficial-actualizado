/* Motor independiente de la interfaz. Sin red, sin datos personales, sin impuestos implícitos. */
(function (root) {
  'use strict';
  var RATE = 400; // MXN/h; propuesta editable, no tarifa comercial aprobada.
  var TYPES = {
    web: {
      label: 'Página web', icon: 'monitor', desc: 'Tu marca, tienda o plataforma en internet.', platforms: [['responsive', 'Web responsive'], ['pwa', 'Web instalable (PWA)'], ['webapp', 'Web + app móvil independiente']], subtypes: {
        landing: { label: 'Landing page', hours: 20, screens: 1, included: [] },
        corporate: { label: 'Sitio empresarial', hours: 40, screens: 7, included: [] },
        catalog: { label: 'Catálogo digital', hours: 55, screens: 7, included: ['database', 'admin'] },
        ecommerce: { label: 'Tienda en línea', hours: 90, screens: 8, included: ['database', 'admin', 'auth', 'payments'] },
        platform: { label: 'Plataforma con usuarios', hours: 110, screens: 8, included: ['auth', 'database', 'admin'] },
        webapp: { label: 'Aplicación web a medida', hours: 140, screens: 10, included: ['auth', 'database', 'admin'] },
        booking: { label: 'Reservas y citas', hours: 70, screens: 7, included: ['database', 'admin', 'booking'] },
        blog: { label: 'Blog / sitio editorial', hours: 55, screens: 7, included: ['database', 'admin', 'cms'] }
      }
    },
    mobile: {
      label: 'Aplicación móvil', icon: 'phone', desc: 'Una experiencia para Android, iOS o ambos.', platforms: [['android', 'Android'], ['ios', 'iOS'], ['both', 'Android + iOS (multiplataforma)']], subtypes: {
        mvp: { label: 'Primera versión (MVP)', hours: 120, screens: 6, included: ['database'] },
        business: { label: 'App empresarial', hours: 190, screens: 10, included: ['auth', 'database', 'admin'] },
        commerce: { label: 'App de comercio', hours: 230, screens: 12, included: ['auth', 'database', 'admin', 'payments'] },
        community: { label: 'Comunidad / membresías', hours: 210, screens: 10, included: ['auth', 'database'] },
        delivery: { label: 'Pedidos y entregas', hours: 250, screens: 12, included: ['auth', 'database', 'admin', 'maps', 'tracking'] },
        appointments: { label: 'App de citas y reservas', hours: 160, screens: 8, included: ['auth', 'database', 'booking'] }
      }
    },
    system: {
      label: 'Sistema personalizado', icon: 'layers', desc: 'Organiza tu operación con software a medida.', platforms: [['cloud', 'En la nube'], ['local', 'Red local / instalación interna'], ['hybrid', 'Híbrido (nube + local)']], subtypes: {
        inventory: { label: 'Inventario y almacén', hours: 140, screens: 10, included: ['auth', 'database', 'admin', 'roles'] },
        crm: { label: 'Gestión de clientes (CRM)', hours: 150, screens: 10, included: ['auth', 'database', 'admin', 'roles'] },
        sales: { label: 'Ventas y pedidos', hours: 170, screens: 10, included: ['auth', 'database', 'admin', 'roles'] },
        management: { label: 'Administración interna', hours: 180, screens: 12, included: ['auth', 'database', 'admin', 'roles'] },
        documents: { label: 'Gestión documental', hours: 150, screens: 10, included: ['auth', 'database', 'admin', 'roles', 'files'] },
        custom: { label: 'Proceso especializado', hours: 200, screens: 12, included: ['auth', 'database', 'admin', 'roles'] },
        reporting: { label: 'Reportes y dashboard', hours: 115, screens: 8, included: ['auth', 'database', 'reports'] },
        appointments: { label: 'Agenda y citas', hours: 110, screens: 8, included: ['auth', 'database', 'admin', 'booking'] }
      }
    },
    ai: {
      label: 'IA y automatización', icon: 'brain', desc: 'Automatiza una tarea concreta de tu negocio.', platforms: [['web', 'En una web'], ['internal', 'Herramienta interna'], ['integration', 'En un sistema existente']], subtypes: {
        assistant: { label: 'Asistente de atención', hours: 90, screens: 5, included: ['chatbot', 'ai'] },
        documents: { label: 'Consulta de documentos', hours: 130, screens: 6, included: ['ai', 'files', 'database'] },
        workflow: { label: 'Automatización de tareas', hours: 95, screens: 5, included: ['api'] },
        classification: { label: 'Clasificar información', hours: 110, screens: 5, included: ['ai', 'database'] },
        integration: { label: 'Integración en software', hours: 120, screens: 5, included: ['ai', 'api'] }
      }
    },
    advice: { label: 'Necesito orientación', icon: 'compass', desc: 'Primero definamos qué solución te conviene.', platforms: [['advice', 'Por definir con asesoría']], subtypes: { discovery: { label: 'Definición de proyecto', hours: 0, screens: 5, included: [] } } }
  };
  var FEATURES = {
    auth: { label: 'Registro e inicio de sesión', icon: 'users', hours: 20, types: ['web', 'mobile', 'system'] },
    admin: { label: 'Panel de administración', icon: 'grid', hours: 26, types: ['web', 'mobile', 'system', 'ai'] },
    database: { label: 'Base de datos', icon: 'database', hours: 16, types: ['web', 'mobile', 'system', 'ai'] },
    payments: { label: 'Pagos en línea', icon: 'wallet', hours: 26, types: ['web', 'mobile', 'system'] },
    subscriptions: { label: 'Suscripciones y membresías', icon: 'refresh', hours: 30, requires: ['payments', 'auth'], types: ['web', 'mobile', 'system'] },
    chatbot: { label: 'Chatbot de preguntas frecuentes', icon: 'chat', hours: 12, types: ['web', 'mobile', 'system', 'ai'] },
    ai: { label: 'Integración con IA', icon: 'brain', hours: 35, types: ['web', 'mobile', 'system', 'ai'] },
    notifications: { label: 'Notificaciones', icon: 'bell', hours: 18, types: ['web', 'mobile', 'system'] },
    api: { label: 'Conectar una API externa', icon: 'link', hours: 22, types: ['web', 'mobile', 'system', 'ai'] },
    reports: { label: 'Reportes y exportación', icon: 'chart', hours: 22, types: ['web', 'mobile', 'system', 'ai'] },
    multi: { label: 'Dos idiomas', icon: 'language', hours: 16, types: ['web', 'mobile', 'system'] },
    brand: { label: 'Identidad visual básica', icon: 'spark', hours: 18, types: ['web', 'mobile', 'system', 'ai'] },
    maps: { label: 'Mapas y geolocalización', icon: 'pin', hours: 22, types: ['web', 'mobile', 'system'] },
    offline: { label: 'Trabajo sin conexión', icon: 'wifi', hours: 35, types: ['web', 'mobile', 'system'] },
    roles: { label: 'Permisos por tipo de usuario', icon: 'shield', hours: 18, requires: ['auth'], types: ['web', 'mobile', 'system', 'ai'] },
    booking: { label: 'Calendario y reservas', icon: 'calendar', hours: 25, types: ['web', 'mobile', 'system'] },
    files: { label: 'Carga y gestión de archivos', icon: 'document', hours: 18, types: ['web', 'mobile', 'system', 'ai'] },
    search: { label: 'Búsqueda avanzada y filtros', icon: 'search', hours: 16, types: ['web', 'mobile', 'system', 'ai'] },
    cms: { label: 'Editor de contenidos', icon: 'code', hours: 20, types: ['web'] },
    migration: { label: 'Migración de información', icon: 'server', hours: 28, types: ['web', 'mobile', 'system', 'ai'] },
    analytics: { label: 'Analítica y eventos', icon: 'target', hours: 12, types: ['web', 'mobile', 'system'] },
    tracking: { label: 'Seguimiento de pedidos', icon: 'package', hours: 30, types: ['web', 'mobile', 'system'] },
    security: { label: 'Verificación en dos pasos', icon: 'lock', hours: 22, requires: ['auth'], types: ['web', 'mobile', 'system'] },
    accessibility: { label: 'Revisión de accesibilidad', icon: 'eye', hours: 16, types: ['web', 'mobile', 'system'] },
    email: { label: 'Correos transaccionales', icon: 'mail', hours: 14, types: ['web', 'mobile', 'system', 'ai'] },
    testing: { label: 'Pruebas automatizadas ampliadas', icon: 'check', hours: 24, types: ['web', 'mobile', 'system', 'ai'] }
  };
  var DESIGNS = {
    standard: { label: 'Profesional esencial', hours: 0, desc: 'Jerarquía clara y componentes cuidados.' },
    custom: { label: 'Personalizado avanzado', hours: 18, desc: 'Sistema visual diseñado para tu marca.' },
    premium: { label: 'Premium con movimiento', hours: 35, desc: 'Microinteracciones y composiciones especiales.' },
    interactive: { label: 'Experiencia especializada', hours: 60, desc: 'Interacción de producto a la medida.' }
  };
  var SERVICES = {
    hosting: { label: 'Alojamiento', amount: 350, period: 'month' },
    maintenance: { label: 'Mantenimiento preventivo', amount: 1800, period: 'month' },
    domain: { label: 'Dominio', amount: 500, period: 'year' },
    monitoring: { label: 'Monitoreo de disponibilidad', amount: 250, period: 'month' },
    backup: { label: 'Respaldo administrado', amount: 300, period: 'month' },
    training: { label: 'Capacitación de uso (2 h)', amount: 800, period: 'once' }
  };
  function own(obj, key) { return typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key); }
  function bounded(v, min, max, fallback) { var n = Number(v); return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : fallback; }
  function defaults(type) {
    type = own(TYPES, type) ? type : 'web'; var t = TYPES[type], sub = Object.keys(t.subtypes)[type === 'web' ? 1 : 0];
    return { version: 1, type: type, subtype: sub, platform: t.platforms[0][0], design: 'custom', features: [], screens: t.subtypes[sub].screens, roles: 1, integrations: 0, deadline: 'flexible', scope: 'mvp', assets: 'none', services: [], industry: 'general', budget: 'undecided', notes: '' };
  }
  function normalize(input) {
    var raw = input && typeof input === 'object' && !Array.isArray(input) ? input : {}, s = Object.assign(defaults(raw.type), raw), t = own(TYPES, s.type) ? TYPES[s.type] : TYPES.web;
    if (!own(TYPES, s.type)) s.type = 'web';
    if (!own(t.subtypes, s.subtype)) s.subtype = Object.keys(t.subtypes)[0];
    if (!t.platforms.some(function (p) { return p[0] === s.platform; })) s.platform = t.platforms[0][0];
    if (!own(DESIGNS, s.design)) s.design = 'standard';
    var selected = Array.isArray(s.features) ? s.features : [];
    s.features = Array.from(new Set(selected.filter(function (k) { return own(FEATURES, k) && FEATURES[k].types.indexOf(s.type) >= 0; })));
    if (s.type === 'web' && s.platform === 'responsive') s.features = s.features.filter(function (k) { return k !== 'offline'; });
    var included = t.subtypes[s.subtype].included;
    s.features.forEach(function (k) { (FEATURES[k].requires || []).forEach(function (dep) { if (s.features.indexOf(dep) < 0 && included.indexOf(dep) < 0) s.features.push(dep); }); });
    s.features = s.features.filter(function (k) { return included.indexOf(k) < 0; });
    s.screens = bounded(s.screens, 1, 80, 7); s.roles = bounded(s.roles, 1, 12, 1); s.integrations = bounded(s.integrations, 0, 10, 0);
    s.deadline = ['flexible', 'standard', 'priority'].indexOf(s.deadline) >= 0 ? s.deadline : 'flexible';
    s.scope = ['mvp', 'full'].indexOf(s.scope) >= 0 ? s.scope : 'mvp';
    s.assets = ['none', 'brand', 'ready'].indexOf(s.assets) >= 0 ? s.assets : 'none';
    s.services = Array.from(new Set((Array.isArray(s.services) ? s.services : []).filter(function (k) { return own(SERVICES, k); })));
    s.industry = String(s.industry || 'general').slice(0, 60); s.budget = String(s.budget || 'undecided').slice(0, 60); s.notes = String(s.notes || '').slice(0, 2000);
    return s;
  }
  function calculate(input) {
    var s = normalize(input), t = TYPES[s.type], sub = t.subtypes[s.subtype], rows = [], monthly = [], yearly = [];
    function add(label, hours) { if (hours > 0) rows.push({ label: label, hours: hours, amount: hours * RATE }); }
    add(sub.label + ' · análisis, desarrollo y pruebas básicas', sub.hours);
    if (s.type !== 'advice') {
      add(DESIGNS[s.design].label, DESIGNS[s.design].hours);
      if (s.platform === 'pwa') add('Capacidades instalables PWA', 22);
      if (s.platform === 'webapp') add('Aplicación móvil independiente adicional', 120);
      if (s.type === 'mobile' && s.platform === 'both') add('Adaptación y pruebas en segunda plataforma', 35);
      if (s.type === 'system' && s.platform === 'hybrid') add('Sincronización e instalación híbrida', 40);
      var all = sub.included.concat(s.features);
      s.features.forEach(function (k) { add(FEATURES[k].label, FEATURES[k].hours); });
      add('Pantallas adicionales (' + Math.max(0, s.screens - sub.screens) + ')', Math.max(0, s.screens - sub.screens) * 5);
      if (s.roles > 1) {
        if (all.indexOf('auth') < 0) { add('Base de autenticación para múltiples roles', FEATURES.auth.hours); all.push('auth'); }
        if (all.indexOf('roles') < 0) { add('Permisos por tipo de usuario', FEATURES.roles.hours); all.push('roles'); }
        add('Configuración de roles adicionales', Math.max(0, s.roles - 2) * 6);
      }
      var apisPaid = all.indexOf('api') >= 0 ? 1 : 0;
      add('Integraciones adicionales (' + Math.max(0, s.integrations - apisPaid) + ')', Math.max(0, s.integrations - apisPaid) * 22);
      var core = rows.reduce(function (a, r) { return a + r.hours; }, 0);
      if (s.scope === 'full') add('Ampliación a producto completo', Math.ceil(core * 0.15));
      if (s.deadline === 'priority') add('Planeación prioritaria sujeta a disponibilidad', Math.ceil(core * 0.1));
    }
    s.services.forEach(function (k) {
      var item = SERVICES[k], row = { label: item.label, amount: item.amount, period: item.period };
      if (item.period === 'month') monthly.push(row); else if (item.period === 'year') yearly.push(row);
      else if (s.type !== 'advice') rows.push({ label: item.label, hours: 2, amount: item.amount });
    });
    var total = rows.reduce(function (a, r) { return a + r.amount; }, 0), hours = rows.reduce(function (a, r) { return a + r.hours; }, 0);
    var review = s.type === 'advice' || s.screens > 35 || s.integrations > 4 || s.roles > 6 || s.platform === 'webapp' || (s.type === 'ai' && s.subtype === 'integration');
    return { state: s, rows: rows, included: sub.included.map(function (k) { return FEATURES[k].label; }), hours: hours, subtotal: total, discount: 0, total: total, low: Math.round(total * 0.9 / 100) * 100, high: Math.ceil(total * 1.3 / 100) * 100, monthly: monthly, yearly: yearly, monthlyTotal: monthly.reduce(function (a, r) { return a + r.amount; }, 0), yearlyTotal: yearly.reduce(function (a, r) { return a + r.amount; }, 0), review: review, estimate: s.type !== 'advice', weeks: [Math.max(2, Math.ceil(hours / 30)), Math.max(3, Math.ceil(hours / 22))], rate: RATE };
  }
  var api = { RATE: RATE, TYPES: TYPES, FEATURES: FEATURES, DESIGNS: DESIGNS, SERVICES: SERVICES, defaults: defaults, normalize: normalize, calculate: calculate, money: function (n) { return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n); } };
  root.VDG_PRICING = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis));
