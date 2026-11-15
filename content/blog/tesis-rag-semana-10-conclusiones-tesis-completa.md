---
titulo: 'Tesis · Semana 10: conclusiones y tesis completa'
fecha: 2026-11-15
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - conclusiones
  - gobernanza de datos
  - falsabilidad
  - EIA Corp
resumen: 'Décima y última entrega de la serie: las conclusiones de la tesis y el documento consolidado de las diez entregas, con anexos, referencias deduplicadas y una lista de las correcciones y los puntos sin verificar que dejó el proceso. Lo que se mostró es acotado: dos controles funcionaron en un corpus controlado, y la pregunta original era más amplia que lo medido.'
tesis: 'En un corpus sintético y con un solo modelo, un filtro por nivel de acceso y una cascada de redacción redujeron de forma significativa la fuga y la resurrección de información. Lo medido es una reducción, no un cierre de las rutas, y la pregunta original sobre cachés y memoria de largo plazo queda sin responder; la serie cumplió su compromiso de reportar lo que midió, incluidas sus propias correcciones.'
datosClave:
  - valor: '70.5% → 9.1%'
    etiqueta: 'Fuga de información restringida sin y con filtro por nivel de acceso (Experimento 1, 44 trials, McNemar exacto p = 1.12 × 10⁻⁷)'
    fuente: 'Experimento 1'
  - valor: '91.7% → 0%'
    etiqueta: 'Resurrección del dato eliminado con borrado simple y con cascada de redacción (Experimento 2, 12 trials, McNemar exacto p = 0.00098)'
    fuente: 'Experimento 2'
  - valor: '2 de 3 vías'
    etiqueta: 'Vías de persistencia de la pregunta original que los experimentos no evaluaron: caché semántico y contexto de conversación'
    fuente: 'Semana 2 y Experimento 2'
gancho: 'Diez semanas, dos experimentos, un resultado limpio y una lista honesta de lo que no sabemos. ¿Cuántos estudios sobre IA te dicen primero qué no pudieron medir?'
imagen: /blog/portadas/tesis-rag-semana-10-conclusiones-tesis-completa.jpg
postura:
  pregunta: 'Cuando una investigación publica en tiempo real y corrige sus propias lecturas entre una entrega y la siguiente, ¿eso la hace más confiable que una que solo publica un informe final, o debilita la solidez de sus conclusiones?'
  aFavor: 'La hace más confiable: fijar el criterio de falsabilidad antes de los datos y dejar a la vista cada corrección permite auditar cómo cambió la lectura de los resultados, algo que un informe final pulido oculta por diseño.'
  enContra: 'Debilita la solidez: publicar semana a semana empuja a presentar interpretaciones antes de que estén maduras, y que una lectura haya necesitado corregirse entre entregas muestra que las primeras conclusiones eran prematuras; un informe final revisado de una sola vez evita ese riesgo.'
---

Esta es la última entrega. Reúne las conclusiones de la tesis y publica el documento consolidado de las diez semanas: [tesis completa](/tesis-rag/tesis-completa.md), con resumen, marco teórico, metodología, resultados, discusión, limitaciones, anexos y referencias deduplicadas. Viene de la [Semana 9](/blog/tesis-rag-semana-09-discusion-dos-experimentos-un-patron), que contrastó ambos experimentos con el criterio de falsabilidad fijado en la Semana 2.

## Las conclusiones

1. **H1.** En un pipeline RAG simple sin filtrado por nivel de acceso, la información restringida se filtró en 31 de 44 intentos no autorizados (70.5%, IC 95% [55.8%, 81.8%]). Con un filtro por nivel de acceso previo al ranking, la tasa bajó a 4 de 44 (9.1%, IC 95% [3.6%, 21.2%]), con McNemar exacto p = 1.12 × 10⁻⁷ y sin costo de calidad observado en 18 preguntas legítimas.
2. **H2.** Con borrado simple del documento fuente, el dato eliminado siguió siendo recuperable en 11 de 12 trials a través de documentos derivados; con redacción en cascada de esos derivados, en 0 de 12 (McNemar exacto p = 0.00098), y en 4 de 4 casos revisados no se perdió el dato legítimo vecino.
3. **Falsabilidad.** Ninguna hipótesis fue refutada bajo el criterio fijado antes de los datos. H2 se evaluó solo en una de sus vías.
4. **Lo que sostienen los datos.** En este corpus controlado, aplicar un control de gobernanza en un único punto deja otras rutas abiertas, y aplicarlo donde esa ruta existe la bloquea. No sostienen que lo mismo ocurra en sistemas reales ni con otros modelos.
5. **Un control reduce; lo residual depende de la definición de fuga.** Con el filtro activo el documento restringido no llegó al contexto en ninguna de las 44 preguntas; las 4 respuestas clasificadas como fuga revelan metadatos de acceso, no su contenido.

## Lo que la serie no logró

La pregunta de la Semana 1 hablaba de caché semántico, memoria de largo plazo e índice vectorial. Los experimentos no implementaron los dos primeros: se midió el filtrado en el retrieval y la persistencia a través de documentos derivados. El documento consolidado lo deja explícito en una nota de alcance y en la lista de limitaciones: corpus sintético, un solo modelo y recuperador, juez y evaluado del mismo modelo sin validación manual, muestras pequeñas y sin medición del costo de adopción. Y ningún resultado establece si un sistema real incumple una ley de protección de datos.

## Correcciones que quedaron registradas

Revisar las diez entregas y los registros crudos para ensamblar el documento dejó anotadas, en su Anexo D, varias correcciones. Una corrige la Semana 5: el 9.1% residual de H1 no se debe a documentos restringidos que llegaran al contexto del modelo, porque no llegó ninguno. Otra: la Semana 2 respaldó una analogía sobre réplicas de bases de datos con una cita que no sostiene esa afirmación, y citó a Vickers (2005) para el diseño de medidas repetidas, que no lo respalda; ambas se omiten o se presentan como analogía en el consolidado. También quedan sin verificar algunas referencias generales (literatura de proveedores como Atlan y Tellius) y la ficha del libro que sirve de base técnica. Las entregas originales no se modificaron.

## Qué sigue

Los datos, el código y el documento consolidado están en el repositorio del sitio (`tesis-rag/`), de modo que cualquiera puede reproducir el análisis o desmentirlo. Las líneas de trabajo futuro son las vías no evaluadas, una réplica con corpus y modelos distintos, un juez validado contra anotación manual y el análisis de las fugas residuales.

## Fuentes

- Tesis completa: [tesis-completa.md](/tesis-rag/tesis-completa.md), con las referencias APA 7 consolidadas de las diez entregas.
- McNemar, Q. (1947). Note on the sampling error of the difference between correlated proportions or percentages. *Psychometrika*, 12(2), 153-157.
- Popper, K. (1959). *The Logic of Scientific Discovery*. Hutchinson & Co.
- Wilson, E. B. (1927). Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*, 22(158), 209-212.
