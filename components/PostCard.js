import Link from "next/link";
import { CATEGORIAS, formatFecha } from "@/lib/posts";

export default function PostCard({ post }) {
  return (
    <li className="post-card">
      <span className="sql-meta">
        {CATEGORIAS[post.categoria] || post.categoria} ·{" "}
        {formatFecha(post.fecha)}
      </span>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.titulo}</Link>
      </h3>
      <p>{post.resumen}</p>
    </li>
  );
}
