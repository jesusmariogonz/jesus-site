/* Franja de datos duros — alineada al currículum */

const STATS = [
  { valor: "+13", etiqueta: "años de experiencia en tecnología" },
  { valor: "7", etiqueta: "países" },
  { valor: "+20", etiqueta: "iniciativas estratégicas" },
  { valor: "+5", etiqueta: "unidades de negocio" },
  { valor: "+100M", etiqueta: "transacciones analizadas" },
  { valor: "$130M", etiqueta: "en valor de negocio documentado" },
];

export default function StatsStrip() {
  return (
    <section className="jx-wrap">
      <div className="jx-stats">
        {STATS.map((s) => (
          <div key={s.etiqueta} className="jx-stat">
            <b>{s.valor}</b>
            <small>{s.etiqueta}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
