import Link from "next/link";
import { getPulsoMercado, getMarketSnapshotChips, formatFechaCorta } from "@/lib/posts";
import RiskMeter from "@/components/RiskMeter";
import ResearchLabBanner from "@/components/ResearchLabBanner";
import TradingAlgoritmicoBanner from "@/components/TradingAlgoritmicoBanner";

/* Home: sección de Pulso de Mercado. Tarjeta del Daily con los niveles del
   día (un producto vivo, no solo un link), al lado el medidor de riesgo y
   volatilidad y, abajo, los accesos a Research Lab y Trading Algorítmico con
   su portada, igual que en /pulso-mercado. */
export default function PulsoMercadoMini() {
  const { daily } = getPulsoMercado();
  const chips = daily ? getMarketSnapshotChips() : [];

  return (
    <section className="jx-wrap pulso-mini">
      <div className="pulso-mini-layout">
        {daily && (
          <Link href="/pulso-mercado" className="pulso-mini-card">
            <div className="pulso-mini-head">
              <span className="pulso-mini-kicker">● En vivo · Pulso de Mercado</span>
              <span className="pulso-mini-fecha">{formatFechaCorta(daily.fecha)}</span>
            </div>
            <span className="pulso-mini-titulo">{daily.titulo}</span>
            {daily.resumen && <p className="pulso-mini-resumen">{daily.resumen}</p>}
            {chips.length > 0 && (
              <div className="pulso-mini-chips">
                {chips.map((c) => (
                  <span key={c.activo} className="pulso-mini-chip">
                    <span className="pulso-mini-chip-nombre">{c.activo}</span>
                    <span className="pulso-mini-chip-nivel">{c.nivel}</span>
                    <span
                      className={`pulso-mini-chip-cambio${c.cambio.trim().startsWith("-") ? " baja" : " alza"}`}
                    >
                      {c.cambio}
                    </span>
                  </span>
                ))}
              </div>
            )}
            <span className="pulso-mini-cta">Ver el dashboard completo →</span>
          </Link>
        )}
        <div className="pulso-mini-meter">
          <RiskMeter />
        </div>
      </div>

      <div className="pulso-areas-top pulso-mini-areas">
        <ResearchLabBanner />
        <TradingAlgoritmicoBanner />
      </div>
    </section>
  );
}
