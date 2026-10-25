---
titulo: 'Caos determinista: por qué la física exacta de Newton no puede predecir el clima de la próxima semana'
fecha: 2026-10-25
categoria: opinion
mundo: notas-de-campo
tags:
  - caos determinista
  - atractor de Lorenz
  - Edward Lorenz
  - Henri Poincaré
  - efecto mariposa
  - meteorología
  - física clásica
resumen: 'El atractor de Lorenz —esa figura de dos alas que parece una mariposa— nació de un accidente de redondeo en una simulación meteorológica de 1963: Edward Lorenz descubrió que un sistema completamente determinista, sin ningún elemento azaroso, podía volverse impredecible en la práctica. La idea tiene una raíz más antigua, en el trabajo de Henri Poincaré sobre el problema de los tres cuerpos de 1890, y hoy explica por qué ni el pronóstico del clima ni ningún otro sistema caótico puede extenderse indefinidamente en el tiempo, sin que eso signifique que las leyes físicas que lo gobiernan fallen.'
tesis: 'Que las ecuaciones de Lorenz sean deterministas —el mismo punto de partida produce siempre la misma trayectoria— es un hecho matemático verificable; que ese determinismo sea compatible con una impredecibilidad práctica total es la interpretación que hizo históricamente incómoda a la física clásica. El error no estaba en Newton ni en sus ecuaciones, sino en la suposición implícita de que un sistema determinista debía ser, por eso mismo, predecible: Lorenz y, antes que él, Poincaré, mostraron que esa equivalencia es falsa cuando el sistema amplifica exponencialmente cualquier diferencia microscópica en las condiciones iniciales.'
datosClave:
  - valor: '1963'
    etiqueta: 'Año de "Deterministic Nonperiodic Flow", el artículo de Edward Lorenz que fundó la teoría del caos moderna'
    fuente: 'Journal of the Atmospheric Sciences'
  - valor: '3 citas'
    etiqueta: 'Veces que el artículo de Lorenz fue citado por investigadores fuera de la meteorología en su primera década de vida'
  - valor: '1890'
    etiqueta: 'Año en que Henri Poincaré, estudiando el problema de los tres cuerpos, documentó por primera vez la sensibilidad extrema a las condiciones iniciales'
    fuente: 'Acta Mathematica'
  - valor: '3 variables'
    etiqueta: 'Ecuaciones diferenciales no lineales del sistema de Lorenz, la simplificación de convección atmosférica que generó el atractor'
imagen: /blog/portadas/caos-determinista-atractor-lorenz-mariposa.jpg
socialImagen: /blog/social/caos-determinista-atractor-lorenz-mariposa.jpg
gancho: 'En 1961, un meteorólogo del MIT redondeó un número de seis decimales a tres para ahorrar tiempo de cómputo, volvió a correr su simulación del clima y obtuvo un resultado completamente distinto. No había ningún error en su máquina ni ningún elemento de azar en sus ecuaciones. Lo que encontró Edward Lorenz ese día cambió para siempre la forma en que la física entiende los límites de la predicción.'
postura:
  pregunta: '¿El descubrimiento del caos determinista debería entenderse como una limitación fundamental del método científico para predecir el mundo físico, o simplemente como la delimitación precisa de en qué sistemas ese método sigue funcionando sin restricción?'
  aFavor: 'Si un sistema perfectamente descrito por ecuaciones exactas —sin ninguna variable oculta ni elemento probabilístico— puede volverse impredecible en la práctica a partir de diferencias microscópicas e inevitablemente no medibles en sus condiciones iniciales, entonces existe una clase entera de fenómenos físicos (clima, turbulencia, dinámica orbital de varios cuerpos) donde ninguna mejora futura de instrumentos o cómputo va a extender la ventana de predicción de forma indefinida: el límite no es tecnológico, es estructural.'
  enContra: 'El caos determinista no debilita el poder predictivo de la física clásica fuera de los sistemas específicos donde se manifiesta la sensibilidad exponencial: la misma mecánica newtoniana que no puede predecir el clima a 30 días predice con precisión extrema la trayectoria de una sonda espacial o el comportamiento de un péndulo simple, y haber identificado con exactitud matemática en qué condiciones aparece el caos —y en cuáles no— es, si acaso, una expansión del poder explicativo de la física, no una grieta en él.'
---

Entre octubre y noviembre de 1961, el meteorólogo y matemático Edward Lorenz, del Instituto Tecnológico de Massachusetts (MIT), estaba corriendo un modelo simplificado de la atmósfera en una computadora Royal McBee LGP-30 —una máquina que, por estándares actuales, cabría cómoda en la categoría de calculadora programable—. Quiso repetir una simulación que ya había corrido antes, pero para ahorrar tiempo de cómputo, en lugar de introducir el valor completo de seis decimales que había calculado la primera vez, redondeó una de las variables de entrada a tres decimales: de 0.506127 a 0.506. La diferencia parecía, para cualquier propósito práctico, irrelevante.

No lo fue. Al cabo de unas pocas semanas simuladas, la nueva corrida se había separado por completo de la original: donde la primera predecía un patrón de clima, la segunda predecía otro, sin ningún parecido reconocible entre ambos. Lorenz no había cometido ningún error de programación, y su modelo no tenía ningún componente aleatorio: era un sistema de ecuaciones completamente determinista, el mismo tipo de ecuaciones diferenciales que la física usa desde Newton para describir el movimiento de cualquier cuerpo. Lo que había descubierto —y lo que terminaría de formalizar en su artículo de 1963 "Deterministic Nonperiodic Flow", publicado en el Journal of the Atmospheric Sciences— era que ese determinismo no garantizaba, ni de lejos, la posibilidad de predecir el sistema a largo plazo.

## El atractor con forma de mariposa

Para estudiar el fenómeno de forma más manejable que un modelo atmosférico completo, Lorenz redujo el problema a un sistema de apenas tres ecuaciones diferenciales no lineales, pensado originalmente para describir, de forma muy simplificada, la convección térmica —el movimiento de un fluido calentado desde abajo, como el aire en la atmósfera—. Cuando se grafican las soluciones de ese sistema en tres dimensiones, la trayectoria no converge a un punto fijo ni se repite en un ciclo, sino que traza una superficie con dos lóbulos entrelazados que nunca se cruza exactamente sobre sí misma: el llamado atractor de Lorenz, la figura con forma de mariposa que se volvió, con el tiempo, el símbolo visual más reconocible de toda la teoría del caos.

La trayectoria da vueltas durante un tiempo alrededor de un lóbulo, salta de forma aparentemente impredecible al otro, vuelve a girar un número variable de veces, y así indefinidamente —sin repetirse nunca de forma exacta, pero sin alejarse tampoco al infinito: queda confinada dentro de una región acotada del espacio para siempre—. Esa combinación de confinamiento geométrico con no periodicidad total es, en esencia, la firma visual del caos determinista: orden y desorden coexistiendo en la misma estructura matemática.

## Por qué "determinista" y "caótico" no son contradictorios

La intuición física clásica, construida sobre más de dos siglos de mecánica newtoniana exitosa, tiende a equiparar "determinista" con "predecible": si las ecuaciones que gobiernan un sistema no tienen ningún componente azaroso, y conocemos las condiciones iniciales, debería ser posible calcular el estado futuro del sistema con tanta precisión como se quiera. Esa equivalencia es válida en una enorme cantidad de sistemas físicos —es la razón por la que se puede calcular con precisión extrema la trayectoria de una sonda espacial durante años—, pero deja de sostenerse en los sistemas donde pequeñas diferencias en el punto de partida crecen de forma exponencial con el tiempo, no de forma lineal.

En un sistema de crecimiento lineal de errores, medir las condiciones iniciales con el doble de precisión duplica, aproximadamente, cuánto tiempo hacia el futuro se puede predecir con confianza. En un sistema caótico, donde el error crece exponencialmente, duplicar la precisión de la medición inicial solo añade una cantidad fija —y comparativamente pequeña— de tiempo adicional de predicción confiable, sin importar cuánto se siga mejorando el instrumento de medición. Es la diferencia entre una limitación que la tecnología puede ir superando con el tiempo, y una limitación estructural del propio sistema, que ninguna mejora instrumental futura puede eliminar del todo.

## Una raíz más antigua: Poincaré y el problema de los tres cuerpos

Lorenz no fue el primero en tropezar con esta idea, aunque sí el primero en ponerle un ejemplo concreto, visual y con aplicación práctica inmediata. Más de setenta años antes, el matemático francés Henri Poincaré había llegado a una conclusión equivalente trabajando en un problema completamente distinto: el problema de los tres cuerpos, es decir, cómo describir el movimiento de tres objetos —por ejemplo, tres estrellas o un sistema Sol-Tierra-Luna— que se atraen entre sí gravitacionalmente.

En 1887, el rey Óscar II de Suecia había ofrecido un premio a quien resolviera el problema general de los n cuerpos; Poincaré presentó un trabajo sobre la versión restringida de tres cuerpos que, en su primera versión, contenía un error —afirmaba una estabilidad que, en realidad, no existía—. Al corregirlo para la versión final, publicada en 1890 en Acta Mathematica, Poincaré documentó algo que no esperaba: las desviaciones entre trayectorias con condiciones iniciales casi idénticas crecían de forma exponencial, lo que implicaba una sensibilidad extrema a esas condiciones iniciales. En sus propias palabras, incluso si las leyes de la naturaleza fueran conocidas con exactitud absoluta, solo podríamos conocer la situación inicial de un sistema de forma aproximada —y esa aproximación, en un sistema con esta propiedad, basta para hacer la predicción a largo plazo inviable en la práctica.

El hallazgo de Poincaré fue, durante décadas, una curiosidad matemática casi ignorada fuera de un círculo reducido de especialistas: según una revisión histórica reciente, matemáticos como Jacques Hadamard y Pierre Duhem llegaron a calificar estos primeros resultados de la teoría del caos como matemáticamente "inútiles" o "sin sentido" para la física real. El propio artículo de Lorenz de 1963 tuvo un destino inicial parecido —fue citado solo tres veces por investigadores fuera de la meteorología durante su primera década de existencia—, antes de que la teoría del caos se expandiera, durante los años setenta y ochenta, hacia campos tan distintos como la geología, la biología y la economía.

## Lo que el caos determinista explica —y lo que no explica

Nada de lo anterior implica que la física clásica, o la mecánica newtoniana en particular, estén rotas o sean incompletas: la gran mayoría de los sistemas físicos que la ingeniería y la ciencia modelan a diario —desde un puente hasta una nave espacial— no exhiben esta sensibilidad exponencial a las condiciones iniciales, y en ellos las ecuaciones de Newton siguen prediciendo con la precisión que siempre han ofrecido. Lo que el caos determinista delimita con exactitud es una clase específica de sistemas —la atmósfera terrestre, la turbulencia de un fluido, el problema gravitacional de varios cuerpos, entre otros— donde esa sensibilidad sí aparece, y donde ningún avance futuro en la precisión de los instrumentos de medición va a extender indefinidamente el horizonte de predicción confiable.

Es la razón, documentada y aceptada por la propia comunidad meteorológica, de por qué el pronóstico del clima tiene un límite teórico de confiabilidad de entre una y dos semanas, sin que ese límite sea un problema de cómputo insuficiente ni de falta de datos: es una propiedad estructural de la atmósfera como sistema caótico, la misma que Lorenz encontró por accidente en 1961 al redondear un número de seis decimales a tres.

## Fuentes

- [Edward Norton Lorenz](https://en.wikipedia.org/wiki/Edward_Norton_Lorenz) — Wikipedia
- [Born half a century ago, chaos theory languished for years](https://www.sciencenews.org/article/born-half-century-ago-chaos-theory-languished-years) — Science News
- [When the Butterfly Effect Took Flight](https://www.technologyreview.com/2011/02/22/196987/when-the-butterfly-effect-took-flight/) — MIT Technology Review
- [The simplest complexity: The story of the three-body problem](https://arxiv.org/pdf/2510.18848) — arXiv
