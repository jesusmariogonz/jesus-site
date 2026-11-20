---
titulo: 'El shadow AI duplicó su tasa de incidentes en un año. El mismo reporte que lo documenta revela qué tan poco se sabe todavía sobre cómo arreglarlo'
fecha: 2026-11-20
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - shadow AI
  - gobernanza de datos
  - linaje de datos
  - IBM
  - ciberseguridad
  - agentes de IA
  - gestión de riesgo
  - data governance
resumen: 'El Cost of a Data Breach Report 2026 de IBM y Ponemon Institute encontró que los incidentes de seguridad vinculados a "shadow AI" —uso de herramientas de inteligencia artificial sin aprobación ni visibilidad de TI— más que se duplicaron en un año, de 20% a 43% de las organizaciones encuestadas. Un reporte publicado el 4 de noviembre, producido por MIT Technology Review Insights junto con la firma Cyberhaven, propone el linaje de datos como la solución —pero su propia presentación no ofrece evidencia independiente de que esa solución funcione, más allá de un escenario hipotético.'
tesis: 'Que los incidentes de shadow AI casi se hayan duplicado en un año, y que la mayoría de las organizaciones afectadas carezca de controles de acceso de IA adecuados, son hechos documentados por el propio reporte de IBM y Ponemon; que el linaje de datos sea la solución a ese problema —la tesis central del reporte de MIT Technology Review Insights y Cyberhaven— es la propuesta de una firma que vende precisamente esa tecnología, presentada con un escenario ilustrativo en vez de evidencia medida de que la herramienta reduce el problema que describe.'
datosClave:
  - valor: '20% → 43%'
    etiqueta: 'Organizaciones que reportaron incidentes de shadow AI, de 2025 a 2026'
    periodo: '2025-2026'
    fuente: 'IBM / Ponemon Institute'
  - valor: '92%'
    etiqueta: 'Organizaciones con un incidente relacionado con IA que carecían de controles de acceso de IA adecuados'
    periodo: '2026'
    fuente: 'IBM / Ponemon Institute'
  - valor: '19%'
    etiqueta: 'Organizaciones donde los equipos de gobernanza y de seguridad reportaron coordinación entre sí'
    periodo: '2026'
    fuente: 'IBM / Ponemon Institute'
imagen: /blog/portadas/shadow-ai-linaje-datos-gobernanza-ibm-cyberhaven.jpg
socialImagen: /blog/social/shadow-ai-linaje-datos-gobernanza-ibm-cyberhaven.jpg
gancho: 'Los incidentes de shadow AI se duplicaron en un año. La solución que un reporte reciente propone para arreglarlo viene, sin sorpresa, de la empresa que vende esa misma solución —y su propia presentación no prueba que funcione, solo lo ilustra con un escenario que nunca ocurrió.'
postura:
  pregunta: '¿El linaje de datos —rastrear qué información entra a un agente de IA, de dónde viene y a dónde va— es la pieza de infraestructura que realmente le falta a la gobernanza empresarial de IA, o es la respuesta que cualquier proveedor de esa tecnología ofrecería sin importar cuál sea el problema real?'
  aFavor: 'El propio reporte de IBM documenta que 92% de las organizaciones con un incidente de IA carecían de controles de acceso adecuados y que solo 19% tenía coordinación entre sus equipos de gobernanza y seguridad —ambos son, en esencia, problemas de visibilidad sobre qué datos tocan los sistemas de IA, exactamente el tipo de brecha que una herramienta de linaje de datos está diseñada para cerrar, independientemente de quién la venda.'
  enContra: 'Que una firma que vende software de linaje de datos presente un escenario hipotético —nunca un incidente real, nunca una medición de antes y después— como la prueba central de que su categoría de producto resuelve el problema de shadow AI, es exactamente el patrón que debería generar escepticismo: la misma brecha de gobernanza podría cerrarse con controles de acceso más simples, mejor capacitación o políticas de aprobación de herramientas, sin necesariamente requerir una nueva capa de infraestructura de linaje.'
---

Dos números, publicados por la misma fuente, describen la misma tendencia desde ángulos que no deberían sorprender a nadie que haya seguido la adopción de IA generativa en el entorno corporativo: según el Cost of a Data Breach Report 2026 de IBM y Ponemon Institute, los incidentes de seguridad vinculados a "shadow AI" —el uso de herramientas de inteligencia artificial sin aprobación ni visibilidad del departamento de TI— pasaron de afectar a 20% de las organizaciones encuestadas en 2025 a 43% en 2026. Más del doble en doce meses. El costo promedio de esos incidentes, $5.39 millones de dólares, también superó el promedio global de $4.99 millones. Es la clase de estadística que cualquier área de seguridad empresarial ya esperaba ver, dado cuánto ha crecido el uso informal de chatbots y asistentes de IA dentro de las organizaciones este año.

## El dato que debería preocupar más que el titular

Lo más revelador del reporte no es la duplicación en sí, sino lo que describe sobre la capacidad de respuesta de las organizaciones afectadas. De las empresas que sufrieron un incidente relacionado con IA, 92% carecía de controles de acceso de IA adecuados. Solo 19% reportó coordinación real entre sus equipos de gobernanza y de seguridad —es decir, en más de 4 de cada 5 organizaciones, las personas responsables de decidir qué está permitido y las personas responsables de detectar cuando algo sale mal operan, en la práctica, de forma desconectada. Y el porcentaje de organizaciones que ya tenían políticas de gobernanza de IA implementadas, no solo en desarrollo, cayó de 37% a 32% entre 2025 y 2026 —un retroceso, no un avance, en el mismo año en que los incidentes casi se duplicaron.

Leído en conjunto, el cuadro que pinta IBM no es el de una tecnología nueva que las empresas todavía no entienden del todo. Es el de una tecnología que se está adoptando más rápido que la capacidad organizacional de gobernarla, con los equipos responsables de hacerlo trabajando, en la mayoría de los casos, sin coordinación entre sí.

Los números detrás de esos incidentes tampoco son uniformes entre sí, lo que importa para entender qué tipo de daño produce el shadow AI en la práctica. Según el mismo reporte, 49% de los incidentes de shadow AI provocó pérdida o compromiso de datos, 42% interrumpió operaciones y 35% generó daño reputacional —tres consecuencias distintas, con costos y tiempos de recuperación distintos, agrupadas bajo la misma etiqueta. Aproximadamente uno de cada cinco incidentes de shadow AI también desencadenó una multa regulatoria, lo que añade una cuarta dimensión de costo que no siempre se refleja en el promedio de $5.39 millones de dólares por incidente.

## La solución que llegó, puntualmente, de quien la vende

El 4 de noviembre, MIT Technology Review Insights publicó, en colaboración con la firma de seguridad de datos Cyberhaven, una pieza titulada "Securing the Agentic Enterprise With Data Lineage" —contenido patrocinado, etiquetado explícitamente como tal, y producido por el área de contenido comercial de la publicación, no por su redacción editorial—. Su argumento central: "la seguridad de la IA no es un problema de herramientas; es un problema de visibilidad de datos", y la solución propuesta es establecer linaje de datos —rastrear de dónde viene cada pieza de información, cómo se transforma y hacia dónde se redistribuye— como "el nuevo perímetro de seguridad para la IA agéntica".

Es, en abstracto, un argumento razonable: si el problema de fondo es que nadie sabe qué datos está tocando un agente de IA en un momento dado, entonces una herramienta que rastree ese flujo de datos ataca directamente la causa, no el síntoma. El problema es la evidencia que la propia pieza ofrece para sostenerlo. En vez de un incidente real documentado, el artículo construye su caso alrededor de un escenario hipotético: un vendedor le pide a un agente de IA información de precios, el agente jala datos de "sistemas de precios restringidos, comunicaciones internas y cotizaciones archivadas", un segundo agente redacta una propuesta con esa información sin que ningún humano revise el paso intermedio, y datos confidenciales terminan filtrados en un documento que nadie puede rastrear hasta su origen. El propio texto lo introduce como algo que "ilustra" el problema —nunca como algo que ocurrió.

## Por qué el escenario hipotético no es, por sí solo, un defecto fatal

Vale la pena ser justos con el argumento antes de descartarlo: que una pieza de contenido patrocinado use un escenario ilustrativo en vez de un caso documentado no significa que el problema que describe sea falso —el propio reporte de IBM, que no tiene ningún interés comercial en vender software de linaje, ya estableció con cifras reales que la brecha de visibilidad y coordinación existe—. Lo que el escenario hipotético sí revela es que, al momento de presentar su propia categoría de producto como la solución, Cyberhaven no tuvo —o no mostró— un caso real donde la implementación de linaje de datos efectivamente haya evitado, contenido o reducido el costo de un incidente de shadow AI. La página que promueve el reporte completo cita estadísticas reales (63% de las organizaciones víctimas de brechas carecía de políticas de gobernanza de IA, según IBM; 39.7% de las interacciones con herramientas de IA involucran datos sensibles, según los propios laboratorios de Cyberhaven) pero ninguna de ellas mide específicamente si el linaje de datos, como categoría de herramienta, reduce esas cifras una vez implementado.

## El patrón que esto repite, fuera del caso específico de Cyberhaven

Esto no es un problema exclusivo de una empresa ni de una categoría de producto: es el patrón estándar con el que la industria de infraestructura de datos ha vendido cada nueva capa de gobernanza durante la última década, desde catálogos de datos hasta herramientas de calidad de datos y ahora linaje para IA agéntica. Un problema real y medido —en este caso, documentado por una fuente independiente como IBM— se convierte en la justificación de mercado para una categoría de producto específica, presentada con el lenguaje de la urgencia ("la seguridad de la IA no es un problema de herramientas... salvo esta herramienta en particular") pero sin el tipo de evidencia de eficacia que debería acompañar cualquier inversión de infraestructura empresarial significativa. Eso no convierte al linaje de datos en una mala idea —la lógica de que no se puede gobernar lo que no se puede ver es, en principio, sólida—, pero sí significa que cualquier equipo de datos que esté evaluando esta categoría de herramientas debería exigir la misma evidencia que exigiría a cualquier otra inversión: casos de implementación real, medición de antes y después, y comparación honesta contra alternativas más simples, como controles de acceso reforzados o mejor coordinación entre los equipos de gobernanza y seguridad que, según el propio reporte de IBM, hoy casi no se hablan entre sí.

## Lo que un equipo de datos debería preguntarse antes de comprar la solución de moda

La pregunta práctica que se desprende de cruzar ambos reportes no es si el linaje de datos ayuda —probablemente, en algún grado, sí—, sino si es la inversión con mejor retorno frente a los dos problemas más baratos y mejor documentados que el propio reporte de IBM identifica: la falta de controles de acceso (92% de los incidentes) y la falta de coordinación entre gobernanza y seguridad (81% sin coordinación). Ninguno de los dos requiere necesariamente una nueva plataforma de infraestructura; ambos son, en el fondo, problemas organizacionales y de políticas que preceden a cualquier herramienta técnica. Comprar linaje de datos antes de resolver esos dos problemas más básicos sería, en el mejor de los casos, construir visibilidad sobre una base de gobernanza que la propia estadística de IBM muestra que se está debilitando, no fortaleciendo, en la mayoría de las organizaciones.

Hay, además, una secuencia lógica que se suele saltar cuando una organización compra una herramienta nueva antes de tiempo: el linaje de datos solo es útil si alguien tiene la autoridad y el proceso para actuar sobre lo que esa herramienta revela. Saber que un agente tocó datos de precios restringidos no evita la filtración si no existe, de entrada, un control de acceso que le impidiera tocarlos, ni un equipo de gobernanza que revise esa alerta a tiempo y con autoridad para intervenir. En ese sentido, el linaje de datos es una capa que añade valor real una vez que las dos capas más básicas —acceso y coordinación— ya existen, no un sustituto de ellas. Comprarlo en el orden equivocado no es necesariamente un desperdicio, pero sí reduce buena parte del retorno que la categoría promete en su propio material de ventas.

## Fuentes

- [Securing the Agentic Enterprise With Data Lineage](https://www.technologyreview.com/2026/11/04/1147596/securing-the-agentic-enterprise-with-data-lineage/) — MIT Technology Review Insights (contenido patrocinado, en colaboración con Cyberhaven)
- [Securing the Agentic Enterprise With Data Lineage (landing page del reporte completo)](https://www.cyberhaven.com/resources/research/mit-data-lineage-agentic-ai) — Cyberhaven
- [The IBM 2026 Cost of a Data Breach Report Proves AI Governance Failure, Not AI Itself, Is Driving Costs](https://www.kiteworks.com/cybersecurity-risk-management/ibm-2026-breach-report-ai-governance/) — Kiteworks, sobre el reporte de IBM y Ponemon Institute
- [Policy without control: the AI governance gap in IBM's 2026 Cost of a Data Breach Report](https://complexdiscovery.com/policy-without-control-the-ai-governance-gap-in-ibms-2026-cost-of-a-data-breach-report/) — ComplexDiscovery
