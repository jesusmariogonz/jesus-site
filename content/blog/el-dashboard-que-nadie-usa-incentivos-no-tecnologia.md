---
titulo: 'El dashboard que nadie usa: por qué los proyectos de datos fallan por incentivos, no por tecnología'
fecha: 2026-10-14
categoria: leadership
mundo: notas-de-campo
tags:
  - datos
  - analítica
  - gobierno corporativo
  - cultura organizacional
  - toma de decisiones
  - business intelligence
  - liderazgo
  - transformación digital
resumen: 'La mayoría de los proyectos de datos que fracasan no fallan por un problema técnico, sino porque nadie en la organización tenía un incentivo real para que el dashboard terminado dijera la verdad.'
tesis: 'La causa dominante de fracaso en proyectos de datos no es la calidad del dato ni la elección de herramienta, sino que casi nunca alguien en la organización gana algo por tener razón, y sí pierde algo por que el número la contradiga.'
datosClave:
  - valor: '70-85%'
    etiqueta: 'de proyectos de analítica/BI que distintas encuestas de la industria ubican como "fallidos" o de adopción limitada'
  - valor: '1'
    etiqueta: 'métrica suele bastar para que un proyecto completo de datos quede archivado si contradice a quien lo patrocinó'
  - valor: '3-6 meses'
    etiqueta: 'tiempo típico entre el lanzamiento de un dashboard ejecutivo y el momento en que deja de abrirse'
imagen: /blog/portadas/negocios-reunion-3.jpg
gancho: 'El dashboard no estaba mal hecho. Medía exactamente lo que debía medir. Por eso nadie lo volvió a abrir después del tercer mes.'
socialImagen: /blog/social/el-dashboard-que-nadie-usa-incentivos-no-tecnologia.jpg
postura:
  pregunta: '¿Es más honesto diseñar sistemas de datos que digan la verdad aunque nadie los use, o diseñarlos sabiendo que solo sobrevivirán los que no amenacen a nadie?'
  aFavor: 'Un sistema de datos que no se usa no genera ningún valor, así que diseñarlo pensando en qué puede sobrevivir políticamente —aunque implique suavizar ciertas métricas— es más responsable que construir el dashboard "correcto" que termina abandonado.'
  enContra: 'Diseñar el sistema para que sobreviva políticamente es, en la práctica, decidir de antemano qué verdades incómodas no van a poder medirse nunca, lo cual convierte a la función de datos en un instrumento de relaciones públicas internas en vez de una función de verdad.'
---

## El proyecto que funcionó perfecto y por eso murió

Hay un patrón que se repite con una regularidad incómoda en proyectos de datos y analítica dentro de empresas grandes: el sistema se construye bien, mide lo que se le pidió medir, los números son correctos, y aun así, entre el tercer y el sexto mes de haber salido a producción, deja de abrirse. No por un error técnico. No porque la plataforma fallara o los datos llegaran tarde. Deja de abrirse porque alguien con suficiente influencia en la organización descubrió que el número que ese dashboard mostraba, mes tras mes, no coincidía con la historia que esa persona necesitaba contar arriba.

Esto no es un fenómeno raro ni anecdótico. Es, de hecho, la explicación más consistente detrás de las cifras de fracaso que distintas firmas de investigación de industria llevan reportando por más de una década para proyectos de business intelligence y analítica avanzada: entre 70% y 85% de las iniciativas de datos, según la encuesta y el año que se consulte, terminan clasificadas como fallidas o con adopción marginal. La explicación dominante en la cultura técnica —falta de calidad de datos, arquitectura mal diseñada, elección equivocada de herramienta— es real, pero secundaria. La causa raíz, la que rara vez se documenta en un postmortem porque nadie tiene incentivo para escribirla, es otra: el proyecto no tenía, desde el diseño, ningún patrocinador cuyo incentivo personal dependiera de que el número dijera la verdad.

## La pregunta que nunca se hace en el kickoff

Cuando una organización arranca un proyecto de datos, la primera pregunta que se hace casi siempre es técnica: ¿qué fuentes vamos a integrar?, ¿qué plataforma usamos?, ¿quién es el dueño del dato? La pregunta que casi nunca se hace, porque resulta incómoda formularla en voz alta frente al patrocinador ejecutivo, es otra: si este dashboard termina mostrando que la estrategia de esta persona no está funcionando, ¿quién se beneficia de que eso se vea con claridad, y quién tiene el poder de archivar el proyecto antes de que eso ocurra?

En la práctica, casi siempre hay más poder del lado de quien puede archivar el proyecto que del lado de quien se beneficiaría de la claridad. Esto no es un defecto de carácter de ningún ejecutivo en particular; es una consecuencia estructural de cómo se distribuyen los incentivos en la mayoría de las organizaciones jerárquicas. Quien patrocina el proyecto de datos suele ser, al mismo tiempo, quien es evaluado por los resultados que ese mismo proyecto va a medir. Pedirle que financie con entusiasmo un sistema que podría dejarlo en evidencia es pedirle que actúe en contra de su propio interés inmediato, algo que ocurre, pero con mucha menos frecuencia de la que el discurso corporativo sobre "cultura de datos" sugiere.

## Lo que se aprende implementando esto, no leyéndolo

Esto no es una observación que se adquiera leyendo sobre gobierno de datos; se aprende viendo de cerca, proyecto tras proyecto, el momento exacto en que un indicador bien construido empieza a incomodar a alguien. El patrón tiene una forma reconocible: primero llegan preguntas técnicas sobre la metodología del cálculo —"¿estamos seguros de que la fórmula es la correcta?"—, después llegan solicitudes de segmentación adicional que diluyen la lectura agregada —"habría que verlo por región, por canal, por cohorte"—, y finalmente, si ninguna de las dos anteriores logra cambiar la tendencia visible, el proyecto simplemente deja de tener prioridad en el roadmap del siguiente trimestre. En ningún momento alguien dice explícitamente "este número me incomoda, hay que enterrarlo". El mecanismo es más sutil y, por eso mismo, más difícil de señalar sin sonar paranoico: cada paso individual tiene una justificación técnica razonable, y solo la secuencia completa revela el patrón.

Lo que distingue a los equipos de datos que logran sobrevivir este ciclo de los que no es, casi siempre, si lograron anclar el patrocinio del proyecto a alguien cuyo incentivo esté alineado con que el número sea correcto incluso cuando es incómodo —típicamente una función de auditoría, de riesgo, o un ejecutivo cuyo bono depende de un indicador distinto al que el dashboard mide— y no a quien directamente va a ser juzgado por ese número.

## Por qué "cultura de datos" es, casi siempre, la respuesta equivocada

La respuesta estándar de la industria ante este problema es invocar la necesidad de una "cultura de datos": más capacitación, más evangelización, más dashboards ejecutivos visibles en las juntas directivas. Esta respuesta trata el problema como si fuera de conocimiento o de hábito, cuando en realidad es de incentivos. Ninguna cantidad de capacitación en lectura de dashboards cambia el cálculo de alguien que, al ver el número con claridad, pierde presupuesto, pierde autoridad sobre su área, o tiene que explicar en la siguiente junta por qué su iniciativa insignia no está dando los resultados prometidos.

Esto explica también por qué los proyectos de datos que sí sobreviven tienden a compartir una característica estructural poco discutida: miden algo que a nadie con poder suficiente para archivarlos le conviene que se oculte. Un dashboard de churn de clientes sobrevive con más frecuencia que un dashboard de productividad de un equipo gerencial específico, no porque el primero sea técnicamente más sencillo de construir —frecuentemente es al revés—, sino porque el costo político de archivar el primero es mucho mayor que el de archivar el segundo.

## El caso contrario: cuando el incentivo sí estaba alineado

Vale la pena describir también el patrón opuesto, porque es igual de instructivo. En las contadas ocasiones en que un proyecto de analítica avanzada logra instalarse de forma duradera dentro de una organización —no como un reporte más, sino como una referencia que efectivamente mueve decisiones—, casi siempre hubo alguien, desde el diseño del proyecto, cuyo incentivo personal y profesional dependía directamente de que ese número fuera correcto y estuviera disponible, incluso si resultaba incómodo para otros. No por virtud personal excepcional, sino porque su posición estructural dentro de la organización —auditoría interna, control de riesgo, una dirección de finanzas con mandato explícito de reportar con independencia— hacía que decir la verdad fuera, para esa persona, la opción de menor costo.

Esto sugiere una implicación práctica incómoda para quien diseña este tipo de proyectos: la pregunta más importante del kickoff no es técnica ni de producto, sino política, y suele quedar fuera de cualquier documento de alcance. ¿Quién, en esta organización, gana algo concreto por que este número sea verdadero y esté disponible, y tiene además el poder suficiente para que esa preferencia pese más que la de quien perdería si el número se hiciera público? Si la respuesta es "nadie en particular", la probabilidad de que el proyecto termine archivado a los pocos meses no depende de la calidad de la arquitectura ni del talento del equipo que lo construya.

## Una prueba simple antes de construir nada

Hay una pregunta de diagnóstico que, con el tiempo, resulta más predictiva que cualquier análisis de requerimientos técnicos: antes de escribir una sola línea de código o modelar una sola tabla, preguntar en voz alta, en la reunión de arranque, qué pasaría si el número terminara mostrando lo contrario de lo que el patrocinador espera. No como provocación, sino como ejercicio genuino de diseño. La reacción a esa pregunta —si se responde con naturalidad, con una lista concreta de a quién se escalaría y qué se haría con ese resultado, o si se responde con un silencio incómodo seguido de un cambio de tema— predice, con una exactitud que ningún análisis de arquitectura logra igualar, si ese proyecto seguirá vivo dentro de un año.

Esta prueba tiene una ventaja práctica sobre cualquier intento de "medir la cultura de datos" de una organización con una encuesta o un índice de madurez: no depende de lo que la gente dice creer sobre los datos, sino de cómo reacciona en el momento concreto en que el dato deja de ser hipotético y empieza a amenazar a alguien específico. Las encuestas de madurez analítica casi siempre miden la primera categoría —discurso— y casi nunca la segunda —comportamiento bajo amenaza—, que es la que de verdad determina el destino del proyecto. Aplicarla no garantiza que el proyecto vaya a sobrevivir, pero sí permite, antes de comprometer presupuesto y reputación técnica, decidir con los ojos abiertos si vale la pena construirlo tal como está planteado, o si primero hay que rediseñar quién lo patrocina.

## Lo que esto implica para quien diseña estos sistemas

Nada de esto es una receta fácil de aplicar, porque identificar correctamente esa alineación de incentivos antes de construir el sistema —no después, cuando ya se gastó el presupuesto y el capital político— exige un tipo de diagnóstico organizacional que rara vez forma parte del entrenamiento técnico de quienes diseñan estos proyectos. Es más fácil, y más cómodo, discutir el stack tecnológico. Pero la pregunta de fondo, la que determina si el sistema va a seguir abierto dentro de un año o va a convertirse en otro proyecto archivado que nadie menciona en la siguiente retrospectiva, no tiene nada que ver con qué plataforma se eligió.

¿Cuántos de los dashboards que hoy están activos en cualquier organización mediana seguirían abiertos si, mañana, empezaran a decir algo que incomodara a quien los patrocina?

## Fuentes

- Gartner — cobertura de encuestas recurrentes sobre tasas de fracaso y adopción limitada de iniciativas de analítica y business intelligence empresarial
- Reflexión propia a partir de experiencia profesional directa implementando proyectos de datos y analítica en entornos corporativos, sin revelar información confidencial ni nombrar clientes o proyectos específicos
- Chris Argyris, *Overcoming Organizational Defenses*, 1990 — sobre por qué las organizaciones desarrollan rutinas defensivas que bloquean información incómoda incluso cuando esa información está disponible
- Andy Grove, *High Output Management*, 1983 — sobre el diseño de métricas e indicadores dentro de estructuras jerárquicas con incentivos en conflicto
