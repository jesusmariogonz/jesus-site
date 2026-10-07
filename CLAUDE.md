# Instrucciones para Claude en este repo (jgonzalez.app)

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
(`oculta: true` sin intención de debate público), y series técnicas
muy narrow como Tesis RAG donde no aplica un debate de opinión.

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
económica) y no quieres agregarle postura, **no hay excepción
automática para ese caso todavía** — cuenta como nota normal para el
gate. O le agregas un `postura` real, o le pones `pulsoTipo`/`oculta`
si aplica, o le avisas al usuario que ese tipo de nota también
necesita el campo.

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
