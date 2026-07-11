/* Franja de datos duros — alineada al currículum */

const STATS = [
  { valor: "20+", etiqueta: "iniciativas de analítica" },
  { valor: "15+", etiqueta: "productos de datos" },
  { valor: "4", etiqueta: "países" },
  { valor: "10+", etiqueta: "tecnologías en el stack" },
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
