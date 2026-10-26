# Tarifas propuestas y referencias

Consulta de referencia: 24 de octubre de 2026.
Estos importes no constituyen precios comerciales aprobados por Grupo VDG.

## Criterio del motor

La tarifa de trabajo propuesta es de **$400 MXN por hora**.
Es una decisión de configuración para explorar alcances, no un promedio
de mercado demostrado ni una afirmación sobre los costos de la empresa.

El cálculo suma:

1. Horas base del tipo de proyecto.
2. Diseño adicional, si se selecciona.
3. Capacidad de plataforma adicional, cuando corresponde.
4. Funciones no incluidas en la base.
5. Pantallas que exceden la capacidad base.
6. Perfiles adicionales y sus dependencias de acceso.
7. APIs no contempladas por la opción de integración.
8. Ajuste de producto completo y planeación prioritaria, si se seleccionan.
9. Servicios de pago único, separados de los recurrentes.

El rango orientativo es de 90 % a 130 % de la estimación central,
redondeado a centenas. Este margen también es una propuesta, no una
medición estadística. Los proyectos grandes se marcan para evaluación.

La base cubre el número de pantallas indicado; elegir menos pantallas
no reduce automáticamente la base de análisis y construcción.

El diseño previo y el presupuesto no alteran por sí solos la fórmula.
Se usan para orientar la revisión posterior.

## Ejemplos reproducibles

| Escenario | Cálculo | Importe inicial |
|---|---|---:|
| Landing de una pantalla, diseño esencial | 20 h × $400 | $8,000 |
| Sitio empresarial, siete páginas, diseño esencial | 40 h × $400 | $16,000 |
| Sitio empresarial con diseño avanzado | (40 + 18) h × $400 | $23,200 |
| Tienda, ocho pantallas, diseño esencial | 90 h × $400 | $36,000 |
| App MVP Android, seis pantallas, diseño esencial | 120 h × $400 | $48,000 |
| Inventario, diez pantallas, diseño esencial | 140 h × $400 | $56,000 |
| Asistente con IA, cinco pantallas, diseño esencial | 90 h × $400 | $36,000 |

Los ejemplos no añaden servicios ni otros extras. Los impuestos no están
definidos. Para modificar la tabla real, edita RATE, TYPES, FEATURES,
DESIGNS y SERVICES en assets/js/pricing.js.

## Servicios propuestos

| Servicio | Frecuencia | Referencia editable |
|---|---|---:|
| Alojamiento | Mensual | $350 |
| Mantenimiento preventivo | Mensual | $1,800 |
| Monitoreo de disponibilidad | Mensual | $250 |
| Respaldo administrado | Mensual | $300 |
| Dominio | Anual | $500 |
| Capacitación de dos horas | Única | $800 |

No son cotizaciones de proveedores. Antes de ofrecerlos deben definirse
cobertura, costos reales, límites, responsabilidades y renovaciones.
El precio de dominio depende de su extensión y del proveedor.
Consumo de IA/APIs, comisiones de pago, licencias y cuentas de tiendas
quedan fuera de la estimación.

## Comparación de fuentes comerciales

Las páginas consultadas muestran alcances diferentes. Sus precios
sirven como referencias puntuales y no pueden compararse sin revisar
qué incluyen, su fecha, impuestos y modelo de desarrollo.

- [Desarrollo de Páginas Web: precios en México](https://www.desarrollodepaginasweb.com.mx/precios-de-paginas-web-en-mexico/):
  anuncia rangos de $4,800–$7,000 para paquetes económicos y de
  $8,800–$20,000 para opciones profesionales, con servicios del
  primer año según sus condiciones.
- [LDP: desarrollo de tiendas en línea](https://www.ldp.mx/desarrollo-tiendas-en-linea):
  presenta paquetes prediseñados desde $14,000 y separa los
  desarrollos completamente a medida.
- [Megalodonte: precios de páginas web](https://www.megalodonte.com/precios-de-paginas-web/):
  publica una opción de tienda en línea por $18,500 con los
  elementos que describe en su paquete.
- [AMAD Software Solutions: costo de una app móvil en México](https://amadsoftwaresolutions.com/blog/cuanto-cuesta-desarrollar-una-app-movil-en-mexico):
  utiliza una referencia inicial de alrededor de $50,000 para
  proyectos móviles, dependiente de su alcance.
- [Sinntec: precios](https://sinntec.com.mx/precios/):
  describe desarrollo y mantenimiento por necesidades del proyecto,
  útil para distinguir implementación de operación continua.

**Interpretación para esta entrega:** una plantilla comercial y una
plataforma con lógica propia no representan el mismo esfuerzo.
Por eso el motor utiliza horas e inclusiones explícitas y muestra
las tarifas como propuestas. No traslada sin revisión la lista de un
proveedor ni promete un precio final para software no especificado.

## Referencias de diseño y rendimiento

- [Linear: A calmer interface for a product in motion](https://linear.app/now/behind-the-latest-design-refresh):
  referencia de jerarquía, organización y superficies discretas;
  no se copiaron componentes ni recursos de Linear.
- [web.dev: How to create high-performance CSS animations](https://web.dev/articles/animations-guide):
  preferencia por transformaciones y opacidad, evitando trabajo
  continuo innecesario.
- [web.dev: Animation and motion](https://web.dev/learn/accessibility/motion):
  preferencia de movimiento reducido y control para pausarlo.
- [Apple Developer: inscripción al programa](https://developer.apple.com/help/account/membership/program-enrollment):
  ejemplo de un costo de distribución independiente del desarrollo.
  Debe confirmarse directamente con la plataforma al contratar.

Las decisiones de implementación fueron usar recursos locales,
SVG, CSS e IntersectionObserver, sin bibliotecas visuales pesadas.
La referencia adjunta orientó el color y el contraste, no una copia
del logotipo ni del diseño de otra empresa.
