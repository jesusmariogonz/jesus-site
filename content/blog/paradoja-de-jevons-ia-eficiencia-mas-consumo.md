---
titulo: 'La paradoja de Jevons: por qué hacer la IA más eficiente no va a bajar su consumo de energía, lo va a disparar'
fecha: 2026-09-26
categoria: opinion
mundo: ideas-y-ensayos
tags:
  - paradoja de Jevons
  - eficiencia energética
  - inteligencia artificial
  - centros de datos
  - consumo de energía
  - economía
resumen: 'En 1865 un economista inglés observó que máquinas de vapor más eficientes en carbón no redujeron el consumo de carbón de Inglaterra: lo multiplicaron. Ese mismo mecanismo —la paradoja de Jevons— es la razón por la que cada modelo de IA más eficiente que sale al mercado viene acompañado de más consumo total de energía, no de menos.'
tesis: 'La intuición de que "IA más eficiente" implica "IA que consume menos" invierte la lógica económica real: cuando algo se vuelve más barato de usar, se usa muchísimo más, y ese efecto de rebote casi siempre supera el ahorro técnico original —lo que significa que la eficiencia por sí sola nunca va a resolver el problema del consumo energético de la IA, y tratarla como si fuera la solución es, en el mejor de los casos, una distracción.'
datosClave:
  - valor: '1865'
    etiqueta: 'Año en que William Stanley Jevons publicó "The Coal Question", documentando el efecto que lleva su nombre'
  - valor: '~10x'
    etiqueta: 'Reducción aproximada en el costo por token de inferencia entre generaciones sucesivas de modelos grandes en los últimos años'
  - valor: 'Efecto de rebote >100%'
    etiqueta: 'Cuando el aumento en consumo por el uso adicional supera el ahorro generado por la mejora en eficiencia, el efecto de rebote se llama "backfire" (paradoja de Jevons en su forma más fuerte)'
imagen: /blog/portadas/paradoja-de-jevons-ia-eficiencia-mas-consumo.jpg
---

En 1865, el economista inglés William Stanley Jevons publicó un libro incómodo para su época: "The Coal Question". Inglaterra llevaba décadas mejorando la eficiencia de sus máquinas de vapor —cada nueva generación de motores usaba menos carbón para producir la misma cantidad de trabajo— y la expectativa generalizada era que esa eficiencia iba, tarde o temprano, a reducir el consumo total de carbón del país. Jevons observó exactamente lo contrario: mientras más eficientes se volvían las máquinas, más carbón consumía Inglaterra en total, no menos. La razón era simple una vez que se nombraba: cuando usar carbón se volvió más barato por unidad de trabajo, se volvió rentable usarlo en muchísimas más aplicaciones donde antes no lo era. Ciento sesenta años después, la industria de la inteligencia artificial está reproduciendo ese mismo experimento a una escala que Jevons jamás hubiera podido imaginar, y con el mismo resultado contraintuitivo.

## El mecanismo, en términos simples

La paradoja de Jevons no es un fenómeno raro ni un caso aislado: es una consecuencia directa y predecible de la economía básica. Cuando el costo de hacer algo baja, ese algo se demanda más —eso es simplemente la curva de demanda funcionando como se espera—. Lo que hace que el resultado se sienta paradójico es que, en ciertas condiciones, el aumento en la cantidad demandada supera proporcionalmente la caída en el costo unitario, de forma que el consumo total —precio por cantidad— termina siendo mayor que antes de la mejora en eficiencia, no menor. Eso no ocurre siempre: depende de qué tan sensible sea la demanda al precio. Pero en tecnologías de propósito general, donde bajar el costo abre la puerta a aplicaciones completamente nuevas que antes ni siquiera se consideraban viables, ese umbral se cruza con mucha frecuencia.

## Por qué la IA es el caso de manual

La inferencia de modelos de lenguaje grandes ha bajado de costo por token de manera dramática en los últimos años —órdenes de magnitud, no porcentajes marginales— gracias a mejor hardware, mejores arquitecturas de modelos y optimizaciones de software. La intuición ingenua dice: si cada consulta cuesta una fracción de lo que costaba hace dos años, el consumo total de energía de la industria debería estabilizarse o incluso bajar. Lo que en realidad ha pasado es que cada caída en el costo por token ha destapado usos de la IA que antes eran económicamente inviables: agentes que hacen decenas de llamadas a un modelo para completar una sola tarea, asistentes que corren de forma continua en segundo plano, aplicaciones de consumo masivo que antes no podían permitirse el costo de inferencia por usuario. El resultado es que la demanda total de cómputo de IA ha crecido más rápido que la eficiencia por unidad, y el consumo energético agregado de los centros de datos dedicados a IA sigue una trayectoria ascendente, no plana.

## El error de diseño de política que esto expone

Este mecanismo tiene una implicación incómoda para cualquier estrategia corporativa o de política pública que apueste a "la eficiencia va a resolver el problema del consumo energético de la IA por sí sola". Invertir en modelos más eficientes es necesario —ningún argumento aquí dice que la eficiencia sea mala o inútil—, pero tratarla como la solución completa ignora que la eficiencia misma es el motor que expande el consumo, no lo que lo contiene. Una empresa que reduce el costo de cómputo de su producto de IA a la mitad no necesariamente reduce su factura energética a la mitad: es más probable que use ese ahorro para ofrecer el producto a más usuarios, con más funciones, corriendo con más frecuencia, hasta que el gasto total de cómputo vuelva a crecer. Quien diseña la estrategia energética de una empresa de IA —o la política pública alrededor de centros de datos— asumiendo que la curva de eficiencia va a aplanar la curva de consumo está, en la práctica, apostando en contra de la evidencia histórica de ciento sesenta años.

## Lo que sí funciona: atacar la demanda, no solo la oferta

Si la eficiencia por sí sola no basta, la implicación práctica es que el consumo energético de la IA solo se contiene con mecanismos que actúen directamente sobre la demanda, no solo sobre el costo de la oferta: precios que reflejen el costo energético real del cómputo (en lugar de subsidios implícitos que ocultan ese costo al usuario final), límites regulatorios explícitos sobre el consumo de nuevos centros de datos, o decisiones deliberadas de producto que restrinjan el uso de cómputo intensivo a los casos donde el valor generado realmente lo justifique. Ninguna de esas palancas es una consecuencia automática de que los modelos se vuelvan más baratos de correr: todas requieren una decisión activa, tomada en contra del incentivo económico natural de usar más de algo que se volvió más barato.

## La pregunta que la industria todavía no quiere hacerse en voz alta

La conversación pública sobre el consumo energético de la IA sigue oscilando entre el optimismo tecnológico ("la próxima generación de chips va a resolver esto") y la alarma difusa ("los centros de datos van a consumir toda la red eléctrica"), sin detenerse mucho tiempo en el mecanismo económico específico que conecta ambos extremos. La paradoja de Jevons no dice que la IA vaya a consumir energía infinita sin límite —eventualmente los límites físicos de generación eléctrica, de agua para enfriamiento y de capacidad de red imponen un techo real—. Dice algo más específico y más incómodo: que ese techo se va a alcanzar más rápido, no más despacio, precisamente porque la industria sigue mejorando su eficiencia. La pregunta que vale la pena hacerse no es si los modelos del próximo año van a ser más eficientes —casi seguro que sí— sino qué va a hacer la industria con el ahorro que esa eficiencia genera: ¿usarlo para consumir menos, o para que millones de aplicaciones nuevas, antes inviables, empiecen a consumir por primera vez?

## Fuentes

- [The Coal Question (1865)](https://en.wikipedia.org/wiki/The_Coal_Question) — William Stanley Jevons, resumen y contexto histórico
- [Jevons paradox](https://en.wikipedia.org/wiki/Jevons_paradox) — explicación del mecanismo económico y su aplicación moderna
- [AI's energy footprint is a growing concern](https://www.iea.org/reports/electricity-2026) — International Energy Agency, proyecciones de consumo eléctrico de centros de datos
- [The rebound effect and its implications for climate change mitigation](https://www.sciencedirect.com/topics/economics-econometrics-and-finance/rebound-effect) — resumen académico del efecto de rebote y su relación con la paradoja de Jevons
