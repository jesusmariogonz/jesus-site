---
titulo: 'El modelo que ganó el backtest es, casi por diseño, el que más deberías sospechar'
fecha: 2026-11-26
categoria: business-analytics
mundo: notas-de-campo
tags:
  - backtesting
  - sobreajuste
  - ciencia de datos
  - modelos predictivos
  - gobernanza de modelos
  - trading cuantitativo
  - validación de modelos
  - sesgos cognitivos
  - p-hacking
resumen: 'En casi cualquier ejercicio de modelado que he visto —desde pronósticos de demanda hasta estrategias de trading— hay un momento en que alguien presenta "el mejor modelo" de entre varias docenas probadas. Ese momento, más que una buena noticia, debería encender una alarma: entre más configuraciones se probaron para llegar ahí, más probable es que el ganador no sea bueno, sino simplemente el que mejor se ajustó al ruido de esos datos específicos.'
tesis: 'Que un modelo haya superado a todos sus competidores en el backtest es un hecho verificable sobre esa prueba específica; que ese mismo modelo vaya a superar al resto fuera de muestra es una expectativa que la evidencia académica sobre sobreajuste de backtests contradice de forma sistemática, no una garantía que el buen desempeño pasado pueda ofrecer por sí solo.'
datosClave:
  - valor: '2014'
    etiqueta: 'Año en que Bailey, Borwein, López de Prado y Zhu publicaron "Pseudo-Mathematics and Financial Charlatanism" en Notices of the American Mathematical Society, documentando el problema'
    fuente: 'Notices of the AMS'
  - valor: 'Retorno esperado negativo'
    etiqueta: 'Lo que los autores demuestran matemáticamente que produce un backtest sobreajustado fuera de muestra — no un desempeño nulo, sino uno peor que el azar'
gancho: 'Probaste 40 configuraciones del modelo y una ganó por un margen claro. La pregunta que casi nadie se hace en ese momento es la que más importa: ¿ganó porque es mejor, o porque entre 40 intentos, algo tenía que ganar?'
imagen: /blog/portadas/backtest-que-ganaste-es-el-que-mas-deberias-sospechar.jpg
socialImagen: /blog/social/backtest-que-ganaste-es-el-que-mas-deberias-sospechar.jpg
postura:
  pregunta: '¿Probar muchas configuraciones de un modelo antes de elegir la mejor es una práctica legítima y necesaria de optimización, o es, en la práctica, una forma de p-hacking que la cultura de los datos todavía no trata con la misma sospecha que la academia le tiene a su equivalente estadístico?'
  aFavor: 'Probar múltiples configuraciones —distintas ventanas de tiempo, distintos hiperparámetros, distintas variables— es exactamente lo que cualquier proceso de optimización legítimo debe hacer; descartar esa práctica equivaldría a conformarse arbitrariamente con la primera configuración que se probó, lo cual no tiene ninguna justificación estadística superior.'
  enContra: 'La diferencia entre optimización legítima y sobreajuste no está en probar muchas configuraciones, sino en qué se hace después: la práctica común de reportar solo el desempeño del ganador, sin declarar cuántas configuraciones se probaron ni validar ese ganador contra datos genuinamente nuevos, es estructuralmente idéntica al p-hacking que la ciencia ya reconoce como mala práctica —y el hecho de que la cultura de los equipos de datos no la trate con la misma alarma no la hace menos problemática, solo menos visible.'
---

En casi cualquier proyecto de modelado al que me ha tocado acompañar —pronósticos de demanda, modelos de riesgo, estrategias de trading cuantitativo— llega un momento casi ritual: alguien presenta, con legítimo entusiasmo, el resultado de probar entre 20 y 100 variantes de un modelo, y anuncia cuál de todas "ganó". El error no está en la emoción. Está en lo que casi nunca se pregunta justo después: ¿ese modelo ganó porque efectivamente captura algo real sobre el fenómeno que intenta predecir, o ganó porque, entre suficientes intentos, algo tenía que terminar arriba de los demás por pura casualidad estadística?

## El problema no es probar muchas configuraciones. Es qué se hace con ese número

Probar múltiples configuraciones de un modelo —distintas ventanas de entrenamiento, distintos conjuntos de variables, distintos umbrales— no es, por sí mismo, una mala práctica. Es, de hecho, lo que cualquier proceso serio de optimización debería hacer: conformarse con la primera configuración que se te ocurrió no tiene ninguna superioridad metodológica sobre explorar el espacio de posibilidades. El problema aparece después, en un paso que casi nunca se documenta ni se reporta: cuántas configuraciones se probaron antes de llegar a la que terminó ganando. Esa cifra —20, 60, 200 variantes— no es un detalle de proceso. Es, estadísticamente, la variable que determina qué tan confiable es el resultado final, y es casi siempre la que desaparece entre el momento en que se corrió el experimento y el momento en que se presenta el "mejor modelo" a quien toma la decisión.

## La demostración matemática de por qué esto falla, y quién la hizo

Este no es un problema que dependa de la intuición de cada analista: fue formalizado matemáticamente por David H. Bailey, Jonathan Borwein, Marcos López de Prado y Qiji Jim Zhu en "Pseudo-Mathematics and Financial Charlatanism", publicado en 2014 en Notices of the American Mathematical Society. Los autores demuestran que un desempeño simulado alto es relativamente fácil de producir después de probar un número modesto de configuraciones alternativas de una estrategia —no se necesitan miles de intentos, basta con varias decenas—. Lo más contraintuitivo de su hallazgo no es solo que el sobreajuste produzca resultados que no se repiten fuera de muestra: es que, bajo ciertas condiciones que los autores modelan explícitamente, el sobreajuste de un backtest produce un retorno esperado *negativo* fuera de muestra, no simplemente un desempeño nulo. En otras palabras: el modelo que "ganó" por sobreajuste no solo deja de ganar cuando se enfrenta a datos nuevos —tiende a perder, de forma sistemática, precisamente porque el patrón que capturó nunca existió fuera del ruido específico de los datos con los que se probó.

## Por qué los autores lo llaman, sin rodeos, charlatanería financiera

El título del paper no es casualidad ni provocación gratuita: Bailey, Borwein, López de Prado y Zhu sostienen que el problema central es que quienes presentan un backtest exitoso casi nunca revelan cuántas configuraciones distintas probaron para llegar a él, y que sin ese número, quien recibe la propuesta —un inversionista, un comité de riesgo, un cliente— simplemente no tiene manera de evaluar si está viendo una señal real o el ganador de una lotería estadística con suficientes boletos. Los propios autores, que después formaron un grupo informal al que llamaron MAFFIA (Mathematical Finance Fraud Investigation Agency, por sus siglas en broma) para documentar abusos similares de matemáticas y estadística en finanzas, encuadran el problema en términos que cualquiera familiarizado con la crisis de replicación en psicología reconocería de inmediato: es, en esencia, la versión financiera del p-hacking —probar suficientes variantes de un análisis hasta que una cruce el umbral de significancia, sin declarar cuántas se probaron—, solo que con menos escrutinio institucional porque no hay revisión por pares antes de poner dinero real detrás de la conclusión.

## El marco que proponen para medirlo, no solo para nombrarlo

Lo que distingue este trabajo de una simple advertencia es que sus autores no se quedaron en señalar el problema: en un paper posterior, "The Probability of Backtest Overfitting", publicado en el Journal of Computational Finance, propusieron un marco formal para estimar la probabilidad de que un backtest específico esté sobreajustado —una métrica a la que llaman PBO (probability of backtest overfitting)—, implementada mediante un método de validación cruzada que llaman CSCV (combinatorially symmetric cross-validation). La existencia de ese marco es, en sí misma, la prueba más contundente de que este no es un riesgo teórico abstracto: es un problema medible, con una metodología publicada específicamente para cuantificarlo, lo cual implica que cualquier equipo que presente un modelo ganador sin haber corrido algo equivalente está, en la práctica, optando por no saber qué tan sólido es su propio resultado.

## Dónde esto se vuelve un problema organizacional, no solo técnico

La parte más incómoda de este patrón no es la estadística —es lo que ocurre en la sala donde se presenta el resultado. En casi ningún comité de inversión, junta de producto o revisión de modelo he visto que la primera pregunta sea "¿cuántas configuraciones se probaron antes de esta?". La pregunta que casi siempre se hace es la más fácil de responder y la menos informativa: "¿cómo le fue al mejor?". Es una asimetría de incentivos que no requiere mala fe de nadie: el analista que corrió 50 variantes tiene todos los incentivos para presentar la que ganó, no las 49 que perdieron, y quien recibe la presentación tiene pocos incentivos para pedir ese número incómodo que podría convertir un resultado entusiasmante en uno mucho más modesto. El resultado es una cultura organizacional que trata la pregunta "¿cuántas veces lo intentaste?" como un detalle técnico de bajo interés, cuando en realidad es la variable que decide si el resultado que se está a punto de usar para tomar una decisión real es información o ruido con buena presentación.

## Por qué entre más fácil es iterar, más fácil es sobreajustar sin notarlo

Hay una ironía incómoda en cómo las herramientas modernas de modelado han empeorado este problema en vez de resolverlo. Hace una década, probar 50 configuraciones distintas de un modelo de pronóstico podía tomar días de cómputo y de trabajo manual; hoy, con pipelines automatizados de búsqueda de hiperparámetros y suficiente capacidad de cómputo en la nube, probar 500 configuraciones puede tomar minutos. La automatización no resolvió el problema del sobreajuste de backtests —lo aceleró—. Cuando buscar la mejor configuración cuesta casi nada en tiempo, la tentación de seguir iterando hasta encontrar un resultado que "se vea bien" crece en la misma proporción, y el número de intentos que quedó detrás del resultado final se vuelve todavía más fácil de perder de vista, porque nadie se sentó a contar manualmente cada corrida como hubiera tenido que hacerlo antes. Es el mismo mecanismo que Bailey, Borwein, López de Prado y Zhu describen en su marco de PBO, pero operando a una escala que sus propios ejemplos originales, pensados para decenas de configuraciones, no necesariamente anticipaban.

## Lo que sí separa la optimización legítima del sobreajuste disfrazado

La distinción práctica no está en cuántas configuraciones se prueban, sino en qué se hace con la que gana antes de confiar en ella. Un ejercicio simple, que rara vez se hace en la práctica pero que no requiere ninguna herramienta sofisticada, ilustra por qué esto importa: tomar el mismo proceso de búsqueda que produjo el modelo ganador y correrlo sobre datos puramente aleatorios, sin ninguna señal real embebida. Si ese mismo proceso, aplicado a ruido, también produce un "ganador" con un desempeño aparentemente sólido —y con suficientes configuraciones probadas, casi siempre lo hace—, eso demuestra que el procedimiento de búsqueda, no la estrategia en sí, es capaz de generar resultados que se ven bien sin que exista ninguna señal real detrás. Es una prueba de falsación barata, directa, y casi nunca aplicada, precisamente porque exige aceptar de antemano la posibilidad de que el resultado favorito del equipo no sea más que eso. Un proceso de modelado que sí distingue entre optimización legítima y sobreajuste declara explícitamente cuántas variantes se probaron, separa de forma estricta los datos usados para elegir el ganador de los datos usados para validar su desempeño final —lo que en la práctica significa reservar un conjunto de datos que el proceso de selección nunca llegó a ver—, y, cuando es posible, corre algo equivalente al marco de PBO antes de presentar el resultado como una conclusión y no como un candidato. Ninguno de estos pasos es complicado técnicamente. Lo que falta, con más frecuencia de la que la disciplina de datos quisiera admitir, no es la capacidad técnica de hacerlo, sino la costumbre organizacional de exigirlo antes de que un modelo pase de "el que ganó en la prueba" a "el que vamos a usar con dinero o decisiones reales".

## Fuentes

- [Pseudo-Mathematics and Financial Charlatanism: The Effects of Backtest Overfitting on Out-of-Sample Performance](https://scholarworks.wmich.edu/math_pubs/40/) — Bailey, Borwein, López de Prado y Zhu, Notices of the American Mathematical Society, 2014
- [The Probability of Backtest Overfitting](https://scholarworks.wmich.edu/math_pubs/42) — Bailey, Borwein, López de Prado y Zhu, Journal of Computational Finance
- Marcos López de Prado, *Advances in Financial Machine Learning*, Wiley, 2018
