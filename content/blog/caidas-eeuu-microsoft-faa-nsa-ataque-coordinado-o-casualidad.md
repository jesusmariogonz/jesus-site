---
titulo: 'Tres caídas en cinco días en Estados Unidos, de Microsoft a la FAA y la NSA: no hay evidencia de un ataque coordinado, pero el patrón que sí aparece es más incómodo'
fecha: 2026-11-17
categoria: cloud
mundo: tecnologia-y-negocio
tags:
  - infraestructura crítica
  - Microsoft 365
  - FAA
  - NSA
  - ciberseguridad
  - actualizaciones de software
  - infraestructura pública
resumen: 'Entre el 12 y el 17 de noviembre fallaron Microsoft 365, el control del tráfico aéreo de EE. UU. y la red interna de la NSA. Las autoridades y las fuentes consultadas descartan por ahora un ciberataque, y cada caída tiene una causa distinta. Pero las tres comparten algo menos llamativo que una conspiración: un cambio o actualización en sistemas muy interconectados, que falló.'
tesis: 'Es un hecho documentado que tres sistemas críticos fallaron en cinco días, que las autoridades no encuentran evidencia de un ataque coordinado y que en las tres las causas declaradas apuntan a cambios o actualizaciones en la infraestructura. Mi interpretación es que la coincidencia no prueba una conspiración, sino un riesgo más ordinario y más difícil de corregir: modernizar sistemas viejos y muy interconectados es, en sí mismo, la operación más peligrosa.'
datosClave:
  - valor: '≈ 4 h 20 min'
    etiqueta: 'Duración de la parada nacional de despegues de la FAA, de 3:54 pm a 8:15 pm ET; la falla afectó a 17 de los 22 centros de control de ruta'
    periodo: '13-nov-2026'
    fuente: 'ABC News, Al Jazeera'
  - valor: '≈ 24 h'
    etiqueta: 'Ventana de la caída global de Microsoft 365 (Outlook, Teams, Copilot), según el tiempo reportado por la prensa; Microsoft dijo que no hubo ataque'
    periodo: '12–13-nov-2026'
    fuente: 'Al Jazeera y otros medios'
  - valor: '$50 mil M'
    etiqueta: 'Presupuesto que pidió el secretario de Transporte para modernizar el control aéreo, frente a 30 mil M que había pedido antes; el Congreso aprobó 12.5 mil M el año pasado'
    periodo: '2026'
    fuente: 'Al Jazeera'
imagen: /blog/portadas/caidas-eeuu-microsoft-faa-nsa-ataque-coordinado-o-casualidad.jpg
socialImagen: /blog/social/caidas-eeuu-microsoft-faa-nsa-ataque-coordinado-o-casualidad.jpg
gancho: 'Microsoft, el control aéreo y la red de la NSA fallaron en cinco días. ¿Ataque coordinado? Las evidencias dicen que no. Pero las tres fallas comparten algo más incómodo: las tres empezaron con una actualización. ¿Es modernizar la infraestructura el verdadero riesgo?'
postura:
  pregunta: '¿La respuesta a estas fallas debe ser una gran inversión pública para renovar la infraestructura crítica, o el problema de fondo es cómo se gestionan los cambios y más dinero no lo resolvería?'
  aFavor: 'El propio secretario de Transporte describe un sistema de control aéreo "increíblemente viejo", con telecomunicaciones analógicas, y advierte que "habrá más de estas" caídas sin financiamiento. Pasó de pedir 30 a 50 mil millones de dólares, y el Congreso aprobó 12.5 mil millones el año pasado: es una brecha de inversión que se documenta sola. Un sistema del que dependen miles de vuelos no puede seguir remendándose con equipo heredado, y esto es exactamente lo que el gasto público en infraestructura debe resolver.'
  enContra: 'La caída de la FAA la detonó precisamente la modernización: un contratista reemplazaba cableado de cobre por fibra óptica cuando un enrutador se sobrecargó y se propagó la falla. Y Microsoft, una de las empresas con más recursos del mundo, también cayó por un cambio de capacidad de red, no por falta de dinero. Si las fallas nacen de cómo se hacen los cambios (pruebas, aislamiento, reversión), una partida mayor sin mejores prácticas de gestión del cambio puede producir más actualizaciones riesgosas, no menos fallas.'
---

Entre el 12 y el 17 de noviembre fallaron tres sistemas de los que depende buena parte de Estados Unidos: los servicios de nube y productividad de Microsoft, el control del tráfico aéreo y la red interna de comunicaciones de la NSA. Cuando tres cosas así se rompen en una semana, la pregunta es inevitable: ¿ataque coordinado o casualidad? La evidencia disponible apunta a que no es un ataque, aunque las investigaciones siguen abiertas.

## Qué pasó

**Microsoft, 12 y 13 de noviembre.** Microsoft 365, incluidos Outlook, Teams y Copilot, tuvo una caída global de aproximadamente un día, de las más largas de su historia, según la cobertura de [Al Jazeera](https://aljazeera.com/news/2026/11/13/microsoft-hit-by-global-outages-what-happened-and-why) y otros medios. La compañía atribuyó el problema, en una explicación preliminar, a una falla ligada a una actualización de capacidad de red, y dijo que no hubo ataque. Hasta donde pude revisar, su informe de causa raíz completo todavía no se había publicado.

**FAA, 13 de noviembre.** La FAA ordenó a las 3:54 pm ET una parada nacional de despegues que duró hasta las 8:15 pm, unas cuatro horas y veinte minutos, según [ABC News](https://abcnews.com/US/nationwide-ground-stop-ordered-airports-faa/story?id=138121848). Después hubo más de 9,000 vuelos cancelados ese día y más de 5,000 al siguiente, según [Al Jazeera](https://www.aljazeera.com/news/2026/11/15/what-forced-the-us-to-ground-all-planes-a-router-switch-we-now-know). El secretario de Transporte, Sean Duffy, explicó que un contratista, L3Harris, reemplazaba cableado de cobre por fibra óptica en un sitio remoto, y que un enrutador empezó a sobrecargar el sistema; la falla llegó a 17 de los 22 centros de control de ruta. Duffy dijo que aún no se había determinado si fue "error del contratista o equipo defectuoso".

**NSA, 17 de noviembre.** La red interna clasificada de la NSA quedó fuera de servicio, según CNN con seis fuentes, según recogen [El Español](https://elespanol.com/mundo/america/eeuu/20261117/eeuu-sufre-caida-red-interna-comunicaciones-agencia-nacional-seguridad-cnn/1003744461849_0.html) y otros medios. La agencia no ha confirmado públicamente el incidente ni su causa. Una fuente citada por el Wall Street Journal lo atribuyó a actualizaciones de software para parchar el sistema, pero esa explicación no está confirmada.

## ¿Ataque coordinado?

Hasta ahora, no hay evidencia de eso, y en cada caso la respuesta es distinta:

- **FAA:** la Casa Blanca convocó una reunión de emergencia por posibles motivos cibernéticos, y el secretario de Seguridad Nacional, Markwayne Mullin, dijo ese día que nada indicaba un ciberataque, aunque no lo descartaba del todo. Después los funcionarios lo descartaron: Duffy dijo que no creen que haya sido cibernético "en absoluto" y el administrador de la FAA, Bryan Bedford, habló de "cero evidencia de algo malicioso".
- **Microsoft:** la empresa dijo que no hubo ataque, aunque su causa raíz definitiva falta.
- **NSA:** las fuentes de CNN dicen que no hay evidencia de ciberataque, pero es una afirmación anónima, no oficial.

Hay que ser claro con los límites. "No hay evidencia" no es "está demostrado que no". Los tres casos siguen en investigación, dos de las causas son preliminares y en la NSA no hay declaración oficial.

También hay que separar dos cosas que se mezclan en redes. Circuló un supuesto "apagón mundial" para el 17 de noviembre que las autoridades y verificadores desmienten: lo que ese día estaba programado era una prueba nacional del sistema de alertas de emergencia de FEMA. Y el ciberataque a Optimizely del 16 de noviembre, [que analizamos aquí](/blog/optimjack-optimizely-ataque-178-organizaciones-que-esta-confirmado), fue un ataque real, pero de otro tipo: inyectó código malicioso en sitios, no tumbó servicios, y tampoco hay evidencia de que esté conectado con estas caídas.

## Lo que sí tienen en común

Las tres caídas, según las causas que han dado las fuentes, empiezan con un cambio en la infraestructura: una actualización de capacidad de red en Microsoft, un reemplazo de cableado en la FAA y, según una fuente no confirmada, actualizaciones de software en la NSA. Ninguna de esas explicaciones está plenamente confirmada, pero el patrón es consistente.

Y es un patrón que reconocen incluso los funcionarios. Duffy describió el sistema de control aéreo como "increíblemente viejo", basado en telecomunicaciones analógicas, y dijo: "habrá más de estas". Pidió 50 mil millones de dólares al Congreso, frente a 30 mil millones que había pedido antes, y el Congreso aprobó 12.5 mil millones el año pasado, según Al Jazeera.

## Dónde termina el hecho y empieza la interpretación

Es un hecho que tres sistemas críticos fallaron en cinco días, que las autoridades no encuentran por ahora evidencia de un ataque coordinado y que las causas declaradas en los tres casos apuntan a cambios o actualizaciones. También lo es que el funcionario a cargo de la FAA admite que depende de equipo heredado.

Mi lectura es que la coincidencia no sostiene una teoría de conspiración, pero sí señala algo menos espectacular y más difícil de arreglar: modernizar sistemas viejos y muy interconectados es la operación de mayor riesgo que existe. Hay un argumento a favor de más inversión pública, porque un sistema del que dependen miles de vuelos no debería correr con equipo analógico. Pero la evidencia de este caso también muestra que el dinero no basta: la falla de la FAA la detonó una modernización, y Microsoft, con recursos de sobra, cayó por un cambio de red. Las investigaciones podrían cambiar este cuadro; por ahora, lo razonable es dudar de la conspiración y tomar en serio la fragilidad.

*Fuentes: [Al Jazeera, falla de la FAA](https://www.aljazeera.com/news/2026/11/15/what-forced-the-us-to-ground-all-planes-a-router-switch-we-now-know); [ABC News, parada nacional de la FAA](https://abcnews.com/US/nationwide-ground-stop-ordered-airports-faa/story?id=138121848); [Al Jazeera, caída de Microsoft](https://aljazeera.com/news/2026/11/13/microsoft-hit-by-global-outages-what-happened-and-why); [El Español, caída de la red de la NSA](https://elespanol.com/mundo/america/eeuu/20261117/eeuu-sufre-caida-red-interna-comunicaciones-agencia-nacional-seguridad-cnn/1003744461849_0.html).*
