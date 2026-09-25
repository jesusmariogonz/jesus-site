---
titulo: 'El Excel paralelo: por qué los equipos siguen desconfiando del dato "oficial"'
fecha: 2026-09-25
categoria: business
mundo: notas-de-campo
tags:
  - gobierno de datos
  - cultura organizacional
  - transformación digital
  - Excel
  - shadow IT
  - toma de decisiones
  - adopción de tecnología
  - liderazgo de datos
resumen: 'Una empresa puede invertir millones en una plataforma de datos impecable y seguir viendo cómo sus equipos toman decisiones desde una hoja de Excel paralela que nadie autorizó. El problema casi nunca es técnico — es que el Excel paralelo resuelve, mejor que la plataforma oficial, un problema de confianza que la plataforma nunca se propuso resolver.'
tesis: 'Cuando un equipo de negocio prefiere una hoja de cálculo hecha a mano sobre un dashboard corporativo técnicamente superior, no está siendo tecnológicamente perezoso: está resolviendo racionalmente un problema de confianza y de control que la plataforma oficial no le da, y ningún rediseño de arquitectura de datos corrige eso si no se corrige primero el problema de fondo.'
datosClave:
  - valor: '2-3 fuentes'
    etiqueta: 'Número típico de versiones distintas del mismo indicador de negocio que coexisten en una organización mediana antes de un esfuerzo serio de gobierno de datos'
  - valor: '"single source of truth"'
    etiqueta: 'La promesa estándar de cualquier iniciativa de plataforma de datos corporativa — y la que con más frecuencia no se cumple en la práctica, no por falla técnica sino organizacional'
  - valor: '0 líneas de código'
    etiqueta: 'Lo que cuesta, en términos de aprobación de TI, abrir una hoja de Excel nueva y empezar a llevar el control ahí — el punto de comparación real contra el que compite cualquier plataforma oficial'
imagen: /blog/portadas/el-excel-paralelo-por-que-los-equipos-desconfian-del-dato-oficial.jpg
---

Cualquiera que haya trabajado de cerca con la implementación de una plataforma de datos corporativa reconoce el patrón, aunque rara vez se documenta con esas palabras: la plataforma se lanza, con gobernanza, con controles de calidad, con un dashboard que consolida el indicador clave que antes vivía disperso en media docena de hojas de cálculo — y meses después, en la reunión donde realmente se toma la decisión, alguien sigue abriendo su propio Excel. No el dashboard oficial. Su Excel. El que él o ella misma arma, actualiza a mano y defiende con una convicción que no tiene nada que ver con la calidad técnica de la plataforma que se supone debía reemplazarlo.

## El diagnóstico fácil, y por qué está incompleto

La respuesta reflexiva de cualquier equipo de datos ante este fenómeno es diagnosticarlo como resistencia al cambio, falta de capacitación, o simple inercia — "todavía no se acostumbran a la herramienta nueva". Ese diagnóstico no es falso, pero es superficial, porque asume que el problema es de adopción y no de diseño. La pregunta más incómoda, y la que rara vez se hace en voz alta dentro de un comité de transformación digital, es distinta: ¿qué le está dando ese Excel paralelo a la persona que lo mantiene, que la plataforma oficial —con toda su superioridad técnica— no le está dando?

## Lo que el Excel resuelve que la plataforma no resuelve

La respuesta, en la mayoría de los casos que uno observa de cerca, no es velocidad ni funcionalidad — es control epistémico. Quien construye su propio Excel sabe, con certeza absoluta, de dónde salió cada cifra, qué supuesto se aplicó en cada ajuste manual, y qué excepción se corrigió a mano la semana pasada porque el sistema fuente traía un error conocido. Esa persona puede defender ese número frente a cualquier pregunta en la sala, porque lo construyó celda por celda. El dashboard oficial, en cambio, suele llegar como una caja parcialmente opaca: el número es —probablemente— más preciso en términos agregados, pero la persona que lo presenta no siempre puede explicar, en tiempo real y frente a su jefe, exactamente qué transformación produjo esa cifra específica. Entre un número que uno puede defender con certeza y otro que probablemente es más correcto pero no se puede explicar con la misma seguridad, la elección racional —no la perezosa, la racional— suele inclinarse hacia el primero.

## El costo de aprobación que nadie mide

Hay una segunda razón, menos discutida todavía, y tiene que ver con el costo de fricción organizacional. Cambiar una fórmula en un Excel propio toma minutos y no requiere aprobación de nadie. Solicitar un cambio en la lógica de un dashboard corporativo —agregar una columna, ajustar un filtro, incorporar una excepción de negocio legítima— casi siempre implica un ticket, una cola de trabajo del equipo de datos, y un tiempo de espera medido en días o semanas. Para alguien que necesita tomar una decisión esta semana, no el próximo trimestre, esa asimetría de costos no es un detalle menor: es el factor decisivo. El Excel paralelo gana, en la práctica, no porque sea mejor herramienta, sino porque responde a la velocidad real del negocio y la plataforma oficial, por bien diseñada que esté técnicamente, con frecuencia no.

## Por qué "más gobierno de datos" no es la respuesta completa

La reacción institucional típica ante este problema es reforzar la gobernanza: prohibir explícitamente los Excels paralelos, restringir el acceso a los datos fuente, centralizar aún más el control sobre qué cifra es la "oficial". Esa respuesta, aplicada sola, tiende a empeorar el problema de fondo en lugar de resolverlo, porque ataca el síntoma —la existencia del Excel— sin tocar la causa —por qué era racional crearlo en primer lugar—. Prohibir el Excel sin resolver el problema de confianza y de velocidad que ese Excel resolvía no elimina la necesidad; simplemente la empuja más lejos de la vista de TI, hacia una hoja de cálculo todavía más informal, compartida por correo electrónico en lugar de guardada en una carpeta compartida donde al menos alguien podría encontrarla.

## Lo que sí parece funcionar: transparencia de linaje, no solo autoridad de origen

La alternativa que con más frecuencia reduce —nunca elimina del todo, y es importante no prometer eso— la dependencia del Excel paralelo no es imponer con más fuerza cuál es la fuente oficial, sino hacer visible, dentro de la plataforma misma, el linaje completo de cada cifra: de dónde vino, qué transformaciones se le aplicaron, y qué excepciones de negocio se codificaron y por qué. Cuando la persona que antes mantenía su Excel puede entrar al dashboard oficial y reconstruir, con el mismo nivel de detalle que tenía en su hoja de cálculo, exactamente cómo se llegó a ese número, el argumento a favor del Excel paralelo pierde su fundamento racional — no por decreto, sino porque la plataforma empezó a ofrecer lo mismo que el Excel ofrecía, más la escala y la consistencia que el Excel nunca pudo dar.

## El patrón se repite, aunque la herramienta cambie de nombre

Vale la pena notar que este fenómeno no es exclusivo de Excel ni depende de que la organización todavía use hojas de cálculo de forma literal. La misma dinámica aparece, con otro disfraz, cuando un equipo mantiene su propio script de Python que replica —y en su cabeza, corrige— la lógica de un pipeline de datos oficial, o cuando un analista construye un reporte de Power BI personal, fuera del catálogo corporativo, porque el reporte certificado tarda tres semanas en incorporar un cambio que su reporte propio incorpora en una tarde. El nombre de la herramienta cambia con cada generación de tecnología corporativa; el patrón subyacente —la brecha entre la velocidad que el negocio necesita y la velocidad que la estructura de gobierno puede ofrecer— se mantiene prácticamente idéntico. Esto importa porque significa que ninguna migración tecnológica, por sofisticada que sea la plataforma de reemplazo —de Excel a un data warehouse, de ahí a una arquitectura de lakehouse, de ahí a agentes de IA que prometen generar el análisis a demanda—, resuelve el problema por sí sola si no resuelve primero la asimetría de confianza y de tiempo de respuesta que lo origina.

## Cuando el Excel paralelo, de hecho, protege a la organización

Hay todavía un matiz adicional que rara vez se reconoce en los comités de gobierno de datos, y es que el Excel paralelo no siempre es disfuncional: en ciertos casos, funciona como un mecanismo legítimo de control de calidad informal. Cuando un analista de negocio detecta, mediante su propia hoja de cálculo, que el número que arroja el dashboard oficial no cuadra con lo que él sabe que ocurrió en el terreno —una venta mal clasificada, un tipo de cambio aplicado con la fecha incorrecta, una excepción de negocio que el pipeline automatizado no contempló—, ese Excel paralelo actuó, de facto, como una auditoría manual que evitó que una decisión se tomara sobre datos equivocados. El error de diseño organizacional no está en que esa verificación exista; está en que, con demasiada frecuencia, ese hallazgo se queda atrapado en la hoja de cálculo personal de quien lo detectó, en lugar de convertirse en una corrección visible y permanente dentro de la plataforma oficial. Un buen proceso de gobierno de datos no elimina esa capacidad de verificación manual —la necesita—, sino que le da un canal explícito para alimentar de vuelta a la fuente central, en lugar de dejar que se acumule, invisible, en docenas de archivos personales dispersos por toda la organización.

## Lo que un equipo de datos puede medir, si quiere ver el problema de frente

La mayoría de los equipos de datos miden adopción de su plataforma con métricas que, sin proponérselo, ocultan exactamente el problema que están tratando de resolver: número de usuarios activos, número de consultas ejecutadas, tiempo promedio de cada sesión. Ninguna de esas métricas responde la pregunta que realmente importa, que es cuántas decisiones de negocio significativas —una asignación de presupuesto, un ajuste de precio, un cambio de estrategia comercial— se tomaron, en última instancia, con el número que salió del dashboard oficial frente a las que se tomaron con el número que salió de un archivo paralelo. Esa métrica es más difícil de capturar —requiere preguntar directamente, en la sala de decisión, "¿de dónde sacaste esa cifra?"— pero es la única que le dice a un equipo de datos si su plataforma ganó, de verdad, la confianza que se propuso ganar, o si simplemente ganó tráfico.

## La pregunta que vale la pena hacerse antes del próximo rediseño

Antes de invertir en la siguiente iteración de cualquier plataforma de datos corporativa, vale la pena hacer un ejercicio incómodo: identificar los dos o tres Excels paralelos más persistentes de la organización —los que sobreviven proyecto tras proyecto, migración tras migración— y preguntarle directamente a quien los mantiene, sin actitud defensiva, qué le dan esos archivos que la plataforma oficial no le da. La respuesta casi nunca es "porque el Excel es mejor tecnológicamente". Casi siempre es una versión de "porque en el Excel yo sé exactamente qué estoy viendo, y puedo defenderlo" — y esa respuesta, más que cualquier métrica de adopción, es el verdadero diagnóstico de qué tan lejos está realmente una organización de tener, en la práctica y no solo en el discurso, una única fuente de verdad.
