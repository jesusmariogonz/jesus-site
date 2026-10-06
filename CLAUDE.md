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
