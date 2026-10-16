---
titulo: 'Cuando una startup quiebra, lo último que vale es su código. Lo que de verdad se vende es el Slack'
fecha: 2026-10-16
categoria: business-analytics
mundo: datos-como-negocio
tags:
  - datos de entrenamiento
  - inteligencia artificial
  - quiebras
  - gobernanza de datos
  - privacidad
  - Google
  - Spirit Airlines
  - mercado de datos
  - reinforcement learning
  - startups
resumen: 'Firmas especializadas en el cierre ordenado de startups han empezado a vender, además del código fuente, el historial completo de Slack, correo y documentos de trabajo de las empresas que liquidan, como insumo de entrenamiento para laboratorios de IA. Google pagó 10 millones de dólares por 100 millones de correos y 500 millones de mensajes de Teams de Spirit Airlines en su proceso de bancarrota.'
tesis: 'El valor de una empresa que quiebra ya no se agota en sus patentes, su inventario o su código: el registro conversacional de cómo un equipo real discutió, decidió y ejecutó trabajo se ha vuelto, por sí mismo, un activo líquido que se transa en subastas de bancarrota. Eso documenta un hecho —existe ya un mercado formal para datos laborales de empresas liquidadas— sin que eso implique todavía que ese insumo mejore de forma demostrable el entrenamiento de modelos: ninguna de las partes ha publicado evidencia comparativa de que funcione mejor que las alternativas.'
datosClave:
  - valor: '$10 millones'
    etiqueta: 'Pago de Google por los datos internos de Spirit Airlines en su bancarrota, incluidos ~100 millones de correos y ~500 millones de mensajes de Teams'
    periodo: 'agosto 2026'
    fuente: 'Axios'
  - valor: '47%'
    etiqueta: 'Proporción de los cierres de startups gestionados por SimpleClosure que ya incluyen venta de código o datos'
    fuente: 'MIT Technology Review'
  - valor: '150+'
    etiqueta: 'Operaciones de venta de datos ya gestionadas por la plataforma Asset Hub de SimpleClosure'
  - valor: '$25,000'
    etiqueta: 'Monto que recibió un fundador por el código de su startup de criptomonedas cerrada este año, aparte de la venta pendiente de sus datos de Slack/Notion/Figma'
    fuente: 'MIT Technology Review'
imagen: /blog/portadas/datos-startups-quebradas-materia-prima-entrenamiento-ia.jpg
socialImagen: /blog/social/datos-startups-quebradas-materia-prima-entrenamiento-ia.jpg
gancho: 'Google pagó 10 millones de dólares por el correo muerto de una aerolínea en quiebra. No por sus aviones, ni sus rutas: por cómo discutía internamente sus problemas. ¿Qué dice eso de qué estamos entrenando a los modelos a imitar?'
postura:
  pregunta: '¿Debería requerirse el consentimiento explícito de cada empleado antes de que el historial de Slack, correo y documentos de una empresa en quiebra se venda como dato de entrenamiento a un laboratorio de IA?'
  aFavor: 'Un correo o un mensaje de Slack contiene, casi por definición, expresiones personales, desacuerdos internos y errores laborales de personas que nunca firmaron un contrato previendo que ese material terminaría entrenando un modelo comercial de otra empresa —sin su consentimiento explícito, la venta convierte comunicación laboral privada en materia prima comercial sin compensación para quien la produjo.'
  enContra: 'Exigir consentimiento individual de cada empleado haría inviable en la práctica cualquier venta de este tipo de activo en un proceso de bancarrota —localizar y obtener la firma de cientos o miles de extrabajadores dispersos, algunos ilocalizables, encarecería el proceso al punto de que los acreedores simplemente no recuperarían nada de ese activo, y la empresa en liquidación ya es, legalmente, la propietaria de esas comunicaciones generadas en sus propios sistemas corporativos.'
---

En abril de este año, SimpleClosure —una firma que ayuda a startups a cerrar operaciones de forma ordenada, liquidando activos y repartiendo lo que queda entre acreedores— añadió una línea de negocio nueva a su plataforma Asset Hub: adquirir, limpiar de información personal identificable y revender el código fuente y los datos de trabajo de las empresas que ayuda a cerrar. Según una investigación publicada por MIT Technology Review el 13 de octubre, esa línea de negocio ya representa el 47% de los cierres que gestiona la firma, y Asset Hub ha completado más de 150 operaciones de este tipo, con una proyección de devolver más de 10 millones de dólares a startups liquidadas antes de que termine el año. El comprador casi siempre es el mismo tipo de cliente: un laboratorio de inteligencia artificial que necesita datos de trabajo real —no sintéticos, no de encuesta, sino el registro genuino de cómo un equipo discutió, decidió y ejecutó— para entrenar o evaluar modelos y agentes.

## El activo que nadie puso en el balance general

Cuando una startup cierra, el inventario de lo que tiene valor de reventa ha sido tradicionalmente previsible: patentes, marcas, equipo físico, a veces una base de clientes. El código fuente siempre tuvo algún valor residual, sobre todo si incluía propiedad intelectual específica. Lo que no aparecía en ningún balance general, porque nadie lo consideraba un activo vendible, era el archivo completo de comunicación interna de la empresa: los canales de Slack, el historial de correo, los documentos de Notion y Figma, las decisiones registradas en herramientas de gestión de proyectos. Ese archivo —el registro cotidiano, desordenado y genuino de cómo opera una organización real— es precisamente lo que hoy tiene comprador. Nick Heiner, quien dirige esa línea de adquisición de datos en Surge AI (una de las firmas que compra este tipo de archivos), fue citado describiendo el valor relativo de forma directa: el historial de Slack de una compañía puede valer, por sí solo, más que el correo, el calendario y los documentos combinados de otra, si captura una variedad y profundidad de conversación que la mayoría de los archivos corporativos no tiene.

## Para qué sirve exactamente ese archivo

La aplicación concreta que está impulsando esta demanda tiene un nombre técnico específico: "reinforcement-learning gyms", o gimnasios de aprendizaje por refuerzo. Son entornos simulados donde un agente de IA practica tareas complejas —depurar una arquitectura de TI enredada, redactar un escrito legal de apelación, coordinar un proyecto con dependencias cruzadas— usando como guion el registro real de cómo humanos resolvieron ese mismo tipo de problema en el pasado. La diferencia frente a entrenar con datos sintéticos generados por otro modelo, o con documentación pública scrapeada de internet, es que el archivo de una empresa real captura la parte del trabajo que casi nunca se documenta de forma limpia: el ida y vuelta de decisiones equivocadas, correcciones, negociaciones internas y callejones sin salida que preceden a una solución final. Es, en cierto sentido, el mismo principio detrás de por qué las empresas de analítica llevan una década repitiendo que los datos transaccionales reales valen más que cualquier conjunto de datos de prueba: la realidad desordenada contiene señal que ningún dato generado a propósito reproduce con la misma fidelidad.

## El caso que llevó esto a la primera plana: Spirit Airlines

El ejemplo que ha generado más escrutinio público no proviene de una startup pequeña, sino de una aerolínea comercial de tamaño considerable. Spirit Airlines se declaró en bancarrota, y como parte de la liquidación de sus activos, Google ganó una subasta por el archivo interno de la aerolínea: aproximadamente 100 millones de correos electrónicos y 500 millones de mensajes de Microsoft Teams, según documentos judiciales citados por Axios. El pago acordado fue de 10 millones de dólares, superando una oferta de 7.5 millones de la empresa Mercor, que también competía por el archivo. Google ha declarado que el material será desidentificado antes de su uso, y que el comprador se compromete contractualmente a no intentar reidentificar a las personas cuyas comunicaciones forman parte del archivo. Esa promesa contractual no ha sido suficiente para calmar la controversia: más de 120 legisladores estadounidenses, con una carta encabezada por la senadora Elizabeth Warren, pidieron a Google que excluyera explícitamente cualquier información de empleados del paquete adquirido, y el sindicato de sobrecargos de la aerolínea presentó objeciones formales citando el riesgo de que los vínculos entre registros —quién escribió qué, a quién, cuándo— permitan una reidentificación indirecta incluso sin nombres explícitos.

## Por qué "desidentificado" no cierra la pregunta

La tensión central de este caso no es si Google cumplirá su promesa contractual de no reidentificar —es razonable asumir que una empresa de ese tamaño, bajo escrutinio regulatorio activo, respetará los términos específicos que firmó—. La tensión es más estructural: un archivo de 100 millones de correos y 500 millones de mensajes de chat interno, por definición, preserva patrones de escritura, relaciones jerárquicas, estilos de comunicación y contextos de conversación que son mucho más difíciles de anonimizar de forma completa que un simple listado de nombres y números de empleado. Los abogados que han comentado el caso describen el material como "legalmente radiactivo" precisamente por esa razón: eliminar los identificadores explícitos es técnicamente sencillo, pero garantizar que ningún patrón residual permita inferir identidad —sobre todo en un archivo de ese volumen, donde cualquier empleado escribió miles de mensajes con un estilo reconocible— es un estándar mucho más difícil de cumplir y, hasta ahora, nadie ha demostrado públicamente que se haya alcanzado.

## El dinero no llega a quien produjo los datos

Hay un segundo problema, distinto al de la privacidad, que ha recibido menos atención pública pero que es igual de relevante desde una perspectiva de gobernanza de datos: el dinero de estas ventas no llega, como regla general, a las personas que generaron el contenido vendido. En un proceso de bancarrota, los ingresos de la liquidación de activos se distribuyen según el orden de prelación de acreedores —primero acreedores garantizados, luego inversionistas, y solo al final, si queda algo, otros interesados—. Los empleados cuyo correo y conversaciones de Slack constituyen el activo que se está vendiendo prácticamente nunca ven una fracción de ese ingreso, salvo en el caso puntual de un fundador que, como describe la investigación de MIT Technology Review, recibió directamente 25,000 dólares por el código de su propia startup de criptomonedas cerrada este año, con una venta de datos adicional todavía pendiente por un monto similar. Ese caso es la excepción visible, no la regla: la mayoría de los empleados cuyo trabajo diario termina convertido en material de entrenamiento no son dueños del activo que produjeron, porque lo produjeron dentro de sistemas corporativos que legalmente pertenecen a la empresa, no a ellos.

## La pregunta que todavía nadie ha respondido con evidencia

Hay, debajo de toda esta controversia legal y ética, una pregunta técnica más simple que sorprendentemente nadie ha resuelto de forma pública: ¿este tipo de dato realmente mejora el entrenamiento de modelos de forma medible, frente a alternativas más baratas y menos conflictivas, como datos sintéticos o documentación técnica pública? Ninguna de las empresas involucradas —ni los laboratorios compradores, ni las firmas de intermediación como SimpleClosure o Surge AI— ha publicado una comparación controlada que demuestre esa ventaja de forma cuantitativa. Lo que existe, hasta ahora, es la intuición razonable de que datos de trabajo real capturan matices que un dataset generado artificialmente no reproduce, más el hecho observable de que compradores sofisticados como Google están dispuestos a pagar sumas de siete cifras por acceder a ese material. Esa disposición a pagar es, en sí misma, información de mercado real —pero no sustituye a una prueba empírica de que el gasto se traduzca en modelos mejores, y hasta que esa evidencia exista públicamente, la pregunta de si este nuevo mercado de datos corporativos liquidados está comprando una ventaja genuina o simplemente comprando la posibilidad de una ventaja sigue abierta.

## Fuentes

- [AI labs are buying data from dead startups to train their models](https://www.technologyreview.com/2026/10/13/1145755/ai-labs-buying-data-from-dead-startups-to-train-models/) — MIT Technology Review
- [The unusual way Google is involved in the Spirit Airlines bankruptcy—and what that means for you](https://www.fastcompany.com/91591857/google-buying-spirit-airlines-data-ai-model-training-bankruptcy) — Fast Company
- [Google buys Spirit Airlines emails, chats, documents out of bankruptcy](https://www.axios.com/2026/08/17/google-spirit-airlines-bankruptcy) — Axios
- [AI Data Wars Begin As Google, Mercor And Micro1 Bid For Spirit's Data](https://www.forbes.com/sites/sandycarter/2026/08/23/ai-data-wars-begin-as-google-mercor-and-micro1-bid-for-spirits-data/) — Forbes
- [US lawmakers question Google's Spirit data deal](https://www.ch-aviation.com/news/172743-us-lawmakers-question-googles-spirit-data-deal) — ch-aviation
