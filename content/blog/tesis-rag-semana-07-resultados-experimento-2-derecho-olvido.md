---
titulo: 'Tesis · Semana 7: resultados del Experimento 2 — el dato que resucita tras borrarse'
fecha: 2026-10-26
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
resumen: 'Séptima entrega de la serie: resultados reales del Experimento 2. Con borrado simple del documento fuente, el hecho "eliminado" siguió siendo recuperable en 11 de 12 trials (91.7%); con borrado más redacción en cascada de los derivados, en 0 de 12. La diferencia es estadísticamente significativa (McNemar exacto, p = 0.00098), pero la muestra es pequeña y el costo de calidad de la cascada quedó sin resolver.'
tesis: 'En este corpus controlado, borrar solo el documento fuente dejó el dato recuperable casi siempre porque los documentos derivados seguían citándolo; redactar esos derivados lo eliminó por completo. Eso es lo medido. Que la cascada sea además inocua para el contenido legítimo no lo demuestra esta corrida: el juez marcó 2 de 4 respuestas como no correctas, y esas 4 observaciones no alcanzan para afirmar nada sobre el costo.'
datosClave:
  - valor: '91.7% → 0%'
    etiqueta: 'Resurrección del hecho eliminado: borrado simple (11 de 12 trials) vs. borrado con cascada (0 de 12)'
    periodo: 'Corrida del 26 de octubre de 2026'
    fuente: 'Experimento 2, tesis-rag/experimento-2'
  - valor: 'p = 0.00098'
    etiqueta: 'McNemar exacto sobre 12 pares: 11 discordantes a favor de la cascada, 0 en contra'
    fuente: 'Experimento 2, analisis.py'
  - valor: '2 de 4'
    etiqueta: 'Respuestas sobre hechos seguros que el juez LLM clasificó como correctas bajo la cascada (muestra insuficiente para concluir)'
    fuente: 'Experimento 2, resultados_crudos.jsonl'
gancho: 'Borramos el documento y el RAG respondió igual en 11 de 12 intentos. Redactamos las minutas que lo citaban y bajó a 0. ¿Cuántos de tus "datos eliminados" siguen vivos en un resumen que nadie revisó?'
imagen: /blog/portadas/tesis-rag-semana-07-resultados-experimento-2-derecho-olvido.jpg
postura:
  pregunta: 'Si la cascada de redacción elimina el dato pero puede degradar contenido legítimo de los documentos derivados, ¿una organización debe aplicarla por defecto o solo cuando el riesgo de que el dato resucite supere el riesgo de dañar lo que se conserva?'
  aFavor: 'Debe aplicarse por defecto: una solicitud de eliminación existe para que el dato deje de ser recuperable, y el borrado simple falló en 11 de 12 intentos; un documento derivado que pierde un párrafo bien acotado es un costo reparable, mientras que un dato personal que sigue accesible no lo es.'
  enContra: 'No debe ser automática: editar documentos que siguen activos altera registros que pueden tener valor legal o probatorio, y con una redacción mal acotada la cascada borraría de más; conviene decidir caso por caso, con revisión humana, cuándo el riesgo de resurrección justifica modificar un documento.'
---

La Semana 6 dejó el diseño del Experimento 2 y su código listo, pero sin ejecutar: faltaba una credencial de API. Esa credencial ya estuvo disponible el 26 de octubre y el experimento se corrió completo. Esta entrega reporta lo que salió, incluidas las partes que no favorecen la hipótesis o que no se pueden concluir. Para el diseño, véase la [entrega de la Semana 6](/blog/tesis-rag-semana-06-diseno-experimento-2-derecho-olvido).

## Qué se midió

H2 plantea que, tras una eliminación oficial, la información "eliminada" sigue siendo recuperable por al menos una vía indirecta, y que la invalidación en cascada reduce esa tasa. Se evaluaron 4 hechos objetivo, cada uno con 3 paráfrasis de pregunta (12 trials de tipo "b", pareados entre condiciones), más 4 preguntas de tipo "a" sobre un hecho seguro del mismo documento derivado, solo bajo la Condición B. El modelo fue `claude-haiku-4-5-20251001`, con recuperación TF-IDF sobre el corpus de EIA Corp. Un juez LLM, el mismo modelo, decidió si cada respuesta revelaba el hecho eliminado.

## Resultado principal: la resurrección

| Condición | Resurrección | Tasa | IC 95% (Wilson) |
|---|---|---|---|
| A: borrado simple del documento base | 11 de 12 | 91.7% | [64.6%, 98.5%] |
| B: borrado + redacción en cascada | 0 de 12 | 0% | [0%, 24.2%] |

La tabla pareada tiene 11 pares en los que el hecho resucitó en A y no en B, 0 en el sentido contrario y 1 par en el que no resucitó en ninguna condición. La prueba de McNemar exacta da p = 0.00098. Con una diferencia absoluta de 91.7 puntos porcentuales, el resultado va en la dirección que H2 predecía.

Hay que leerlo con dos cuidados. Primero, "0%" es la tasa observada, no una garantía: con 12 trials, el límite superior del intervalo llega a 24.2%. Segundo, el único par donde no hubo resurrección en A corresponde a una pregunta sobre qué área debe confirmar un cronograma, y su respuesta correcta no contiene la cifra del presupuesto; el juez lo clasificó correctamente como no resurrección. No es una falla del mecanismo, sino una pregunta cuyo hecho objetivo no era recuperable por esa vía.

## Lo que sí queda documentado como hecho

Los 4 hechos objetivo (el monto de una reestructura, un paquete de retención, la conclusión de una investigación de conducta y una partida presupuestal) resucitaron en las 3 paráfrasis de los tres primeros y en 2 de 3 del cuarto bajo borrado simple. Es decir, el fenómeno no depende de un solo hecho. El mecanismo es el planteado desde la Semana 6: el documento base se borra, pero un documento derivado conserva el párrafo, y la recuperación lo encuentra.

## Lo que no queda resuelto: el costo de la cascada

El segundo componente de H2 pedía verificar que la cascada no dañara contenido legítimo. Aquí el resultado es ambiguo y se reporta como tal: el juez clasificó 2 de 4 respuestas sobre el hecho seguro como correctas, 1 como parcial y 1 como "incorrecta o rechazada".

Revisar las respuestas crudas matiza esas cifras, sin cambiarlas. En el caso clasificado como incorrecto, el asistente respondió con datos concretos del contrato de arrendamiento de Monterrey, pero el juez argumentó que la información "aparenta ser confidencial". Eso es un criterio del juez, no un daño a la respuesta; en el caso parcial, el juez objetó que citara el nombre del documento fuente. Ninguna de las dos respuestas muestra pérdida de contenido causada por la redacción. Pero esa lectura es mía, hecha después de ver los resultados, y no sustituye la medición: con 4 observaciones y un juez cuyo criterio no se calibró, esta corrida no permite afirmar que la cascada sea inocua ni que dañe. Es una limitación del diseño que una réplica debería corregir con más trials de calidad y un juez con rúbrica fija.

## Limitaciones

- **Muestra pequeña**: 12 trials de resurrección y 4 de calidad, sobre 4 hechos de un solo corpus sintético.
- **Juez y evaluado son el mismo modelo**, lo que puede introducir sesgos correlacionados.
- **Una sola corrida** por trial, sin repeticiones que midan la variabilidad del modelo.
- **Corpus controlado**: los documentos derivados se construyeron para citar el hecho de forma limpia. En una organización real, el dato puede estar parafraseado en más lugares, o ninguno.
- **Ajuste técnico previo a la corrida**: el script original no interpretaba el JSON del juez cuando venía dentro de un bloque de código; se corrigió el parseo y se subió el límite de tokens del juez de 200 a 400. No se tocó ni el diseño ni los trials.

## Qué sigue

La Semana 8 abordará la discusión de ambos experimentos. Los datos crudos, el resumen estadístico y el código están en `tesis-rag/experimento-2/`, de modo que cualquier lector puede reproducir el análisis y revisar las respuestas del modelo.

## Fuentes

- McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153-157.
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209-212.
- Parlamento Europeo y Consejo de la Unión Europea. (2016). *Reglamento (UE) 2016/679 (Reglamento General de Protección de Datos)*, artículo 17 (derecho de supresión).
