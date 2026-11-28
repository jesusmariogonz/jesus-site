import Link from "next/link";

/* Tarjeta breve del resumen semanal para el dashboard de Trading
   (donde antes estaba "Salud del sistema"). El detalle completo vive en
   /pulso-mercado/trading/resumen-semanal/<semana>. */

const color = (n) => (n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : undefined);
const signo = (n) => (n > 0 ? "+" : n < 0 ? "-" : "");
const usd = (n) => `${signo(n)}$${Math.abs(n ?? 0).toFixed(2)}`;

function rango(semana) {
  const f = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-MX", { day: "numeric", month: "short" }).replace(" de ", " ");
  };
  return `${f(semana.inicio)} al ${f(semana.fin)}`;
}

export default function ResumenSemanalCard({ ultima }) {
  if (!ultima) return null;
  const { slug, resumen } = ultima;
  const mejor = resumen.motores
    .filter((m) => m.activos_semana?.length)
    .flatMap((m) => m.activos_semana)
    .reduce((acc, a) => (acc && acc.pnl_total_usd >= a.pnl_total_usd ? acc : a), null);
  const peor = resumen.motores
    .filter((m) => m.activos_semana?.length)
    .flatMap((m) => m.activos_semana)
    .reduce((acc, a) => (acc && acc.pnl_total_usd <= a.pnl_total_usd ? acc : a), null);
  return (
    <div className="pulsodash-panel" style={{ marginBottom: 24 }}>
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">Resumen semanal · {rango(resumen.semana)}</span>
      </div>
      <p style={{ marginTop: 12 }}>{resumen.mercado.narrativa[0]}</p>
      <div className="trading-stat-grid" style={{ marginTop: 12 }}>
        {resumen.motores.map((m) => (
          <div className="trading-stat-card" key={m.id}>
            <span className="trading-stat-etiqueta">{m.nombre.split(" (")[0]}</span>
            <span className="trading-stat-valor" style={{ color: color(m.pnl_semana_usd) }}>
              {usd(m.pnl_semana_usd)}
            </span>
            <span className="trading-stat-sub">
              {m.pnl_semana_pct != null ? `${signo(m.pnl_semana_pct)}${Math.abs(m.pnl_semana_pct)}% en la semana` : "en la semana"}
            </span>
          </div>
        ))}
      </div>
      {mejor && peor && (
        <p className="pulsodash-vacio" style={{ marginTop: 10 }}>
          Mejor activo comprado desde su entrada: <strong>{mejor.symbol}</strong>{" "}
          <span style={{ color: color(mejor.pnl_total_usd) }}>
            ({usd(mejor.pnl_total_usd)})
          </span>
          . Peor: <strong>{peor.symbol}</strong>{" "}
          <span style={{ color: color(peor.pnl_total_usd) }}>
            ({usd(peor.pnl_total_usd)})
          </span>
          .
        </p>
      )}
      <p style={{ marginTop: 12 }}>
        <Link href={`/pulso-mercado/trading/resumen-semanal/${slug}`} className="trading-symbol-link">
          Ver el resumen semanal completo →
        </Link>
        {" · "}
        <Link href="/pulso-mercado/trading/resumen-semanal" className="trading-symbol-link">
          Semanas anteriores
        </Link>
      </p>
    </div>
  );
}
