---
titulo: 'La demo de IA generativa siempre funciona. El problema aparece en la segunda semana de uso real'
fecha: 2026-10-22
categoria: leadership
mundo: notas-de-campo
tags:
  - inteligencia artificial
  - implementación
  - gestión de proyectos
  - datos
  - adopción empresarial
  - experiencia profesional
  - automatización
  - gestión del cambio
resumen: 'Una reflexión desde la experiencia directa de implementar herramientas de inteligencia artificial generativa en entornos empresariales reales: por qué casi ningún piloto fracasa en la demo inicial, y por qué casi todos enfrentan su primera crisis real en la segunda o tercera semana de uso, cuando el problema deja de ser el modelo y empieza a ser todo lo que rodea al modelo.'
tesis: 'La brecha entre un piloto exitoso de IA generativa y una implementación que sobrevive al uso real no se explica, en la mayoría de los casos que he visto de cerca, por limitaciones del modelo mismo, sino por decisiones organizacionales que el equipo nunca tomó explícitamente antes del piloto: quién corrige los errores, qué pasa cuando el sistema se equivoca con seguridad, y si el proceso que rodea a la herramienta estaba diseñado para un humano o para un sistema que comete errores distintos a los humanos.'
datosClave:
  - valor: '1 de cada 2'
    etiqueta: 'Proporción aproximada de pilotos de IA generativa empresarial, según estudios de adopción citados ampliamente este año, que no logran escalar a producción dentro del primer año'
    fuente: 'estimaciones de consultoras de adopción de IA, 2026'
imagen: /blog/portadas/demo-funciona-produccion-falla-segunda-semana.jpg
socialImagen: /blog/social/demo-funciona-produccion-falla-segunda-semana.jpg
gancho: 'La demo convenció a todos en la sala. Tres semanas después, nadie en el equipo la está usando. Lo que falló no fue el modelo — fue todo lo que nadie diseñó alrededor de él.'
postura:
  pregunta: '¿La responsabilidad principal de que un piloto de IA generativa no sobreviva al uso real recae en quienes diseñan e implementan la herramienta, o en la organización que adopta la herramienta sin rediseñar los procesos y roles que la rodean?'
  aFavor: 'Quien vende o implementa una herramienta de IA tiene la responsabilidad profesional de anticipar, durante el diseño del piloto, los puntos de fricción operativa que separan una demo controlada de un entorno de producción real —volumen de casos atípicos, necesidad de corrección humana, integración con procesos existentes—, y no trasladarle esa responsabilidad a una organización que, por definición, contrató al especialista precisamente porque no tiene ese conocimiento técnico internamente.'
  enContra: 'Ninguna herramienta, por bien diseñada que esté, puede sustituir una decisión organizacional que solo la empresa adoptante puede tomar —quién corrige los errores del sistema, qué nivel de riesgo es aceptable, cómo se redefinen los roles del equipo—, y exigirle al implementador que resuelva esas decisiones por la organización equivaldría a pedirle que tome decisiones de gobernanza interna que no le corresponden ni tiene la autoridad para tomar.'
---

He visto la misma escena repetirse con suficiente frecuencia como para dejar de atribuirla a la casualidad: una demo de una herramienta de inteligencia artificial generativa —un asistente que resume contratos, un sistema que clasifica tickets de soporte, un copiloto que redacta reportes— convence a todos en la sala. El modelo responde bien, los ejemplos preparados funcionan, el equipo directivo aprueba avanzar. Y entonces, en algún punto entre la segunda y la tercera semana de uso real, algo deja de funcionar, aunque el modelo en sí no haya cambiado en absoluto. Lo que cambió fue el contexto: de un conjunto curado de ejemplos a la variedad real, desordenada e impredecible de lo que ocurre todos los días en una operación empresarial.

## Por qué la demo nunca es el problema

Los modelos de lenguaje actuales son, en términos de capacidad bruta, sorprendentemente buenos en la tarea específica para la que se diseña cada demo: eso no es lo que está en duda. El problema es que una demo se construye, casi siempre, alrededor de los casos donde la herramienta se desempeña mejor —los ejemplos que el propio equipo de implementación eligió para mostrarla—, mientras que el uso real de producción expone a la herramienta a la distribución completa de casos que existen en una operación, incluyendo el porcentaje que cualquier sistema, humano o automatizado, maneja peor. Ese porcentaje nunca es cero, y el tamaño exacto varía según la tarea, pero lo que determina si un piloto sobrevive no es si ese porcentaje existe —siempre existe—, sino si alguien diseñó, antes de lanzar la herramienta a producción, qué pasa cuando aparece.

## La pregunta que casi nunca se responde antes del piloto

En la mayoría de las implementaciones que he visto de cerca, la pregunta "¿quién revisa y corrige los casos donde el sistema se equivoca?" no se responde explícitamente antes de lanzar el piloto a producción. Se asume, implícitamente, que alguien del equipo lo hará como parte de su trabajo normal, sin que esa responsabilidad se asigne con la misma formalidad con la que se asignaría cualquier otro cambio de proceso. El resultado, cuando el piloto escala de diez usuarios de prueba a cien usuarios reales, es que nadie tiene claro quién es responsable de detectar y corregir los errores que el sistema comete con más frecuencia de la esperada, lo que convierte cada error individual en una fuente de desconfianza acumulada hacia la herramienta completa, en lugar de en un caso aislado que un proceso bien diseñado habría absorbido sin fricción.

## El error con el que menos se cuenta: la confianza mal calibrada

Hay un tipo específico de falla que distingue a los sistemas de IA generativa de la mayoría del software empresarial anterior: el sistema puede estar completamente equivocado y sonar exactamente igual de seguro que cuando tiene razón. Un error de software tradicional suele manifestarse como un mensaje de error visible, un valor nulo, un proceso que se detiene. Un error de un modelo de lenguaje generativo, en cambio, suele manifestarse como una respuesta fluida, bien redactada y completamente convincente, que resulta estar equivocada en un detalle que solo alguien con conocimiento específico del tema puede detectar. Los equipos que no diseñaron explícitamente un mecanismo de verificación para ese tipo de error —distinto del mecanismo de verificación que usarían para un error de software tradicional— suelen descubrir el problema solo después de que una decisión real se tomó con base en información incorrecta, no durante la fase de piloto, donde los casos de prueba rara vez incluyen ese tipo específico de falla silenciosa.

## Por qué el proceso que rodea a la herramienta importa más que la herramienta misma

Un patrón que se repite con la suficiente consistencia como para generalizarlo: los procesos operativos que una empresa ya tiene en funcionamiento fueron diseñados, casi siempre, asumiendo que cada paso lo ejecuta una persona, con el tipo de criterio, fatiga y errores que caracterizan al juicio humano. Insertar una herramienta de IA generativa dentro de ese mismo proceso, sin rediseñar ningún paso, equivale a asumir que el nuevo componente va a fallar de la misma forma y con la misma frecuencia que la persona a la que reemplaza o asiste, lo cual casi nunca es cierto: un modelo de lenguaje falla con una frecuencia y en patrones distintos —a veces más baja en promedio, pero con fallas más difíciles de anticipar en los casos extremos— que una persona entrenada en la misma tarea. Un proceso que no se ajustó para ese patrón de fallas distinto termina, en la práctica, exponiendo a la organización a un tipo de riesgo que el diseño original del proceso nunca contempló, independientemente de qué tan capaz sea el modelo subyacente.

## Lo que distingue a los pocos pilotos que sí sobreviven

Los casos que sí logran pasar de piloto a uso sostenido comparten, en mi experiencia, un rasgo común que tiene poco que ver con qué tan avanzado era el modelo que usaban: definieron, antes de escalar más allá del grupo de prueba inicial, exactamente quién revisa qué porcentaje de las salidas del sistema, qué umbral de confianza requiere intervención humana obligatoria, y qué mecanismo existe para que un usuario reporte un error sin que eso implique abandonar la herramienta por completo. Ninguna de esas tres decisiones depende de la sofisticación del modelo; dependen de que alguien en la organización se haya sentado, de forma deliberada, a rediseñar el proceso operativo alrededor de la herramienta, en lugar de simplemente insertar la herramienta dentro del proceso que ya existía.

## La tentación de medir el éxito del piloto con las métricas equivocadas

Una complicación adicional es que las métricas que mejor predicen el éxito de una demo —precisión en un conjunto de prueba curado, velocidad de respuesta, satisfacción inicial de los primeros usuarios— rara vez son las mismas métricas que predicen si la herramienta sobrevivirá el uso sostenido en producción. Una herramienta puede tener una precisión aceptable en promedio y aun así fallar en la adopción, si los errores que comete, aunque poco frecuentes, ocurren en los casos de mayor consecuencia para el negocio, o si el costo de detectar y corregir cada error termina siendo mayor que el tiempo que la herramienta ahorra en los casos donde funciona bien. Medir únicamente la tasa de acierto general, sin desagregar por tipo de caso y por costo de cada tipo de error, es una forma común de declarar éxito en el piloto que no se sostiene una vez que la herramienta opera a escala real.

## El costo de no decidir a tiempo quién es dueño del resultado

Una de las formas más silenciosas en que un piloto se deteriora es cuando la pregunta de "quién es dueño del resultado que produce la herramienta" queda sin resolver. En un proceso operado completamente por personas, la responsabilidad sobre el resultado final suele estar clara, aunque nadie la haya escrito formalmente: la persona que firma el reporte, que envía el correo, que aprueba la decisión, es responsable de lo que ese documento dice. Cuando una herramienta de IA generativa participa en producir ese mismo resultado, esa claridad tiende a diluirse si nadie la reafirma explícitamente: el usuario puede asumir que, como el sistema generó el borrador, la responsabilidad sobre errores de fondo también se trasladó al sistema, mientras que quien aprobó la implementación puede asumir lo contrario. Esa ambigüedad no se resuelve sola con el tiempo; tiende a resolverse de la peor forma posible, que es después de que un error real ya salió a producción y nadie puede explicar con claridad en qué punto del proceso debió haberse detectado.

## Por qué la resistencia del equipo rara vez es el verdadero obstáculo

Es común atribuir el fracaso de una implementación a la resistencia al cambio del equipo que debía adoptarla, pero en los casos que he podido observar de cerca, esa explicación suele ser incompleta: lo que se interpreta como resistencia es, con más frecuencia, una reacción razonable de un equipo que empezó a notar errores de la herramienta sin que existiera un canal claro para reportarlos, corregirlos o entender por qué ocurrieron. Un equipo que confiaba inicialmente en la herramienta, y que ve sus preocupaciones ignoradas o minimizadas después de señalar un error real, no está siendo resistente al cambio: está respondiendo racionalmente a una señal de que el proceso que rodea a la herramienta no fue diseñado para absorber ese tipo de retroalimentación. Tratar esa reacción como un problema de actitud, en lugar de como información válida sobre una falla de diseño del proceso, suele profundizar el problema en lugar de resolverlo.

## Lo que queda pendiente de resolver en cada nueva implementación

Ninguna de estas observaciones resuelve por adelantado el diseño específico que cada organización necesita para su caso particular: el umbral correcto de supervisión humana, el proceso de corrección adecuado y el costo tolerable de cada tipo de error dependen del contexto específico de cada implementación, y no hay una fórmula genérica que los determine de antemano. Lo que sí parece sostenerse, caso tras caso, es que esas preguntas tienen que responderse antes de que el piloto escale, no después de que la segunda semana de uso real ya expuso el problema que nadie anticipó.
