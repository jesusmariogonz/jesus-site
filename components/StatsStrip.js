/* Propuesta 3: franja de datos duros — edita los valores */

const STATS = [
  { valor: "10+", etiqueta: "años en datos" },
  { valor: "4", etiqueta: "plataformas: Snowflake · Databricks · Azure · GCP" },
  { valor: "Retail", etiqueta: "loyalty y analítica a gran escala" },
  { valor: "MX", etiqueta: "escribiendo desde Saltillo" },
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
