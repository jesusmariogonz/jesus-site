---
titulo: 'Tesis · Semana 1: Persistencia no gobernada en sistemas RAG — introducción y planteamiento del problema'
fecha: 2026-09-27
categoria: arquitectura
mundo: datos-como-negocio
serie: tesis-rag
tags:
  - tesis-rag
  - RAG
  - privacidad
  - derecho al olvido
  - gobernanza de datos
  - machine unlearning
  - LFPDPPP
resumen: 'Arranca una serie de 10 entregas semanales que documenta, con experimentos reales y pruebas de hipótesis, cuánta información sigue viva en un sistema RAG empresarial después de que la gobernanza dice que ya no debería estarlo. Semana 1: el problema, el estado del arte, el alcance, y por qué es medible y no solo un riesgo teórico.'
tesis: 'Los sistemas RAG empresariales que se documentan y venden como "gobernados" —con control de acceso, políticas de retención y mecanismos de eliminación— casi nunca someten a prueba empírica si esos controles realmente se sostienen en los componentes auxiliares del pipeline: el caché semántico, la memoria de largo plazo y el índice vectorial pueden preservar información fuera de esos límites de gobernanza sin que ningún log lo refleje, y esta tesis existe para medir esa fuga con números, no con intuición.'
datosClave:
  - valor: '10 semanas'
    etiqueta: 'Duración de la serie, publicada cada domingo — de introducción a documento de tesis consolidado'
  - valor: '2 hipótesis'
    etiqueta: 'H1 (fuga de confidencialidad) y H2 (falla del derecho al olvido), ambas falsables y sometidas a prueba estadística real'
  - valor: '3 componentes auxiliares'
    etiqueta: 'Caché semántico, memoria de largo plazo e índice vectorial — los puntos donde la gobernanza de un RAG suele dejar de aplicarse'
  - valor: '3 jurisdicciones'
    etiqueta: 'México (LFPDPPP), Brasil (LGPD) y Colombia (Ley 1581) — el marco regulatorio comparado que retoma esta tesis'
imagen: /blog/portadas/tesis-rag-semana-01-introduccion-planteamiento.jpg
---

Un sistema de generación aumentada por recuperación —RAG, por sus siglas en inglés (*retrieval-augmented generation*)— se diseña, casi siempre, pensando en el camino feliz: un usuario hace una pregunta, el sistema recupera los documentos relevantes, el modelo genera una respuesta fundamentada en esos documentos. Lo que ese diseño rara vez somete a prueba con el mismo rigor es qué pasa en los caminos que no son el feliz: qué pasa cuando el usuario que pregunta no tiene autorización para ver el documento que contiene la respuesta correcta, o qué pasa cuando un dato que un usuario pidió formalmente eliminar de un sistema de memoria sigue, técnicamente, disponible por una ruta que nadie diseñó para ser una puerta trasera pero que funciona como una. Esta serie —diez entregas semanales, publicadas cada domingo, que terminarán ensambladas en un documento de tesis único— existe para medir esas dos preguntas con datos reales, no con la intuición razonable de que "probablemente eso ya está resuelto".

## El problema, dicho sin eufemismos

Un pipeline RAG típico —el descrito en el Capítulo 5 del libro *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales* (González Siller, 2026), que sirve de base técnica a esta tesis— tiene un flujo central bien entendido: fragmentar documentos, generar embeddings, indexarlos en un almacén vectorial, recuperar los fragmentos relevantes para una consulta, y pasarlos como contexto al modelo generador. La gobernanza de ese flujo —quién puede ver qué, y qué pasa cuando algo debe dejar de existir— se implementa casi siempre como una capa que se le agrega al flujo central, no como una propiedad estructural de cada uno de sus componentes. El resultado es que componentes auxiliares diseñados para mejorar rendimiento o experiencia de usuario —un caché semántico que evita recalcular una respuesta ya dada a una pregunta parecida, una capa de memoria de largo plazo que recuerda contexto de conversaciones anteriores— quedan, con frecuencia, fuera del alcance de las reglas de acceso y de las rutinas de eliminación que sí se aplicaron al almacén de documentos principal. No es un error de diseño malintencionado: es la consecuencia previsible de tratar la gobernanza como un candado que se le pone a la puerta principal, sin revisar si hay ventanas abiertas en el resto del edificio.

Esta metáfora arquitectónica no es solo retórica: describe con precisión un patrón documentado en la literatura de seguridad de sistemas de información desde mucho antes de que existieran los modelos de lenguaje grandes. Saltzer y Schroeder (1975), en uno de los textos fundacionales de la seguridad informática, ya advertían que un sistema es tan seguro como su componente menos escrutado, y que los mecanismos de control de acceso añadidos como capa posterior al diseño original tienden a dejar exactamente los huecos que un diseño de "seguridad por construcción" (*security by design*) habría prevenido. Sesenta años de ingeniería de software han validado esa observación repetidamente en dominios distintos —bases de datos, sistemas operativos, arquitecturas de microservicios—; esta tesis argumenta que los sistemas RAG empresariales están reproduciendo, en 2026, el mismo error estructural, ahora con componentes auxiliares que ni siquiera existían cuando esa literatura se escribió.

## Estado del arte: qué sabemos y qué no sabemos todavía

La investigación académica y de la industria sobre seguridad en sistemas RAG ha crecido rápidamente desde 2023, pero se concentra casi por completo en dos frentes que dejan sin cubrir exactamente el problema que esta tesis mide. El primer frente es el de los ataques de extracción de datos de entrenamiento (*training data extraction*) sobre modelos de lenguaje, popularizado por Carlini et al. (2021), que demuestra que un modelo puede memorizar y regurgitar fragmentos de su corpus de entrenamiento. Ese hallazgo es relevante pero distinto: describe una fuga desde los *parámetros* del modelo, no desde los *componentes auxiliares* de un pipeline RAG que rodea a un modelo ya entrenado. El segundo frente es el de la inyección de prompts y el envenenamiento del contexto recuperado (Greshake et al., 2023; Zou et al., 2023), que estudia cómo un atacante externo puede manipular qué documentos se recuperan o qué instrucciones maliciosas viajan dentro de ellos. Ese problema —integridad del contexto recuperado— tampoco es el que aquí se investiga: esta tesis no asume un atacante activo inyectando contenido, sino un usuario legítimo del sistema, autenticado, cuya autorización es simplemente insuficiente para cierta información, o que ejerció un derecho legítimo de eliminación que el sistema no honró en todos sus componentes.

El campo más cercano al problema de esta tesis es el de *machine unlearning* —la disciplina técnica que estudia cómo eliminar la influencia de un dato específico de un modelo ya entrenado sin reentrenarlo desde cero (Bourtoule et al., 2021; Nguyen et al., 2022)—. Esa literatura, sin embargo, se enfoca casi exclusivamente en el problema de eliminar información de los *pesos* de un modelo, un problema computacionalmente distinto y mucho más estudiado que el de garantizar que un dato eliminado de un almacén de memoria RAG no reaparezca por una vía auxiliar como un caché o un historial de conversación. Hasta donde esta revisión ha podido verificar al momento de escribir esta entrega, no existe una medición empírica publicada, con diseño experimental pareado y prueba de hipótesis formal, de la tasa de persistencia de información después de una eliminación formal específicamente en los componentes auxiliares de un pipeline RAG empresarial. Esa ausencia —no la certeza de que el problema exista en una magnitud específica— es precisamente lo que esta tesis busca llenar: de ahí que el criterio de falsabilidad, formalizado en la Semana 2, contemple explícitamente la posibilidad de que los experimentos no encuentren el efecto que la pregunta de investigación anticipa.

## Por qué esto no es un riesgo hipotético

El Capítulo 15 del mismo libro documenta un caso de arquitectura de seguridad para RAG empresarial construido alrededor de "Enterprise Intelligence Agent" (EIA Corp), una compañía ficticia usada como caso transversal a lo largo del texto, con documentos internos clasificados por nivel de acceso —público, interno, confidencial, restringido— y roles de usuario con distintos privilegios. El Apéndice E describe una función `eliminar_memoria(usuario_id)` como el mecanismo formal para cumplir con una solicitud de eliminación de datos personales. Ambos mecanismos —control de acceso por nivel de confidencialidad, y eliminación formal de memoria— son exactamente el tipo de control que la regulación de protección de datos en América Latina exige de forma explícita.

Vale la pena detenerse en el detalle jurídico de esa exigencia, porque no es uniforme entre jurisdicciones y esa falta de uniformidad es en sí misma relevante para el diseño de sistemas que operan en más de un país de la región. La Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP, 2010) en México reconoce los derechos ARCO —Acceso, Rectificación, Cancelación y Oposición— como el mecanismo mediante el cual una persona ejerce su derecho a que sus datos personales sean eliminados; el derecho de Cancelación es, en la práctica, el equivalente funcional al "derecho al olvido" que esta tesis investiga técnicamente. La Lei Geral de Proteção de Dados Pessoais (LGPD, 2018) de Brasil, inspirada explícitamente en el Reglamento General de Protección de Datos europeo (GDPR), reconoce en su Artículo 18 el derecho a la eliminación de datos personales tratados con consentimiento, con una redacción más cercana al lenguaje del "derecho al olvido" que usa la jurisprudencia europea desde el caso *Google Spain* de 2014. La Ley 1581 de 2012 en Colombia establece, de forma análoga a México, un derecho de "supresión" del dato dentro de su propio catálogo de derechos del titular. Las tres leyes, con lenguaje distinto, convergen en la misma obligación sustantiva: cuando una persona ejerce ese derecho, la organización debe eliminar el dato de manera efectiva, no solo marcarlo como eliminado en un registro que sigue siendo consultable por otras vías. Esa obligación sustantiva —eliminación efectiva, no solo formal— es exactamente el punto donde la arquitectura técnica de un RAG con componentes auxiliares puede fallar sin que nadie lo note, porque ninguna de las tres leyes especifica *cómo* verificar técnicamente que la eliminación fue efectiva en un sistema con múltiples almacenes de estado.

El Capítulo 22 del libro cubre este marco regulatorio comparado con el detalle jurisdiccional que esta tesis retoma como contexto, no como objeto de estudio: la pregunta de investigación de esta serie es técnica, no jurídica, pero no puede formularse sin ese contexto porque es precisamente el que le da sentido práctico a medir la tasa de fuga con rigor estadístico en lugar de tratarla como una curiosidad de arquitectura.

## Alcance: qué mide esta tesis y qué no

Esta tesis no es una auditoría legal de cumplimiento normativo, ni pretende evaluar si EIA Corp —o cualquier empresa real— cumple con la LFPDPPP, la LGPD o la Ley 1581 en un sentido jurídico. Tampoco pretende ser una evaluación de seguridad ofensiva ni un ejercicio de *red teaming*: no hay un atacante en este diseño, solo usuarios legítimos del sistema con distintos niveles de autorización, y solicitudes legítimas de eliminación de datos. El alcance es técnico y empírico: construir una implementación real de un pipeline RAG con los componentes auxiliares descritos (caché semántico, memoria de largo plazo, índice vectorial), someterlo a escenarios controlados donde la gobernanza debería impedir un resultado específico —una fuga de confidencialidad, o la persistencia de un dato eliminado—, y medir con qué frecuencia esa gobernanza efectivamente falla, con qué costo se corrige, y bajo qué criterio de falsabilidad esas afirmaciones podrían resultar falsas. El resultado no es una afirmación sobre la ley: es una afirmación sobre la arquitectura, con números y significancia estadística detrás, que después se puede usar para argumentar qué tan lejos está una arquitectura técnica típica de lo que la ley exige en la práctica.

Dicho de otro modo: esta tesis no prueba que un sistema RAG específico incumple la LFPDPPP, la LGPD o la Ley 1581. Prueba —o refuta— que una arquitectura RAG con componentes auxiliares típicos, tal como se describe en la literatura técnica y en el libro que sirve de base, preserva información fuera de sus límites declarados de gobernanza a una tasa medible. La distancia entre esa afirmación técnica y una conclusión jurídica sobre un caso real queda, deliberadamente, fuera del alcance de este trabajo.

## La pregunta de investigación unificada

Formulada de manera explícita, la pregunta que organiza las diez semanas de esta serie es: ¿en qué medida los componentes auxiliares de un pipeline RAG —caché semántico, memoria de largo plazo, índice vectorial— preservan información fuera de los límites de gobernanza definidos, ya sea por falta de autorización o por una solicitud de eliminación, y qué arquitecturas cierran esa fuga sin destruir la utilidad del sistema? Esa pregunta se descompone en dos hipótesis falsables, cada una con su propio experimento dedicado en las semanas siguientes:

**H1 (fuga de confidencialidad):** un RAG sin metadatos de confidencialidad filtra información restringida a usuarios no autorizados a una tasa medible; el patrón consciente de jurisdicción/confidencialidad reduce esa tasa de forma estadísticamente significativa, a un costo cuantificable en calidad de respuesta para consultas legítimas (Semanas 3 a 5).

**H2 (derecho al olvido):** después de una eliminación oficial, la información "eliminada" sigue siendo recuperable por al menos una vía indirecta a una tasa medible; la invalidación en cascada al momento de la eliminación reduce esa tasa de forma estadísticamente significativa (Semanas 6 a 8).

Ambas comparten el mismo criterio de falsabilidad y el mismo aparato estadístico, que se formaliza en la Semana 2: diseño pareado, prueba de McNemar para datos binarios correlacionados, intervalos de confianza de Wilson para las proporciones observadas, y un tamaño de efecto reportado junto a cada significancia para evitar que una diferencia estadísticamente significativa pero sustantivamente pequeña se presente como si fuera equivalente a una diferencia grande.

## Por qué esta serie se publica en tiempo real, sin resultados adelantados

Una decisión editorial deliberada de esta serie es no escribir, en esta primera entrega, ninguna cifra de resultados: no existen todavía, porque los experimentos no se han corrido. Cada entrega de resultados (Semanas 4, 5, 7 y 8) reportará únicamente datos generados por código real ejecutado contra la API de Anthropic, con el script, el corpus y las respuestas crudas del modelo guardados en el repositorio para que cualquier lector pueda auditar el proceso completo, no solo la conclusión. Esa decisión responde directamente al problema que la tesis investiga: una afirmación de gobernanza que no se puede auditar es, estructuralmente, el mismo problema que un sistema RAG que promete cumplir reglas que en realidad no verifica. Publicar la investigación en tiempo real, entrega por entrega, con el diseño metodológico fijado antes de que existan los datos, es la misma disciplina que esta tesis le exige a la arquitectura que estudia: que las afirmaciones se puedan verificar, no solo creer.

La próxima entrega, dentro de una semana, formaliza el marco teórico y la metodología unificada de ambos experimentos, incluyendo el criterio de falsabilidad bajo el que se evaluará cada hipótesis.

## Referencias

Bourtoule, L., Chandrasekaran, V., Choquette-Choo, C. A., Jia, H., Travers, A., Zhang, B., Lie, D., & Papernot, N. (2021). Machine unlearning. *2021 IEEE Symposium on Security and Privacy (SP)*, 141–159.

Carlini, N., Tramèr, F., Wallace, E., Jagielski, M., Herbert-Voss, A., Lee, K., Roberts, A., Brown, T., Song, D., Erlingsson, Ú., Oprea, A., & Raffel, C. (2021). Extracting training data from large language models. *30th USENIX Security Symposium*.

González Siller, J. M. (2026). *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales*.

Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz, M. (2023). Not what you've signed up for: Compromising real-world LLM-integrated applications with indirect prompt injection. *Proceedings of the 16th ACM Workshop on Artificial Intelligence and Security*.

Ley Federal de Protección de Datos Personales en Posesión de los Particulares [LFPDPPP]. (2010). Diario Oficial de la Federación, México.

Lei Geral de Proteção de Dados Pessoais [LGPD], Lei n.º 13.709. (2018). Diário Oficial da União, Brasil.

Ley 1581 de 2012, por la cual se dictan disposiciones generales para la protección de datos personales. (2012). Diario Oficial, Colombia.

Nguyen, T. T., Huynh, T. T., Nguyen, P. L., Liew, A. W. C., Yin, H., & Nguyen, Q. V. H. (2022). A survey of machine unlearning. *arXiv preprint*.

Saltzer, J. H., & Schroeder, M. D. (1975). The protection of information in computer systems. *Proceedings of the IEEE*, 63(9), 1278–1308.

Zou, A., Wang, Z., Kolter, J. Z., & Fredrikson, M. (2023). Universal and transferable adversarial attacks on aligned language models. *arXiv preprint*.
