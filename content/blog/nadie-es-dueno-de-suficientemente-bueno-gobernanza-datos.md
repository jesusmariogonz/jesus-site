---
titulo: 'Nadie es dueño de "suficientemente bueno": la pregunta que mata más proyectos de datos que cualquier falla técnica'
fecha: 2026-10-27
categoria: business
mundo: notas-de-campo
tags:
  - gobernanza de datos
  - calidad de datos
  - data governance
  - cultura organizacional
  - toma de decisiones
  - liderazgo de datos
  - arquitectura de datos
  - transformación digital
resumen: 'La mayoría de los proyectos de gobernanza de datos no fracasan por falta de herramientas ni de talento técnico, sino porque nadie en la organización tiene la autoridad formal, ni la obligación, de decidir qué tan buena tiene que ser la información para poder usarse. Esa pregunta, aparentemente simple, es la que más tiempo consume y la que menos se resuelve en la práctica.'
tesis: 'Que la mayoría de los programas de gobernanza de datos se estanquen no por falta de políticas documentadas, sino por ambigüedad de roles y de mandato formal, es un hallazgo que la literatura académica sobre gobernanza de datos ha documentado desde hace más de una década. Que esa ambigüedad sea, específicamente, la pregunta de quién decide el umbral de "suficientemente bueno" para cada decisión de negocio, es una lectura basada en patrones observados en la práctica, no un hallazgo replicado con la misma rigurosidad metodológica.'
imagen: /blog/portadas/nadie-es-dueno-de-suficientemente-bueno-gobernanza-datos.jpg
socialImagen: /blog/social/nadie-es-dueno-de-suficientemente-bueno-gobernanza-datos.jpg
gancho: 'Un documento de gobernanza de datos de 40 páginas no sirve de nada si, cuando dos equipos no se ponen de acuerdo sobre si un dato está "suficientemente limpio" para tomar una decisión, nadie tiene la autoridad formal para resolver esa discusión en menos de tres semanas de correos cruzados.'
postura:
  pregunta: '¿La solución al problema de calidad de datos en las organizaciones es principalmente de gobernanza —definir con claridad quién decide y quién responde por cada conjunto de datos— o es, en el fondo, un problema técnico que mejores herramientas de observabilidad y catálogos automatizados terminarán resolviendo sin necesidad de rediseñar la estructura organizacional?'
  aFavor: 'Las herramientas modernas de observabilidad de datos y los catálogos automatizados con linaje y puntuación de calidad reducen de forma real la fricción operativa: antes se necesitaban semanas para rastrear el origen de un error, hoy un catálogo bien instrumentado lo señala en minutos, lo cual disuelve buena parte del problema sin necesidad de rediseñar comités ni líneas de autoridad.'
  enContra: 'Ninguna herramienta, por sofisticada que sea, puede decidir por sí sola si un nivel de error del 3% es aceptable para un reporte financiero regulatorio pero inaceptable para un modelo de riesgo crediticio —esa es una decisión de negocio, no una medición técnica—, y mientras nadie tenga la autoridad formal y la responsabilidad explícita de tomar esa decisión y hacerla cumplir, la herramienta más avanzada solo va a producir alertas más precisas sobre un problema que la organización sigue sin saber quién debe resolver.'
---

Hay una pregunta que aparece en casi cualquier proyecto serio de datos, usualmente disfrazada de discusión técnica, y que casi nunca se resuelve con la rapidez que su simplicidad aparente sugiere: ¿qué tan bueno tiene que ser un dato para que podamos usarlo? No "¿es correcto el dato?" —esa pregunta, al menos en teoría, tiene una respuesta verificable—, sino algo más resbaladizo: ¿qué margen de error, de incompletitud o de inconsistencia estamos dispuestos a tolerar antes de decir que ese conjunto de datos ya está "suficientemente bueno" para apoyar una decisión concreta?

## El patrón que se repite en organizaciones distintas

He visto esta misma discusión reaparecer, con variaciones superficiales, en contextos de industria completamente distintos: un equipo de analítica necesita cerrar un reporte y considera que el dato disponible, con sus imperfecciones conocidas, es suficiente para avanzar; un equipo de riesgo, cumplimiento o auditoría —dueño formal o informal de un estándar más estricto— considera que no lo es. Nadie en la sala está actuando de mala fe. Ambos equipos tienen razones legítimas para su posición. Lo que falta, con una consistencia que ya dejó de sorprenderme, no es información técnica adicional sobre el dato en disputa: es una persona o un comité con la autoridad formal, reconocida por ambas partes de antemano, para resolver esa discusión específica sin que se convierta en una negociación política de semanas.

## Por qué esto no es un problema de documentación

La tentación organizacional más común frente a este problema es escribir una política de gobernanza de datos —un documento, a veces de decenas de páginas, que define estándares de calidad, roles de "data steward" y procesos de escalamiento—. Un estudio de caso académico sobre gobernanza de datos en una organización grande, publicado en la conferencia DW2008 por Weber, Cheong, Otto y Chang, documentó algo que sigue siendo relevante casi dos décadas después: el obstáculo principal para mejorar la calidad de los datos no era la falta de un marco de políticas, sino la ambigüedad de roles y la ausencia de un mandato formal para iniciar y hacer cumplir mejoras de calidad. Las organizaciones que estudiaron habían delegado tradicionalmente la responsabilidad de calidad de datos al área de TI, pasando por alto que el problema de fondo era organizacional, no técnico.

Esa distinción importa más de lo que parece. Un documento de gobernanza puede enumerar con precisión qué campos son obligatorios, qué formato debe tener una fecha o qué tan frecuente debe ser una actualización. Lo que casi ningún documento de gobernanza logra especificar con la misma precisión es quién, exactamente, tiene la autoridad para decidir —en el momento específico en que dos áreas no están de acuerdo— que un dato ya cruzó el umbral de "suficientemente bueno" para un uso concreto, y quién responde si esa decisión resulta equivocada.

## El costo que no aparece en ningún tablero

Este tipo de ambigüedad no se mide fácilmente, lo cual es parte del problema: no hay una fila en ningún dashboard ejecutivo que diga "horas-persona perdidas negociando umbrales de calidad de datos entre equipos". Lo que sí se observa, de forma indirecta, es la fricción acumulada: proyectos que se retrasan semanas no por ninguna falla técnica documentada, sino porque la discusión sobre si el dato de entrada era suficientemente confiable se volvió, de facto, una negociación sin un árbitro designado. Cada una de esas negociaciones consume tiempo de personas senior, erosiona la confianza entre equipos que deberían colaborar de forma rutinaria, y —lo más costoso a largo plazo— enseña a la organización que la calidad de datos es un tema de opinión entre departamentos, no un estándar con dueño y consecuencias.

## Lo que sí parece funcionar, cuando funciona

El patrón que distingue a las organizaciones donde esta fricción es menor no es, en mi experiencia, la sofisticación de su stack tecnológico de datos —con catálogos, linaje automatizado y puntuaciones de calidad, todos avances reales y útiles—, sino la existencia de un mecanismo de decisión explícito y conocido de antemano por todas las partes: un comité, una persona con autoridad delegada, o un criterio documentado y vinculante para cada tipo de decisión de negocio, de forma que cuando surge la discusión inevitable, ya existe un camino claro para resolverla en días, no en semanas de correos cruzados entre gerentes que, individualmente, tienen razón desde su propia perspectiva pero no autoridad sobre la del otro.

Es una solución que suena casi trivial descrita en abstracto, y que resulta sorprendentemente difícil de implementar en la práctica, precisamente porque exige que alguien con autoridad real esté dispuesto a asumir el desgaste político de arbitrar ese tipo de disputas de forma consistente, en lugar de dejar que cada una se resuelva de manera ad hoc según quién tenga más peso jerárquico en el momento específico.

## Un intento serio de resolver esto desde la arquitectura, no solo desde el comité

No es que la industria no haya intentado atacar este problema de raíz. El concepto de "data mesh", introducido por Zhamak Dehghani en Thoughtworks alrededor de 2018-2019, propone justamente una respuesta estructural a la pregunta de quién es dueño de un dato: en lugar de centralizar toda la responsabilidad de calidad en un equipo de datos o de TI que no tiene el contexto del negocio que generó esa información, el data mesh asigna la propiedad de cada conjunto de datos al dominio de negocio que lo produce y mejor lo entiende —ventas es dueño de sus datos de ventas, logística de los suyos—, tratando cada conjunto de datos como un producto con un responsable identificable, no como un subproducto técnico anónimo que cualquiera puede tocar sin consecuencias.

Es una idea atractiva precisamente porque ataca el problema de raíz que describe el estudio de 2008: en lugar de delegar la calidad de datos a un equipo central de TI sin autoridad real sobre cómo opera cada área de negocio, coloca la responsabilidad donde sí existe el contexto y, en teoría, el incentivo para cuidarla. El cuarto principio del data mesh —lo que Dehghani llama "gobernanza computacional federada"— es, sin embargo, la parte menos desarrollada en la práctica de muchas implementaciones que he visto: define cómo deberían coordinarse esos dominios autónomos entre sí, pero no resuelve automáticamente la pregunta original. Un dominio puede tener toda la autoridad formal sobre sus propios datos y seguir sin tener un mecanismo claro para decidir, en una disputa concreta con otro dominio que depende de esos datos, qué nivel de calidad es aceptable para un uso compartido. El rediseño organizacional ayuda, pero no sustituye la necesidad de un árbitro.

## Por qué los agentes de IA hacen que esta pregunta sea más urgente, no menos

Hay una razón adicional, más reciente, por la que esta ambigüedad ya no se puede seguir posponiendo indefinidamente: cuando la persona que decide si un dato es "suficientemente bueno" es un analista humano, esa persona puede aplicar juicio implícito, consultar a un colega o simplemente dudar antes de usar un dato dudoso. Un agente de inteligencia artificial que automatiza un flujo de decisión —aprobar un crédito, generar un reporte, activar una alerta— no tiene esa capacidad de duda a menos que alguien se la haya programado explícitamente, con un umbral numérico definido de antemano. Eso significa que la pregunta de "¿quién decide qué tan bueno es suficientemente bueno?" deja de ser una discusión que se puede resolver de forma ad hoc, caso por caso, entre gerentes razonables, y se convierte en un parámetro que hay que fijar con precisión antes de que el sistema automatizado tome esa decisión miles de veces sin supervisión humana directa. La ambigüedad que antes se absorbía con buen juicio humano, ahora se programa —para bien o para mal— en el comportamiento del sistema.

## La pregunta que toda iniciativa de datos debería hacerse antes de empezar

Antes de invertir en la siguiente herramienta de catalogación, en el siguiente modelo de gobernanza o en la siguiente ronda de capacitación sobre calidad de datos, vale la pena que cualquier organización se haga una pregunta mucho más incómoda que cualquiera de esas inversiones: si dos equipos no se ponen de acuerdo hoy mismo sobre si un conjunto de datos específico es suficientemente bueno para una decisión concreta, ¿quién tiene la autoridad formal para resolverlo, y en cuánto tiempo se espera que lo resuelva? Si la respuesta no es inmediata y compartida por ambas partes, ya se encontró el verdadero cuello de botella —y ninguna herramienta, por sofisticada que sea, va a resolverlo sin que alguien, primero, decida resolverlo.

## Fuentes

- [Organising Accountabilities for Data Quality Management — A Data Governance Case Study](https://dl.gi.de/items/da611092-7f15-416a-8fba-a148ab248d49/full) — Weber, Cheong, Otto y Chang, DW2008 (Gesellschaft für Informatik)
- [Data Mesh and Domain Ownership](https://www.thoughtworks.com/en-es/about-us/events/webinars/core-principles-of-data-mesh/data-mesh-and-domain-ownership) — Thoughtworks
- [What is a data mesh?](https://www.ibm.com/topics/data-mesh) — IBM
