import Link from "next/link";
import { notFound } from "next/navigation";
import { getTradingSymbols, getTradingSymbolDetail } from "@/lib/trading/public-snapshot";
import { getSimboloInfo } from "@/lib/trading/simbolos-info";
import { absUrl } from "@/lib/site";

export function generateStaticParams() {
  return getTradingSymbols().map((symbol) => ({ symbol }));
}

export async function generateMetadata({ params }) {
  const { symbol } = await params;
  const detalle = getTradingSymbolDetail(symbol);
  if (!detalle) return { title: "Símbolo" };
  return {
    title: `${symbol} — Trading Algorítmico · Pulso de Mercado`,
    description: `Historial real de operaciones del sistema de trading algorítmico sobre ${symbol}: entradas, salidas, resultado y en qué bucket se opera.`,
    alternates: { canonical: `/pulso-mercado/trading/simbolo/${symbol}` },
    openGraph: {
      type: "website",
      url: absUrl(`/pulso-mercado/trading/simbolo/${symbol}`),
      title: `${symbol} — Trading Algorítmico`,
    },
  };
}

function toneColor(n) {
  if (n === null || n === undefined) return undefined;
  return n > 0 ? "#16a34a" : n < 0 ? "#dc2626" : undefined;
}

export default async function SimboloPage({ params }) {
  const { symbol } = await params;
  const detalle = getTradingSymbolDetail(symbol);
  if (!detalle) notFound();

  const { resumen, operaciones, buckets } = detalle;
  const info = getSimboloInfo(symbol);

  return (
    <section className="section">
      <div className="container horizonte-page activo-page">
        <span className="pulsodash-eyebrow">
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link> · Símbolo
        </span>
        <h1>{symbol}</h1>
        {info && <p className="activo-mercado">{info.nombre} · {info.tipo}</p>}
        <p className="activo-mercado">
          Operado en: {buckets.map((b) => b.etiqueta).join(" · ")}
        </p>
        {info ? (
          <p className="activo-descripcion">{info.categoria}</p>
        ) : (
          <p className="activo-descripcion">
            Instrumento operado por el sistema sin descripción todavía disponible en esta página.
          </p>
        )}
        <p className="activo-descripcion">
          Historial real de cómo el sistema de trading algorítmico operó {symbol}: cuándo entró,
          cuándo salió, con qué resultado y bajo qué estrategia, directamente del mismo snapshot
          que alimenta el dashboard de{" "}
          <Link href="/pulso-mercado/trading">Trading Algorítmico</Link>.
        </p>

        <p className="pulsodash-vacio" style={{ marginBottom: 16 }}>
          {resumen.monedaUSD
            ? "No se pudo obtener el tipo de cambio de hoy — las cifras se muestran en USD (dólares), no en pesos."
            : `Cifras en pesos mexicanos (MXN), convertidas de USD al tipo de cambio del ${resumen.usdMxnRateFecha || "día"}: $${resumen.usdMxnRate} MXN por USD.`}
        </p>

        <div className="activo-bloque">
          <h2>Resumen en este sistema</h2>
          <div className="highlights-grid">
            <div className="highlight-item">
              <span className="highlight-valor">{resumen.totalOperaciones}</span>
              <span className="highlight-etiqueta">operaciones totales</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">{resumen.abiertas}</span>
              <span className="highlight-etiqueta">abiertas ahora</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">{resumen.cerradas}</span>
              <span className="highlight-etiqueta">cerradas</span>
            </div>
            {resumen.winRatePct !== null && (
              <div className="highlight-item">
                <span className="highlight-valor">{resumen.winRatePct}%</span>
                <span className="highlight-etiqueta">win rate</span>
              </div>
            )}
            {resumen.cerradas > 0 && (
              <div className="highlight-item">
                <span className="highlight-valor" style={{ color: toneColor(resumen.pnlTotal) }}>
                  ${resumen.pnlTotal}
                </span>
                <span className="highlight-etiqueta">P&amp;L realizado total</span>
              </div>
            )}
          </div>
        </div>

        <div className="activo-bloque">
          <h2>Historial de operaciones</h2>
          <div className="prose" style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Bucket</th>
                  <th>Estrategia</th>
                  <th>Entrada</th>
                  <th>Precio entrada</th>
                  <th>Salida</th>
                  <th>P&amp;L</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {operaciones.map((o, i) => (
                  <tr key={`${o.entry_date}-${o.estado}-${i}`}>
                    <td>
                      <span className={`trading-badge ${o.estado === "abierta" ? "trading-badge-abierta" : "trading-badge-cerrada"}`}>
                        {o.estado === "abierta" ? "Abierta" : "Cerrada"}
                      </span>
                    </td>
                    <td>{o.bucketEtiqueta}</td>
                    <td>{o.strategy}</td>
                    <td>{o.entry_date}</td>
                    <td>${o.entry_price}</td>
                    <td>{o.estado === "cerrada" ? o.exit_date || "—" : "—"}</td>
                    <td style={{ color: toneColor(o.estado === "cerrada" ? o.pnl : o.unrealized_pnl) }}>
                      {o.estado === "cerrada"
                        ? `$${o.pnl} (${o.pnl_pct}%)`
                        : o.unrealized_pnl != null
                          ? `$${o.unrealized_pnl} (${o.unrealized_pnl_pct}%)`
                          : "— (precio en vivo pendiente)"}
                    </td>
                    <td>{o.estado === "cerrada" ? (o.reason === "stop_hit" ? "Stop" : "Señal") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ marginTop: 32 }}>
          <Link href="/pulso-mercado/trading">← Volver a Trading Algorítmico</Link>
        </p>
      </div>
    </section>
  );
}
