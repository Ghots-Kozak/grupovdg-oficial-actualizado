# Integración del proyecto original

## Fuentes

Se inspeccionó **Copia de Grupo VDG(1).zip** sin sobrescribir el archivo
adjunto. Para contacto se revisaron contacto.html y js/contacto.js; para
el simulador se revisaron los archivos de components/faq-bot.

La edición anterior aprobada sirve como base del diseño. Se trabaja
en una copia para conservar el resultado anterior como respaldo.

## Contacto encontrado

| Función | Implementación original | Integración |
|---|---|---|
| WhatsApp | https://wa.me/525659865944 con texto | Mismo número, mensaje revisable y estimación opcional |
| Correo directo | mailto:victor.castro@grupovdg.com | Mismo destinatario |
| Formulario | Captura campos y abre mailto con asunto/cuerpo | Validaciones, revisión y selección de canal |
| Llamada | tel:+525659865944 | Mismo número y copia de contacto |
| Horario comercial | Lunes a viernes, 9–18 h GMT-6 | Horario mostrado en Ciudad de México |

El original simula dos segundos de procesamiento y muestra feedback de
solicitud procesada después de abrir el cliente de correo. No contiene
un backend que acredite entrega. Se conserva la apertura del cliente
y se aclara la acción real, sin espera artificial.

No se trasladaron afirmaciones de soporte NOC/SOC 24/7, respuesta
inmediata o plazos garantizados sin un acuerdo de servicio verificable.

## Simulador original y nueva versión

El original muestra 15 preguntas y exige escribir un número. Incluye
sugerencias relacionadas y una memoria de categorías durante la visita.

La nueva versión conserva acceso numérico y desarrolla 40 temas con
texto libre, intenciones, sinónimos, seguimiento y una guía de elección.
El contexto persistido se limita a categorías tipadas de orientación;
no guarda el texto de la conversación. La estimación se obtiene del
motor existente, sin una lista de precios distinta.

Sigue siendo un asistente por reglas, no IA generativa. Sus limitaciones
se indican en la interfaz y se ofrecen opciones cuando hay ambigüedad.

## Diseño

La identidad, el hero de inicio, la navegación y el cálculo de la edición
aprobada se conservan. Se añaden ilustraciones propias y composiciones
distintas para web, móvil, sistemas, cotización y contacto.

No se copiaron fotografías, testimonios ni trabajos de terceros.
Las pantallas siguen identificadas como conceptos de demostración.

## Publicación e integraciones

No se modificó ningún dominio ni se enviaron consultas reales durante
la verificación. Se comprobaron destinos, datos y mensajes preparados.
El visitante debe enviar el correo o WhatsApp desde su aplicación.

El endpoint PHP alternativo permanece inactivo; no es necesario para
el flujo que se conservó del original.
