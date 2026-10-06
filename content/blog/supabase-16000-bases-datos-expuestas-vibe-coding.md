---
titulo: 'Encontraron 16,326 bases de datos abiertas al público. El error no fue un hackeo: fue dejar una casilla sin marcar'
fecha: 2026-10-06
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - gobernanza de datos
  - Supabase
  - seguridad de datos
  - vibe coding
  - inteligencia artificial
  - infraestructura de datos
  - privacidad
  - startups
resumen: 'UpGuard escaneó cerca de 300,000 dominios construidos sobre Supabase, la plataforma de backend más popular entre desarrolladores que usan IA para programar, y encontró 16,326 bases de datos con tablas públicamente legibles por cualquiera. Más de la mitad mostraba indicios de información personal expuesta. La causa no fue una vulnerabilidad sofisticada: fue una casilla de seguridad que nadie activó.'
tesis: 'El hallazgo de UpGuard no describe una falla técnica excepcional de Supabase, describe algo más preocupante sobre el momento actual de la industria de datos: la velocidad con la que la IA permite construir aplicaciones completas bajó tanto el costo de crear infraestructura de datos que un porcentaje enorme de esa infraestructura se está desplegando sin que nadie, humano o asistente de IA, revise si los controles de acceso más básicos están activados.'
datosClave:
  - valor: '16,326 bases de datos'
    etiqueta: 'Con tablas públicamente legibles encontradas por UpGuard en su escaneo de aplicaciones construidas sobre Supabase'
  - valor: '~300,000 dominios'
    etiqueta: 'Escaneados por UpGuard que mostraban señales de usar Supabase como backend'
  - valor: 'Más de la mitad'
    etiqueta: 'De las bases de datos expuestas mostraba indicios de información personal identificable'
  - valor: '5 regiones'
    etiqueta: 'Donde UpGuard confirmó filtraciones reales: India, Filipinas, Estados Unidos, África y Canadá'
imagen: /blog/portadas/supabase-16000-bases-datos-expuestas-vibe-coding.jpg
gancho: 'Un investigador de seguridad escaneó 300,000 sitios construidos con IA. Encontró 16,326 bases de datos abiertas al público, muchas con información personal real. No las hackeó nadie — simplemente nadie marcó la casilla que las protege. ¿Cuántas aplicaciones "vibe-codeadas" ahí afuera tienen el mismo problema?'
socialImagen: /blog/social/supabase-16000-bases-datos-expuestas-vibe-coding.jpg
postura:
  pregunta: '¿La responsabilidad de estas 16,326 bases de datos expuestas es de Supabase, por tener un default inseguro, o de los desarrolladores que no activaron la seguridad?'
  aFavor: 'Un mecanismo tan crítico como RLS no debería tener "abierto a cualquiera" como comportamiento por defecto — una plataforma dirigida a desarrolladores sin experiencia previa en bases de datos debería negar acceso hasta que se configure explícitamente.'
  enContra: 'Supabase documenta claramente cómo activar RLS, y cualquier infraestructura seria asume que quien la despliega entiende lo que está publicando; exigir "seguro por defecto" universal limitaría la flexibilidad que hace útil a la plataforma en los casos legítimos donde sí se necesita acceso público a ciertas tablas.'
---

El 25 de septiembre, la firma de seguridad UpGuard publicó los resultados de un escaneo sobre cerca de 300,000 dominios que mostraban señales de estar construidos sobre Supabase, una de las plataformas de backend más populares entre desarrolladores que usan asistentes de IA para programar rápido. El resultado: 16,326 bases de datos con tablas que cualquier persona, sin necesidad de credenciales ni de explotar ninguna vulnerabilidad, podía leer directamente. Más de la mitad de esas bases mostraba indicios de contener información personal identificable, y un subconjunto más pequeño exponía contraseñas, tokens de autenticación y, en casos aislados, datos de tarjetas de crédito. UpGuard confirmó filtraciones reales en servicios de India, Filipinas, Estados Unidos, países de África y Canadá.

## Por qué esto no es, técnicamente, un hackeo

Vale la pena ser preciso sobre qué tipo de falla es esta, porque la precisión cambia por completo cómo se debería reaccionar. Supabase, como la mayoría de las plataformas de backend modernas construidas sobre PostgreSQL, ofrece un mecanismo llamado Row-Level Security (RLS, seguridad a nivel de fila) que permite definir exactamente qué filas de una tabla puede ver cada usuario según su identidad o permisos. Cuando un desarrollador no activa ese mecanismo, el comportamiento por defecto de la base de datos no es "denegar acceso hasta que se configure algo" —es, en la práctica, dejar la tabla completamente legible para cualquiera con la URL correcta. No hubo, en la inmensa mayoría de estos 16,326 casos, ningún atacante sofisticado explotando una falla de software. Hubo una casilla de configuración que nunca se marcó, en una plataforma donde no marcarla significa exposición total por diseño, no por accidente.

## La velocidad que hizo posible este volumen de error

Lo que convierte este hallazgo en una historia sobre la industria de datos, y no solo sobre una plataforma específica, es la escala: no estamos hablando de un puñado de aplicaciones mal configuradas, sino de más de 16,000, encontradas en un solo escaneo de una sola plataforma. Esa escala solo es posible en un momento donde construir una aplicación completa con su propia base de datos dejó de requerir, para una proporción creciente de quienes lo hacen, experiencia previa en administración de bases de datos. El fenómeno conocido informalmente como "vibe coding" —generar aplicaciones completas a través de instrucciones en lenguaje natural a un asistente de IA, iterando sobre el resultado sin necesariamente entender cada decisión técnica subyacente— bajó dramáticamente el costo de crear infraestructura de datos funcional. Lo que no bajó, al mismo ritmo, fue el costo de entender qué controles de seguridad esa infraestructura necesita y por qué.

## El punto ciego que ni el desarrollador ni el asistente de IA cubrieron

Aquí es donde vale la pena resistir dos lecturas igualmente simplistas. La primera —"la IA generó código inseguro"— no captura bien el problema: RLS no es una línea de código que un modelo de lenguaje olvidó escribir, es una decisión de configuración a nivel de plataforma que requiere entender el modelo de amenazas de la aplicación específica que se está construyendo, algo que ni el desarrollador más experimentado puede delegar completamente a un asistente sin supervisión activa. La segunda lectura —"esto es solo culpa de desarrolladores descuidados"— tampoco es justa: cuando una plataforma hace posible lanzar una aplicación funcional en minutos, pero deja el control de seguridad más fundamental como un paso opcional y no obligatorio, el diseño de la propia plataforma comparte responsabilidad por la tasa de error que ese diseño hace prácticamente inevitable a esa escala de adopción.

## Por qué esto importa más allá de Supabase específicamente

Supabase no es, de ninguna manera, la única plataforma donde este patrón puede repetirse. Es, en todo caso, un caso de estudio particularmente visible precisamente porque su popularidad entre desarrolladores que usan IA para construir rápido la convirtió en un objetivo de escaneo obvio para un investigador de seguridad. El patrón de fondo —plataformas que bajan la fricción de crear infraestructura de datos funcional, sin bajar proporcionalmente la fricción de configurarla de forma segura— describe una tensión estructural en todo el stack moderno de herramientas "low-code" y "no-code" potenciadas por IA, no un defecto aislado de un solo producto. Cualquier plataforma que permita a alguien sin experiencia técnica profunda desplegar una base de datos en producción enfrenta la misma pregunta de diseño: ¿los controles de seguridad son el comportamiento por defecto que hay que desactivar deliberadamente, o son una opción que hay que recordar activar?

## Lo que las empresas que sí dependen de gobernanza de datos deberían notar

Para cualquier organización que ya invirtió en gobernanza de datos más tradicional —catálogos de datos, controles de acceso a nivel de rol, auditorías de cumplimiento— este hallazgo es una advertencia sobre dónde se está moviendo el riesgo real. Mientras los equipos de datos corporativos se enfocan en proteger los sistemas centrales que ya conocen y auditan regularmente, la proliferación de aplicaciones internas construidas rápidamente por equipos de producto o incluso por usuarios no técnicos, usando exactamente este tipo de plataformas de bajo código, puede estar generando una superficie de exposición paralela que ningún proceso de gobernanza formal está revisando, simplemente porque esas aplicaciones nunca pasaron por el proceso de aprobación que activaría ese tipo de revisión.

## El precedente regulatorio que ya existe, aunque no para este caso específico

No hace falta imaginar cuáles serían las consecuencias de este tipo de exposición si se materializan en una sanción regulatoria formal: ya existe un precedente reciente, aunque de un caso distinto. En junio, el regulador de protección de datos de Corea del Sur impuso una multa de 409 millones de dólares a Coupang después de que una clave de firma sin revocar expusiera 37.5 millones de registros de clientes. Ese caso no involucra a Supabase ni al patrón específico de "vibe coding" que describe el hallazgo de UpGuard, pero sí establece que los reguladores de protección de datos están dispuestos a imponer sanciones de magnitud genuinamente disuasiva cuando una exposición de datos personal resulta de una falla de configuración, no de un ataque sofisticado imposible de prevenir. Las 16,326 bases de datos que UpGuard documentó representan, en conjunto, una exposición potencial de una escala que ningún regulador individual ha evaluado todavía como un solo caso, precisamente porque están dispersas entre miles de aplicaciones y organizaciones distintas en lugar de concentradas en una sola empresa grande.

## Por qué el incentivo de mercado no está alineado con resolver esto rápido

Hay una tensión económica de fondo que ayuda a explicar por qué este tipo de problema persiste incluso cuando la solución técnica —activar una casilla de configuración— es, en términos absolutos, trivial. Las plataformas que compiten por atraer al mayor número de desarrolladores posible, especialmente en el segmento de quienes construyen rápido con asistencia de IA, tienen un incentivo directo para minimizar la fricción del proceso de lanzamiento: cada paso de configuración adicional obligatorio es, desde la perspectiva de adopción, una razón más para que un desarrollador elija una plataforma competidora con menos pasos. Ese incentivo empuja sistemáticamente hacia configuraciones por defecto permisivas en lugar de restrictivas, incluso cuando las consecuencias de seguridad de esa elección de diseño terminan siendo, como demuestra este caso, sustanciales y ampliamente distribuidas entre miles de aplicaciones que nunca se beneficiaron de la fricción adicional que las habría protegido.

## La pregunta que ningún escaneo externo puede responder del todo

UpGuard pudo medir cuántas bases de datos de Supabase quedaron expuestas porque pudo escanear dominios públicos y encontrar tablas legibles sin autenticación. Lo que ese método no puede medir es cuántas aplicaciones similares, construidas con el mismo patrón de velocidad sin revisión de seguridad, existen hoy dentro de redes corporativas privadas, invisibles para cualquier escaneo externo, esperando a que alguien —un auditor interno, un incidente de seguridad, o en el peor de los casos, un actor malicioso que sí sepa dónde buscar— las encuentre primero.

## Lo que una organización puede hacer sin esperar a que la regulación la obligue

La respuesta práctica a este tipo de hallazgo no depende de que la regulación llegue primero: cualquier organización que use plataformas de bajo código o permita que equipos no técnicos desplieguen aplicaciones con sus propias bases de datos puede, desde hoy, exigir una revisión de configuración de seguridad como parte del proceso de lanzamiento, en lugar de tratarla como un paso opcional que depende de la diligencia individual de quien construyó la aplicación. Eso implica tratar los controles de acceso a nivel de fila con la misma obligatoriedad con la que se trata, por ejemplo, un certificado de seguridad para un sitio público —no como una mejor práctica recomendada, sino como una condición no negociable antes de que cualquier aplicación nueva entre en producción, independientemente de qué tan rápido se haya construido o con qué grado de asistencia de IA.

## Fuentes

- [Everything, Everywhere: Systemic Data Exposure in Supabase Apps](https://www.upguard.com/blog/everything-everywhere-systemic-data-exposure-in-supabase-apps) — UpGuard
- [South Korea hits Coupang with record $409 million fine over data breach](https://www.bleepingcomputer.com/news/security/south-korea-hits-coupang-with-record-409-million-fine-over-data-breach) — BleepingComputer
