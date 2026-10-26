/* Regenera HTML pre-renderizado sin instalar dependencias: node build-pages.cjs */
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const base = __dirname;
const sandbox = { window: {}, console, Intl };
vm.createContext(sandbox);
for (const f of ['config', 'icons', 'ui', 'visuals', 'pages', 'contact-page']) vm.runInContext(fs.readFileSync(path.join(base, 'assets/js/' + f + '.js'), 'utf8'), sandbox);
const pages = [
  ['inicio', 'index.html', 'Grupo VDG — Ideas hechas realidad', 'Páginas web, aplicaciones móviles y sistemas personalizados. Explora soluciones digitales y prepara la estimación de tu proyecto.'],
  ['web', 'paginas-web.html', 'Páginas web a medida — Grupo VDG', 'Sitios empresariales, tiendas, catálogos, reservas y plataformas web con identidad propia y diseño responsive.'],
  ['mobile', 'aplicaciones.html', 'Aplicaciones móviles — Grupo VDG', 'Explora proyectos Android, iOS y multiplataforma. Diseña una experiencia móvil para las tareas de tus usuarios.'],
  ['system', 'sistemas.html', 'Sistemas personalizados — Grupo VDG', 'Organiza inventario, clientes, pedidos y reportes con software a medida. Explora módulos, permisos e integraciones.'],
  ['quote', 'cotizar.html', 'Cotiza tu proyecto — Grupo VDG', 'Configura un proyecto web, móvil, sistema o automatización. Estimación preliminar en MXN con desglose y exportación.'],
  ['contact', 'contacto.html', 'Comunícate con nosotros — Grupo VDG', 'Prepara una consulta sobre tu página web, aplicación o sistema. Comparte el objetivo de tu proyecto con Grupo VDG.']
];
const scripts = ['config', 'icons', 'pricing', 'ui', 'visuals', 'pages', 'contact-page', 'contact-core', 'contact', 'quote', 'assistant-engine', 'chat', 'app'];
for (const [key, file, title, desc] of pages) {
  const html = '<!doctype html>\n<html lang="es-MX">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<meta name="theme-color" content="#090909">\n<meta name="color-scheme" content="dark">\n<title>' + title + '</title>\n<meta name="description" content="' + desc + '">\n<meta property="og:title" content="' + title + '">\n<meta property="og:description" content="' + desc + '">\n<meta property="og:type" content="website">\n<meta property="og:locale" content="es_MX">\n<link rel="icon" href="assets/img/favicon.svg" type="image/svg+xml">\n<link rel="preload" href="assets/fonts/ubuntu-latin.woff" as="font" type="font/woff" crossorigin>\n<link rel="stylesheet" href="assets/css/styles.css">\n<link rel="stylesheet" href="assets/css/forms.css">\n<link rel="stylesheet" href="assets/css/enhancements.css">\n' + scripts.map(s => '<script src="assets/js/' + s + '.js" defer></script>').join('\n') + '\n</head>\n<body data-page="' + key + '">\n<a class="skip" href="#contenido">Saltar al contenido</a>\n<header id="site-header" class="site-header"><div class="container header-inner"><a href="index.html" class="brand">GRUPO VDG</a><nav class="main-nav" aria-label="Navegación principal">' + pages.map(p => '<a href="' + p[1] + '">' + ({ inicio: 'Inicio', web: 'Páginas web', mobile: 'Apps móviles', system: 'Sistemas', quote: 'Cotizar', contact: 'Contacto' }[p[0]]) + '</a>').join('') + '</nav></div></header>\n<noscript><div class="container inline-notice">Activa JavaScript para usar el cotizador, el asistente y los formularios. Puedes explorar los servicios mediante los enlaces.</div><style>form{display:none!important}.reveal{opacity:1!important;transform:none!important}</style></noscript>\n<main id="contenido" tabindex="-1">' + sandbox.window.VDG_PAGES[key]() + '</main>\n<footer id="site-footer" class="site-footer"><div class="container"><a href="index.html">Grupo VDG</a> · <a href="cotizar.html">Cotiza tu proyecto</a> · <a href="contacto.html">Contacto</a></div></footer>\n</body>\n</html>\n';
  fs.writeFileSync(path.join(base, file), html);
}
console.log('6 páginas generadas; todas pueden abrirse directamente o en un alojamiento estático.');

const output = path.join(base, 'dist');
fs.mkdirSync(output, { recursive: true });
for (const name of [...pages.map(p => p[1]), 'assets', 'robots.txt', 'sitemap.xml']) fs.cpSync(path.join(base, name), path.join(output, name), { recursive: true });
