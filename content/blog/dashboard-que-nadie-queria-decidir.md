---
titulo: 'El dashboard que nadie pidió para decidir, sino para no tener que hacerlo'
fecha: 2026-11-04
categoria: leadership
mundo: notas-de-campo
tags:
  - toma de decisiones
  - cultura organizacional
  - business intelligence
  - gobierno de datos
  - liderazgo
  - evasión de responsabilidad
  - dashboards
  - experiencia profesional
resumen: 'Una reflexión desde la experiencia de implementar proyectos de datos en empresas reales: muchas solicitudes de "más visibilidad" o "un dashboard que nos diga qué hacer" no buscan información nueva, sino un lugar legítimo donde depositar una decisión que nadie en la sala quiere firmar con su nombre.'
tesis: 'Que un equipo pida un dashboard después de tener ya, en una hoja de cálculo o en una junta previa, suficiente información para decidir, es un patrón observable en la práctica de implementar estas herramientas; que ese patrón sea evidencia de evasión deliberada de responsabilidad, y no de un genuino problema de visibilidad de datos, es una interpretación —plausible dado lo que se repite una y otra vez entre industrias distintas, pero no demostrable caso por caso sin acceso a la intención real de quien pide la herramienta.'
datosClave:
  - valor: '70%'
    etiqueta: 'Proporción de iniciativas de transformación organizacional que, según estimaciones recurrentes en la literatura de change management, no logran los resultados esperados pese a contar con datos e información suficientes'
    fuente: 'McKinsey, estimaciones de change management citadas de forma recurrente desde la década de 2000'
imagen: /blog/portadas/dashboard-que-nadie-queria-decidir.jpg
socialImagen: /blog/social/dashboard-que-nadie-queria-decidir.jpg
gancho: 'Piden un dashboard. Dicen que es para "tener más visibilidad". Pero cuando por fin se los entregas, nadie lo abre más de dos veces — porque lo que en realidad necesitaban no era ver mejor, sino tener a quién culpar.'
postura:
  pregunta: '¿Es la sobreproducción de dashboards y reportes en las empresas, sobre todo los que nadie termina usando, principalmente un problema técnico de diseño de producto de datos, o es, en una proporción relevante de los casos, un síntoma de una cultura organizacional que evita asignar responsabilidad individual sobre decisiones?'
  aFavor: 'Atribuir el abandono de dashboards a "evasión de responsabilidad" es una lectura psicologizante y poco verificable; la explicación más simple y defendible sigue siendo que la mayoría de estas herramientas están mal diseñadas, no responden la pregunta de negocio correcta, o llegan tarde respecto al ciclo real de decisión —un problema de producto, no de carácter organizacional.'
  enContra: 'El patrón se repite con una regularidad que un problema de diseño de producto, por sí solo, no explica bien: equipos que ya tenían la cifra que necesitaban en una hoja de cálculo o en una junta anterior, y que aun así insisten en formalizarla en un dashboard antes de actuar, están comprando tiempo y diluyendo autoría de una decisión que ya podían haber tomado —un patrón que trasciende industrias y herramientas específicas, lo que apunta a algo más estructural que un simple defecto técnico.'
---

Hay una escena que se repite, con variaciones menores, en proyectos de datos de industrias que no tienen nada más en común entre sí: manufactura, servicios financieros, retail, logística. Un equipo directivo pide, con urgencia aparente, "más visibilidad" sobre un problema —rotación de inventario, cancelaciones de clientes, costos de una línea de producción—. Se construye el dashboard, a veces en semanas, a veces en meses de iteración con el área de negocio. Se entrega. Se celebra en una junta. Y entonces, en la mayoría de los casos que he visto de cerca, algo curioso ocurre: el dashboard se abre dos o tres veces, y después nadie vuelve a tocarlo —ni para decidir con él, ni para pedir que se mejore—. La pregunta que vale la pena hacerse no es por qué el dashboard fue mal diseñado. Es por qué, en primer lugar, se pidió.

## La hipótesis que no aparece en ningún documento de requerimientos

Ningún equipo de negocio redacta, en el documento de requerimientos de un proyecto de analítica, la frase real que está detrás de la solicitud: "necesitamos algo que nos permita posponer esta decisión sin que parezca que la estamos posponiendo." Pero esa frase, aunque nunca se escriba, es a menudo la motivación operativa más honesta detrás de pedir "más datos" antes de actuar. La información que termina en el dashboard, en una proporción incómoda de los casos, ya estaba disponible antes del proyecto —en una hoja de cálculo que alguien del equipo ya mantenía de forma manual, o en una cifra que alguien mencionó en una junta tres meses antes y que nadie quiso convertir en una decisión en ese momento—. Lo que cambia con el dashboard no es la información. Es quién puede ser señalado si la decisión que finalmente se toma, basada en esos números, resulta equivocada.

Esto no es cinismo gratuito hacia quienes piden estas herramientas. Es, más bien, una lectura generosa de por qué alguien racional, dentro de una estructura jerárquica real, prefiere un reporte compartido y visible por todos a una decisión que lleva su nombre solo. Un dashboard institucionaliza la evidencia: si la decisión sale mal, "los números decían eso" es una defensa disponible para todos los que estuvieron en la sala. Una decisión tomada sin ese respaldo visual compartido, en cambio, tiene un propietario mucho más claro cuando algo falla.

## Cómo se ve la evasión disfrazada de rigor

El patrón tiene una secuencia reconocible. Primero, alguien pregunta "¿tenemos datos sobre esto?" en una junta donde, en realidad, ya hay suficiente evidencia cualitativa o anecdótica para decidir una dirección razonable. Segundo, se asigna un proyecto de datos para "tener certeza" antes de actuar —una certeza que, en la gran mayoría de las decisiones de negocio reales, nunca llega al 100%, ni debería exigirse que llegue—. Tercero, el proyecto se entrega, y la decisión que originalmente motivó el pedido se toma, finalmente, varios meses después de cuando pudo haberse tomado con la información disponible desde el principio. Cuarto —y esta es la parte que rara vez se documenta— nadie evalúa después si el dashboard cambió realmente la decisión que se tomó, o si simplemente la retrasó con una capa adicional de validación institucional.

Lo que hace a este patrón difícil de combatir desde el lado técnico es que se parece, en la superficie, a buenas prácticas legítimas de gobierno de datos: "decidir con evidencia," "no actuar sin datos," "validar antes de comprometer recursos." Un equipo de datos que intenta señalar que la solicitud en realidad busca diferir responsabilidad, en lugar de resolver un vacío de información genuino, corre el riesgo de sonar como el obstáculo al rigor, cuando en realidad está señalando lo contrario: que el rigor ya existía antes del proyecto, y que lo que faltaba no era evidencia sino disposición a actuar sobre ella.

## Por qué esto no es exclusivo de los datos

Este fenómeno tiene un pariente bien documentado en la literatura de ciencias del comportamiento: la "evitación de decisiones" (decision avoidance), estudiada desde los años noventa en el campo de la psicología del juicio y la toma de decisiones. Una de las observaciones más consistentes de esa literatura es que las personas, cuando enfrentan una decisión con consecuencias potencialmente negativas y reversibilidad incierta, prefieren de forma sistemática mantener el statu quo o diferir la decisión, incluso cuando diferirla tiene un costo de oportunidad medible —con tal de evitar la responsabilidad directa de haber elegido activamente un curso de acción que después resulte equivocado. Lo que cambia en el contexto corporativo moderno es simplemente el vehículo: antes era un comité, un estudio externo, una segunda opinión de consultoría; hoy es, con frecuencia, un dashboard.

La diferencia no es trivial para quienes construyen estas herramientas. Un comité o un estudio de consultoría, al menos, suelen tener un costo visible y un plazo definido que limita cuántas veces se puede recurrir a ellos como mecanismo de diferimiento. Un dashboard, una vez construido, se convierte en una fuente de legitimación disponible de forma permanente y gratuita —lo que, paradójicamente, puede hacer que una organización se vuelva más lenta para decidir después de invertir en "más visibilidad," no más rápida, porque ahora existe un lugar institucionalizado donde refugiar cualquier decisión incómoda bajo la apariencia de estar esperando "los datos completos."

## Lo que sí se puede observar, sin necesidad de leer intenciones

Aunque la motivación exacta detrás de cada solicitud de dashboard es, por definición, algo que no se puede verificar desde fuera de la cabeza de quien la hace, hay una señal operativa que sí es observable y que distingue de forma razonablemente confiable un pedido genuino de visibilidad de uno que funciona como mecanismo de diferimiento: si la pregunta de negocio que el dashboard debería responder ya tenía, antes del proyecto, una respuesta razonable disponible —aunque fuera imperfecta, aunque viniera de una fuente menos formal que un sistema de analítica— y aun así se exigió formalizarla antes de actuar, vale la pena preguntarse qué cambió, salvo la autoría visible de la decisión. No es una prueba. Es, en el mejor de los casos, una señal que un equipo de datos puede usar para hacer la pregunta incómoda en el momento correcto: ¿qué decisión específica, tomada por quién, depende de que esto exista?

## El costo que no aparece en el caso de negocio de ningún proyecto

Los casos de negocio que justifican estos proyectos casi nunca cuantifican el costo del tiempo que la organización pasó decidiendo más lento mientras esperaba el dashboard que, al final, confirmó lo que ya se sabía. Ese costo es real —semanas o meses de inacción sobre un problema ya identificado— pero es invisible en cualquier métrica de retorno de inversión que se le presente a un comité directivo, porque no hay una línea contable para "decisiones que se tomaron tarde por exceso de prudencia institucional." Lo único que sí queda documentado, casi siempre, es el costo de construir la herramienta: las horas del equipo de datos, la licencia de la plataforma de visualización, el tiempo de las juntas de validación de requerimientos. El costo de oportunidad de haber decidido antes se pierde, casi por diseño, en la contabilidad de cualquier proyecto de este tipo.

Hay una manera relativamente sencilla, aunque incómoda de aplicar en la práctica, de empezar a hacer visible esa segunda brecha: antes de aprobar un proyecto de visibilidad o un nuevo dashboard, preguntar explícitamente qué decisión concreta está pendiente hoy, con qué información se cuenta ya para tomarla, y quién la tomaría si el proyecto no existiera. Si la respuesta a esa última pregunta es "nadie, porque nadie quiere ser quien decida sin el reporte," la organización no tiene, en sentido estricto, un problema de datos —tiene un problema de quién carga con el resultado de decidir, y ningún tablero de control, por bien diseñado que esté, va a resolver eso. Los equipos de datos que empiezan a hacer esa pregunta de forma sistemática, antes de comprometer meses de trabajo en construir la herramienta, descubren con cierta frecuencia que la mitad de las solicitudes que llegan a su cola de trabajo se disuelven solas, o se convierten en una conversación de veinte minutos en lugar de un proyecto de dos meses.

Lo que queda, después de ver este patrón repetirse en contextos que no comparten industria, tamaño de empresa ni cultura corporativa, es una pregunta más incómoda que cualquier hallazgo técnico sobre calidad de datos o diseño de interfaz: cuántas de las "brechas de visibilidad" que financian estos proyectos son, en realidad, brechas de disposición a decidir —y si alguna vez una organización está dispuesta a medir esa segunda brecha con el mismo rigor que exige para la primera.

## Fuentes

- Investigación propia basada en experiencia profesional implementando proyectos de datos y analítica en distintas organizaciones; no se revela información confidencial ni se identifica a clientes o proyectos específicos.
- Kahneman, D. y Tversky, A., *Choices, Values, and Frames*, 2000 — marco de referencia para la literatura de evitación de decisiones (decision avoidance) citada en la nota.
- Anderson, C. J., "The psychology of doing nothing: forms of decision avoidance result from reason and emotion", *Psychological Bulletin*, 2003 — revisión académica del fenómeno de evitación de decisiones.
