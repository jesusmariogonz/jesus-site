---
titulo: 'Tesis · Semana 8: la cascada de redacción en el Experimento 2 — qué quitó y qué dejó'
fecha: 2026-11-01
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - experimento
  - derecho al olvido
  - McNemar
  - gobernanza de datos
  - EIA Corp
resumen: 'Octava entrega de la serie: segunda parte de los resultados del Experimento 2, centrada en la condición con mitigación. Se desglosa qué hizo la cascada de redacción hecho por hecho (0 de 12 resurrecciones) y se revisa su costo sobre el contenido legítimo con una verificación determinista, sin juez LLM, que corrige una lectura ambigua de la Semana 7.'
tesis: 'La cascada de redacción quitó el dato objetivo en los 12 trials y, en los 4 casos revisados, dejó intacto el dato legítimo del mismo documento. Eso es lo observado. El juez LLM clasificó solo 2 de esas 4 respuestas como correctas, pero la lectura de las respuestas crudas indica que sus objeciones fueron de criterio y no de contenido perdido; con 4 observaciones, esto descarta un daño evidente, no demuestra que no exista.'
datosClave:
  - valor: '0 de 12'
    etiqueta: 'Trials en que el dato eliminado resucitó con borrado más cascada de redacción, frente a 11 de 12 con borrado simple'
    fuente: 'Experimento 2'
  - valor: '4 de 4'
    etiqueta: 'Respuestas sobre contenido legítimo que conservan el dato literal tras la cascada, según verificación sin juez LLM'
    fuente: 'verificacion_calidad.py'
  - valor: '2 de 4'
    etiqueta: 'Esas mismas respuestas clasificadas como correctas por el juez LLM (1 parcial, 1 incorrecta por criterio de confidencialidad)'
    fuente: 'Experimento 2, juez LLM'
gancho: 'El juez dijo que la cascada falló en 2 de 4 respuestas. Al leerlas, las 4 tenían el dato correcto. ¿Qué pasa cuando el árbitro de tu experimento es un modelo con sus propios prejuicios?'
imagen: /blog/portadas/tesis-rag-semana-08-resultados-experimento-2-cascada-costo.jpg
postura:
  pregunta: 'Cuando un juez automático y una verificación literal discrepan sobre si una respuesta es buena, ¿qué debe pesar más en una investigación: el criterio del juez LLM, que entiende matices, o la verificación determinista, que solo comprueba presencia de un dato?'
  aFavor: 'Debe pesar la verificación determinista: es reproducible, no hereda los sesgos del modelo que evalúa y puede auditarse línea por línea; un juez que objeta una respuesta correcta por parecerle confidencial está midiendo su propio criterio, no la calidad de la respuesta.'
  enContra: 'Debe pesar el juez: una respuesta puede contener el dato literal y aun así ser mala, por citar una fuente que el usuario no conoce o mezclar información no pedida; la verificación literal solo detecta la ausencia del dato, y confiar en ella sola declararía correcta cualquier respuesta que lo mencione.'
---

La [Semana 7](/blog/tesis-rag-semana-07-resultados-experimento-2-derecho-olvido) reportó el resultado principal del Experimento 2 y dejó una pregunta abierta: el costo de la cascada de redacción sobre el contenido legítimo. Esta entrega cubre la condición con mitigación con más detalle, siguiendo el plan de la serie, y resuelve en parte esa pregunta con una verificación adicional. La interpretación conjunta de los dos experimentos queda para la Semana 9.

## Qué hizo la cascada, hecho por hecho

La Condición B borra el documento base y además redacta, en cada documento derivado, el párrafo que repetía el hecho. Resultado por hecho objetivo, con 3 paráfrasis de pregunta cada uno:

| Hecho objetivo | Resurrección con borrado simple (A) | Con borrado + cascada (B) |
|---|---|---|
| Reestructura (posiciones, fusión, fecha de anuncio) | 3 de 3 | 0 de 3 |
| Retención de talento (monto, posiciones, paquete) | 3 de 3 | 0 de 3 |
| Investigación de conducta | 3 de 3 | 0 de 3 |
| Partida de migración de IA | 2 de 3 | 0 de 3 |
| **Total** | **11 de 12** | **0 de 12** |

En los cuatro hechos, la cascada produjo el mismo resultado. El único par donde no hubo resurrección bajo A fue una pregunta sobre qué área debe confirmar un cronograma: la respuesta correcta no contiene ninguna cifra del presupuesto, de modo que el hecho objetivo no era recuperable por esa pregunta con ninguna condición. Por eso el par no cuenta como evidencia a favor de la cascada.

Con 12 trials, el límite superior del intervalo de Wilson para 0 de 12 es 24.2%: la tasa observada es cero, pero no puede descartarse una tasa de hasta casi una cuarta parte.

## El costo de calidad: dos instrumentos que no coinciden

La Condición B edita documentos que siguen activos, así que la pregunta de costo es legítima: ¿la redacción dañó el contenido vecino? Para cada hecho había una pregunta sobre el dato seguro del mismo documento derivado. Se midió de dos formas.

**Juez LLM** (la medición original de la Semana 7): 2 respuestas correctas, 1 parcial, 1 incorrecta o rechazada.

**Verificación determinista** (`verificacion_calidad.py`, nueva en esta entrega): comprueba si la respuesta contiene el dato literal que el documento derivado trae en su párrafo seguro (3 años de renovación del arrendamiento, 92 colaboradores certificados, 97% del curso de conducta, 2% por debajo del presupuesto trimestral) y que ese dato existe en el documento. Resultado: 4 de 4.

La discrepancia se explica leyendo las respuestas crudas. El juez marcó como "incorrecta" la respuesta que confirmaba correctamente la renovación del contrato de Monterrey por 3 años, con el argumento de que esa información "aparenta ser confidencial"; es una objeción sobre qué debía contestarse, no sobre si el dato era el correcto. Y marcó como "parcial" la respuesta del 2% bajo presupuesto porque citaba el nombre del documento fuente. Ninguna de las dos objeciones indica contenido perdido por la redacción.

Esta es una lectura posterior a ver los resultados, y debe tratarse con esa cautela. La verificación literal solo detecta si el dato está; no evalúa que la respuesta sea completa o apropiada en otros aspectos. Por eso el hallazgo se formula así: no se observó pérdida del dato legítimo en 4 de 4 casos, y la clasificación del juez refleja sobre todo su propio criterio. No se formula como "la cascada no tiene costo": con 4 casos, no se puede estimar una tasa.

## Lo que esta entrega no cambia

- El resultado principal (11 de 12 contra 0 de 12, McNemar exacto p = 0.00098) es el de la Semana 7. Aquí solo se desglosa.
- Los datos crudos no se modificaron. La verificación literal es un análisis adicional sobre `resultados_crudos.jsonl`, y el reporte del juez se conserva tal cual.
- Sigue sin evaluarse la resurrección por caché semántico o contexto de conversación, que el criterio de falsabilidad de la Semana 2 también contemplaba.

## Qué sigue

La Semana 9 es la Discusión: se contrastarán ambos experimentos con el criterio de falsabilidad fijado en la Semana 2 y se hará explícito qué pueden y qué no pueden afirmar estos datos. La Semana 10 cerrará con las conclusiones y el documento consolidado. Los datos, el resumen estadístico y los scripts están en `tesis-rag/experimento-2/`.

## Fuentes

- McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153-157.
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209-212.
