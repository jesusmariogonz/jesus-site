---
titulo: 'Snowflake ahora corre nativo en la nube de Oracle. La narrativa es "fin del encierro multi-nube" — la aritmética dice otra cosa'
fecha: 2026-10-28
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - Snowflake
  - Oracle
  - OCI
  - gravedad de datos
  - vendor lock-in
  - arquitectura de datos
  - multi-nube
  - costos de egress
  - gobernanza de datos
  - data warehouse
resumen: 'Snowflake y Oracle anunciaron el 27 de octubre que el AI Data Cloud de Snowflake correrá nativo dentro de Oracle Cloud Infrastructure, sumando una cuarta nube a AWS, Azure y Google Cloud. El pitch es menos fricción y menos costos de transferencia de datos; la lectura de varios analistas es que el problema que resuelve no es el que crea.'
tesis: 'Que Snowflake elimine el movimiento de datos entre Oracle y su plataforma, reduciendo costos de egress documentados en al menos 0.02 dólares por gigabyte, es un hecho que confirman el propio anuncio y la cobertura especializada. Que esto resuelva el problema de fondo del "vendor lock-in" es una lectura que la evidencia no sostiene: mover el cómputo más cerca de los datos de Oracle no elimina la dependencia, la desplaza de la nube de cómputo hacia la capa de Snowflake mismo —que ahora se vuelve indispensable en las cuatro nubes grandes a la vez, un tipo de encierro más difícil de ver, no uno que haya desaparecido.'
datosClave:
  - valor: '4 nubes'
    etiqueta: 'AWS, Azure, Google Cloud y ahora Oracle Cloud Infrastructure, donde el AI Data Cloud de Snowflake corre de forma nativa'
    periodo: '27 de octubre de 2026'
    fuente: 'Snowflake, Oracle'
  - valor: '≥$0.02 por GB'
    etiqueta: 'Costo aproximado de egress entre nubes que el esquema nativo busca evitar, según estimaciones de la industria'
    fuente: 'Scality'
  - valor: '+1.2%'
    etiqueta: 'Reacción de la acción de Snowflake (SNOW) el día del anuncio, a 338.94 dólares'
    periodo: '27 de octubre de 2026'
    fuente: 'TradersUnion'
  - valor: '+55%'
    etiqueta: 'Avance acumulado de la acción de Snowflake en 2026 hasta el cierre del martes'
    periodo: '2026, a la fecha'
    fuente: 'TIKR'
imagen: /blog/portadas/snowflake-oracle-oci-gravedad-datos-nuevo-encierro.jpg
socialImagen: /blog/social/snowflake-oracle-oci-gravedad-datos-nuevo-encierro.jpg
gancho: 'Snowflake dice que esto elimina el encierro de nube. Un analista independiente dice que en realidad crea dos catálogos de gobernanza, dos modelos de costo y múltiples cuentas de Snowflake distintas. ¿Cuál de los dos describe mejor lo que firmó tu empresa?'
postura:
  pregunta: '¿La disponibilidad nativa del AI Data Cloud de Snowflake en una cuarta nube —Oracle, tras AWS, Azure y Google Cloud— representa una genuina liberación del vendor lock-in para las empresas, o es, en el fondo, una forma más sofisticada de atarlas, esta vez a Snowflake mismo en lugar de a un solo proveedor de cómputo?'
  aFavor: 'Para una empresa que ya tiene su ERP, su NetSuite o su base de datos autónoma corriendo en Oracle, eliminar el movimiento nocturno de datos hacia otra nube —con su correspondiente costo de egress y su retraso de horas— es una mejora operativa real y medible, no retórica: menos trabajo de ingeniería de datos, menos duplicación innecesaria, y un solo contrato y una sola factura en lugar de dos, según coinciden analistas como Ashish Chaturvedi de HFS Research.'
  enContra: 'El propio Michael Leone, de Moor Insights and Strategy, advierte que la integración añade complejidad operativa real: dos catálogos de gobernanza distintos, modelos de costo separados y potencialmente múltiples cuentas de Snowflake por nube —lo que significa que, en lugar de resolver el problema de la dependencia de un proveedor, la empresa termina dependiendo simultáneamente de Oracle para el cómputo y de Snowflake para la capa de datos y análisis, con menos, no más, flexibilidad real para moverse de cualquiera de los dos el día que decida hacerlo.'
---

El 27 de octubre, en el escenario de Oracle AI World en Las Vegas, Oracle y Snowflake anunciaron que el AI Data Cloud de Snowflake —hasta ahora disponible solo sobre AWS, Microsoft Azure y Google Cloud— va a correr también como servicio nativo dentro de Oracle Cloud Infrastructure. El empaque de la noticia, repetido casi textualmente en el comunicado de ambas empresas, es que esto "elimina la fricción" de mover datos entre plataformas. Lo que ninguno de los dos comunicados dice —y lo que sí dicen, por separado, varios analistas independientes que cubrieron el anuncio— es que la fricción que desaparece no es el problema de fondo que las empresas llevan años tratando de resolver con sus estrategias multi-nube. Es, apenas, su síntoma más visible.

## Lo que Oracle y Snowflake anunciaron, en términos concretos

La mecánica del anuncio es relativamente simple de describir. Las empresas que tienen datos en Oracle Fusion Cloud Applications, NetSuite, Oracle Autonomous AI Database, MySQL HeatWave o Oracle NoSQL Database van a poder usar las capacidades de analítica e inteligencia artificial de Snowflake directamente sobre OCI, sin exportar esos datos a otra nube primero. El servicio se compra y se provisiona a través de Oracle, incluyendo la posibilidad de pagarlo con créditos universales de Oracle ya comprometidos —una decisión comercial tanto como técnica, que simplifica la facturación para el cliente pero también ata el gasto en Snowflake al presupuesto que la empresa ya tiene reservado para Oracle—. Ninguna de las dos compañías confirmó una fecha de disponibilidad general.

Es la cuarta vez que Snowflake extiende su plataforma a una nube de cómputo distinta. Hasta este anuncio, su oferta nativa vivía exclusivamente en AWS, Azure y Google Cloud —las tres hyperscalers que durante casi una década se repartieron, sin mucha disputa, la infraestructura de las empresas que adoptaron la nube pública—. Oracle, que llegó tarde a esa carrera y que durante años fue tratada por buena parte de la industria de datos como una nube "legacy" más que una alternativa competitiva, ahora se suma como el cuarto destino donde Snowflake corre de forma nativa, no como una integración de terceros.

## El argumento de "menos fricción" tiene evidencia real detrás

El argumento comercial de ambas compañías no es retórica vacía. Mover datos entre nubes distintas tiene un costo concreto y documentado: los cargos de salida de datos, conocidos como egress, rondan los 0.02 dólares por gigabyte o más según estimaciones de la industria citadas por firmas como Scality, y ese costo se multiplica cuando una empresa mueve, todas las noches, los mismos conjuntos de datos de ERP o finanzas entre su nube de cómputo y su plataforma de analítica. Ese tipo de cargo rara vez aparece en los modelos de costo total de propiedad que las empresas calculan al momento de adoptar una herramienta, y se acumula de forma silenciosa durante años.

Analistas consultados por la cobertura especializada coinciden en que el beneficio inmediato es real para un segmento específico de clientes: empresas que ya tienen una inversión significativa en aplicaciones de Oracle y que, hasta ahora, necesitaban construir y mantener sus propios pipelines de extracción y carga para llevar esos datos a Snowflake en otra nube. Ashish Chaturvedi, de HFS Research, señaló que los clientes grandes de aplicaciones Oracle que ya usan Snowflake serán los primeros beneficiados, y que los clientes de NetSuite —que con frecuencia tienen poca capacidad de ingeniería propia— podrían ganar una ruta nativa hacia Snowflake sin tener que contratar personal especializado para la integración.

## Por qué "eliminar la fricción" no es lo mismo que "eliminar la dependencia"

Aquí es donde el pitch comercial y el análisis técnico empiezan a divergir. Michael Leone, analista de Moor Insights and Strategy, advirtió sobre un costo que el comunicado de prensa no menciona: la integración, lejos de simplificar la arquitectura de una empresa, añade complejidad operativa real —dos catálogos de gobernanza de datos distintos que mantener sincronizados, modelos de costo separados que reconciliar, y la posibilidad de terminar con múltiples cuentas de Snowflake repartidas entre distintas nubes—. Stephanie Walter, de HyperFrame Research, matizó el beneficio desde otro ángulo: aunque los desarrolladores dedican menos tiempo a mover datos, siguen teniendo que gestionar integraciones, permisos y calidad de datos, sobre todo para cualquier fuente que no sea de Oracle.

La pregunta que ninguna de las dos empresas responde en su comunicado es, en el fondo, la más importante: ¿qué tan fácil es salir? Los datos que entran a Snowflake, incluso en este esquema "nativo", siguen existiendo como una copia —la duplicación de datos no desaparece, simplemente se vuelve menos costosa de mantener dentro del ecosistema Oracle-Snowflake—. Y las empresas cuyo cómputo vive principalmente en AWS o Azure no ganan nada directo con este anuncio: para ellas, sumar Oracle como una nube adicional solo para acceder a esta integración nativa significaría agregar un entorno más, con su propia sobrecarga operativa y su propio riesgo de deuda técnica, no eliminar ninguno de los que ya tienen.

## El concepto que explica por qué este patrón se repite

Este anuncio no es un caso aislado: es la enésima manifestación de lo que en la industria de infraestructura se conoce como "gravedad de datos" —la idea de que, entre más aplicaciones y más carga de trabajo se construyen alrededor de un conjunto de datos en un lugar específico, más difícil y costoso se vuelve moverlo de ahí—. Computer Weekly lo planteó en términos todavía más directos en un análisis reciente sobre la guerra de las nubes: la fuerza de atracción de una base de datos crece con cada aplicación nueva que se construye sobre ella, al punto de que las bases de datos pueden terminar siendo la forma de vendor lock-in más fuerte que existe en tecnología empresarial, más difícil de desmontar que cualquier contrato de cómputo.

Lo que cambia con este anuncio no es la gravedad en sí, sino dónde se concentra. Antes de este acuerdo, una empresa que quería moverse de Snowflake tenía, al menos en teoría, la opción de migrar también de nube de cómputo al mismo tiempo, si la urgencia lo justificaba. Con Snowflake disponible de forma nativa en las cuatro nubes grandes del mercado, esa opción se vuelve menos relevante: ya no importa en qué nube esté el cómputo de una empresa, porque Snowflake va a estar ahí también. La capa que de verdad concentra la dependencia deja de ser la nube de cómputo —donde sí existe competencia real entre AWS, Azure, Google Cloud y ahora Oracle— y pasa a ser la capa de datos y analítica, donde Snowflake, al volverse omnipresente, reduce la necesidad de que cualquier cliente evalúe seriamente una alternativa.

## Lo que el mercado de valores sí premió, sin ambigüedad

Mientras el debate sobre gravedad de datos y lock-in sigue abierto entre analistas de infraestructura, el mercado bursátil fue bastante más directo en su lectura: la acción de Snowflake subió 1.2% el día del anuncio, hasta 338.94 dólares, extendiendo un avance acumulado de 55% en lo que va de 2026 —casi triplicando su mínimo de abril durante la liquidación generalizada de software de ese mes—. El consenso de analistas sobre el precio objetivo de la acción ha subido de 229 dólares a fines de mayo hasta 427 dólares más recientemente, según cifras citadas por TIKR. Esa reacción no es una validación de si el acuerdo resuelve o no el problema de fondo del lock-in para los clientes: es, simplemente, el mercado reconociendo que Snowflake acaba de ampliar, de forma medible, la superficie de empresas que pueden quedar atadas a su plataforma sin importar qué hyperscaler elijan para el cómputo.

## La pregunta que cada CIO debería hacerse antes de firmar

Para cualquier equipo de datos que esté evaluando este anuncio como una simplificación de su arquitectura, la pregunta que vale la pena hacerse no es si reduce la fricción del día a día —probablemente sí lo hace, para el segmento de clientes con una base instalada fuerte en Oracle—, sino una distinta: si en dos o tres años esa misma empresa decidiera que necesita salir de Snowflake, ¿qué tan fácil sería hacerlo, y qué tanto de ese costo de salida se volvió más alto, no más bajo, por haber aceptado hoy la integración nativa? Esa es la pregunta que ningún comunicado de prensa va a responder por adelantado.

## Fuentes

- [Oracle Expands Native AI and Data Services on OCI with Snowflake](https://www.oracle.com/news/announcement/ai-world-oracle-expands-native-ai-and-data-services-on-oci-with-snowflake-2026-10-27/) — Oracle
- [Snowflake and Oracle Expand Their Partnership to Bring the Snowflake AI Data Cloud to OCI](https://www.snowflake.com/en/blog/snowflake-oracle-partnership-ai-data-cloud-oci/) — Snowflake
- [Oracle adds native Snowflake service to OCI to ease data integration](https://www.infoworld.com/article/4241574/oracle-adds-native-snowflake-service-to-oci-to-ease-data-integration.html) — InfoWorld
- [Snowflake stock rises 1.2% after partnership expansion with Oracle for AI Data Cloud](https://tradersunion.com/news/companies/show/3988664-snowflake-stock-rises-1-2percent-today/) — TradersUnion
- [Snowflake Is Up 55% in 2026 After AI's "Clear Inflection Point": Take Profits, or Buy More?](https://www.tikr.com/blog/snowflake-is-up-55-in-2026-after-ais-clear-inflection-point-take-profits-or-buy-more) — TIKR
- [Will databases be the kingmakers in the cloud wars?](https://www.computerweekly.com/blog/Data-Matters/Will-databases-be-the-kingmakers-in-the-cloud-wars) — Computer Weekly
- [Data gravity](https://www.starwindsoftware.com/blog/data-gravity/) — StarWind Software
