# Persistencia no gobernada en sistemas RAG: medición de la fuga de confidencialidad y de la resurrección de datos eliminados

**Jesús Mario González Siller** · jgonzalez.app · Noviembre de 2026

*Documento consolidado de la serie de diez entregas semanales publicada en jgonzalez.app (27 de septiembre al 15 de noviembre de 2026). Todas las cifras provienen de los datos guardados en `tesis-rag/experimento-1/` y `tesis-rag/experimento-2/`; este documento no contiene resultados nuevos. Las entregas originales se conservan sin cambios; este texto las reordena, unifica su terminología y corrige o matiza lo indicado en el Anexo D.*

---

## Resumen

Los sistemas de generación aumentada por recuperación (RAG) suelen diseñarse pensando en el caso en que el usuario está autorizado y nada debe olvidarse. Esta tesis mide qué ocurre fuera de ese caso, en un corpus controlado de 18 documentos de una empresa ficticia (EIA Corp) y con el modelo `claude-haiku-4-5`. El Experimento 1 (H1) evalúa la fuga de información restringida a usuarios sin autorización: sin filtrado por nivel de acceso, 31 de 44 preguntas (70.5%, IC 95% [55.8%, 81.8%]) revelaron información restringida; con un filtro por nivel de acceso previo al ranking, 4 de 44 (9.1%, IC 95% [3.6%, 21.2%]); la diferencia es significativa (McNemar exacto, p = 1.12 × 10⁻⁷). El Experimento 2 (H2) evalúa si un dato "eliminado" sigue siendo recuperable a través de documentos derivados que lo citaban: con borrado simple del documento fuente resucitó en 11 de 12 trials (91.7%, IC 95% [64.6%, 98.5%]); con borrado más redacción en cascada de los derivados, en 0 de 12 (IC 95% [0%, 24.2%]); McNemar exacto p = 0.00098. Ninguna de las dos hipótesis fue refutada bajo el criterio de falsabilidad fijado de antemano, pero el alcance medido es más estrecho que el de la pregunta original: el Experimento 1 evaluó el filtrado en el retrieval, y el Experimento 2 una sola de las vías de persistencia planteadas (documentos derivados). Las muestras son pequeñas, el corpus es sintético y el juez y el modelo evaluado son el mismo.

**Palabras clave:** RAG, gobernanza de datos, confidencialidad, derecho al olvido, prueba de McNemar, falsabilidad.

---

## 1. Introducción y planteamiento del problema

Un sistema RAG recupera fragmentos de documentos relevantes para una consulta y se los entrega como contexto a un modelo generador (González Siller, 2026, cap. 5). La gobernanza de ese flujo —quién puede ver qué y qué ocurre cuando un dato debe dejar de existir— se implementa casi siempre como una capa añadida al flujo central y no como una propiedad de cada componente. La tesis de partida es que esa decisión de diseño deja rutas por las que la información sale de sus límites declarados.

El marco conceptual no es nuevo. Saltzer y Schroeder (1975) formularon el principio de *mediación completa*: todo acceso a todo objeto protegido debe verificarse contra el mecanismo de control vigente, sin excepciones por la ruta de entrada. Un componente agregado después para mejorar el rendimiento (un caché, una réplica) que hereda los datos protegidos sin heredar las reglas que los protegían viola ese principio. El modelo de confianza cero (Rose et al., 2020) lo expresa de otro modo: ningún componente debe considerarse confiable por su ubicación dentro de la arquitectura.

### 1.1 Estado del arte

La investigación sobre seguridad en RAG se concentra en dos frentes que no cubren exactamente este problema. El primero es la extracción de datos de entrenamiento (Carlini et al., 2021), que describe fugas desde los parámetros del modelo, no desde los componentes que lo rodean. El segundo es la inyección de prompts y el envenenamiento del contexto recuperado (Greshake et al., 2023; Zou et al., 2023), que supone un atacante activo. El campo más cercano es el *machine unlearning* (Bourtoule et al., 2021; Nguyen et al., 2022), centrado en eliminar la influencia de un dato de los pesos de un modelo. Hasta donde la revisión de la Semana 1 pudo verificar, no existía una medición empírica con diseño pareado y prueba de hipótesis formal de la persistencia de información tras una eliminación en los componentes auxiliares de un pipeline RAG. Esa afirmación describe los límites de una revisión no exhaustiva, no una certeza.

### 1.2 Contexto regulatorio

La pregunta es técnica, no jurídica, pero tiene contexto normativo. La LFPDPPP (2010) de México reconoce los derechos ARCO, entre ellos la Cancelación; la LGPD (2018) de Brasil reconoce en su artículo 18 la eliminación de datos tratados con consentimiento; la Ley 1581 de 2012 de Colombia establece un derecho de supresión; y el artículo 17 del Reglamento (UE) 2016/679 consagra el derecho de supresión en la Unión Europea. Las leyes convergen en una obligación sustantiva —eliminar de forma efectiva, no solo marcar como eliminado— pero ninguna especifica cómo verificar técnicamente que la eliminación fue efectiva en un sistema con varios almacenes de estado.

### 1.3 Alcance

Esta tesis no es una auditoría de cumplimiento normativo ni un ejercicio de *red teaming*: no hay atacante, solo usuarios legítimos con distintos niveles de autorización y solicitudes legítimas de eliminación. El resultado es una afirmación sobre una arquitectura, con números detrás, y no sobre si un sistema real incumple una ley.

### 1.4 Pregunta de investigación e hipótesis

La pregunta planteada en la Semana 1 fue: ¿en qué medida los componentes auxiliares de un pipeline RAG preservan información fuera de los límites de gobernanza definidos, ya sea por falta de autorización o por una solicitud de eliminación, y qué arquitecturas cierran esa fuga sin destruir la utilidad del sistema? Se descompuso en dos hipótesis:

- **H1 (fuga de confidencialidad):** un RAG sin metadatos de confidencialidad filtra información restringida a usuarios no autorizados a una tasa medible; un patrón consciente del nivel de acceso reduce esa tasa de forma significativa, a un costo cuantificable en calidad de respuesta legítima.
- **H2 (derecho al olvido):** tras una eliminación oficial, la información eliminada sigue siendo recuperable por al menos una vía indirecta a una tasa medible; la invalidación en cascada la reduce de forma significativa.

**Nota de alcance efectivamente medido.** La pregunta original hablaba de caché semántico, memoria de largo plazo e índice vectorial. Los experimentos no implementaron un caché semántico ni una memoria de largo plazo. El Experimento 1 puso a prueba el filtrado por nivel de acceso en el retrieval de un pipeline de recuperación simple. El Experimento 2 puso a prueba una única vía de persistencia: documentos derivados que citan el dato eliminado. Las conclusiones de este documento se limitan a eso.

---

## 2. Marco teórico

### 2.1 Gobernanza como propiedad estructural y no como capa

La hipótesis conceptual es que la causa de estas fugas es arquitectónica y no un error puntual. Cada componente auxiliar agregado a un pipeline para mejorar una métrica de rendimiento introduce una superficie nueva donde la gobernanza puede fallar, porque esa gobernanza no se diseñó como un invariante transversal. Si la causa fuera un error aislado, bastaría encontrar la línea de código y corregirla; si es estructural, la solución es diseñar la gobernanza como una propiedad que todo componente nuevo debe satisfacer antes de integrarse, la distinción entre seguridad como característica y como propiedad del sistema que señala la ingeniería de software segura (McGraw, 2006).

Existe un paralelo ilustrativo en las bases de datos relacionales: componentes añadidos por rendimiento, como las réplicas de lectura, pueden heredar datos protegidos sin heredar las reglas de acceso del nodo primario. Se presenta como analogía; esta tesis no aporta una cita verificada de incidentes específicos (véase el Anexo D). La revisión general de seguridad en bases de datos de Bertino y Sandhu (2005) se cita solo como marco del control de acceso.

### 2.2 Criterio de falsabilidad (fijado antes de los datos)

Siguiendo a Popper (1959), el criterio se fijó en la Semana 2, antes de ejecutar ningún experimento:

- **H1 se considera refutada** si la Condición B no reduce la tasa de fuga de forma estadísticamente significativa (p < 0.05, McNemar) respecto a la Condición A, o si la reduce a un costo de calidad en respuesta legítima tan alto que la mitigación resulte impracticable.
- **H2 se considera refutada** si la invalidación en cascada no reduce de forma significativa la tasa de resurrección por ninguna de las vías evaluadas (el criterio enumeró caché semántico y contexto de conversación), o si la tasa de resurrección en la Condición A es indistinguible de cero.

La serie se comprometió a reportar una refutación con el mismo detalle que una confirmación.

---

## 3. Metodología

### 3.1 Diseño pareado y pruebas estadísticas

Ambos experimentos usan un diseño pareado: las mismas preguntas (Experimento 1) o los mismos hechos (Experimento 2) se evalúan en la Condición A (sin mitigación) y en la B (con mitigación), lo que reduce la varianza atribuible a la dificultad de cada pregunta. Para datos binarios pareados se usa la prueba de McNemar (McNemar, 1947), en su variante exacta cuando los pares discordantes son pocos (Fagerland et al., 2013). Cada tasa se reporta con un intervalo de confianza del 95% de Wilson (Wilson, 1927) y con la diferencia de proporciones como tamaño de efecto.

### 3.2 Juez automatizado

La clasificación de las respuestas se hizo con un segundo llamado al mismo modelo (`claude-haiku-4-5`) como juez, que recibe el documento relevante, la pregunta y la respuesta y devuelve un veredicto estructurado, siguiendo el patrón de LLM como juez (Zheng et al., 2023). Su precisión no se validó contra una muestra anotada manualmente; esto es una limitación (sección 7).

### 3.3 Corpus y roles

El corpus del Experimento 1 son 18 documentos ficticios de EIA Corp, con cifras, plazos y decisiones específicas, clasificados en cuatro niveles: público (7), interno (3), confidencial (5) y restringido (3). Tres roles con accesos anidados: becario (público, interno), gerente (hasta confidencial) y director (todos los niveles).

### 3.4 Experimento 1

Se construyeron 62 preguntas: 18 de tipo (a), de acceso legítimo, para medir si la mitigación introduce rechazos indebidos, y 44 de tipo (b), de acceso no autorizado, con 3 a 4 variantes por cada uno de los 8 documentos confidenciales o restringidos, formuladas por cada rol sin acceso. Cada pregunta se corrió en dos condiciones sobre un mismo pipeline de recuperación (TF-IDF con bigramas):

- **Condición A (base):** el retrieval busca en todo el corpus sin considerar el nivel de acceso del usuario.
- **Condición B (mitigación):** el retrieval filtra los candidatos a los niveles autorizados para el rol antes de rankear por similitud.

Una respuesta cuenta como **fuga** si revela, total o parcialmente, información que solo aparece en el documento restringido correspondiente.

### 3.5 Experimento 2

Se crearon 4 documentos derivados (una minuta de comité directivo, un reporte de RH al Consejo, un reporte del comité de ética y un resumen ejecutivo de finanzas), cada uno con dos párrafos independientes: uno que repite de forma indirecta un hecho de un documento base (el hecho objetivo) y otro sobre un hecho distinto y no relacionado (el hecho seguro). Los cuatro hechos objetivo son una decisión de reestructura, un paquete de retención de talento, la conclusión de una investigación interna de conducta y una partida presupuestal de migración de IA. Hay 16 trials: 12 de tipo "b" (3 paráfrasis por hecho) y 4 de tipo "a" (una pregunta sobre el hecho seguro de cada derivado).

- **Condición A (borrado simple):** se elimina únicamente el documento base.
- **Condición B (cascada):** se elimina el documento base y se redacta, en cada derivado, exactamente el párrafo que repetía el hecho objetivo, sin tocar el resto.

Una respuesta cuenta como **resurrección** si revela de forma sustantiva el hecho eliminado, sin importar si la redacción coincide. Los trials de tipo "a" se evalúan solo bajo la Condición B y miden daño colateral.

---

## 4. Resultados del Experimento 1 (H1)

### 4.1 Fuga sin mitigación

De las 44 preguntas de tipo (b), 31 obtuvieron una respuesta que reveló información restringida: 70.5%, IC 95% [55.8%, 81.8%]. El límite inferior ya es una tasa mayoritaria. La causa no es una incapacidad del modelo: en la Condición A el retrieval no lleva metadatos de acceso ni filtro alguno, de modo que un documento confidencial semánticamente relevante llega al modelo igual que uno público. En un caso ilustrativo (registro `t020`, un becario preguntando por el máximo salarial de un director), el modelo entregó la cifra exacta y, en la misma respuesta, advirtió que el documento era confidencial: respondió primero y advirtió después. Tres de los ocho documentos sensibles fugaron en el 100% de sus variantes en la Condición A; por qué unos son más "filtrables" que otros quedó como pregunta abierta.

### 4.2 Efecto de la mitigación

En la Condición B, 4 de las 44 preguntas fugaron: 9.1%, IC 95% [3.6%, 21.2%]. Los intervalos de A y B no se tocan. La tabla pareada fue:

| | Fuga en B | Sin fuga en B |
|---|---|---|
| **Fuga en A** | 3 | 28 |
| **Sin fuga en A** | 1 | 12 |

McNemar exacto da p = 1.12 × 10⁻⁷ y la reducción absoluta es de 61.4 puntos porcentuales. Tres preguntas fugaron en ambas condiciones: el filtro no bastó, y la Semana 5 no analizó su mecanismo caso por caso. Una pregunta fugó solo en B, lo que probablemente refleja variabilidad de muestreo del modelo y no un efecto del filtro, aunque esto no se verificó.

### 4.3 Costo de calidad

En las 18 preguntas de acceso legítimo, la calidad fue de 14 de 18 respuestas correctas en la Condición A (77.8%, IC 95% [54.8%, 91.0%]) y 16 de 18 en la B (88.9%, IC 95% [67.2%, 96.9%]). Dos preguntas pasaron de parcial a correcta, probablemente por variabilidad del modelo y no porque el filtro mejore la precisión; las otras dos fueron incorrectas o rechazadas en ambas condiciones por causas ajenas a la mitigación (un falso rechazo a un director autorizado y un problema de fundamentación de la respuesta). Con n = 18, no puede descartarse un costo moderado que no se manifestó; sí puede decirse que el costo más temido, bloquear a alguien autorizado por efecto del filtro, no apareció.

---

## 5. Resultados del Experimento 2 (H2)

### 5.1 Resurrección

| Condición | Resurrección | Tasa | IC 95% (Wilson) |
|---|---|---|---|
| A: borrado simple | 11 de 12 | 91.7% | [64.6%, 98.5%] |
| B: borrado + cascada | 0 de 12 | 0% | [0%, 24.2%] |

La tabla pareada tiene 11 pares con resurrección en A y no en B, ninguno en sentido contrario y uno sin resurrección en ninguna condición. McNemar exacto da p = 0.00098. Por hecho, la resurrección bajo borrado simple fue de 3 de 3 (reestructura), 3 de 3 (retención de talento), 3 de 3 (investigación de conducta) y 2 de 3 (partida presupuestal); bajo la cascada fue de 0 en los cuatro. El par sin resurrección en A corresponde a una pregunta (qué área debe confirmar un cronograma) cuya respuesta correcta no contiene la cifra del hecho objetivo, por lo que no cuenta como evidencia a favor de la cascada. Con 12 trials, el límite superior del intervalo para 0 de 12 es 24.2%: la tasa observada es cero, pero no puede descartarse una tasa cercana a una cuarta parte.

### 5.2 Costo de la cascada sobre el contenido legítimo

El juez clasificó 2 de las 4 respuestas sobre hechos seguros como correctas, 1 como parcial y 1 como incorrecta o rechazada. Las respuestas crudas muestran que las objeciones del juez fueron de criterio: calificó como incorrecta una respuesta que confirmaba correctamente la renovación de un contrato de arrendamiento por 3 años porque "aparenta ser confidencial", y como parcial otra por citar el nombre del documento fuente. Una verificación determinista posterior (`verificacion_calidad.py`, sin juez LLM) comprueba si la respuesta contiene el dato literal del párrafo no tocado: las 4 respuestas lo contienen. El hallazgo se formula así: no se observó pérdida del dato legítimo en 4 de 4 casos. Esa verificación solo detecta presencia del dato, y 4 casos no permiten estimar una tasa; no se concluye que la cascada sea inocua.

---

## 6. Discusión

**H1.** La reducción de la fuga fue significativa y la calidad en acceso legítimo no empeoró en la corrida. Bajo el criterio de la Semana 2, H1 no fue refutada.

**H2.** Se cumplieron ambas condiciones de no refutación en la vía medida: la cascada redujo significativamente la resurrección y la tasa base no es indistinguible de cero. Pero el criterio enumeraba como vías el caché semántico y el contexto de conversación, y solo se evaluó una de las vías planteadas (documentos derivados). Por tanto, H2 no fue refutada en esa vía, y las otras quedan sin evaluar; afirmar que "H2 se confirmó" excede lo medido.

**Lectura común (interpretación, no hallazgo estadístico).** En ambos experimentos, un control aplicado solo en el punto más visible (el acceso al documento, el borrado del archivo) dejó la información accesible por otra ruta, y un control aplicado donde esa ruta existe la bloqueó. Ninguna prueba compara un experimento con el otro, y miden cosas distintas; la generalidad del patrón es una hipótesis razonable que estos datos no prueban. Tampoco debe leerse como cierre de la ruta: con el control activo quedaron 4 fugas de 44, y 3 de ellas también ocurrían sin él.

**Sobre la medición.** En el Experimento 2, el juez LLM y la verificación literal discreparon sobre la calidad de las mismas respuestas. Es una advertencia sobre la dependencia de un único instrumento de medición: los resultados de calidad de ambos experimentos descansan en un juez no calibrado.

---

## 7. Limitaciones

1. **Corpus sintético y pequeño.** Los documentos se escribieron para el experimento, con hechos limpios y derivados que los citan de forma directa; un corpus real es más ruidoso.
2. **Un solo modelo y un solo recuperador.** `claude-haiku-4-5` con TF-IDF. Otros modelos y recuperadores densos pueden comportarse distinto.
3. **Juez y modelo evaluado son el mismo modelo**, con rúbrica no calibrada y sin validación contra anotación manual.
4. **Tamaños de muestra pequeños.** 44 y 18 trials en el Experimento 1; 12 y 4 en el Experimento 2. Los intervalos son anchos, sobre todo en el segundo.
5. **Una sola corrida por trial**, sin repeticiones que midan la variabilidad del modelo.
6. **Vías de persistencia sin medir.** Caché semántico, memoria de largo plazo y contexto de conversación no se implementaron ni se evaluaron.
7. **Sin costo de adopción.** No se midió cuánto cuesta implementar estos controles en producción.
8. **Sin conclusión jurídica.** Ningún resultado establece si un sistema concreto incumple una ley de protección de datos.
9. **Mecanismo de las fugas residuales sin analizar.** Las 3 fugas que sobrevivieron al filtro no se examinaron caso por caso.

---

## 8. Conclusiones

1. En un pipeline RAG simple sin filtrado por nivel de acceso, la información restringida se filtró en el 70.5% de los intentos no autorizados (IC 95% [55.8%, 81.8%]). Con un filtro por nivel de acceso previo al ranking, la tasa bajó a 9.1% (p = 1.12 × 10⁻⁷), sin costo de calidad observado en 18 preguntas legítimas.
2. Con borrado simple del documento fuente, el dato eliminado siguió siendo recuperable en 11 de 12 trials a través de documentos derivados; con redacción en cascada de esos derivados, en 0 de 12 (p = 0.00098), sin pérdida observada del dato legítimo vecino en 4 de 4 casos.
3. Ninguna de las dos hipótesis fue refutada bajo el criterio fijado antes de los datos. H2 se evaluó solo en una de sus vías.
4. Los datos sostienen la tesis de que, en este corpus controlado, aplicar un control de gobernanza en un solo punto deja otras rutas abiertas. No sostienen que lo mismo ocurra en sistemas reales ni con otros modelos.
5. Un control reduce una tasa; no demuestra que la ruta quedó cerrada. Una arquitectura que adoptara estos controles necesitaría defensas adicionales para los casos residuales.

### 8.1 Trabajo futuro

- Réplica con corpus reales o de mayor tamaño y con otros modelos y recuperadores.
- Implementar y medir el caché semántico y la memoria de largo plazo, vías planteadas en H2 y no evaluadas.
- Validar el juez contra anotación manual y usar jueces de un modelo distinto al evaluado.
- Analizar caso por caso las fugas residuales de la Condición B.
- Medir el costo de adopción en ingeniería de los controles.

---

## Anexos

### Anexo A. Correspondencia con las entregas semanales

| Semana | Sección en el sitio | Contenido |
|---|---|---|
| 1 | Introducción y planteamiento | Problema, estado del arte, contexto regulatorio, hipótesis |
| 2 | Marco teórico y metodología | Gobernanza estructural, falsabilidad, diseño pareado, McNemar |
| 3 | Metodología | Diseño y ejecución del Experimento 1 |
| 4 | Resultados | Experimento 1, sin mitigación |
| 5 | Resultados | Experimento 1, con mitigación y costo de calidad |
| 6 | Metodología | Diseño del Experimento 2 |
| 7 | Resultados | Experimento 2, resultado principal |
| 8 | Resultados | Experimento 2, desglose por hecho y costo de calidad |
| 9 | Discusión | Contraste con el criterio de falsabilidad |
| 10 | Conclusiones | Este documento |

### Anexo B. Reproducibilidad

Todo el código y los datos están en el repositorio del sitio (jesusmariogonz/jesus-site):

- `tesis-rag/corpus/`: los 18 documentos base y los 4 documentos derivados.
- `tesis-rag/experimento-1/`: `preguntas.py`, `trials.py`, `rag.py`, `run_experimento.py`, `analisis.py`, `resultados_crudos.jsonl` (62 registros) y `resumen_estadistico.json`.
- `tesis-rag/experimento-2/`: `hechos.py`, `trials.py`, `rag2.py`, `run_experimento.py`, `analisis.py`, `verificacion_calidad.py`, `resultados_crudos.jsonl` (16 registros), `resumen_estadistico.json` y `verificacion_calidad.json`.
- Modelo: `claude-haiku-4-5-20251001`. Ejecutar los scripts requiere una credencial de la API de Anthropic.

### Anexo C. Tablas de datos

**Experimento 1 (n = 44 preguntas de tipo b).** Fuga en A: 31 (70.5%); fuga en B: 4 (9.1%); tabla pareada: ambos 3, solo A 28, solo B 1, ninguno 12; McNemar exacto p = 1.12 × 10⁻⁷. Calidad (n = 18): A 14, B 16.

**Experimento 2 (n = 12 trials de tipo b).**

| Hecho objetivo | Resurrección en A | Resurrección en B |
|---|---|---|
| Reestructura organizacional | 3 de 3 | 0 de 3 |
| Retención de talento | 3 de 3 | 0 de 3 |
| Investigación de conducta | 3 de 3 | 0 de 3 |
| Partida de migración de IA | 2 de 3 | 0 de 3 |
| **Total** | **11 de 12** | **0 de 12** |

**Experimento 2, hechos seguros (n = 4).** Juez LLM: 2 correctas, 1 parcial, 1 incorrecta o rechazada. Verificación literal: 4 de 4 contienen el dato esperado.

### Anexo D. Correcciones, ajustes y puntos a verificar

1. **Corrección del script del Experimento 2.** El script original no interpretaba el JSON del juez cuando venía en un bloque de código; se corrigió el parseo y se subió el límite de tokens del juez de 200 a 400. No se modificaron el diseño ni los trials.
2. **Lectura corregida entre las Semanas 7 y 8.** La Semana 7 reportó 2 de 4 respuestas correctas según el juez y sugirió que parte de las objeciones eran de criterio; la Semana 8 lo verificó con una comprobación determinista (4 de 4). Ambos datos se conservan.
3. **Alcance de H2.** La Semana 2 enumeró caché semántico y contexto de conversación como vías de H2; ninguna se evaluó (sección 1.4).
4. **Analogía de las réplicas de lectura (sección 2.1).** La Semana 2 la presentó con una cita de Bertino y Sandhu (2005) como si documentara incidentes específicos. Esa atribución no se verificó; aquí se presenta como analogía y la cita solo respalda el control de acceso en bases de datos en general.
5. **Referencias pendientes de verificar.** La literatura de proveedores de infraestructura (Atlan, Tellius) citada de forma general en las Semanas 1 y 2 no se verificó; el libro del autor figura como González Siller (2026) en las entregas (la Semana 6 lo citó como "González, J." con la marca pendiente de verificar). El caso *Google Spain* (2014), mencionado en la Semana 1, no se incluye en las referencias porque no se verificó una cita.
6. **Cita retirada.** La Semana 2 citó a Vickers (2005) como respaldo del diseño de medidas repetidas; ese artículo trata de pruebas paramétricas frente a no paramétricas en ensayos aleatorizados y no respalda directamente esa afirmación, por lo que se omite aquí.
7. **Preguntas abiertas sin responder en la serie:** por qué 3 de 8 documentos fugaron en el 100% de sus variantes; el mecanismo de las 3 fugas residuales.

---

## Referencias

Bertino, E., & Sandhu, R. (2005). Database security—concepts, approaches, and challenges. *IEEE Transactions on Dependable and Secure Computing*, *2*(1), 2–19.

Bourtoule, L., Chandrasekaran, V., Choquette-Choo, C. A., Jia, H., Travers, A., Zhang, B., Lie, D., & Papernot, N. (2021). Machine unlearning. *2021 IEEE Symposium on Security and Privacy (SP)*, 141–159.

Carlini, N., Tramèr, F., Wallace, E., Jagielski, M., Herbert-Voss, A., Lee, K., Roberts, A., Brown, T., Song, D., Erlingsson, Ú., Oprea, A., & Raffel, C. (2021). Extracting training data from large language models. *30th USENIX Security Symposium*.

Fagerland, M. W., Lydersen, S., & Laake, P. (2013). The McNemar test for binary matched-pairs data: mid-p and asymptotic are better than exact conditional. *BMC Medical Research Methodology*, *13*(1), 91.

González Siller, J. M. (2026). *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales*. [referencia pendiente de verificar]

Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz, M. (2023). Not what you've signed up for: Compromising real-world LLM-integrated applications with indirect prompt injection. *Proceedings of the 16th ACM Workshop on Artificial Intelligence and Security*.

Lei Geral de Proteção de Dados Pessoais [LGPD], Lei n.º 13.709. (2018). Diário Oficial da União, Brasil.

Ley 1581 de 2012, por la cual se dictan disposiciones generales para la protección de datos personales. (2012). Diario Oficial, Colombia.

Ley Federal de Protección de Datos Personales en Posesión de los Particulares [LFPDPPP]. (2010). Diario Oficial de la Federación, México.

McGraw, G. (2006). *Software Security: Building Security In*. Addison-Wesley.

McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, *12*(2), 153–157.

Nguyen, T. T., Huynh, T. T., Nguyen, P. L., Liew, A. W. C., Yin, H., & Nguyen, Q. V. H. (2022). A survey of machine unlearning. *arXiv preprint*.

Parlamento Europeo y Consejo de la Unión Europea. (2016). *Reglamento (UE) 2016/679 (Reglamento General de Protección de Datos)*, artículo 17.

Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson & Co.

Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). *Zero trust architecture* (NIST Special Publication 800-207). National Institute of Standards and Technology.

Saltzer, J. H., & Schroeder, M. D. (1975). The protection of information in computer systems. *Proceedings of the IEEE*, *63*(9), 1278–1308.

Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, *22*(158), 209–212.

Zheng, L., Chiang, W.-L., Sheng, Y., Zhuang, S., Wu, Z., Zhuang, Y., Lin, Z., Li, Z., Li, D., Xing, E. P., Zhang, H., Gonzalez, J. E., & Stoica, I. (2023). Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. *arXiv:2306.05685*.

Zou, A., Wang, Z., Kolter, J. Z., & Fredrikson, M. (2023). Universal and transferable adversarial attacks on aligned language models. *arXiv preprint*.
