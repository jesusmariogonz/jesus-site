import { getPosts, getPostsLite, CATEGORIAS } from "@/lib/posts";
import Reveal from "@/components/Reveal";
import NotasCarrusel from "@/components/NotasCarrusel";
import BlogExplorer from "@/components/BlogExplorer";
import { SITE_NAME, absUrl } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description:
    "Notas sobre ingeniería de datos, Snowflake, Databricks, arquitectura, IA y retail.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: absUrl("/blog"),
    title: "Blog · Jesús González",
    description:
      "Notas sobre ingeniería de datos, Snowflake, Databricks, arquitectura, IA y retail.",
  },
};

export default function Blog() {
  const posts = getPosts();
  const notas = getPostsLite();

  // Editor's Pick: la nota con destacada:true, o la más reciente.
  const pick = posts.find((p) => p.destacada) || posts[0];

  // Carrusel: las 5 notas más nuevas (ya vienen ordenadas por fecha desc).
  const recientes = notas.slice(0, 5);

  // Datos estructurados: colección de artículos del blog.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog · ${SITE_NAME}`,
    url: absUrl("/blog"),
    inLanguage: "es-MX",
    blogPost: notas.slice(0, 20).map((n) => ({
      "@type": "BlogPosting",
      headline: n.titulo,
      description: n.resumen,
      url: absUrl(`/blog/${n.slug}`),
      datePublished: n.fecha,
      author: { "@type": "Person", name: "Jesús Mario González Siller" },
    })),
  };

  return (
    <section className="section">
      <div className="container">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Reveal>
          <span className="sql-meta">
            blog · {posts.length} {posts.length === 1 ? "nota" : "notas"}
          </span>
          <h2>Notas</h2>
        </Reveal>

        {recientes.length > 0 && (
          <Reveal delay={0.05}>
            <NotasCarrusel notas={recientes} titulo="Lo más reciente" />
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <BlogExplorer
            notas={notas}
            pickSlug={pick?.slug}
            categorias={Object.entries(CATEGORIAS)}
          />
        </Reveal>
      </div>
    </section>
  );
}
