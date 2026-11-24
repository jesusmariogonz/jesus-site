import Link from "next/link";
import { EquityChart } from "@/components/TradingPublicoExplorer";

/* Cartera virtual EN VIVO de EXP-005 (ver pulso-research-lab:
   experiments/EXP-005-reverse-winners/PAPER_PORTFOLIO.md). No reusa
   BucketDetalleCard de Trading: esa cartera es dólar-ponderada (sin
   acciones ni stop), un modelo de datos distinto al de los buckets de
   producción, así que tiene su propia tabla de posiciones. */

const pct = (v, d = 2) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(d)}%`);
const dinero = (v) => (v == null ? "—" : `$${v.toFixed(2)}`);
const toneColor = (v) => (v == null ? "var(--ink)" : v >= 0 ? "#16a34a" : "#dc2626");

export default function Exp005PaperPortfolio({ data }) {
  if (!data) {
    return (
      <p className="activo-descripcion">
        La cartera virtual todavía no ha corrido por primera vez (o la corrida más
        reciente no se pudo leer) — esta sección se completa sola en cuanto exista.
      </p>
    );
  }

  const historialChart = data.historial_diario.map((h) => ({ date: h.fecha, equity: h.equity }));
  const posiciones = [...data.posiciones_abiertas].sort((a, b) => (a.entry_fecha < b.entry_fecha ? 1 : -1));

  return (
    <div className="pulsodash-panel">
      <div className="pulsodash-panel-head">
        <span className="pulsodash-panel-title">{data.nombre}</span>
        <span className="pulsodash-panel-sub">Desde {data.fecha_inicio}</span>
      </div>

      <p className="pulsodash-vacio" style={{ marginBottom: 16 }}>
        Capital virtual, reglas de cartera NUEVAS (no parte de la validación original) — ver{" "}
        <Link href="https://github.com/jesusmariogonz/pulso-research-lab/blob/main/experiments/EXP-005-reverse-winners/PAPER_PORTFOLIO.md">
          PAPER_PORTFOLIO.md
        </Link>{" "}
        para qué es el bucket ya validado y qué es nuevo aquí. Se actualiza semanalmente
        (no diario, por el ritmo de refresco de datos del laboratorio de investigación).
      </p>

      <div className="highlights-grid" style={{ margin: "16px 0 20px" }}>
        <div className="highlight-item">
          <span className="highlight-valor">${data.capital_inicial.toFixed(2)}</span>
          <span className="highlight-etiqueta">capital inicial</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">${data.equity_actual.toFixed(2)}</span>
          <span className="highlight-etiqueta">equity actual</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor" style={{ color: toneColor(data.retorno_acumulado_pct) }}>
            {pct(data.retorno_acumulado_pct)}
          </span>
          <span className="highlight-etiqueta">retorno acumulado</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{pct(Math.abs(data.drawdown_pct))}</span>
          <span className="highlight-etiqueta">drawdown</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{data.n_posiciones_abiertas}</span>
          <span className="highlight-etiqueta">posiciones abiertas</span>
        </div>
        <div className="highlight-item">
          <span className="highlight-valor">{data.n_posiciones_cerradas}</span>
          <span className="highlight-etiqueta">posiciones cerradas</span>
        </div>
      </div>

      <h3 style={{ fontSize: "0.95rem", marginBottom: 8 }}>Curva de equity</h3>
      <EquityChart history={historialChart} startingCapital={data.capital_inicial} height={160} />

      <h3 style={{ fontSize: "0.95rem", margin: "24px 0 8px" }}>
        Posiciones abiertas ({posiciones.length})
      </h3>
      {posiciones.length === 0 ? (
        <p className="pulsodash-vacio">Ninguna posición abierta ahora mismo.</p>
      ) : (
        <div className="prose" style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Símbolo</th>
                <th>Entrada</th>
                <th>Precio entrada</th>
                <th>Último precio</th>
                <th>$ invertido</th>
                <th>Retorno no realizado</th>
              </tr>
            </thead>
            <tbody>
              {posiciones.map((p, i) => (
                <tr key={`${p.ticker}-${p.entry_fecha}-${i}`}>
                  <td>{p.ticker}</td>
                  <td>{p.entry_fecha}</td>
                  <td>{dinero(p.entry_price)}</td>
                  <td>{dinero(p.ultimo_precio_conocido)}</td>
                  <td>{dinero(p.dolares_invertidos)}</td>
                  <td style={{ color: toneColor(p.retorno_no_realizado_pct) }}>
                    {pct(p.retorno_no_realizado_pct)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="pulsodash-vacio" style={{ marginTop: 16 }}>
        Última actualización del motor: {new Date(data.ultima_actualizacion).toLocaleString("es-MX", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
        .
      </p>
    </div>
  );
}
