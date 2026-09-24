---
titulo: 'Fivetran y dbt Labs ya no construyen su stack para analistas: lo están rediseñando para agentes de IA'
fecha: 2026-09-24
categoria: arquitectura
mundo: datos-como-negocio
tags:
  - Fivetran
  - dbt Labs
  - Snowflake
  - Databricks
  - MCP
  - arquitectura de datos
  - agentes de IA
  - gobernanza de datos
  - stack de datos
  - Model Context Protocol
resumen: 'El 16 de septiembre, Fivetran + dbt Labs anunció una capa de contexto para que agentes de IA consulten datos empresariales de forma confiable. No es un anuncio aislado: Snowflake y Databricks están convergiendo en la misma apuesta, y juntos describen un cambio de fondo en para quién se construye la infraestructura de datos.'
tesis: 'Durante quince años, la pila de datos empresarial se optimizó para un usuario final humano: el analista que arma un dashboard o corre una consulta SQL. El anuncio de Fivetran + dbt Labs, leído junto a los movimientos casi idénticos de Snowflake y Databricks, muestra que el usuario final que ahora define las decisiones de arquitectura es un agente de IA — y eso cambia qué se prioriza, qué se gobierna y quién controla el acceso a los datos de una empresa.'
datosClave:
  - valor: '$600 millones'
    etiqueta: 'ARR combinado de Fivetran + dbt Labs tras completar su fusión el 1 de junio de 2026'
  - valor: '+100,000'
    etiqueta: 'Equipos de datos que usan la plataforma combinada, incluyendo OpenAI, Zendesk, Coupa y HubSpot'
  - valor: '30%+'
    etiqueta: 'Reducción de cómputo en el warehouse que reporta dbt State, al saltarse modelos que no cambiaron'
  - valor: '3 plataformas'
    etiqueta: 'Fivetran+dbt Labs, Snowflake y Databricks convergieron por separado en la misma apuesta: agentes como unidad de cómputo, MCP como capa de protocolo'
imagen: /blog/portadas/fivetran-dbt-labs-datos-listos-para-agentes-ia.jpg
---

El 16 de septiembre, en el escenario del dbt Summit 2026, Fivetran + dbt Labs anunció la disponibilidad general de dbt v2, dbt State y una pieza nueva llamada Fivetran Context Layer, todavía en beta privada. En el comunicado de prensa, la palabra que se repite no es "rendimiento" ni "costo": es "agent-ready", listo para agentes. Tres meses después de completar su fusión —anunciada en octubre de 2025, cerrada el 1 de junio de 2026— la empresa combinada, que ya factura cerca de 600 millones de dólares al año y sirve a más de 100,000 equipos de datos, decidió que su próximo gran movimiento de producto no era hacer más rápido el trabajo de los analistas humanos, sino construir la infraestructura para que un agente de inteligencia artificial pueda consultar los datos de una empresa sin supervisión directa.

## Quince años optimizando para la persona equivocada

Desde que Fivetran popularizó el "ELT" (extraer, cargar, transformar) y dbt estandarizó cómo se documentan y prueban las transformaciones de datos, toda la industria compitió en la misma dimensión: qué tan rápido y barato le entregas datos limpios a un analista que arma un reporte. Snowflake y Databricks construyeron sus imperios resolviendo variantes del mismo problema —almacenamiento elástico, cómputo separado del almacenamiento, catálogos de datos— con el mismo usuario final en mente: una persona con un teclado y una pregunta de negocio. Ese diseño asumía implícitamente que quien consulta los datos entiende el contexto de la empresa, sabe qué tabla usar y puede detectar cuando un resultado no tiene sentido. Un agente de IA no trae ninguna de esas tres cosas por default, y ahí es donde el diseño de quince años deja de alcanzar.

## Lo que realmente anunció Fivetran + dbt Labs

El Fivetran Context Layer no es otro conector ni otra herramienta de transformación: es una capa que unifica datos y metadatos —incluyendo fuentes no estructuradas como documentación interna e hilos de Slack— en un formato llamado Agents Schema, un estándar abierto que se apoya en la estructura que dbt ya construye (modelos, pruebas, linaje) y le agrega el conocimiento tácito que normalmente vive en la cabeza de los analistas senior, no en ninguna tabla. Ese contexto queda accesible vía MCP y a través de integraciones ya disponibles con Anthropic y un plugin en ChatGPT. En otras palabras: el objetivo explícito es que un agente externo —no solo herramientas internas de la empresa— pueda preguntarle a los datos de una compañía y obtener una respuesta confiable sin que un humano intermedie cada consulta.

Junto con la capa de contexto, el anuncio incluyó dos piezas que parecen menores pero que revelan la misma prioridad desde otro ángulo: dbt Wizard, pensado para que alguien describa en lenguaje natural qué transformación necesita y el sistema genere el modelo dbt correspondiente, y dbt Charts, que mueve la visualización de datos un paso más cerca de la capa de transformación en lugar de dejarla enteramente en manos de herramientas de BI externas. Ninguna de las dos es revolucionaria por sí sola, pero juntas describen una estrategia consistente: reducir cada punto en el que un humano tiene que traducir una necesidad de negocio a una consulta técnica, porque ese punto de traducción es exactamente el que un agente de IA no necesita si el contexto ya está estructurado de antemano.

## No es una jugada de marketing aislada

Lo que le da peso a este anuncio es que Snowflake y Databricks, que llevan una década compitiendo desde ángulos distintos —uno desde el data warehouse, el otro desde el lakehouse—, llegaron por separado casi a la misma conclusión en sus eventos de este año: agentes como la unidad de cómputo principal, MCP como la capa de protocolo estándar, y gobernanza extendida para cubrir sistemas de IA, no solo usuarios humanos. Snowflake adquirió Natoma, una pasarela MCP que conecta agentes a sistemas empresariales, y expuso Cortex Analyst y Cortex Search como herramientas invocables directamente por agentes. Databricks construyó su Unity AI Gateway como capa de orquestación base, tratando servicios MCP como activos gobernados junto con modelos y agentes. Cuando tres compañías que compiten ferozmente entre sí —y que normalmente evitan parecerse— convergen en la misma arquitectura sin coordinarse, generalmente es porque el mercado ya tomó la decisión por ellas, no porque a los tres se les haya ocurrido lo mismo por casualidad.

## El problema que nadie está resolviendo todavía: quién audita al agente

Toda esta infraestructura nueva resuelve el problema de conectividad —cómo le doy a un agente acceso a mis datos— pero deja abierto uno más incómodo: cómo audito qué hizo ese agente con ese acceso. Un analista humano que corre una consulta mal formulada produce, en el peor caso, un reporte equivocado que alguien más revisa antes de tomar una decisión. Un agente con acceso vía MCP a un warehouse completo, ejecutando consultas de forma autónoma y a una velocidad que ningún humano audita en tiempo real, multiplica el radio de un error de la misma naturaleza. Los marcos de gobernanza que estas plataformas están construyendo —capas de permisos, catálogos de acceso, revisión de consultas— todavía están en una fase temprana comparados con la velocidad a la que se está desplegando el acceso mismo. Es la misma asimetría que ya se ha visto en otros rincones de la adopción de IA empresarial: la capacidad técnica de dar acceso llega antes que la disciplina organizacional para vigilarlo.

Este desfase no es exclusivo de Fivetran+dbt: es estructural a toda la categoría. Snowflake y Databricks describen sus capas de gobernanza —Horizon Catalog y Unity Catalog, respectivamente— en el mismo lenguaje de "extender los controles existentes a los agentes", lo que en la práctica significa adaptar permisos diseñados para usuarios que hacen una consulta a la vez a un escenario donde un agente puede disparar cientos de consultas encadenadas en segundos. Un permiso que parecía razonable para un analista —acceso de lectura a una tabla de ventas, por ejemplo— puede volverse un vector de fuga de información distinto cuando quien lo usa es un agente capaz de correlacionar esa tabla con docenas de otras fuentes en la misma sesión y sintetizar un hallazgo que ningún humano habría ensamblado manualmente. Ninguna de las tres plataformas ha publicado todavía un caso documentado de ese tipo de fuga, pero tampoco ha publicado una auditoría independiente que descarte que ya esté ocurriendo a menor escala.

## El veredicto de los usuarios, seis meses después de la fusión

Vale la pena contrastar el entusiasmo del anuncio con lo que dicen quienes ya usan la plataforma combinada. El veredicto más citado a seis meses de cerrada la fusión es literalmente "todavía no, pero hay que seguirle la pista": los pipelines existentes siguen funcionando sin fricción, pero la integración más profunda y el precio empaquetado que prometía la fusión no llegaron de un día para otro. Ese matiz importa porque el anuncio del 16 de septiembre —con su lenguaje ambicioso sobre agentes y estándares abiertos— se construye sobre una integración que los propios clientes describen todavía como un trabajo en progreso, no como una plataforma unificada y madura. La ambición del roadmap y la realidad operativa de hoy son cosas distintas, y la brecha entre las dos es exactamente donde suelen aparecer los problemas que ningún comunicado de prensa menciona.

## Lo que esto significa para quien compra estas herramientas, no solo para quien las vende

Para un equipo de datos que hoy decide en qué plataforma invertir, la pregunta relevante dejó de ser únicamente "¿qué tan rápido corre esta consulta?" y empezó a ser "¿qué tan bien puede un agente de IA entender el contexto detrás de esta tabla sin que yo se lo explique cada vez?". Esa pregunta todavía no tiene una respuesta estandarizada entre proveedores —cada uno construye su propia versión de "capa de contexto" con su propio vocabulario (Agents Schema en Fivetran+dbt, Unity Catalog en Databricks, Horizon Catalog en Snowflake)—, lo que significa que elegir plataforma hoy es también elegir, sin decirlo explícitamente, en qué ecosistema de agentes quedas encerrado mañana. La consolidación de proveedores que ya vivió esta industria (la fusión misma de Fivetran y dbt es un ejemplo) probablemente se acelera en la medida en que ese vocabulario de "listo para agentes" se vuelva el criterio de compra dominante.

¿Cuánto tiempo pasa entre que una plataforma anuncia que sus datos están "listos para agentes" y que un cliente real confía en un agente para tomar una decisión operativa sin revisión humana de por medio? Esa distancia —no la que hay entre el anuncio y el lanzamiento del producto— es la que de verdad va a decidir cuál de estas tres apuestas convergentes termina ganando.

## Fuentes

- [Fivetran + dbt Labs Announces New Capabilities to Make Enterprise Data Agent-Ready at dbt Summit 2026](https://www.fivetran.com/press/fivetran-dbt-labs-announces-new-capabilities-to-make-enterprise-data-agent-ready-at-dbt-summit-2026) — Fivetran
- [Fivetran + dbt Labs Complete Merger to Create the Data Infrastructure for Trusted AI Agents](https://www.fivetran.com/press/fivetran-dbt-labs-complete-merger-to-create-the-data-infrastructure-for-trusted-ai-agents) — Fivetran
- [Fivetran and dbt Merger Explained: What Changes for Your Data Stack (2026)](https://hevodata.com/learn/fivetran-dbt-merge/) — Hevo Data
- [Snowflake and Databricks Summits 2026: What Actually Matters](https://www.pointfive.co/blog/snowflake-and-databricks-summits-2026-what-actually-matters) — PointFive
- [Snowflake Expands Snowflake Intelligence and Cortex Code to Power the Control Plane for the Agentic Enterprise](https://www.snowflake.com/en/news/press-releases/snowflake-expands-snowflake-intelligence-and-cortex-code-to-power-the-control-plane-for-the-agentic-enterprise/) — Snowflake
- [Data Management News for the Week of September 18; Updates from dbt Labs, Fivetran, Imply & More](https://solutionsreview.com/data-management/data-management-news-for-the-week-of-september-18-updates-from-dbt-labs-fivetran-imply-more/) — Solutions Review
