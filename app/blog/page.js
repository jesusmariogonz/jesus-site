import Link from "next/link";
import { getPosts, CATEGORIAS } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata = { title: "Blog" };

export default function Blog() {
  const posts = getPosts();

  return (
    <section className="section">
      <div className="container">
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
        <ul className="post-list">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </ul>
      </div>
    </section>
  );
}
