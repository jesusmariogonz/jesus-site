# Routing de modelos Claude (jgonzalez.app)

Jerarquía: **Haiku → Sonnet → Opus**. Se empieza por el modelo más barato que
pueda resolver la tarea y se escala solo si hace falta. Opus nunca es el default.

## Código del sitio (implementado)

| Tarea | Modelo | Por qué |
|---|---|---|
| Moderación de comentarios/reseñas (`lib/moderacion.js`) | Haiku | Clasificación simple, alto volumen, latencia visible al usuario |
| …si Haiku responde "ambiguo" o ilegible | Sonnet (techo) | Segunda opinión antes de mandar a revisión manual. `MODERACION_ESCALAR=0` lo desactiva |
| Opus | — | Ninguna tarea del sitio lo justifica hoy |

- Reglas: `lib/llm/router.js` (`elegirModelo(perfil)` devuelve `tier` + `razones[]`).
- Todas las llamadas pasan por `lib/llm/cliente.js` y se registran en la tabla
  `llm_llamadas` (modelo, tipo, tokens, costo, latencia, éxito, escalación, razón).
- Métricas: `/admin/llm` (misma clave que `/admin/moderacion`).
- Serie Tesis RAG: se queda en `claude-haiku-4-5-20251001`; el modelo es parte del diseño documentado.
- Lab de investigación: usa DeepSeek, fuera de este router.

## Guía por rutina / sesión (recomendación, NO aplicada a los triggers)

| Rutina | Tipo de tarea | Modelo sugerido |
|---|---|---|
| Ticks de trading (apertura/mediodía/cierre) y sync de snapshots | Operativa: ejecutar comandos, esperar, reportar | Haiku; Sonnet si hay alertas o errores que diagnosticar |
| Aviso de renovar token de LinkedIn | Recordatorio | Haiku |
| Deploy de notas nuevas / verificación de deploy | Automatización multi-paso | Sonnet |
| Escribir notas de opinión/análisis (con verificación de hechos) | Redacción analítica | Sonnet |
| Weekly Outlook y calendarios | Resumen estructurado con búsqueda | Sonnet (Haiku solo si la agenda ya viene dada) |
| Diseñar o evaluar un experimento (¿hay evidencia estadística suficiente?, ¿causal o espuria?) | Razonamiento profundo | Opus |
| Código, debugging, refactor del sitio | Programación | Sonnet |

Cambiar el modelo de un trigger es una decisión aparte: no se hizo.
Riesgo principal al bajar a Haiku las rutinas de trading: peor manejo de
casos raros (órdenes PreSubmitted, saltos de equity). Probar primero con una
rutina y comparar resultados.

## Escalamiento

1. Haiku resuelve → se devuelve.
2. Haiku no decide (ambiguo/ilegible) → Sonnet, una sola vez.
3. Opus solo se usa si la tarea se enruta ahí desde el inicio (tipos de razonamiento
   profundo en `TIPOS`) o si un flujo futuro lo pide explícitamente. Nunca se
   ejecutan los tres modelos por consulta.

## Caché y contexto

- Moderación: sin caché (cada comentario es distinto; cachear spam repetido ahorra poco).
- Prompt caching de Anthropic: el prompt de sistema (~200 tokens) está por debajo del mínimo cacheable.
- El contexto ya es mínimo: solo el texto del comentario (máx. 1,000 caracteres).
