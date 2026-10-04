# Estado de la serie — Tesis "Persistencia no gobernada en sistemas RAG"

Este archivo es la fuente de verdad de en qué semana va la serie. Antes
de escribir cualquier entrega, la rutina/sesión debe leer este archivo y
confirmar contra `content/blog/` (slugs con `tesis-rag-semana-NN`) — nunca
inferir la semana solo contando fechas transcurridas.

**Próxima semana pendiente: 4** (Resultados parte 1 — tasa de fuga del Experimento 1 sin mitigación, con prueba de hipótesis)

## Historial

| Semana | Fecha publicación | Slug | Resumen de una línea |
|---|---|---|---|
| 1 | 2026-09-27 | `tesis-rag-semana-01-introduccion-planteamiento` | Introducción al problema de persistencia no gobernada en RAG y planteamiento formal de H1/H2. |
| 2 | 2026-09-27 | `tesis-rag-semana-02-marco-teorico-metodologia` | Marco teórico (gobernanza como propiedad estructural) y metodología unificada: diseño pareado, McNemar, IC 95% Wilson, criterio de falsabilidad popperiano. |
| 3 | 2026-10-04 | `tesis-rag-semana-03-diseno-experimento-1-fuga-confidencialidad` | Diseño completo del Experimento 1 (corpus de 18 docs EIA Corp, 3 roles, 62 trials pareados) — **y ejecución real ya completada** contra la API de Anthropic; datos crudos y análisis en `tesis-rag/experimento-1/`. |

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
- Semana 4: Resultados parte 1 — reportar la tasa de fuga SIN mitigación
  (Condición A) con su IC 95% Wilson, y adelantar la tabla pareada de
  McNemar como evidencia de diseño (el p-value completo puede ir en la
  discusión de la Semana 4 o reservarse para la Semana 5, a criterio
  editorial de esa entrega).
- Semana 5: Resultados parte 2 — efecto de la mitigación (Condición B) y
  su costo en calidad de respuesta (preguntas tipo a).
- Semana 6 (Metodología parte 3): diseñar el Experimento 2 (sección 5).
- Semana 7 no puede escribirse sin datos reales en
  `tesis-rag/experimento-2/`.
- Semana 10: ensamblar las 10 entregas en un documento único y, al
  terminar, desactivar la rutina recurrente `trig_...` (ver ID exacto en
  el mensaje de confirmación de la sesión que la creó).
- Todas las citas usan APA 7. Ninguna fuente sin verificar se cita como
  real — se marca "[referencia pendiente de verificar]" si no se pudo
  confirmar.
