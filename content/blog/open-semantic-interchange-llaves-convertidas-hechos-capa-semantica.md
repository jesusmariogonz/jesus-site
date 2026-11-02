---
titulo: 'La fórmula cruzó de un sistema a otro. Las llaves que unían las tablas, no'
fecha: 2026-11-02
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - capa semántica
  - Open Semantic Interchange
  - Apache Ossie
  - Snowflake
  - dbt
  - gobernanza de datos
  - interoperabilidad
  - métricas de negocio
resumen: 'Una prueba publicada el 19 de octubre mostró que Apache Ossie —el formato abierto que Snowflake y más de 50 organizaciones impulsan para que dos sistemas de datos compartan la misma definición de una métrica— logró transportar correctamente la fórmula de un ingreso, pero convirtió las llaves que unían las tablas en simples cifras. La fórmula sobrevivió el viaje; la estructura relacional que la sostenía, no.'
tesis: 'Que Apache Ossie haya transportado correctamente la fórmula de una métrica mientras degradaba las llaves relacionales a datos sueltos es un resultado documentado en una prueba técnica específica, con una versión temprana (0.1.1) del estándar; que ese resultado demuestre que la interoperabilidad semántica entre sistemas de datos es, en general, una promesa prematura es una interpretación razonable dado el estado actual del proyecto, pero no una conclusión que una sola prueba, sobre un estándar todavía en incubación, pueda sostener por sí sola para siempre.'
datosClave:
  - valor: '0.1.1 → 0.2.0.dev0'
    etiqueta: 'Salto de versión del formato Apache Ossie entre lo que generó dbt Core y lo que aceptó el convertidor de Snowflake en la prueba'
    periodo: '18-19 de octubre de 2026'
    fuente: 'Querio'
  - valor: '50+ organizaciones'
    etiqueta: 'Empresas y proyectos que participan en Apache Ossie (antes Open Semantic Interchange), incubado en Apache desde julio de 2026'
    fuente: 'Snowflake / Apache Incubator'
  - valor: '2 llaves degradadas'
    etiqueta: 'order_id y customer, las columnas que unían las dos tablas de prueba, terminaron clasificadas como "hechos" (cifras), no como llaves relacionales'
    periodo: '19 de octubre de 2026'
    fuente: 'Querio'
imagen: /blog/portadas/open-semantic-interchange-llaves-convertidas-hechos-capa-semantica.jpg
socialImagen: /blog/social/open-semantic-interchange-llaves-convertidas-hechos-capa-semantica.jpg
gancho: 'Dos sistemas de datos finalmente pueden compartir la fórmula de "ingresos". El problema es que, en la primera prueba real, uno de los dos terminó pensando que el identificador del cliente era una cifra de ventas. ¿Cuánta confianza puede tener una empresa en un dato que ya no sabe si es un identificador o un número?'
postura:
  pregunta: '¿Deberían las empresas de datos pausar sus planes de adoptar Apache Ossie hasta que el estándar madure, o es razonable empezar a construir sobre él ahora, aceptando que las primeras versiones de cualquier formato de interoperabilidad tienen fricciones de este tipo?'
  aFavor: 'Ningún estándar de interoperabilidad nace maduro —SQL, HTTP y el propio dbt tuvieron años de versiones imperfectas antes de volverse confiables—, y una empresa que empieza a experimentar con Ossie ahora, en proyectos de bajo riesgo, acumula experiencia operativa real antes que sus competidores, justo cuando el estándar todavía está definiendo sus reglas y una voz temprana en ese proceso vale más que la comodidad de esperar a que "ya esté listo".'
  enContra: 'Una capa semántica no es un formato de archivo cualquiera: es la fuente de verdad sobre qué significa cada columna para el negocio, y un error de clasificación como convertir una llave relacional en un hecho no es un bug cosmético — es el tipo de falla que, si pasa desapercibida en producción, corrompe silenciosamente cualquier reporte o modelo de IA que dependa de esa capa; frente a ese riesgo, la prudencia dicta esperar a una versión estable antes de poner datos de negocio reales sobre un convertidor que su propio equipo de desarrollo advierte, en su documentación, que "no ha sido probado exhaustivamente contra todos los casos borde".'
---

Una métrica de ingresos cruzó, sin cambios, de un sistema de datos a otro. Las dos columnas que conectaban las tablas que esa métrica necesitaba para tener sentido no lo hicieron: llegaron del otro lado clasificadas como simples cifras, no como las llaves relacionales que eran. Esa es la conclusión central de una prueba publicada el 19 de octubre por Querio, una de las primeras evaluaciones prácticas y documentadas de Apache Ossie —el formato abierto, antes llamado Open Semantic Interchange, que Snowflake y más de cincuenta organizaciones impulsan desde 2025 para resolver un problema específico: que dos sistemas de datos distintos dejen de mantener, cada uno por su cuenta, una copia separada —y potencialmente distinta— de la misma definición de negocio.

## Un estándar abierto para que dos sistemas dejen de llevar la cuenta por separado

El problema que Ossie intenta resolver es conocido por cualquiera que haya trabajado con más de una herramienta de datos en la misma organización: la palabra "ingresos" puede significar una suma distinta en el tablero de Looker, en el modelo de dbt y en la vista semántica de Snowflake, porque cada herramienta guarda su propia definición, en su propio formato, sin que ninguna de las tres sepa que las otras existen. Snowflake lanzó Open Semantic Interchange en septiembre de 2025 junto con dbt Labs, Salesforce, Omni, Sigma, ThoughtSpot y otros, con la idea de crear un formato común —un archivo que cualquier sistema pudiera leer y escribir— para que la definición de una métrica viajara entre herramientas sin tener que reescribirse cada vez. En julio de 2026 el proyecto entró a la incubadora de la Fundación Apache bajo el nombre Apache Ossie, con más de cincuenta organizaciones involucradas.

La promesa, en el papel, es sencilla de entender: un equipo de analítica define "ingresos" una sola vez, en un archivo Ossie, y ese archivo se convierte automáticamente a lo que cada sistema —Snowflake, dbt, cualquier otra herramienta que adopte el estándar— necesita para operar con esa definición. Se acaba, en teoría, el problema de que dos sistemas lleven la cuenta por separado.

## La prueba que nadie había hecho públicamente hasta el 19 de octubre

Lo que hizo distinto el ejercicio de Querio es que, en lugar de describir la promesa del estándar, la puso a prueba con un caso mínimo pero real: dos tablas —órdenes y clientes— conectadas por llaves, con una métrica de ingresos definida en dbt mediante MetricFlow, el framework de métricas de dbt Labs. El objetivo era simple: tomar esa definición, convertirla a un archivo Ossie, y ver si Snowflake podía leerla e importarla como una vista semántica propia, sin que nadie tuviera que reescribir nada a mano.

El primer obstáculo fue de versiones: dbt Core 1.12.6 generó un archivo Ossie en la versión 0.1.1 del estándar, pero el convertidor de Snowflake solo aceptaba la versión 0.2.0.dev0 —un recordatorio de que, siete meses después de publicarse la especificación 1.0, el ecosistema de herramientas que dicen hablar "el mismo idioma" todavía no coincide exactamente en qué dialecto de ese idioma habla cada una. Una vez resuelto ese desajuste, la fórmula de la métrica sí llegó intacta al otro lado: "ingresos" se tradujo correctamente a la suma del monto de cada orden, exactamente como se había definido en dbt.

## Por qué una llave convertida en un hecho no es un detalle menor

El problema apareció en las columnas que no son la métrica en sí, sino la estructura que la rodea. `order_id` y `customer` —las dos columnas que le dicen a cualquier sistema cómo unir la tabla de órdenes con la de clientes— llegaron del otro lado clasificadas como "hechos": en el vocabulario de Snowflake, un hecho es una cifra a nivel de fila, el tipo de dato que responde a "cuánto" o "cuántos", no un identificador que conecta una tabla con otra. Es el equivalente a que un sistema reciba el número de cuenta bancaria de un cliente y lo trate como si fuera un monto de dinero, en lugar de un identificador.

La consecuencia práctica no es cosmética. Una vista semántica le dice al sistema que la consulta cómo relacionar las tablas para que una pregunta de negocio —"¿cuánto gastó este cliente en total?"— produzca la respuesta correcta sin que quien pregunta tenga que escribir el SQL de unión a mano. Si la columna que debía indicar esa relación llega marcada como un simple número, el sistema ya no sabe, por sí mismo, cómo conectar las tablas: alguien tiene que corregir el archivo manualmente antes de que las consultas vuelvan a unir correctamente. El propio archivo README del convertidor que se usó en la prueba lo advierte: no ha sido probado exhaustivamente contra todos los casos borde, y se recomienda precaución en producción.

## La diferencia entre portar una fórmula y portar un significado

Hay una distinción que esta prueba vuelve visible con más claridad que cualquier descripción abstracta del estándar: transportar la fórmula de una métrica —la suma, el promedio, el filtro que la define— es un problema mucho más simple que transportar el significado relacional completo de un modelo de datos. La fórmula es, en esencia, una expresión matemática con nombres de columnas; el significado relacional incluye qué columnas son identificadores, cómo se conectan las tablas entre sí, qué cardinalidad tiene cada relación, y qué pasa cuando esas reglas no se preservan exactamente en la traducción.

Apache Ossie, en su estado actual, resuelve bien el primer problema y todavía no resuelve de forma confiable el segundo. Es una distinción importante porque la mayoría de los anuncios de este tipo de estándares —y buena parte de la cobertura que los acompaña— se enfoca en demostrar que "la métrica se puede compartir", sin profundizar en si la estructura relacional que hace que esa métrica sea calculable correctamente también sobrevive el viaje. La prueba de Querio es, hasta donde se pudo confirmar, de las primeras en documentar públicamente esa brecha con un ejemplo reproducible.

## El patrón que ya se vio antes con otros "estándares abiertos" de datos

Nada de esto es exclusivo de Ossie. La historia reciente de la ingeniería de datos está llena de formatos "abiertos" que, en su primera generación, resolvían el caso simple y dejaban sin resolver el caso relacional completo —desde los primeros intentos de portabilidad de esquemas entre bases de datos relacionales distintas, hasta los formatos de intercambio de modelos de machine learning que durante años tuvieron fama de "funcionar para el ejemplo del tutorial, romperse en el modelo real de producción". El patrón se repite porque el caso simple es el que primero se puede demostrar en una presentación, y el caso relacional completo es el que primero aparece cuando alguien, como en este caso, se toma el tiempo de probarlo con datos reales en lugar de con el ejemplo de la documentación.

Eso no invalida el esfuerzo de Ossie —la especificación 1.0 se publicó apenas en enero de 2026, y entrar a la incubadora de Apache en julio es, en los tiempos habituales de maduración de un estándar de este tipo, un paso temprano, no uno tardío—. Pero sí sugiere que cualquier organización que esté evaluando construir sobre este estándar en este momento debería tratar esa evaluación como la prueba de un sistema en desarrollo activo, no como la adopción de una pieza de infraestructura ya resuelta.

## Qué cambia, en la práctica, para un equipo de datos que ya apostó por esto

Para un equipo de datos que ya invirtió tiempo en definir sus métricas en dbt, en Snowflake, o en ambos, la implicación concreta de esta prueba es que compartir una definición de métrica entre esos dos sistemas todavía requiere una revisión manual de la estructura relacional después de cualquier conversión automática —no se puede asumir, todavía, que el archivo que sale de un convertidor está listo para producción tal como está. Eso no significa que el esfuerzo de centralizar definiciones en un solo lugar deje de valer la pena; significa que, por ahora, ese "un solo lugar" sigue necesitando una capa de verificación humana entre la definición y su uso en cada sistema de destino, exactamente el trabajo manual que el estándar prometía eliminar.

## Lo que todavía no se puede dar por resuelto

Nada en esta prueba demuestra que Apache Ossie esté condenado a repetir ese problema de forma permanente —es, después de todo, un proyecto con una versión de especificación todavía en borrador (0.2.0.dev0) y con más de cincuenta organizaciones trabajando activamente en corregir justamente este tipo de fricciones—. Lo que sí demuestra, con un ejemplo concreto y reproducible, es que la distancia entre "dos sistemas pueden compartir una métrica" y "dos sistemas pueden compartir el significado completo de un modelo de datos sin intervención humana" sigue siendo más ancha de lo que cualquier anuncio de lanzamiento sugiere, y que esa distancia específica —no la fórmula, sino la relación entre las tablas— es exactamente donde cualquier evaluación seria de este tipo de estándares debería empezar a mirar.

## Fuentes

- [Keeping Snowflake Semantic Views in Git](https://querio.ai/articles/snowflake-semantic-layer) — Querio
- [Open Semantic Interchange (OSI) Specification Finalized](https://www.snowflake.com/en/blog/open-semantic-interchanges-specs-finalized/) — Snowflake
- [Apache Ossie (Incubating): The New Name for Open Semantic Interchange](https://www.snowflake.com/en/blog/apache-ossie-open-semantic-interchange-incubator/) — Snowflake
- [Snowflake Unites Industry Leaders to Unlock AI's Potential with the Open Semantic Interchange Initiative](https://www.snowflake.com/en/blog/open-semantic-interchange-ai-standard/) — Snowflake
- [Announcing Apache Ossie](https://omni.co/blog/announcing-the-open-semantic-interchange) — Omni
- [Oracle y Snowflake anunciaron que el AI Data Cloud correrá nativo en OCI](/blog/snowflake-oracle-oci-gravedad-datos-nuevo-encierro) — jgonzalez.app
