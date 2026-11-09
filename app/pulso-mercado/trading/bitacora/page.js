import Link from "next/link";
import { DECISIONES, DECISIONES_ULTIMA_ACTUALIZACION } from "@/lib/trading/decisiones";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Bitácora de decisiones — Trading Algorítmico",
  description:
    "Las 27 decisiones de diseño del sistema de trading algorítmico, incluyendo lo que se probó y se descartó, con la evidencia real detrás de cada una.",
  alternates: { canonical: "/pulso-mercado/trading/bitacora" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/trading/bitacora"),
    title: "Bitácora de decisiones — Trading Algorítmico",
  },
};

function colorEstado(estado) {
  if (estado.startsWith("Superseded")) return "#64748b";
  if (estado.includes("descarte") || estado === "Descartado") return "#dc2626";
  if (estado.includes("Pendiente") || estado === "Propuesto") return "#d97706";
  if (estado.includes("vigente") || estado.includes("reemplaza")) return "#16a34a";
  return "#1348d6";
}

export default function BitacoraPage() {
  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> · Bitácora de decisiones
          · Engineering &amp; Decision Log
        </span>
        <h1>Bitácora de decisiones (ADR)</h1>
        <p className="activo-descripcion">
          Cada cambio de diseño de este sistema queda documentado como un ADR (Architecture
          Decision Record) en el repositorio del motor, incluyendo las decisiones que después se
          revirtieron y los experimentos que se probaron y se descartaron. {DECISIONES_ULTIMA_ACTUALIZACION}{" "}
          Nada aquí se oculta ni se reescribe — una decisión superada por otra posterior se marca
          como tal, nunca se borra.
        </p>

        <div className="trading-bitacora-lista">
          {DECISIONES.map((d) => (
            <div key={d.id} className="trading-bitacora-item">
              <div className="trading-bitacora-head">
                <span className="trading-bitacora-id">ADR {d.id}</span>
                <span className="trading-bitacora-estado" style={{ color: colorEstado(d.estado) }}>
                  {d.estado}
                </span>
              </div>
              <h2>{d.titulo}</h2>
              <p>{d.resumen}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado/trading">← Volver a Trading Algorítmico</Link>
        </p>
      </div>
    </section>
  );
}
