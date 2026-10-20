---
titulo: 'Durante quince años, la ortodoxia del dato moderno fue separar lo transaccional de lo analítico. Los agentes de IA están obligando a reconsiderarlo'
fecha: 2026-10-20
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - arquitectura de datos
  - HTAP
  - ETL
  - agentes de IA
  - CedarDB
  - Databricks
  - bases de datos
  - stack moderno de datos
  - decision intelligence
resumen: 'CedarDB, un spinout de la Universidad Técnica de Múnich, anunció esta semana la disponibilidad general de un motor de base de datos que procesa transacciones y análisis en el mismo sistema, apostando a que los agentes de IA necesitan algo que el stack moderno de datos —construido sobre la separación entre OLTP y OLAP— nunca estuvo diseñado para ofrecer: respuestas analíticas en milisegundos, no en horas.'
tesis: 'La arquitectura de "separar lo transaccional de lo analítico y conectarlas con ETL" se volvió la ortodoxia de la industria de datos porque los humanos que consumían los dashboards toleraban un retraso de horas entre que algo pasaba y que se reflejaba en un reporte; un agente de IA que debe decidir y actuar en el mismo flujo de ejecución no tolera ese mismo retraso, lo cual documenta que el problema de latencia no es una limitación técnica menor sino una característica estructural del stack de datos que la industria construyó para un consumidor —el humano con un dashboard— que ya no es el único que importa.'
datosClave:
  - valor: '€5.3 millones'
    etiqueta: 'Ronda semilla de CedarDB, liderada por Amplify Partners'
  - valor: '<1 segundo'
    etiqueta: 'Latencia que, según un keynote de Databricks en su Data + AI Summit 2026, era "imposible" de lograr en un almacén analítico tradicional'
    fuente: 'Databricks Data + AI Summit 2026'
  - valor: 'Horas'
    etiqueta: 'Retraso típico entre una transacción y su reflejo en un reporte analítico, en arquitecturas basadas en ETL programado'
imagen: /blog/portadas/cedardb-htap-agentes-ia-fin-del-etl.jpg
socialImagen: /blog/social/cedardb-htap-agentes-ia-fin-del-etl.jpg
gancho: 'Durante quince años la industria de datos construyó su stack entero sobre la idea de que lo transaccional y lo analítico debían vivir separados, conectados por un proceso que corre cada pocas horas. Un agente de IA que decide en segundos no tiene esas horas. ¿Qué pasa cuando el consumidor del dato deja de ser humano?'
postura:
  pregunta: '¿El regreso de las arquitecturas HTAP (transaccional + analítico unificado) es una respuesta genuinamente necesaria a cómo operan los agentes de IA, o es una narrativa conveniente que startups como CedarDB y gigantes como Databricks están usando para justificar productos que, de cualquier forma, ya querían vender?'
  aFavor: 'El argumento técnico es verificable sin depender de la narrativa de marketing: un agente de IA que ejecuta una transacción y necesita, en el mismo flujo de decisión, consultar el contexto analítico histórico para decidir su siguiente acción, efectivamente no puede esperar el ciclo de horas que un ETL programado introduce entre ambos sistemas —eso no es una exageración de vendedor, es una restricción de latencia inherente a cómo funcionan los agentes que operan en bucles de decisión rápidos, y tanto CedarDB como Databricks están resolviendo ese problema real con arquitecturas distintas pero dirigidas al mismo síntoma.'
  enContra: 'Es sospechoso que la industria entera de bases de datos —desde startups pequeñas como CedarDB hasta gigantes como Databricks y SAP— haya redescubierto simultáneamente las virtudes de HTAP, un concepto que Gartner acuñó en 2014 y que durante una década tuvo adopción limitada precisamente porque unificar ambas cargas de trabajo en un solo motor es costoso y técnicamente complejo; la coincidencia temporal con el boom de agentes de IA sugiere que gran parte de este relanzamiento es reposicionamiento de marketing sobre tecnología que ya existía, más que una innovación genuinamente nueva motivada por una necesidad real y urgente de los agentes.'
---

CedarDB, una base de datos fundada por cinco investigadores de la Universidad Técnica de Múnich, anunció esta semana la disponibilidad general de su motor tras un periodo de pruebas en beta, según reportó TechCrunch. El argumento de venta de la compañía no es nuevo en el sentido técnico —combinar procesamiento transaccional y analítico en el mismo sistema es un concepto que existe desde hace más de una década—, pero el momento en que lo está haciendo sí lo es: su director ejecutivo, Moritz Sichert, le dijo a TechCrunch que el enfoque de la empresa "ha ganado relevancia con el auge de la IA agéntica". Esa frase, repetida casi en los mismos términos por Databricks en su propia narrativa de producto este año, apunta a un cambio de fondo en cómo la industria de datos está empezando a cuestionar una de sus ortodoxias más asentadas.

## La separación que definió quince años de arquitectura de datos

Desde que el stack moderno de datos se consolidó, la práctica estándar ha sido mantener los sistemas transaccionales (OLTP, donde vive la base de datos operativa que procesa pedidos, pagos o inventario en tiempo real) completamente separados de los sistemas analíticos (OLAP, los almacenes de datos donde se agregan y consultan esos datos para generar reportes). Entre ambos corre un proceso de extracción, transformación y carga —ETL, o su variante más moderna ELT— que copia y transforma los datos del sistema transaccional hacia el analítico, típicamente en lotes programados cada cierta cantidad de horas. Esa arquitectura no fue una limitación técnica accidental: fue una decisión de diseño deliberada, porque ejecutar consultas analíticas pesadas directamente sobre la misma base de datos que procesa transacciones en vivo puede degradar el desempeño de ambas cargas de trabajo. Durante años, ese costo de desempeño fue perfectamente tolerable porque el consumidor final del dato analítico era un humano mirando un dashboard, y un humano no distingue entre un reporte actualizado hace quince minutos y uno actualizado hace cuatro horas.

## Por qué un agente de IA no tolera el mismo retraso

Un agente de IA que opera dentro de un flujo de decisión y ejecución automatizado no tiene esa misma tolerancia. Si un agente debe decidir si aprobar una transacción, ajustar un precio o escalar un caso de soporte, y esa decisión depende de contexto analítico histórico —cuántas veces este cliente ha hecho esto antes, cuál es el patrón reciente de esta cuenta—, el agente necesita esa respuesta dentro del mismo ciclo de ejecución en el que está procesando la transacción, no cuatro horas después cuando corra el siguiente batch de ETL. Un keynote de Databricks en su propia conferencia Data + AI Summit de este año describió esto con una cifra concreta: hasta hace poco, se consideraba prácticamente imposible lograr que una consulta sobre un almacén analítico tradicional se ejecutara en menos de un segundo. Para un dashboard humano, un segundo de más o de menos nunca importó. Para un agente que debe tomar cientos o miles de decisiones por minuto, cada milisegundo de latencia se multiplica directamente en el costo operativo y en la velocidad del sistema completo.

## Dos respuestas distintas al mismo síntoma

Lo interesante del momento actual es que, frente a este mismo problema, están emergiendo al menos dos respuestas arquitectónicas distintas y, hasta cierto punto, competidoras. CedarDB —junto con vendors más establecidos como SingleStore, SAP HANA y Oracle MySQL Heatwave, que llevan años en esta categoría— apuesta por lo que se conoce como HTAP en el motor: un único sistema de base de datos que procesa ambas cargas de trabajo internamente, con las actualizaciones transaccionales propagándose de forma asíncrona hacia las estructuras analíticas sin bloquear ninguna de las dos operaciones. Databricks, en cambio, con su producto Lakebase (un servicio compatible con PostgreSQL que llegó a disponibilidad general en febrero de este año), argumenta que unificar a nivel de motor es costoso y genera dependencia de un proveedor específico, y propone en su lugar unificar a nivel de almacenamiento —lo que la compañía llama LTAP—, manteniendo motores separados pero sobre una capa de datos compartida que elimina la necesidad de mantener copias duplicadas sincronizadas por ETL. Ninguna de las dos arquitecturas ha demostrado, en benchmarks independientes verificables, ser categóricamente superior a la otra; lo que sí comparten ambas es el diagnóstico del problema que están resolviendo.

## El escepticismo razonable sobre el momento del relanzamiento

Conviene ser cautelosos antes de aceptar sin más la narrativa de que los agentes de IA "obligaron" a esta reconsideración arquitectónica. Gartner acuñó el término HTAP en 2014, hace más de una década, y durante ese tiempo la categoría tuvo adopción real pero limitada: unificar cargas de trabajo transaccionales y analíticas en un solo sistema sigue siendo costoso de construir y operar bien, razón por la cual la industria entera —no solo CedarDB— se volcó durante años hacia la separación con ETL como el camino de menor resistencia. Que prácticamente toda la industria de bases de datos relanzara simultáneamente su interés en HTAP justo cuando el financiamiento y la atención del mercado se concentran en agentes de IA es, cuando menos, una coincidencia temporal conveniente para levantar capital y posicionar producto. Eso no invalida el argumento técnico de fondo —la restricción de latencia de los agentes es real y verificable independientemente de cualquier narrativa de marketing—, pero sí es razón suficiente para tratar las cifras de rendimiento que cada vendor publica sobre su propia arquitectura con el mismo escepticismo que cualquier comparación de desempeño patrocinada por quien la está anunciando.

## Por qué los incumbentes del stack moderno no pueden ignorar esto

La presión que este cambio ejerce sobre los incumbentes del stack moderno de datos —Snowflake, Databricks y los proveedores de orquestación de ETL como Fivetran— no es simétrica. Snowflake y Databricks, como almacenes analíticos, compiten directamente con la propuesta de valor de "unificar todo en un solo sistema" que ofrecen vendors HTAP como CedarDB, lo cual explica por qué Databricks respondió con su propia arquitectura (Lakebase/LTAP) en lugar de ignorar la tendencia. Los proveedores de orquestación de ETL, en cambio, enfrentan una amenaza más existencial a largo plazo: si el argumento de fondo de HTAP se sostiene —que para ciertas cargas de trabajo impulsadas por agentes, el ETL programado deja de ser una opción viable, no solo una opción subóptima—, entonces una porción de los casos de uso que hoy sostienen el negocio de orquestación de pipelines podría migrar hacia arquitecturas que directamente eliminan la necesidad de ese pipeline. Eso no significa que el ETL desaparezca —la gran mayoría de los casos de uso analíticos del mundo siguen sin involucrar agentes de IA operando en tiempo real, y seguirán sin involucrarlos durante años—, pero sí sugiere que el crecimiento futuro de esa categoría específica de herramienta probablemente se concentre cada vez más en los casos donde la latencia de horas sigue siendo aceptable, mientras el segmento de mayor crecimiento se desplaza hacia arquitecturas unificadas.

## El riesgo de sobrecorregir hacia la complejidad

Existe también un riesgo del lado contrario: que equipos de datos, presionados por la narrativa de que "los agentes de IA lo cambian todo", migren hacia arquitecturas HTAP para casos de uso que en realidad no lo requieren, incurriendo en el costo operativo y la complejidad adicional de un sistema especializado sin necesitar genuinamente su beneficio de latencia. La disciplina de ingeniería de datos que se construyó alrededor de la separación OLTP/OLAP durante la última década no era arbitraria: resolvía problemas reales de escalabilidad, costo y aislamiento de cargas de trabajo que una arquitectura unificada reintroduce en cierta medida, incluso cuando logra resolver el problema de latencia. La pregunta que cada equipo debe hacerse no es "¿deberíamos adoptar HTAP porque la industria lo está discutiendo?", sino "¿tenemos ya, o planeamos tener en el corto plazo, un agente que decida y actúe dentro del mismo flujo de ejecución donde ocurre la transacción, de forma que una espera de horas genuinamente rompa el caso de uso?". Para la mayoría de las organizaciones, hoy, la respuesta honesta sigue siendo que no.

## Lo que esto implica para cómo los equipos de datos deberían planear su stack

Para un equipo de datos que hoy mantiene la arquitectura clásica de separación con ETL, la pregunta práctica que este momento plantea no es si debe migrar de inmediato a una base de datos HTAP, sino si alguno de sus casos de uso actuales o planeados involucra a un agente de IA tomando decisiones en el mismo flujo de ejecución donde se genera la transacción. Para el reporte mensual que un gerente revisa el primer lunes del mes, la arquitectura clásica de ETL sigue siendo perfectamente adecuada y considerablemente más barata de operar que una base de datos HTAP especializada. El cambio de arquitectura se justifica específicamente cuando el consumidor del dato analítico deja de ser un humano con tolerancia a la espera y se convierte en un proceso automatizado que debe actuar sobre ese dato dentro de un presupuesto de latencia medido en milisegundos —una distinción que, conforme más decisiones operativas se deleguen a agentes, probablemente se vuelva menos una excepción especializada y más una pregunta estándar en cualquier evaluación de arquitectura de datos.

## Fuentes

- [CedarDB Founders Moritz Sichert, Lukas Vogel, Philipp Fent, Dominik Durner and Christian Winter](https://techcrunch.com/?p=3176253) — TechCrunch
- [CedarDB secures €5.3 million](https://www.munich-startup.de/en/131646/cedardb-secures-e5-3-million/) — Munich Startup
- [Why AI Requires Real-Time HTAP](https://www.gridgain.com/resources/blog/why-ai-requires-real-time-htap) — GridGain
- [Databricks is rebuilding the data stack for AI agents](https://thenewstack.io/databricks-is-rebuilding-the-data-stack-for-ai-agents/) — The New Stack
- [Transactional Analytics: Gartner's New Market Guide for HTAP](https://aerospike.com/blog/transactional-analytics-gartners-new-market-guide-htap/) — Aerospike
</content>
</invoke>
