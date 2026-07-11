import Link from "next/link";
import { getPosts, CATEGORIAS } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Blog" };

export default function Blog() {
  const posts = getPosts();

  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <span className="sql-meta">
            blog · {posts.length} {posts.length === 1 ? "nota" : "notas"}
          </span>
          <h2>Todas las notas</h2>
          <div className="chip-row">
            <span className="chip active">Todas</span>
            {Object.entries(CATEGORIAS).map(([slug, nombre]) => (
              <Link key={slug} href={`/blog/categoria/${slug}`} className="chip">
                {nombre}
              </Link>
            ))}
          </div>
        </Reveal>
        <ul className="post-list post-list-editorial">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={Math.min(i * 0.06, 0.3)}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
