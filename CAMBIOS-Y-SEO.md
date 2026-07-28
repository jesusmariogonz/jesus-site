# Cambios aplicados + Guía de SEO 🚀

Esta versión agrega un **carrusel de notas recientes**, un **buscador por
palabras**, varias **mejoras de blog** y un **paquete completo de SEO**.
Aquí tienes qué cambió y los pasos manuales para posicionarte en Google.

---

## 1. Qué cambió (ya está listo, no tienes que tocar nada)

### Carrusel "Lo más reciente"
- Aparece **arriba del blog** y también **dentro de cada nota**, mostrando
  las 5 notas más nuevas. Así, quien entra a leer una nota descubre lo
  último y sigue navegando (mejora el alcance).
- Avanza solo cada 6 s, se pausa al pasar el cursor, y funciona con flechas,
  puntitos, deslizando con el dedo y con el teclado (← →).
- Archivo: `components/NotasCarrusel.js`

### Buscador por palabras
- Caja de búsqueda en `/blog`. Filtra por título, resumen, categoría,
  etiquetas y parte del contenido. Ignora acentos y mayúsculas.
- Los chips de categoría ahora filtran en la misma página (más rápido).
- Archivo: `components/BlogExplorer.js`

### Otras mejoras del blog
- **Barra de progreso de lectura** arriba de cada nota.
- **Tabla de contenido** automática en notas con 3+ subtítulos.
- **Notas relacionadas** al final de cada nota ("sigue leyendo").
- Botón flotante **"volver arriba"**.
- Archivos: `ReadingProgress.js`, `ArticleToc.js`, `VolverArriba.js`

### SEO (lo más importante para tu nombre)
- **`sitemap.xml`** y **`robots.txt`** automáticos.
- **Datos estructurados** (JSON-LD) que le dicen a Google quién eres:
  - `Person` (tu nombre, puesto, LinkedIn, temas que dominas) en todo el sitio.
  - `BlogPosting` + `BreadcrumbList` en cada nota.
  - `WebSite` del sitio.
- **Canónicos**, **keywords**, **autor** y **Open Graph** en todas las páginas.
- **Web App Manifest** (`manifest.webmanifest`).
- Archivos: `lib/site.js`, `app/sitemap.js`, `app/robots.js`,
  `app/manifest.js`, `app/layout.js`.

> Todo esto se genera solo. Para publicarlo: `git add .` → `git commit -m "Blog y SEO"` → `git push`.

---

## 2. Pasos manuales para salir en la primera página de Google

El código ya está optimizado. Estos pasos (una sola vez) son los que de
verdad mueven la aguja cuando alguien busca **tu nombre**.

### Paso A — Publica y confirma que todo cargó
Después del `git push`, entra a:
- `https://TU-SITIO/sitemap.xml` → debe listar todas tus páginas.
- `https://TU-SITIO/robots.txt` → debe mencionar el sitemap.

### Paso B — Google Search Console (imprescindible)
1. Entra a **https://search.google.com/search-console** con tu cuenta Google.
2. Agrega una propiedad tipo **"Prefijo de la URL"** con tu dirección
   (ej. `https://jesus-site-silk.vercel.app`).
3. Elige el método **"Etiqueta HTML"**. Google te da un código.
4. Copia **solo el código** (lo que va en `content="..."`) y pégalo en
   `lib/site.js`, en `GOOGLE_SITE_VERIFICATION = "aquí"`. Publica con `git push`.
5. Vuelve a Search Console y da clic en **Verificar**.
6. Ya verificado: menú **Sitemaps** → escribe `sitemap.xml` → **Enviar**.
7. Usa **"Inspección de URLs"** con tu página de inicio y pide **"Solicitar indexación"**.

> Esto le pide a Google que te rastree ya, en lugar de esperar semanas.

### Paso C — Dominio propio (muy recomendado para tu nombre)
Un dominio con tu nombre (ej. `jesusgonzalez.mx` o `jesusgonzalezsiller.com`)
posiciona muchísimo mejor que una URL de `vercel.app`.
1. Compra el dominio (Namecheap, GoDaddy, Google Domains, etc.).
2. En Vercel: tu proyecto → **Settings → Domains** → agrega el dominio y sigue
   las instrucciones de DNS.
3. Cambia `SITE_URL` en `lib/site.js` por el nuevo dominio y `git push`.
4. En Search Console, agrega también el nuevo dominio como propiedad.

### Paso D — Refuerza tu identidad (backlinks de confianza)
Google confía más en ti si tu sitio aparece enlazado desde tus perfiles:
- En **LinkedIn** → añade tu sitio en "Información de contacto / Sitio web".
- En **GitHub**, y en cualquier bio profesional, pon el enlace a tu sitio.
- Si publicas notas, compártelas (ya tienes los botones): más visitas y
  enlaces = mejor posición.

> Cuanto más coincida tu nombre en el sitio + LinkedIn + dominio, más rápido
> Google entiende que ese resultado eres **tú**.

### Paso E — Paciencia (1 a 4 semanas)
La indexación no es instantánea. Con Search Console configurado y un dominio
propio, buscar tu nombre debería mostrarte en primera página en unas semanas.

---

## 3. Ideas extra que puedes pedirme después
- Imagen Open Graph automática por nota (que cada nota tenga su miniatura al
  compartir sin subir imagen).
- Página de **etiquetas** (`/blog/tag/...`) para más entradas indexables.
- **RSS** del blog (`/feed.xml`) para suscriptores y lectores.
- **Newsletter** (captura de correos) al final de cada nota.
- **Analítica** (Vercel Analytics o Plausible) para ver qué notas jalan más.
- **FAQ / Q&A** con datos estructurados para "rich snippets".

Pídeme cualquiera y lo integro con el mismo estilo del sitio.
