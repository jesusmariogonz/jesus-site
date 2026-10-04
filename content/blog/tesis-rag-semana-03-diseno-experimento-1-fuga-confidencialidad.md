---
titulo: 'Tesis · Semana 3: diseño (y ejecución) del Experimento 1 — fuga de confidencialidad en RAG'
fecha: 2026-10-04
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - experimento
  - confidencialidad
  - McNemar
  - seguridad
  - EIA Corp
resumen: 'Tercera entrega de la serie: el diseño completo del Experimento 1, que mide cuánto filtra un RAG estándar información restringida a usuarios sin autorización, y cuánto lo reduce un patrón consciente de confidencialidad. A diferencia del calendario original, esta entrega no se queda en el diseño: el experimento ya se corrió contra la API real de Anthropic, sobre un corpus ampliado de 18 documentos ficticios de EIA Corp, con 62 pruebas pareadas — los resultados estadísticos completos se presentan en las Semanas 4 y 5.'
tesis: 'Un experimento de fuga de confidencialidad en RAG solo es creíble si el corpus, las preguntas y el criterio de "qué cuenta como fuga" se fijan antes de ver una sola respuesta del modelo; esta entrega documenta ese diseño completo —y, para que la Semana 4 no dependa de una promesa, también su ejecución real— antes de que la serie reporte ninguna cifra de resultado.'
datosClave:
  - valor: '18 documentos'
    etiqueta: 'Tamaño final del corpus ficticio de EIA Corp, con cuatro niveles de acceso (público, interno, confidencial, restringido), ampliado de los 4 documentos iniciales de la Semana 1'
  - valor: '3 roles'
    etiqueta: 'Becario, gerente y director, cada uno con un conjunto distinto de niveles de acceso autorizados'
  - valor: '62 pruebas pareadas'
    etiqueta: 'Trials ejecutados, 44 de tipo (b) —acceso no autorizado, posible fuga— y 18 de tipo (a) —acceso legítimo, para medir el costo en calidad'
  - valor: '2 condiciones'
    etiqueta: 'Condición A (retrieval sin metadatos de confidencialidad) vs. Condición B (retrieval filtrado por nivel de acceso del rol), sobre las mismas preguntas'
gancho: '¿Qué pasa si le preguntas a un asistente de RH algo que solo debería saber un director? Un RAG sin control de acceso no se lo piensa dos veces: en este experimento, filtró el dato restringido en 7 de cada 10 intentos.'
imagen: /blog/portadas/tesis-rag-semana-03-diseno-experimento-1-fuga-confidencialidad.jpg
---

Las dos primeras entregas de esta serie plantearon el problema —los componentes auxiliares de un pipeline RAG pueden preservar información fuera de los límites de gobernanza que el sistema dice respetar— y fijaron la metodología unificada que lo pondría a prueba: diseño pareado, prueba de McNemar, intervalos de confianza de Wilson, criterio de falsabilidad popperiano. Esta tercera entrega traduce esa metodología en el primer experimento concreto: ¿cuánto filtra un RAG empresarial información restringida a usuarios sin autorización, y cuánto lo reduce el patrón consciente de confidencialidad/jurisdicción descrito en los capítulos 15 y 22 del libro que origina esta tesis?

El calendario original de la serie (Semana 3: diseño; Semana 4: resultados) separaba diseñar de ejecutar. Esta entrega conserva esa separación narrativa —documenta el diseño completo antes de reportar ninguna cifra— pero, a diferencia del plan original, el experimento ya se corrió de principio a fin contra la API real de Anthropic (modelo `claude-haiku-4-5`), con datos crudos guardados para reproducibilidad en `tesis-rag/experimento-1/` del repositorio. Las Semanas 4 y 5 presentarán el análisis estadístico completo y la discusión; aquí solo se ancla el diseño y se documenta que la ejecución real ya ocurrió, para que ninguna cifra posterior de esta serie dependa de un experimento todavía pendiente.

## El corpus: de 4 a 18 documentos ficticios de EIA Corp

La Semana 1 dejó un núcleo inicial de 4 documentos del proyecto transversal ficticio del libro, "Enterprise Intelligence Agent" (EIA Corp). Para que el experimento tuviera poder estadístico razonable, esta semana el corpus se amplió a 18 documentos, distribuidos en cuatro niveles de acceso según la clasificación de los capítulos 15 y 22 del libro:

- **Público** (7 documentos): política de vacaciones, código de conducta, horario y home office, catálogo de servicios de TI, política de gastos de viaje, manual de marca, política de proveedores de TI.
- **Interno** (3 documentos): manual de onboarding, política de clasificación de datos, protocolo de respuesta a incidentes de seguridad.
- **Confidencial** (5 documentos): matriz de compensación por nivel, matriz de perfiles de acceso a sistemas, presupuesto de TI 2026, plan de retención de talento clave, roadmap de producto del asistente EIA.
- **Restringido** (3 documentos): plan de reestructura organizacional (borrador), contrato marco con proveedor de infraestructura cloud, investigación interna de conducta.

Cada documento es ficticio pero deliberadamente específico —cifras, nombres de proceso, plazos—, porque un documento vago no permite distinguir con claridad si una respuesta del modelo "revela" o no información que solo aparece ahí.

## Los roles simulados

Se definieron tres roles con niveles de acceso anidados, siguiendo la lógica jerárquica típica de una matriz de perfiles corporativa:

| Rol | Niveles autorizados |
|---|---|
| Becario | Público, Interno |
| Gerente | Público, Interno, Confidencial |
| Director | Público, Interno, Confidencial, Restringido |

## El set de preguntas y las dos condiciones

Se construyeron 62 preguntas, cada una con una respuesta verificable en un documento específico del corpus, divididas en dos tipos:

- **Tipo (a) — acceso legítimo** (18 preguntas): una pregunta por documento, evaluada contra el rol de menor jerarquía que ya tiene acceso autorizado a ese nivel. Mide si la mitigación introduce falsos negativos (negarle a alguien información a la que sí tiene derecho).
- **Tipo (b) — acceso no autorizado** (44 preguntas): para cada uno de los 8 documentos confidenciales o restringidos, entre 3 y 4 variantes de la misma pregunta de fondo, evaluadas contra cada rol que *no* tiene acceso a ese nivel (becario para confidencial y restringido; gerente para restringido). Esto supera el umbral de n≥40 preguntas tipo (b) que la metodología de la Semana 2 fijó como mínimo para que la prueba de McNemar tuviera poder razonable.

Cada una de esas 62 preguntas se corrió en dos condiciones, sobre el mismo pipeline de recuperación (TF-IDF con bigramas sobre los 18 documentos, validado para recuperar el documento correcto en el top-2 en 18 de 18 preguntas de prueba):

- **Condición A (baseline):** el retrieval busca sobre *todo* el corpus sin importar el nivel de acceso del usuario — el patrón más común en implementaciones RAG que no fueron diseñadas pensando en control de acceso desde el inicio.
- **Condición B (mitigación):** el retrieval filtra el conjunto de documentos candidatos a solo los niveles autorizados para el rol, *antes* de rankear por similitud — el patrón consciente de jurisdicción/confidencialidad del Capítulo 15/22.

## Cómo se define y mide "fuga"

Una respuesta del asistente se considera fuga cuando revela —completa o parcialmente— información que solo aparece en el documento restringido correspondiente a esa pregunta: una cifra, un plazo, una decisión específica que el usuario no podría conocer sin haber tenido acceso a ese documento. En vez de definir esto con coincidencia de palabras clave (frágil ante paráfrasis), se usó un segundo modelo como juez automatizado: recibe el documento restringido, la pregunta y la respuesta, y determina con un JSON estructurado si hubo fuga y por qué. Este es el mismo patrón de "LLM como juez" descrito en la metodología de la Semana 2, con la limitación que ya se señaló entonces: su precisión no se validó todavía contra una muestra anotada manualmente — eso queda pendiente para antes de reportar el resultado final en la Semana 4, y se documenta aquí como limitación explícita del diseño, no como un hecho resuelto.

Para las preguntas tipo (a), un juez equivalente evalúa si la respuesta es correcta, parcial o incorrecta/rechazada frente al contenido real del documento fuente — esta es la métrica que permitirá, en la Semana 5, cuantificar si el filtro de confidencialidad de la Condición B tiene un costo en utilidad para los usuarios con acceso legítimo.

## Qué ya existe, guardado para reproducibilidad

A diferencia de un resumen narrativo, todo lo necesario para reproducir este experimento quedó versionado en el repositorio, en `tesis-rag/experimento-1/`:

- `preguntas.py` y `trials.py`: la construcción completa del set de 62 preguntas y su asignación a roles.
- `rag.py`: el pipeline de recuperación (TF-IDF, condiciones A y B).
- `run_experimento.py`: el corredor que llama al modelo real y al juez automatizado.
- `resultados_crudos.jsonl`: las 62 respuestas crudas de ambas condiciones, con los veredictos del juez.
- `analisis.py`: el script de análisis estadístico (McNemar exacto + IC 95% Wilson) que las Semanas 4 y 5 usarán para reportar resultados.

## Qué sigue

La Semana 4 presentará los resultados de la Condición A frente a la Condición B para la tasa de fuga (H1), con la prueba de McNemar y los intervalos de confianza correspondientes. La Semana 5 presentará el costo en calidad de respuesta que introduce el filtro de confidencialidad en las preguntas de acceso legítimo. Ninguna de esas dos cifras se anticipa aquí: esta entrega documenta el diseño y confirma que los datos ya existen, no los resultados mismos.

## Fuentes

- González Siller, J. M. *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales* — Capítulos 15 y 22 (marco de clasificación de confidencialidad y marco regulatorio LATAM).
- Saltzer, J. H., & Schroeder, M. D. (1975). The protection of information in computer systems. *Proceedings of the IEEE*, 63(9), 1278–1308.
- Zheng, L., Chiang, W.-L., Sheng, Y., et al. (2023). Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. *arXiv:2306.05685*.
- [referencia pendiente de verificar] — literatura específica sobre control de acceso por niveles en pipelines RAG empresariales comerciales (Atlan, Tellius), citada de forma general en la Semana 2.
