---
titulo: 'El síndrome del bombero: por qué los equipos de datos premian apagar incendios y casi nunca evitarlos'
fecha: 2026-11-23
categoria: opinion
mundo: notas-de-campo
tags:
  - cultura organizacional
  - gestión de incidentes
  - equipos de datos
  - ingeniería de software
  - incentivos
  - postmortem
  - liderazgo técnico
  - prevención de riesgos
resumen: 'Una reflexión desde la experiencia profesional: por qué el ingeniero que resuelve una caída a medianoche recibe reconocimiento inmediato, mientras quien diseñó el sistema para que esa caída nunca ocurriera casi nunca es notado — y qué hace esa asimetría de incentivos con la calidad real del trabajo preventivo.'
tesis: 'Que un sistema recompense visiblemente el heroísmo reactivo (resolver un incidente ya ocurrido) y casi nunca el trabajo preventivo invisible (el incidente que nunca llegó a pasar) es un patrón que se puede observar de forma directa en cómo se asignan reconocimiento y atención en equipos técnicos; que esa asimetría termine incentivando, con el tiempo, menos inversión real en prevención es una lectura razonable del incentivo pero no algo que esta nota pueda medir con un experimento controlado — es una interpretación basada en patrones recurrentes, no una ley demostrada.'
datosClave:
  - valor: 'Cultura "blameless"'
    etiqueta: 'El libro de ingeniería de confiabilidad de Google documenta la práctica de postmortems sin culpa como requisito para que un equipo aprenda de sus incidentes en vez de solo repetirlos'
    fuente: 'Google, Site Reliability Engineering (2016)'
gancho: 'El ingeniero que apaga el incendio a las 3am sale como héroe en el canal de Slack del equipo. El que diseñó el sistema para que ese incendio nunca empezara no sale en ningún lado. ¿Qué tan rota está una cultura que solo ve el trabajo cuando ya falló?'
imagen: /blog/portadas/sindrome-bombero-equipos-datos-premian-apagar-incendios-no-prevenirlos.jpg
socialImagen: /blog/social/sindrome-bombero-equipos-datos-premian-apagar-incendios-no-prevenirlos.jpg
postura:
  pregunta: '¿El reconocimiento desproporcionado al heroísmo reactivo en equipos técnicos es un problema cultural que vale la pena corregir activamente, o es simplemente una consecuencia natural e inevitable de que el trabajo preventivo, por definición, no genera una historia visible que contar?'
  aFavor: 'Si una organización mide y premia sistemáticamente solo lo que se ve (resolver incidentes), está enviando una señal de incentivos clara y medible: trabajar en prevención es, en términos de carrera y reconocimiento, una mala inversión de tiempo frente a especializarse en resolver crisis — y esa señal, sostenida durante años, sí determina en qué invierte su tiempo la gente más capaz del equipo.'
  enContra: 'Es ingenuo esperar que una organización reconozca con la misma intensidad algo que nunca ocurrió frente a algo que sí ocurrió y que mucha gente vivió en tiempo real: la ausencia de un incidente no genera una narrativa, un correo de agradecimiento espontáneo ni una anécdota que contar en la siguiente reunión, y pedirle a la cultura organizacional que compense artificialmente esa asimetría natural puede ser una batalla perdida de antemano, más que un problema real de diseño corregible.'
---

Hace un tiempo, en un equipo en el que trabajé, circuló un mensaje de agradecimiento por Slack a las 7am dirigido a un ingeniero que había pasado buena parte de la madrugada resolviendo una caída de un pipeline de datos crítico. El mensaje tenía emojis, reacciones, y al menos tres personas en copia del canal lo etiquetaron como ejemplo del tipo de compromiso que el equipo quería reconocer. Nadie recordaba, en cambio, quién había propuesto —seis meses antes, en una revisión de arquitectura que terminó quince minutos antes de lo programado porque "ya se había cubierto lo importante"— el cambio de diseño que habría evitado exactamente ese tipo de falla. Esa propuesta nunca se implementó. No porque fuera mala, sino porque nadie la priorizó con la misma urgencia con la que, meses después, se priorizó apagar el incendio que ella misma habría prevenido.

Esta nota no es sobre ese incidente específico ni sobre esa organización en particular —el patrón que describe lo he visto repetirse, con variaciones menores, en más de un lugar y más de un equipo—. Es sobre una asimetría de incentivos que rara vez se nombra en voz alta porque, vista de cerca, parece casi de sentido común: lo que se ve, se premia; lo que no se ve, no se premia. El problema es que en ingeniería de software, en ciencia de datos y en cualquier disciplina donde el trabajo preventivo es, por definición, invisible cuando funciona, esa lógica de sentido común termina construyendo exactamente el tipo de cultura que menos necesita cualquier sistema que dependa de la confiabilidad a largo plazo.

## La asimetría tiene una explicación simple: una historia se puede contar, la otra no

El incidente resuelto a las 3am tiene todos los elementos de una buena historia: un inicio (algo se rompió), un punto de tensión (el reloj corre, hay presión, quizás hay clientes afectados), un protagonista (quien lo resuelve) y un final satisfactorio (el sistema vuelve a funcionar). Es, en términos narrativos, una estructura perfecta, y las organizaciones —como cualquier grupo humano— son máquinas de contar y repetir historias. El trabajo preventivo que evita ese mismo incidente no tiene ninguno de esos elementos: no hay tensión visible, no hay reloj corriendo, no hay un momento claro de "resolución" porque nunca hubo un problema que resolver frente a testigos. Lo más parecido a una historia que genera el trabajo preventivo exitoso es, literalmente, la ausencia de una historia —el día que no pasó nada—, y ningún grupo humano ha encontrado todavía una forma natural de narrar y celebrar la ausencia de algo.

Esto no es un defecto moral de quienes reconocen el heroísmo reactivo más que el trabajo preventivo. Es una consecuencia casi mecánica de cómo funciona la atención humana: reaccionamos mucho más fuerte ante lo que es visible, inmediato y con un desenlace claro que ante lo que es difuso, distribuido en el tiempo y sin un momento identificable de éxito. El problema aparece cuando esa tendencia natural de la atención, sin ningún esfuerzo deliberado de corregirla, se convierte por defecto en el sistema de incentivos real de un equipo —el que determina, en la práctica, qué tipo de trabajo construye reputación y cuál no, más allá de lo que diga cualquier documento formal de valores.

## Lo que esa asimetría termina haciendo con el talento disponible

La consecuencia práctica de esta dinámica, cuando se sostiene durante suficiente tiempo, es una redistribución silenciosa del esfuerzo de la gente más capaz del equipo. Si resolver incidentes genera reconocimiento visible, ascensos implícitos en la reputación interna y una sensación clara de "aquí es donde aporto valor", mientras que el trabajo de rediseñar un sistema para que ese mismo tipo de incidente deje de ser posible genera, en el mejor de los casos, indiferencia, hay una lógica perfectamente racional —aunque nadie la articule así en voz alta— para que las personas más talentosas del equipo terminen optimizando, con el tiempo, su propia visibilidad de bombero en vez de su contribución como arquitectos de prevención.

He visto esta dinámica manifestarse de una forma particularmente perversa: ingenieros capaces que, de manera no necesariamente consciente, dejan de insistir en arreglar la causa raíz de un problema recurrente, porque esa misma causa raíz, sin resolver, les sigue dando la oportunidad regular de "salvar el día" cuando vuelve a fallar. No se trata de mala fe ni de sabotaje deliberado —la gran mayoría de las personas en esta situación genuinamente preferiría que el sistema no fallara—. Se trata de que el sistema de incentivos, sin que nadie lo haya diseñado así a propósito, termina recompensando más a quien resuelve el mismo incendio cinco veces que a quien lo apaga para siempre después de la primera.

## El postmortem sin culpa es la práctica correcta, pero resuelve solo la mitad del problema

La industria del software sí desarrolló, con el tiempo, una respuesta parcial a este problema: la cultura del postmortem "blameless" o sin culpa, documentada de forma extensa en el libro de ingeniería de confiabilidad de sitios de Google, que insiste en que un análisis de incidente debe enfocarse en las causas contribuyentes del sistema, nunca en señalar a una persona o equipo como culpable. Es una práctica genuinamente valiosa, porque evita el efecto perverso de que la gente oculte información relevante por miedo a ser castigada, y porque obliga a documentar con rigor qué falló y por qué.

Pero el postmortem sin culpa, por bien ejecutado que esté, sigue siendo una respuesta que ocurre después del incidente. Resuelve el problema de "no castigar al mensajero" y de "aprender de lo que ya pasó", pero no resuelve el problema anterior y más profundo: que el sistema de reconocimiento, en el día a día, sigue sin tener ningún mecanismo equivalente para el trabajo que habría evitado que hiciera falta escribir ese postmortem en primer lugar. Una organización puede tener la cultura de postmortems más sana y rigurosa del mundo, y seguir teniendo, al mismo tiempo, un sistema de reconocimiento que estructuralmente favorece a quien reacciona sobre quien previene.

## Lo que sí parece ayudar, cuando una organización lo intenta en serio

La corrección más efectiva que he visto funcionar no es un programa formal de reconocimiento al trabajo preventivo —ese tipo de iniciativa, en mi experiencia, tiende a sentirse artificial y dura poco, precisamente porque intenta fabricar una historia donde no la hay—. Lo que sí funciona es un cambio más simple y más incómodo de sostener: que un liderazgo técnico haga explícito, en las conversaciones de evaluación de desempeño y de prioridades, que la ausencia medible de incidentes en un sistema que antes los tenía con frecuencia es, en sí misma, la evidencia de un trabajo bien hecho, aunque no exista una anécdota dramática que acompañarla. Esto requiere que alguien con autoridad real se tome el trabajo de rastrear activamente qué se dejó de romper, no solo qué se arregló cuando se rompió —un ejercicio de atención deliberada que compensa, a propósito, el sesgo natural hacia lo visible.

También ayuda, de forma más estructural, separar explícitamente en la planeación del equipo el tiempo dedicado a resolver lo urgente del tiempo dedicado a prevenir lo importante, en vez de dejar que el segundo compita, sin protección alguna, contra el primero cada vez que surge una crisis. Cuando el trabajo preventivo no tiene un espacio protegido en el calendario, pierde casi siempre frente a cualquier incendio activo, porque un incendio activo tiene una urgencia que ningún plan preventivo, por bien justificado que esté en una hoja de cálculo, puede igualar en el momento.

## La pregunta que pocos equipos se hacen en voz alta

Si hubiera una sola pregunta que valdría la pena que cualquier liderazgo técnico se hiciera con honestidad, no sería "¿reconocemos bien a quien resuelve nuestros incidentes?" —esa pregunta casi siempre se responde que sí, porque es fácil de responder así—. Sería esta otra, más incómoda: de las últimas diez personas que recibieron reconocimiento visible en este equipo, ¿cuántas lo recibieron por algo que arreglaron después de que fallara, y cuántas por algo que evitaron que fallara en primer lugar? La mayoría de los equipos que conozco, si hacen ese conteo con honestidad, van a encontrar un desbalance que incomoda un poco verbalizar. No porque el reconocimiento al trabajo reactivo esté mal —apagar un incendio real a las 3am sigue siendo, sin duda, un trabajo valioso que merece reconocimiento—, sino porque un sistema que solo ve ese tipo de trabajo está, sin proponérselo, enseñándole a su gente más capaz exactamente qué tipo de contribución vale la pena perseguir a largo plazo.

## Fuentes

- Google, *Site Reliability Engineering: How Google Runs Production Systems*, 2016 — capítulo sobre cultura de postmortems sin culpa.
- [Chapter 15 - Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/) — Google SRE Book
- [Chapter 10 - Postmortem Culture: Learning from Failure](https://sre.google/workbook/postmortem-culture/) — Google SRE Workbook
- [Beyond the Fix-It Treadmill](https://cacm.acm.org/practice/beyond-the-fix-it-treadmill) — Communications of the ACM
