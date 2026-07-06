---
titulo: "Bienvenido a mi sitio (y cómo publiqué esta nota)"
fecha: "2026-07-06"
categoria: "opinion"
resumen: "La primera nota del blog: por qué existe este sitio y cómo funciona por dentro."
---

Esta es la primera nota del blog. La publiqué creando un simple archivo de texto llamado `bienvenida.md` dentro de la carpeta `content/blog/`.

## ¿Cómo funciona?

Cada nota es un archivo **Markdown** con un encabezado (frontmatter) que define título, fecha, categoría y resumen. El sitio lee esos archivos automáticamente y genera las páginas.

Puedo escribir:

- Listas como esta
- **Negritas** y *cursivas*
- [Enlaces](https://vercel.com)

Y también bloques de código:

```sql
SELECT categoria, COUNT(*) AS notas
FROM blog.posts
GROUP BY categoria;
```

## ¿Qué sigue?

Escribir sobre ingeniería de datos, Snowflake, arquitectura, IA y retail. Nos vemos en la siguiente nota.
