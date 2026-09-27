---
titulo: 'Tesis · Semana 2: Persistencia no gobernada en sistemas RAG — marco teórico y metodología unificada'
fecha: 2026-09-27
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - falsabilidad
  - metodología
  - diseño experimental
  - McNemar
  - privacidad
resumen: 'Segunda entrega de la serie: el marco teórico que sostiene la investigación (gobernanza como propiedad estructural, no como capa añadida), un recorrido más profundo por la literatura de control de acceso y aislamiento en sistemas de información, y la metodología unificada —diseño pareado, prueba de McNemar, criterio de falsabilidad popperiano— que se usará para poner a prueba las dos hipótesis de la Semana 1.'
tesis: 'Una hipótesis sobre gobernanza de datos que no especifica, antes de correr el experimento, qué resultado la refutaría no es una hipótesis científica sino una expectativa disfrazada; esta tesis fija ese criterio de falsabilidad para H1 y H2 antes de escribir una sola línea de código de los experimentos, precisamente para que los resultados de las semanas siguientes no puedan reinterpretarse después para siempre parecer una confirmación.'
datosClave:
  - valor: '1959'
    etiqueta: 'Año de publicación de "The Logic of Scientific Discovery" de Karl Popper, base del criterio de falsabilidad usado en esta tesis'
  - valor: 'Diseño pareado'
    etiqueta: 'Mismas preguntas/hechos evaluados en condición A (sin mitigación) y B (con mitigación) — permite aislar el efecto de la mitigación'
  - valor: 'McNemar'
    etiqueta: 'Prueba de hipótesis elegida para datos binarios pareados (fuga sí/no, resurrección sí/no) — no una t de Student ni una chi-cuadrada estándar'
  - valor: 'IC 95% (Wilson)'
    etiqueta: 'Método de intervalo de confianza elegido para proporciones, más robusto que el normal aproximado cuando la tasa observada es baja'
imagen: /blog/portadas/tesis-rag-semana-02-marco-teorico-metodologia.jpg
---

La primera entrega de esta serie planteó el problema: los componentes auxiliares de un pipeline RAG —caché semántico, memoria de largo plazo, índice vectorial— pueden preservar información fuera de los límites de gobernanza que el sistema dice respetar, sin que ningún log lo refleje, y situó ese problema dentro de un marco regulatorio comparado (LFPDPPP, LGPD, Ley 1581) y de un estado del arte académico que documenta problemas adyacentes —extracción de datos de entrenamiento, inyección de prompts, *machine unlearning*— sin cubrir exactamente esta pregunta. Esta segunda entrega no añade datos todavía —esos llegan a partir de la Semana 4—: profundiza el marco teórico que explica por qué ese problema es estructural, y fija la metodología unificada, con su criterio de falsabilidad, que gobernará el diseño de ambos experimentos.

## El marco teórico: gobernanza como propiedad estructural, no como capa

La literatura reciente sobre seguridad en sistemas RAG empresariales —Atlan, Tellius y otros proveedores de infraestructura de datos, citados en la Semana 1— coincide en un diagnóstico: la gobernanza de acceso y retención se diseña casi siempre como una capa que se superpone al flujo central de recuperación, no como una propiedad que cada componente del sistema debe satisfacer por construcción. Esa distinción —gobernanza como capa versus gobernanza como propiedad estructural— es el marco teórico que organiza esta tesis, y tiene un linaje conceptual más largo del que la conversación actual sobre IA suele reconocer.

El concepto de "mediación completa" (*complete mediation*), formulado por Saltzer y Schroeder (1975) como uno de los principios de diseño de sistemas seguros, establece que *todo* acceso a *todo* objeto protegido debe verificarse contra el mecanismo de control de acceso vigente, sin excepciones basadas en la ruta por la que llega la solicitud. La razón de ese principio, formulada explícitamente hace medio siglo, es casi una descripción anticipada del problema que esta tesis investiga: un sistema que verifica permisos en un punto de entrada pero no en las rutas secundarias que se le agregan después —cachés, réplicas, sistemas de respaldo— no cumple mediación completa, aunque cada componente individual, evaluado por separado, parezca funcionar correctamente. Un caché semántico agregado a un pipeline RAG para reducir latencia es, en estos términos, exactamente una ruta secundaria de acceso a información que el diseño original de control de acceso no contempló, porque ese diseño original se escribió pensando en el almacén principal de documentos, no en las optimizaciones que se agregarían después para mejorar una métrica de rendimiento.

Este marco tiene una segunda implicación que la Semana 1 solo insinuó: si la causa raíz es arquitectónica y no un error puntual, entonces el problema no se resuelve auditando componente por componente después de construidos —enfoque reactivo, costoso y necesariamente incompleto—, sino diseñando la propiedad de gobernanza como un invariante que cualquier componente nuevo debe satisfacer *antes* de integrarse al pipeline. Esa es, en esencia, la diferencia entre seguridad como característica (*feature*) y seguridad como propiedad del sistema (*system property*) que la literatura de ingeniería de software segura viene señalando desde hace décadas (McGraw, 2006), y que esta tesis traslada, con metodología experimental propia, al dominio específico de los pipelines RAG empresariales.

## Por qué esto no es simplemente "un bug que se corrige"

Un marco teórico útil no solo describe el problema: explica por qué no desaparece con parches puntuales. Si la causa raíz fuera un error de implementación aislado —una línea de código que olvidó verificar un permiso—, la solución sería trivial: encontrar esa línea y corregirla. La hipótesis de esta tesis es más incómoda: la causa es arquitectónica. Cada componente auxiliar que se agrega a un pipeline RAG para mejorar una métrica de rendimiento (latencia, costo, continuidad conversacional) introduce, por defecto, una superficie nueva donde la gobernanza puede fallar, porque esa gobernanza no se diseñó como una propiedad transversal del sistema sino como un control puntual en el punto de entrada. Esto implica que agregar más componentes auxiliares a un RAG —lo cual la industria sigue haciendo, porque cada uno mejora una métrica real— sin una disciplina explícita de gobernanza transversal, tiende a *aumentar* la superficie de fuga con el tiempo, no a mantenerla constante.

Esta dinámica tiene un paralelo instructivo en la historia de la seguridad de bases de datos relacionales: la adopción de réplicas de lectura (*read replicas*) para escalar el rendimiento de consultas, en los años 2000, produjo una ola documentada de incidentes donde las políticas de control de acceso por fila (*row-level security*) configuradas en la base primaria no se propagaban correctamente a las réplicas, dejando datos sensibles accesibles desde un nodo que el equipo de seguridad nunca auditó porque no sabía que existía como superficie de acceso independiente (Bertino & Sandhu, 2005). El paralelo no es casualidad: en ambos casos, un componente agregado por razones de rendimiento hereda implícitamente los datos protegidos del componente original sin heredar, con la misma fidelidad, las reglas que los protegían.

## Estado del arte en aislamiento y control de acceso en sistemas distribuidos

Vale la pena anclar este marco en un cuerpo de literatura algo más amplio que el citado en la Semana 1, específicamente el que estudia el aislamiento de datos en sistemas distribuidos con múltiples almacenes de estado —que es, en esencia, lo que un pipeline RAG con caché semántico, memoria de largo plazo e índice vectorial constituye—. El modelo de "confianza cero" (*zero trust*), formalizado por Rose et al. (2020) en la publicación especial 800-207 del NIST, parte de un principio directamente aplicable aquí: ningún componente de un sistema debe asumirse confiable por su ubicación dentro de la arquitectura; cada solicitud de acceso a un recurso debe autenticarse y autorizarse de forma explícita, independientemente de si esa solicitud viene del almacén de documentos principal o de un caché agregado después. La brecha que esta tesis mide es, en el lenguaje de ese marco, una violación operacional del principio de confianza cero: el caché semántico y la memoria de largo plazo de un RAG típico son, con frecuencia, componentes implícitamente confiables por estar "dentro" del sistema, sin que nadie haya verificado explícitamente que respetan las mismas reglas que el componente que sí fue auditado.

## El criterio de falsabilidad, fijado antes de los datos

Siguiendo el criterio popperiano (Popper, 1959): una teoría científica se distingue de una que no lo es por ser falsable, es decir, por especificar de antemano qué observación la refutaría. Aplicado a H1 y H2 de la Semana 1, el criterio de falsabilidad de esta tesis es el siguiente, fijado ahora, antes de correr un solo experimento:

**Para H1 (fuga de confidencialidad):** la hipótesis se considera refutada si la Condición B (con el patrón consciente de jurisdicción/confidencialidad) no reduce la tasa de fuga de forma estadísticamente significativa (p < 0.05, prueba de McNemar) respecto a la Condición A, o si la reduce pero a un costo de calidad de respuesta legítima tan alto que la mitigación resulte impracticable en producción (definido operacionalmente en la Semana 3 junto con el diseño completo del experimento).

**Para H2 (derecho al olvido):** la hipótesis se considera refutada si la invalidación en cascada no reduce de forma estadísticamente significativa la tasa de "resurrección" de información eliminada por ninguna de las vías indirectas evaluadas (caché semántico, contexto de conversación), o si la tasa de resurrección en la Condición A (baseline) resulta ser cero o estadísticamente indistinguible de cero —lo cual indicaría que el problema que esta tesis busca medir no existe en la magnitud que la pregunta de investigación asume.

Fijar esto ahora, antes de los datos, es lo que separa esta tesis de un ejercicio retórico que solo buscara confirmar una intuición ya sostenida. Vale la pena ser explícito sobre lo que está en juego si cualquiera de las dos hipótesis resulta refutada bajo este criterio: no sería un fracaso de la investigación, sería un hallazgo tan publicable como su confirmación, y esta serie se compromete, desde esta entrega, a reportarlo con el mismo nivel de detalle si eso ocurre.

## La metodología unificada: diseño pareado

Ambos experimentos comparten el mismo diseño experimental: **pareado**, no independiente. Esto significa que las mismas preguntas (Experimento 1) o los mismos hechos de memoria (Experimento 2) se evalúan en ambas condiciones —A (sin mitigación) y B (con mitigación)—, en vez de usar dos muestras distintas de preguntas para cada condición. La razón de esta elección metodológica es reducir la varianza atribuible a la dificultad intrínseca de cada pregunta: si una pregunta es particularmente difícil de proteger, ese efecto se cancela porque la misma pregunta se evalúa en ambas condiciones, y lo que queda es el efecto de la mitigación en sí misma, no una diferencia de composición entre dos muestras. Esta elección sigue la práctica estándar en estudios experimentales de sistemas de información donde el mismo insumo se somete a dos tratamientos —el equivalente, en el vocabulario de la estadística aplicada a ciencias de la salud, a un diseño de "medidas repetidas" o de "sujetos como su propio control" (Vickers, 2005), adaptado aquí de sujetos humanos a preguntas y hechos de memoria como unidad de análisis.

## Por qué McNemar y no una prueba más común

Para datos binarios pareados (cada pregunta resulta en "fuga" o "no fuga" en cada condición), la prueba estadísticamente correcta es la de **McNemar** (McNemar, 1947), no una prueba t de Student —que asume datos continuos, no binarios— ni una chi-cuadrada de independencia estándar —que asume observaciones independientes, no pareadas—. McNemar compara específicamente las discordancias: los casos donde la Condición A filtró y B no, contra los casos donde ocurrió lo inverso, y esa es exactamente la comparación que esta tesis necesita para atribuir el cambio en la tasa de fuga a la mitigación y no al azar de qué preguntas se sortearon en cada grupo. Cuando el número de discordancias sea pequeño (una situación plausible si la tasa de fuga de baseline resulta moderada y el corpus de preguntas no es enorme), esta tesis usará la variante exacta de McNemar en lugar de la aproximación chi-cuadrada, siguiendo la recomendación estándar de no confiar en la aproximación asintótica cuando el conteo de discordancias es bajo (Fagerland et al., 2013).

Junto con la significancia de McNemar, cada resultado reportará un **intervalo de confianza del 95%** de la tasa de fuga en cada condición, calculado con el método de Wilson (Wilson, 1927) —preferible al intervalo normal aproximado cuando la proporción observada puede ser baja o el tamaño de muestra moderado, que es exactamente el escenario esperado en ambos experimentos— y un tamaño de efecto (diferencia de proporciones), para que un resultado "estadísticamente significativo" con una diferencia sustantivamente pequeña no se presente como si fuera lo mismo que un resultado con una diferencia grande.

## Lo que esta metodología no puede responder

Ser honesto sobre los límites de un diseño metodológico es parte de aplicarlo con rigor, no una debilidad que conviene esconder hasta la sección de limitaciones. El diseño pareado con McNemar mide si la mitigación reduce la tasa de fuga o de resurrección en el corpus y las condiciones específicas de este experimento; no mide si esa reducción se generaliza a corpus de tamaño y complejidad distintos, a otros modelos de lenguaje, o a arquitecturas RAG que difieran sustancialmente de la descrita en el Capítulo 5 del libro que sirve de base técnica a esta tesis. Tampoco mide el costo de implementación de la mitigación en términos de ingeniería —cuánto esfuerzo real toma instrumentar un patrón consciente de jurisdicción/confidencialidad en un sistema productivo—, una pregunta legítima pero fuera del alcance de un diseño que mide eficacia, no costo de adopción. Esa generalización —o su ausencia— es exactamente el tipo de limitación que la Semana 10 debe nombrar explícitamente, no minimizar.

La siguiente entrega, dentro de una semana, presenta el diseño completo del Experimento 1: el corpus ampliado de EIA Corp, los roles simulados, el conjunto de preguntas y el criterio operacional para medir tanto la fuga de confidencialidad como el costo en calidad de respuesta legítima. Ese diseño debe quedar completo y ejecutable antes de que la Semana 4 reporte un solo número.

## Referencias

Bertino, E., & Sandhu, R. (2005). Database security—concepts, approaches, and challenges. *IEEE Transactions on Dependable and Secure Computing*, 2(1), 2–19.

Fagerland, M. W., Lydersen, S., & Laake, P. (2013). The McNemar test for binary matched-pairs data: mid-p and asymptotic are better than exact conditional. *BMC Medical Research Methodology*, 13(1), 91.

González Siller, J. M. (2026). *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales*.

McGraw, G. (2006). *Software Security: Building Security In*. Addison-Wesley.

McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153–157.

Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson & Co.

Rose, S., Borchert, O., Mitchell, S., & Connelly, S. (2020). *Zero trust architecture* (NIST Special Publication 800-207). National Institute of Standards and Technology.

Saltzer, J. H., & Schroeder, M. D. (1975). The protection of information in computer systems. *Proceedings of the IEEE*, 63(9), 1278–1308.

Vickers, A. J. (2005). Parametric versus non-parametric statistics in the analysis of randomized trials with non-normally distributed data. *BMC Medical Research Methodology*, 5(1), 35.

Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209–212.
