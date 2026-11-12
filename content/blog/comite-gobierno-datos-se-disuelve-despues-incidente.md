---
titulo: 'El comité de gobierno de datos que se formó después del incidente, y se disolvió seis meses después'
fecha: 2026-11-12
categoria: leadership
mundo: notas-de-campo
tags:
  - gobierno de datos
  - cultura organizacional
  - gestión de proyectos
  - data governance
  - liderazgo
  - organizaciones
  - comités
  - calidad de datos
resumen: 'Una reflexión desde la experiencia de implementar proyectos de datos en organizaciones reales: el patrón recurrente en el que un incidente de datos genera, casi siempre, un comité de gobierno con mandato amplio y energía genuina —y por qué, en la gran mayoría de los casos, ese mismo comité se disuelve en silencio meses después, sin que nadie decida formalmente cerrarlo.'
tesis: 'Que los comités de gobierno de datos formados tras un incidente tiendan a disolverse sin una decisión formal de cierre es un patrón observable en múltiples organizaciones; que ese patrón refleje específicamente una falla de diseño institucional —mandato ligado al miedo en vez de a un proceso recurrente de revisión— es una interpretación razonable de la causa, pero no la única explicación posible: la rotación de personal y la simple acumulación de prioridades nuevas también contribuyen, sin que sea posible aislar con precisión el peso relativo de cada factor.'
datosClave:
  - valor: '0'
    etiqueta: 'Reuniones formales de cierre que, en mi experiencia, tuvieron la mayoría de los comités de gobierno de datos reactivos antes de dejar de reunirse'
    fuente: 'Observación directa, experiencia profesional propia'
imagen: /blog/portadas/comite-gobierno-datos-se-disuelve-despues-incidente.jpg
socialImagen: /blog/social/comite-gobierno-datos-se-disuelve-despues-incidente.jpg
gancho: 'Ningún comité de gobierno de datos se cierra formalmente. Simplemente deja de aparecer en el calendario de alguien, hasta que un día nadie recuerda cuándo fue la última vez que se reunió. ¿Por qué ese patrón se repite casi siempre exactamente igual?'
postura:
  pregunta: '¿Tiene sentido seguir formando comités de gobierno de datos reactivos —nacidos de un incidente concreto— sabiendo, por patrón repetido, que la mayoría se disolverá en silencio dentro de un año, o esa energía inicial debería canalizarse directamente hacia procesos permanentes desde el primer día, aunque eso signifique un arranque más lento y menos visible?'
  aFavor: 'Un comité reactivo, aunque termine disolviéndose, normalmente deja detrás mejoras reales y concretas —una definición de calidad de datos documentada, un proceso de validación que antes no existía, una lista de responsables identificados— que sobreviven incluso después de que el comité mismo deja de reunirse; exigir que la respuesta a un incidente sea, desde el primer día, un proceso permanente y bien diseñado puede retrasar innecesariamente mejoras que la organización necesita de inmediato.'
  enContra: 'Formar un comité sabiendo, por experiencia repetida, que probablemente se disolverá sin resolver la causa estructural del problema es una forma de management-theater: le da a la organización la sensación de haber actuado con seriedad frente al incidente, sin comprometerse con el rediseño de incentivos y procesos permanentes que evitaría que el mismo tipo de incidente vuelva a ocurrir dentro de uno o dos años, bajo un comité distinto con un nombre distinto.'
---

Lo he visto pasar, con variaciones menores, en más de una organización: un incidente de datos —una cifra mal reportada a un comité directivo, un reporte regulatorio con un error que alguien detectó tarde, un modelo que tomó una decisión sobre datos que nadie había validado— y, dentro de las dos semanas siguientes, la formación de un comité de gobierno de datos. Tiene patrocinio ejecutivo visible, un mandato amplio redactado con cuidado, una cadencia de reuniones definida, y —esto es lo más revelador— una energía genuina en la primera junta, donde la gente llega con ideas concretas y la disposición real de arreglar las cosas. Lo que también he visto, con la misma consistencia, es que ese mismo comité, en la inmensa mayoría de los casos, deja de reunirse entre seis y doce meses después. Nunca con una decisión formal de cierre. Simplemente deja de aparecer en el calendario de alguien, hasta que, en algún momento, nadie recuerda bien cuándo fue la última sesión.

## La energía inicial no es el problema

Vale la pena ser preciso sobre qué parte de este patrón no es el problema: la energía de la primera reunión suele ser real, no performativa. La gente que participa en esas juntas iniciales normalmente entiende el problema de fondo, propone soluciones razonables, y está dispuesta a dedicarle tiempo genuino en las primeras semanas. El fracaso no está en la intención ni en la calidad de las personas involucradas. Está en algo más estructural: el mandato de ese comité nació atado a un evento específico —el incidente— en lugar de estar atado a un proceso organizacional permanente que seguiría existiendo incluso si el incidente nunca hubiera ocurrido.

## Por qué el mandato ligado al miedo tiene fecha de caducidad

Un comité que existe porque "pasó algo grave" tiene, de forma casi automática, una fecha de caducidad implícita: la urgencia que lo sostiene es proporcional a qué tan reciente está el incidente en la memoria de la organización. Seis meses después, cuando ya no hubo un segundo incidente visible, esa urgencia se diluye de forma natural, no porque alguien decida que el problema ya se resolvió, sino porque la atención organizacional —un recurso finito y constantemente disputado por prioridades nuevas— simplemente se redirige hacia la siguiente emergencia. Un comité cuyo propósito original fue "evitar que se repita el incidente de marzo" no tiene un mecanismo de renovación de su propia relevancia una vez que marzo queda suficientemente lejos en el calendario.

## La diferencia con un comité que nace de un proceso, no de un miedo

El contraste más claro que he observado es con las pocas estructuras de gobierno de datos que sí sobrevivieron más de un año, y lo que las distingue no es que hayan tenido mejores patrocinadores ni mandatos mejor redactados. Es que, desde el inicio, estaban atadas a un proceso que la organización necesitaba hacer de cualquier forma —una auditoría anual recurrente, una certificación regulatoria con fecha fija, un ciclo de planeación presupuestal que exigía datos confiables como insumo—. Cuando el gobierno de datos es un medio para cumplir un proceso que de todas formas iba a ocurrir año tras año, sobrevive al olvido natural del incidente que lo originó. Cuando el gobierno de datos es el fin en sí mismo, atado únicamente a la memoria de un evento puntual, compite en desventaja permanente contra cualquier prioridad nueva que aparezca después.

## Lo que sí sobrevive, incluso cuando el comité no lo hace

Sería injusto describir estos episodios como un fracaso completo. Lo que casi siempre sobrevive, incluso después de que el comité deja de reunirse, son los artefactos concretos que produjo en sus primeros meses: una definición de calidad de datos que antes no existía por escrito, un documento de responsables (quién es dueño de qué fuente de datos, una pregunta que sorprendentemente pocas organizaciones pueden responder con precisión antes de un incidente), o un proceso de validación puntual que se incorporó a algún flujo de trabajo existente. Esos artefactos, aunque modestos frente a la ambición original del comité, representan una mejora real y duradera. El problema no es que el esfuerzo fuera inútil. Es que la organización termina quedándose con fragmentos de un proceso que nunca se completó, en lugar de con la estructura permanente que el incidente original parecía justificar.

## La rotación de personal como complicador adicional

Hay un segundo factor, menos citado que la pérdida de urgencia, que también contribuye a este patrón: la persona que impulsó el comité con más energía rara vez sigue en el mismo rol un año después. Cambia de posición dentro de la misma empresa, se va a otra organización, o simplemente su atención se redirige hacia el proyecto que su jefe actual considera prioritario esta semana. Un comité cuya continuidad depende en gran medida del impulso personal de un individuo específico —en lugar de estar incorporado en la descripción formal de varios roles distintos, de modo que sobreviva a la salida de cualquiera de ellos— hereda una fragilidad adicional que no tiene nada que ver con la calidad del problema que originalmente buscaba resolver.

## Las señales que aparecen antes de que el comité desaparezca del todo

El declive rara vez es abrupto, y por eso es fácil no notarlo hasta que ya es irreversible. La primera señal, casi siempre, es que la reunión empieza a moverse: lo que era una cita fija cada dos semanas se convierte en "la vemos la próxima quincena porque hay un cierre de trimestre", y esa excusa puntual, razonable en sí misma, se repite una segunda y una tercera vez sin que nadie la cuestione. La segunda señal es que los temas de la agenda dejan de ser decisiones concretas —aprobar una definición, asignar un responsable, revisar un hallazgo específico— y se vuelven actualizaciones informativas de una sola vía, sin ninguna acción esperada al final. La tercera, la más definitiva, es cuando la persona que convocaba la reunión deja de enviar la invitación, y nadie más en el grupo toma la iniciativa de preguntar por qué. Para cuando se llega a esa tercera señal, el comité ya terminó, aunque formalmente nadie lo haya anunciado ni lo haya puesto en una minuta.

## El costo de repetir el ciclo con un nombre distinto cada vez

Lo más costoso de este patrón no es que un comité específico se disuelva —eso, por sí solo, podría ser una señal saludable de que una estructura temporal cumplió su propósito y dejó de ser necesaria—. Lo costoso es cuando el ciclo se repite completo, con un nombre ligeramente distinto, cada vez que ocurre un incidente nuevo de naturaleza similar. He visto organizaciones que, en el curso de pocos años, formaron sucesivamente un "comité de calidad de datos", luego un "consejo de gobierno de información", y después un "comité de ética y uso responsable de IA" —cada uno con un patrocinador distinto, cada uno redescubriendo desde cero problemas que el comité anterior ya había diagnosticado, y cada uno, eventualmente, siguiendo la misma trayectoria de desaparición silenciosa—. El costo real no es el tiempo invertido en cada comité individual, sino la memoria institucional que se pierde entre un ciclo y el siguiente: nadie en el tercer comité recuerda ya qué aprendió el primero, y buena parte del trabajo diagnóstico se repite innecesariamente, como si fuera la primera vez que la organización se enfrenta a ese problema.

## Lo que cambiaría, sin pretender que sea sencillo

Si tuviera que señalar una sola intervención con el mayor efecto práctico, no sería "conseguir mejor patrocinio ejecutivo" —ya suele existir al momento de la crisis— sino atar, desde la primera reunión, el mandato del comité a algo que la organización de cualquier forma tenga que repetir en un calendario fijo: una revisión trimestral obligatoria de algún proceso existente, una auditoría que ya esté programada, un reporte regulatorio con fecha cierta. No es una solución elegante ni dramática, y no garantiza que el comité sobreviva —la rotación de personal y el cambio de prioridades seguirán siendo un riesgo real—, pero cambia la pregunta de fondo que enfrenta ese comité seis meses después de formado: en vez de preguntarse si todavía hay suficiente miedo residual del incidente original como para justificar la siguiente reunión, se pregunta simplemente si el proceso recurrente al que está atado ya llegó a su siguiente fecha en el calendario.

## Fuentes

Esta nota es una reflexión basada en experiencia profesional directa implementando proyectos de datos y gobierno de datos en organizaciones reales, sin revelar información confidencial ni identificar clientes o proyectos específicos. No cita fuentes externas porque no las utiliza como base del argumento.
