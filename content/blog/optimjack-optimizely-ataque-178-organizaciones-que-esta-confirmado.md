---
titulo: 'Ataque a Optimizely: 178 organizaciones, entre ellas CNN, BBC y HSBC, cargaron código malicioso durante unas 19 horas. Esto es lo que sí está confirmado y lo que todavía nadie sabe'
fecha: 2026-11-17
categoria: cloud
mundo: tecnologia-y-negocio
tags:
  - ciberseguridad
  - Optimizely
  - cadena de suministro
  - OPTIMJACK
  - skimming
  - JavaScript de terceros
  - Report URI
resumen: 'El 16 de noviembre, un atacante inyectó código malicioso en scripts que Optimizely aloja para sus clientes y que se cargaron en los sitios de 178 organizaciones. El código cambiaba direcciones de criptomonedas, copiaba datos de tarjetas e intentaba infectar iPhones. Los investigadores confirmaron unos 7,000 dólares en cripto robados, pero nadie sabe todavía cuántas tarjetas se capturaron ni cuántos dispositivos se comprometieron.'
tesis: 'Es un hecho documentado que un solo proveedor, con una sola vulnerabilidad, permitió inyectar código en los sitios de 178 organizaciones sin hackear a ninguna directamente. Mi interpretación es que el punto débil no estuvo en la seguridad propia de esas marcas, sino en una dependencia compartida que corre con todos los privilegios en cada página, y que el costo visible de este ataque (unos 7,000 dólares) dice poco del riesgo que quedó sin medir.'
datosClave:
  - valor: '178'
    etiqueta: 'Organizaciones con scripts de Optimizely infectados (188 de 1,611 scripts revisados); es una estimación de los investigadores y probablemente es mayor'
    periodo: '16-nov-2026'
    fuente: 'Report URI'
  - valor: '≈ 19 horas'
    etiqueta: 'Desde la primera inyección observada (04:21 UTC) hasta la última limpieza reportada (23:11 UTC)'
    periodo: '16-nov-2026'
    fuente: 'Report URI'
  - valor: '≈ $7,000'
    etiqueta: 'Criptomonedas recibidas por las billeteras del atacante; no se conoce cuántas tarjetas, cookies o capturas de pantalla se robaron'
    periodo: '16-nov-2026'
    fuente: 'Report URI'
imagen: /blog/portadas/optimjack-optimizely-ataque-178-organizaciones-que-esta-confirmado.jpg
socialImagen: /blog/social/optimjack-optimizely-ataque-178-organizaciones-que-esta-confirmado.jpg
gancho: 'Un solo proveedor, una sola vulnerabilidad, 178 organizaciones con código malicioso en sus sitios, entre ellas CNN, BBC y HSBC. Lo robado en cripto fue poco, pero lo que nadie ha podido medir es el verdadero costo. ¿Por qué tantas empresas dejan que un tercero ejecute código en sus páginas de pago?'
postura:
  pregunta: '¿Debe una empresa permitir que proveedores externos de marketing y experimentación ejecuten JavaScript en todas sus páginas, incluidas las de pago, o este ataque demuestra que ese riesgo ya no vale la pena?'
  aFavor: 'Las pruebas A/B y la personalización son parte central de cómo las empresas digitales mejoran su conversión, y prescindir de ellas tiene un costo real en ingresos. En este caso las defensas básicas funcionaron en parte: las tarjetas en formularios de pago alojados en un iframe de otro dominio quedaron fuera de alcance del skimmer, el proveedor corrigió la falla en unas 19 horas y el daño confirmado en cripto fue pequeño. La respuesta es endurecer controles, no abandonar la herramienta.'
  enContra: 'El problema no es lo que se robó en la primera jornada sino lo que cualquier proveedor puede hacer con ese acceso: una sola vulnerabilidad le dio al atacante ejecución de código en cientos de sitios a la vez. Las páginas de pago deberían estar libres de scripts de terceros, y la ventana de 19 horas, más los iPhones a los que se intentó explotar, muestra que el daño real puede ser mucho mayor que los 7,000 dólares que se alcanzan a ver. Las marcas que cargan estos scripts asumen un riesgo que no controlan.'
---

La publicación viral dice que un ciberataque golpeó a 178 organizaciones importantes, incluidas Zoom, CNN, BBC, Fox News, HSBC, Salesforce, IKEA y Air France-KLM, al cargar malware en Optimizely para robar datos de pago y explotar dispositivos iOS. En lo esencial es cierto. Los detalles, sin embargo, cambian lo que debemos entender.

## Qué es cierto

El 16 de noviembre de 2026, un atacante inyectó código malicioso en scripts de la plataforma de experimentación Optimizely, que sus clientes cargan en sus sitios. Report URI, la firma de seguridad que investigó el caso, revisó 1,611 scripts y encontró 188 infectados, pertenecientes a 178 organizaciones. Según su análisis, la primera inyección se observó a las 04:21 UTC y la última limpieza se reportó a las 23:11 UTC, unas 19 horas después.

El código tenía tres funciones principales. Cambiaba direcciones de billeteras de criptomonedas por las del atacante, copiaba datos de tarjeta (número, vencimiento y código de seguridad) de formularios y envíos, y a los usuarios de iPhone y iPad los redirigía a kits de explotación llamados Coruna y DarkSword. Además, enviaba cookies y capturas de pantalla a servidores del atacante.

Optimizely reconoció que una parte no autorizada aprovechó una vulnerabilidad en su producto de experimentación para añadir código malicioso a proyectos de algunos clientes, y dijo que corrigió la falla y eliminó el código inyectado, según SecurityWeek.

## Los matices que el tuit no incluye

**La cifra de 178 es una estimación, no un dato oficial.** Report URI aclara que el número real probablemente es mayor, porque solo pudo revisar los scripts que logró encontrar a tiempo. Optimizely no ha publicado cuántos clientes se vieron afectados. Otras coberturas hablan de 186 o más sitios.

**Los sitios no fueron hackeados directamente.** El código se inyectó en los scripts que cada sitio carga desde Optimizely, no en la infraestructura de CNN, BBC o HSBC. Es un ataque de cadena de suministro: la víctima visible es el cliente, pero el punto de entrada fue el proveedor.

**"Robar datos de pago" es una capacidad con límites.** El código podía copiar tarjetas de formularios en la página, pero no las de formularios de pago alojados en un iframe de otro dominio, que quedaron fuera de su alcance. Nadie sabe todavía cuántas tarjetas, cookies o capturas se robaron realmente.

**"Explotar dispositivos iOS" fue un intento, no una infección confirmada.** El script redirigía a iPhones y iPads a los kits de explotación. Report URI indica que las versiones recientes de iOS (18.7.3 y posteriores, y 26.3 y posteriores) ya están parchadas, y la firma Hudson Rock señaló que no se ha demostrado una explotación exitosa.

**Fox News aparece en el análisis de Report URI,** en su tabla completa de medios, aunque no en todas las coberturas. Otras cifras que se repiten en la prensa varían por fuente.

## Lo que sí se robó, y lo que no se sabe

Lo único medible hasta ahora es el dinero que llegó a las billeteras del atacante: unos 7,000 dólares en criptomonedas el 16 de noviembre, según Report URI, que además señala que el atacante vació esas billeteras al día siguiente. Son recibos en la cadena de bloques, no el total del daño.

No se sabe cuántas tarjetas se copiaron, cuántas cookies de sesión se robaron, cuántos dispositivos iOS se infectaron ni cómo el atacante obtuvo acceso de escritura a proyectos de clientes sin relación entre sí. Report URI dice que esto último debe explicarlo Optimizely, que tampoco ha dicho si hubo acceso a datos de clientes o a sus propios sistemas.

## Dónde termina el hecho y empieza la interpretación

Es un hecho que un atacante inyectó código en scripts de Optimizely, que se cargaron en sitios de 178 organizaciones durante unas 19 horas, que el código tenía capacidades de robo de cripto, de datos de pago y de intento de infección en iOS, y que Optimizely corrigió la falla.

Mi lectura es que lo más importante no es el monto robado. Lo que este caso muestra es cuánta confianza se deposita en un solo proveedor: un script externo que corre con los mismos privilegios que el propio sitio, en cada página, incluida la de pago. Cuando esa dependencia falla, falla en todos sus clientes al mismo tiempo, sin que ninguno de ellos haya hecho algo mal en su propia seguridad. No tengo evidencia de que estas marcas hayan sido negligentes; sí de que compartieron un riesgo que no controlaban. Y los 7,000 dólares visibles son, por ahora, la parte más pequeña de lo que no se ha podido medir.

*Fuentes: [Report URI, "World's Largest Brands Infected With Malware Via Optimizely"](https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/); [SecurityWeek, "Optimizely Vulnerability Exploited to Serve Malware on Major Websites"](https://www.securityweek.com/optimizely-vulnerability-exploited-to-serve-malware-on-major-websites/); [StepSecurity, "OPTIMJACK"](https://www.stepsecurity.io/blog/optimjack-optimizely-hosted-scripts-crypto-clipper-card-skimmer).*
