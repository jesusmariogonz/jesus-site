---
titulo: 'En varias empresas donde he trabajado, el verdadero manual de un sistema vivía en la cabeza de una sola persona. Nadie se dio cuenta hasta que esa persona renunció'
fecha: 2026-11-18
categoria: leadership
mundo: notas-de-campo
tags:
  - conocimiento tácito
  - gestión del conocimiento
  - rotación de personal
  - documentación técnica
  - gobernanza de datos
  - continuidad operativa
  - cultura organizacional
  - liderazgo
resumen: 'Una reflexión desde la experiencia profesional implementando proyectos de datos en distintas organizaciones: por qué el conocimiento más crítico de un sistema casi nunca vive en la documentación oficial, sino en la memoria de una o dos personas específicas, y por qué ese riesgo solo se vuelve visible el día en que esas personas ya no están.'
tesis: 'Que la documentación formal rara vez capture el conocimiento operativo real de un sistema es algo que he observado repetidamente en distintas organizaciones; que ese vacío sea resultado de negligencia individual, y no de un incentivo organizacional que recompensa construir sistemas y castiga documentarlos, es una lectura que la experiencia no sostiene —el problema es estructural, no de disciplina personal.'
gancho: 'El manual del sistema más importante de la empresa no estaba en ningún documento. Estaba en la cabeza de una persona que llevaba siete años ahí. Nadie lo supo hasta que esa persona presentó su renuncia con dos semanas de aviso.'
imagen: /blog/portadas/conocimiento-tacito-se-va-con-la-persona-no-con-el-puesto.jpg
socialImagen: /blog/social/conocimiento-tacito-se-va-con-la-persona-no-con-el-puesto.jpg
postura:
  pregunta: '¿La dependencia excesiva del conocimiento tácito de una sola persona es un fracaso de gestión que se puede prevenir con mejores procesos, o es, hasta cierto punto, un costo inevitable de cualquier sistema lo bastante complejo como para ser útil?'
  aFavor: 'Con la disciplina correcta —documentación obligatoria antes de cerrar cualquier proyecto, rotación planeada de responsabilidades, revisiones periódicas de "qué pasa si esta persona se va"— la mayoría de esta dependencia es evitable; tratarla como inevitable es, en el fondo, una forma de no asumir la responsabilidad de gestionarla.'
  enContra: 'Ningún documento captura jamás el cien por ciento del juicio acumulado que una persona desarrolla tras años operando un sistema real —las excepciones no escritas, los patrones de falla que solo se reconocen por experiencia—, así que exigir que toda esa pericia quede "documentada" es una expectativa poco realista que ignora cómo se forma de verdad el conocimiento experto.'
---

Hace algunos años trabajé en un proyecto donde el sistema que procesaba la información más crítica de la operación diaria tenía, en teoría, un manual de usuario, un diagrama de arquitectura y un documento de procesos. En la práctica, cuando algo fallaba de una manera que no estaba en ninguno de esos documentos —que era casi siempre—, todos en el equipo sabían exactamente a quién llamar: a la persona que había construido ese sistema desde el principio y que, sin que nadie lo hubiera decidido formalmente, se había convertido en la única fuente confiable de cómo funcionaba de verdad. Nadie lo veía como un riesgo. Era, simplemente, cómo las cosas funcionaban ahí.

## Un concepto con medio siglo de antigüedad que explica el problema mejor que cualquier anécdota

Lo que estoy describiendo no es una observación nueva ni exclusiva de la tecnología: el filósofo y científico Michael Polanyi lo nombró hace más de sesenta años con una frase que se ha vuelto casi un cliché en la literatura de gestión del conocimiento, pero que rara vez se toma tan en serio como merece: "sabemos más de lo que podemos decir". Polanyi distinguía entre el conocimiento explícito —el que se puede escribir, codificar y transferir en un documento— y el conocimiento tácito, el que una persona posee pero no puede articular completamente, porque buena parte de él opera por debajo del nivel consciente, como el equilibrio al andar en bicicleta o el reconocimiento instantáneo de un rostro familiar. Décadas después, Ikujiro Nonaka e Hirotaka Takeuchi retomaron esa distinción para explicar por qué las empresas japonesas que estudiaron generaban innovación de forma más consistente que sus competidoras occidentales: no porque documentaran mejor, sino porque habían construido procesos deliberados para convertir ese conocimiento tácito en explícito, de forma continua, en lugar de dejarlo atrapado en la cabeza de quien lo poseía.

Visto a través de ese marco, el escenario con el que abrí este texto no es una falla de proceso aislada: es el resultado predecible de no tener ningún mecanismo para esa conversión. El conocimiento operativo de un sistema complejo es, por su propia naturaleza, mayoritariamente tácito —se parece más a saber andar en bicicleta que a saber una fórmula—, y ninguna cantidad de buena voluntad documentando "después" compensa la ausencia de un proceso que lo capture mientras todavía hay tiempo.

## El momento en que el riesgo se vuelve visible

Ese tipo de dependencia es invisible mientras la persona sigue en la empresa, precisamente porque funciona. Los problemas se resuelven, las excepciones se manejan, el sistema sigue andando —y esa fluidez genera la falsa sensación de que el conocimiento necesario para operarlo está, de alguna forma, distribuido o respaldado, cuando en realidad vive casi por completo en una sola cabeza. El riesgo solo se vuelve visible en el momento exacto en que deja de estar disponible: una renuncia, una licencia médica prolongada, un cambio de equipo. Y para entonces ya es tarde para prevenirlo con calma; solo queda gestionarlo bajo presión, con dos semanas de aviso y una lista cada vez más larga de preguntas que nadie sabe responder con certeza.

He visto esta misma escena repetirse, con variaciones menores, en más de una organización: alguien pregunta "¿quién sabe cómo funciona esto realmente?", y la respuesta señala a una sola persona que ya se está yendo. Lo que distingue a las organizaciones que manejan bien ese momento de las que no es, casi siempre, qué tan temprano se dieron cuenta del problema —no si tuvieron la suerte de que la persona avisara con más tiempo.

## Por qué la documentación oficial casi nunca alcanza

Vale la pena preguntarse por qué, si el riesgo es tan evidente en retrospectiva, la documentación formal rara vez logra capturarlo a tiempo. La respuesta no es que a la gente le dé pereza documentar —aunque eso también ayuda a que el problema empeore—. Es que buena parte del conocimiento operativo real de un sistema no es del tipo que se presta bien a quedar escrito: son patrones de falla que solo se reconocen después de haberlos visto ocurrir varias veces, excepciones que no siguen una regla clara, decisiones de diseño tomadas por una razón que tenía sentido en su momento y que ya nadie recuerda explícitamente, pero que siguen determinando cómo se comporta el sistema hoy. Un documento puede describir cómo se supone que funciona un proceso. Es mucho más difícil que capture qué hacer cuando ese proceso se comporta de una forma que el documento no anticipó —y es justo ese segundo tipo de conocimiento el que de verdad importa cuando algo se rompe.

Hay además un incentivo organizacional que rara vez se nombra en voz alta: a nadie se le mide ni se le reconoce por documentar bien un sistema, pero sí se le reconoce —y mucho— por resolver una crisis operativa rápido. Eso empuja a que el tiempo disponible se invierta sistemáticamente en lo segundo, nunca en lo primero, incluso cuando todos estarían de acuerdo, en abstracto, en que documentar seria la inversión correcta. No es un problema de disciplina individual. Es que el sistema de incentivos recompensa, de forma consistente, la acción visible sobre la prevención invisible.

## La ilusión de que un reemplazo resuelve el problema

Una respuesta común cuando se detecta esta dependencia es asignar a alguien más para que "aprenda el sistema" de la persona que se va, generalmente en el poco tiempo que queda antes de su salida. Es mejor que no hacer nada, pero suele sobrestimar lo que es posible transferir en unas semanas. El conocimiento tácito no se transfiere completo en una sesión de handoff ni en un documento de traspaso, por detallado que sea: se construye con el tiempo, viendo fallar el sistema de maneras distintas y aprendiendo, caso por caso, qué funcionó y qué no. Un reemplazo apresurado puede aprender la superficie del sistema —cómo se ve cuando funciona bien— sin heredar la intuición acumulada sobre cómo se comporta cuando algo sale mal, que es precisamente el conocimiento que más se necesita en el momento en que más se necesita.

Esto no significa que la transferencia de conocimiento sea inútil frente a una salida inminente: significa que, para que funcione de verdad, tiene que empezar mucho antes de que haya una fecha de salida sobre la mesa, como una práctica continua y no como un proyecto de emergencia que se activa solo cuando ya es casi tarde.

## El costo que nadie pone en ningún presupuesto

Hay una razón adicional, más incómoda, por la que este riesgo se acumula silenciosamente en tantas organizaciones: no existe una línea en ningún presupuesto llamada "riesgo de dependencia de una sola persona", así que nadie tiene, formalmente, la responsabilidad de medirlo ni de reportarlo hacia arriba. Un director de tecnología puede reportar con precisión cuánto cuesta la infraestructura, cuántos incidentes hubo este trimestre, cuál es el tiempo promedio de resolución. Rara vez puede reportar, con la misma precisión, cuántos de los sistemas críticos de su área dependerían de una sola persona si esa persona renunciara el próximo lunes —no porque el dato sea imposible de obtener, sino porque nadie se lo ha pedido en esos términos. Lo que no se mide, en una organización que opera por métricas, tiende a no gestionarse, y este riesgo específico es casi invisible para cualquier métrica estándar hasta el día en que deja de serlo.

## Lo que sí parece funcionar, cuando funciona

En las pocas organizaciones donde he visto que este riesgo se gestiona bien, el patrón común no es tener mejor documentación —aunque también la tienen—, sino tener una norma explícita de que ningún sistema crítico puede depender de una sola persona, revisada de forma periódica y no solo cuando alguien ya está por irse. Eso implica, en la práctica, forzar una rotación incómoda: que alguien que no construyó el sistema tenga que operarlo o depurarlo de vez en cuando, precisamente para exponer, mientras todavía hay tiempo de corregirlo con calma, qué parte del conocimiento necesario todavía no está en ningún lado más que en una sola cabeza. Es una práctica que cuesta tiempo y que, vista desde la eficiencia de corto plazo, parece injustificable —¿por qué hacer que alguien menos eficiente en esa tarea la haga, cuando la persona experta podría resolverlo en la mitad del tiempo?—. La respuesta es que esa ineficiencia deliberada es, en realidad, el costo de un seguro que solo se nota que faltaba el día que ya es demasiado tarde para comprarlo.

## La pregunta que vale más que cualquier auditoría de documentación

Si tuviera que resumir todo esto en una sola pregunta que cualquier liderazgo técnico debería poder responder sin dudar, no sería "¿tenemos buena documentación?" —esa pregunta casi siempre se responde que sí, de forma honesta y a la vez irrelevante, porque la documentación que existe rara vez es la que importa—. Sería esta otra: si la persona que mejor entiende este sistema renunciara hoy con dos semanas de aviso, ¿qué exactamente se perdería, y cuánto tiempo tomaría recuperarlo? Es una pregunta incómoda de hacer en voz alta, porque obliga a admitir una dependencia que normalmente se prefiere no nombrar mientras sigue funcionando. Pero es, casi siempre, la única pregunta que de verdad distingue a una organización que gestionó este riesgo a tiempo de una que lo descubrió demasiado tarde.

## Fuentes

Reflexión basada en experiencia profesional propia implementando proyectos de datos y sistemas de información en distintas organizaciones, sin revelar información confidencial ni nombrar clientes o proyectos específicos.

**Referencias bibliográficas:**
- Michael Polanyi, *The Tacit Dimension*, 1966 — el origen de la distinción entre conocimiento tácito y explícito que estructura todo este texto.
- Ikujiro Nonaka y Hirotaka Takeuchi, *The Knowledge-Creating Company*, 1995 — el marco que explica cómo convertir conocimiento tácito en explícito de forma deliberada y continua, en lugar de dejarlo atrapado en una sola persona.
