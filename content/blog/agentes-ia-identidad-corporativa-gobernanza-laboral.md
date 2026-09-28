---
titulo: 'Los agentes de IA ya tienen dueño, credenciales y proceso de baja: lo que revela tratarlos como empleados'
fecha: 2026-09-28
categoria: business-analytics
mundo: ia-nueva-economia
tags:
  - agentes de IA
  - gobernanza de IA
  - Microsoft Agent 365
  - Google Workspace
  - Anthropic
  - adopción empresarial
  - productividad
  - identidad digital
  - futuro del trabajo
resumen: 'Microsoft, Google y Anthropic lanzaron en las últimas dos semanas infraestructura para tratar a los agentes de IA como recursos organizacionales con dueño, identidad y ciclo de vida —el mismo aparato que hasta ahora se reservaba para empleados humanos. La pregunta que esa infraestructura obliga a hacer no es técnica: es si las empresas están, sin haberlo decidido del todo, contratando una fuerza de trabajo digital.'
tesis: 'Cuando una empresa necesita transferir la "propiedad" de un agente de IA porque la persona que lo creó dejó la organización, ya no está gestionando software: está gestionando algo que se comporta, en la práctica administrativa, como un puesto de trabajo —y esa distinción tiene consecuencias reales sobre cómo se cuenta, se presupuesta y se responsabiliza el trabajo que antes hacía solo gente.'
datosClave:
  - valor: '72%'
    etiqueta: 'De las empresas con al menos una carga de trabajo de IA en producción en 2026, frente a 55% en 2024 y 20% en 2020'
  - valor: '42%'
    etiqueta: 'De las empresas que abandonaron la mayoría de sus iniciativas de IA el año pasado, frente a 17% el año anterior'
  - valor: '2,000+'
    etiqueta: 'Conectores y plugins disponibles en el Claude Marketplace de Anthropic, lanzado el 23 de septiembre de 2026'
  - valor: '40%'
    etiqueta: 'De las aplicaciones empresariales que tendrán agentes de IA integrados para fines de 2026, según proyección de Gartner (menos de 5% en 2025)'
imagen: /blog/portadas/agentes-ia-identidad-corporativa-gobernanza-laboral.jpg
socialImagen: /blog/social/agentes-ia-identidad-corporativa-gobernanza-laboral.jpg
---

Cuando un empleado deja una empresa, hay un proceso conocido: se revocan accesos, se transfieren archivos a un nuevo dueño, se reasignan las tareas pendientes. Ese mismo proceso —con el mismo vocabulario— es, desde hace apenas unas semanas, lo que Google Workspace ofrece a sus administradores para los agentes de IA que creó un empleado antes de irse. No es una metáfora ni una forma de hablar: es una función de producto, con un botón que dice "transferir propiedad", diseñada porque las empresas empezaron a encontrarse con agentes huérfanos —construidos por alguien que ya no está, ejecutándose sin que nadie supiera bien de quién eran ni qué hacían con los permisos que tenían.

## La semana en que los agentes empezaron a tener expediente

En el espacio de pocos días de esta última quincena, tres de los proveedores más grandes de infraestructura de IA empresarial lanzaron piezas que, vistas juntas, dibujan un mismo movimiento. Microsoft puso en vista previa pública, el 25 de septiembre, su Copilot Managed Runtime: infraestructura que corre aplicaciones creadas con IA dentro del entorno de Microsoft 365 de una organización, con identidad de Entra, políticas de acceso a datos y endpoints, versionado, monitoreo y un inventario administrado desde el centro de administración. Google, dentro de lo que ahora se llama Gemini Enterprise, dio a sus administradores la capacidad de compartir y transferir la propiedad de agentes creados por empleados, con la salvedad técnica de que si el agente transferido tenía un disparador programado o basado en eventos, ese disparador queda desactivado hasta que el nuevo dueño lo reactive manualmente —una fricción deliberada, pensada para que nadie herede un agente activo sin darse cuenta de qué está a punto de correr. Y Anthropic, el 23 de septiembre, abrió su Claude Marketplace: un catálogo unificado con más de 2,000 conectores y plugins, una sección de agentes y productos con software de compañías como CrowdStrike, Cursor y Snowflake, y socios de servicio como Accenture, BCG y Deloitte —diseñado explícitamente para que el gasto comprometido que una empresa ya tiene con Anthropic sirva para comprar herramientas de terceros dentro del mismo catálogo.

## Por qué esto no es solo una actualización de producto

Lo que las tres piezas comparten no es la funcionalidad específica, sino la categoría de problema que intentan resolver: todas asumen que un agente de IA, una vez desplegado, necesita algo parecido a un expediente. Necesita una identidad verificable, un dueño responsable, un registro de qué puede tocar y qué no, y un proceso definido para cuando ese agente cambia de manos o deja de tener sentido. Ese es, en esencia, el mismo aparato administrativo —identidad, permisos, ciclo de vida, responsable— que las organizaciones construyeron durante décadas para gestionar personas, no software. Un servidor no necesita que alguien "transfiera su propiedad" cuando el ingeniero que lo configuró renuncia; un agente, según la lógica que estos tres lanzamientos codifican, sí.

## La adopción ya superó a la gobernanza, y eso es exactamente el problema

El contexto que hace urgente esta infraestructura es una curva de adopción que corrió más rápido que la capacidad de las empresas para controlarla. El porcentaje de organizaciones con al menos una carga de trabajo de IA en producción pasó de 20% en 2020 a 55% en 2024 y 72% en 2026 —pero esa expansión no vino acompañada de la misma velocidad en gobernanza, y la consecuencia se ve en otro dato: 42% de las empresas abandonaron la mayoría de sus iniciativas de IA el año pasado, frente a apenas 17% el año anterior. Buena parte de ese abandono no es porque los modelos fallaran, sino porque nadie tenía claro quién era dueño de qué agente, con qué datos podía interactuar, o qué pasaba cuando la persona que lo construyó —muchas veces alguien fuera del equipo de TI, usando herramientas de bajo código— dejaba la empresa o cambiaba de rol. Gartner proyecta que 40% de las aplicaciones empresariales tendrán agentes de IA integrados para fines de 2026, frente a menos de 5% en 2025: ese ritmo de despliegue, sin un sistema equivalente al que existe para gestionar identidades humanas, es exactamente el vacío que Microsoft, Google y Anthropic están corriendo a llenar al mismo tiempo.

## El costo que no aparece en la factura de licencias

Hay una segunda capa de esta historia que rara vez se cuenta junto con la primera: adoptar agentes con gobernanza real cuesta más de lo que sugiere el precio por asiento o por token. Construir el inventario, definir las políticas de acceso, entrenar a los administradores en un modelo mental completamente nuevo —dónde termina el permiso de un agente y empieza el de su dueño humano— es trabajo organizacional, no solo técnico, y ese trabajo tiene un costo de coordinación que las proyecciones de ahorro de la IA rara vez incluyen. La investigación sobre adopción de IA en manufactura documenta un patrón que los economistas llaman curva en J: las empresas que pasan de no usar IA a integrarla profundamente no ven ganancias inmediatas —de hecho, algunas ven una caída de productividad de hasta 1.33 puntos porcentuales antes de que la rentabilidad mejore. Gobernar agentes como si fueran empleados —con expediente, dueño y proceso de baja— es, probablemente, parte de lo que explica ese valle: no es fricción desperdiciada, es el costo de construir la infraestructura organizacional que la adopción rápida se saltó al principio.

## Lo que cambia cuando el vocabulario es el de recursos humanos, no el de TI

Vale la pena detenerse en la elección de vocabulario, porque no es casual. Ninguna de las tres compañías llama a esto "gestión de activos de software" —el término que usarían para licencias o servidores. Microsoft habla de identidad y de un "control plane para agentes"; Google habla de "transferir propiedad" cuando alguien "deja" el puesto; el discurso público de Anthropic sobre gobernanza de agentes usa términos como "ciclo de vida" y "evaluación", los mismos que aparecen en cualquier manual de gestión de talento. Ese vocabulario no es incidental: revela cómo estas empresas anticipan que sus clientes van a necesitar pensar sobre los agentes que despliegan —no como una herramienta más en el stock de TI, sino como algo con una relación laboral implícita, aunque nadie firme un contrato. La pregunta que eso abre no es si los agentes son "como" empleados en algún sentido filosófico, sino si las empresas que los despliegan van a empezar, de facto, a presupuestarlos, auditarlos y responsabilizarlos con el mismo aparato que usan para las personas —y qué pasa con esa lógica cuando un agente comete un error que, si lo hubiera cometido una persona, habría significado una investigación de recursos humanos.

## El riesgo de construir el aparato antes que el criterio

Nada de esta infraestructura resuelve, todavía, la pregunta de fondo: quién decide cuándo un agente debería tener el nivel de autonomía y de acceso que tiene. Un inventario con identidad, políticas y ciclo de vida es la condición necesaria para gobernar agentes con rigor, pero no sustituye el juicio de negocio sobre qué decisiones son lo bastante importantes como para requerir supervisión humana antes de ejecutarse, ni resuelve el problema de que la persona que configura los permisos de un agente casi nunca es la misma que entiende completamente el riesgo operativo de lo que ese agente puede hacer. Construir el aparato de identidad y gobernanza antes de tener ese criterio organizacional claro corre el riesgo de producir exactamente el resultado opuesto al buscado: procesos que se sienten rigurosos —con inventario, dueño y registro de auditoría— pero que en la práctica solo formalizan decisiones que nadie examinó con suficiente cuidado la primera vez.

## Fuentes

- [Anthropic Launches Claude Marketplace With More Than 2,000 Connectors and Plugins](https://www.ghacks.net/2026/09/27/anthropic-launches-claude-marketplace-with-more-than-2000-connectors-and-plugins/) — gHacks Tech News
- [Anthropic turns Claude into an AI marketplace with 2,000+ plugins and connectors](https://www.bleepingcomputer.com/news/artificial-intelligence/anthropic-turns-claude-into-an-ai-marketplace-with-2-000-plus-plugins-and-connectors/) — BleepingComputer
- [Claude Marketplace: Buying Agent Tools From Claude Spend](https://www.digitalapplied.com/blog/claude-marketplace-committed-spend-agent-software) — Digital Applied
- [Microsoft Copilot Managed Runtime Brings AI-Built Apps Under Enterprise Governance](https://mnzailabs.com/en/news/microsoft-copilot-managed-runtime-enterprise-apps) — MNZAI Labs
- [The Agent Has an Identity Now: Microsoft's New Security Model for AI Agents](https://learn.cloudpartner.fi/posts/microsoft-ai-security-september-2026-part-1) — Cloudpartner
- [Share agents from Google Cloud console](https://docs.cloud.google.com/gemini/enterprise/docs/share-custom-agents) — Gemini Enterprise, Google Cloud Documentation
- [The State of AI Adoption in the Enterprise [Q1 2026 Review]](https://bsykes.substack.com/p/the-state-of-ai-adoption-in-the-enterprise) — Substack
- [The 'productivity paradox' of AI adoption in manufacturing firms](https://mitsloan.mit.edu/ideas-made-to-matter/productivity-paradox-ai-adoption-manufacturing-firms) — MIT Sloan
- [Gartner Predicts 40% of Enterprise Apps Will Feature Task-Specific AI Agents by 2026, Up from Less Than 5% in 2025](https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025) — Gartner
