---
titulo: 'Gartner predice que 70% de las empresas van a abandonar los agentes de IA que sus propios proveedores les construyeron'
fecha: 2026-10-01
categoria: business-analytics
mundo: ia-nueva-economia
tags:
  - agentes de IA
  - Gartner
  - forward-deployed engineering
  - adopción empresarial
  - gobernanza de IA
  - costos de IA
  - vendor lock-in
  - IA agéntica
  - transformación digital
resumen: 'Gartner proyecta que, para 2028, 70% de las empresas abandonará los agentes de IA que construyeron con ingeniería "forward-deployed" de sus propios proveedores, citando costos insostenibles y la incapacidad de evolucionarlos sin ayuda externa permanente. Es la primera señal cuantificada de que el modelo de implementación más común de la IA agéntica empresarial puede ser, estructuralmente, insostenible.'
tesis: 'El problema que Gartner documenta no es que los agentes de IA fallen técnicamente, sino que el modelo comercial con el que la mayoría de las empresas los adquirió —ingenieros del proveedor construyendo soluciones a medida dentro de la operación del cliente— produce sistemas que ninguna de las dos partes tiene, en la práctica, el incentivo correcto de mantener funcionando a largo plazo.'
datosClave:
  - valor: '70%'
    etiqueta: 'De las empresas que, según proyección de Gartner, abandonarán para 2028 los agentes de IA construidos por ingeniería forward-deployed de sus proveedores'
  - valor: '<20%'
    etiqueta: 'De los proyectos de forward-deployed engineering que, según Gartner, terminan convirtiéndose en capacidades del producto central del proveedor'
  - valor: '2028'
    etiqueta: 'Año horizonte de la proyección de Gartner, publicada el 29 de septiembre de 2026'
imagen: /blog/portadas/inteligencia-artificial-14.jpg
gancho: 'Gartner proyecta que 7 de cada 10 empresas van a abandonar, antes de 2028, los agentes de IA que sus propios proveedores les construyeron a medida. El problema no es que la tecnología falle — es que nadie diseñó, desde el día uno, quién sería dueño del sistema cuando el ingeniero del proveedor se fuera.'
socialImagen: /blog/social/fde-agentes-ia-abandono-vendor-gartner.jpg
---

El 29 de septiembre, Gartner publicó una proyección que debería incomodar a cualquier empresa que en los últimos dos años haya contratado a un proveedor de IA para que sus propios ingenieros construyeran, dentro de la operación del cliente, un sistema de agentes a la medida: para 2028, 70% de esas empresas habrá abandonado el sistema resultante. No es una proyección sobre si la IA agéntica funciona o no —la premisa de Gartner no cuestiona la tecnología en sí—, es una proyección sobre si el modelo comercial más común para implementarla, conocido como forward-deployed engineering (FDE), produce sistemas que las empresas puedan sostener una vez que el equipo del proveedor se retira.

## Qué es exactamente "forward-deployed engineering"

El término describe un modelo de entrega específico: en lugar de vender software estándar que el cliente configura por su cuenta, el proveedor envía a sus propios ingenieros a trabajar directamente dentro de la operación del cliente, construyendo una solución personalizada que se integra con los sistemas, flujos de trabajo y datos específicos de esa empresa. Es el modelo que popularizaron empresas como Palantir, y que buena parte de los proveedores de IA agéntica adoptaron durante el boom de adopción empresarial de los últimos dos años, precisamente porque los sistemas empresariales reales —con sus bases de datos heredadas, sus procesos informales y sus excepciones acumuladas durante décadas— rara vez se dejan domesticar por un producto genérico sin ese nivel de personalización directa.

## Por qué el modelo funciona al principio y falla después

El atractivo inicial del FDE es real y explica por qué tantas empresas lo adoptaron: permite tener un sistema funcionando rápido, construido por gente que entiende la tecnología a fondo, sin que el cliente tenga que desarrollar esa experiencia internamente desde cero. El problema, según Gartner, aparece después, cuando la empresa descubre que el sistema altamente personalizado que terminó con ese proceso es costoso de mantener, difícil de escalar más allá del caso de uso original, y complicado de gobernar —porque el conocimiento profundo de cómo funciona realmente vive, en buena medida, en la cabeza de los ingenieros del proveedor que ya se fueron, no en documentación o capacidades que el cliente internalizó durante el proceso.

## La cifra que explica por qué esto no se resuelve solo

El dato más revelador del reporte no es el 70% de abandono proyectado, sino uno más específico: menos del 20% de los proyectos de forward-deployed engineering terminan convirtiéndose en capacidades del producto central del proveedor. Es decir, en la gran mayoría de los casos, lo que el equipo del proveedor construyó para un cliente específico se queda como una solución aislada, atada a ese cliente, que nunca se generaliza ni se integra al producto estándar que otros clientes del mismo proveedor también usan —lo que significa que ese cliente específico queda, de facto, financiando el mantenimiento de un sistema a la medida sin el beneficio de las mejoras, parches y actualizaciones que sí recibe automáticamente cualquiera que use el producto genérico del mismo proveedor.

## Por qué el momento actual hace este riesgo más agudo que hace dos años

Este riesgo no es exclusivo de 2026, pero su magnitud actual sí lo es: más de la mitad de las empresas grandes ya tienen agentes de IA operando de forma autónoma dentro de sus sistemas, según estimaciones recientes de adopción empresarial, lo que significa que el universo de organizaciones potencialmente expuestas a este patrón de abandono —empresas que construyeron su infraestructura de agentes bajo el modelo FDE durante la fase más intensa de adopción de los últimos dos años— es, en términos absolutos, mucho mayor que el que hubiera existido con la misma proporción de riesgo hace apenas un par de años. La velocidad misma de la adopción, celebrada en su momento como una señal de madurez del mercado, es precisamente lo que amplifica el tamaño del problema que Gartner está anticipando.

## El riesgo estructural: ningún lado tiene el incentivo correcto

Gartner es explícito en señalar que los proyectos de FDE suelen fallar por su estructura antes de que los problemas técnicos se vuelvan el obstáculo principal —una forma elegante de decir que el problema no es si el código funciona, sino quién tiene interés en mantenerlo funcionando después de la entrega inicial. El proveedor tiene un incentivo claro para facturar el proyecto de construcción inicial, pero uno mucho más débil para seguir invirtiendo en el mantenimiento de un sistema que, por definición, es único para ese cliente y no se replica en ningún otro contrato. El cliente, por su parte, frecuentemente no desarrolló durante el proceso la capacidad interna de operar y evolucionar el sistema por su cuenta, precisamente porque la ventaja original de contratar FDE era no tener que construir esa capacidad desde el principio. El resultado es un sistema sin dueño real a mediano plazo: ni el proveedor ni el cliente tienen, en la práctica, el incentivo económico de sostenerlo indefinidamente.

## Lo que Gartner recomienda, y por qué es más difícil de lo que suena

La recomendación de Gartner es relativamente simple de enunciar: estructurar cualquier acuerdo de FDE alrededor de resultados de negocio concretos y una estrategia explícita de transición hacia equipos internos, con reglas claras desde el día uno sobre gobernanza, entrega de valor, propiedad de la propiedad intelectual, co-propiedad del proyecto, transferencia de conocimiento y una ruta de salida definida. El problema práctico de esa recomendación es que exige a la empresa cliente negociar, desde antes de ver un solo resultado tangible del sistema, una claridad contractual sobre quién es dueño de qué que muchas organizaciones no tienen la sofisticación interna —ni, francamente, el incentivo de corto plazo— para exigir cuando lo que más quieren en ese momento es simplemente que el sistema funcione lo más rápido posible.

## El fenómeno del "FDE washing"

Gartner identifica además un riesgo colateral que vale la pena nombrar explícitamente porque es más difícil de detectar que el abandono mismo: lo que la firma llama "FDE washing", el fenómeno de servicios de consultoría convencional que se comercializan bajo la etiqueta de forward-deployed engineering sin ofrecer realmente la integración profunda y la transferencia de capacidad técnica que ese término debería implicar. Esto importa porque significa que una empresa que cree estar comprando un compromiso de ingeniería dedicada —con el nivel de inversión del proveedor que eso sugiere— puede en realidad estar comprando consultoría genérica con una etiqueta de moda, sin ninguna de las garantías implícitas de continuidad técnica que el término FDE originalmente prometía. Distinguir entre ambas cosas, antes de firmar un contrato, exige exactamente el tipo de sofisticación contractual que Gartner recomienda pero que la mayoría de las áreas de compras no tienen entrenamiento específico para exigir en un campo tan nuevo.

## Qué significa esto para quien está evaluando un proyecto de este tipo hoy

Para una empresa que hoy está considerando contratar un proveedor para construir agentes de IA a la medida, la lección práctica de esta proyección no es evitar el modelo de FDE —en muchos casos sigue siendo la ruta más rápida y realista hacia un sistema funcional— sino tratar la pregunta de "¿qué pasa cuando el equipo del proveedor se vaya?" como una pregunta central del proceso de contratación, no como una nota al pie que se resuelve después. Eso implica exigir, desde la propuesta inicial, claridad sobre quién será dueño del código y de la documentación técnica, qué parte del equipo interno del cliente participará activamente en la construcción —no solo en las reuniones de seguimiento— para poder operar el sistema después, y qué compromiso concreto existe de que el trabajo hecho para ese cliente específico eventualmente alimente mejoras en el producto estándar del proveedor, en lugar de quedar aislado como una rama muerta que solo esa empresa sostiene.

## El patrón que esto revela sobre la adopción empresarial de IA en general

Este hallazgo encaja con un patrón más amplio que ha ido apareciendo en distintas formas durante todo este año: la adopción de IA agéntica empresarial corrió, en la mayoría de los casos, más rápido que la infraestructura organizacional necesaria para sostenerla —ya sea en forma de gobernanza de datos, de claridad sobre propiedad de sistemas, o, como en este caso, de términos contractuales que anticipen el día después de que el proveedor se retire. El FDE no es un modelo defectuoso en sí mismo —sigue siendo, para muchas empresas, la única forma realista de poner en marcha un sistema complejo en un plazo razonable—, pero la proyección de Gartner sugiere que las empresas lo están tratando como una solución permanente cuando, estructuralmente, fue diseñado para ser una fase de transición hacia algo que la mayoría todavía no construyó: la capacidad interna de ser dueños de su propia infraestructura de IA.

## Fuentes

- [Gartner Predicts 70% of Enterprises Will Abandon Agentic AI Built by Vendor Forward-Deployed Engineering by 2028](https://www.gartner.com/en/newsroom/press-releases/2026-09-29-gartner-predicts-70-percent-of-enterprises-will-abandon-agentic-ai-built-by-vendor-forward-deployed-engineering-by-2028) — Gartner
- [Gartner Says 70% Of Firms May Abandon Vendor-Built Agentic AI](https://www.businessworld.in/article/70-of-firms-may-abandon-vendor-built-agentic-ai-gartner-626247) — BW Businessworld
- [Will costs see enterprises abandon third-party agentic AI?](https://www.digit.fyi/will-costs-see-enterprises-abandon-third-party-agentic-ai/) — Digit.fyi
- [AI agents from the vendor: Quickly built, hard to operate](https://www.heise.de/en/news/AI-agents-from-the-vendor-Quickly-built-hard-to-operate-11472468.html) — Heise Online
