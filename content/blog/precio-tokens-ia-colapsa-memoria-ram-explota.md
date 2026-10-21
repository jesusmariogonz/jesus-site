---
titulo: 'El precio de usar IA está colapsando. El precio de la memoria que la hace posible se cuadruplicó en un año. Las dos cosas son ciertas al mismo tiempo'
fecha: 2026-10-21
categoria: ia
mundo: ia-nueva-economia
tags:
  - costos de IA
  - tokens
  - memoria RAM
  - DRAM
  - HBM
  - infraestructura de IA
  - semiconductores
  - inferencia
  - OpenAI
  - precios
resumen: 'El costo de un millón de tokens de IA cayó más de 50% este año por la guerra de precios entre OpenAI, Anthropic y modelos chinos de código abierto, mientras el precio de la memoria DRAM que esos mismos modelos necesitan para funcionar subió hasta 98% en un solo trimestre. Un kit de memoria DDR5 que costaba 90 dólares hace un año hoy se vende, cuando se consigue, entre 300 y 500 dólares.'
tesis: 'Que el precio de los tokens caiga mientras el precio de la memoria sube no es una contradicción: son dos mercados distintos reaccionando al mismo evento —la competencia entre proveedores de modelos se libra sobre el margen de software, mientras la escasez de memoria refleja un cuello de botella físico de manufactura que ningún proveedor de IA controla directamente—, lo cual documenta que la "caída de precios de la IA" que domina el discurso actual describe solo una parte de su estructura de costos real, no toda ella.'
datosClave:
  - valor: '-50% o más'
    etiqueta: 'Caída del precio promedio de un millón de tokens de IA en 2026, según el índice de Silicon Data'
    periodo: '2026'
  - valor: '+90% a 98%'
    etiqueta: 'Alza trimestral de los precios de contrato de DRAM convencional, según TrendForce'
    periodo: 'T1 2026'
    fuente: 'TrendForce'
  - valor: '$90 → $300-500'
    etiqueta: 'Precio de un kit de memoria DDR5 de 32GB, de hace un año a hoy'
    fuente: 'Windows Central / Tom´s Hardware'
  - valor: '4 a 5 veces'
    etiqueta: 'Múltiplo del precio spot de un módulo HBM3E frente a su precio típico de contrato de largo plazo'
    periodo: 'sep-2026'
imagen: /blog/portadas/precio-tokens-ia-colapsa-memoria-ram-explota.jpg
socialImagen: /blog/social/precio-tokens-ia-colapsa-memoria-ram-explota.jpg
gancho: 'Un millón de tokens de IA nunca había sido tan barato. Un kit de memoria RAM nunca había sido tan caro. Ambas cosas están pasando exactamente al mismo tiempo, por la misma causa de fondo: la IA.'
postura:
  pregunta: '¿La guerra de precios de tokens entre OpenAI, Anthropic y modelos chinos es sostenible a mediano plazo, dado que el costo de la memoria que sostiene esa infraestructura está subiendo al mismo tiempo, o es una promoción de adquisición de mercado que tendrá que revertirse cuando el costo de hardware termine de trasladarse a los estados de resultados de estos proveedores?'
  aFavor: 'Las eficiencias de software e ingeniería —optimización de arquitecturas de modelo, mejor utilización de cómputo, modelos más pequeños con desempeño comparable— pueden, en principio, compensar durante un tiempo considerable el alza de costos de un solo insumo como la memoria, sobre todo si el insumo de memoria representa una fracción menor del costo total de inferencia frente al cómputo de GPU, lo que haría de la caída de precios de tokens una tendencia genuina de productividad, no solo una promoción insostenible.'
  enContra: 'Que Microsoft haya atribuido ya 25,000 millones de dólares de su presupuesto de IA específicamente a costos de memoria, y que la escasez de HBM —el tipo de memoria que alimenta directamente a los aceleradores de IA, no solo a las computadoras personales— se proyecte empeorar antes de mejorar según TrendForce, sugiere que el costo de memoria no es una variable menor y aislada del costo de inferencia, sino un insumo central cuyo alza eventualmente debe reflejarse en el precio que cobran los proveedores de modelos, lo que pondría en duda cuánto tiempo más la guerra de precios actual puede sostenerse sin ajustar precios al alza.'
---

El índice de gasto en tokens de modelos de lenguaje de Silicon Data marcó un mínimo histórico este año, con una caída de más de 50% frente a los máximos del verano, impulsada por recortes de precio de OpenAI de hasta 80% en algunos de sus modelos, ajustes similares de Anthropic, y la presión competitiva de modelos chinos de código abierto cada vez más capaces. En el mismo periodo, el precio de contrato de la memoria DRAM convencional —el tipo de memoria que usa prácticamente cualquier computadora, servidor o centro de datos— subió entre 90% y 98% en un solo trimestre, según TrendForce, mientras un módulo de memoria de alto ancho de banda (HBM), el tipo específico que alimenta a los aceleradores de IA más avanzados, llegó a cotizarse en el mercado spot hasta cinco veces por encima de su precio típico de contrato de largo plazo. Las dos tendencias —tokens más baratos, memoria más cara— no son noticias contradictorias sobre el mismo fenómeno: son evidencia de que la "era de la IA barata" que domina buena parte de la conversación pública describe solo una porción de la estructura de costos real detrás de esa tecnología.

## Dos mercados que responden a presiones distintas

El precio que un desarrollador paga por un millón de tokens de un modelo de lenguaje se determina, en gran medida, por la competencia entre un puñado de proveedores —OpenAI, Anthropic, Google, y un número creciente de laboratorios chinos como DeepSeek— que compiten activamente por cuota de mercado empresarial, con márgenes que cada uno está dispuesto a sacrificar temporalmente para ganar esa cuota. El precio de la memoria DRAM y HBM, en cambio, se determina por una dinámica de manufactura física: un número limitado de fabricantes —Samsung, SK Hynix, Micron— con capacidad de producción que no puede expandirse de un trimestre a otro, enfrentando una demanda que creció mucho más rápido de lo que esa capacidad permite satisfacer. Son, literalmente, dos mercados distintos —uno de servicio, determinado por competencia estratégica; otro de materia prima, determinado por restricciones de manufactura— que coexisten dentro de la misma cadena de valor de la inteligencia artificial sin que uno determine directamente al otro en el corto plazo.

## Por qué la escasez de memoria no es un problema menor

La razón que ofrece la propia industria de semiconductores para la escasez es, en esencia, un problema de asignación de capacidad: según declaraciones de un directivo de Micron citadas por reportes del sector, cada bit de capacidad de manufactura que una fábrica de memoria dedica a producir HBM para chips de IA es un bit que deja de producir memoria convencional para el resto del mercado —servidores corporativos, computadoras personales, consolas, teléfonos—. Esa asignación de capacidad no es trivial: Microsoft atribuyó explícitamente 25,000 millones de dólares de su presupuesto de infraestructura de IA de este año específicamente a costos de memoria, una cifra que documenta que este insumo específico ya pesa de forma material en el balance de al menos uno de los hiperescaladores que financian el boom de infraestructura de IA.

## El efecto que ya llegó al consumidor final

El impacto de esta escasez no se quedó confinado al mercado de infraestructura empresarial: un kit de memoria DDR5 de 32 gigabytes que costaba alrededor de 90 dólares hace apenas un año se vende hoy, cuando se consigue, entre 300 y 500 dólares, según reportes de Tom's Hardware y Windows Central que documentan el mismo fenómeno de forma independiente. El efecto se extendió también a computadoras prebuilt y consolas: una Alienware Aurora 16 que costaba 1,099 dólares en julio de 2025 se vende ahora en 1,999 dólares, y la consola Steam Machine debutó con un precio de 1,049 dólares, una cifra considerablemente mayor a la que el segmento de consolas de escritorio ha manejado tradicionalmente. Un estudio citado por Windows Central proyecta que los envíos globales de computadoras personales podrían caer 10.4% este año, lo que sugiere que la escasez de memoria ya está alterando decisiones de compra de consumidores que no tienen ninguna relación directa con el desarrollo de inteligencia artificial, pero que terminan absorbiendo el costo de un insumo que la industria de IA está consumiendo de forma desproporcionada.

## Lo que esto implica para la sostenibilidad de la guerra de precios de tokens

La pregunta de fondo que esta combinación de tendencias plantea es cuánto tiempo más los proveedores de modelos de lenguaje pueden seguir bajando el precio de los tokens si uno de los insumos centrales de su infraestructura —la memoria de alto ancho de banda que alimenta directamente a sus aceleradores de cómputo— se vuelve estructuralmente más cara, no más barata. Hay dos lecturas posibles, y ninguna de las fuentes consultadas permite descartar completamente ninguna de las dos con la evidencia disponible hoy. La primera es que las eficiencias de ingeniería de software —modelos más pequeños y eficientes, mejor utilización de cómputo existente, arquitecturas que requieren menos memoria por unidad de inferencia— puedan seguir compensando el alza de costos de memoria durante un tiempo considerable, de forma que la caída de precios de tokens refleje una ganancia de productividad genuina y no solo una promoción financiada con pérdidas. La segunda es que la guerra de precios actual sea, en el fondo, una estrategia de adquisición de cuota de mercado que los proveedores están dispuestos a sostener con márgenes negativos mientras compiten por posicionarse como el estándar empresarial dominante, y que el costo real de la memoria eventualmente tenga que trasladarse al precio que pagan los desarrolladores, en cuyo caso la "era de la IA barata" sería, en retrospectiva, una fase transitoria de esta industria, no su estado permanente.

## Lo que TrendForce proyecta, y por qué no ofrece alivio inmediato

Las proyecciones disponibles no sugieren que la presión de precios de memoria vaya a ceder en el corto plazo: TrendForce anticipa que los precios de contrato de HBM podrían subir más de 50% adicional en 2027 frente a los niveles de 2026, y reportes del sector indican que Micron ya aseguró buena parte de su capacidad de producción de DRAM mediante contratos de largo plazo que se extienden hasta 2030 —un compromiso que, de confirmarse a esa escala, sugiere que la escasez actual no es un desajuste temporal de oferta y demanda que el mercado corrija en los próximos trimestres, sino una reconfiguración más duradera de hacia dónde se dirige la capacidad de manufactura de memoria a nivel global, con la demanda de infraestructura de IA como el factor que reordenó esa asignación de forma que probablemente no revierta pronto.

## Quién termina absorbiendo el costo que nadie ve en el titular

Hay una asimetría importante en cómo se reparte el costo de esta escasez que rara vez se discute junto a la narrativa de precios de tokens en caída. El desarrollador empresarial que construye una aplicación sobre la API de un modelo de lenguaje experimenta, en su factura mensual, únicamente el lado favorable de la historia: paga menos por token que hace un año. El costo de la memoria más cara no desaparece, simplemente se traslada hacia otros puntos de la cadena —el presupuesto de capex de los hiperescaladores que compran los aceleradores, el precio que paga cualquier comprador de una computadora personal nueva, el margen que absorben fabricantes de servidores y de consolas que no tienen relación directa con el negocio de modelos de lenguaje—. Es, en ese sentido, un costo que se redistribuye de forma difusa hacia actores que no necesariamente se benefician de la misma guerra de precios que está presionando al alza la demanda de memoria que ellos también necesitan comprar.

## La pregunta que separar ambos mercados no resuelve

Tratar el mercado de tokens y el mercado de memoria como fenómenos independientes es correcto en términos de qué actores fijan cada precio, pero no es correcto si lo que se busca es entender la sostenibilidad del ecosistema completo de infraestructura de IA. Ambos mercados están conectados por un vínculo de demanda compartida: cada nuevo centro de datos que se construye para sostener la próxima generación de modelos de lenguaje más baratos por token requiere, precisamente, la misma memoria de alto ancho de banda cuyo precio se disparó por esa misma demanda. En ese sentido, la caída de precios de tokens y el alza de precios de memoria no son dos historias paralelas que coincidieron por casualidad: son dos consecuencias medibles del mismo ciclo de inversión, observadas desde dos puntos distintos de la cadena de valor, y entender una sin la otra deja una imagen incompleta de qué tan barata —o cara— es realmente la inteligencia artificial en este momento del ciclo.

## Fuentes

- [DRAM prices up 90% in a quarter: how the AI memory grab is creating a 40-week wait for enterprise infrastructure](https://www.comparethecloud.net/news/dram-prices-up-90-in-a-quarter-how-the-ai-memory-grab-is-creating-a-40-week-wait-for-enterprise-infr) — Compare the Cloud
- [One year into the AI-induced RAM apocalypse: how much does memory actually cost, and is there hope for a more affordable future?](https://www.tomshardware.com/pc-components/ram/one-year-into-the-ai-induced-ram-apocalypse-how-much-does-memory-actually-cost-and-is-there-hope-for-a-more-affordable-future) — Tom's Hardware
- [RAM crisis: when will end prices drop? An analysis](https://www.windowscentral.com/hardware/ram-crisis-when-end-prices-drop-analysis) — Windows Central
- [AI token prices hit new record lows as inference costs plunge 43% in ten weeks](https://cryptobriefing.com/ai-token-prices-record-lows/) — Cryptobriefing
- [Microsoft attributed $25 billion of its record AI budget to memory chip costs](https://www.tomshardware.com/tech-industry/big-tech/microsoft-attributed-25-billion-of-its-record-ai-budget-to-memory-chip-costs) — Tom's Hardware
</content>
</invoke>
