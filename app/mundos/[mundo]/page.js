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
  if (!m) return { title: "Mundo" };
  return {
    title: m.nombre,
    description: m.descripcion,
    alternates: { canonical: `/mundos/${mundo}` },
  };
}

export default async function Mundo({ params }) {
  const { mundo } = await params;
  const m = MUNDOS[mundo];
  if (!m) notFound();
  const posts = getPostsByMundo(mundo);

  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">
          mundos · {posts.length} {posts.length === 1 ? "nota" : "notas"}
        </span>
        <h2>{m.nombre}</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "60ch", margin: "0 0 24px" }}>
          {m.descripcion}
        </p>
        <div className="chip-row">
          <Link href="/mundos" className="chip">
            Todos los mundos
          </Link>
          {Object.entries(MUNDOS).map(([slug, mm]) => (
            <Link
              key={slug}
              href={`/mundos/${slug}`}
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
