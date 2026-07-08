/* ── Propuesta 3: prueba social en una franja delgada ──────────── */
/* Ajusta los números a tu realidad; son estáticos a propósito.    */

const STATS = [
  { valor: "10+", etiqueta: "años en datos" },
  { valor: "4", etiqueta: "plataformas: Snowflake · Databricks · Azure · GCP" },
  { valor: "Retail", etiqueta: "loyalty y analítica a gran escala" },
  { valor: "MX", etiqueta: "escribiendo desde Saltillo" },
];

export default function StatsStrip() {
  return (
    <section className="mx-auto mt-16 max-w-4xl px-6">
      <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-slate-800 py-8 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.etiqueta} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-slate-100">
              {s.valor}
            </p>
            <p className="mt-1 text-xs text-slate-500">{s.etiqueta}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
