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
        content,
      };
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

export function getPost(slug) {
  return getPosts().find((p) => p.slug === slug) || null;
}

export function getPostsByCategoria(categoria) {
  return getPosts().filter((p) => p.categoria === categoria);
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

export function formatFecha(fecha) {
  // Acepta "2026-07-14" (manual) y "2026-07-14T00:00:00.000Z" (panel Tina)
  const d = new Date(String(fecha).includes("T") ? fecha : fecha + "T12:00:00");
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
