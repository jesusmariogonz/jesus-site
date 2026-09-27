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
resumen: 'Segunda entrega de la serie: el marco teórico que sostiene la investigación (gobernanza como propiedad estructural, no como capa añadida) y la metodología unificada —diseño pareado, prueba de McNemar, criterio de falsabilidad popperiano— que se usará para poner a prueba las dos hipótesis de la Semana 1.'
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

La primera entrega de esta serie planteó el problema: los componentes auxiliares de un pipeline RAG —caché semántico, memoria de largo plazo, índice vectorial— pueden preservar información fuera de los límites de gobernanza que el sistema dice respetar, sin que ningún log lo refleje. Esta segunda entrega no añade datos todavía —esos llegan a partir de la Semana 4—: fija el marco teórico que explica por qué ese problema es estructural, y la metodología unificada, con su criterio de falsabilidad, que gobernará el diseño de ambos experimentos.

## El marco teórico: gobernanza como propiedad estructural, no como capa

La literatura reciente sobre seguridad en sistemas RAG empresariales —Atlan, Tellius y otros proveedores de infraestructura de datos, citados en la Semana 1— coincide en un diagnóstico: la gobernanza de acceso y retención se diseña casi siempre como una capa que se superpone al flujo central de recuperación, no como una propiedad que cada componente del sistema debe satisfacer por construcción. Esa distinción —gobernanza como capa versus gobernanza como propiedad estructural— es el marco teórico que organiza esta tesis. Un componente auxiliar como un caché semántico se diseña, casi siempre, optimizando exclusivamente latencia y costo de cómputo; la pregunta de si ese caché respeta los mismos límites de acceso que el almacén de documentos principal rara vez forma parte de su especificación original. El resultado, previsible desde este marco, es que la gobernanza "funciona" en el camino feliz —la consulta llega al almacén de documentos, que sí aplica permisos— y falla silenciosamente en cualquier camino que no pase por ese almacén.

## Por qué esto no es simplemente "un bug que se corrige"

Un marco teórico útil no solo describe el problema: explica por qué no desaparece con parches puntuales. Si la causa raíz fuera un error de implementación aislado —una línea de código que olvidó verificar un permiso—, la solución sería trivial: encontrar esa línea y corregirla. La hipótesis de esta tesis es más incómoda: la causa es arquitectónica. Cada componente auxiliar que se agrega a un pipeline RAG para mejorar una métrica de rendimiento (latencia, costo, continuidad conversacional) introduce, por defecto, una superficie nueva donde la gobernanza puede fallar, porque esa gobernanza no se diseñó como una propiedad transversal del sistema sino como un control puntual en el punto de entrada. Esto implica que agregar más componentes auxiliares a un RAG —lo cual la industria sigue haciendo, porque cada uno mejora una métrica real— sin una disciplina explícita de gobernanza transversal, tiende a *aumentar* la superficie de fuga con el tiempo, no a mantenerla constante.

## El criterio de falsabilidad, fijado antes de los datos

Siguiendo el criterio popperiano (Popper, 1959): una teoría científica se distingue de una que no lo es por ser falsable, es decir, por especificar de antemano qué observación la refutaría. Aplicado a H1 y H2 de la Semana 1, el criterio de falsabilidad de esta tesis es el siguiente, fijado ahora, antes de correr un solo experimento:

**Para H1 (fuga de confidencialidad):** la hipótesis se considera refutada si la Condición B (con el patrón consciente de jurisdicción/confidencialidad) no reduce la tasa de fuga de forma estadísticamente significativa (p < 0.05, prueba de McNemar) respecto a la Condición A, o si la reduce pero a un costo de calidad de respuesta legítima tan alto que la mitigación resulte impracticable en producción (definido operacionalmente en la Semana 3 junto con el diseño completo del experimento).

**Para H2 (derecho al olvido):** la hipótesis se considera refutada si la invalidación en cascada no reduce de forma estadísticamente significativa la tasa de "resurrección" de información eliminada por ninguna de las vías indirectas evaluadas (caché semántico, contexto de conversación), o si la tasa de resurrección en la Condición A (baseline) resulta ser cero o estadísticamente indistinguible de cero —lo cual indicaría que el problema que esta tesis busca medir no existe en la magnitud que la pregunta de investigación asume.

Fijar esto ahora, antes de los datos, es lo que separa esta tesis de un ejercicio retórico que solo buscara confirmar una intuición ya sostenida.

## La metodología unificada: diseño pareado

Ambos experimentos comparten el mismo diseño experimental: **pareado**, no independiente. Esto significa que las mismas preguntas (Experimento 1) o los mismos hechos de memoria (Experimento 2) se evalúan en ambas condiciones —A (sin mitigación) y B (con mitigación)—, en vez de usar dos muestras distintas de preguntas para cada condición. La razón de esta elección metodológica es reducir la varianza atribuible a la dificultad intrínseca de cada pregunta: si una pregunta es particularmente difícil de proteger, ese efecto se cancela porque la misma pregunta se evalúa en ambas condiciones, y lo que queda es el efecto de la mitigación en sí misma, no una diferencia de composición entre dos muestras.

## Por qué McNemar y no una prueba más común

Para datos binarios pareados (cada pregunta resulta en "fuga" o "no fuga" en cada condición), la prueba estadísticamente correcta es la de **McNemar**, no una prueba t de Student —que asume datos continuos, no binarios— ni una chi-cuadrada de independencia estándar —que asume observaciones independientes, no pareadas—. McNemar compara específicamente las discordancias: los casos donde la Condición A filtró y B no, contra los casos donde ocurrió lo inverso, y esa es exactamente la comparación que esta tesis necesita para atribuir el cambio en la tasa de fuga a la mitigación y no al azar de qué preguntas se sortearon en cada grupo. Junto con la significancia de McNemar, cada resultado reportará un **intervalo de confianza del 95%** de la tasa de fuga en cada condición, calculado con el método de Wilson —preferible al intervalo normal aproximado cuando la proporción observada puede ser baja o el tamaño de muestra moderado, que es exactamente el escenario esperado en ambos experimentos— y un tamaño de efecto (diferencia de proporciones), para que un resultado "estadísticamente significativo" con una diferencia sustantivamente pequeña no se presente como si fuera lo mismo que un resultado con una diferencia grande.

## Lo que esta metodología no puede responder

Ser honesto sobre los límites de un diseño metodológico es parte de aplicarlo con rigor, no una debilidad que conviene esconder hasta la sección de limitaciones. El diseño pareado con McNemar mide si la mitigación reduce la tasa de fuga o de resurrección en el corpus y las condiciones específicas de este experimento; no mide si esa reducción se generaliza a corpus de tamaño y complejidad distintos, a otros modelos de lenguaje, o a arquitecturas RAG que difieran sustancialmente de la descrita en el Capítulo 5 del libro que sirve de base técnica a esta tesis. Esa generalización —o su ausencia— es exactamente el tipo de limitación que la Semana 10 debe nombrar explícitamente, no minimizar.

La siguiente entrega, dentro de una semana, presenta el diseño completo del Experimento 1: el corpus ampliado de EIA Corp, los roles simulados, el conjunto de preguntas y el criterio operacional para medir tanto la fuga de confidencialidad como el costo en calidad de respuesta legítima. Ese diseño debe quedar completo y ejecutable antes de que la Semana 4 reporte un solo número.

## Referencias

Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson & Co.

González Siller, J. M. (2026). *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales*.

McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153–157.

Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209–212.
