import Link from "next/link";
import { calcularMinutos } from "@/lib/lectura";
import NotaCover from "@/components/NotaCover";

/* Tarjeta compacta: miniatura cuadrada + título + minutos de lectura,
   para los listados de notas por mundo/categoría. */

export default function PostCard({ post }) {
  const minutos = calcularMinutos(post.content || "");
  return (
    <li className="post-card-compacta">
      <Link href={`/blog/${post.slug}`} className="post-card-compacta-link">
        <NotaCover categoria={post.categoria} imagen={post.imagen} size="sm" />
        <div className="post-card-compacta-body">
          <h3>{post.titulo}</h3>
          <span className="post-card-meta">
            {minutos} min de lectura <span className="jx-flecha">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
