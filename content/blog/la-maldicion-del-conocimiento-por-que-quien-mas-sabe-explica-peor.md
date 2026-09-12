---
titulo: 'La maldición del conocimiento: por qué quien más sabe suele explicar peor'
fecha: 2026-09-12T00:00:00.000Z
categoria: business-analytics
tags:
  - Comunicación
  - Liderazgo
  - Ciencia de Datos
  - Toma de Decisiones
  - Sesgos Cognitivos
  - Data Storytelling
  - Gestión de Equipos
resumen: 'Un experimento de 1990 le puso número exacto a un problema que cualquier líder técnico reconoce de inmediato: quien conoce más a fondo un tema pierde, casi por diseño cognitivo, la capacidad de imaginar cómo se ve ese mismo tema desde la ignorancia total.'
tesis: 'La maldición del conocimiento no es un defecto de carácter de las personas técnicas ni un problema que se resuelve "explicando más despacio": es un sesgo cognitivo documentado y medible, y tratarlo como tal —con técnicas específicas, no con buenas intenciones— es la diferencia entre un equipo de datos que influye en decisiones y uno que solo produce reportes que nadie más que ellos entiende.'
datosClave:
  - valor: "50% vs. 2.5%"
    etiqueta: "Precisión que los 'tappers' esperaban vs. la que realmente lograron los 'listeners' en el estudio de Elizabeth Newton (1990)"
  - valor: "1989"
    etiqueta: "Año en que Camerer, Loewenstein y Weber acuñaron el término 'curse of knowledge'"
  - valor: "3 de 120"
    etiqueta: "Canciones que los oyentes identificaron correctamente en el experimento original"
imagen: /blog/portadas/maldicion-conocimiento.jpg
---

En 1990, la psicóloga Elizabeth Newton, entonces estudiante de doctorado en Stanford, diseñó un experimento simple para su tesis: dividió a un grupo de voluntarios en dos roles, "tappers" (quienes tamborileaban con los dedos el ritmo de una canción conocida) y "listeners" (quienes debían adivinar qué canción era, solo a partir de ese tamborileo). Antes de que los oyentes intentaran adivinar, Newton preguntó a los tamborileadores qué tan seguido creían que sus compañeros acertarían. La respuesta promedio fue clara: esperaban que los oyentes identificaran correctamente la canción la mitad de las veces.

El resultado real fue de 3 canciones correctas de 120 intentos —una tasa de acierto de apenas 2.5%, veinte veces menor a lo que los propios tamborileadores habían anticipado—. La explicación no tiene nada que ver con la falta de talento musical de los oyentes: tiene que ver con que, en la cabeza del tamborileador, la melodía sonaba con total claridad —él la estaba "escuchando" mientras tamborileaba—, y esa certeza interna le resultaba, literalmente, imposible de desactivar al imaginar la experiencia de alguien que solo escuchaba golpecitos sueltos sobre una mesa.

Este análisis no trata sobre música. Trata sobre un sesgo cognitivo con nombre propio, respaldo experimental desde hace más de tres décadas, e implicaciones directas para cualquier persona que trabaje generando información técnica —datos, código, análisis financiero, diagnósticos— que después tiene que explicarle a alguien que no comparte ese mismo conocimiento de fondo.

## El nombre y el origen del sesgo

El término "curse of knowledge" —la maldición del conocimiento— fue acuñado un año antes del experimento de Newton, en 1989, por los economistas Colin Camerer, George Loewenstein y Martin Weber, en un artículo que estudiaba cómo este sesgo distorsiona las transacciones económicas: cuando una parte de una negociación tiene información que la otra no tiene, a la parte informada le resulta genuinamente difícil —no solo incómodo, sino cognitivamente difícil— simular con precisión qué sabe y qué no sabe la parte menos informada. El experimento de Newton, publicado poco después, le dio a ese concepto económico abstracto una demostración conductual concreta y memorable, y es la razón por la que hoy el fenómeno se conoce popularmente por su versión musical más que por su formulación económica original.

La definición técnica es más precisa que la intuición popular de "los expertos explican mal": la maldición del conocimiento ocurre específicamente porque, una vez que una persona adquiere cierta información, pierde la capacidad de simular con exactitud el estado mental de no tenerla. No es que el experto elija ser oscuro o que le falte empatía —de hecho, estudios posteriores muestran que el sesgo persiste incluso cuando a los participantes se les paga explícitamente por comunicar con claridad—. Es un límite estructural de cómo funciona la memoria y la simulación mental: una vez que sabes algo, tu cerebro no tiene un botón de "olvidar temporalmente" para reconstruir con fidelidad la perspectiva de quien no lo sabe.

## De la mesa del experimento a la sala de juntas

El artículo que llevó este concepto del laboratorio académico al mundo corporativo fue publicado en Harvard Business Review en 2006 por Chip Heath y Dan Heath, y su ejemplo central no era sobre científicos de datos, sino sobre ejecutivos: los autores documentan cómo estrategias corporativas razonables fracasan en su ejecución no porque estén mal diseñadas, sino porque los directivos las formulan en el lenguaje abstracto que a ellos les resulta perfectamente claro —después de años de inmersión en la lógica y las convenciones de su propio negocio—, sin notar que ese lenguaje abstracto es, para el empleado de primera línea que no comparte ese contexto acumulado, una serie de frases opacas que no logran traducirse en acción concreta.

Ese mismo patrón se documenta con precisión quirúrgica en el dominio específico de la visualización de datos. Un estudio académico sobre comunicación visual de datos, de la investigadora Cindy Xiong, muestra que dos personas pueden observar exactamente el mismo gráfico y percibir patrones distintos en él, dependiendo de cuánto contexto previo tengan sobre los datos subyacentes —lo cual explica un fenómeno frustrante y común en cualquier organización que invierte en analítica: un dashboard que al equipo de datos le parece autoexplicativo, y que a la persona que toma la decisión final le resulta, en el mejor de los casos, confuso, y en el peor, completamente ilegible.

## Por qué esto no es un problema de "explicar más despacio"

La cobertura de MIT Sloan sobre este sesgo señala una conclusión que vale la pena tomar en serio precisamente porque es contraintuitiva: los expertos en un dominio determinado suelen ser comunicadores más pobres dentro de ese mismo dominio que las personas sin experiencia en él. Esto no es una ironía retórica, es una consecuencia predecible del mecanismo del sesgo: entre más profundamente domina alguien un tema, más automatizado y comprimido se vuelve su propio razonamiento sobre ese tema —da por sentados pasos lógicos, términos técnicos y supuestos de contexto que para esa persona ya no requieren mención explícita, precisamente porque hace tiempo que dejaron de sentirse como información nueva—.

Esto tiene una implicación incómoda para cualquier organización que promueve a sus mejores especialistas técnicos hacia roles de liderazgo o de comunicación con clientes, bajo el supuesto razonable de que quien mejor entiende algo debería ser quien mejor lo explique. La evidencia sugiere exactamente lo contrario en el margen: sin entrenamiento específico en comunicación, la persona con más dominio técnico de un tema es, por diseño cognitivo, la que tiene más dificultad estructural para reconstruir la perspectiva de quien parte de cero.

## Qué significa esto para quienes lideran equipos de datos y analítica

Vale la pena ser explícito sobre por qué este sesgo es particularmente costoso en roles de ciencia de datos, ingeniería o cualquier función analítica dentro de una empresa: el valor de un análisis no se materializa en el momento en que se genera el resultado correcto, sino en el momento en que ese resultado se traduce en una decisión de negocio tomada por alguien que, casi por definición del propio rol analítico, no comparte el mismo nivel de detalle técnico que quien hizo el análisis. Un modelo estadísticamente impecable que nunca logra explicarse de forma que un comité directivo lo entienda y actúe sobre él tiene, en términos prácticos de impacto organizacional, el mismo valor que un modelo que nunca se construyó.

Esto no es un llamado a simplificar el trabajo técnico en sí —el rigor del análisis no debe negociarse—, sino a reconocer que la traducción de ese análisis hacia una audiencia no técnica es una habilidad distinta, con su propia curva de aprendizaje, que no se adquiere automáticamente como subproducto de la competencia técnica. De hecho, ocurre casi lo contrario: cada año adicional de especialización técnica profunda tiende a ampliar, no a reducir, la brecha entre cómo piensa el especialista y cómo piensa su audiencia.

## Qué hacer al respecto, según lo que la evidencia sí respalda

La literatura sobre este sesgo, desde el artículo original de Camerer, Loewenstein y Weber hasta las aplicaciones más recientes en comunicación visual de datos, converge en un punto metodológico central: dado que el sesgo es estructural y no se corrige con buena voluntad, la solución tiene que ser un proceso externo de verificación, no un esfuerzo interno de "ponerse en los zapatos del otro". Concretamente, esto significa probar cualquier explicación, dashboard o presentación técnica con una persona real que no tenga el contexto del equipo que la construyó, antes de presentarla a la audiencia final que sí importa —de la misma manera en que Elizabeth Newton solo pudo medir la brecha real entre lo que los tamborileadores creían comunicar y lo que efectivamente comunicaban porque existía un tercero, el oyente, cuya experiencia era imposible de simular desde adentro.

Esa prueba externa —mostrarle el análisis a alguien ajeno al proyecto antes de la reunión que realmente importa— es, en términos de costo, casi gratuita comparada con el costo de una decisión de negocio mal tomada porque quien debía decidir nunca entendió del todo lo que el análisis realmente decía.

## Una idea abierta

La pregunta que vale la pena que cualquier líder técnico se haga antes de su próxima presentación no es "¿expliqué esto con suficiente detalle?", sino la inversa: "¿qué es exactamente lo que yo sé sobre este tema que la persona frente a mí no tiene ninguna razón para saber, y que estoy dando por sentado sin darme cuenta?" Esa pregunta no tiene una respuesta que uno pueda generar introspectivamente con certeza —ese es, precisamente, el punto del sesgo—, lo cual es la razón exacta por la que la respuesta hay que salir a buscarla afuera, y no adentro de la propia cabeza.
