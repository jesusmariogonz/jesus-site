---
titulo: 'Por qué toda migración de datos termina costando el doble de lo planeado, y no es porque el plan estuviera mal hecho'
fecha: 2026-10-15
categoria: leadership
mundo: notas-de-campo
tags:
  - migración de datos
  - gestión de proyectos
  - falacia de planeación
  - arquitectura de datos
  - estimación
  - liderazgo técnico
  - transformación digital
  - deuda técnica
resumen: 'Casi ninguna migración de datos termina en el tiempo y presupuesto originales, y la explicación habitual —mala planeación— rara vez es la correcta. El verdadero problema es un sesgo cognitivo bien documentado que ningún plan, por detallado que sea, logra neutralizar por sí solo.'
tesis: 'Las migraciones de datos no se retrasan porque los equipos planeen mal, sino porque la estimación de cualquier proyecto complejo está sujeta a la falacia de planeación: una tendencia sistemática a subestimar el tiempo y el costo basándose en el mejor escenario posible, en vez de en la distribución real de resultados de proyectos similares.'
datosClave:
  - valor: '1979'
    etiqueta: 'año en que Daniel Kahneman y Amos Tversky documentaron formalmente la falacia de planeación'
  - valor: '2x-3x'
    etiqueta: 'sobrecosto típico reportado en estudios de grandes proyectos de TI frente a su presupuesto original'
  - valor: '1'
    etiqueta: 'variable que la mayoría de los planes de migración de datos nunca incluye explícitamente: cuántos sistemas dependientes no documentados existen'
imagen: /blog/portadas/negocios-reunion-8.jpg
gancho: 'El plan decía 4 meses. Tomó 11. Nadie en el equipo mintió en la estimación original — y esa es justo la parte que debería preocuparnos más.'
socialImagen: /blog/social/por-que-toda-migracion-de-datos-cuesta-el-doble.jpg
postura:
  pregunta: '¿Deberían las organizaciones simplemente duplicar o triplicar cualquier estimación de tiempo que reciban de su equipo técnico para un proyecto de migración de datos, o es mejor invertir en mejorar la precisión de la estimación misma?'
  aFavor: 'Si el sobrecosto es un patrón sistemático y predecible, la respuesta más pragmática es ajustar las expectativas desde el inicio —presupuestar y planear asumiendo el doble del tiempo estimado— en vez de gastar recursos adicionales tratando de perfeccionar una estimación que la evidencia sugiere que seguirá siendo optimista sin importar cuánto esfuerzo se le dedique.'
  enContra: 'Duplicar automáticamente cualquier estimación sin entender por qué fue optimista no resuelve el problema de fondo, solo lo oculta: una organización que adopta esa regla deja de aprender qué tipo de dependencias no documentadas o supuestos erróneos está subestimando sistemáticamente, y termina repitiendo el mismo patrón de descubrimiento tardío en el siguiente proyecto, solo que con un presupuesto más generoso para absorberlo.'
---

## Un plan de cuatro meses que tomó once

Hay un patrón que se repite con una consistencia incómoda en proyectos de migración de datos dentro de organizaciones de cualquier tamaño: el plan original, elaborado con cuidado genuino por un equipo técnico competente, estima un plazo razonable —digamos, cuatro meses— y el proyecto termina tomando el doble o el triple de ese tiempo. Lo que distingue a este patrón de un simple caso de mala gestión es que ocurre incluso cuando el equipo que estimó el plazo es experimentado, cuando nadie mintió deliberadamente sobre la complejidad del trabajo, y cuando el plan en sí mismo, revisado después del hecho, no contenía ningún error obvio de cálculo. La migración simplemente tomó más tiempo del que cualquier persona involucrada, actuando de buena fe, había anticipado.

## El nombre que la psicología le puso a esto hace casi cinco décadas

En 1979, Daniel Kahneman y Amos Tversky documentaron formalmente este patrón bajo el nombre de falacia de planeación: la tendencia sistemática de las personas y los equipos a estimar el tiempo y el costo de una tarea basándose en el escenario donde todo sale razonablemente bien, en vez de basarse en la distribución real de resultados que proyectos comparables han tenido en el pasado. La observación central de Kahneman y Tversky no era que la gente sea mala estimando por falta de habilidad técnica, sino que existe un sesgo cognitivo estructural: cuando alguien imagina cómo va a desarrollarse un proyecto futuro, construye mentalmente una narrativa plausible de ejecución —esto se hace, luego esto otro, luego se prueba, luego se despliega— y esa narrativa, casi por construcción, omite los obstáculos que todavía no se pueden anticipar porque ni siquiera se sabe que existen.

## Por qué las migraciones de datos son un caso particularmente puro de esto

Las migraciones de datos son, en este sentido, uno de los tipos de proyecto más susceptibles a la falacia de planeación, por una razón estructural específica: la estimación inicial casi siempre se basa en el inventario de sistemas y dependencias que el equipo YA conoce, no en el inventario real de sistemas y dependencias que existen. Un reporte que lleva cinco años corriendo silenciosamente cada lunes por la mañana, conectado a una fuente de datos que nadie documentó formalmente porque quien lo configuró ya no trabaja en la organización, no aparece en ningún plan de migración hasta que deja de funcionar el primer lunes después del corte —momento en el que alguien, en algún área de la empresa, reporta que "el número de siempre" ya no cuadra. Ese tipo de dependencia no documentada es, por definición, invisible para cualquier estimación hecha antes de empezar: no es que el equipo haya sido negligente al no incluirla, es que no existía forma de saber que existía sin, en los hechos, ya haber completado buena parte de la migración.

## La diferencia entre un mal plan y un plan optimista

Vale la pena distinguir con precisión entre dos cosas que suelen confundirse cuando una migración se retrasa: un plan mal hecho —que no identificó riesgos que sí eran identificables con la información disponible en el momento— y un plan optimista —que estimó correctamente con base en la información disponible, pero esa información resultó ser incompleta de una forma que solo se revela ejecutando el trabajo. La mayoría de los retrasos reales en proyectos de migración caen en la segunda categoría, no en la primera, lo cual tiene una implicación incómoda: mejorar la calidad del proceso de planeación —más reuniones de descubrimiento, más entrevistas con stakeholders, más documentación previa— ayuda, pero tiene un límite estructural, porque ninguna cantidad de planeación previa puede documentar dependencias que ni siquiera los dueños actuales de los sistemas saben que existen.

## Lo que un inventario de "lo que no sabemos que no sabemos" sí puede hacer

Esto no significa que la situación sea inmanejable, pero sí significa que la herramienta correcta no es "planear mejor" en el sentido convencional, sino incorporar explícitamente, desde el inicio del proyecto, un margen de contingencia dimensionado con base en la tasa histórica real de sobrecostos de proyectos comparables —no con base en la intuición de cuánto margen "se siente" razonable agregar. Los estudios disponibles sobre grandes proyectos de tecnología reportan de forma consistente sobrecostos de entre el doble y el triple del presupuesto original, un rango que debería funcionar como ancla de referencia al presupuestar un nuevo proyecto de migración, en vez de ajustar el plan original hacia arriba en un 10% o 15% como gesto simbólico de prudencia que en la práctica no cambia nada sustantivo.

## El riesgo de la solución fácil: duplicar el número sin entender por qué

Hay, sin embargo, una forma superficial de aplicar esta lección que termina siendo tan poco útil como ignorarla por completo: adoptar la regla de "duplicar cualquier estimación que llegue" sin invertir en entender qué tipo de dependencias no documentadas suele aparecer en el tipo específico de migraciones que una organización particular enfrenta. Una organización que simplemente infla sus presupuestos de tiempo sin aprender nada del patrón de sorpresas que sus propios proyectos anteriores revelaron —qué áreas suelen tener reportes no documentados, qué integraciones suelen faltar en el inventario inicial, qué dueños de sistemas suelen haberse ido sin dejar documentación— va a seguir descubriendo las mismas categorías de sorpresa en el siguiente proyecto, solo que ahora con más tiempo y presupuesto disponible para absorberlas sin que eso cuente como una crisis.

## El caso contrario: cuando un equipo sí vio venir el retraso

Vale la pena describir también el patrón opuesto, porque es igual de instructivo. En los proyectos de migración que logran acercarse más a su estimación original, casi siempre hay una práctica específica que los distingue de los que se desvían con fuerza: alguien, en algún punto del proceso de planeación, hizo explícitamente la pregunta "¿qué pasó la última vez que intentamos algo parecido, y por qué se tardó más de lo planeado?" —y tomó la respuesta en serio, en vez de tratarla como una anécdota incómoda del pasado que no aplica a este proyecto porque "esta vez es diferente". Esa frase, "esta vez es diferente", es casi un marcador textual de la falacia de planeación operando en tiempo real: cada proyecto se siente distinto desde dentro, con su propio equipo, su propio alcance, sus propias particularidades, y esa sensación de especificidad es precisamente lo que hace que la lección del proyecto anterior se sienta inaplicable, incluso cuando el patrón subyacente —dependencias no documentadas, propietarios de sistemas que ya no están, integraciones que nadie recordaba— es casi idéntico de un proyecto a otro.

## Por qué esto no es un problema exclusivo de los equipos técnicos

Es tentador leer todo esto como un problema de ingeniería de datos específicamente, pero la falacia de planeación no distingue por disciplina: afecta por igual a la estimación de una remodelación de cocina, al tiempo que toma escribir un libro, o a la fecha de entrega de un edificio público. Lo que hace que las migraciones de datos sean un caso particularmente visible dentro de una organización es que el costo de la sorpresa suele ser alto y públicamente medible —un sistema que deja de funcionar, un reporte que un ejecutivo necesita y no está, una fecha de corte que se mueve más de una vez frente a toda la organización—, mientras que el mismo sesgo operando en otros tipos de proyecto organizacional, menos visibles o menos medibles con precisión, simplemente no genera el mismo tipo de atención pública cuando también se retrasa.

## Lo que cambia cuando se nombra el problema correctamente

Hay un beneficio menos obvio, pero igual de real, en reconocer explícitamente que el retraso de una migración de datos responde a un sesgo cognitivo bien documentado y no a una falla de ejecución del equipo: cambia la conversación que ocurre cuando el proyecto efectivamente se atrasa. Un equipo que entiende que la falacia de planeación es la explicación por defecto —no la excepción vergonzosa que hay que ocultar— puede reportar un hallazgo de dependencia no documentada en el mes seis como información útil para ajustar el plan, en vez de como una confesión de que algo salió mal que alguien debe explicar. Esa diferencia, aparentemente solo de tono, determina en la práctica si el equipo sigue reportando sorpresas con honestidad conforme aparecen, o empieza a esconderlas hasta que ya no se pueden ocultar —que es, casi siempre, el momento en que un retraso manejable se convierte en una crisis de proyecto.

## Fuentes

- Daniel Kahneman y Amos Tversky, "Intuitive prediction: biases and corrective procedures", *TIMS Studies in Management Science*, 1979 — formulación original de la falacia de planeación
- Daniel Kahneman, *Thinking, Fast and Slow*, 2011 — capítulo sobre optimismo y la falacia de planeación aplicada a estimación de proyectos
- Bent Flyvbjerg, *How Big Things Get Done*, 2023 — investigación empírica sobre sobrecostos y retrasos en grandes proyectos, con datos comparativos de distintas industrias, incluida tecnología
- Reflexión propia a partir de experiencia profesional directa en proyectos de migración de datos en entornos corporativos, sin revelar información confidencial ni nombrar clientes o proyectos específicos
