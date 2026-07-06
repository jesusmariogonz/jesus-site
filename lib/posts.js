import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "blog");

// Categorías del blog: slug (para la URL) → nombre visible
export const CATEGORIAS = {
  "ingenieria-de-datos": "Ingeniería de Datos",
  snowflake: "Snowflake",
  arquitectura: "Arquitectura",
  ia: "IA",
  oxxo: "OXXO",
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

export function formatFecha(fecha) {
  const d = new Date(fecha + "T12:00:00");
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
