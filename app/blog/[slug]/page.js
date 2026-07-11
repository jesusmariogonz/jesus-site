import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPosts, getPost, CATEGORIAS, formatFecha } from "@/lib/posts";
import { calcularMinutos } from "@/lib/lectura";
import ShareRow from "@/components/ShareRow";

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post?.titulo || "Nota",
    description: post?.resumen || "",
  };
}

export default async function Post({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const minutos = calcularMinutos(post.content || "");

  return (
    <article className="article">
      <div className="container">
        <header>
          <span className="sql-meta">
            <Link href={`/blog/categoria/${post.categoria}`}>
              {CATEGORIAS[post.categoria] || post.categoria}
            </Link>{" "}
            · {minutos} min de lectura · {formatFecha(post.fecha)}
          </span>
          <h1>{post.titulo}</h1>
        </header>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        <ShareRow titulo={post.titulo} />

        <p style={{ marginTop: 32 }}>
          <Link href="/blog">← Volver al blog</Link>
        </p>
      </div>
    </article>
  );
}
