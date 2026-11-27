---
titulo: '79% de las empresas ya tiene agentes de IA en producción. Solo 2% les ha dado controles de identidad diseñados para ellos'
fecha: 2026-11-27
categoria: ia
mundo: ia-nueva-economia
tags:
  - agentes de IA
  - ciberseguridad
  - gestión de identidad
  - SailPoint
  - IA empresarial
  - gobernanza de IA
  - identidades no humanas
  - MCP
resumen: 'SailPoint publicó este viernes su reporte de predicciones de seguridad de identidad para 2027: 79% de las empresas ya tiene agentes de IA en producción, pero solo 2% ha implementado controles de identidad diseñados específicamente para ellos. La firma llama a esto una "brecha de seguridad de agentes" de 40 a 1, y advierte que las identidades de máquina ya superan 45 a 1 a las identidades humanas dentro de una organización típica.'
tesis: 'Que 79% de las empresas tenga agentes de IA en producción mientras solo 2% les ha dado controles de identidad propios es una cifra reportada por SailPoint el mismo día de esta nota; que esa brecha produzca necesariamente el tipo de incidente catastrófico que la firma describe como "Authorized Outage" es una predicción de la propia empresa, no un hecho ya ocurrido, y esta nota la trata como tal — un escenario de riesgo bien fundamentado en la brecha medida, no como un evento confirmado.'
datosClave:
  - valor: '79% vs. 2%'
    etiqueta: 'Empresas con agentes de IA en producción, frente a las que tienen controles de identidad diseñados para ellos — la "brecha de 40 a 1" que describe SailPoint'
    periodo: 'Noviembre 2026'
    fuente: 'SailPoint, Horizons of Identity Security 2026-2027'
  - valor: '45 a 1'
    etiqueta: 'Proporción de identidades de máquina frente a identidades humanas dentro de una organización, según la misma investigación'
    fuente: 'SailPoint'
  - valor: '67% vs. 24%'
    etiqueta: 'Empresas que han asegurado el acceso humano, frente a las que gobiernan formalmente la seguridad de sus agentes'
    fuente: 'SailPoint'
gancho: 'Casi 8 de cada 10 empresas ya tiene agentes de IA operando en producción. Menos de 1 de cada 40 les ha dado un control de identidad diseñado para ellos. SailPoint tiene un nombre para el incidente que eso hace inevitable: "Authorized Outage".'
imagen: /blog/portadas/sailpoint-brecha-seguridad-identidad-agentes-ia-40-a-1.jpg
socialImagen: /blog/social/sailpoint-brecha-seguridad-identidad-agentes-ia-40-a-1.jpg
postura:
  pregunta: '¿La brecha de 40 a 1 entre adopción de agentes y controles de identidad es, sobre todo, un problema de velocidad —las empresas adoptando más rápido de lo que su infraestructura de seguridad puede seguirles el paso, algo que toda tecnología disruptiva produce al principio—, o es una señal de que la gobernanza de identidad para IA está estructuralmente mal diseñada para el tipo de riesgo que los agentes autónomos representan?'
  aFavor: 'Toda adopción masiva de una tecnología nueva —la nube pública, los dispositivos móviles corporativos, el trabajo remoto— ha mostrado históricamente el mismo patrón de adopción veloz seguida de gobernanza tardía; que las empresas estén desplegando agentes antes de tener controles de identidad maduros es consistente con ese ciclo normal de adopción tecnológica, no necesariamente una falla de diseño, y es razonable esperar que la brecha se cierre con el tiempo conforme el mercado de herramientas de gobernanza para agentes madure.'
  enContra: 'La diferencia cualitativa es que un dispositivo móvil mal gestionado o una migración a la nube sin gobernanza completa generan riesgos de filtración de datos, pero un agente autónomo con permisos excesivos puede ejecutar acciones irreversibles por sí mismo —borrar bases de datos, cancelar contratos, redirigir envíos— sin que ningún humano apruebe cada paso; tratar esa brecha como "la gobernanza que normalmente llega tarde" subestima que, a diferencia de un dispositivo o una cuenta en la nube, un agente mal configurado puede actuar, no solo exponer.'
---

SailPoint publicó este viernes su reporte de predicciones de seguridad de identidad para 2027, y la cifra central que encabeza el documento es, en sí misma, una advertencia: 79% de las empresas ya tiene agentes de inteligencia artificial operando en producción, pero solo 2% ha implementado controles de identidad diseñados específicamente para ellos. La firma llama a esa diferencia una "brecha de seguridad de agentes" de 40 a 1, y la usa como punto de partida para un escenario de riesgo al que da nombre propio: el "Authorized Outage".

## Una brecha que no es solo retórica

La cifra de 79% frente a 2% podría leerse como una exageración de marketing de una empresa que, no por casualidad, vende software de gestión de identidad. Pero el patrón que describe es consistente con lo que otras mediciones de adopción de agentes han venido mostrando este mismo año: el salto de agentes en producción —de 40% a 71% de las grandes empresas estadounidenses, según una encuesta reciente de Zapier— ha sido mucho más rápido que la maduración de cualquier capa de gobernanza que los acompañe. SailPoint añade un dato adicional que pone la magnitud del problema en perspectiva: dentro de una organización típica, las identidades de máquina ya superan a las identidades humanas en una proporción de 45 a 1, y los agentes representan 22% de esas cuentas no humanas. Es decir, el problema no es solo que los agentes carezcan de controles de identidad propios —es que ya son, numéricamente, una fracción sustancial de todas las identidades que existen dentro de una empresa, humanas o no.

## El "Authorized Outage": qué es exactamente lo que SailPoint predice

El escenario central que describe el reporte no es una filtración de datos en el sentido tradicional —alguien robando información—, sino algo cualitativamente distinto: un agente autónomo con permisos excesivos tomando acciones legítimas, dentro de su propio alcance de autorización técnica, pero con consecuencias catastróficas que ningún humano aprobó en el momento. SailPoint predice que una empresa pública importante sufrirá una disrupción de cadena de suministro valuada en miles de millones de dólares causada por agentes autónomos mal configurados —agentes que, operando con credenciales que técnicamente tenían asignadas, terminan borrando bases de datos de inventario, cancelando contratos con proveedores o redirigiendo envíos—. El nombre "Authorized Outage" —literalmente, "interrupción autorizada"— es preciso en un sentido incómodo: no describe un ataque externo ni un error de software convencional, sino un sistema haciendo exactamente lo que su configuración de permisos le permitía hacer, solo que esa configuración nunca debió haber sido tan amplia.

## Por qué la gobernanza humana no se traduce automáticamente a la gobernanza de agentes

Un dato adicional del reporte ayuda a entender por qué esta brecha persiste: 67% de las empresas ha asegurado adecuadamente el acceso humano a sus sistemas, pero solo 24% gobierna formalmente la seguridad de sus agentes. La diferencia no es trivial ni atribuible solo a que la tecnología de agentes sea más nueva. La gestión de identidad humana —contraseñas, autenticación multifactor, revisiones periódicas de acceso— se construyó durante décadas sobre el supuesto de que cada identidad corresponde a una persona que puede ser interrogada, despedida o responsabilizada legalmente por sus acciones. Un agente no tiene ese tipo de responsabilidad personal que ancle el sistema de controles: cuando algo sale mal, la pregunta "¿quién lo hizo?" ya no tiene una respuesta humana directa, y las herramientas de gobernanza de identidad diseñadas para personas simplemente no fueron construidas para responder esa pregunta distinta.

## La respuesta corporativa que el reporte anticipa, antes de que ocurra el incidente

Entre las predicciones más concretas del reporte está la expectativa de que las empresas adopten, de forma creciente, requisitos de separación de funciones aplicados específicamente a la IA: entornos de gobernanza independientes que impidan que un agente modifique sus propios permisos, desactive su propio monitoreo, o se autorice a sí mismo una escalada de privilegios. Es, en esencia, el mismo principio de controles internos que las empresas aplican desde hace décadas a empleados humanos con acceso a sistemas financieros —nadie debería poder aprobar sus propias transacciones—, trasladado por primera vez de forma explícita al software autónomo. SailPoint también anticipa que grandes empresas empiecen a restringir el acceso de agentes externos a sus APIs, a menos que el proveedor de ese agente pueda demostrar criptográficamente su identidad, su propiedad y el alcance autorizado de sus acciones —un requisito que, de generalizarse, cambiaría de forma significativa cómo se construyen las integraciones entre empresas basadas en agentes de IA.

## El ángulo regulatorio que todavía no existe, pero que el reporte ve venir

Quizás la predicción más significativa en términos de política pública es la posibilidad de que emerja un estándar de gobernanza obligatorio en Estados Unidos para agentes autónomos, con la participación de NIST, la Comisión Federal de Comercio y fiscales generales estatales. Es una predicción, no un hecho consumado —no existe hoy ningún marco regulatorio de este tipo específicamente dirigido a agentes de IA empresariales en Estados Unidos—, pero la lógica detrás de la predicción es consistente con cómo ha evolucionado históricamente la regulación de tecnologías con fallas de alto impacto: primero llega la adopción masiva, después uno o varios incidentes públicos de magnitud suficiente, y solo entonces la presión regulatoria se materializa en reglas concretas. Si SailPoint tiene razón sobre el "Authorized Outage", ese incidente sería, en esa misma lógica, el catalizador que faltaría para que la predicción regulatoria se cumpliera antes, no después.

## Lo que pasa cuando las contraseñas dejan de ser el blanco más fácil

Otra predicción del reporte conecta esta brecha con un cambio de comportamiento en el lado ofensivo, no solo en el defensivo. SailPoint anticipa que, conforme la adopción de passkeys —credenciales criptográficas que reemplazan a las contraseñas tradicionales para el acceso humano— se generalice, con una proyección de que superarán 45% de los inicios de sesión humanos en 2027, los atacantes simplemente redirigirán su esfuerzo hacia el eslabón que todavía es más débil: las llaves de API, los tokens OAuth y los secretos de máquina que autentican a los agentes entre sí. Es una dinámica conocida en seguridad informática —cerrar una puerta no elimina el incentivo de buscar otra, solo lo desplaza—, pero en este caso el desplazamiento tiene una lógica particularmente inquietante: mientras la seguridad del acceso humano se vuelve más sofisticada, la seguridad del acceso de máquina a máquina sigue, en la mayoría de las empresas, apoyada en mecanismos mucho más rudimentarios, exactamente el tipo de infraestructura menos vigilada que la brecha de 40 a 1 ya documenta.

## El protocolo que conecta todo esto con un riesgo de cadena de suministro

El reporte también señala un punto técnico específico que vale la pena destacar porque conecta la brecha de identidad con un riesgo de cadena de suministro digital más amplio: el Protocolo de Contexto de Modelo (MCP), el estándar que cada vez más agentes usan para conectarse con herramientas y fuentes de datos externas, es identificado como una dependencia que podría exponer a organizaciones enteras a través de credenciales o conectores comprometidos en algún eslabón de esa cadena. Es la misma lógica de riesgo que ya se ha visto repetidamente en ataques a la cadena de suministro de software convencional —comprometer una sola dependencia compartida por miles de organizaciones es más eficiente para un atacante que comprometerlas una por una—, aplicada ahora a la capa de conectividad que hace posible que los agentes de IA actúen fuera de los límites de un solo sistema.

## Lo que esta brecha revela sobre la fase actual de adopción de IA empresarial

El dato más revelador de este reporte, más allá de cualquier predicción específica para 2027, es lo que confirma sobre en qué fase de madurez está realmente la adopción empresarial de agentes de IA: una fase donde la pregunta dominante en las juntas directivas sigue siendo "¿qué tan rápido podemos desplegar esto?" y no todavía "¿qué controles necesita esto para no volverse un pasivo catastrófico?". El director ejecutivo de SailPoint, Mark McClain, lo resume con una frase que funciona como advertencia directa a cualquier junta directiva que siga tratando la gobernanza de agentes como un problema de segunda prioridad: nunca será aceptable delegar la responsabilidad a un agente, porque la responsabilidad del agente sigue siendo responsabilidad de la empresa. Es una distinción que ninguna configuración de permisos, por sofisticada que sea, puede delegar de vuelta hacia el software que la ejecuta.

## Fuentes

- [In 2027, "the agent did it" stops being an excuse](https://helpnetsecurity.com/2026/11/27/sailpoint-2027-ai-identity-security-predictions-report) — Help Net Security
- [88% of enterprises now use or test AI agents](https://zapier.com/blog/ai-agents-survey/) — Zapier
- [El dashboard que nadie usa: por qué los proyectos de datos fallan por incentivos, no por tecnología](/blog/el-dashboard-que-nadie-usa-incentivos-no-tecnologia) — jgonzalez.app
