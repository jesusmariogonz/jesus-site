import Link from "next/link";
import { CATEGORIAS } from "@/lib/posts";
import { calcularMinutos } from "@/lib/lectura";
import NotaCover from "@/components/NotaCover";

/* Tarjeta editorial: portada visual, categoría, titular grande
   y "N min de lectura →" en lugar de título+fecha. */

export default function PostCard({ post }) {
  const minutos = calcularMinutos(post.content || "");
  return (
    <li className="post-card post-card-editorial">
      <Link href={`/blog/${post.slug}`} className="post-card-link">
        <NotaCover categoria={post.categoria} size="md" />
        <div className="post-card-body">
          <span className="post-card-cat">
            {CATEGORIAS[post.categoria] || post.categoria}
          </span>
          <h3>{post.titulo}</h3>
          <p>{post.resumen}</p>
          <span className="post-card-meta">
            {minutos} min de lectura <span className="jx-flecha">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
