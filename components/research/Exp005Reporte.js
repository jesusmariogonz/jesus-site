import Link from "next/link";
import r from "@/lib/research/exp005-resultados.json";

/* Reporte técnico de EXP-005 (Reverse Winners). Corre en el pipeline propio
   de pulso-research-lab (DeepSeek-TDD para los 5 módulos de cómputo, código
   revisado antes de mergear). Toda cifra de este reporte sale de
   exp005-resultados.json, una transcripción fiel de run_real/results.json
   y RESULTADOS.md de ese repositorio (ver Reproducibilidad). */

const REPO_PRL = "https://github.com/jesusmariogonz/pulso-research-lab";
const BLOB_PRL = `${REPO_PRL}/blob/main`;
const EXP_DIR = `${BLOB_PRL}/experiments/EXP-005-reverse-winners`;

const pct = (v, d = 1) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(d)}%`);

function Tabla({ cab, filas, densa }) {
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table className={densa ? "exp-tabla-densa" : undefined}>
        <thead><tr>{cab.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{filas.map((f, i) => <tr key={i}>{f.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function Sec({ id, n, titulo, children }) {
  return <section id={id} className="exp-sec"><h2>{n}. {titulo}</h2>{children}</section>;
}

const NOMBRE_METODO = {
  ganador: "Bucket descubierto",
  baseline_momentum_simple: "Momentum simple (Top 20%)",
  baseline_buy_hold: "Buy & Hold",
  baseline_rsi_simple: "RSI simple",
  baseline_combo_ingenuo: "Combo ingenuo",
};

export default function Exp005Reporte() {
  const metodos = ["ganador", "baseline_momentum_simple", "baseline_buy_hold", "baseline_rsi_simple", "baseline_combo_ingenuo"];
  const criterios = [
    ["Supera a los 4 baselines", "sí", "sí", true],
    [`Bootstrap pareado vs. baseline 1 (≥${r.robustez.bootstrap_umbral_validated}% réplicas a favor)`, `≥${r.robustez.bootstrap_umbral_validated}%`, `${r.robustez.bootstrap_vs_baseline1_frac}%`, true],
    [`Deflated Sharpe Ratio (${r.robustez.n_trials_dsr} variantes)`, `> ${r.robustez.dsr_umbral_validated}`, `${r.robustez.dsr}`, false],
    ["Ningún vecino de grilla revierte signo o destruye >50% del efecto", "sí", "sí (0 de 5 evaluados)", true],
    [`Ningún ticker aporta >${r.robustez.concentracion_umbral_rejected}% de las señales`, "sí", `sí (${r.robustez.concentracion_ticker_max}, máx. ${r.robustez.concentracion_frac_max_ticker}%)`, true],
    ["≥20 señales independientes en locked test", "≥20", `${r.n_senales_locked.toLocaleString("es-MX")}`, true],
  ];

  return (
    <article className="exp-reporte">
      <nav className="exp-toc" aria-label="Contenido del reporte">
        <strong>Contenido</strong>
        {[
          ["ficha", "Ficha técnica"], ["discovery", "1 · Qué se descubrió"], ["ganador", "2 · El bucket ganador"],
          ["resultado", "3 · Resultado en locked test"], ["criterios", "4 · Por qué INCONCLUSIVE"],
          ["robustez", "5 · Robustez adicional"], ["forward", "6 · Validación forward en curso"],
          ["limitaciones", "7 · Limitaciones declaradas"], ["repro", "8 · Reproducibilidad"],
        ].map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
      </nav>

      <section id="ficha" className="exp-sec">
        <h2>Ficha técnica</h2>
        <Tabla cab={["Campo", "Valor"]} filas={[
          ["Identificador / estado", <><strong>EXP-005</strong> · <span className="exp-badge exp-badge-inconcluso">INCONCLUSIVE</span></>],
          ["Pregunta", "¿Las características observables de una acción antes de convertirse en una de las mayores ganadoras de 30 días, usadas como filtro, superan claramente un baseline de momentum de un solo factor — fuera de muestra?"],
          ["Universo", `${r.universo.nombre}, ${r.universo.n_simbolos_con_datos.toLocaleString("es-MX")} símbolos con datos (de ${r.universo.n_simbolos_universo.toLocaleString("es-MX")} listados; ${r.universo.simbolo_faltante} sin archivo)`],
          ["Periodo", <>Discovery {r.periodo.discovery} ({r.periodo.n_fechas_discovery} fechas) · Validation {r.periodo.validation} ({r.periodo.n_fechas_validation} fechas) · Locked test {r.periodo.locked_test} ({r.periodo.n_fechas_locked} fechas)</>],
          ["Pre-registro", <>bloqueado el {r.fecha_registro} con commit <code>{r.commit_registro}</code>, antes de tocar datos</>],
          ["Cierre", <>{r.fecha_cierre}, commit <code>{r.commit_cierre}</code></>],
          ["Código", "especificado por contrato + tests, implementado vía DeepSeek (ciclo TDD), revisado línea por línea y verificado en worktrees aislados antes de mergear a main"],
        ]} />
      </section>

      <Sec id="discovery" n="1" titulo="Qué se descubrió en discovery (2010–2018)">
        <p>
          De 15 features candidatas, <strong>4 discriminaron</strong> por encima del umbral de
          correlación punto-biserial (0.05) entre ganadoras de 30 días y el resto del universo,
          medidas en T0 (antes de ganar) — ninguna feature se forzó para completar un cupo:
        </p>
        <Tabla cab={["Feature", "Dirección", "Diferencia de medianas", "Correlación punto-biserial"]} filas={
          r.features_discriminantes.map((f) => [f.feature, f.direccion, pct(f.diferencia_medianas * 100, 1), f.correlacion_punto_biserial.toFixed(3)])
        } />
        <p>
          En conjunto describen acciones con volatilidad realizada alta, poco drawdown reciente,
          cerca de su máximo de 20 días y beta alto frente a SPY — "momentum con volatilidad", no
          exactamente el momentum de un solo factor ya documentado, pero tampoco una señal
          completamente nueva. La grilla cerrada resultante fue 3⁴ = <strong>{r.grid.n_variantes_total} variantes</strong> (no
          243: solo 4 de 5 features posibles discriminaron).
        </p>
      </Sec>

      <Sec id="ganador" n="2" titulo="El bucket ganador">
        <p>
          Elegido en validation (2019–2021) por mayor retorno medio, sin haber visto todavía el
          locked test. Las {r.grid.n_variantes_sobreviven_filtro_soporte} variantes sobrevivieron el filtro de soporte mínimo
          (≥30 señales en discovery, ningún ticker &gt;20% de las señales).
        </p>
        <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: ".92rem", background: "var(--surface-2, #0d1117)", padding: "10px 14px", borderRadius: 8, overflowX: "auto" }}>
          vol_realizada_20d: alto P90 · drawdown_60d: bajo P90 · dist_max20: bajo P90 · beta_60d: alto P75
        </p>
      </Sec>

      <Sec id="resultado" n="3" titulo="Resultado en locked test (2022–2026, nunca tocado hasta la corrida final)">
        <Tabla cab={["", "Media retorno 30d", "Mediana", "% señales positivas"]} filas={
          metodos.map((m) => [NOMBRE_METODO[m], <strong>{pct(r.metricas_locked[m].media)}</strong>, pct(r.metricas_locked[m].mediana), `${r.metricas_locked[m].frac_positivo}%`])
        } />
        <p>
          El bucket descubierto supera a los 4 baselines en media, incluido el de momentum simple —
          la condición que de verdad importaba para que esto no fuera una redescripción tautológica
          de momentum ya documentado. La mediana negativa pese a la media positiva (y el % de
          señales positivas por debajo de 50%) refleja una distribución sesgada por una cola de
          ganadores grandes: consistente con un filtro que selecciona explícitamente alta
          volatilidad realizada.
        </p>
      </Sec>

      <Sec id="criterios" n="4" titulo="Por qué INCONCLUSIVE y no VALIDATED">
        <Tabla cab={["Criterio", "Umbral", "Valor obtenido", "¿Cumple?"]} filas={
          criterios.map(([c, u, v, ok]) => [c, u, v, ok ? <span style={{ color: "#16a34a" }}>✓</span> : <span style={{ color: "#dc2626" }}>✗</span>])
        } />
        <p>
          Un solo criterio falla — pero es el que corrige por haber probado {r.robustez.n_trials_dsr} variantes antes
          de quedarse con la mejor. Un Deflated Sharpe Ratio de {r.robustez.dsr} dice que, después de esa
          corrección, la señal apenas se distingue del 50/50. Tampoco es REJECTED: ninguna de las 4
          condiciones de rechazo se cumple (el DSR está por encima de {r.robustez.dsr_umbral_rejected}, el umbral de
          rechazo — distinto del umbral de validación, a propósito).
        </p>
      </Sec>

      <Sec id="robustez" n="5" titulo="Robustez adicional (reportada, no determina la etiqueta por sí sola)">
        <ul>
          <li><strong>PBO (CSCV, {r.robustez.pbo_n_particiones} particiones)</strong>: {r.robustez.pbo}% — ni alarmante ni tranquilizador, consistente con el DSR.</li>
          <li><strong>Placebo</strong>: con potencia confirmada, el retorno real queda en el percentil {r.robustez.placebo_percentil}% de 1,000 reordenamientos aleatorios — claramente mejor que el azar, aunque no suficiente por sí solo dado el DSR.</li>
          <li><strong>Leave-one-ticker-out</strong>: {r.robustez.leave_one_ticker_out_n_tickers} tickers únicos; ninguno, al excluirlo, revierte el signo del efecto.</li>
          <li><strong>Concentración</strong>: {r.robustez.concentracion_ticker_max} es el ticker más frecuente, con solo {r.robustez.concentracion_frac_max_ticker}% de las señales.</li>
        </ul>
      </Sec>

      <Sec id="forward" n="6" titulo="Validación forward en curso">
        <p>
          Tras el resultado INCONCLUSIVE, se congeló el bucket ganador exacto (sin reoptimizar
          ni reseleccionar nada) y se construyó un mecanismo que lo aplica automáticamente sobre
          fechas de corte nuevas conforme el calendario las completa — un workflow programado
          revisa esto cada domingo. Al {r.fecha_cierre}, la corrida original ya había consumido
          hasta la última fecha con retorno de 30 días completo ({r.forward_validation.ultima_fecha_original});
          el primer dato forward real debería existir {r.forward_validation.proxima_fecha_estimada}.
          Este reporte se actualizará aquí conforme se acumule evidencia real — no antes.
        </p>
      </Sec>

      <Sec id="limitaciones" n="7" titulo="Limitaciones declaradas">
        <ul>
          {r.limitaciones.map((l, i) => <li key={i}>{l}</li>)}
        </ul>
      </Sec>

      <Sec id="repro" n="8" titulo="Reproducibilidad">
        <p>
          Pre-registro, contratos de implementación, código y resultado completo en{" "}
          <Link href={EXP_DIR}>{EXP_DIR.replace("https://github.com/", "")}</Link> del repositorio{" "}
          <Link href={REPO_PRL}>pulso-research-lab</Link> — commit de cierre{" "}
          <code>{r.commit_cierre}</code>.
        </p>
      </Sec>
    </article>
  );
}
