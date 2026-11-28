import Link from "next/link";
import { listarSemanas, getSemana } from "@/lib/trading/resumen-semanal";
import { absUrl } from "@/lib/site";

export const metadata = {
  title: "Resumen semanal de trading — Pulso de Mercado",
  description:
    "Archivo de resúmenes semanales del sistema de trading algorítmico: qué pasó en el mercado y cómo le fue a cada motor, semana por semana.",
  alternates: { canonical: "/pulso-mercado/trading/resumen-semanal" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/trading/resumen-semanal"),
    title: "Resumen semanal de trading — Pulso de Mercado",
  },
};

const color = (n) => (n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : undefined);
const signo = (n) => (n > 0 ? "+" : "");

function rango(semana) {
  const f = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "long" });
  };
  return `${f(semana.inicio)} al ${f(semana.fin)}`;
}

export default function ResumenSemanalIndice() {
  const semanas = listarSemanas().map((slug) => ({ slug, resumen: getSemana(slug) }));
  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> · Resumen semanal
        </span>
        <h1>Resumen semanal de trading</h1>
        <p className="activo-descripcion">
          Una página por semana, publicada cada viernes al cierre del mercado: qué pasó, cómo le fue a cada motor,
          ganancias y pérdidas de los activos comprados y candidatos para la semana siguiente.
        </p>
        {semanas.length === 0 ? (
          <p className="pulsodash-vacio">Todavía no hay resúmenes publicados.</p>
        ) : (
          semanas.map(({ slug, resumen }) => (
            <div className="activo-bloque" key={slug}>
              <h2>
                <Link href={`/pulso-mercado/trading/resumen-semanal/${slug}`}>Semana del {rango(resumen.semana)}</Link>
              </h2>
              <p>{resumen.mercado.narrativa[0]}</p>
              <p className="pulsodash-vacio">
                {resumen.motores.map((m, i) => (
                  <span key={m.id}>
                    {i > 0 ? " · " : ""}
                    {m.nombre.split(" (")[0]}:{" "}
                    <span style={{ color: color(m.pnl_semana_usd) }}>
                      {m.pnl_semana_usd < 0 ? "-" : signo(m.pnl_semana_usd)}${Math.abs(m.pnl_semana_usd ?? 0).toFixed(2)}
                    </span>
                  </span>
                ))}
              </p>
              <Link href={`/pulso-mercado/trading/resumen-semanal/${slug}`} className="trading-symbol-link">
                Leer el resumen →
              </Link>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
