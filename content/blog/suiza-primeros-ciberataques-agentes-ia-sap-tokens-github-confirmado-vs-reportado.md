---
titulo: 'Suiza confirma sus primeros ciberataques con agentes de IA y SAP investiga el robo de tokens en GitHub: qué está confirmado, qué es solo reporte y qué conecta, o no, a los dos casos'
fecha: 2026-11-27
categoria: cloud
mundo: tecnologia-y-negocio
tags:
  - ciberseguridad
  - agentes de IA
  - Suiza
  - SAP
  - GitHub
  - infraestructura crítica
  - cadena de suministro
resumen: 'La oficina de ciberseguridad de Suiza publicó el 24 de noviembre sus primeros casos confirmados de ciberataques con agentes de IA y, según su director en una entrevista del 26, son cinco casos, tres contra infraestructura crítica, sin interrupciones importantes. Esta semana, SAP confirmó que investiga un incidente tras reportes de que atacantes usaron tokens robados de empleados para copiar y alterar código en GitHub. SAP no ha confirmado la participación de IA, y ningún reporte indica que código alterado haya llegado a clientes.'
tesis: 'Es un hecho documentado que Suiza reporta ataques con agentes de IA y que SAP investiga un robo de tokens; no está confirmado que el segundo se haya hecho con IA. Mi interpretación es que lo más útil de ambos casos no es el adjetivo "IA", sino lo que revelan: los agentes explotan contraseñas débiles y fallas conocidas, y los tokens robados abren puertas legítimas. La defensa que recomienda la autoridad suiza es higiene básica, hecha más rápido.'
datosClave:
  - valor: '5'
    etiqueta: 'Casos confirmados de ciberataques con agentes de IA en Suiza, según el director de la oficina federal de ciberseguridad en una entrevista con la radio SRF'
    periodo: '26-nov-2026'
    fuente: 'Keystone-SDA vía swissinfo'
  - valor: '3 de 5'
    etiqueta: 'Casos dirigidos contra operadores de infraestructura crítica; sin interrupciones importantes, y se desconoce quién está detrás'
    periodo: '26-nov-2026'
    fuente: 'Keystone-SDA vía swissinfo'
  - valor: 'Casi 2×'
    etiqueta: 'Aumento, desde octubre de 2026, de los agentes de IA ofensivos accesibles en internet; cuenta herramientas, no ataques ni víctimas'
    periodo: 'Oct–nov 2026'
    fuente: 'Oficina federal de ciberseguridad de Suiza'
  - valor: '24 horas'
    etiqueta: 'Plazo máximo que recomienda la autoridad suiza para instalar actualizaciones críticas en sistemas expuestos a internet'
    periodo: '24-nov-2026'
    fuente: 'Oficina federal de ciberseguridad de Suiza'
imagen: /blog/portadas/suiza-primeros-ciberataques-agentes-ia-sap-tokens-github-confirmado-vs-reportado.jpg
socialImagen: /blog/social/suiza-primeros-ciberataques-agentes-ia-sap-tokens-github-confirmado-vs-reportado.jpg
gancho: 'Suiza confirma ataques con agentes de IA contra infraestructura crítica y SAP investiga el robo de tokens de sus empleados en GitHub. ¿Son la misma historia? Lo confirmado es menos de lo que sugieren los titulares.'
postura:
  pregunta: '¿Hay que restringir el acceso a las herramientas ofensivas de IA de uso dual, o la respuesta debe concentrarse en reforzar la higiene básica de seguridad de las empresas?'
  aFavor: 'La oficina suiza dice que el número de agentes ofensivos accesibles en internet casi se duplicó desde octubre y que encuentran y explotan sistemas vulnerables en una fracción del tiempo que tardaría una persona. Si el costo y el tiempo del ataque caen para cualquiera, limitar la distribución de las herramientas más agresivas y exigir controles a quienes las publican reduce el número de atacantes capaces, algo que los parches por sí solos no hacen.'
  enContra: 'Las mismas herramientas sirven a los equipos de seguridad para probar sus propias redes, y las que ya circulan en internet no se pueden retirar. Además, la propia autoridad suiza describe fallas muy básicas: contraseñas por defecto o fáciles de adivinar y vulnerabilidades ya conocidas, y sus recomendaciones son parches en 24 horas, autenticación multifactor sin excepciones y menos sistemas expuestos. Restringir herramientas es difícil de aplicar; invertir en lo básico sí está al alcance de cada empresa.'
---

Dos noticias de seguridad coinciden esta semana y conviene no mezclarlas: Suiza confirmó que ha visto sus primeros ciberataques realizados con ayuda de agentes de IA, y SAP confirmó que investiga un incidente que, según reportes de prensa, involucra el robo de credenciales de empleados y el acceso a su código en GitHub. Lo que las une, por ahora, es el tema. Lo que está probado en cada caso es distinto.

## Suiza: qué dice la autoridad

El 24 de noviembre, la oficina federal de ciberseguridad de Suiza, que su página en inglés identifica como NCSC, publicó el aviso "Cyberattacks involving AI agents: First confirmed cases in Switzerland". Dice que recibió sus primeros reportes "en los últimos días" y que las organizaciones afectadas abarcan al menos dos sectores. Califica los casos de un "cambio en el panorama de amenazas cibernéticas".

El aviso describe los agentes como "marcos ofensivos agénticos" que buscan vulnerabilidades por su cuenta, eligen herramientas de ataque, evalúan los resultados y planean los siguientes pasos. Según el texto, explotan contraseñas por defecto o fáciles de adivinar y vulnerabilidades conocidas, cambian a otros métodos cuando se encuentran con defensas y necesitan a menudo solo una fracción del tiempo que tardaría una persona. Son de uso dual: sirven a especialistas en seguridad para pruebas de penetración y a los atacantes para entrar a redes. El número de agentes accesibles en internet, como los llamados ARTEX y CyberStrikeAI que cita como ejemplos, casi se duplicó desde octubre de 2026.

Las cifras salieron dos días después. Según el resumen de la agencia Keystone-SDA publicado por swissinfo el 26 de noviembre, el director de la oficina dijo a la radio pública SRF que hay cinco casos confirmados, tres de ellos contra infraestructura crítica, sin interrupciones importantes, y que aún no está claro quién está detrás. The Hacker News, que cubre la misma entrevista, agrega que los agentes lograron entrar en cuatro de los cinco casos, incluidos dos de los tres contra infraestructura crítica. Ese es el dato que circula en redes como "4 de 5 ataques tuvieron éxito".

## Dónde las fuentes no coinciden o callan

- El aviso del 24 de noviembre no da un número de casos y dice que en todos los ataques conocidos el uso de agentes llevó a comprometer los sistemas; la entrevista habla de cuatro de cinco. The Hacker News señala que ni el aviso ni la entrevista explican el cambio.
- El resumen de swissinfo dice que hubo dos ataques exitosos; el de The Hacker News, cuatro de cinco, incluidos dos de infraestructura crítica. Es posible que sean lecturas distintas de la misma entrevista, pero no leí la entrevista original.
- No se han dado a conocer los nombres de las víctimas, los sectores concretos, la evidencia técnica, qué agentes se usaron ni quién atacó. The Hacker News aclara que ARTEX y CyberStrikeAI se mencionan como ejemplos de herramientas disponibles, no como las usadas en los cinco casos.

## SAP: qué confirmó y qué es reporte

SecurityWeek publicó el 27 de noviembre que SAP confirmó que investiga un incidente de ciberseguridad tras reportes de que atacantes apuntaron a su infraestructura de desarrollo. SAP dijo que detectó actividad sospechosa y tomó medidas para proteger a los clientes y asegurar sus servicios, y que, con base en su investigación hasta ahora, no encontró evidencia de acceso no autorizado a datos de negocio de clientes. No ha dado detalles del ataque.

Lo demás es reporte, no confirmación de SAP. Der Spiegel, citando a personas dentro de la empresa y una notificación interna, publicó que los atacantes obtuvieron tokens de autenticación de empleados y los usaron para copiar y alterar código en GitHub. La agencia DPA revisó comunicaciones internas que ubicaban la actividad en GitHub. Handelsblatt reportó que, entre las medidas de emergencia, SAP cambió claves de firma, limitó el acceso a GitHub y suspendió operaciones de desarrollo automatizadas. SecurityWeek aclara que ninguno de los reportes indica que código alterado haya llegado a software entregado a clientes. Tampoco está claro si los atacantes accedieron a código propietario, y el artículo no nombra repositorios ni productos. No leí los textos de Der Spiegel, DPA ni Handelsblatt: cito lo que SecurityWeek dice de ellos.

## ¿Es la misma historia?

Hasta donde muestran las fuentes, no. SecurityWeek dice que fuentes citadas por Der Spiegel sugirieron que la IA pudo haber ayudado al ataque contra SAP, y que eso no está confirmado. El mismo artículo recuerda que, a finales de octubre, el grupo de ransomware Gentlemen listó a SAP en su sitio de filtraciones, y que ambos incidentes no parecen estar relacionados. No hay ninguna fuente que una el caso de SAP con los cinco casos suizos.

## Dónde termina el hecho y empieza la interpretación

Es un hecho que la autoridad suiza reporta los primeros ataques confirmados con agentes de IA, que su director dio una cifra de cinco casos y tres contra infraestructura crítica, que SAP investiga un incidente y que las circunstancias de ese incidente, tokens robados y GitHub, vienen de reportes de prensa no confirmados por la empresa.

Mi lectura es que el "con IA" es menos importante que lo que muestran las descripciones oficiales. Lo que el aviso suizo describe es un atacante más rápido y paciente que explota lo que ya estaba mal: contraseñas débiles, parches pendientes, sistemas expuestos. Y el caso de SAP, si los reportes son correctos, no depende de ninguna novedad técnica: un token robado es una puerta legítima. Por eso la lista de recomendaciones suiza es tan poco espectacular: parches críticos en 24 horas, autenticación multifactor sin excepciones, menos sistemas expuestos, privilegios mínimos. No tengo evidencia de que la IA cambie el tipo de fallas que se explotan, solo la velocidad con la que se encuentran. Y con cinco casos, sin víctimas ni evidencia técnica públicas, no se puede decir todavía qué tan grande es el cambio.

*Fuentes: [Oficina federal de ciberseguridad de Suiza, "Cyberattacks involving AI agents: First confirmed cases in Switzerland" (24 de noviembre de 2026)](https://www.bacs.admin.ch/en/26-ki-agenten-1-en); [swissinfo / Keystone-SDA, "Switzerland reports first AI-enabled cyberattacks on critical infrastructure" (26 de noviembre de 2026)](https://www.swissinfo.ch/eng/swiss-ai/switzerland-reports-first-ai-based-cyberattacks-on-critical-infrastructure/92440400); [The Hacker News, "Switzerland Confirms AI-Assisted Cyberattacks Breached Critical Infrastructure Operators" (27 de noviembre de 2026)](https://thehackernews.com/2026/11/switzerland-confirms-ai-assisted.html); [SecurityWeek, "SAP Confirms Cyberattack, Source Code Reportedly Compromised" (27 de noviembre de 2026)](https://www.securityweek.com/sap-confirms-cyberattack-source-code-reportedly-compromised/).*
