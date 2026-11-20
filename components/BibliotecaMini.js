import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import RecursoCard from "@/components/RecursoCard";

/* Home: una muestra de la Biblioteca con las mismas tarjetas que /recursos
   (portada, breve explicación, precio, enlace al libro y botón de compra):
   un libro de mercado, AI Solution Architect y Control Cognitivo
   Empresarial. El catálogo completo vive en /recursos. */
const IDS = [
  "como-leer-el-mercado-fundamentos",
  "ai-solution-architect",
  "control-cognitivo-empresarial",
];

export default function BibliotecaMini() {
  const libros = IDS.map((id) => LIBROS.find((l) => l.id === id)).filter(Boolean);
  if (!libros.length) return null;

  return (
    <section className="jx-wrap biblioteca-mini">
      <div className="biblioteca-mini-head">
        <h2>Biblioteca</h2>
        <Link href="/recursos">Ver toda la biblioteca →</Link>
      </div>
      <p className="biblioteca-mini-texto">
        Menos teoría, más herramientas que puedes usar: libros y guías sobre
        datos, IA y negocio, gratis y de pago.
      </p>
      <div className="lib-grid biblioteca-mini-libros">
        {libros.map((l) => (
          <RecursoCard key={l.id} libro={l} />
        ))}
      </div>
    </section>
  );
}
