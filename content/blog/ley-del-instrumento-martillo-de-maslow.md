---
titulo: 'La ley del instrumento: por qué el que solo tiene un martillo ve clavos en todas partes'
fecha: 2026-10-21
categoria: opinion
mundo: notas-de-campo
tags:
  - sesgos cognitivos
  - ley del instrumento
  - martillo de Maslow
  - toma de decisiones
  - psicología
  - tecnología y negocio
resumen: 'La ley del instrumento —el sesgo cognitivo de tratar casi cualquier problema como si fuera un clavo cuando la única herramienta que se tiene es un martillo— tiene nombre formal desde 1964 y una frase que la volvió famosa desde 1966. Qué dice realmente, por qué el cerebro cae en ella por diseño, y cómo se ve en tecnología y negocio cuando la herramienta favorita deja de ser la más adecuada.'
tesis: 'La ley del instrumento no describe la incompetencia de usar mal una herramienta, sino algo más sutil y más difícil de detectar: la competencia real en un instrumento específico es precisamente lo que hace que dejar de usarlo se sienta como un error, incluso cuando el problema ya cambió. El antídoto no es desconfiar de la pericia —es separar, antes de actuar, la definición del problema de la herramienta con la que se le quiere resolver.'
datosClave:
  - valor: '1964'
    etiqueta: 'Año en que el filósofo Abraham Kaplan formalizó "la ley del instrumento" en su libro The Conduct of Inquiry'
    fuente: 'Abraham Kaplan, The Conduct of Inquiry'
  - valor: '1966'
    etiqueta: 'Año en que Abraham Maslow popularizó la versión con la frase del martillo y el clavo, en The Psychology of Science'
    fuente: 'Abraham Maslow, The Psychology of Science'
imagen: /blog/portadas/ley-del-instrumento-martillo-de-maslow.jpg
gancho: 'Un desarrollador que resuelve todo con su framework favorito. Un médico que receta antes de preguntar por hábitos. Un analista que abre Excel para lo que ya no cabe en una hoja de cálculo. Todos están siendo competentes con su herramienta — y ese es exactamente el problema.'
socialImagen: /blog/social/ley-del-instrumento-martillo-de-maslow.jpg
postura:
  pregunta: '¿La ley del instrumento es un sesgo real que vale la pena corregir activamente, o es simplemente el costo inevitable —y en el fondo razonable— de la especialización profesional?'
  aFavor: 'Es un sesgo real y corregible: definir primero el problema y auditar las opciones disponibles antes de elegir la herramienta evita decisiones costosas —un stack tecnológico sobredimensionado, un tratamiento médico innecesario— que la sola comodidad de lo conocido nunca habría cuestionado por sí sola.'
  enContra: 'Mucho de lo que parece "ver clavos en todas partes" es, en realidad, el uso eficiente de una herramienta ya dominada: un experto que reconoce rápido que su martillo sirve para el 80% de los casos ahorra el tiempo y el riesgo de reinventar el enfoque cada vez, y exigir evaluar "todas las opciones" en cada decisión es, con frecuencia, una receta para la parálisis por análisis más que para mejores resultados.'
---

Un desarrollador que domina un framework lo usa para el siguiente proyecto, y para el que sigue después de ese, incluso cuando el problema que tiene enfrente pide otra cosa. Un médico entrenado durante años en intervenciones farmacológicas receta antes de preguntar por el sueño, la dieta o el estrés del paciente. Un analista que lleva una década en Excel abre una hoja de cálculo para una tarea que, en realidad, ya necesita una base de datos. En los tres casos nadie está siendo incompetente —todos están usando, con soltura real, la herramienta que mejor conocen. Ese es, precisamente, el mecanismo que describe la ley del instrumento: el sesgo cognitivo de tratar casi cualquier problema como si fuera el tipo exacto de problema que la herramienta familiar sabe resolver.

## De dónde viene el nombre, y por qué dos personas distintas lo cuentan diferente

El filósofo Abraham Kaplan fue quien le dio nombre formal al fenómeno en 1964, en su libro *The Conduct of Inquiry: Methodology for Behavioral Science*, usando la imagen de un niño con un martillo que de pronto encuentra que todo merece ser golpeado. Dos años después, en 1966, el psicólogo Abraham Maslow —el mismo de la pirámide de necesidades— popularizó la versión que terminó quedándose en el lenguaje común, en su libro *The Psychology of Science*: "Supongo que es tentador, si la única herramienta que tienes es un martillo, tratar todo como si fuera un clavo." La frase de Maslow es la que la gente cita; el concepto formal es el de Kaplan. Y, como suele pasar con las ideas que resuenan tanto, hay evidencia de que ninguno de los dos la inventó del todo: hay rastros de la misma intuición —alguien con una herramienta, viendo problemas donde esa herramienta aplica— circulando ya desde el siglo XIX, mucho antes de que tuviera nombre académico.

## El mecanismo real no es pereza, es conservación de energía

Vale la pena ser precisos sobre qué tipo de error es éste, porque no es el error obvio de alguien que no sabe lo que hace. El cerebro, de forma bastante razonable desde el punto de vista evolutivo, prefiere por defecto los hábitos ya practicados y la pericia ya construida en vez de evaluar un enfoque nuevo desde cero cada vez que aparece un problema —aprender una herramienta distinta tiene un costo cognitivo real, mientras que usar la que ya se domina es, en el momento, casi gratis. Esa economía de esfuerzo funciona bien la mayoría de las veces: es exactamente lo que vuelve eficiente a un experto, que no necesita reinventar su enfoque para cada caso nuevo. El problema aparece cuando esa misma economía empieza a decidir *qué tipo de problema se cree que se tiene enfrente*, en vez de solo decidir cómo resolver un problema ya bien definido. Ahí es donde la pericia deja de ser una ventaja y empieza a funcionar como un filtro que hace invisibles las opciones que no pasan por la herramienta familiar.

## Cómo se ve en tecnología y negocio

El ejemplo más citado de la ley del instrumento —usar un programa de hojas de cálculo complejo para lo que en realidad es un documento de texto simple— es solo la versión más visible de un patrón que aparece en casi cualquier decisión técnica o comercial:

- **Elegir el framework o lenguaje de programación favorito** para un proyecto que, por su naturaleza, pediría otra arquitectura —no porque sea objetivamente la mejor opción, sino porque es la que el equipo ya domina y con la que se siente más rápido.
- **Construir un dashboard para cualquier pregunta de negocio**, incluso cuando la pregunta real no es "¿cómo se ve esta métrica a lo largo del tiempo?" sino algo que necesitaría una investigación cualitativa, una entrevista con el cliente, o simplemente una decisión sin más datos que los que ya hay.
- **Aplicar inteligencia artificial generativa a un proceso** porque es la herramienta del momento y hay presupuesto y atención ejecutiva disponibles para ella, no porque un análisis objetivo del problema haya concluido que es la solución correcta frente a, por ejemplo, simplemente rediseñar el proceso manual.
- **Recurrir exclusivamente a medicamentos o cirugía** para condiciones que responderían igual o mejor a cambios de hábito o intervención conductual —el ejemplo médico de la lista original, y uno de los más estudiados en la literatura sobre este sesgo.

En los cuatro casos, la herramienta elegida no es mala —es, casi siempre, una herramienta real y competente en manos de quien la eligió. Lo que falla es el paso anterior: nunca se hizo la pregunta de si ésa era, en efecto, la herramienta que el problema específico necesitaba, o si simplemente era la que primero vino a la mente.

## El costo que no se ve hasta que alguien lo mide

Lo que vuelve a este sesgo particularmente difícil de detectar desde adentro es que casi nunca produce un fracaso evidente —produce, con más frecuencia, una solución que funciona lo suficientemente bien como para no generar la pregunta de si una herramienta distinta habría funcionado mejor, más rápido o más barato. Un dashboard que sí responde parte de la pregunta de negocio se siente como éxito, aunque la pregunta completa requería otra cosa. Un tratamiento farmacológico que sí alivia el síntoma se siente como la decisión correcta, aunque la causa raíz —un hábito, un entorno, una condición de vida— siga sin tocarse. El costo de la ley del instrumento rara vez aparece como un error visible; aparece como una oportunidad que nadie llegó a considerar, porque la herramienta familiar ya había resuelto lo suficiente del problema como para que nadie preguntara si existía una mejor.

## Cómo se combate: separar la definición del problema de la elección de la herramienta

La salida que proponen quienes estudian este sesgo no es desconfiar de la pericia —sería, de hecho, una mala idea: la pericia real sigue siendo lo que vuelve eficiente a cualquier profesional—. La salida es ordenar la secuencia: primero definir con precisión cuál es el alcance real del problema, después hacer un inventario objetivo de las herramientas y los enfoques disponibles —no solo el que ya se domina—, y solo entonces preguntar de forma explícita: "¿hay una forma distinta o mejor de resolver esto?", antes de actuar. La pregunta no exige rechazar la herramienta familiar si, tras ese ejercicio, sigue siendo la mejor opción —con frecuencia lo es—. Exige, simplemente, que haya sido elegida después de mirar el problema, y no antes.

## Fuentes

- [Law of the instrument](https://en.wikipedia.org/wiki/Law_of_the_instrument) — Wikipedia
- [Quote Origin: If Your Only Tool Is a Hammer Then Every Problem Looks Like a Nail](https://quoteinvestigator.com/2014/05/08/hammer-nail/) — Quote Investigator
- Abraham Kaplan, *The Conduct of Inquiry: Methodology for Behavioral Science*, 1964
- Abraham Maslow, *The Psychology of Science: A Reconnaissance*, 1966
