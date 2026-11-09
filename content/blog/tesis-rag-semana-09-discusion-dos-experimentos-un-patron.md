---
titulo: 'Tesis · Semana 9: discusión — dos experimentos, un mismo patrón'
fecha: 2026-11-08
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - experimento
  - gobernanza de datos
  - falsabilidad
  - McNemar
  - EIA Corp
resumen: 'Novena entrega de la serie: se contrastan los resultados de los dos experimentos con el criterio de falsabilidad fijado en la Semana 2. H1 no fue refutada; H2 tampoco en la única vía que se midió (documentos derivados). La entrega propone una lectura común de ambos resultados, la marca como interpretación y no como hallazgo, y enumera lo que ninguno de los dos experimentos puede afirmar.'
tesis: 'Los dos experimentos muestran la misma forma en un corpus controlado: un control aplicado en un solo punto (el acceso en H1, el borrado del documento fuente en H2) deja que la información salga por otra ruta, y un control aplicado donde esa ruta existe la bloquea. Eso es lo medido. Que ocurra igual en sistemas reales, con otros modelos o por otras vías de persistencia no lo establece ninguno de los dos experimentos.'
datosClave:
  - valor: '70.5% → 9.1%'
    etiqueta: 'Experimento 1 (H1): fuga de información restringida sin y con el patrón consciente de nivel de acceso'
    fuente: 'Experimento 1, 44 trials'
  - valor: '91.7% → 0%'
    etiqueta: 'Experimento 2 (H2): resurrección del dato eliminado con borrado simple y con cascada de redacción'
    fuente: 'Experimento 2, 12 trials'
  - valor: '1 de 3 vías'
    etiqueta: 'Vías de resurrección que el criterio de falsabilidad de H2 enumeraba y que el experimento sí evaluó (documentos derivados; caché semántico y contexto de conversación quedaron sin medir)'
    fuente: 'Semana 2 y Experimento 2'
gancho: 'Dos experimentos, dos hipótesis distintas, la misma historia: el control se puso en un lugar y el dato salió por otro. ¿En cuántos de tus sistemas el "acceso restringido" o el "borrado" vive solo en la puerta principal?'
imagen: /blog/portadas/tesis-rag-semana-09-discusion-dos-experimentos-un-patron.jpg
postura:
  pregunta: 'Si dos experimentos pequeños sobre un corpus sintético apuntan en la misma dirección, ¿es razonable que una organización cambie hoy la arquitectura de sus sistemas RAG, o debería esperar evidencia en sistemas reales antes de invertir en ello?'
  aFavor: 'Conviene actuar ya: un filtro de acceso en el retrieval y una cascada de redacción cuestan poco frente a una filtración o un incumplimiento, y los mecanismos que explican ambos resultados (derivados que repiten el dato, retrieval que ignora el nivel de acceso) no dependen del corpus ni del modelo usado.'
  enContra: 'Conviene esperar: 44 y 12 trials sobre documentos escritos para el experimento no demuestran que un sistema real, con miles de documentos, otros recuperadores y otros modelos, se comporte igual, y rediseñar la arquitectura sobre esa base puede costar más que el riesgo que busca reducir; lo prudente es auditar primero el propio sistema con un experimento propio.'
---

Con los dos experimentos ejecutados y reportados, esta entrega hace lo que la Semana 2 prometió: comparar los resultados con el criterio de falsabilidad fijado antes de tener datos. Los números ya se publicaron por separado; para el detalle del Experimento 2, véase la [Semana 8](/blog/tesis-rag-semana-08-resultados-experimento-2-cascada-costo). Aquí se juntan, se contrastan y se declara qué queda sin respuesta.

## Los dos resultados, lado a lado

| | Experimento 1 (H1, fuga) | Experimento 2 (H2, derecho al olvido) |
|---|---|---|
| Condición base (A) | 31 de 44 = 70.5% de fuga, IC 95% [55.8%, 81.8%] | 11 de 12 = 91.7% de resurrección, IC 95% [64.6%, 98.5%] |
| Con el control (B) | 4 de 44 = 9.1%, IC 95% [3.6%, 21.2%] | 0 de 12 = 0%, IC 95% [0%, 24.2%] |
| McNemar exacto | p = 1.12 × 10⁻⁷ (28 contra 1 pares discordantes) | p = 0.00098 (11 contra 0 pares discordantes) |
| Calidad con el control | 16 de 18 correctas (sin control, 14 de 18) | 4 de 4 conservan el dato legítimo (verificación literal); el juez LLM dio 2 de 4 |

Los dos tienen la misma forma: una tasa alta sin el control, una tasa baja con él y una diferencia que la prueba pareada considera improbable por azar. Los intervalos son anchos, sobre todo en el Experimento 2, y no deben leerse como estimaciones precisas.

## Contra el criterio de falsabilidad de la Semana 2

**H1.** La hipótesis se daba por refutada si el control no reducía la fuga de forma significativa (p < 0.05) o si lo hacía a un costo de calidad que lo volviera impracticable. La reducción fue significativa y, en la corrida, la calidad en acceso legítimo no empeoró (16 de 18 con el control, 14 de 18 sin él). Bajo ese criterio, H1 no fue refutada. Con 18 trials de calidad, esa ausencia de costo observado tampoco es una garantía.

**H2.** El criterio tenía dos condiciones: que la cascada redujera significativamente la resurrección y que la tasa base no fuera indistinguible de cero. Ambas se cumplieron. Pero el mismo criterio enumeraba como vías de resurrección el caché semántico y el contexto de conversación, y el Experimento 2 solo evaluó los documentos derivados. Por tanto, H2 no fue refutada en una de las tres vías planteadas, y las otras dos quedan sin evaluar. Escribir que "H2 se confirmó" iría más allá de lo medido.

## Una lectura común, marcada como interpretación

Lo que une ambos resultados es el mecanismo, no el número. En el Experimento 1, la información restringida salía porque el retrieval no consideraba el nivel de acceso de quien preguntaba; el control se colocó ahí y la fuga cayó. En el Experimento 2, el dato eliminado salía porque otros documentos lo repetían; el control se colocó en esos documentos y la resurrección cayó. En ambos casos, un control aplicado solo en el punto más visible (el acceso al documento, el borrado del archivo) dejaba la información accesible por otra ruta.

Esto es una interpretación de los datos, no un resultado estadístico: ninguna prueba compara un experimento con el otro, y los dos miden cosas distintas. Es una hipótesis razonable sobre una propiedad general de estos sistemas, y es justo la que no se puede probar con dos corridas sobre un corpus.

Hay además un matiz que va en contra de la lectura más cómoda. En el Experimento 1, el control no eliminó la fuga: quedaron 4 fugas de 44 con el control activo (3 de ellas también ocurrían sin él, y la Semana 5 las revisó como casos donde el filtro no bastó). Un control reduce una tasa; no demuestra que la ruta quedó cerrada.

## Qué no pueden decir estos experimentos

- **Un solo corpus sintético**: los documentos de EIA Corp se escribieron para el experimento, con hechos limpios y derivados que los citan de forma directa. Un corpus real es más ruidoso.
- **Un solo modelo y un solo recuperador**: `claude-haiku-4-5` con TF-IDF. Otros modelos y recuperadores densos pueden comportarse distinto.
- **Juez y evaluado del mismo modelo**, sin rúbrica calibrada; en el Experimento 2 el juez y la verificación literal discreparon sobre la calidad.
- **Tamaños pequeños**, en especial el Experimento 2 (12 trials de resurrección y 4 de calidad).
- **Vías sin medir**: caché semántico, memoria de largo plazo y contexto de conversación.
- **Sin costo de adopción**: no se midió cuánto cuesta implementar estos controles en producción.
- **Sin conclusión jurídica**: como se planteó desde la Semana 1, nada de esto establece si un sistema concreto incumple una ley de protección de datos.

## Qué sigue

La Semana 10 cierra la serie con las conclusiones, los anexos y el documento consolidado de la tesis. Los datos crudos, los resúmenes estadísticos y los scripts de ambos experimentos están en `tesis-rag/experimento-1/` y `tesis-rag/experimento-2/`.

## Fuentes

- McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153-157.
- Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson & Co.
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209-212.
