import { getPosts, CATEGORIAS } from "@/lib/posts";
import { SITE_URL } from "@/lib/site";

/* Genera automáticamente https://TU-SITIO/sitemap.xml
   Google lo usa para descubrir e indexar todas tus páginas. */
export default function sitemap() {
  const ahora = new Date();

  const fijas = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/proyectos`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/the-toolkit`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/sobre-mi`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/contacto`, changeFrequency: "yearly", priority: 0.5 },
  ].map((r) => ({ ...r, lastModified: ahora }));

  const notas = getPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(
      String(p.fecha).includes("T") ? p.fecha : p.fecha + "T12:00:00"
    ),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categorias = Object.keys(CATEGORIAS).map((slug) => ({
    url: `${SITE_URL}/blog/categoria/${slug}`,
    lastModified: ahora,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [...fijas, ...notas, ...categorias];
}
