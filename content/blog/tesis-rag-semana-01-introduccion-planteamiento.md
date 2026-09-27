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
resumen: 'Arranca una serie de 10 entregas semanales que documenta, con experimentos reales y pruebas de hipótesis, cuánta información sigue viva en un sistema RAG empresarial después de que la gobernanza dice que ya no debería estarlo. Semana 1: el problema, su alcance, y por qué es medible y no solo un riesgo teórico.'
tesis: 'Los sistemas RAG empresariales que se documentan y venden como "gobernados" —con control de acceso, políticas de retención y mecanismos de eliminación— casi nunca someten a prueba empírica si esos controles realmente se sostienen en los componentes auxiliares del pipeline: el caché semántico, la memoria de largo plazo y el índice vectorial pueden preservar información fuera de esos límites de gobernanza sin que ningún log lo refleje, y esta tesis existe para medir esa fuga con números, no con intuición.'
datosClave:
  - valor: '10 semanas'
    etiqueta: 'Duración de la serie, publicada cada domingo — de introducción a documento de tesis consolidado'
  - valor: '2 hipótesis'
    etiqueta: 'H1 (fuga de confidencialidad) y H2 (falla del derecho al olvido), ambas falsables y sometidas a prueba estadística real'
  - valor: '3 componentes auxiliares'
    etiqueta: 'Caché semántico, memoria de largo plazo e índice vectorial — los puntos donde la gobernanza de un RAG suele dejar de aplicarse'
imagen: /blog/portadas/tesis-rag-semana-01-introduccion-planteamiento.jpg
---

Un sistema de generación aumentada por recuperación —RAG, por sus siglas en inglés— se diseña, casi siempre, pensando en el camino feliz: un usuario hace una pregunta, el sistema recupera los documentos relevantes, el modelo genera una respuesta fundamentada en esos documentos. Lo que ese diseño rara vez somete a prueba con el mismo rigor es qué pasa en los caminos que no son el feliz: qué pasa cuando el usuario que pregunta no tiene autorización para ver el documento que contiene la respuesta correcta, o qué pasa cuando un dato que un usuario pidió formalmente eliminar de un sistema de memoria sigue, técnicamente, disponible por una ruta que nadie diseñó para ser una puerta trasera pero que funciona como una. Esta serie —diez entregas semanales, publicadas cada domingo, que terminarán ensambladas en un documento de tesis único— existe para medir esas dos preguntas con datos reales, no con la intuición razonable de que "probablemente eso ya está resuelto".

## El problema, dicho sin eufemismos

Un pipeline RAG típico —el descrito en el Capítulo 5 del libro *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales* (González Siller, 2026), que sirve de base técnica a esta tesis— tiene un flujo central bien entendido: fragmentar documentos, generar embeddings, indexarlos en un almacén vectorial, recuperar los fragmentos relevantes para una consulta, y pasarlos como contexto al modelo generador. La gobernanza de ese flujo —quién puede ver qué, y qué pasa cuando algo debe dejar de existir— se implementa casi siempre como una capa que se le agrega al flujo central, no como una propiedad estructural de cada uno de sus componentes. El resultado es que componentes auxiliares diseñados para mejorar rendimiento o experiencia de usuario —un caché semántico que evita recalcular una respuesta ya dada a una pregunta parecida, una capa de memoria de largo plazo que recuerda contexto de conversaciones anteriores— quedan, con frecuencia, fuera del alcance de las reglas de acceso y de las rutinas de eliminación que sí se aplicaron al almacén de documentos principal. No es un error de diseño malintencionado: es la consecuencia previsible de tratar la gobernanza como un candado que se le pone a la puerta principal, sin revisar si hay ventanas abiertas en el resto del edificio.

## Por qué esto no es un riesgo hipotético

El Capítulo 15 del mismo libro documenta un caso de arquitectura de seguridad para RAG empresarial construido alrededor de "Enterprise Intelligence Agent" (EIA Corp), una compañía ficticia usada como caso transversal a lo largo del texto, con documentos internos clasificados por nivel de acceso —público, interno, confidencial, restringido— y roles de usuario con distintos privilegios. El Apéndice E describe una función `eliminar_memoria(usuario_id)` como el mecanismo formal para cumplir con una solicitud de eliminación de datos personales. Ambos mecanismos —control de acceso por nivel de confidencialidad, y eliminación formal de memoria— son exactamente el tipo de control que la regulación de protección de datos en América Latina exige de forma explícita: la Ley Federal de Protección de Datos Personales en Posesión de los Particulares en México (LFPDPPP), la Lei Geral de Proteção de Dados en Brasil (LGPD) y la Ley 1581 de 2012 en Colombia establecen, cada una con su propio lenguaje, el derecho de una persona a que sus datos personales sean eliminados cuando así lo solicite, y la obligación de las organizaciones de restringir el acceso a información conforme a su nivel de sensibilidad (Cap. 22 del libro cubre este marco regulatorio con el detalle jurisdiccional que esta tesis retoma). El problema de investigación de esta serie es exactamente la brecha entre lo que esos mecanismos formales prometen y lo que un sistema RAG con componentes auxiliares reales efectivamente cumple.

## Alcance: qué mide esta tesis y qué no

Esta tesis no es una auditoría legal de cumplimiento normativo, ni pretende evaluar si EIA Corp —o cualquier empresa real— cumple con la LFPDPPP, la LGPD o la Ley 1581 en un sentido jurídico. El alcance es técnico y empírico: construir una implementación real de un pipeline RAG con los componentes auxiliares descritos (caché semántico, memoria de largo plazo, índice vectorial), someterlo a escenarios controlados donde la gobernanza debería impedir un resultado específico —una fuga de confidencialidad, o la persistencia de un dato eliminado—, y medir con qué frecuencia esa gobernanza efectivamente falla. El resultado no es una afirmación sobre la ley: es una afirmación sobre la arquitectura, con números y significancia estadística detrás, que después se puede usar para argumentar qué tan lejos está una arquitectura técnica típica de lo que la ley exige.

## La pregunta de investigación unificada

Formulada de manera explícita, la pregunta que organiza las diez semanas de esta serie es: ¿en qué medida los componentes auxiliares de un pipeline RAG —caché semántico, memoria de largo plazo, índice vectorial— preservan información fuera de los límites de gobernanza definidos, ya sea por falta de autorización o por una solicitud de eliminación, y qué arquitecturas cierran esa fuga sin destruir la utilidad del sistema? Esa pregunta se descompone en dos hipótesis falsables, cada una con su propio experimento dedicado en las semanas siguientes: la primera, sobre fuga de confidencialidad entre usuarios con distintos niveles de autorización (Semanas 3 a 5); la segunda, sobre la persistencia de información después de una eliminación formal —lo que coloquialmente se puede llamar una falla del "derecho al olvido" (Semanas 6 a 8)—. Ambas comparten el mismo criterio de falsabilidad y el mismo aparato estadístico, que se formaliza en la Semana 2.

## Por qué esta serie se publica en tiempo real, sin resultados adelantados

Una decisión editorial deliberada de esta serie es no escribir, en esta primera entrega, ninguna cifra de resultados: no existen todavía, porque los experimentos no se han corrido. Cada entrega de resultados (Semanas 4, 5, 7 y 8) reportará únicamente datos generados por código real ejecutado contra la API de Anthropic, con el script, el corpus y las respuestas crudas del modelo guardados en el repositorio para que cualquier lector pueda auditar el proceso completo, no solo la conclusión. Esa decisión responde directamente al problema que la tesis investiga: una afirmación de gobernanza que no se puede auditar es, estructuralmente, el mismo problema que un sistema RAG que promete cumplir reglas que en realidad no verifica.

La próxima entrega, dentro de una semana, formaliza el marco teórico y la metodología unificada de ambos experimentos, incluyendo el criterio de falsabilidad bajo el que se evaluará cada hipótesis.

## Referencias

González Siller, J. M. (2026). *AI Solution Architect: De LLMs y RAG a Agentes, Orquestación y Sistemas Inteligentes Empresariales*.

Ley Federal de Protección de Datos Personales en Posesión de los Particulares [LFPDPPP]. (2010). Diario Oficial de la Federación, México.

Lei Geral de Proteção de Dados Pessoais [LGPD], Lei n.º 13.709. (2018). Diário Oficial da União, Brasil.

Ley 1581 de 2012, por la cual se dictan disposiciones generales para la protección de datos personales. (2012). Diario Oficial, Colombia.
