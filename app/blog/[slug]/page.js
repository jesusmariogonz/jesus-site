import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getPosts,
  getPost,
  getPostsLite,
  CATEGORIAS,
  formatFecha,
} from "@/lib/posts";
import { calcularMinutos } from "@/lib/lectura";
import ShareRow from "@/components/ShareRow";
import NotasCarrusel from "@/components/NotasCarrusel";
import NotaCover from "@/components/NotaCover";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleToc from "@/components/ArticleToc";
import VolverArriba from "@/components/VolverArriba";
import ToolkitBanner from "@/components/ToolkitBanner";
import NewsletterForm from "@/components/NewsletterForm";
import { SITE_NAME, AUTHOR, absUrl } from "@/lib/site";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Nota" };
  const url = absUrl(`/blog/${slug}`);
  const imagen = post.imagen || "/og-image.png";
  return {
    title: post.titulo,
    description: post.resumen,
    keywords: [
      ...(post.tags || []),
      CATEGORIAS[post.categoria] || post.categoria,
      "datos",
      "analítica",
    ],
    authors: [{ name: AUTHOR.name }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.titulo,
      description: post.resumen,
      publishedTime: post.fecha,
      authors: [AUTHOR.name],
      tags: post.tags || [],
      images: [{ url: imagen }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.titulo,
      description: post.resumen,
      images: [imagen],
    },
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const minutos = calcularMinutos(post.content || "");
  const todas = getPostsLite();

  // Carrusel "una vez adentro": las notas más nuevas, sin la actual.
  const recientes = todas.filter((n) => n.slug !== slug).slice(0, 5);

  // Notas relacionadas: misma categoría; si no alcanzan, completa con recientes.
  const mismaCat = todas.filter(
    (n) => n.slug !== slug && n.categoria === post.categoria
  );
  const relacionadas = (
    mismaCat.length >= 3
      ? mismaCat
      : [...mismaCat, ...todas.filter((n) => n.slug !== slug && !mismaCat.includes(n))]
  ).slice(0, 3);

  // Datos estructurados de artículo + miga de pan (breadcrumbs).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumen,
    inLanguage: "es-MX",
    datePublished: post.fecha,
    dateModified: post.fecha,
    image: [absUrl(post.imagen || "/og-image.png")],
    mainEntityOfPage: absUrl(`/blog/${slug}`),
    keywords: (post.tags || []).join(", "),
    articleSection: CATEGORIAS[post.categoria] || post.categoria,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: absUrl("/sobre-mi"),
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR.name,
    },
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absUrl("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: post.titulo,
        item: absUrl(`/blog/${slug}`),
      },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <article className="article">
        <div className="container">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
          />

          {recientes.length > 0 && (
            <NotasCarrusel notas={recientes} titulo="Lo más reciente" />
          )}

          <header className="article-header-wrap">
            <span className="sql-meta">
              <Link href={`/blog/categoria/${post.categoria}`}>
                {CATEGORIAS[post.categoria] || post.categoria}
              </Link>
            </span>
            <h1>{post.titulo}</h1>

            {post.resumen && <p className="article-deck">{post.resumen}</p>}

            <div className="article-byline">
              <span className="article-byline-autor">{AUTHOR.name}</span>
              <span aria-hidden="true">·</span>
              <span>{formatFecha(post.fecha)}</span>
              <span aria-hidden="true">·</span>
              <span>{minutos} min de lectura</span>
            </div>

            {post.tags?.length > 0 && (
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="article-layout">
            <div className="article-main">
              <div className="prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.content}
                </ReactMarkdown>
              </div>

              <ShareRow titulo={post.titulo} />

              <NewsletterForm titulo="¿Te sirvió esta nota?" desc="Suscríbete y te aviso cuando publique una nueva." />
            </div>

            <aside className="article-aside">
              <ArticleToc />

              {(post.tesis || post.datosClave?.length > 0) && (
                <div className="article-highlights">
                  {post.datosClave?.length > 0 && (
                    <>
                      <span className="article-highlights-titulo">En una mirada</span>
                      <div className="highlights-grid">
                        {post.datosClave.map((d, i) => (
                          <div className="highlight-item" key={i}>
                            <span className="highlight-valor">{d.valor}</span>
                            <span className="highlight-etiqueta">{d.etiqueta}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {post.tesis && (
                    <blockquote className="article-tesis">
                      <span className="article-tesis-label">Mi tesis</span>
                      <p>{post.tesis}</p>
                    </blockquote>
                  )}
                </div>
              )}

              <ToolkitBanner className="tk-banner-aside" />
            </aside>
          </div>

          {relacionadas.length > 0 && (
            <section className="relacionadas">
              <span className="sql-meta">-- sigue leyendo</span>
              <ul className="post-list post-list-editorial">
                {relacionadas.map((n) => (
                  <li key={n.slug} className="post-card post-card-editorial">
                    <Link href={`/blog/${n.slug}`} className="post-card-link">
                      <NotaCover
                        categoria={n.categoria}
                        imagen={n.imagen}
                        size="md"
                      />
                      <div className="post-card-body">
                        <span className="post-card-cat">{n.categoriaNombre}</span>
                        <h3>{n.titulo}</h3>
                        <span className="post-card-meta">
                          {n.minutos} min de lectura{" "}
                          <span className="jx-flecha">→</span>
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p style={{ marginTop: 32 }}>
            <Link href="/blog">← Volver al blog</Link>
          </p>
        </div>
      </article>
      <VolverArriba />
    </>
  );
}
