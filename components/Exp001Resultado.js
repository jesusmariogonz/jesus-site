import resultados from "@/lib/research/exp001-results.json";
import veredicto from "@/lib/research/exp001-verdict.json";

/* Resultado publicado de EXP-001. Todas las cifras salen de results.json (la
   salida del código del experimento); aquí solo se les da formato. La etiqueta
   la calculó el código con los criterios del pre-registro. */

const REPO = "https://github.com/jesusmariogonz/pulso-research-lab";
const RUN = "runs/EXP-001-emergency-model/20261111T035822Z";

const pct = (v, d = 1) => (v == null ? "—" : `${(v * 100).toFixed(d)}%`);
const num = (v, d = 2) => (v == null ? "—" : v.toFixed(d));

const CARTERAS = [
  { key: "model", nombre: "Modelo de emergencia" },
  { key: "buy_hold", nombre: "Comprar y mantener SPY" },
  { key: "sma200", nombre: "Regla simple SMA200" },
  { key: "sixty_forty", nombre: "60/40 (SPY + bonos largos)" },
];

const NIVELES = ["Normal", "Vigilancia", "Defensivo", "Emergencia", "Crisis"];

export default function Exp001Resultado() {
  const r = resultados;
  const m = r.metrics;
  const bh = m.buy_hold;
  const mod = m.model;
  const sma = m.sma200;
  const ic = r.calmar_diff_vs_sma200;

  const ratioDD = Math.abs(mod.max_drawdown) / Math.abs(bh.max_drawdown);
  const criterios = [
    {
      ok: ratioDD <= 0.7,
      texto: `Peor caída ≤ 70% de la de comprar y mantener: ${pct(Math.abs(mod.max_drawdown))} vs ${pct(Math.abs(bh.max_drawdown))} (${pct(ratioDD, 0)}).`,
    },
    {
      ok: mod.cagr >= 0.9 * bh.cagr,
      texto: `Rendimiento anual ≥ 90% del de comprar y mantener: ${pct(mod.cagr)} vs ${pct(bh.cagr)}.`,
    },
    {
      ok: mod.calmar > sma.calmar,
      texto: `Mejor Calmar que la regla simple SMA200: ${num(mod.calmar)} vs ${num(sma.calmar)}.`,
    },
    {
      ok: ic.ci_lo > 0,
      texto: `La mejora sobre SMA200 es estadísticamente distinguible de cero: diferencia ${num(ic.value)}, intervalo al 95% de ${num(ic.ci_lo)} a ${num(ic.ci_hi)}.`,
    },
  ];

  return (
    <div className="exp-card">
      <div className="exp-card-cabecera">
        <span className="exp-card-id">EXP-001</span>
        <span className="exp-badge exp-badge-inconcluso">{r.label}</span>
      </div>
      <h3>Modelo de emergencia multifactor</h3>
      <p className="exp-meta">
        Datos de {r.oos_start} a {r.oos_end} (fuera de muestra, {r.n_oos_days.toLocaleString("es-MX")} días hábiles) · {r.n_variants} variantes probadas ·
        datos congelados con hash <code>{veredicto.manifiesto_sha256.slice(0, 12)}…</code> · corrida del 2026-11-11
      </p>

      <p>
        <strong>Pregunta:</strong> ¿puede un índice multifactor de estrés de mercado reducir la peor caída de una cartera de
        acciones sin sacrificar su rendimiento de largo plazo, frente a reglas simples?
      </p>
      <p>
        <strong>Resultado: {r.label}.</strong> El modelo cumple los tres primeros criterios pre-registrados, pero no el último: su
        ventaja sobre la regla simple SMA200 es demasiado pequeña, con solo tres episodios de crisis evaluables, para distinguirla
        de la casualidad. No se valida y tampoco se rechaza.
      </p>

      <div className="prose" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Cartera</th><th>Rend. anual</th><th>Peor caída</th><th>Calmar</th><th>Sharpe</th></tr>
          </thead>
          <tbody>
            {CARTERAS.map((c) => (
              <tr key={c.key}>
                <td>{c.nombre}</td>
                <td>{pct(m[c.key].cagr)}</td>
                <td>{pct(m[c.key].max_drawdown)}</td>
                <td>{num(m[c.key].calmar)}</td>
                <td>{num(m[c.key].sharpe)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4>Criterios pre-registrados</h4>
      <ul className="exp-criterios">
        {criterios.map((c) => (
          <li key={c.texto}>
            <span className={c.ok ? "exp-ok" : "exp-no"}>{c.ok ? "✓" : "✗"}</span> {c.texto}
          </li>
        ))}
      </ul>

      <h4>Episodios de crisis (fuera de muestra)</h4>
      <div className="prose" style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr><th>Episodio</th><th>Alerta (nivel ≥ Defensivo)</th><th>Anticipación</th></tr>
          </thead>
          <tbody>
            {r.episodes.episodes.map((e) => (
              <tr key={e.name}>
                <td>{e.name}</td>
                <td>{e.detected ? e.detection_date : "no detectado"}</td>
                <td>{e.detected ? `${e.lead_days} días antes de caer 20%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="exp-nota">
        El episodio {r.episodes_excluded_not_oos.join(", ")} queda fuera de muestra (anterior a 2004). En 2022, cuando acciones y
        bonos cayeron a la vez, el modelo no dio alerta. Alarmas de nivel Crisis: {r.episodes.alarms.n_alarms}, de las cuales{" "}
        {r.episodes.alarms.n_false} se clasificó como falsa con la regla pre-registrada (no hubo una caída adicional de 10%).
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
        El cálculo lo hace código fijo y probado, sobre datos congelados. La etiqueta la calcula el código con criterios fijados antes
        de ver resultados. El borrador de texto lo redactó DeepSeek y un verificador automático comprobó que cada cifra estuviera en{" "}
        <code>results.json</code> ({veredicto.verificacion.cifras_revisadas} cifras revisadas, ninguna sin respaldo). Todo es
        reproducible en el repositorio:{" "}
        <a href={`${REPO}/blob/main/experiments/EXP-001-emergency-model/PREREGISTRATION.md`}>pre-registro</a>,{" "}
        <a href={`${REPO}/blob/main/${RUN}/results.json`}>resultados</a>,{" "}
        <a href={REPO}>código y datos</a>.
      </p>

      <h4>Niveles del modelo</h4>
      <p className="exp-nota">
        Fracción de días fuera de muestra en cada nivel:{" "}
        {NIVELES.map((n, i) => `${n} ${pct(r.level_fractions[String(i)], 0)}`).join(" · ")}.
      </p>
    </div>
  );
}
