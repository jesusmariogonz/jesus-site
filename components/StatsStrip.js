/* Franja de datos duros — alineada al currículum */

const STATS = [
  { valor: "+20", etiqueta: "iniciativas estratégicas" },
  { valor: "7", etiqueta: "países" },
  { valor: "+5", etiqueta: "unidades de negocio" },
  { valor: "Millones", etiqueta: "de transacciones analizadas diariamente" },
  { valor: "Cloud", etiqueta: "plataformas cloud empresariales" },
  { valor: "E2E", etiqueta: "equipos multidisciplinarios" },
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
