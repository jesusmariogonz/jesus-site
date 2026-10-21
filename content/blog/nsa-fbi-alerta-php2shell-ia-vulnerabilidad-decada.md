---
titulo: 'La NSA y el FBI piden parchar PHP de emergencia: una IA encontró dos fallas que llevaban una década sin detectarse'
fecha: 2026-10-21
categoria: cloud
mundo: tecnologia-y-negocio
tags:
  - ciberseguridad
  - PHP
  - NSA
  - FBI
  - CISA
  - inteligencia artificial
  - vulnerabilidades
  - php2shell
resumen: 'La NSA y el FBI advirtieron el 21 de octubre parchar de emergencia dos vulnerabilidades críticas de PHP (CVSS 9.2), bautizadas "php2shell", que una herramienta de IA de la firma Calif —usando un modelo de OpenAI— encontró en código con hasta una década de antigüedad. PHP afecta, según Wiz, cerca del 70% de los sitios web del mundo.'
tesis: 'Que una IA haya encontrado en código de una década de antigüedad dos fallas que ningún investigador humano detectó documenta algo real: estas herramientas ya superan la revisión manual en ciertas clases de vulnerabilidades. Lo que todavía no se puede afirmar —porque ningún reporte lo sostiene con evidencia— es que el saldo neto para la seguridad sea positivo: la misma capacidad que adelantó el parche también reduce, para cualquier atacante con acceso a un modelo comparable, el tiempo que separa "nadie lo sabe" de "todos pueden explotarlo".'
datosClave:
  - valor: '9.2'
    etiqueta: 'Puntaje CVSS v4.0 de ambas vulnerabilidades (CVE-2026-109618 y CVE-2026-109619)'
    fuente: 'Wiz, CERT-EU'
  - valor: '~70%'
    etiqueta: 'Proporción estimada de sitios web del mundo construidos en PHP, según el análisis de Wiz'
    fuente: 'Wiz'
  - valor: 'desde PHP 5.4'
    etiqueta: 'Versión más antigua con código afectado — más de una década sin que el error se detectara'
    fuente: 'Wiz'
imagen: /blog/portadas/nsa-fbi-alerta-php2shell-ia-vulnerabilidad-decada.jpg
gancho: 'Una IA encontró en código de PHP, en horas, dos fallas críticas que ningún humano detectó en más de diez años. La pregunta incómoda no es si la IA ayuda a la ciberseguridad — es cuánto tiempo falta para que el mismo truco funcione igual de bien del otro lado.'
socialImagen: /blog/social/nsa-fbi-alerta-php2shell-ia-vulnerabilidad-decada.jpg
postura:
  pregunta: '¿El uso de IA para encontrar vulnerabilidades como "php2shell" es, en el balance, una victoria neta para la ciberseguridad defensiva, o acelera una carrera armamentista donde atacantes con acceso a modelos comparables llegarán casi al mismo tiempo que los defensores?'
  aFavor: 'Encontrar y parchar una falla crítica (CVSS 9.2) en código usado por el 70% de la web, antes de que haya evidencia confirmada de explotación masiva según CISA, es exactamente el resultado que se busca: el ciclo completo de descubrimiento-aviso-parche ocurrió en días, no en los años que tardan muchas vulnerabilidades heredadas en salir a la luz.'
  enContra: 'La misma capacidad que permitió encontrar en horas un error de una década de antigüedad está, en esencia, disponible para cualquier actor con acceso a un modelo de IA comparable — y el hecho de que Cloudflare ya reportara tráfico de ataque dirigido a sus clientes el mismo día del anuncio sugiere que la ventana entre "se publica el aviso" y "empieza la explotación" se está acortando más rápido de lo que las organizaciones pueden parchar.'
---

El 21 de octubre, la Agencia de Seguridad Nacional (NSA) y el FBI de Estados Unidos emitieron una advertencia conjunta pidiendo a cualquier organización que opere sitios o aplicaciones construidas en PHP que aplique, de inmediato, el parche de emergencia publicado ese mismo día por el equipo de PHP — o que, si eso no es posible, desconecte el sistema afectado hasta poder hacerlo. La recomendación no es retórica de rutina: las dos fallas que la motivan, bautizadas en conjunto como "php2shell", tienen un puntaje de severidad de 9.2 sobre 10 en la escala CVSS v4.0, y según el análisis de la firma de seguridad en la nube Wiz, afectan a un software que corre detrás de cerca del 70% de los sitios web del mundo.

## Lo que se encontró, y lo que todavía no está claro sobre qué es exactamente

Las dos vulnerabilidades, catalogadas como CVE-2026-109618 y CVE-2026-109619, son fallas de ejecución remota de código: en términos prácticos, permitirían a un atacante tomar control de un servidor sin necesidad de credenciales válidas. Vale la pena ser preciso sobre un punto que los reportes técnicos todavía no terminan de resolver entre sí: distintas firmas de seguridad describen el mecanismo exacto de cada falla de forma distinta. Wiz las describe como un *use-after-free* en el manejo de progreso de carga de sesión (la primera) y una confusión de tipos en el caché de OPcache ligada a la generación de trazas de error fatal (la segunda); otros análisis técnicos, como el de BleepingComputer, las describen en términos de corrupción de memoria por falta de espacio y un estado global obsoleto. Un analista de Pentestit incluso corrigió públicamente su propia descripción inicial de ambos errores. Esa falta de consenso inmediato sobre el mecanismo preciso no es inusual en los primeros días de una vulnerabilidad recién revelada —pero sí vale la pena señalarla en vez de presentar como establecida una descripción técnica que las propias firmas de seguridad todavía están afinando entre sí.

## Quién la encontró, y por qué esa parte de la historia importa tanto como la falla misma

El hallazgo no vino de una auditoría de código tradicional. De acuerdo con los reportes de Wiz y de la cobertura de CyberScoop, la firma de ciberseguridad especializada en IA Calif usó un modelo de OpenAI —identificado en los reportes como "GPT-5.6 Sol", orientado específicamente a tareas de ciberseguridad— para analizar el código fuente de PHP, y ese análisis automatizado fue lo que destapó ambas fallas. Wiz, de forma independiente, también llegó a encontrar y reportar al menos una de ellas por su cuenta. Lo que distingue a este caso de otros hallazgos de vulnerabilidades no es la gravedad —9.2 de CVSS es alto, pero no inédito— sino la antigüedad del código donde se encontró: según Wiz, al menos una de las dos fallas está presente desde PHP 5.4, una versión con más de una década de antigüedad, que un número no menor de investigadores de seguridad humanos ha tenido oportunidad de revisar en todo ese tiempo sin detectar el problema.

## Qué tan expuesto está, en realidad, el ecosistema

El parche ya existe: el equipo de PHP publicó actualizaciones para las versiones 8.5.12, 8.4.27, 8.3.36 y 8.2.35, además de parches de solo código fuente (sin binarios oficiales) para las ramas más antiguas 7.4, 8.0 y 8.1, que ya están fuera del ciclo de soporte regular. Eso último es relevante: una porción considerable de la infraestructura web global —sitios construidos hace años sobre versiones de PHP que ya no reciben mantenimiento activo— solo tiene el camino de un parche manual de código fuente, un proceso bastante más lento y propenso a errores que simplemente actualizar un paquete.

La pregunta de si esto ya se está explotando activamente tampoco tiene una respuesta uniforme entre las fuentes disponibles. CISA, la agencia estadounidense de ciberseguridad, afirmó en su aviso que "no ha observado explotación de estas vulnerabilidades al momento de esta publicación" —una formulación deliberadamente cautelosa—. Cloudflare, por su parte, reportó en su blog haber detectado y bloqueado tráfico de ataque dirigido a sus clientes relacionado con estas fallas, sin precisar si algún cliente llegó a ser comprometido. Un reporte de NBC afirmó que "hackers ya habrían comenzado a explotarlas", mientras que watchTowr, en su FAQ técnico, marcó ambos CVE como explotados activamente. Ninguna de estas fuentes es, por sí sola, la autoridad final sobre el estado real de explotación — y mientras eso se aclara, la recomendación operativa es la misma sin importar a cuál de las lecturas se le dé más peso: parchar ahora, no esperar a que se resuelva el debate sobre si ya hay ataques en curso.

## La IA que encuentra el bug también puede encontrarlo para el otro lado

Hay una lectura inmediata y cómoda de esta historia: la inteligencia artificial, usada como herramienta de investigación defensiva, encontró un problema real que los humanos llevaban una década sin ver, y el sistema funcionó —aviso, parche, coordinación entre NSA, FBI, CISA y el equipo de PHP, todo en el mismo ciclo de noticias—. Esa lectura es cierta, pero incompleta. La misma capacidad que le permitió a Calif usar un modelo de OpenAI para analizar código de PHP en busca de errores de memoria sutiles no es una capacidad exclusiva de las firmas que eligen reportar lo que encuentran de forma responsable: es, en esencia, una capacidad disponible para cualquier actor con acceso a un modelo de razonamiento sobre código comparable, sin ninguna garantía de que ese acceso esté distribuido de forma más generosa hacia los defensores que hacia los atacantes. El hecho de que Cloudflare ya detectara tráfico de ataque el mismo día en que se hizo público el aviso —fuera cual fuera el estado exacto de explotación confirmada en ese momento— es la evidencia más concreta disponible hasta ahora de que la ventana entre "se publica un aviso responsable" y "empieza el intento de explotación" ya no se mide en semanas.

## Lo que queda por ver

Lo que todavía no se sabe, y probablemente no se sabrá con precisión durante varias semanas, es cuántas de las organizaciones que operan sobre versiones de PHP fuera de soporte —sin un parche de un solo clic disponible— lograrán aplicar el parche de código fuente antes de que la explotación activa, si no lo está ya, se generalice. Esa brecha de capacidad operativa entre organizaciones bien dotadas de recursos de TI y las que no lo están —que decidirá, en la práctica, cuántos de esos sitios terminan comprometidos antes de parcharse— es la parte de esta historia que ni la NSA ni el FBI pueden resolver con un aviso, por urgente que sea.

## Fuentes

- [National Security Agency warns organizations to patch critical PHP flaws](https://thehill.com/policy/technology/6163568-nsa-warns-php-security-flaws/) — The Hill
- [NSA warns organizations to patch security flaws identified by AI](https://www.kron4.com/news/national/nsa-warns-organizations-to-patch-security-flaws-identified-by-ai/) — KRON4
- [Prepare yourselves: PHP to release emergency fixes for 2 critical vulnerabilities](https://cyberscoop.com/php-emergency-patches-php2shell-vulnerabilities/) — CyberScoop
- [PHP2Shell: AI uncovers critical RCE vulnerabilities affecting 70% of the Internet](https://www.wiz.io/blog/php2shell-php-rce) — Wiz
- [NSA warns 70% of websites to install the latest PHP patch now or go offline](https://www.tweaktown.com/news/114213/nsa-warns-70-percent-of-websites-to-install-the-latest-php-patch-now-or-go-offline/index.html) — TweakTown
- [PHP ships emergency patches for critical PHP2Shell flaws](https://www.bleepingcomputer.com/news/security/php-ships-emergency-patches-for-critical-php2shell-flaws/) — BleepingComputer
- [PHP RCE FAQ: PHP2Shell CVE-2026-109618 & CVE-2026-109619](https://watchtowr.com/intelligence/php-cve-2026-109618-faq/) — watchTowr
- [PHP CVE-2026-109618 and CVE-2026-109619: What We Know about php2shell?](https://pentestit.com/php-cve-2026-109618-and-cve-2026-109619-what-we-know-about-php2shell/) — Pentestit
- [Cloudflare deploys protections against php2shell vulnerability](https://blog.cloudflare.com/php-vulnerabilities-waf-protection/) — Cloudflare
- [AI uncovers critical PHP vulnerabilities, sparking rush for a fix](https://www.nbcsandiego.com/news/national-international/critical-vulnerabilities-in-commonly-used-web-code-spark-rush-to-update-systems/4089932/) — NBC San Diego
