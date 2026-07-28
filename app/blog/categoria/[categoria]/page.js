import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostsByCategoria, CATEGORIAS } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export function generateStaticParams() {
  return Object.keys(CATEGORIAS).map((categoria) => ({ categoria }));
}

export async function generateMetadata({ params }) {
  const { categoria } = await params;
  const nombre = CATEGORIAS[categoria];
  if (!nombre) return { title: "Categoría" };
  return {
    title: nombre,
    description: `Notas de ${nombre} por Jesús González — datos, analítica e IA.`,
    alternates: { canonical: `/blog/categoria/${categoria}` },
  };
}

export default async function Categoria({ params }) {
  const { categoria } = await params;
  const nombre = CATEGORIAS[categoria];
  if (!nombre) notFound();

  const posts = getPostsByCategoria(categoria);

  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">
          blog · categoría · {posts.length}{" "}
          {posts.length === 1 ? "nota" : "notas"}
        </span>
        <h2>{nombre}</h2>
        <div className="chip-row">
          <Link href="/blog" className="chip">
            Todas
          </Link>
          {Object.entries(CATEGORIAS).map(([slug, n]) => (
            <Link
              key={slug}
              href={`/blog/categoria/${slug}`}
              className={slug === categoria ? "chip active" : "chip"}
            >
              {n}
            </Link>
          ))}
        </div>
        {posts.length === 0 ? (
          <p style={{ color: "var(--ink-soft)" }}>
            Aún no hay notas en esta categoría. Crea un archivo{" "}
            <code>.md</code> en <code>content/blog/</code> con{" "}
            <code>categoria: {categoria}</code> y aparecerá aquí.
          </p>
        ) : (
          <ul className="post-list">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
