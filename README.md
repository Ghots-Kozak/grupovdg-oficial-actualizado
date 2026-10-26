# Grupo VDG · Edición 2

## Abrir

Descomprime y abre **index.html**. No necesitas instalar paquetes ni claves.
El frontend funciona con archivos locales y también en hosting estático.

Se conserva la identidad, el inicio, la navegación, las tarifas y el motor
del cotizador de la edición anterior. Las mejoras se concentran en contacto,
asistente e ilustraciones y composiciones de los servicios.

| Vista | Archivo | Secciones |
|---|---|---:|
| Inicio | index.html | 9 |
| Páginas web | paginas-web.html | 9 |
| Aplicaciones móviles | aplicaciones.html | 9 |
| Sistemas | sistemas.html | 9 |
| Cotizador | cotizar.html | 8 |
| Contacto | contacto.html | 9 |

## Canales integrados del proyecto original

| Canal | Dato extraído de Copia de Grupo VDG(1).zip |
|---|---|
| Correo | victor.castro@grupovdg.com |
| WhatsApp | +52 56 5986 5944 |
| Llamada | +52 56 5986 5944 |

Se conserva la marca visual Grupo VDG de la versión aprobada. El correo
mantiene exactamente el dominio grupovdg.com que aparece en el proyecto
original. No se cambió el dominio público ni se publicó el sitio.

El formulario original **abre la aplicación de correo con un mensaje
preparado** mediante mailto. No tiene un servidor que confirme entrega.
Esta edición conserva ese mecanismo y añade:

- Acciones directas para WhatsApp, correo y llamada.
- Formulario con servicio, motivo, canal y horario preferido.
- Preguntas de ayuda según el servicio.
- Validación de datos y teléfono para WhatsApp/llamada.
- Revisión del mensaje completo antes de abrir el canal.
- Adjunto de la estimación guardada en el mismo navegador.
- Copia del mensaje, descarga TXT y regreso a editar.
- Descarte de una vista previa si cambian sus datos.
- Copia de teléfono y correo.
- Descarga de una tarjeta de contacto .vcf.
- Guía por canal con navegación por teclado.

Abrir WhatsApp, correo o una llamada depende de las aplicaciones del
dispositivo. El visitante revisa y envía el mensaje en su aplicación.
La página no afirma que abrirla confirme el envío o la recepción.
Si el cliente de correo no se abre o limita mensajes extensos, se puede
copiar el mensaje o descargarlo para llevarlo al correo web.

Puedes adjuntar archivos desde correo o WhatsApp después de abrirlos.
Este formulario no sube archivos ni agenda citas automáticamente.

## Asistente con más contexto, sin IA generativa

- 40 preguntas, con números, buscador y filtros por tema.
- Texto libre con intenciones, sinónimos y algunas faltas leves.
- Preguntas de seguimiento sobre el tipo de proyecto.
- Respuestas conjuntas a costo y plazo cuando se reconocen ambos temas.
- Guía para elegir solución según el objetivo y la primera entrega.
- Consulta de la estimación mediante el mismo motor de precios.
- Enlaces contextuales al cotizador, servicios y contacto.
- Reinicio del contexto y descarga de la conversación.

No requiere modelos locales, API de IA ni servicios externos.
Es un sistema determinista: no comprende cualquier consulta. Cuando
no reconoce un tema, pide aclaración y ofrece opciones.

Solo se conservan opciones de orientación en sessionStorage. No se
guarda el texto de la conversación ni los datos del formulario allí.
Las transcripciones se descargan únicamente cuando se pulsa ese control.

## Recursos y diseño

Se añadieron nueve ilustraciones SVG locales, aproximadamente 25 KB
entre todas, con formas de navegador, aplicaciones, módulos, correo,
calculadora, catálogo, datos, notificaciones y automatización.

Cada servicio utiliza una composición diferente: escaparate y catálogo
web, plataformas y recorridos móviles, tablero modular y accesos de
sistemas. El cotizador mantiene su funcionamiento y la identidad conserva
negro, blanco, naranja y tonos neutros.

Las animaciones son CSS y SVG estático, sin video, Three.js ni bibliotecas
de animación. Se mantiene el control de pausa y prefers-reduced-motion.

## Datos y personalización

- Datos comerciales y canales: **assets/js/config.js**.
- Motor de precios: **assets/js/pricing.js**, conservado de la primera edición.
- Mensajes y enlaces de contacto: **assets/js/contact-core.js**.
- Interacción del formulario: **assets/js/contact.js**.
- Vista de contacto: **assets/js/contact-page.js**.
- Respuestas y decisiones del asistente: **assets/js/assistant-engine.js**.
- Interfaz del asistente: **assets/js/chat.js**.
- Vistas de servicios: **assets/js/pages.js**.
- Ilustraciones: **assets/img/** y registro en **assets/js/visuals.js**.
- Nuevas composiciones: **assets/css/enhancements.css**.

Después de cambiar contenidos ejecuta:

    node build-pages.cjs

Esto actualiza el HTML pre-renderizado y genera una salida estática dist.
El ZIP ya contiene los HTML listos en la raíz; no es obligatorio ejecutar
el script para abrirlo.

Las tarifas siguen siendo propuestas, no una lista comercial aprobada.
Los impuestos y servicios externos se revisan en la propuesta formal.
No se activaron descuentos ni temporizadores.

## Publicar

Sube los seis HTML, assets, robots.txt y sitemap.xml a tu carpeta pública.
Revisa el dominio del sitemap si publicas en otra dirección.
El archivo .htaccess es opcional para Apache cuando su configuración
permite esas directivas. docs y tests no son necesarios para servir el sitio.

Si prefieres probar mediante HTTP:

    python3 -m http.server 8080 --bind 127.0.0.1

Abre http://127.0.0.1:8080. El comando no ejecuta PHP.

## Backend opcional de correo

El correo original no necesita PHP. Se conserva, como alternativa
desactivada, api/contact.php de la edición anterior.

Para usarlo se requiere PHP 8.1+, un servicio de correo autorizado,
VDG_TO_EMAIL, VDG_FROM_EMAIL y VDG_RATE_SECRET en el servidor,
un directorio temporal privado y un aviso de privacidad formal.
Después se establece contactEndpoint en config.js.

No pongas contraseñas ni claves en el JavaScript público.
Este backend no se pudo ejecutar aquí porque PHP y el servicio de correo
no están disponibles. Es opcional y **no interviene en los canales activos**.

## Verificar

Con Node.js 18 o posterior:

    node --test tests/*.test.cjs

No requiere instalar dependencias. Consulta docs/VALIDACION.md para
las comprobaciones y sus límites, y docs/AUDITORIA.md para la integración
del proyecto original.
