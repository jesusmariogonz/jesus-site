---
titulo: 'Snowflake le acaba de dar a sus agentes de IA un diccionario de términos de negocio aprobados. El problema que no resuelve es quién decide qué significa "cliente"'
fecha: 2026-11-11
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - Snowflake
  - gobernanza de datos
  - agentes de IA
  - semántica empresarial
  - Business Ontology
  - Cortex AI
  - arquitectura de datos
  - decision intelligence
resumen: 'Snowflake presentó el 3 de noviembre "Business Ontology", una capa que permite a las empresas definir y aprobar conceptos de negocio —qué significa exactamente "ingreso neto" o "cliente"— para que sus agentes de IA dejen de inferir esas definiciones por su cuenta. La tecnología resuelve un problema real de infraestructura; no resuelve el problema organizacional, mucho más viejo, de que ventas, finanzas y operaciones ya definían esos mismos términos de forma distinta antes de que existiera ningún agente de IA.'
tesis: 'Que Snowflake haya construido una capa técnica para que los agentes de IA usen definiciones de negocio aprobadas, en lugar de inferencias propias, es un hecho documentado en el propio anuncio del producto; que esa capa resuelva el problema de fondo de la confiabilidad de los agentes es una expectativa que la evidencia disponible no sostiene, porque la tecnología automatiza la distribución de una definición, pero no resuelve quién tiene la autoridad para decidir cuál definición es la correcta cuando dos departamentos ya discrepan entre sí.'
datosClave:
  - valor: '3 de noviembre de 2026'
    etiqueta: 'Fecha del anuncio de Business Ontology y la expansión de Cortex AI Gateway, en la conferencia Expedition 2026 de Snowflake'
    fuente: 'Snowflake / InfoWorld'
  - valor: '95% de pilotos sin impacto medible'
    etiqueta: 'Proporción de pilotos empresariales de IA generativa que, según el MIT NANDA, no llegan a producción con un impacto medible en utilidades'
    periodo: '2025'
    fuente: 'MIT NANDA, "The GenAI Divide"'
  - valor: '3 capas de infraestructura semántica'
    etiqueta: 'Horizon Context (metadatos), Cortex Sense (inferencia automática) y Business Ontology (definiciones aprobadas), construidas una sobre otra en los últimos meses'
    fuente: 'Snowflake, vía InfoWorld'
imagen: /blog/portadas/snowflake-ontologia-negocio-agentes-ia-gobernanza-datos.jpg
socialImagen: /blog/social/snowflake-ontologia-negocio-agentes-ia-gobernanza-datos.jpg
gancho: 'Snowflake construyó, capa sobre capa, toda la infraestructura técnica para que un agente de IA sepa qué significa "ingreso neto" dentro de una empresa. Lo que ningún producto de software puede construir es el acuerdo entre ventas y finanzas sobre cuál de sus dos definiciones, hasta ahora distintas, es la correcta.'
postura:
  pregunta: '¿La automatización de la gobernanza semántica que ofrece Business Ontology —inferir definiciones con Cortex Sense y formalizarlas con un flujo de aprobación— reduce genuinamente la carga organizacional de mantener definiciones de negocio consistentes, o simplemente traslada ese mismo trabajo humano de decidir y reconciliar significados a un paso adicional dentro de una interfaz, sin eliminar la necesidad de que alguien con autoridad real tome esas decisiones?'
  aFavor: 'Que una herramienta infiera automáticamente las definiciones más probables a partir de metadatos y patrones de uso —en lugar de exigir que un equipo las documente desde cero— reduce de forma genuina la carga inicial de un proceso de gobernanza que, históricamente, muchas organizaciones nunca llegaban a completar por falta de tiempo; convertir un trabajo de "documentar desde cero" en uno de "revisar y aprobar una propuesta ya generada" es una reducción de fricción real, no cosmética.'
  enContra: 'Ninguna automatización de inferencia resuelve la pregunta de autoridad que un analista de HFS Research ya señaló explícitamente sobre este mismo producto: cuando ventas y finanzas tienen definiciones distintas de qué es un "cliente", alguien con poder organizacional real —no una herramienta de software— tiene que decidir si se reconcilian en una sola definición o se mantienen separadas y etiquetadas por contexto; la tecnología puede proponer una definición plausible, pero no puede resolver el conflicto de intereses departamentales que explica, en primer lugar, por qué esas definiciones nunca se habían unificado.'
---

El 3 de noviembre, en su conferencia Expedition 2026, Snowflake presentó Business Ontology: una capa dentro de su Horizon Catalog que permite a las empresas definir y aprobar formalmente qué significan sus propios conceptos de negocio —ingreso neto, cliente activo, margen operativo— con un responsable asignado y una conexión explícita a las tablas y vistas de datos subyacentes. El objetivo declarado es que los agentes de inteligencia artificial que una empresa despliega dejen de inferir esas definiciones por su cuenta, con el riesgo de que cada agente interprete "ingreso neto" de una forma ligeramente distinta, y en su lugar consulten una fuente única y aprobada. Es una pieza de infraestructura técnica genuinamente útil. También es, en un sentido importante, la versión más reciente de un problema que las empresas llevan años sin resolver, ahora con la urgencia añadida de que un agente autónomo puede propagar una definición equivocada a una velocidad que ningún analista humano alcanzaría.

## Tres capas construidas una sobre otra, en apenas meses

Business Ontology no llegó sola. Se apoya en Horizon Context, la capa de gestión de metadatos que Snowflake lanzó en junio para recolectar y organizar información sobre cómo se usan los datos dentro de una organización, y en Cortex Sense, el motor que infiere automáticamente significados de negocio a partir de esos mismos metadatos y patrones de uso. La secuencia —primero capturar metadatos, después inferir significados probables, finalmente formalizar y aprobar esos significados como reglas oficiales— describe, en esencia, el ciclo completo de gobernanza de datos que los equipos de analítica empresarial han intentado construir manualmente durante más de una década, comprimido ahora en un producto que promete automatizar buena parte del trabajo. La diferencia no es conceptual: es de velocidad y de quién hace el trabajo pesado inicial.

## Lo que la automatización sí resuelve

Vale la pena ser justos con lo que esta tecnología efectivamente mejora. El cuello de botella más común en cualquier iniciativa de gobernanza de datos nunca ha sido la falta de voluntad para tener definiciones consistentes —casi ninguna organización defiende activamente tener ambigüedad—, sino el costo de documentar, desde cero, cientos de términos de negocio dispersos en sistemas distintos, sin que nadie tenga tiempo asignado para esa tarea. Que una herramienta pueda proponer automáticamente una definición plausible de "cliente activo" a partir de cómo esa tabla se ha usado realmente en consultas y reportes durante meses, en lugar de exigir que un analista la redacte y valide desde el primer borrador, reduce genuinamente esa fricción inicial. Michael Ni, analista de Constellation Research, señaló que definiciones compartidas y mantenidas de forma centralizada pueden reducir inconsistencias entre agentes y facilitar el mantenimiento de aplicaciones agénticas cuando los requisitos cambian con el tiempo —una mejora operativa real, no marketing vacío.

## El problema que ningún motor de inferencia puede resolver por sí solo

Pero hay un límite estructural que la propia cobertura especializada ya identificó con precisión. Ashish Chaturvedi, analista de HFS Research, lo planteó de forma directa: cada término central necesita un responsable asignado por nombre, y una revisión cada vez que cambian las reglas de precios, productos o reportes —y, más importante todavía, ventas, finanzas y operaciones pueden tener interpretaciones distintas de qué constituye un "cliente" o un "ingreso". Esa observación no es una crítica menor al producto: es el recordatorio de que la pregunta que de verdad bloquea la gobernanza de datos en la mayoría de las organizaciones nunca ha sido técnica. Es política, en el sentido más literal del término: qué departamento tiene la autoridad para imponer su definición sobre los demás, y qué pasa cuando ninguno está dispuesto a cederla.

## Por qué esto importa más ahora que hace tres años

Antes de que los agentes de IA pudieran actuar de forma autónoma sobre datos empresariales, una definición ambigua de "cliente activo" generaba, en el peor de los casos, un reporte inconsistente que un analista humano eventualmente detectaba y corregía —un costo real, pero contenido y visible—. Un agente autónomo que toma decisiones o genera reportes a partir de esa misma ambigüedad puede propagar el error a una escala y velocidad que ningún proceso de revisión manual puede seguir en tiempo real, especialmente si ese agente opera en múltiples flujos de trabajo simultáneos. El informe del MIT NANDA sobre el estado de la IA generativa en las empresas, publicado en 2025, documentó que alrededor de 95% de los pilotos de IA generativa empresarial no llegan a producción con un impacto medible en utilidades, y atribuyó buena parte de ese fracaso a una "brecha de aprendizaje" —sistemas que no retienen contexto ni se adaptan con el tiempo— más que a limitaciones del modelo en sí. Una capa de definiciones de negocio mal gobernada, sobre la cual un agente opera con total confianza, es exactamente el tipo de fragilidad silenciosa que explicaría por qué un piloto que funciona en una demostración controlada falla al escalar a producción real.

## El riesgo de confundir gobernanza automatizada con gobernanza resuelta

El peligro específico de una herramienta como Business Ontology no es que falle en hacer lo que promete —es razonable esperar que sí reduzca la fricción de documentación inicial—, sino que su existencia misma pueda convencer a una organización de que ya resolvió su problema de gobernanza de datos simplemente por haber adoptado la herramienta, sin haber resuelto todavía la disputa de fondo entre departamentos sobre qué definición es la correcta. Los controles adicionales que Snowflake añadió a su Cortex AI Gateway —Sandboxes para aislar código que escriben los propios agentes, Trace Intelligence para auditar su ejecución, Abuse Detection para identificar cuándo un agente opera fuera de los permisos que se le otorgaron— atienden un riesgo distinto y real, el de que un agente haga algo que no debería hacer con los permisos que ya tiene. Ninguno de esos controles, sin embargo, verifica si la lógica de negocio detrás de la respuesta de un agente —la definición exacta de "ingreso neto" que usó para calcular una cifra— es la que la empresa, como organización, realmente había decidido adoptar, porque en demasiados casos esa decisión organizacional todavía no se ha tomado.

## Un problema con un nombre distinto cada década

Las empresas que ya pasaron por un proyecto de Master Data Management hace diez o quince años reconocerán este patrón casi palabra por palabra. La promesa de esas iniciativas era, en esencia, la misma: una "fuente única de verdad" para los conceptos centrales del negocio, con herramientas que automatizaban buena parte del trabajo de catalogación y reconciliación. Muchos de esos proyectos de MDM no fracasaron porque el software fuera incapaz de hacer lo que prometía técnicamente, sino porque la gobernanza organizacional —decidir quién tenía la autoridad final sobre cada dominio de datos, y sostener esa decisión frente a la resistencia de los departamentos que perdían control sobre su propia definición— nunca llegó a institucionalizarse con la misma seriedad que la plataforma técnica. Que el mismo problema reaparezca ahora bajo el nombre de "ontología de negocio para agentes de IA", con una arquitectura más sofisticada y un motor de inferencia automatizado, no garantiza que la parte organizacional —la que de verdad determinó el éxito o el fracaso de la generación anterior de estas iniciativas— se resuelva de forma distinta esta vez.

## La pregunta que cada empresa que adopte esto debería hacerse primero

Antes de implementar cualquier capa de ontología de negocio para gobernar a sus agentes de IA, la pregunta que una organización debería responder no es técnica —qué tan bien infiere Cortex Sense un significado probable a partir de metadatos—, sino organizacional: ¿quién, exactamente, tiene la autoridad final para aprobar que "cliente activo" significa una cosa y no otra, cuando dos vicepresidencias llevan años operando con definiciones distintas y ninguna fue, hasta ahora, obligada a ceder? Una herramienta que automatiza la propuesta de esa definición es valiosa. Una herramienta que resuelve, por sí sola, quién tiene el poder de decidir cuál propuesta se adopta, todavía no existe —y es poco probable que el software, por sofisticado que sea, llegue a resolver ese tipo de disputa sin que alguien dentro de la organización tome primero una decisión que ningún algoritmo puede tomar en su lugar.

## Fuentes

- [Snowflake Helps Enterprises Deploy AI Agents with Trusted Business Context and Built-In Controls](https://www.snowflake.com/en/news/press-releases/expedition-2026-business-ontology-ai-gateway/) — Snowflake
- [Snowflake launches business ontology to boost AI agent reliability](https://www.infoworld.com/article/4243932/snowflake-launches-business-ontology-to-boost-ai-agent-reliability.html) — InfoWorld
- [Snowflake ups AI agent context, governance game](https://www.constellationr.com/insights/news/snowflake-ups-ai-agent-context-governance-game) — Constellation Research
- [Five Takeaways from MIT's "State of AI in Business": Why 95% of GenAI Pilots Stall](https://chainsofthoughts.substack.com/p/five-takeaways-from-mits-state-of) — Chains of Thoughts (vía MIT NANDA)
