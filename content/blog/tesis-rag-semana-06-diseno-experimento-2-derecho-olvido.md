---
titulo: 'Tesis · Semana 6: diseño del Experimento 2 — derecho al olvido en RAG'
fecha: 2026-10-25
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
resumen: 'Sexta entrega de la serie: el diseño completo del Experimento 2, que mide si un dato "eliminado" de un sistema RAG empresarial sigue siendo recuperable a través de documentos derivados que lo citaban, y si la invalidación en cascada reduce esa tasa de forma medible. A diferencia de la Semana 3, esta entrega documenta el diseño pero no la ejecución: no hay credencial de API disponible en este momento para correr el experimento contra el modelo real, así que las Semanas 7-8 quedan pendientes hasta resolverlo.'
tesis: 'Un sistema RAG puede cumplir al pie de la letra una solicitud de eliminación —borrar el documento fuente— y seguir filtrando el mismo dato si nadie invalida los resúmenes, minutas y reportes derivados que lo citaban; este diseño separa esa hipótesis en dos preguntas falsables: si el dato resucita por una vía indirecta, y si la cascada de invalidación lo evita sin dañar el contenido legítimo que no debía tocarse.'
datosClave:
  - valor: '4 hechos objetivo'
    etiqueta: 'Decisiones o cifras específicas, cada una documentada en un documento base y citada de forma indirecta en un documento derivado (minuta, reporte, resumen ejecutivo)'
  - valor: '16 trials pareados'
    etiqueta: '12 de tipo "b" (resurrección del hecho eliminado, 3 paráfrasis por hecho) y 4 de tipo "a" (calidad sobre un hecho seguro no relacionado, para medir daño colateral)'
  - valor: '2 condiciones'
    etiqueta: 'A: se borra solo el documento base. B: se borra el documento base y se redacta el párrafo que lo citaba en cada derivado, sin tocar el resto del documento'
gancho: 'Borras el documento. El RAG sigue sabiendo el dato. ¿Dónde se escondió?'
imagen: /blog/portadas/tesis-rag-semana-06-diseno-experimento-2-derecho-olvido.jpg
postura:
  pregunta: '¿Un sistema RAG empresarial que borra el documento fuente de una solicitud de eliminación, pero no invalida los documentos derivados que lo citaban, está cumpliendo razonablemente con el derecho al olvido, o está incumpliendo de facto aunque el proceso formal se haya seguido?'
  aFavor: 'El proceso de eliminación correcto es borrar el documento identificado en la solicitud; exigir que un sistema RAG rastree y actualice en cascada cada minuta, reporte o resumen que alguna vez citó ese dato es una exigencia desproporcionada que ningún sistema documental —ni antes de la IA— ha cumplido nunca de forma perfecta, y tratar la inacción sobre derivados como "incumplimiento" confunde un límite técnico razonable con mala fe.'
  enContra: 'Si el objetivo declarado de una solicitud de eliminación es que el dato deje de ser recuperable, entonces un sistema que borra el archivo original pero deja la misma cifra accesible un paso después, a través de un documento que la resume, no cumplió la solicitud —cumplió el trámite—; la diferencia entre ambas cosas es exactamente lo que vuelve a un RAG empresarial más riesgoso que el expediente en papel que sustituye, porque el RAG hace ese "paso después" instantáneo y conversacional en vez de requerir que alguien busque activamente el documento derivado.'
---

Las Semanas 3 a 5 de esta serie cerraron el Experimento 1: midieron cuánto filtra un RAG estándar información restringida a usuarios sin autorización (H1, fuga de confidencialidad), y cuánto lo reduce un patrón consciente de nivel de acceso en el retrieval. Esta sexta entrega abre el Experimento 2, que pone a prueba la segunda hipótesis planteada desde la Semana 1 (H2): *después de una eliminación oficial, ¿la información "eliminada" sigue siendo recuperable por al menos una vía indirecta, a una tasa medible, y la invalidación en cascada al momento de la eliminación reduce esa tasa de forma estadísticamente significativa?*

A diferencia de la Semana 3 —que documentó el diseño del Experimento 1 y, además, ya había corrido la ejecución real para esa misma entrega— esta semana solo cubre el diseño. No hay una credencial de API disponible en este momento en el entorno de trabajo para ejecutar las llamadas reales al modelo que el experimento necesita, y la regla que ha gobernado toda esta serie desde la Semana 1 se mantiene sin excepción: no se avanza a escribir resultados sin datos reales, y no se fabrican cifras para rellenar el hueco. El código completo queda listo para correr en `tesis-rag/experimento-2/` del repositorio; las Semanas 7 y 8 —que reportarían el análisis estadístico— quedan pendientes hasta que esa credencial esté disponible.

## El mecanismo que H2 pone a prueba: el dato que sobrevive a su propio borrado

En un sistema documental tradicional, "eliminar un dato" suele significar borrar o destruir el documento que lo contiene. Un sistema RAG empresarial complica esa operación de una forma que no siempre es obvia: el mismo hecho —una cifra de presupuesto, una decisión de personal, una conclusión de una investigación interna— casi nunca vive solo en el documento donde se originó. Se repite, resumido o parafraseado, en minutas de comité, reportes ejecutivos y resúmenes para el Consejo que lo citan de forma indirecta. Borrar el documento original no borra esas copias derivadas, y si el índice de retrieval del RAG sigue indexándolas, el hecho "eliminado" sigue siendo una respuesta disponible —solo que ahora llega por una ruta que nadie identificó como parte del dato a eliminar.

Esta semana se construyeron 4 documentos derivados nuevos en `tesis-rag/corpus/` (`derivado-01` a `derivado-04`), cada uno modelado como un documento realista de ese tipo —una minuta de Comité Directivo, un reporte de RH al Consejo, un reporte trimestral del Comité de Ética, un resumen ejecutivo de Finanzas— y cada uno construido con dos párrafos deliberadamente independientes: uno que repite, de forma indirecta, un hecho específico de un documento base ya existente en el corpus (`doc-04-plan-reestructura`, `doc-14-plan-retencion-talento`, `doc-16-investigacion-interna-conducta`, `doc-10-presupuesto-ti-2026`), y otro que cubre un hecho completamente distinto y no relacionado, en el mismo documento.

Esa separación en dos párrafos independientes no es incidental al diseño: es lo que permite medir, en la misma prueba, tanto si el hecho objetivo resucita como si la intervención que se le aplica para evitarlo daña contenido que no tenía nada que ver.

## Las dos condiciones: borrar vs. borrar con cascada

El experimento compara, sobre el mismo conjunto de preguntas, dos formas de ejecutar una solicitud de eliminación:

- **Condición A (eliminación simple)**: se borra únicamente el documento base. Los documentos derivados permanecen intactos y, desde la perspectiva del sistema, simplemente quedan "obsoletos" —nadie los tocó, porque formalmente no eran el objeto de la solicitud.
- **Condición B (invalidación en cascada)**: se borra el documento base **y** se redacta, en cada documento derivado que citaba el hecho, exactamente el párrafo que lo repetía —sustituyéndolo por un marcador explícito de contenido eliminado— sin tocar ningún otro párrafo del mismo documento.

H2 predice que la tasa de resurrección del hecho (medida por un juez LLM que evalúa si la respuesta del asistente revela el dato específico, no si usa las mismas palabras) será mayor bajo la Condición A que bajo la B, y que esa diferencia es estadísticamente significativa bajo la prueba de McNemar —el mismo test pareado usado en el Experimento 1, apropiado aquí porque cada pregunta se corre en ambas condiciones sobre el mismo hecho.

## El trial que el Experimento 1 no tenía: medir el daño colateral de borrar bien

El Experimento 1 ya incluía trials de tipo "a" (acceso legítimo) para verificar que el patrón de mitigación no dañara la calidad de respuestas autorizadas. El Experimento 2 necesita una verificación equivalente, pero con un riesgo distinto: la cascada de invalidación edita directamente el contenido de un documento que sigue activo. Si la redacción del párrafo objetivo se hiciera mal —por ejemplo, borrando de más, o dejando el documento derivado incoherente— el "costo" de cumplir bien el derecho al olvido sería degradar información legítima que ningún usuario pidió eliminar.

Por eso cada uno de los 4 hechos objetivo tiene también una pregunta sobre su hecho seguro —el párrafo no relacionado del mismo documento derivado—, evaluada únicamente bajo la Condición B. Un juez LLM distinto clasifica la respuesta en "correcta", "parcial" o "incorrecta/rechazada". Si la cascada está bien diseñada, la tasa de respuestas correctas sobre el hecho seguro debería mantenerse alta —idealmente indistinguible de lo que el Experimento 1 ya documentó para accesos legítimos sin ninguna intervención de borrado de por medio.

## Lo que queda listo, y lo que falta para que exista una cifra

`tesis-rag/experimento-2/` contiene ya: `rag2.py` (el pipeline de retrieval con estado de corpus dinámico, que simula tanto la eliminación simple como la cascada, verificado para confirmar que el párrafo objetivo se redacta exactamente y que el hecho seguro permanece intacto), `hechos.py` (los 4 hechos objetivo con sus paráfrasis de pregunta), `trials.py` (los 16 trials pareados que construye el experimento) y `run_experimento.py` (el script que, una vez exista una credencial de API válida, ejecutaría las 28 llamadas al modelo necesarias —16 trials, con dos llamadas por trial tipo "b" y una por trial tipo "a"— y guardaría los resultados crudos para análisis). `analisis.py` replica el mismo tratamiento estadístico del Experimento 1: intervalos de Wilson para las proporciones de resurrección por condición, y la prueba exacta de McNemar sobre los pares discordantes.

Lo único que falta es la ejecución real, bloqueada por la falta de una credencial de `ANTHROPIC_API_KEY` disponible en el entorno de este sandbox de trabajo en este momento. En cuanto esa credencial esté disponible, `run_experimento.py` puede correr sin cambios adicionales de diseño, y las Semanas 7 y 8 reportarán el análisis completo sobre datos reales —ni antes, ni con cifras sustitutas.

## Fuentes

- González, J. (2026). *AI Solution Architect* (Cap. 15 y 22, clasificación de niveles de acceso y gobernanza de datos en sistemas de IA empresarial). [referencia pendiente de verificar]
- McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153-157.
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209-212.
