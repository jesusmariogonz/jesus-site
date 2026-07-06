import Link from "next/link";
import { getPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export default function Inicio() {
  const ultimos = getPosts().slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="sql-meta">saltillo, coahuila · méxico</span>
          <h1>
            Datos, arquitectura y <em>decisiones</em>.
          </h1>
          <p className="lede">
            Soy Jesús. Trabajo en producto de datos y analítica en retail:
            pipelines en PySpark, modelos en Snowflake y la eterna pregunta de
            cómo convertir todo eso en decisiones de negocio. Aquí escribo lo
            que voy aprendiendo.
          </p>
          <div className="query-card" aria-hidden="true">
            <div>
              <span className="cmt">-- ¿quién escribe aquí?</span>
            </div>
            <div>
              <span className="kw">SELECT</span> rol, stack, temas
            </div>
            <div>
              <span className="kw">FROM</span> jesus.perfil
            </div>
            <div>
              <span className="kw">WHERE</span> activo = <span className="kw">TRUE</span>;
            </div>
            <br />
            <div>
              <span className="cmt">
                → &#123; rol: <span className="str">'Product Owner de Datos'</span>,
              </span>
            </div>
            <div>
              <span className="cmt">
                &nbsp;&nbsp;&nbsp;stack:{" "}
                <span className="str">'Snowflake · Databricks · Azure'</span>,
              </span>
            </div>
            <div>
              <span className="cmt">
                &nbsp;&nbsp;&nbsp;temas:{" "}
                <span className="str">'datos, IA, retail, opinión'</span> &#125;
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Últimas notas</h2>
          <ul className="post-list">
            {ultimos.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
          <p style={{ marginTop: 20 }}>
            <Link href="/blog">Ver todas las notas →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
