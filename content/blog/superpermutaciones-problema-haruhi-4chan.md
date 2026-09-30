---
titulo: 'El problema de Haruhi: cómo un post anónimo de 4chan resolvió, sin querer, un problema matemático de 25 años'
fecha: 2026-09-30
categoria: opinion
mundo: notas-de-campo
tags:
  - matemáticas
  - combinatoria
  - superpermutaciones
  - 4chan
  - teoría de números
  - curiosidades científicas
resumen: 'En 2011, un usuario anónimo del foro de ciencia de 4chan resolvió parte de un problema combinatorio que llevaba 25 años sin avanzar — el de las superpermutaciones — para responder una pregunta sobre el orden de episodios de un anime. Nadie lo notó hasta 2018, cuando un matemático profesional verificó la prueba y la volvió literatura académica oficial, con el autor acreditado como "Anonymous 4chan Poster".'
tesis: 'El problema de las superpermutaciones muestra que el rigor matemático no depende de la credencial de quien lo produce: una prueba nueva y correcta, publicada sin nombre en el foro más caótico de internet para resolver una discusión sobre un anime, es tan válida como una publicada en una revista arbitrada — y terminó siéndolo, literalmente, siete años después.'
datosClave:
  - valor: '14 episodios'
    etiqueta: 'La primera temporada de "The Melancholy of Haruhi Suzumiya", transmitida fuera de orden cronológico, origen de la pregunta'
  - valor: '93,884,313,611'
    etiqueta: 'Nueva cota inferior probada para el mínimo de episodios necesarios para ver las 14! secuencias posibles al menos una vez'
  - valor: '~4.3 millones de años'
    etiqueta: 'Tiempo que tomaría ver esa cantidad de episodios de 24 minutos sin parar'
  - valor: '7 años'
    etiqueta: 'El tiempo que pasó entre la publicación anónima (2011) y su verificación académica formal (2018)'
gancho: 'Un usuario anónimo de 4chan resolvió en una tarde un problema matemático que llevaba 25 años estancado, solo para saber en qué orden ver un anime. Nadie lo verificó hasta 7 años después. Hoy su prueba es literatura académica oficial, y el autor sigue firmado como "Anonymous".'
imagen: /blog/portadas/inteligencia-artificial-1.jpg
---

En septiembre de 2011, en el foro de ciencia y matemáticas de 4chan (conocido como /sci/), alguien publicó una pregunta sobre un anime. *The Melancholy of Haruhi Suzumiya* había transmitido sus 14 episodios en un orden deliberadamente no cronológico, y distintas emisiones y ediciones en video los reordenaron de formas distintas — lo suficiente para que los fans discutieran, durante años, cuál era el "mejor" orden para verla. La pregunta que alguien hizo ese día no fue "¿cuál es el mejor orden?", sino una mucho más extraña: si quisieras ver los 14 episodios en *cada posible orden* al menos una vez, ¿cuál es la secuencia más corta que lo logra?

Esa pregunta, sin que nadie en el hilo lo supiera en ese momento, era una versión exacta de un problema abierto de combinatorias con 25 años de antigüedad: el problema de la superpermutación mínima.

## Qué es una superpermutación

Una permutación es cualquier arreglo posible de un conjunto de elementos: para 3 episodios, existen 3! = 6 arreglos (123, 132, 213, 231, 312, 321). Una **superpermutación** es una sola cadena continua de símbolos que contiene, como subcadena, cada una de esas permutaciones posibles. La pregunta matemática de fondo es: ¿cuál es la superpermutación más corta posible para n símbolos?

Para valores pequeños de n el problema es manejable a mano. Para n=14 —el número de episodios de la primera temporada de Haruhi— el número de permutaciones posibles es 14!, una cifra de 11 dígitos, y encontrar la cadena mínima que las contenga todas deja de ser trivial incluso para una computadora potente. Durante 25 años, matemáticos profesionales solo habían logrado ir ajustando la **cota inferior** del problema: no la respuesta exacta, sino el mínimo teórico por debajo del cual se puede probar que ninguna superpermutación puede existir.

## La prueba que nadie pidió

Dentro de esa misma hora, en el mismo hilo anónimo, otro usuario publicó una prueba matemática densa. No resolvía el problema completo —seguía sin dar la longitud exacta mínima—, pero demostraba una nueva cota inferior, más ajustada que la mejor conocida hasta entonces: la longitud mínima de cualquier superpermutación de n símbolos tiene que ser al menos

**n! + (n−1)! + (n−2)! + n − 3**

La cota anterior sumaba factoriales decrecientes hasta el final (n! + (n−1)! + (n−2)! + (n−3)! + ... + 1); la prueba anónima demostró que todos esos términos más pequeños podían reemplazarse por el término lineal "+ n − 3", un resultado más fuerte y más simple. Para n=14, esa fórmula da un mínimo de **93,884,313,611 episodios** — si cada episodio dura 24 minutos, verlos todos sin pausa tomaría aproximadamente 4.3 millones de años.

## Siete años invisible

Y ahí se quedó. Una prueba matemática nueva, correcta y más fuerte que el estado del arte, publicada sin nombre en el foro de ciencia de un imageboard, mezclada entre miles de otros posts sobre anime. Nadie en la comunidad matemática profesional la vio.

En octubre de 2018, el matemático Robin Houston encontró el hilo archivado y reconoció que la prueba era real. La verificó junto con Jay Pantone y Vince Vatter, y los tres —junto con el autor original, cuya identidad nunca se reveló— formalizaron el resultado y lo subieron a arXiv y a la Enciclopedia en Línea de Secuencias de Números Enteros (OEIS, secuencia A180632). El artículo lleva como autores, en este orden, a **"Anonymous 4chan Poster", Robin Houston, Jay Pantone y Vince Vatter**. Es, probablemente, el único paper de matemáticas serias de la historia con un autor principal acreditado exactamente así.

Casi al mismo tiempo, y de forma independiente, el escritor de ciencia ficción y matemático aficionado Greg Egan construyó una mejora a la **cota superior** del problema (una construcción explícita que sí logra cubrir todas las permutaciones, aunque no se sepa si es la más corta posible), adaptando un método de caminos hamiltonianos desarrollado por el matemático Aaron Williams. Es una contribución relacionada pero distinta: Egan acotó el problema por arriba, el anónimo de 4chan lo acotó por abajo.

## Un problema que sigue sin resolverse

Con ambas piezas, el estado actual del problema para n=14 es este: la superpermutación mínima mide entre 93,884,313,611 (cota inferior, la prueba de 2011) y 93,924,230,411 episodios (cota superior, la construcción de Egan de 2018). La diferencia entre ambas cifras es de apenas unas decenas de miles sobre un total de casi 94 mil millones — un margen minúsculo en términos relativos, pero suficiente para que el valor exacto siga siendo, formalmente, un problema abierto.

## Por qué esta historia importa más allá de la anécdota

Lo notable no es solo que un problema matemático se haya resuelto parcialmente por accidente. Es que el sistema académico, cuando finalmente se topó con la prueba, no la descartó por venir de una fuente no convencional: la verificó con el mismo rigor que aplicaría a cualquier institución, confirmó que era correcta, y la incorporó a la literatura formal manteniendo la autoría anónima tal cual apareció originalmente. La demostración matemática se sostiene o se cae por su lógica interna, no por la credencial de quien la firma — y en este caso, nadie la firmó, y aun así entró a arXiv, a OEIS y a los libros de quienes trabajan este problema.

## Fuentes

- [Superpermutation](https://en.wikipedia.org/wiki/Superpermutation) — Wikipedia
- [Sci-Fi Writer Greg Egan and Anonymous Math Whiz Advance Permutation Problem](https://www.quantamagazine.org/sci-fi-writer-greg-egan-and-anonymous-math-whiz-advance-permutation-problem-20181105/) — Quanta Magazine
- [The Surprisingly Difficult Mathematical Proof That Anime Fans Helped Solve](https://www.scientificamerican.com/article/the-surprisingly-difficult-mathematical-proof-that-anime-fans-helped-solve/) — Scientific American
- [Containing All Permutations (arXiv:1810.08252)](https://arxiv.org/pdf/1810.08252) — Houston, Pantone, Vatter (con autoría de "Anonymous 4chan Poster")
- [OEIS A180632](https://oeis.org/A180632/internal)
- [An Anonymous Online Anime Fan Just Solved a Problem That's Been Eluding Mathematicians for Decades](https://www.iflscience.com/an-anonymous-online-anime-fan-just-solved-a-problem-thats-been-eluding-mathematicians-for-decades-50364) — IFLScience
