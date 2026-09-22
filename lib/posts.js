import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calcularMinutos } from "@/lib/lectura";

const postsDir = path.join(process.cwd(), "content", "blog");

// Categorías del blog: slug (para la URL) → nombre visible
export const CATEGORIAS = {
  "ingenieria-de-datos": "Data Engineering",
  snowflake: "Snowflake",
  arquitectura: "Data Architecture",
  ia: "IA & GenAI",
  cloud: "Cloud",
  "data-model": "Data Model",
  "business-analytics": "Business Analytics",
  business: "Business",
  leadership: "Leadership",
  geopolitics: "Geopolitics",
  fintech: "Fintech",
  opinion: "Opinión",
};

// Horizonte editorial (Insights): slug → etiqueta visible del badge.
export const HORIZONTES = {
  swing: "Swing",
  position: "Position",
  "long-term": "Long Term",
  macro: "Macro",
};

// Región editorial (Insights): slug → etiqueta visible del badge.
export const REGIONES = {
  us: "US",
  mexico: "Mexico",
  global: "Global",
};

export function getPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(postsDir, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        titulo: data.titulo || slug,
        fecha: data.fecha || "2026-01-01",
        categoria: data.categoria || "opinion",
        resumen: data.resumen || "",
        // Tesis editorial (opcional): frase destacada arriba del artículo
        tesis: data.tesis || "",
        // Datos clave / "En una mirada" (opcional): lista de { valor, etiqueta }
        datosClave: Array.isArray(data.datosClave) ? data.datosClave : [],
        // Thumbnail de la nota: ruta dentro de /public, ej. "/blog/mi-nota.jpg"
        imagen: data.imagen || null,
        // Editor's Pick: marca una nota con destacada: true en su frontmatter
        destacada: data.destacada === true,
        // Etiquetas de la nota (lista del panel de Tina)
        tags: Array.isArray(data.tags) ? data.tags : [],
        // Pulso de Mercado: "daily" | "weekly-review" | "weekly-outlook" | "monthly".
        // Si trae un valor, la nota solo se muestra en la franja de Pulso de
        // Mercado (la más reciente de cada tipo), no en el listado general.
        pulsoTipo: data.pulsoTipo || null,
        // Oculta la nota del listado general y de la búsqueda, pero sigue
        // teniendo su propia URL (para SEO/histórico). Se usa en notas
        // viejas que reemplazamos por una vigente (ej. "Mercados hoy").
        oculta: data.oculta === true,
        // Badges editoriales de Insights (opcionales): horizonte
        // (swing/position/long-term/macro) y región (us/mexico/global).
        horizonte: data.horizonte || null,
        region: data.region || null,
        content,
      };
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export function getPost(slug) {
  return getPosts().find((p) => p.slug === slug) || null;
}

/** Una nota aparece en listados generales (blog, carruseles, búsqueda,
 *  categorías) solo si no está oculta y no es parte de Pulso de Mercado
 *  (esas se muestran únicamente en la franja de Pulso de Mercado). */
function esListable(p) {
  return !p.oculta && !p.pulsoTipo;
}

export function getPostsListado() {
  return getPosts().filter(esListable);
}

export function getPostsByCategoria(categoria) {
  return getPosts().filter((p) => p.categoria === categoria && esListable(p));
}

/** La nota más reciente de cada tipo de Pulso de Mercado. */
export function getPulsoMercado() {
  const posts = getPosts().filter((p) => p.pulsoTipo);
  const porTipo = (tipo) => posts.find((p) => p.pulsoTipo === tipo) || null;
  return {
    daily: porTipo("daily"),
    weeklyReview: porTipo("weekly-review"),
    weeklyOutlook: porTipo("weekly-outlook"),
    monthly: porTipo("monthly"),
  };
}

/* ------------------------------------------------------------
   Versión ligera y serializable de una nota, para pasarla a los
   componentes de cliente (carrusel y buscador). NO incluye el
   cuerpo completo: solo lo necesario para mostrar la tarjeta y
   un índice de búsqueda (`buscar`) sin acentos.
   ------------------------------------------------------------ */
function sinAcentos(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function serializePost(p) {
  const nombreCategoria = CATEGORIAS[p.categoria] || p.categoria;
  // Fragmento del cuerpo para que la búsqueda encuentre por contenido,
  // sin enviar el markdown completo al navegador.
  const cuerpo = (p.content || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .slice(0, 600);

  return {
    slug: p.slug,
    titulo: p.titulo,
    resumen: p.resumen,
    categoria: p.categoria,
    categoriaNombre: nombreCategoria,
    horizonte: p.horizonte,
    horizonteNombre: p.horizonte ? HORIZONTES[p.horizonte] || p.horizonte : null,
    region: p.region,
    regionNombre: p.region ? REGIONES[p.region] || p.region : null,
    imagen: p.imagen,
    tags: p.tags || [],
    fecha: p.fecha,
    minutos: calcularMinutos(p.content || ""),
    buscar: sinAcentos(
      [p.titulo, p.resumen, nombreCategoria, (p.tags || []).join(" "), cuerpo].join(" ")
    ),
  };
}

/** Todas las notas en formato ligero (ya vienen ordenadas por fecha desc). */
export function getPostsLite() {
  return getPosts().map(serializePost);
}

/** Como getPostsLite(), pero solo las notas listables (ver esListable). */
export function getPostsListadoLite() {
  return getPostsListado().map(serializePost);
}

export function formatFecha(fecha) {
  // Acepta "2026-07-14" (manual) y "2026-07-14T00:00:00.000Z" (panel Tina)
  const d = new Date(String(fecha).includes("T") ? fecha : fecha + "T12:00:00");
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Versión corta de formatFecha, para tarjetas de lista (ej. "14 jul 2026"). */
export function formatFechaCorta(fecha) {
  const d = new Date(String(fecha).includes("T") ? fecha : fecha + "T12:00:00");
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Sin acentos y en minúsculas, para comparar títulos de sección markdown. */
function normalizarTitulo(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** Parte el markdown de una nota de Pulso de Mercado en sus secciones "## ",
 *  devolviendo un mapa { "titulo normalizado": "markdown de la sección" }.
 *  Las Routines de Pulso de Mercado siempre usan encabezados "## " fijos
 *  (ver los prompts de las Routines), así que este parseo es estable. */
export function parsearSecciones(markdown = "") {
  const secciones = {};
  const partes = String(markdown).split(/^##\s+/m).slice(1);
  for (const parte of partes) {
    const salto = parte.indexOf("\n");
    const titulo = (salto === -1 ? parte : parte.slice(0, salto)).trim();
    const cuerpo = (salto === -1 ? "" : parte.slice(salto + 1)).trim();
    secciones[normalizarTitulo(titulo)] = cuerpo;
  }
  return secciones;
}

/** Devuelve el markdown de una sección de una nota por su nombre, o null si
 *  la nota no existe o no trae esa sección. */
export function seccion(post, nombre) {
  if (!post) return null;
  const cuerpo = parsearSecciones(post.content)[normalizarTitulo(nombre)];
  return cuerpo || null;
}

/** Primera sección no vacía entre varios nombres candidatos (permite usar un
 *  fallback: ej. tomar "Swing" del Daily, o si no existe, "Swing Radar" del
 *  Weekly Outlook). `fuentes` es una lista de { post, nombres } en orden de
 *  preferencia. */
function primeraSeccion(fuentes) {
  for (const { post, nombres } of fuentes) {
    if (!post) continue;
    const secciones = parsearSecciones(post.content);
    for (const nombre of nombres) {
      const cuerpo = secciones[normalizarTitulo(nombre)];
      if (cuerpo) return { cuerpo, post };
    }
  }
  return null;
}

/** Arma los datos para el dashboard de /pulso-mercado a partir de las notas
 *  vigentes de Pulso de Mercado, leyendo sus secciones markdown fijas. */
export function getPulsoDashboard() {
  const pulso = getPulsoMercado();
  const { daily, weeklyOutlook, monthly } = pulso;

  const snapshot = daily ? parsearSecciones(daily.content)["market snapshot"] : null;
  const regimen = daily ? parsearSecciones(daily.content)["market regime"] : null;
  const importoHoy = daily ? parsearSecciones(daily.content)["que importo hoy"] : null;

  const swing = primeraSeccion([
    { post: daily, nombres: ["swing"] },
    { post: weeklyOutlook, nombres: ["swing radar"] },
  ]);
  const position = primeraSeccion([
    { post: daily, nombres: ["position"] },
    { post: weeklyOutlook, nombres: ["position radar"] },
  ]);
  const longTerm = primeraSeccion([
    { post: daily, nombres: ["long term"] },
    { post: weeklyOutlook, nombres: ["long-term radar", "long term radar"] },
    { post: monthly, nombres: ["thesis tracker"] },
  ]);

  return { pulso, snapshot, regimen, importoHoy, swing, position, longTerm };
}
