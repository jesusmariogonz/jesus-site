import Link from "next/link";
import { getPulsoMercado, formatFechaCorta } from "@/lib/posts";

/* Home: mención discreta de Pulso de Mercado, sin competir
   visualmente con Proyectos ni con Últimas notas. Un solo renglón. */
export default function PulsoMercadoMini() {
  const { daily } = getPulsoMercado();
  if (!daily) return null;

  return (
    <section className="jx-wrap pulso-mini">
      <Link href="/pulso-mercado" className="pulso-mini-link">
        <span className="pulso-mini-kicker">Pulso de Mercado</span>
        <span className="pulso-mini-titulo">{daily.titulo}</span>
        <span className="pulso-mini-fecha">{formatFechaCorta(daily.fecha)}</span>
        <span className="pulso-mini-flecha">→</span>
      </Link>
    </section>
  );
}
