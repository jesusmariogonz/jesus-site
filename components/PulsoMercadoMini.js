import Link from "next/link";
import { getPulsoMercado, getMarketSnapshotChips, formatFechaCorta } from "@/lib/posts";

/* Home: tarjeta de Pulso de Mercado — antes era un renglón discreto
   que competía mal con la caja de newsletter justo debajo; ahora es
   una tarjeta propia con los niveles del día, para que se note que es
   un producto vivo y no solo un link más. */
export default function PulsoMercadoMini() {
  const { daily } = getPulsoMercado();
  if (!daily) return null;
  const chips = getMarketSnapshotChips();

  return (
    <section className="jx-wrap pulso-mini">
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
    </section>
  );
}
