import Link from "next/link";
import { getPosts, CATEGORIAS } from "@/lib/posts";
import PostCard from "@/components/PostCard";
<<<<<<< HEAD
import NotaCover from "@/components/NotaCover";
import Reveal from "@/components/Reveal";
import { calcularMinutos } from "@/lib/lectura";
=======
import Reveal from "@/components/Reveal";
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2

export const metadata = { title: "Blog" };

export default function Blog() {
  const posts = getPosts();
  // Editor's Pick: la nota con destacada:true, o la más reciente
  const pick = posts.find((p) => p.destacada) || posts[0];
  const resto = posts.filter((p) => p.slug !== pick?.slug);

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <span className="sql-meta">
            blog · {posts.length} {posts.length === 1 ? "nota" : "notas"}
          </span>
<<<<<<< HEAD
          <h2>Notas</h2>
=======
          <h2>Todas las notas</h2>
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2
          <div className="chip-row">
            <span className="chip active">Todas</span>
            {Object.entries(CATEGORIAS).map(([slug, nombre]) => (
              <Link key={slug} href={`/blog/categoria/${slug}`} className="chip">
                {nombre}
              </Link>
            ))}
          </div>
        </Reveal>
<<<<<<< HEAD

        {pick && (
          <Reveal delay={0.05}>
            <Link href={`/blog/${pick.slug}`} className="editors-pick">
              <NotaCover categoria={pick.categoria} imagen={pick.imagen} size="pick" />
              <div className="editors-pick-body">
                <span className="editors-pick-badge">★ Editor's Pick</span>
                <h3>{pick.titulo}</h3>
                <p>{pick.resumen}</p>
                <span className="post-card-meta">
                  {CATEGORIAS[pick.categoria] || pick.categoria} ·{" "}
                  {calcularMinutos(pick.content || "")} min de lectura{" "}
                  <span className="jx-flecha">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        <ul className="post-list post-list-editorial">
          {resto.map((post, i) => (
=======
        <ul className="post-list post-list-editorial">
          {posts.map((post, i) => (
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
