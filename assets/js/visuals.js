(function () {
  'use strict';
  var U = window.VDG_UI;
  var assets = {
    'web-studio': 'Concepto de una interfaz web con componentes y gráficos',
    'mobile-experience': 'Dos teléfonos con un concepto de aplicación',
    'system-stack': 'Módulos de un sistema organizados en capas',
    'contact-connect': 'Correo, conversación y llamada en una composición tridimensional',
    'project-blueprint': 'Calculadora y resumen de un proyecto',
    'shop-interface': 'Concepto de una tienda con catálogo y carrito',
    'data-vault': 'Información organizada en una base de datos',
    'mobile-notifications': 'Una aplicación con avisos y confirmaciones',
    'automation-flow': 'Etapas conectadas para automatizar una tarea'
  };
  U.scene = function (name, variant, label) {
    if (!assets[name]) return '';
    return '<figure class="vector-scene ' + (variant || '') + ' reveal"><span class="scene-orbit" aria-hidden="true"></span><img src="assets/img/' + name + '.svg" width="640" height="500" alt="' + assets[name] + '" loading="' + (String(variant || '').indexOf('hero') >= 0 ? 'eager' : 'lazy') + '" decoding="async">' + (label ? '<figcaption>' + U.I('spark') + label + '</figcaption>' : '') + '</figure>';
  };
}());
