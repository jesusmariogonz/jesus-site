---
titulo: 'En casi todas las empresas con las que he trabajado existe una hoja de cálculo de la que depende todo, y que nadie es responsable de mantener'
fecha: 2026-11-06
categoria: leadership
mundo: notas-de-campo
tags:
  - hoja de cálculo
  - shadow IT
  - gobierno de datos
  - infraestructura crítica
  - deuda técnica
  - experiencia profesional
  - riesgo operativo
  - cultura organizacional
resumen: 'Una reflexión desde la experiencia de implementar proyectos de datos en empresas reales: casi todas tienen, en algún rincón de su operación, un archivo construido por una sola persona que terminó convirtiéndose en infraestructura crítica —y que nadie en la organización asumió formalmente la responsabilidad de mantener, documentar ni respaldar.'
tesis: 'Que una pieza de infraestructura crítica termine construida y mantenida por una sola persona, sin presupuesto, documentación ni respaldo formal, es un patrón que se repite con independencia del tamaño, industria o madurez tecnológica de la organización; que ese patrón persista no se explica principalmente por falta de recursos —casi siempre hay presupuesto para herramientas más vistosas—, sino por que nadie asume el costo político de admitir, en voz alta, que la empresa depende de algo que no debería depender de una sola persona.'
datosClave:
  - valor: '1'
    etiqueta: 'Número típico de personas que entiende por completo cómo funciona esa pieza crítica de infraestructura no oficial, en la experiencia documentada en esta nota'
  - valor: '0'
    etiqueta: 'Presupuesto formal asignado, en la mayoría de los casos observados, al mantenimiento de esa misma pieza de infraestructura'
imagen: /blog/portadas/hoja-calculo-nadie-es-dueno-infraestructura-critica.jpg
socialImagen: /blog/social/hoja-calculo-nadie-es-dueno-infraestructura-critica.jpg
gancho: 'Pregúntale a cualquier empresa qué pasaría si la persona que mantiene "ese archivo" se fuera de vacaciones dos semanas sin avisar. La mayoría no tiene una buena respuesta — y la mayoría lo sabe.'
postura:
  pregunta: '¿Es razonable que las empresas sigan dependiendo, de forma rutinaria, de piezas de infraestructura crítica mantenidas informalmente por una sola persona sin presupuesto ni respaldo formal, o esa tolerancia es ya una falla de gestión de riesgos que las organizaciones deberían dejar de aceptar como algo normal?'
  aFavor: 'Formalizar y documentar cada herramienta crítica que surge de forma orgánica dentro de una organización tiene un costo real de tiempo y recursos que compite directamente con otras prioridades; en la práctica, ninguna empresa puede dar el mismo nivel de gobierno formal a cada proceso que termina siendo importante, y es razonable que ese esfuerzo se concentre en los sistemas que alguien identificó desde el diseño como estratégicos, no en los que crecieron de forma espontánea.'
  enContra: 'El argumento de "no hay tiempo para formalizarlo todo" deja de sostenerse en el momento en que una organización ya sabe, con certeza, qué pieza específica de infraestructura es crítica para su operación diaria —no se trata de adivinar cuál de cientos de procesos importa, sino de reconocer uno que todos en la empresa ya identifican informalmente como indispensable—; en ese punto, seguir sin asignarle presupuesto ni respaldo formal no es una limitación de recursos, es una decisión implícita de aceptar un riesgo operativo conocido sin nombrarlo como tal.'
---

En casi todas las empresas en las que he visto de cerca cómo funciona realmente la operación de datos, existe una pieza de infraestructura con una característica incómoda: todos saben que es crítica, nadie puede explicar del todo cómo funciona por dentro, y la persona que la construyó y mantiene no tiene, en la mayoría de los casos, ni el título ni el presupuesto que correspondería a algo de esa importancia. A veces es una hoja de cálculo con fórmulas encadenadas a lo largo de quince pestañas. A veces es un script de Python que corre en la laptop personal de alguien, programado para ejecutarse cada madrugada. A veces es una base de datos de Access heredada de un sistema que la empresa dejó de usar hace años, pero cuyo reporte semanal sigue alimentando una decisión que algún director toma todos los lunes sin saber de dónde viene realmente el número.

## El patrón se repite con una regularidad que debería incomodar

Lo llamativo no es que exista una de estas piezas en alguna empresa específica —eso sería anecdótico—; lo llamativo es la consistencia con la que aparece, con independencia del tamaño de la organización, de su industria, o de cuánto haya invertido en plataformas de datos modernas y gobernanza formal. He visto empresas con stacks tecnológicos sofisticados, con equipos de ingeniería de datos bien dotados, que de todas formas tienen, en algún rincón de su operación, una de estas piezas de infraestructura informal sosteniendo un proceso que nadie se atrevió a migrar formalmente. La inversión en tecnología moderna no elimina el patrón; simplemente lo desplaza hacia procesos más periféricos, pero rara vez lo erradica por completo.

## Por qué nadie levanta la mano para arreglarlo

La explicación más simple —que nadie tiene tiempo ni presupuesto— es cierta, pero incompleta. La razón más incómoda, y la que con más frecuencia explica por qué este patrón persiste incluso en organizaciones con recursos de sobra, es que formalizar esa pieza de infraestructura obliga a admitir, en voz alta y frente a quienes aprueban presupuestos, que la empresa ha estado operando con un riesgo conocido durante meses o años. Nadie quiere ser la persona que levanta la mano para decir "dependemos de un archivo que solo una persona entiende, y deberíamos haber arreglado esto hace tiempo," porque esa frase suena a admitir una falla de gestión, no a proponer una mejora. Es mucho más cómodo, políticamente, dejar que la pieza siga funcionando mientras no se rompa, que iniciar la conversación incómoda sobre por qué se permitió que llegara a ese punto.

## La persona que termina siendo el único punto de falla, sin haberlo pedido

Casi nunca es la persona que construyó originalmente esa pieza de infraestructura quien decidió, de forma deliberada, convertirse en el único punto de falla de un proceso crítico. Generalmente ocurrió de forma gradual: alguien resolvió un problema puntual con las herramientas que tenía a mano, ese problema resultó recurrente, la solución se volvió indispensable, y en algún punto —sin que nadie tomara explícitamente esa decisión— la empresa terminó dependiendo de que esa persona específica siguiera disponible, con buena memoria, y sin planes de cambiar de trabajo. Es una responsabilidad que creció silenciosamente hasta volverse desproporcionada frente al reconocimiento, la compensación o el respaldo que esa persona recibe por cargarla. Cuando finalmente esa persona se va —por renuncia, por promoción interna a otro equipo, o simplemente por vacaciones mal planeadas—, la organización descubre, generalmente en el peor momento posible, cuánto dependía de un conocimiento que nunca se documentó en ningún lugar accesible para nadie más.

## El costo que no aparece en ningún presupuesto hasta que es demasiado tarde

El riesgo que representa esta dependencia es, en un sentido estricto, cuantificable —cuánto costaría reconstruir ese proceso desde cero si la persona que lo mantiene desapareciera sin aviso, multiplicado por la probabilidad de que eso ocurra en un periodo razonable—, pero casi ninguna organización hace ese cálculo explícitamente hasta que la pieza falla y el costo ya es real en lugar de hipotético. Es la misma asimetría que aparece en otras formas de riesgo operativo mal gestionado: mientras el sistema funciona, invertir en volverlo más robusto se siente como gasto innecesario; en el momento en que falla, el costo de no haber invertido se vuelve evidente de golpe, generalmente en un momento de crisis donde ya no hay tiempo de resolverlo con calma.

## Lo que sí funciona, cuando funciona

En los pocos casos donde he visto a una organización resolver este patrón de forma genuina —no solo documentarlo superficialmente para cumplir con una auditoría—, el cambio no empezó con una herramienta nueva ni con más presupuesto de tecnología. Empezó con alguien en una posición de autoridad suficiente que decidió, explícitamente, nombrar el riesgo en voz alta frente a quienes podían asignar recursos, sin que eso se interpretara como una acusación hacia la persona que había estado cargando la responsabilidad informalmente. La diferencia entre una organización que corrige este patrón y una que lo deja crecer indefinidamente no es, casi nunca, la disponibilidad de recursos técnicos: es la disposición de alguien a absorber el costo político de decir, sin rodeos, que algo importante ha estado funcionando por pura inercia y buena voluntad individual, no por diseño deliberado.

## Por qué las herramientas modernas no resuelven esto por sí solas

Es tentador pensar que migrar esa hoja de cálculo o ese script personal a una plataforma moderna de datos —un almacén en la nube, una herramienta de orquestación, un dashboard corporativo con control de acceso— resuelve automáticamente el problema de fondo. En la práctica, lo que suele ocurrir es que la nueva herramienta hereda exactamente la misma estructura de dependencia personal, solo que con una interfaz más profesional: ahora en lugar de un archivo que solo una persona entiende, hay un pipeline de datos que solo una persona sabe depurar cuando falla, o un conjunto de transformaciones documentadas de forma incompleta que nadie más se ha tomado el tiempo de revisar línea por línea. La tecnología cambia la superficie del problema sin necesariamente tocar su causa, que es organizacional, no técnica: mientras ninguna persona distinta a la autora original tenga tiempo asignado explícitamente para entender el sistema a profundidad, la migración a una plataforma más sofisticada solo disfraza el mismo riesgo de punto único de falla con una capa de barniz tecnológico más convincente.

## Lo que distingue a una dependencia tolerable de una que ya no lo es

No toda dependencia en una sola persona es, por definición, un riesgo inaceptable: las organizaciones pequeñas, en particular, simplemente no tienen la escala para duplicar conocimiento en cada proceso, y exigir ese nivel de redundancia desde el primer día sería, en la práctica, paralizante. La línea que separa una dependencia razonable de una que ya debería preocupar a cualquier líder no es el número de personas que entienden el sistema, sino qué tan grande sería el daño si esa única persona desapareciera sin aviso, comparado con qué tan fácil sería, en ese escenario, encontrar a alguien capaz de reconstruir el proceso desde cero con la documentación disponible. Cuando esa reconstrucción tomaría semanas en lugar de días, y cuando la documentación disponible consiste, en la práctica, en la memoria de una sola persona, la dependencia ya cruzó la línea de lo tolerable —con independencia de cuánto tiempo haya estado funcionando sin incidentes hasta ese momento.

## La pregunta que vale la pena hacerse en cualquier organización

Si tuviera que resumir el ejercicio más útil que una empresa puede hacer sobre este tema, sería simplemente preguntarse: ¿qué pasaría si la persona que mantiene nuestra pieza más crítica de infraestructura informal se fuera, sin aviso, por dos semanas? La calidad de la respuesta a esa pregunta —específica, con un plan concreto, o vaga e incómoda— suele revelar con bastante precisión qué tan expuesta está realmente la organización a un riesgo que, hasta que ocurre, nadie tiene incentivos para nombrar.

## Fuentes

- Reflexión basada en experiencia profesional propia implementando proyectos de datos y analítica en distintas organizaciones; no se revela información confidencial ni se identifica a clientes o proyectos específicos.
- El concepto del "bus factor" (o "truck factor"), originario de la ingeniería de software, describe formalmente el riesgo de que el conocimiento crítico de un sistema dependa de un número mínimo de personas — el mismo fenómeno que esta nota describe desde la experiencia de implementación de proyectos de datos.

