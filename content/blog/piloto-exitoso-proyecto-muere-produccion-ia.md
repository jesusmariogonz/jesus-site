---
titulo: 'El piloto funcionó perfecto. El proyecto murió seis meses después. Nadie en la sala pudo explicar bien por qué'
fecha: 2026-10-30
categoria: leadership
mundo: notas-de-campo
tags:
  - implementación de IA
  - gestión de proyectos
  - transformación digital
  - adopción empresarial
  - toma de decisiones
  - cultura organizacional
  - gobernanza de datos
  - liderazgo
resumen: 'La mayoría de los proyectos de datos e IA que fracasan no fracasan en el piloto —fracasan después, en el tramo silencioso entre "funcionó" y "ya está en producción en toda la empresa". Esa brecha tiene un patrón reconocible, y casi nunca es técnico.'
tesis: 'Que la mayoría de los pilotos de IA generativa nunca llegan a producción es un hallazgo documentado por investigación reciente del MIT. Que la causa principal sea la madurez técnica de la tecnología es una lectura que mi propia experiencia implementando estos proyectos contradice: en los casos que he visto de cerca, el piloto casi siempre funcionó técnicamente — lo que murió fue la coalición de personas dispuestas a asumir el riesgo político de escalarlo, no el modelo ni la arquitectura.'
datosClave:
  - valor: '95%'
    etiqueta: 'Proporción de pilotos de IA generativa empresarial que, según el reporte GenAI Divide del MIT NANDA, no generan retorno medible ni llegan a producción'
    fuente: 'MIT NANDA'
  - valor: '>40%'
    etiqueta: 'Proyectos de IA agéntica que Gartner proyecta que serán cancelados antes de 2027'
    fuente: 'Gartner'
imagen: /blog/portadas/piloto-exitoso-proyecto-muere-produccion-ia.jpg
socialImagen: /blog/social/piloto-exitoso-proyecto-muere-produccion-ia.jpg
gancho: 'El piloto no fracasa por el modelo. Fracasa porque la persona que lo defendió en la junta de octubre ya no está en esa junta en marzo — y nadie heredó el riesgo político de seguir defendiéndolo. ¿Cuántos proyectos de tu empresa murieron exactamente así?'
postura:
  pregunta: '¿La razón principal por la que los pilotos de IA no escalan a producción es la inmadurez técnica de la tecnología y la falta de infraestructura de datos adecuada, o es, más bien, un problema de gobernanza y de incentivos organizacionales que ninguna mejora técnica puede resolver por sí sola?'
  aFavor: 'Es innegable que buena parte de los pilotos de IA generativa tropiezan con problemas técnicos reales y documentables —datos fragmentados, falta de integración con sistemas legacy, modelos que no generalizan bien fuera del caso de uso acotado del piloto— y que resolver esos problemas de infraestructura es, en efecto, un prerrequisito necesario antes de que cualquier proyecto pueda escalar, independientemente de qué tan bien alineados estén los incentivos organizacionales.'
  enContra: 'Si el problema fuera principalmente técnico, los pilotos deberían fracasar de forma visible y temprana —el modelo no funciona, los datos no alcanzan—, pero el patrón que describe esta nota es distinto: el piloto funciona, se presenta como éxito, y después desaparece sin que nadie documente formalmente por qué, lo cual es la firma característica de un problema de incentivos y de responsabilidad organizacional, no de una limitación técnica que un reporte de postmortem hubiera podido señalar con claridad.'
---

Hay un patrón que he visto repetirse, con variaciones superficiales pero una estructura idéntica, en más de un proyecto de datos o inteligencia artificial que he visto de cerca: el piloto funciona. Funciona de verdad —el equipo técnico lo demuestra, los números del caso de uso acotado se ven bien, alguien lo presenta en una junta con entusiasmo genuino—. Y entonces, en algún punto de los siguientes seis a doce meses, sin que nadie anuncie formalmente su cancelación, el proyecto simplemente deja de aparecer en las agendas. No hay un memo que diga "esto no funcionó". No hay un postmortem. Solo queda una especie de silencio administrativo, y cuando alguien pregunta meses después qué pasó con aquel piloto tan prometedor, las respuestas son vagas, raramente iguales entre sí, y casi nunca satisfactorias.

## El dato que confirma que esto no es anecdótico

Lo que he visto de forma directa coincide con lo que la investigación reciente documenta a escala. El reporte "GenAI Divide" del MIT NANDA, uno de los estudios más citados sobre adopción empresarial de IA generativa, encontró que 95% de los pilotos corporativos de IA generativa no generan un retorno medible ni llegan a convertirse en despliegues de producción sostenidos. Gartner, por su parte, proyecta que más de 40% de los proyectos de IA agéntica serán cancelados antes de 2027. Son cifras que, leídas rápido, invitan a una conclusión cómoda: la tecnología todavía no está lista. Es una conclusión que, en mi experiencia directa implementando este tipo de proyectos, rara vez es la explicación correcta.

## Lo que realmente mata al proyecto, y casi nunca es el modelo

En los casos que he visto de cerca —sin poder, por razones obvias, nombrar clientes o proyectos específicos—, el patrón de fondo no es que la tecnología fallara. Es que el piloto, al ser un piloto, vivía protegido de una pregunta que la producción sí obliga a responder: ¿quién es, específicamente, el responsable de que esto siga funcionando cuando algo salga mal? Durante la fase de piloto, esa pregunta casi nunca se hace en serio, porque el riesgo es pequeño, acotado, y generalmente lo absorbe la misma persona entusiasta que impulsó el proyecto desde el principio. Escalar a producción cambia esa ecuación por completo: de pronto, el proyecto necesita un dueño formal dispuesto a poner su reputación detrás de un sistema que, si falla en producción —con clientes reales, con datos reales, con consecuencias reales—, va a generar una pregunta incómoda con su nombre al lado. Esa transferencia de riesgo político es, en mi experiencia, el verdadero cuello de botella, mucho más que cualquier limitación de arquitectura o de calidad de datos.

## Por qué nadie documenta esto con claridad

Una razón por la que este patrón es tan difícil de ver desde afuera —y tan difícil de corregir desde dentro— es que ninguna de las partes involucradas tiene un incentivo real para nombrarlo con precisión. El equipo técnico que construyó el piloto no quiere decir "el modelo funcionaba, el problema fue que nadie quiso asumir la responsabilidad de operarlo", porque suena como estar señalando a colegas específicos. El patrocinador original del proyecto, si ya se movió a otra posición o a otra prioridad, tampoco tiene incentivo para regresar y explicar públicamente por qué dejó de defenderlo. Y la organización en su conjunto prefiere, casi siempre, una narrativa más cómoda y más vaga —"todavía no estábamos listos", "la tecnología necesita madurar más"— que es técnicamente defendible sin ser específicamente falsa, pero que oculta la causa real detrás de un lenguaje que suena a limitación externa en lugar de decisión interna.

## El momento exacto en que se puede ver venir

Si hay una señal de alerta temprana que, en retrospectiva, suele anticipar este desenlace, es el momento en que un proyecto pasa de tener un patrocinador individual entusiasta a necesitar un comité que lo apruebe para la siguiente fase. No porque los comités sean malos por definición —la supervisión colectiva de decisiones de alto riesgo tiene razones legítimas de existir—, sino porque un comité, por diseño, diluye exactamente el tipo de responsabilidad individual que un proyecto en fase de escalamiento más necesita. Cuando la pregunta "¿quién es responsable si esto falla?" se le hace a un grupo de ocho personas en lugar de a una sola, la respuesta implícita que casi siempre emerge es "nadie en particular" —y un proyecto sin un responsable individual claro, por bueno que haya sido su piloto, rara vez sobrevive el tránsito hacia producción con la misma energía con la que arrancó.

## Un nombre para este fenómeno que viene de otro lado

Lo que describo no es exclusivo de los proyectos de IA, y tiene nombre en la literatura de psicología social desde hace más de cinco décadas. En 1968, los psicólogos Bibb Latané y John Darley documentaron, a partir del asesinato de Kitty Genovese en Nueva York, lo que llamaron difusión de la responsabilidad: entre más personas están presentes ante una situación que requiere que alguien actúe, menos probable es que cualquier individuo específico sienta la responsabilidad personal de hacerlo, porque cada quien asume, de forma más o menos consciente, que alguien más en el grupo va a encargarse. El comité que aprueba —o no aprueba— el paso de un piloto a producción opera bajo exactamente esa misma lógica, aunque nadie en la sala lo describiría en esos términos: ocho personas revisando el mismo riesgo no equivalen a ocho veces más responsabilidad sobre ese riesgo, equivalen, con mucha frecuencia, a que nadie se sienta plenamente dueño de la decisión final. La diferencia entre un peatón que no ayuda en una emergencia y un director que no defiende un proyecto en una junta es de escala y de consecuencias, no de mecanismo psicológico.

## La pregunta diagnóstica que pocas veces se hace a tiempo

Hay una pregunta concreta que, en retrospectiva, habría anticipado el desenlace en varios de los casos que he visto, y que rara vez se formula explícitamente durante la fase de piloto: si este sistema falla en producción dentro de seis meses —no si falla el modelo, sino si falla de la forma más común en que fallan los sistemas en producción: datos que cambiaron, un caso límite que nadie anticipó, un usuario que lo usó de una forma no prevista—, ¿quién recibe esa llamada primero, y qué autoridad tiene esa persona para decidir qué hacer al respecto sin convocar de nuevo al comité completo? Cuando la respuesta a esa pregunta es clara y tiene un nombre propio desde el arranque del proyecto, la probabilidad de que sobreviva el tránsito a producción sube de forma notable, en mi experiencia directa. Cuando la respuesta es "lo decidiríamos entre varios", es, casi siempre, la primera señal de que el proyecto todavía no tiene dueño real, por bien que haya salido el piloto.

## Lo que sí parece ayudar, cuando ayuda

El patrón contrario —proyectos que sí logran cruzar ese tránsito— comparte, en los casos que he podido observar, una característica más que cualquier otra: alguien, desde el inicio del piloto, ya estaba pensando explícitamente en quién iba a ser el dueño operativo del sistema en producción, no solo en quién iba a demostrar que el piloto funcionaba. Es una distinción sutil en el momento de arrancar un proyecto, y que se vuelve decisiva seis meses después. Diseñar el piloto pensando desde el primer día en la pregunta de gobernanza —no solo en la pregunta técnica de si el modelo puede hacer la tarea— es, en mi experiencia, la diferencia más consistente entre un proyecto que sobrevive su propio éxito inicial y uno que se convierte en una anécdota que nadie termina de explicar bien en la siguiente junta.

## La pregunta que vale más que cualquier demo

Antes de celebrar el siguiente piloto que "funcionó", la pregunta que de verdad importa no es si el modelo hizo bien la tarea para la que se diseñó —eso, en la mayoría de los casos que he visto, no es lo difícil—. La pregunta es si existe ya, desde ese mismo momento, una persona específica dispuesta a poner su nombre y su reputación detrás de que ese sistema siga funcionando quince meses después, con datos reales, con usuarios reales, y con la primera falla inevitable que cualquier sistema en producción eventualmente tiene. Si esa persona no existe todavía, el piloto exitoso que se acaba de presentar probablemente ya tiene fecha de caducidad, aunque nadie en la sala lo sepa todavía.

## Fuentes

- [The GenAI Divide: State of AI in Business 2025](https://nanda.media.mit.edu/) — MIT NANDA, Project NANDA
- [Gartner Predicts Over 40% of Agentic AI Projects Will Be Canceled by End of 2027](https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027) — Gartner
- Bibb Latané y John M. Darley, *The Unresponsive Bystander: Why Doesn't He Help?*, 1970
