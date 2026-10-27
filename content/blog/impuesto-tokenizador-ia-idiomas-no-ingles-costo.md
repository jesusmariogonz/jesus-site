---
titulo: 'El "impuesto del tokenizador": por qué la misma pregunta a la misma IA te cuesta más si no la haces en inglés'
fecha: 2026-10-27
categoria: ia
mundo: ia-nueva-economia
tags:
  - tokenización
  - costos de IA
  - modelos de lenguaje
  - inequidad lingüística
  - economía de la IA
  - LLM
  - accesibilidad
  - inteligencia artificial
resumen: 'Un estudio de la Coalition for Language Equity in AI Research, retomado el 26 de octubre por Rest of World, documenta que entre los 20 idiomas más usados en internet, los más caros de procesar necesitan hasta 5 veces más tokens que los más baratos —y la brecha llega a 17 veces si se amplía el análisis a 200 idiomas—. Como casi todos los proveedores de IA cobran por token, eso significa que la misma pregunta puede costar varias veces más según el idioma en que se haga.'
tesis: 'Que un idioma requiera más tokens que el inglés para expresar el mismo contenido es un hecho medible, documentado tanto por el estudio de CLEAR como por investigación académica independiente sobre "fertilidad" de tokenización. Que esa brecha técnica se traduzca en una desigualdad económica estructural —no solo un inconveniente técnico marginal— es una interpretación razonable dado que también se asocia con menor precisión del modelo y menor capacidad de contexto en esos mismos idiomas, aunque el tamaño exacto del impacto económico agregado todavía no está cuantificado con el mismo rigor que el costo en tokens.'
datosClave:
  - valor: '1.5x a 5x'
    etiqueta: 'Rango de tokens adicionales que necesitan los idiomas más caros frente a los más baratos, entre los 20 idiomas más usados en internet'
    fuente: 'Coalition for Language Equity in AI Research (CLEAR)'
    periodo: 'octubre 2026'
  - valor: '17x'
    etiqueta: 'Brecha máxima de costo en tokens al ampliar el análisis a 200 idiomas'
    fuente: 'CLEAR'
  - valor: '8 a 18 puntos porcentuales'
    etiqueta: 'Caída de precisión del modelo por cada token adicional que un idioma necesita por palabra, frente al inglés'
    fuente: 'Lundin et al., "The Token Tax" (arXiv 2509.05486)'
  - valor: '25 puntos'
    etiqueta: 'Brecha promedio de precisión entre idiomas africanos e inglés en la prueba AfriMMLU, que se reduce a 12-14 puntos con modelos de razonamiento'
    fuente: 'Lundin et al., "The Token Tax"'
imagen: /blog/portadas/impuesto-tokenizador-ia-idiomas-no-ingles-costo.jpg
socialImagen: /blog/social/impuesto-tokenizador-ia-idiomas-no-ingles-costo.jpg
gancho: 'Dos personas le hacen la misma pregunta al mismo modelo de IA. Una la escribe en inglés. La otra, en birmano, tibetano o malayalam. La segunda paga más, espera más y recibe una respuesta menos precisa — no porque el modelo sea peor, sino porque nadie diseñó el tokenizador pensando en su idioma.'
postura:
  pregunta: '¿La responsabilidad de corregir el "impuesto del tokenizador" debería recaer en los laboratorios de IA que entrenan los modelos, o es un problema que el libre mercado —con más competencia y tokenizadores especializados por región— va a resolver solo con el tiempo, sin necesidad de intervención?'
  aFavor: 'Los laboratorios de IA son quienes diseñan los tokenizadores, deciden en qué datos entrenarlos y fijan los precios por token; son los únicos actores con la capacidad técnica real de rediseñar esa capa fundamental del sistema, y pedirles transparencia —como el "scorecard" por idioma que propone Pratyush Choudhury— es una exigencia razonable sobre una decisión de diseño que ellos tomaron, no un accidente de la naturaleza.'
  enContra: 'Exigir que cada laboratorio rediseñe sus tokenizadores para optimizar decenas de idiomas de bajos recursos ignora que los precios por token ya vienen bajando de forma sostenida por competencia entre proveedores, y que el problema de fondo —la escasez de datos de entrenamiento de calidad en esos idiomas— no se resuelve con una regulación o una exigencia de transparencia, sino con más inversión real en recopilar y curar esos datos, un trabajo que a menudo rinde más cuando lo hacen actores locales como las iniciativas que ya existen en India, no un mandato impuesto desde Silicon Valley.'
---

Dos usuarios le hacen la misma pregunta, con el mismo nivel de detalle, al mismo modelo de inteligencia artificial. Uno la escribe en inglés. El otro, en birmano, tibetano, jemer o malayalam. Según un estudio de la Coalition for Language Equity in AI Research (CLEAR), retomado el 26 de octubre por Rest of World, el segundo usuario puede terminar pagando varias veces más por esa misma interacción —no porque el proveedor le cobre una tarifa distinta de forma explícita, sino porque su idioma necesita muchos más tokens para decir exactamente lo mismo.

## Cómo funciona el mecanismo que nadie ve

Los modelos de lenguaje no leen texto directamente: lo dividen primero en fragmentos llamados tokens, que pueden ser palabras completas, partes de palabras o, en los casos más extremos, bytes individuales. Casi todos los proveedores de IA cobran por la cantidad de tokens que procesa cada solicitud y cada respuesta, no por la cantidad de palabras ni por el tiempo de uso. El problema es que los tokenizadores —el componente que decide cómo cortar el texto— se entrenan mayoritariamente con datos en inglés y en un puñado de idiomas de "altos recursos", así que reconocen patrones comunes en esos idiomas y los comprimen en pocos tokens, mientras que un idioma con una escritura o una estructura poco representada en los datos de entrenamiento termina fragmentado en piezas mucho más pequeñas y numerosas para decir lo mismo.

Según el estudio de CLEAR, entre los 20 idiomas más usados en internet, los más caros de procesar requieren entre 1.5 y 5 veces más tokens que los más baratos. Cuando el análisis se amplía a 200 idiomas, la brecha máxima llega a 17 veces. Los idiomas peor posicionados son, de forma consistente, los que usan sistemas de escritura que los tokenizadores apenas vieron durante su entrenamiento —el reporte menciona específicamente birmano, tibetano, tifinagh, jemer, lao y ol chiki—. Es revelador que el factor decisivo sea la escritura, no la cantidad de hablantes: el asturiano, con relativamente pocos hablantes, sale beneficiado por compartir alfabeto y raíces con el italiano y otras lenguas romances ampliamente representadas en los datos de entrenamiento.

## No es solo un problema de costo

Sería fácil, y equivocado, tratar esto como una curiosidad contable que se resuelve cuando los precios por token sigan bajando —una tendencia real que varios de los entrevistados en el reportaje de Rest of World reconocen—. Un estudio académico independiente, "The Token Tax: Systematic Bias in Multilingual Tokenization", firmado por investigadores de la Universidad de San Francisco, McGill y el Institute for Disease Modeling, encontró algo más grave que el costo: cada token adicional que un idioma necesita por palabra, comparado con el inglés, se asocia con una caída de entre 8 y 18 puntos porcentuales en la precisión del modelo, dependiendo del modelo específico y la materia evaluada. En su prueba sobre 16 idiomas africanos (AfriMMLU, con 9,000 reactivos de opción múltiple en cinco materias), la brecha promedio de precisión frente al inglés fue de 25 puntos —una diferencia que los modelos de razonamiento más recientes, como DeepSeek R1, lograron reducir a entre 12 y 14 puntos, pero sin cerrarla del todo.

Eso significa que un usuario que paga más por usar IA en su idioma también está recibiendo, en promedio, un servicio menos confiable que el que recibiría un usuario angloparlante haciendo exactamente la misma pregunta. No es solo que le cueste más: es que le funciona peor, y paga más por un resultado peor.

## Las tres formas en que la brecha se siente en la práctica

Pratyush Choudhury, cofundador del fondo de capital de riesgo indio Activate AI, describe tres consecuencias prácticas de este fenómeno que van más allá de la factura mensual de una API. La primera es la latencia: procesar más tokens toma más tiempo, así que una respuesta en un idioma de "bajos recursos" tarda más en generarse que la misma respuesta en inglés. La segunda es la capacidad de contexto: todos los modelos tienen un límite fijo de tokens que pueden procesar en una sola conversación, así que un idioma que necesita más tokens para decir lo mismo agota ese límite más rápido —Choudhury pone el ejemplo de un tutor de IA que "olvida" el contexto de la conversación mucho antes en ciertos idiomas que en otros—. La tercera, y la más amplia en sus implicaciones, es sobre quién puede participar de lleno en la economía que se está construyendo alrededor de la inteligencia artificial: si el costo efectivo de usar las mismas herramientas es sistemáticamente más alto en regiones donde el cómputo y la conectividad ya son más caros y más escasos, la brecha de tokenización no hace más que amplificar una desigualdad que ya existía por otras razones.

## Lo que ya se está intentando, y por qué no basta con más datos

Raoul Nanavati, fundador de la empresa de voz con IA Navana.ai, con sede en Bombay, señala una iniciativa concreta: RESPIN, un proyecto abierto del Indian Institute of Science financiado por la Fundación Gates, que recopiló grabaciones de habla y texto de hablantes nativos de 38 dialectos para mejorar la representación de esas lenguas en los datos de entrenamiento. Es exactamente el tipo de esfuerzo que, en teoría, debería reducir la brecha con el tiempo. Pero Dheemanth Reddy, director ejecutivo de Maya Research, advierte que más datos de entrenamiento no es, por sí solo, suficiente: los tokenizadores siguen diseñados y optimizados pensando primero en inglés y en los idiomas de mayores recursos, así que incluso con más datos disponibles en otros idiomas, la arquitectura que decide cómo fragmentar el texto necesitaría rediseñarse desde su base para dejar de penalizar sistemáticamente a esos idiomas.

El propio estudio de "The Token Tax" ilustra por qué ese rediseño no es trivial ni barato: según sus autores, duplicar los tokens necesarios para procesar un idioma no duplica el costo de entrenar un modelo desde cero sobre esa base, sino que lo multiplica por cuatro, por la forma en que escala el mecanismo de atención de estos sistemas. Su ejemplo hipotético con Llama 3.1 405B pasa de un costo de entrenamiento estimado en 105 millones de dólares en inglés a unos 420 millones si el idioma de referencia necesitara el doble de tokens para la misma cantidad de contenido. Es una cifra hipotética del propio paper, no una medición real de ningún modelo comercial específico, pero ilustra por qué ningún laboratorio va a resolver esto solo con buena voluntad: la estructura de incentivos económicos actuales recompensa optimizar primero para los idiomas que ya generan más ingresos.

## La propuesta más concreta sobre la mesa

Choudhury propone algo específico y verificable: que los laboratorios de IA publiquen un "scorecard" por idioma —una medición pública y comparable de cuántos tokens necesita cada idioma para un contenido equivalente, junto con la precisión del modelo en ese idioma—, de forma que la eficiencia lingüística se vuelva un criterio de producto tan visible como la velocidad o el costo general que hoy publicitan las empresas de IA. Es una propuesta modesta en el sentido de que no exige resolver el problema técnico de fondo de inmediato, solo hacerlo visible y medible de forma consistente entre proveedores —algo que, hasta ahora, ningún laboratorio grande ha hecho de forma voluntaria.

## Lo que esto significa para quien escribe, piensa y trabaja en español

Ninguna de las fuentes consultadas da una cifra oficial y verificada específicamente para el español dentro de este estudio, pero el español comparte alfabeto latino y una familia lingüística amplia y bien representada en los datos de entrenamiento de la mayoría de los modelos comerciales, lo cual lo coloca estructuralmente más cerca del extremo barato que del extremo caro del rango documentado por CLEAR. Eso no significa que la brecha sea cero: significa que la penalización, si existe, probablemente es menor que la que enfrentan usuarios de birmano, tibetano o jemer —una diferencia de grado, no de tipo, dentro del mismo fenómeno estructural que el estudio describe. Vale la pena que cualquier empresa o desarrollador que construya productos de IA en español mida esa diferencia directamente con sus propios casos de uso, en lugar de asumir que el problema es exclusivamente ajeno.

## Fuentes

- [AI models cost more when you don't use English](https://restofworld.org/2026/ai-tokenizer-tax-non-english-languages-cost-inequity/) — Rest of World
- [The Token Tax: Systematic Bias in Multilingual Tokenization](https://arxiv.org/html/2509.05486v1) — arXiv (Lundin, Zhang, Karim, Louzan, Wei, Carroll, Adelani)
- [AI Fees Up to 15x Cheaper for English Than Other Languages](https://www.tomshardware.com/news/ai-usage-fees-favor-english-over-other-languages) — Tom's Hardware
