---
titulo: 'Solo 4.4% del almacenamiento empresarial está realmente en uso. El otro 95.6% es exactamente el tipo de dato que la IA necesita, y que nadie puede encontrar'
fecha: 2026-11-27
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - datos no estructurados
  - gobernanza de datos
  - dato oscuro
  - almacenamiento empresarial
  - IA empresarial
  - arquitectura de datos
  - CTERA
  - IDC
resumen: 'Un análisis de 16 petabytes de almacenamiento empresarial real, publicado por CTERA y analizado en una columna de AIwire/HPCwire el 18 de noviembre, encontró que solo 4.4% de la capacidad de almacenamiento de archivos está realmente activa. El 88.3% de los archivos no se ha tocado en más de un año. Es, casi en su totalidad, el mismo dato no estructurado que las empresas dicen necesitar para entrenar y alimentar sus propios sistemas de IA.'
tesis: 'Que solo 4.4% del almacenamiento de archivos analizado esté activo, y que 88.3% de los archivos no se haya tocado en más de un año, son hallazgos documentados de un análisis real de 16 petabytes; que esa combinación explique por qué tantas iniciativas de IA generativa empresarial no logran escalar más allá del piloto es una interpretación razonable del patrón, pero no algo que un solo estudio de almacenamiento, por representativo que sea su muestra, pueda demostrar de forma definitiva para toda la economía empresarial.'
datosClave:
  - valor: '4.4%'
    etiqueta: 'Porcentaje de la capacidad de almacenamiento de archivos empresariales que está realmente activa, según el análisis de 16 petabytes'
    fuente: 'CTERA, Cold Data Storage Report'
  - valor: '88.3%'
    etiqueta: 'Archivos que no se han tocado en más de un año, dentro de la misma muestra'
    fuente: 'CTERA'
  - valor: '80-90%'
    etiqueta: 'Proporción estimada de todos los datos empresariales que son no estructurados (contratos, correos, grabaciones, PDFs escaneados)'
    fuente: 'IDC, citado en AIwire/HPCwire'
gancho: 'Las empresas pagan por su almacenamiento más caro para guardar, en los hechos, un archivo congelado que nadie abre. Y ese archivo congelado es exactamente el dato que dicen necesitar para entrenar su propia IA.'
imagen: /blog/portadas/4-4-por-ciento-almacenamiento-empresarial-activo-dato-oscuro-ia.jpg
socialImagen: /blog/social/4-4-por-ciento-almacenamiento-empresarial-activo-dato-oscuro-ia.jpg
postura:
  pregunta: '¿El problema real que revela este estudio es que las empresas necesitan invertir en indexar y activar ese 95.6% de datos inactivos para aprovecharlos con IA, o es que gran parte de ese dato simplemente no tiene valor real que recuperar, y el verdadero error es seguir pagando por almacenarlo en vez de eliminarlo?'
  aFavor: 'Si una fracción incluso modesta de ese almacenamiento inactivo contiene información genuinamente valiosa para entrenar modelos propios o alimentar sistemas de búsqueda empresarial con IA generativa —contratos históricos, documentación de procesos, comunicaciones con clientes de años— el costo de indexarlo y hacerlo utilizable es mínimo comparado con el valor potencial de un activo de datos que, de otro modo, la competencia tendría que reconstruir desde cero.'
  enContra: 'La categoría "ROT" (redundante, obsoleto, trivial) que describe a la mayoría de ese almacenamiento inactivo no es una etiqueta arbitraria: datos que nadie ha tocado en años, en un entorno empresarial donde la mayoría de la información operativa relevante se consulta activamente, son datos con una probabilidad alta de ser copias duplicadas, versiones obsoletas o simplemente contenido sin ningún valor de negocio recuperable — invertir en indexar y gobernar indiscriminadamente ese volumen, antes de clasificar qué fracción realmente vale la pena, es gastar en activar lo que en su mayoría ya debería haberse depurado.'
---

Un análisis de 16 petabytes de almacenamiento empresarial real —856 escaneos de sistemas de archivos en entornos corporativos, incluyendo industrias reguladas—, publicado por la firma de almacenamiento CTERA y analizado en una columna de su director de tecnología en AIwire/HPCwire el 18 de noviembre, llegó a una cifra que vale la pena repetir dos veces para que se asiente: solo 4.4% de la capacidad de almacenamiento de archivos de las empresas analizadas está realmente activa. El 88.3% de los archivos no se ha tocado en más de un año. Las empresas, en los hechos, están pagando por su nivel de almacenamiento más costoso para mantener algo que funciona, en la práctica, como un archivo congelado.

## La cifra que convierte un problema de costos en un problema de IA

Si este hallazgo fuera solo sobre eficiencia de infraestructura, sería una nota de optimización de costos de TI, interesante pero limitada. Lo que lo convierte en un problema de otra naturaleza es lo que ese 95.6% de almacenamiento inactivo contiene: según estimaciones de IDC citadas en el mismo análisis, entre 80% y 90% de todos los datos empresariales son no estructurados —contratos, correos electrónicos, grabaciones de llamadas, documentos escaneados—, exactamente el tipo de material que las empresas dicen necesitar hoy para entrenar modelos propios, alimentar sistemas de búsqueda con IA generativa o construir agentes capaces de responder preguntas sobre el negocio real. La misma IDC proyecta que el universo de datos global casi se cuadruplicará entre 2024 y 2028, acercándose a 400 zettabytes, con esa misma proporción abrumadoramente no estructurada. El dato que las empresas más necesitan para su estrategia de IA es, en una proporción enorme, el mismo dato que llevan años sin tocar ni poder encontrar.

## Por qué "inactivo" no significa automáticamente "sin valor"

Es tentador leer esta cifra como una simple confirmación de que las empresas acumulan basura digital sin depurarla —y una fracción significativa, sin duda, lo es—. Pero "inactivo" en el sentido que mide este estudio —archivos que nadie ha abierto en más de un año— no es sinónimo de "sin valor recuperable". Un contrato legal de hace tres años, una serie de correos con un cliente que dejó de ser cliente, la documentación de un proceso que ya no se ejecuta de la misma forma: todo eso puede no haberse tocado en meses, y aun así contener exactamente el tipo de contexto histórico que un sistema de búsqueda empresarial con IA generativa podría usar para responder una pregunta que, sin ese archivo, requeriría que un empleado recordara algo que pasó hace años. La diferencia entre dato inactivo valioso y dato inactivo sin valor no se puede determinar por la sola ausencia de acceso reciente —se determina clasificando el contenido, algo que ningún sistema de almacenamiento hace por sí solo.

## El acrónimo que describe la otra posibilidad, la menos favorable

La categoría que usa la industria de gestión de datos para la fracción de almacenamiento inactivo que probablemente no vale la pena recuperar tiene un acrónimo ya establecido: ROT, por "redundante, obsoleto y trivial" (redundant, obsolete, trivial, en inglés). Es una categoría útil precisamente porque reconoce que no todo dato sin acceso reciente merece el mismo tratamiento: una copia duplicada de un archivo que ya existe en otro lugar del sistema, una versión obsoleta de un documento que ya se actualizó, o un archivo temporal que nunca debió conservarse más de unos días, son ejemplos de ROT genuino —datos que ocupan espacio costoso sin ofrecer ningún valor recuperable, ni siquiera histórico—. El reporte original de CTERA describe a la gran mayoría de ese almacenamiento inactivo bajo esta misma categoría, lo cual sugiere que, antes de invertir en hacer "accesible para IA" todo ese volumen, la pregunta más barata y más urgente es cuánto de él, simplemente, debería eliminarse.

## El costo que no se ve en ninguna factura de almacenamiento

Lo que este hallazgo revela, más allá del desperdicio evidente de pagar precios de almacenamiento premium por contenido que nadie consulta, es un costo de oportunidad que ninguna factura de infraestructura refleja directamente: cada mes que una empresa pasa sin clasificar ese 95.6% de almacenamiento inactivo es un mes en que cualquier iniciativa seria de IA generativa empresarial —un asistente interno que responda preguntas sobre el negocio, un sistema de búsqueda semántica sobre documentación histórica— tiene que construirse sobre una fracción mínima de la información real de la empresa, simplemente porque es la única parte indexada, clasificada y accesible. No es casualidad que tantas iniciativas de IA empresarial, documentadas repetidamente este año por distintas encuestas de adopción, lleguen a la fase de piloto con resultados prometedores y después se estanquen al intentar escalar: el piloto típico se construye sobre el 4.4% de datos ya activos y bien organizados, y escalar significa, inevitablemente, enfrentar el otro 95.6% que nadie ha tenido que tocar hasta ese momento.

## Lo que cambiaría si las empresas trataran esto como una decisión de arquitectura, no de limpieza

El marco correcto para abordar este problema no es un proyecto puntual de "limpieza de datos" —un esfuerzo que, por definición, termina cuando el presupuesto se acaba y el almacenamiento vuelve a acumular inactividad al ritmo natural de cualquier organización—, sino una decisión de arquitectura de datos recurrente: qué se indexa automáticamente en el momento en que se crea, qué política de clasificación determina si algo se conserva como activo potencialmente útil o se marca para eliminación, y quién es responsable de que esa clasificación no se abandone después del primer trimestre. Es, en esencia, el mismo tipo de gobernanza que las empresas ya aplican —con distintos niveles de rigor— a sus datos estructurados en bases de datos transaccionales, extendida a un universo de archivos que, hasta ahora, la mayoría de las organizaciones ha tratado como un espacio de almacenamiento pasivo en vez de como un activo de datos que requiere el mismo nivel de disciplina.

## La trampa de clasificar todo de golpe

Hay un error de secuencia que vale la pena anticipar antes de que cualquier organización decida actuar sobre este hallazgo: tratar la clasificación de 95.6% del almacenamiento inactivo como un proyecto único, de alcance total, que debe completarse antes de obtener ningún beneficio. Esa secuencia garantiza casi con certeza que el proyecto nunca termine, porque el volumen es, por definición, demasiado grande para abordarlo de una sola vez con el mismo rigor en todas sus partes. La alternativa más viable, y la que de hecho siguen las pocas organizaciones que han logrado convertir sus archivos no estructurados en un activo utilizable para IA, es priorizar por dominio de negocio específico —el histórico de contratos legales, por ejemplo, o las comunicaciones con un segmento de clientes— y tratar cada dominio como su propio proyecto de clasificación, indexación y gobernanza, en vez de esperar a tener todo el almacenamiento empresarial ordenado antes de construir el primer caso de uso real de IA sobre él.

## Por qué esto importa más ahora que hace cinco años

Hace cinco años, que 95.6% del almacenamiento de una empresa estuviera inactivo era, sobre todo, un problema de costos de infraestructura —relevante para el departamento de TI, pero marginal para la estrategia de negocio—. Lo que ha cambiado no es el volumen de datos inactivos en sí, sino el valor que repentinamente adquiere ese volumen en un contexto donde cualquier empresa que quiera construir IA genuinamente útil sobre su propio contexto de negocio necesita, precisamente, el tipo de material no estructurado que ese almacenamiento inactivo contiene. La pregunta que cada organización debería hacerse no es cuánto cuesta seguir pagando por ese archivo congelado, sino cuánto le está costando, en términos de qué tan limitada queda cualquier iniciativa de IA empresarial, seguir sin saber qué hay dentro de él.

La pregunta que queda, inevitablemente, para cualquier equipo de datos que lea esta cifra es menos técnica de lo que parece: no es "¿qué herramienta de indexación deberíamos comprar?", sino "¿quién en la organización tiene hoy la autoridad y el presupuesto para decidir qué parte de ese 95.6% vale la pena rescatar, y qué parte simplemente hay que dejar de pagar por guardar?". Mientras esa pregunta no tenga un dueño claro dentro de la empresa, el porcentaje seguirá siendo, en la práctica, un problema de nadie.

## Fuentes

- [The Ninety Percent Problem: Unlocking Value in Unstructured Data for Enterprises](https://www.hpcwire.com/aiwire/2026/11/18/the-ninety-percent-problem-unlocking-value-in-unstructured-data-for-enterprises/) — AIwire / HPCwire, Aron Brand (CTO, CTERA)
- [Most enterprise storage sits idle, CTERA study finds](https://itbrief.com.au/story/most-enterprise-storage-sits-idle-ctera-study-finds) — IT Brief
- [New CTERA Research Reveals Just 4.4% of Enterprise Storage is Actively Used](https://www.storagenewsletter.com/?p=305382) — Storage Newsletter
- [CTERA finds 95% of enterprise file data rarely used](https://www.blocksandfiles.com/file/2026/09/15/ctera-finds-95-of-enterprise-file-data-rarely-used/5296552) — Blocks & Files
