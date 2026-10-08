import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calcularMinutos } from "@/lib/lectura";
import { buscarActivo } from "@/lib/activos";
import { MUNDOS, mundoDe } from "@/lib/mundos";

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
        // Mundo editorial (opcional, ver lib/mundos.js): si no se fija,
        // se deriva de `categoria` vía MUNDO_POR_CATEGORIA.
        mundo: data.mundo || null,
        // Serie editorial (opcional): agrupa notas de una serie multi-parte
        // (ej. "tesis-rag") para una página propia fuera del listado general.
        serie: data.serie || null,
        // Tarjeta social (Facebook/Instagram): ruta dentro de /public a la
        // imagen generada por scripts/social_card.py. Si no está, los
        // canales sociales caen de vuelta a la portada normal.
        socialImagen: data.socialImagen || null,
        // Gancho de marketing (opcional): texto corto para el caption de
        // Facebook/LinkedIn — pregunta abierta o tensión sin resolver, para
        // no publicar solo el link (eso reduce el alcance orgánico). Si no
        // se define, el caption cae a `resumen`.
        gancho: data.gancho || "",
        // Postura (opcional): convierte la nota en un mini-foro de debate —
        // una pregunta con un argumento "a favor" y uno "en contra" ya
        // redactados, sobre la que los lectores votan y comentan (ver
        // components/PosturaBlock.js). Si no se define, la nota no muestra
        // ese bloque.
        postura:
          data.postura && data.postura.pregunta
            ? {
                pregunta: data.postura.pregunta,
                aFavor: data.postura.aFavor || "",
                enContra: data.postura.enContra || "",
              }
            : null,
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

/** Todas las entregas de una serie editorial (ej. "tesis-rag"), en orden
 *  cronológico ascendente (semana 1 primero), incluidas aunque estén
 *  ocultas del listado general. */
export function getPostsBySerie(serie) {
  return getPosts()
    .filter((p) => p.serie === serie)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
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
  const mundo = mundoDe(p);
  const mundoNombre = MUNDOS[mundo]?.nombre || mundo;
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
    mundo,
    mundoNombre,
    horizonte: p.horizonte,
    horizonteNombre: p.horizonte ? HORIZONTES[p.horizonte] || p.horizonte : null,
    region: p.region,
    regionNombre: p.region ? REGIONES[p.region] || p.region : null,
    imagen: p.imagen,
    tags: p.tags || [],
    fecha: p.fecha,
    minutos: calcularMinutos(p.content || ""),
    buscar: sinAcentos(
      [p.titulo, p.resumen, nombreCategoria, mundoNombre, (p.tags || []).join(" "), cuerpo].join(" ")
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

/** Convierte la primera columna de cada fila del Market Snapshot en un
 *  link a /pulso-mercado/activos/[slug] cuando reconoce el activo en el
 *  glosario (lib/activos.js). Deja intacto cualquier texto que no
 *  reconozca (encabezado, separador "---", activos sin ficha, etc). */
export function enlazarActivosEnTabla(markdown = "") {
  return String(markdown)
    .split("\n")
    .map((linea) => {
      const match = linea.match(/^(\|\s*)([^|]+?)(\s*\|.*)$/);
      if (!match) return linea;
      const [, prefijo, celda, resto] = match;
      const celdaLimpia = celda.trim();
      if (!celdaLimpia || /^:?-+:?$/.test(celdaLimpia) || celda.includes("[")) {
        return linea;
      }
      const activo = buscarActivo(celdaLimpia);
      if (!activo) return linea;
      return `${prefijo}[${celdaLimpia}](/pulso-mercado/activos/${activo.slug})${resto}`;
    })
    .join("\n");
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

/** Convierte una tabla markdown (pipe-delimited) en { header, filas },
 *  saltando la línea separadora "|---|---|". */
function filasDeTabla(markdown) {
  if (!markdown) return { header: [], filas: [] };
  const lineas = String(markdown)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|"))
    .filter((l) => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?$/.test(l));
  if (lineas.length === 0) return { header: [], filas: [] };
  const partir = (l) =>
    l
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
  const [header, ...filas] = lineas.map(partir);
  return { header, filas };
}

const SIN_DATO = (v) => !v || v === "—" || v === "-" || v === "";

/** El Market Snapshot lo escribe una Routine que busca los cierres del día
 *  anterior en la web: cuando no logra verificarlos con confianza, dejar el
 *  nivel en "—" en vez de inventar un número es la postura correcta — pero
 *  eso puede dejar la tabla completa en blanco por varios días seguidos
 *  (pasó dos días consecutivos en octubre 2026). En vez de mostrar un
 *  dashboard vacío, cuando un activo no trae nivel confirmado en el Daily
 *  más reciente se busca hacia atrás, Daily por Daily, el último nivel que
 *  sí vino confirmado y se usa, dejando explícito de qué fecha es. */
export function completarMarketSnapshot(dailies) {
  if (!dailies || !dailies.length) return null;
  const seccionActual = parsearSecciones(dailies[0].content)["market snapshot"] || "";
  const actual = filasDeTabla(seccionActual);
  if (!actual.filas.length) return null;

  // Texto que sigue a la tabla en la sección (ej. "Nota de transparencia:
  // ..."), para conservarlo — es contexto del equipo editorial, no algo
  // que este fallback deba pisar.
  const notaOriginal = seccionActual
    .split("\n")
    .filter((l) => !l.trim().startsWith("|"))
    .join("\n")
    .trim();

  const historial = dailies.map((d) => ({
    fecha: d.fecha,
    filas: filasDeTabla(parsearSecciones(d.content)["market snapshot"]).filas,
  }));

  // Fecha de la fuente de cada fila mostrada (la de hoy si vino confirmada,
  // o la del Daily anterior del que se tomó prestado el nivel). Se muestra
  // arriba de la tabla la más VIEJA de todas en vez de repetirla celda por
  // celda — así "última actualización" refleja el peor caso (qué tan
  // atrasado puede estar un dato de la tabla), no solo la fecha de hoy.
  let fechaMasVieja = dailies[0].fecha;
  const filas = actual.filas.map(([activo, nivel, cambio]) => {
    if (!SIN_DATO(nivel)) return [activo, nivel, cambio];
    for (let i = 1; i < historial.length; i++) {
      const previa = historial[i].filas.find((f) => f[0] === activo);
      if (previa && !SIN_DATO(previa[1])) {
        if (new Date(historial[i].fecha) < new Date(fechaMasVieja)) {
          fechaMasVieja = historial[i].fecha;
        }
        return [activo, previa[1], previa[2]];
      }
    }
    return [activo, nivel, cambio];
  });

  return { header: actual.header, filas, nota: notaOriginal, fechaActualizacion: fechaMasVieja };
}

/** Reconstruye el markdown de una tabla (+ nota opcional debajo) a partir
 *  de { header, filas, nota } — para seguir usando ReactMarkdown/remark-gfm
 *  en el render. */
export function tablaAMarkdown({ header, filas, nota }) {
  if (!header?.length) return "";
  const fila = (cs) => `| ${cs.join(" | ")} |`;
  const tabla = [fila(header), fila(header.map(() => "---")), ...filas.map(fila)].join("\n");
  return nota ? `${tabla}\n\n${nota}` : tabla;
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

/** Hasta 2 chips de índice (S&P 500 y S&P/BMV IPC) para la tarjeta de
 *  Pulso de Mercado en el home (ver components/PulsoMercadoMini.js) —
 *  usa el mismo Market Snapshot con respaldo que /pulso-mercado. */
export function getMarketSnapshotChips() {
  const dailies = getPosts()
    .filter((p) => p.pulsoTipo === "daily")
    .slice(0, 7);
  const tabla = completarMarketSnapshot(dailies);
  if (!tabla) return [];
  const buscados = ["s&p 500", "s&p/bmv ipc"];
  return buscados
    .map((nombre) => tabla.filas.find(([activo]) => normalizarTitulo(activo) === nombre))
    .filter(Boolean)
    .filter(([, nivel]) => !SIN_DATO(nivel))
    .map(([activo, nivel, cambio]) => ({
      activo,
      nivel,
      // El cambio puede traer una nota larga de respaldo ("— último
      // dato confirmado: ...") — en el chip solo cabe el % mismo.
      cambio: cambio.split(" — ")[0].split(" (")[0],
    }));
}

/** Arma los datos para el dashboard de /pulso-mercado a partir de las notas
 *  vigentes de Pulso de Mercado, leyendo sus secciones markdown fijas. */
export function getPulsoDashboard() {
  const pulso = getPulsoMercado();
  const { daily, weeklyOutlook, monthly } = pulso;

  // Hasta 7 Dailies recientes (orden desc, ya lo da getPosts) para poder
  // completar con el último nivel confirmado cualquier activo que el
  // Daily de hoy haya dejado en "—" (ver completarMarketSnapshot).
  const dailies = getPosts()
    .filter((p) => p.pulsoTipo === "daily")
    .slice(0, 7);
  const snapshotTabla = completarMarketSnapshot(dailies);
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

  return { pulso, snapshotTabla, regimen, importoHoy, swing, position, longTerm };
}
