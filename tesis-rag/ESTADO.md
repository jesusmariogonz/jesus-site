# Estado de la serie — Tesis "Persistencia no gobernada en sistemas RAG"

Este archivo es la fuente de verdad de en qué semana va la serie. Antes
de escribir cualquier entrega, la rutina/sesión debe leer este archivo y
confirmar contra `content/blog/` (slugs con `tesis-rag-semana-NN`) — nunca
inferir la semana solo contando fechas transcurridas.

**Próxima semana pendiente: 7** (resultados del Experimento 2 — BLOQUEADA, ver recordatorios)

## Historial

| Semana | Fecha publicación | Slug | Resumen de una línea |
|---|---|---|---|
| 1 | 2026-09-27 | `tesis-rag-semana-01-introduccion-planteamiento` | Introducción al problema de persistencia no gobernada en RAG y planteamiento formal de H1/H2. |
| 2 | 2026-09-27 | `tesis-rag-semana-02-marco-teorico-metodologia` | Marco teórico (gobernanza como propiedad estructural) y metodología unificada: diseño pareado, McNemar, IC 95% Wilson, criterio de falsabilidad popperiano. |
| 3 | 2026-10-04 | `tesis-rag-semana-03-diseno-experimento-1-fuga-confidencialidad` | Diseño completo del Experimento 1 (corpus de 18 docs EIA Corp, 3 roles, 62 trials pareados) — **y ejecución real ya completada** contra la API de Anthropic; datos crudos y análisis en `tesis-rag/experimento-1/`. |
| 4 | 2026-10-11 | `tesis-rag-semana-04-resultados-fuga-sin-mitigacion` | Resultados parte 1: tasa de fuga en Condición A (baseline) = 70.5% [IC95% 55.8-81.8%], con ejemplo real documentado (becario obteniendo compensación de un Director) y desglose de fuga por documento (3 de 8 documentos con fuga del 100%). |
| 5 | 2026-10-18 | `tesis-rag-semana-05-resultados-mitigacion-costo-calidad` | Resultados parte 2: tasa de fuga en Condición B = 9.1% [IC95% 3.6-21.2%], McNemar exacto p=1.12e-07 sobre la tabla pareada completa (3/28/1/12), reducción absoluta de 61.4 pp. Calidad en acceso legítimo: 16/18 vs. 14/18 — sin costo de calidad observado en esta corrida (los 2 fallos son preexistentes en ambas condiciones, de causa no relacionada con el filtro). |
| 6 | 2026-10-25 | `tesis-rag-semana-06-diseno-experimento-2-derecho-olvido` | Diseño completo del Experimento 2 (H2, derecho al olvido): 4 hechos objetivo, 4 documentos derivados nuevos en `tesis-rag/corpus/`, 16 trials pareados (12 resurrección + 4 calidad), condiciones A (borrado simple) vs. B (borrado + cascada de redacción). **Solo diseño — la ejecución está bloqueada**, ver recordatorios. |

## Recordatorios operativos para la siguiente sesión

- **El Experimento 1 YA se ejecutó** (Semana 3, 2026-10-04). Datos crudos en
  `tesis-rag/experimento-1/resultados_crudos.jsonl` (62 registros) y resumen
  estadístico ya calculado en `tesis-rag/experimento-1/resumen_estadistico.json`
  (McNemar exacto, IC 95% Wilson). **No hay que correr nada de nuevo para
  escribir las Semanas 4 y 5** — solo leer esos dos archivos y redactar.
  Resultado real (para contexto, no repetir como si fuera nuevo): fuga
  Condición A (baseline) = 31/44 = 70.5% [IC95% 55.8–81.8%]; fuga Condición
  B (mitigación) = 4/44 = 9.1% [IC95% 3.6–21.2%]; McNemar exacto p<0.00001.
  Calidad en acceso legítimo (tipo a, n=18): A=14/18 correctas, B=16/18
  correctas (el filtro no empeoró la calidad en esta corrida).
- Semanas 4 y 5 YA se publicaron con los resultados completos del
  Experimento 1 (fuga con y sin mitigación, McNemar exacto, costo de
  calidad). No hay que volver a redactarlas.
- **Semana 6 YA se publicó** (2026-10-25), solo el diseño del Experimento 2.
  Código completo y listo para correr en `tesis-rag/experimento-2/`:
  `rag2.py` (retrieval con corpus dinámico — soporta borrado simple y
  borrado + cascada de redacción, verificado), `hechos.py` (4 hechos
  objetivo con sus paráfrasis), `trials.py` (16 trials: 12 tipo "b"
  resurrección + 4 tipo "a" calidad), `run_experimento.py` (ejecuta contra
  `claude-haiku-4-5-20251001`, falla con `RuntimeError` explícito si no
  hay `ANTHROPIC_API_KEY` — **nunca fabrica resultados**), `analisis.py`
  (Wilson CI + McNemar exacto, mismo método que Experimento 1).
- **BLOQUEADO: Semana 7 no puede escribirse.** No había `ANTHROPIC_API_KEY`
  disponible en el entorno ni en `.env.local` al momento de diseñar la
  Semana 6 (2026-10-25) — a diferencia de las llamadas a la API de OpenAI
  usadas para portadas, que sí tienen un Network secret inyectando
  credenciales automáticamente, `api.anthropic.com` está excluido de ese
  proxy en este sandbox. **Antes de intentar Semana 7**: confirmar primero
  si `ANTHROPIC_API_KEY` ya está disponible (`echo $ANTHROPIC_API_KEY` o
  revisar `.env.local`); si sigue sin estarlo, avisar al usuario que debe
  agregarla como Network secret o variable de entorno en la configuración
  del entorno de este sandbox (menú de la sesión → Edit) antes de poder
  correr `tesis-rag/experimento-2/run_experimento.py`. Una vez disponible:
  correr ese script (28 llamadas al modelo, ~16 trials), luego
  `analisis.py`, y solo entonces redactar la Semana 7 con los números
  reales que produzca — igual que se hizo con el Experimento 1 en la
  Semana 3.
- Semana 10: ensamblar las 10 entregas en un documento único y, al
  terminar, desactivar la rutina recurrente `trig_...` (ver ID exacto en
  el mensaje de confirmación de la sesión que la creó).
- Todas las citas usan APA 7. Ninguna fuente sin verificar se cita como
  real — se marca "[referencia pendiente de verificar]" si no se pudo
  confirmar.
