import resultados from "@/lib/research/exp002-results.json";

/* Resultado publicado de EXP-002. Todas las cifras salen de results.json (la
   salida de prl.growth_max.exp002.run, código determinístico: sin LLM en la
   corrida); aquí solo se les da formato. La etiqueta la calculó el código
   con los criterios del pre-registro (evaluation.etiqueta). */

const REPO = "https://github.com/jesusmariogonz/pulso-research-lab";
const RUN = "runs/EXP-002-growth-max-global/20261113T202608Z";
const MANIFEST_SHA = "bd5bae2b97b7725c30a8370e269aba0750fea976c63c0aaa48c07a0c7c7d490b";

const pct = (v, d = 1) => (v == null ? "—" : `${(v * 100).toFixed(d)}%`);
const num = (v, d = 2) => (v == null ? "—" : v.toFixed(d));

const NIVELES = [
  { key: "Conservative", nombre: "Conservative (cash 20%)" },
  { key: "Growth25", nombre: "Growth25 (cash 10%)" },
  { key: "Growth50", nombre: "Growth50 (cash 5%, 1.5x)" },
  { key: "Growth75", nombre: "Growth75 (sin cash, 1.5x)" },
  { key: "Max", nombre: "Max (sin cash, 2x)" },
];

export default function Exp002Resultado() {
  const r = resultados;
  const g50 = r.niveles?.Growth50;
  const cmp = r.comparacion_bootstrap_growth50;

  const criterios = [
    {
      ok: r.n_dias_locked_test >= 756,
      texto: `El periodo de prueba bloqueado tiene suficientes días hábiles (mínimo 756): ${r.n_dias_locked_test.toLocaleString("es-MX")} días.`,
    },
    {
      ok: cmp.frac_supera_benchmark > 0.5,
      texto: `Growth50 supera al benchmark 60/40 en más del 50% de las réplicas bootstrap: ${pct(cmp.frac_supera_benchmark, 1)}. Se exigía ≥80% para validar.`,
    },
    {
      ok: g50?.probabilidad_ruina?.["0.75"] <= 0.20,
      texto: `Probabilidad de perder ≥75% del capital (Growth50) ≤ 20%: ${pct(g50?.probabilidad_ruina?.["0.75"], 1)}.`,
    },
  ];

  return (
    <div className="exp-card">
      <div className="exp-card-cabecera">
        <span className="exp-card-id">EXP-002</span>
        <span className="exp-badge exp-badge-rechazado">{r.label}</span>
      </div>
      <h3>Growth-Max Global</h3>
      <p className="exp-meta">
        Datos de {r.fecha_inicio_backtest?.slice(0, 10)} a hoy · discovery hasta {r.discovery_end}, validation hasta{" "}
        {r.validation_end}, locked test desde el 2020-01-01 ({r.n_dias_locked_test.toLocaleString("es-MX")} días hábiles) ·{" "}
        {r.n_variants.toLocaleString("es-MX")} variantes probadas · 65 instrumentos globales · datos congelados con hash{" "}
        <code>{MANIFEST_SHA.slice(0, 12)}…</code> · corrida del 2026-11-13
      </p>

      <p>
        <strong>Pregunta:</strong> ¿puede una política de apalancamiento y rotación de régimen macro, elegida entre miles de
        variantes con datos de 2006–2019, hacer crecer el capital más rápido que un portafolio simple 60/40, en datos que el
        proceso de selección nunca vio (2020–2026)?
      </p>
      <p>
        <strong>Resultado: {r.label}.</strong> Sí hubo una variante ganadora (pasó el filtro de probabilidad de pérdida sobre
        discovery+validation), pero en el locked test (2020–2026) el nivel Growth50 solo superó al benchmark 60/40 en{" "}
        {pct(cmp.frac_supera_benchmark, 1)} de las réplicas bootstrap — muy por debajo del 80% exigido para validar. El
        Deflated Sharpe Ratio, que corrige por haber probado {r.n_variants.toLocaleString("es-MX")} variantes, es prácticamente
        cero ({r.deflated_sharpe.toExponential(2)}): no hay evidencia de una ventaja real distinta del azar.
      </p>

      <div className="prose" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Nivel de apetito</th><th>CAGR</th><th>Peor caída</th><th>Calmar</th><th>Sharpe</th><th>Sortino</th></tr>
          </thead>
          <tbody>
            {NIVELES.map((n) => {
              const m = r.niveles?.[n.key]?.metricas;
              if (!m) return null;
              return (
                <tr key={n.key}>
                  <td>{n.nombre}</td>
                  <td>{pct(m.cagr)}</td>
                  <td>{pct(m.max_drawdown)}</td>
                  <td>{num(m.calmar)}</td>
                  <td>{num(m.sharpe)}</td>
                  <td>{num(m.sortino)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="exp-nota">
        Los niveles más conservadores (Conservative, Growth25) dieron CAGR positivo en el locked test; los que usan más
        apalancamiento (Growth50, Growth75, Max) perdieron dinero. Más riesgo no se tradujo en más crecimiento en este periodo.
      </p>

      <h4>Criterios pre-registrados (orden de prioridad del código)</h4>
      <ul className="exp-criterios">
        {criterios.map((c) => (
          <li key={c.texto}>
            <span className={c.ok ? "exp-ok" : "exp-no"}>{c.ok ? "✓" : "✗"}</span> {c.texto}
          </li>
        ))}
      </ul>
      <p className="exp-nota">
        Intervalo de confianza bootstrap (95%) del CAGR de Growth50 en el locked test: [{pct(cmp.ci_cagr_modelo[0])},{" "}
        {pct(cmp.ci_cagr_modelo[1])}]. Prueba placebo (desplazamiento circular): el resultado real quedó en el percentil{" "}
        {pct(r.percentil_vs_placebo, 0)} frente a series sintéticas — no se distingue del ruido.
      </p>

      <h4>Limitaciones</h4>
      <ul className="exp-criterios">
        {r.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
        <li>Los resultados son descriptivos de este período; no son una predicción ni una recomendación de inversión.</li>
      </ul>

      <h4>Cómo se produjo (transparencia)</h4>
      <p className="exp-nota">
        El cálculo lo hace código fijo y probado (<code>prl.growth_max.exp002.run</code>), sobre datos congelados — sin ningún
        LLM en la corrida. DeepSeek escribió el código de los módulos siguiendo un contrato (TDD) redactado por Claude, quien
        revisó cada módulo antes de fusionarlo. La etiqueta la calcula el código con los criterios del pre-registro. Todo es
        reproducible en el repositorio:{" "}
        <a href={`${REPO}/blob/main/experiments/EXP-002-growth-max-global/PREREGISTRATION.md`}>pre-registro</a>,{" "}
        <a href={`${REPO}/blob/main/${RUN}/results.json`}>resultados</a>,{" "}
        <a href={REPO}>código y datos</a>.
      </p>
    </div>
  );
}
