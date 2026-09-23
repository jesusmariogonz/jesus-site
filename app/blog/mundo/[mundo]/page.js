import Link from "next/link";
import { notFound } from "next/navigation";
import { MUNDOS, getPostsByMundo } from "@/lib/mundos";
import PostCard from "@/components/PostCard";

export function generateStaticParams() {
  return Object.keys(MUNDOS).map((mundo) => ({ mundo }));
}

export async function generateMetadata({ params }) {
  const { mundo } = await params;
  const m = MUNDOS[mundo];
  if (!m) return { title: "Ideas" };
  return {
    title: `${m.nombre} · Ideas`,
    description: m.descripcion,
    alternates: { canonical: `/blog/mundo/${mundo}` },
  };
}

export default async function BlogMundo({ params }) {
  const { mundo } = await params;
  const m = MUNDOS[mundo];
  if (!m) notFound();
  const posts = getPostsByMundo(mundo);

  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">
          ideas · {posts.length} {posts.length === 1 ? "nota" : "notas"}
        </span>
        <h2>{m.nombre}</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", margin: "0 0 24px" }}>
          {m.descripcion}
        </p>
        <div className="chip-row">
          <Link href="/blog" className="chip">
            Todas
          </Link>
          {Object.entries(MUNDOS).map(([slug, mm]) => (
            <Link
              key={slug}
              href={`/blog/mundo/${slug}`}
              className={slug === mundo ? "chip active" : "chip"}
            >
              {mm.nombre}
            </Link>
          ))}
        </div>
        {posts.length === 0 ? (
          <p>Todavía no hay notas en este mundo.</p>
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
