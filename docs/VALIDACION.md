# Verificación de la edición 2

## Pruebas automáticas

**33 pruebas aprobadas**, sin dependencias:

- Las pruebas del motor de precios de la edición anterior.
- Secciones, enlaces y recursos locales.
- Canales extraídos del proyecto original.
- Codificación de textos, acentos y referencias en correo y WhatsApp.
- Tarjeta de contacto vCard.
- Borradores ausentes, bloqueados o corruptos.
- 40 preguntas e identificadores del asistente.
- Acceso numérico del simulador.
- Consultas de varios temas, seguimiento y corrección de servicio.
- Sinónimos y faltas leves.
- Recorrido de la guía de elección.
- Respuesta de aclaración para temas desconocidos.
- Exclusión de datos personales del contexto persistible.
- Ausencia de conexiones de IA en el motor de respuestas.

El archivo pricing.js es idéntico al de la edición anterior. Se conserva
el mismo cálculo, tarifa, inclusiones, servicios y estado de promoción.

## Navegador

Se revisaron las seis vistas a 320, 390, 768 y 1024 píxeles:
**24 combinaciones sin desbordamiento horizontal del documento**.
También se inspeccionaron escritorio, menú móvil y panel del asistente.

Se comprobaron:

- Formulario vacío y teléfono requerido cuando se prefiere WhatsApp/llamada.
- Mensaje preparado con los tres destinos correctos.
- Descarte de un mensaje preparado al cambiar sus datos.
- Adjunto del alcance guardado.
- Servicio preseleccionado desde el cotizador.
- Asistente con una consulta de costo y plazo para Android/iOS.
- Búsqueda de preguntas por tema.
- Guía de elección hasta una recomendación.
- Consulta de estimación con la misma cifra mostrada por el cotizador.
- Apertura y cierre del menú móvil.
- Panel del asistente en un marco de 320 píxeles.
- Ausencia de errores de consola atribuidos al sitio en los recorridos revisados.

Las pruebas de contacto utilizaron datos locales de ejemplo. No se
enviaron mensajes, correos ni llamadas a la empresa.

## Límites de la comprobación

Se verifican enlaces y mensajes preparados. No se confirma entrega de
un correo, recepción de WhatsApp ni establecimiento de una llamada.
La apertura de cada aplicación depende del dispositivo del visitante.

No se ejecutó el backend PHP opcional. No se hicieron pruebas en
dispositivos físicos, Safari, Firefox o Edge ni una auditoría completa
con lectores de pantalla. No se midieron Core Web Vitals en hosting real.

No se declara cumplimiento certificado de WCAG, una puntuación
Lighthouse ni un tiempo de respuesta comercial garantizado.
