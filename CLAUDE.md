# Instrucciones para Claude en este repo (jgonzalez.app)

## Línea editorial: perspectiva del autor (izquierda moderada) sin sacrificar veracidad

El autor se identifica más de izquierda que de derecha y quiere que las
notas de **opinión y análisis** reflejen, en cierta medida, esa
perspectiva: cuando la evidencia lo permita, es válido darle peso y
encuadre favorable a políticas de corte social y progresista (salario
mínimo, transferencias, salud y educación públicas, regulación,
derechos laborales, política industrial con sentido social) y revisar con
rigor las críticas a ellas. El tono es el de un columnista con punto de
vista, no el de propaganda: sobrio, con argumentos y evidencia, sin
consignas ni descalificaciones.

Lo que **NO cambia** (esto manda sobre cualquier sesgo editorial):

1. **Veracidad primero.** Nunca se inventa, se infla, se recorta de forma
   engañosa ni se omite un dato, cifra o cita para sostener una postura.
   Si la evidencia no respalda una política de izquierda, o favorece el
   argumento de la derecha, la nota lo dice claramente.
2. **La perspectiva vive en la interpretación, no en los hechos.** Se
   mantiene la separación ya exigida entre hecho documentado e
   interpretación propia (campo `tesis`, sección "Dónde termina el hecho
   y empieza la interpretación"). El encuadre, el énfasis y las preguntas
   que se hacen pueden reflejar la perspectiva del autor; los hechos
   citados, no.
3. **Mismo rigor para todos.** Se evalúa con el mismo escepticismo a
   gobiernos y políticas de izquierda que de derecha. Apoyar una
   política no equivale a dar por buenas las cifras de quien la
   promueve: las afirmaciones de un gobierno afín (por ejemplo, las
   cifras de la 4T) se atribuyen a su fuente y se contrastan igual que
   las de cualquiera.
4. **El contrargumento se construye bien.** El bloque `postura` sigue
   exigiendo los dos lados defendibles; el argumento conservador o de
   libre mercado debe ser el mejor posible, no un strawman.
5. **Dónde NO aplica.** Notas informativas, resúmenes de datos, Pulso de
   Mercado, agendas/calendarios, notas de ciencia y series técnicas
   (ej. Tesis RAG) se mantienen neutrales. La línea editorial solo
   aplica donde la nota ya es de opinión/análisis sobre política
   pública, economía o sociedad.
6. **Calibre moderado.** "En cierta medida" significa que la
   perspectiva informa el enfoque, no que cada nota deba llegar a una
   conclusión de izquierda. Si la evidencia de una nota apunta en otra
   dirección, esa es la nota que se escribe.

Cuando una nota tome una posición favorable a una política de
izquierda, decirlo en la respuesta al usuario (qué postura tomó y qué
evidencia en contra se incluyó), igual que con cualquier otra decisión
editorial.

## "En una mirada" (datosClave) y "La tesis del artículo" (tesis)

Estos dos bloques se renderizan juntos, en un contenedor de ancho
completo entre el encabezado y el cuerpo de la nota (`app/blog/[slug]/page.js`,
clase `.article-highlights--top`) — no en el sidebar angosto como antes.
Aplica solo a notas nuevas: las notas viejas sin estos campos siguen
funcionando igual, el bloque completo simplemente no se renderiza si
faltan ambos (`post.tesis` y `post.datosClave`).

`datosClave` (máximo 4 indicadores, los más relevantes para el
argumento central — no cifras llamativas sin relación con la tesis):

```yaml
datosClave:
  - valor: 'Cifra destacada'
    etiqueta: 'Qué es, en una frase corta'
    periodo: 'Opcional — ej. "2025", "T3 2026"'
    fuente: 'Opcional — ej. "Profeco", "INEGI" (nombre corto, no la URL completa)'
```

`periodo` y `fuente` son opcionales y nuevos — si una nota vieja no los
trae, simplemente no se muestra esa línea secundaria, sin romper nada.
Nunca inventar una cifra para llenar los 4 espacios: mejor 2-3 datos
reales que 4 con uno forzado. No mezclar métricas no comparables (ventas
vs. derrama vs. utilidad vs. reclamaciones) como si fueran equivalentes.

`tesis` (el campo ya existente, se sigue llamando igual en el
frontmatter — solo cambió la etiqueta visible de "Mi tesis" a "La tesis
del artículo"): una sola idea central, 40-80 palabras, que interprete la
evidencia de la nota en vez de repetir el resumen/bajada tal cual.
Distinguir explícitamente hecho documentado vs. interpretación propia;
nunca inventar intenciones, consecuencias o relaciones causales que la
evidencia no sostenga. Es opcional — una nota puramente informativa
(ej. seguimiento de un dato económico puntual) puede omitirlo.

## Toda nota nueva debe incluir un bloque "Postura"

Desde que se agregó la función de voto + comentarios (ver
`components/PosturaBlock.js`, `lib/db.js`, `lib/moderacion.js`), **toda
nota nueva que se publique en `content/blog/` debe traer el campo
`postura` en su frontmatter**, no solo cuando se pida explícitamente.

Formato en el frontmatter:

```yaml
postura:
  pregunta: 'Pregunta de debate directamente relacionada con la tesis de la nota'
  aFavor: 'El argumento a favor mejor construido, en 1-2 frases'
  enContra: 'El argumento en contra mejor construido, en 1-2 frases'
```

Reglas para redactarlo bien (no un trámite genérico):

- La pregunta debe salir de la tensión real de la nota — la misma
  pregunta que un lector escéptico se haría al terminar de leerla —,
  no una genérica tipo "¿Está bien esto?".
- Los argumentos a favor y en contra deben ser **ambos defendibles**,
  no un strawman vs. la postura "correcta" de la nota. Si uno de los
  dos lados suena obviamente tonto, hay que reescribirlo.
- No repetir la tesis de la nota tal cual — el bloque de postura es
  para generar desacuerdo real, no para resumir lo ya dicho.

Excepciones (no requieren `postura`): notas de Pulso de Mercado
(`pulsoTipo` definido), notas ocultas de uso interno/Kindle
(`oculta: true` sin intención de debate público), series técnicas
muy narrow como Tesis RAG donde no aplica un debate de opinión, y
**notas de calendario/agenda** (ej. "Lo que se espera esta semana")
marcadas con `tipoNota: calendario`. Ese último campo es solo para el
gate: a diferencia de `pulsoTipo`, NO saca la nota del listado del blog
ni del aviso por newsletter/redes. Úsalo únicamente en notas que son
agenda pura; una nota con interpretación u opinión sigue necesitando
`postura`.

Cuando se publique una nota sin este campo por alguna de esas
excepciones, decirlo explícitamente en la respuesta al usuario (igual
que se hace con cualquier otra omisión), no omitirlo en silencio.

## Esto ya NO depende solo de que una sesión se acuerde

Como varias rutinas automáticas (triggers programados) publican notas
sin pasar por esta instrucción, hay un gate real a nivel de Vercel que
hace cumplir la regla: `scripts/check-postura.mjs`, configurado como
"Ignored Build Step" del proyecto en Vercel.

Qué hace: en cada push a `main`, revisa solo los archivos **nuevos**
en `content/blog/` (no ediciones a notas viejas). Si alguno no trae
`postura` completo (pregunta + aFavor + enContra) y no cae en una de
las 3 excepciones de arriba, **el deploy se salta por completo** —el
sitio se queda en la versión anterior— y se manda un correo de aviso
a jesusmariogonz@gmail.com. El sitio nunca se rompe para los
visitantes; simplemente no se actualiza hasta que se corrija.

Para desbloquear un deploy saltado: agrega el `postura` que falta (o
la excepción correspondiente) y vuelve a hacer push — el siguiente
push dispara el check de nuevo y, si pasa, despliega todo lo
pendiente.

Si vas a publicar una nota de calendario/rutina que no sea opinión
real (ej. "lo que se espera esta semana", resúmenes de agenda
económica) y no quieres agregarle postura, ponle `tipoNota: calendario`
en el frontmatter: es una excepción válida para el gate (se agregó el
17-nov-2026 después de que estas notas bloquearan deploys). Si la nota
sí trae una lectura propia, mejor agrégale un `postura` real.

Nota técnica: en commits de merge, el gate solo revisa las notas que
son nuevas respecto a **todos** los padres del merge, para no volver a
marcar como "nueva" una nota que ya se revisó en su propio push.

## Git: no cambies la identidad del repo desde worktrees de prueba

El 25-nov-2026 se descubrió que, desde el 17-nov, los commits de algunas
sesiones salían con autor `t <t@t>`: una prueba del gate en un worktree
temporal corrió `git config user.name/email`, y en un worktree eso escribe
en la configuración **compartida** del repositorio. Si necesitas una
identidad en una prueba, usa `git -c user.name=... -c user.email=... commit`
(solo vale para ese comando) y verifica antes de empujar con
`git config user.email` que sigue siendo la de siempre
(`noreply@anthropic.com`).

## Toda nota nueva debe traer su portada "tratada", no una foto cruda del banco

`public/blog/portadas/` tiene un banco de fotos genéricas reutilizables
(`inteligencia-artificial-N.jpg`, `mercado-bursatil-N.jpg`,
`oficina-corporativa-N.jpg`, etc.). Si publicas una nota a mano, **no
uses una de esas fotos tal cual en el campo `imagen`** — pásala primero
por `scripts/portada_titulo.py` (Python) o `scripts/portada-titulo.mjs`
(Node, mismo resultado, sin depender de Python/Pillow), que le hornea
el titular, la etiqueta de categoría y la marca "jgonzalez.app" encima:

```bash
python3 scripts/portada_titulo.py \
  public/blog/portadas/<foto-del-banco>.jpg \
  public/blog/portadas/<slug-de-la-nota>.jpg \
  "<título exacto de la nota>" \
  "<nombre visible de la categoría, ej. 'Geopolitics', 'Opinión'>"
```

Luego actualiza `imagen:` (y `socialImagen:` si aplica) para que
apunten al archivo generado (`/blog/portadas/<slug>.jpg`), no al
original del banco.

### Esto ya NO depende solo de que una sesión se acuerde (y no bloquea el deploy)

Una auditoría de octubre de 2026 encontró 43 notas (incluyendo varias
publicadas el mismo día por una rutina automática externa a este repo)
con la foto del banco sin tratar. A diferencia de `postura`, esto **no
se resuelve bloqueando el deploy** — se arregla solo, como parte normal
de cada build: `next.config.mjs` llama a
`scripts/fix-portadas-auto.mjs` antes de compilar, el cual revisa
TODAS las notas en `content/blog/`, detecta cuáles tienen `imagen`
apuntando a una foto genérica sin tratar, genera la versión tratada con
`scripts/portada-titulo.mjs` y reescribe el frontmatter de esa nota
(imagen + socialImagen) en el checkout antes de que Next compile las
páginas — sin intervención humana y sin saltarse el deploy.

Nota importante: ese arreglo ocurre en el filesystem efímero del build
de Vercel, no se commitea de vuelta al repo automáticamente. Si quieres
que el `imagen:` correcto quede también en git (recomendado para que no
se regenere en cada build), haz el mismo cambio a mano en una sesión y
commitéalo — igual que se hizo con las 43 notas de la auditoría inicial.
