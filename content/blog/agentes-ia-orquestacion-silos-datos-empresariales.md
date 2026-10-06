---
titulo: 'Por qué ningún cerebro humano puede sostener una estrategia entre áreas: la tesis de Harvard sobre agentes de IA y silos de datos'
fecha: 2026-09-29
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - orquestación de agentes
  - silos de datos
  - arquitectura de datos
  - Harvard Business Review
  - decisiones cross-funcionales
  - gobernanza de datos
  - ROT data
  - context engineering
  - IA empresarial
resumen: 'Un artículo de Harvard Business Review, con investigación de campo en Walmart, Amazon, Ericsson, Ramp y Medtronic, sostiene que las ejecuciones cross-funcionales fallan porque ningún cerebro humano puede sostener toda la información relevante de una decisión —y que la orquestación de agentes de IA, no la automatización de tareas individuales, es la respuesta real. El mismo mes, otro análisis mostró por qué ese diagnóstico corre el riesgo de fracasar si la limpieza de datos no lo acompaña.'
tesis: 'La orquestación de agentes entre silos organizacionales solo funciona si la arquitectura de datos que la sostiene distingue entre información vigente y datos redundantes, obsoletos o triviales —sin eso, la orquestación no resuelve el problema de coordinación que promete resolver: simplemente lo ejecuta más rápido y con mayor confianza aparente.'
datosClave:
  - valor: '5 empresas'
    etiqueta: 'Walmart, Amazon, Ericsson, Ramp y Medtronic, base de investigación de campo del estudio de Harvard Business Review'
  - valor: '70-90%'
    etiqueta: 'Ahorro en costos de tokens que logran los equipos que restructuran el contexto de sus agentes, según análisis de ingeniería de contexto'
  - valor: '54%'
    etiqueta: 'Porcentaje de empresas que citan los silos de datos como su principal obstáculo para escalar IA agéntica, según encuesta de HBR Analytic Services'
imagen: /blog/portadas/agentes-ia-orquestacion-silos-datos-empresariales.jpg
gancho: 'Ningún cerebro humano puede sostener toda la información de una decisión cross-funcional. Harvard dice que la solución son agentes que orquestan entre áreas. Pero si esos agentes heredan datos obsoletos, ¿están resolviendo el problema o solo ejecutándolo más rápido?'
socialImagen: /blog/social/agentes-ia-orquestacion-silos-datos-empresariales.jpg
---

Una decisión que involucra a ventas, logística, finanzas y manufactura al mismo tiempo casi nunca falla porque alguien tomó una mala decisión: falla porque nadie en la sala tenía toda la información necesaria para tomarla bien. Esa es la premisa detrás de un artículo publicado este mes en Harvard Business Review por Kris Johnson Ferreira, de Harvard Business School, y Jordan Tong, de la Universidad de Wisconsin: "ningún cerebro individual puede sostener toda la información relevante, las restricciones y los escenarios" que exige una decisión cross-funcional moderna. Los retrasos en la ejecución de estrategias que cruzan áreas, argumentan los autores, no son un problema de talento o de cultura organizacional: son la señal de que la organización superó su propia capacidad de orquestar decisiones.

## El diagnóstico antes de la solución

Lo que hace interesante este artículo no es la observación de que las empresas grandes son lentas para coordinar decisiones entre áreas —eso lleva décadas siendo un lugar común de la literatura de management—, sino el diagnóstico específico de por qué la IA aplicada tarea por tarea no resuelve ese problema. Ferreira y Tong distinguen entre la IA que optimiza una función aislada —un chatbot de atención al cliente, un modelo de pronóstico de demanda— y lo que llaman orquestación agéntica: sistemas que conectan herramientas de IA específicas de cada tarea con los flujos de trabajo organizacionales completos, de modo que la información fluya entre áreas sin que un humano tenga que cargarla manualmente de un sistema a otro. Basado en investigación de campo en Walmart, Amazon, Ericsson, Ramp y Medtronic, el artículo describe organizaciones donde el agente no reemplaza la decisión humana, sino que analiza, enruta información y expone los trade-offs que antes quedaban ocultos en el conocimiento tácito de alguna persona específica —mientras los humanos aportan contexto, fijan los límites de actuación y toman la decisión final.

## La distinción que separa esto de la automatización tradicional

Vale la pena marcar con precisión en qué se diferencia esta propuesta de la automatización de procesos que las empresas llevan intentando desde hace veinte años. Un sistema de automatización tradicional ejecuta un flujo predefinido: si pasa X, hacer Y. La orquestación agéntica que describe el estudio de Harvard es más parecida a dar a un coordinador de proyecto acceso simultáneo a los sistemas de todas las áreas involucradas, con la capacidad de detectar cuándo una decisión en logística afecta una restricción en finanzas que nadie en logística conocía. Esa diferencia —de ejecutar un flujo fijo a detectar dependencias que ningún humano tenía tiempo de rastrear manualmente— es lo que los autores identifican como la verdadera frontera de la IA empresarial en este momento, más que cualquier mejora incremental en la capacidad de un modelo individual.

## El obstáculo que el propio artículo no resuelve del todo

Hay, sin embargo, un supuesto implícito en toda esta propuesta que el artículo de Harvard trata de forma tangencial: para que un agente pueda "enrutar información" entre logística y finanzas con confianza, esa información tiene que ser correcta, vigente y no estar duplicada en tres sistemas con tres versiones distintas de la misma cifra. Una encuesta de HBR Analytic Services, publicada este mismo año, encontró que 54% de las empresas citan los silos de datos como su principal obstáculo para escalar IA agéntica —el mismo problema estructural que la orquestación promete resolver, pero que también es, precisamente, la condición previa que tiene que existir para que la orquestación funcione sin amplificar errores en lugar de corregirlos.

## Lo que un análisis publicado esta semana revela sobre ese riesgo

Un artículo publicado apenas ayer detalla con precisión técnica por qué ese riesgo no es teórico. El concepto que usa es ROT —datos redundantes, obsoletos y triviales— y su argumento central es que, en un sistema donde el costo se cobra por token procesado, un dato duplicado no es solo ruido: es un costo directo que se paga cada vez que el modelo lo procesa, y en un pipeline automatizado esa falla se reproduce en cada corrida, multiplicando su efecto sobre cada token gastado. Peor aún: un modelo no puede reconocer por sí solo que un hecho quedó obsoleto a menos que alguien se lo indique explícitamente, de modo que información superada se presenta con la misma confianza aparente que cualquier dato vigente. Aplicado al escenario que describe el estudio de Harvard, esto significa que un agente orquestando una decisión entre logística y finanzas podría estar combinando una cifra de inventario desactualizada con un dato financiero vigente, sin que ninguna de las dos partes del sistema tenga forma de detectar la discrepancia —y presentando el resultado combinado con la misma autoridad que si ambos datos fueran igualmente confiables.

## Por qué la ingeniería de contexto es la pieza que falta en la ecuación

La respuesta técnica a ese problema, según el mismo análisis, es lo que se conoce como ingeniería de contexto: una disciplina arquitectónica que automatiza el suministro continuo de datos vigentes a un sistema de IA, en lugar de dejar que cada consulta recoja lo que encuentre disponible en el momento. Los equipos que restructuran su contexto de esta manera —separando de forma sistemática lo redundante, lo obsoleto y lo trivial del resto— reportan ahorros de entre 70% y 90% en costos de tokens sin sacrificar calidad, según cifras citadas en ese análisis. Esa cifra importa más allá de lo puramente económico: si el ahorro viene de eliminar exactamente el tipo de dato que introduce error silencioso en una decisión orquestada, entonces la disciplina de contexto no es solo una optimización de costos, es la precondición técnica que separa una orquestación de agentes que realmente mejora la calidad de las decisiones cross-funcionales de una que simplemente ejecuta más rápido los mismos errores que ya existían.

## Lo que la elección de las cinco empresas revela

Vale la pena detenerse también en qué tipo de empresas eligieron Ferreira y Tong para su investigación de campo, porque la selección no es casual: Walmart, Amazon, Ericsson, Ramp y Medtronic son organizaciones que operan simultáneamente cadenas de suministro físicas complejas, sistemas financieros de alto volumen y ciclos de decisión regulados —no startups de software puro, donde la coordinación cross-funcional suele ser más sencilla por el simple hecho de tener menos capas organizacionales. Que el estudio se construya sobre este tipo de empresa sugiere que la tesis de la orquestación agéntica está pensada, desde el origen, para el tipo de organización donde el costo de una decisión mal coordinada se mide en inventario físico, cumplimiento regulatorio o contratos multimillonarios —no en la fricción menor de un equipo de producto que tarda una semana de más en lanzar una función. Es también, por extensión, el tipo de organización donde los silos de datos suelen ser más profundos: sistemas heredados, adquisiciones que nunca terminaron de integrarse, y departamentos que llevan años operando con sus propias definiciones de las mismas métricas.

## La pregunta de gobernanza que queda pendiente

Ninguno de los dos artículos aborda directamente quién es responsable cuando un agente de orquestación toma una decisión basada en datos incorrectos que ningún humano individual habría podido detectar a tiempo —una pregunta de gobernanza que se vuelve más urgente, no menos, a medida que la orquestación conecta más sistemas y más áreas de una organización. Si la ventaja central de estos sistemas es precisamente que ningún humano necesita sostener toda la información en su cabeza, entonces la responsabilidad última sobre una decisión mal informada tampoco puede recaer limpiamente en una sola persona: queda distribuida entre quien diseñó el sistema de orquestación, quien mantiene la calidad de los datos que ese sistema consume, y quien firmó la decisión final basándose en un resumen que el agente le presentó como confiable. Esa distribución de responsabilidad, más que cualquier detalle técnico sobre tokens o arquitectura de contexto, es probablemente el problema organizacional más difícil que esta tecnología va a exigir resolver en los próximos años.

## El riesgo de adoptar la conclusión sin la infraestructura

La tentación obvia, para cualquier organización que lea el argumento de Harvard sin el contrapeso del problema de los datos, es interpretar la orquestación agéntica como un proyecto de software: comprar o construir el sistema que conecta las herramientas de IA de cada área, y asumir que el problema de coordinación quedó resuelto en cuanto el sistema esté en producción. Lo que ambos artículos, leídos juntos, sugieren es que ese orden está invertido: la arquitectura de datos —la disciplina de distinguir qué información sigue siendo vigente y cuál ya no— tiene que preceder a la orquestación, no seguirla como una limpieza posterior. Una organización que despliega agentes de orquestación sobre una base de datos con silos, duplicados y registros obsoletos no está resolviendo el problema que Ferreira y Tong describen: está automatizando la velocidad a la que ese problema se propaga entre áreas, con la confianza añadida —y potencialmente engañosa— de que un sistema de IA lo está manejando.

## Fuentes

- [How AI Agents Orchestrate Work Across Silos](https://hbr.org/2026/09/how-ai-agents-orchestrate-work-across-silos) — Harvard Business Review
- [How AI Agents Orchestrate Work Across Silos - Article](https://www.hbs.edu/faculty/Pages/item.aspx?num=69358) — Harvard Business School, Faculty & Research
- [The hidden cost of ROT in AI context engineering](https://www.teiss.co.uk/artificial-intelligence/the-hidden-cost-of-rot-in-ai-context-engineering) — teiss
- [What Is ROT Data? Redundant, Obsolete and Trivial Data Management](https://www.komprise.com/glossary_terms/rot-data/) — Komprise
