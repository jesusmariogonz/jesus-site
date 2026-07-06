---
titulo: "Micro-particiones en Snowflake: lo que nadie te explica al inicio"
fecha: "2026-07-01"
categoria: "snowflake"
resumen: "Snowflake no tiene índices tradicionales. Entender las micro-particiones cambia cómo escribes tus queries."
---

Cuando vienes de bases de datos tradicionales, lo primero que buscas en Snowflake son los índices. No existen. En su lugar, Snowflake organiza los datos en **micro-particiones**: bloques inmutables de 50–500 MB comprimidos.

## Por qué importa

Snowflake guarda metadatos de cada micro-partición (mínimos, máximos, conteos). Cuando filtras por una columna, puede **descartar particiones completas** sin leerlas. A esto se le llama *pruning*.

```sql
-- Este filtro aprovecha el pruning si los datos
-- se cargaron ordenados por fecha
SELECT *
FROM ventas
WHERE fecha_venta >= '2026-06-01';
```

## La lección práctica

El orden en que **cargas** los datos define qué tan bien funciona el pruning. Si tus queries siempre filtran por fecha y tienda, carga (o re-clusteriza) por esas columnas.

Más adelante escribiré sobre `CLUSTER BY` y cuándo vale la pena pagarlo.
