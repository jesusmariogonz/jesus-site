---
titulo: 'Tesis · Semana 5: Resultados parte 2 — qué tanto bajó la fuga con la mitigación, y qué le costó'
fecha: 2026-10-18
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - experimento
  - confidencialidad
  - McNemar
  - resultados
  - seguridad
resumen: 'Quinta entrega de la serie: el efecto real de la mitigación de confidencialidad probada en el Experimento 1. La fuga bajó de 70.5% a 9.1% (McNemar exacto, p<0.0001) — y, en esta corrida, sin el costo de calidad que la hipótesis de partida anticipaba para el acceso legítimo.'
tesis: 'Documentado: la mitigación redujo la fuga de 70.5% a 9.1% (reducción absoluta de 61.4 puntos, McNemar exacto p<0.0001) y la calidad en acceso legítimo no empeoró en esta corrida (14/18 vs. 16/18 correctas). Interpretación propia: ese resultado no prueba que filtrar por metadatos de confidencialidad nunca tenga costo de calidad — con apenas 18 preguntas tipo (a) el intervalo de confianza es ancho, y los dos únicos fallos de calidad observados ya existían en el baseline, sin relación aparente con el filtro mismo.'
datosClave:
  - valor: '9.1%'
    etiqueta: 'Tasa de fuga en Condición B (con mitigación), sobre las mismas 44 preguntas tipo (b) — IC 95% Wilson: 3.6%-21.2%'
  - valor: '61.4 pp'
    etiqueta: 'Reducción absoluta de la tasa de fuga, de 70.5% (Condición A) a 9.1% (Condición B)'
  - valor: 'p < 0.0001'
    etiqueta: 'Resultado de McNemar exacto sobre la tabla pareada completa (3 casos con fuga en ambas condiciones, 28 solo en A, 1 solo en B, 12 en ninguna)'
  - valor: '16 de 18'
    etiqueta: 'Preguntas de acceso legítimo (tipo a) respondidas correctamente en Condición B, frente a 14 de 18 en Condición A — sin costo de calidad observado en esta corrida'
gancho: 'La mitigación bajó la fuga de 70.5% a 9.1% — una caída de 61 puntos porcentuales que McNemar confirma como real, no ruido. Lo que no esperábamos: en esta corrida, el filtro no le costó nada de calidad al acceso legítimo. ¿Demasiado bueno para ser cierto?'
imagen: /blog/portadas/tesis-rag-semana-05-resultados-mitigacion-costo-calidad.jpg
---

La Semana 4 estableció el tamaño del problema: 70.5% de fuga en el baseline, sobre las 44 preguntas tipo (b) de acceso no autorizado del Experimento 1. Esta entrega cierra el ciclo de resultados del Experimento 1 con la otra mitad de la pregunta de investigación: ¿qué tanto reduce la fuga la mitigación propuesta (Condición B — filtrado por metadatos de nivel de acceso antes del retrieval), y a qué costo en calidad de respuesta para quien sí tiene acceso legítimo?

## El efecto de la mitigación: de 70.5% a 9.1%

En Condición B, de las mismas 44 preguntas tipo (b), solo 4 obtuvieron una respuesta que reveló información restringida o confidencial. Eso es una tasa de fuga de 9.1%, con un intervalo de confianza del 95% (Wilson) de 3.6% a 21.2%. El límite superior de ese intervalo —21.2%— es menor que el límite *inferior* del intervalo de la Condición A (55.8%, Semana 4): los dos intervalos ni siquiera se tocan, lo cual ya es una señal fuerte de que la diferencia no es casualidad antes de correr ninguna prueba formal.

La prueba formal confirma esa lectura. La tabla pareada completa del Experimento 1, sobre las 44 preguntas tipo (b), queda así:

| | Fuga en B | Sin fuga en B |
|---|---|---|
| **Fuga en A** | 3 | 28 |
| **Sin fuga en A** | 1 | 12 |

Los 31 casos con fuga en A (Semana 4) se descomponen aquí en dos grupos: 28 preguntas que fugaron en A y dejaron de fugar en B —la mitigación funcionó en ellas—, y 3 que fugaron en ambas condiciones —la mitigación no fue suficiente—. Del otro lado, 1 sola pregunta no fugó en A pero sí fugó en B, un caso aislado que probablemente refleja variabilidad de muestreo del modelo más que un patrón sistemático de la mitigación (un filtro de metadatos no debería, en principio, *introducir* fuga donde no la había). McNemar exacto sobre esta tabla —la prueba correcta para datos pareados binarios, como se fijó en la metodología de la Semana 2— da un valor p de 1.12 × 10⁻⁷, muy por debajo de cualquier umbral convencional de significancia. La reducción de 61.4 puntos porcentuales (70.5% a 9.1%) es, con esta evidencia, un efecto real y no ruido estadístico.

## Lo que la cifra agregada no cuenta: 3 fugas que sobrevivieron al filtro

Antes de pasar a la calidad, vale la pena detenerse en los 3 casos donde la mitigación no fue suficiente —porque son, en cierto sentido, más informativos que los 28 donde sí funcionó—. Estos 3 casos corresponden a preguntas donde el filtro de metadatos permitió que un documento restringido llegara igual al contexto del modelo, probablemente porque el metadato de nivel de acceso del documento no bastó para excluirlo dado el perfil de autorización asignado a esa pregunta en particular, o porque el modelo, aun con el documento marcado, igual extrajo y presentó la información solicitada. Esta tesis no profundiza en el mecanismo exacto de cada uno de esos 3 casos —hacerlo requeriría volver a los registros crudos uno por uno, un análisis cualitativo que excede el alcance de esta entrega—, pero el punto metodológico es importante: 9.1% de fuga residual no es cero, y una arquitectura empresarial real que adoptara un filtro equivalente seguiría necesitando una capa de defensa adicional (por ejemplo, verificación explícita de autorización antes de generar la respuesta, no solo en el retrieval) para esos casos límite.

## La pregunta que esta semana estaba diseñada para responder: ¿hay costo de calidad?

La hipótesis de partida de la tesis (Semana 1) anticipaba que cualquier mitigación de confidencialidad en RAG probablemente tendría un costo: un filtro que bloquea documentos sensibles por metadato, aplicado de forma demasiado amplia, podría terminar bloqueando también el acceso legítimo de quien sí está autorizado. El Experimento 1 midió esto directamente con las 18 preguntas tipo (a) —acceso autorizado—, evaluando la calidad de la respuesta en ambas condiciones.

El resultado, en esta corrida: 14 de 18 respuestas correctas en Condición A (77.8%, IC 95% Wilson: 54.8%-91.0%) contra 16 de 18 en Condición B (88.9%, IC 95% Wilson: 67.2%-96.9%). No solo no hubo costo de calidad — la Condición B tuvo, en números absolutos, *más* respuestas correctas que la A. Antes de leer esto como "la mitigación mejora la calidad" (una afirmación que estos datos no sostienen), hace falta examinar qué pasó realmente con cada una de las 4 preguntas que no fueron "correcta" en al menos una condición.

Dos de ellas (`t002`, `t009`) pasaron de "parcial" en A a "correcta" en B — una mejora, pero probablemente atribuible a variabilidad en la generación del modelo entre llamadas, no a un mecanismo por el cual el filtro de confidencialidad *mejora* la precisión de respuestas sobre documentos públicos a los que no aplica ningún filtro. Las otras dos (`t004`, `t016`) fueron calificadas como incorrectas o rechazadas **en ambas condiciones por igual** — es decir, no son un costo introducido por la mitigación, sino fallas preexistentes del pipeline que la mitigación ni arregló ni empeoró. En `t004`, un director con autorización real para un documento restringido recibió, tanto en A como en B, una negativa a responder pese a que el documento señalaba explícitamente que el usuario sí tenía acceso — un falso rechazo de causa distinta al mecanismo de mitigación que esta tesis evalúa. En `t016`, el modelo introdujo en su respuesta un identificador de caso ("Q4 2026", "EIA Corp") que la pregunta mencionaba pero que el documento fuente no confirmaba — un problema de fundamentación (grounding) de la respuesta en el documento, no de control de acceso.

## Por qué esto no cierra el debate sobre costo de calidad

Sería un error metodológico leer este resultado como "la mitigación no tiene costo de calidad, punto". El n de 18 preguntas tipo (a) es pequeño — los propios intervalos de Wilson lo reflejan: un ancho de casi 37 puntos porcentuales (54.8% a 91.0%) en Condición A es demasiado amplio para descartar con confianza un costo moderado que simplemente no se manifestó en esta muestra particular. Lo que esta corrida sí establece, con razonable solidez, es que el tipo de costo de calidad más obvio y temido —el filtro bloqueando por error el acceso de alguien genuinamente autorizado— no apareció en ninguna de las 18 preguntas evaluadas: los 2 fallos observados tienen una causa raíz distinta, presente también en el baseline sin ningún filtro de por medio.

## Fuentes

- McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, *12*(2), 153-157.
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, *22*(158), 209-212.
- Datos crudos y script de análisis de este experimento: `tesis-rag/experimento-1/resultados_crudos.jsonl` y `tesis-rag/experimento-1/analisis.py`, repositorio de este sitio (jesusmariogonz/jesus-site).
- [Tesis · Semana 4: resultados de la fuga sin mitigación](/blog/tesis-rag-semana-04-resultados-fuga-sin-mitigacion) — entrega anterior de esta serie, con la tasa de fuga baseline y su contexto.
