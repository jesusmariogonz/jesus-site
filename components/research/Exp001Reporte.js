import resultados from "@/lib/research/exp001-results.json";
import veredicto from "@/lib/research/exp001-verdict.json";
import ap from "@/lib/research/exp001-appendix.json";
import series from "@/lib/research/exp001-series.json";
import { CurvaEquity, CurvaUnderwater, Leyenda } from "@/components/research/Curvas";

/* Reporte técnico de EXP-001. Toda cifra sale de results.json (pre-registrado) o del apéndice
   EXPLORATORIO (appendix.json); aquí solo se les da formato. Las fórmulas y parámetros que se
   escriben en el texto son las definiciones del código (src/prl/emergency/*.py). */

const REPO = "https://github.com/jesusmariogonz/pulso-research-lab";
const BLOB = `${REPO}/blob/main`;
const RUN = "runs/EXP-001-emergency-model/20261111T035822Z";

const pct = (v, d = 1) => (v == null ? "—" : `${(v * 100).toFixed(d)}%`);
const pp = (v, d = 1) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(d)} pp`);
const num = (v, d = 2) => (v == null ? "—" : v.toFixed(d));
const sg = (v, d = 2) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(d)}`);
const ent = (v) => v.toLocaleString("es-MX");

const CART = [
  ["model", "Modelo (walk-forward)"],
  ["buy_hold", "Comprar y mantener SPY"],
  ["sma200", "Regla SMA200 → efectivo"],
  ["sixty_forty", "60/40 (SPY/TLT)"],
];
const DIMS = [
  ["trend", "Tendencia"],
  ["vol", "Volatilidad"],
  ["correlation", "Correlación"],
  ["credit", "Crédito"],
  ["breadth", "Amplitud"],
  ["drawdown_velocity", "Vel. caída"],
];
const NIVELES = ["0 Normal", "1 Vigilancia", "2 Defensivo", "3 Emergencia", "4 Crisis"];

function Tabla({ cab, filas, densa }) {
  return (
    <div className="prose" style={{ overflowX: "auto" }}>
      <table className={densa ? "exp-tabla-densa" : undefined}>
        <thead>
          <tr>{cab.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i}>{f.map((c, j) => <td key={j}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Eq({ children }) {
  return <pre className="exp-eq">{children}</pre>;
}

function Sec({ id, n, titulo, children }) {
  return (
    <section id={id} className="exp-sec">
      <h2>{n}. {titulo}</h2>
      {children}
    </section>
  );
}

function Etiqueta({ tipo }) {
  const txt = tipo === "pre" ? "PRE-REGISTRADO" : "EXPLORATORIO · post-hoc";
  return <span className={`exp-etq exp-etq-${tipo}`}>{txt}</span>;
}

export default function Exp001Reporte() {
  const r = resultados;
  const m = r.metrics;
  const mod = m.model;
  const bh = m.buy_hold;
  const sma = m.sma200;
  const ic = r.calmar_diff_vs_sma200;
  const b = ap.bootstrap;
  const d = ap.dsr;
  const s = ap.sensitivity;
  const pl = ap.placebo;
  const ex = ap.exposure;
  const nAnios = ap.annual.length;
  const ganaBH = ap.annual.filter((a) => a.model - a.buy_hold > 0.0005).length;
  const igualBH = ap.annual.filter((a) => Math.abs(a.model - a.buy_hold) <= 0.0005).length;
  const pierdeBH = nAnios - ganaBH - igualBH;
  const a2008 = ap.annual.find((a) => a.year === 2008);
  const a2009 = ap.annual.find((a) => a.year === 2009);
  const a2022 = ap.annual.find((a) => a.year === 2022);
  const ddModelo = ap.drawdowns.model[0];
  const ratioDD = Math.abs(mod.max_drawdown) / Math.abs(bh.max_drawdown);
  const frec = Object.entries(ap.chosen_frequency).sort((a, c) => c[1] - a[1]);
  const sn = (ok) => (ok ? "Sí" : "No");
  const aa = ap.annual_assets;

  return (
    <article className="exp-reporte">
      <nav className="exp-toc" aria-label="Contenido del reporte">
        <strong>Contenido</strong>
        {[
          ["ficha", "Ficha técnica"], ["abstract", "1 · Resumen técnico"], ["diseno", "2 · Hipótesis y diseño"],
          ["datos", "3 · Datos"], ["indice", "4 · Construcción del índice"], ["simulacion", "5 · Simulación"],
          ["validacion", "6 · Selección y validación"], ["resultados", "7 · Resultados"], ["inferencia", "8 · Inferencia estadística"],
          ["sensibilidad", "9 · Sensibilidad y robustez"], ["dimensiones", "10 · Diagnóstico de dimensiones"],
          ["lectura", "11 · Lectura crítica"], ["validez", "12 · Amenazas a la validez"], ["siguiente", "13 · Qué falta para validar"],
          ["repro", "14 · Reproducibilidad"],
        ].map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
      </nav>

      {/* ---------------- Ficha ---------------- */}
      <section id="ficha" className="exp-sec">
        <h2>Ficha técnica</h2>
        <Tabla
          cab={["Campo", "Valor"]}
          filas={[
            ["Identificador / estado", <><strong>EXP-001</strong> · <span className="exp-badge exp-badge-inconcluso">{r.label}</span> (etiqueta calculada por código)</>],
            ["Pregunta", "¿Reduce un índice multifactor de estrés la peor caída de una cartera de acciones sin sacrificar su CAGR, frente a reglas simples?"],
            ["Pre-registro", <>v1 bloqueado el 2026-11-11 (<a href={`${REPO}/commit/ad02967`}>ad02967</a>); aclaraciones v1.1 antes de correr con datos reales (<a href={`${REPO}/commit/9c1a7e1`}>9c1a7e1</a>)</>],
            ["Muestra fuera de muestra", `${r.oos_start} → ${r.oos_end} · ${ent(r.n_oos_days)} días hábiles · primer año de prueba ${r.first_test_year}`],
            ["Entrenamiento previo al primer año de prueba", `${ap.meta.training_days_before_first_test_year} días (${ap.meta.sample_start} → 2003-12-31); mínimo exigido: 252`],
            ["Datos", <>manifiesto SHA-256 <code>{veredicto.manifiesto_sha256}</code></>],
            ["Código de la corrida", <>commit <a href={`${REPO}/commit/06dd7c0`}>06dd7c0</a> · suite del repositorio: 96 pruebas pasan en <a href={`${REPO}/commit/4214c57`}>4214c57</a> · <a href={`${BLOB}/${RUN}/results.json`}>results.json</a></>],
            ["Variantes evaluadas", `${r.n_variants} (grilla cerrada, pre-registrada)`],
            ["Costos de transacción", "0.10 % por lado (0.05 % comisión + 0.05 % slippage)"],
            ["Bootstrap", `bloques de ${ic.block} días (pre-registrado) · ${ent(ic.n_boot)} réplicas y semilla 0 (parámetros de ejecución)`],
          ]}
        />
      </section>

      {/* ---------------- 1 Abstract ---------------- */}
      <Sec id="abstract" n="1" titulo="Resumen técnico">
        <p>
          Se construye un índice de estrés de mercado como promedio ponderado de seis z-scores expansivos (tendencia, volatilidad,
          correlación entre sectores, crédito, amplitud y velocidad de la caída) y se traduce, mediante una máquina de estados con
          persistencia e histéresis, en una exposición accionaria objetivo (100/75/50/25/0 %). La parte fuera de acciones se
          invierte en un refugio (bonos largos TLT, efectivo o mezcla 50/50). De {r.n_variants} variantes pre-registradas se elige una por año con un
          esquema <em>walk-forward</em> expansivo (criterio: Calmar de entrenamiento) y se evalúa fuera de muestra del {r.oos_start} al {r.oos_end}.
        </p>
        <p>
          Fuera de muestra el modelo obtiene CAGR {pct(mod.cagr, 2)}, peor caída {pct(mod.max_drawdown, 2)}, Calmar {num(mod.calmar, 3)} y Sharpe{" "}
          {num(mod.sharpe, 3)}, frente a {pct(bh.cagr, 2)}, {pct(bh.max_drawdown, 2)}, {num(bh.calmar, 3)} y {num(bh.sharpe, 3)} de comprar y mantener SPY, y
          {" "}{pct(sma.cagr, 2)}, {pct(sma.max_drawdown, 2)}, {num(sma.calmar, 3)} y {num(sma.sharpe, 3)} de la regla SMA200. La peor caída del modelo es
          el {pct(ratioDD, 1)} de la de comprar y mantener (criterio: ≤ 70 %) con un CAGR equivalente (criterio: ≥ 90 %), y su Calmar supera al de
          SMA200 en {sg(ic.value, 3)}. Sin embargo, el intervalo bootstrap al 95 % de esa diferencia, [{sg(ic.ci_lo, 3)}, {sg(ic.ci_hi, 3)}],
          contiene el cero, por lo que el criterio de significancia no se cumple y la etiqueta es <strong>{r.label}</strong>.
        </p>
        <p>
          El análisis exploratorio posterior (secciones 8–10, marcado como post-hoc) añade: (i) la mejora frente a comprar y mantener es robusta a la
          selección de variante (las {s.all.n} variantes reducen la peor caída), (ii) la ventaja frente a SMA200 depende del umbral más sensible de la grilla
          (θ = 0.5, su borde inferior), (iii) la ganancia en peor caída se concentra en un único episodio (2008), y (iv) en 2022 el modelo rindió peor que comprar
          y mantener. Una prueba placebo por desplazamiento circular da p = {num(pl.p_value_calmar, 3)} para el Calmar.
        </p>
      </Sec>

      {/* ---------------- 2 Diseño ---------------- */}
      <Sec id="diseno" n="2" titulo="Hipótesis y diseño">
        <p><Etiqueta tipo="pre" /> Las hipótesis, los criterios y la grilla se fijaron y bloquearon en un commit antes de ejecutar nada sobre los datos.</p>
        <ul className="exp-lista">
          <li><strong>H0 (nula):</strong> el índice no produce una mejora distinguible de la que logra una regla simple (SMA200) o el azar.</li>
          <li><strong>H1:</strong> el índice + la política de exposición mejoran el Calmar y reducen la peor caída frente a comprar y mantener SPY, con una pérdida de CAGR menor a la tolerada.</li>
          <li><strong>H2:</strong> el modelo multifactor supera a la regla simple SMA200; si no, la complejidad no se justifica y se declara <code>REJECTED</code> aunque H1 se cumpla.</li>
        </ul>
        <p><strong>Criterios de decisión</strong> (calculados por código, sin interpretación):</p>
        <Eq>{`REJECTED     si  Calmar_modelo ≤ Calmar_SMA200   o   |MaxDD_modelo| ≥ |MaxDD_B&H|
VALIDATED    si  no REJECTED  y  |MaxDD_modelo| ≤ 0.70·|MaxDD_B&H|
                              y  CAGR_modelo ≥ 0.90·CAGR_B&H
                              y  límite inferior del IC95% bootstrap de [Calmar_modelo − Calmar_SMA200] > 0
INCONCLUSIVE en cualquier otro caso (o si falta algún valor)`}</Eq>
        <p><strong>Aclaraciones de implementación v1.1</strong> (hechas antes de correr con datos reales; no cambian hipótesis, grilla ni criterios):</p>
        <ol className="exp-lista">
          <li>Umbrales → niveles: nivel crudo = clip(⌊score/θ⌋, 0, 4).</li>
          <li>Persistencia/histéresis: se sube si el mínimo del nivel crudo en los últimos <em>k</em> días supera el nivel actual; se baja si el máximo en los últimos <em>m</em> días queda por debajo.</li>
          <li>«Efectivo» = índice de T-Bills: BIL desde 2007-05 y, antes, un índice sintético con la tasa DTB3 de FRED del día anterior. SHY (duración ≈ 2 años) no se usa como efectivo.</li>
          <li>Crédito: solo BAA10Y (sin HYG/LQD en la v0).</li>
          <li><strong>Primer año de prueba 2004</strong> (no 2003): TLT empieza en 2002-07 y se exigen ≥ 252 días de entrenamiento ({ap.meta.training_days_before_first_test_year} disponibles). Consecuencia: el episodio <em>dot-com</em> queda fuera de muestra y se evalúan {r.episodes.episodes.length} episodios, no 4.</li>
          <li>Rebalanceo diario del refugio hacia la exposición objetivo sin costo (limitación declarada).</li>
        </ol>
      </Sec>

      {/* ---------------- 3 Datos ---------------- */}
      <Sec id="datos" n="3" titulo="Datos">
        <p>
          {series.length} series diarias, descargadas con <code>yfinance</code> (precios <strong>sin auto-ajuste</strong>; se usa <code>adj_close</code> para retornos
          totales) y de FRED (CSV público), congeladas con SHA-256 por archivo y verificadas contra el manifiesto antes de cada corrida. Ningún dato se imputa:
          los huecos se reportan, no se rellenan. Las series FRED se propagan hacia adelante solo para alinear fechas (nunca hacia atrás).
        </p>
        <Tabla
          densa
          cab={["Serie", "Fuente · símbolo", "Rol", "Desde", "Hasta", "Obs.", "SHA-256", "Limitaciones documentadas"]}
          filas={series.map((x) => [
            <strong key="i">{x.id}</strong>, `${x.source} · ${x.symbol}`, x.role, x.desde, x.hasta, ent(x.filas), <code key="h">{x.sha256.slice(0, 10)}</code>, x.notas,
          ])}
        />
        <p><strong>Exclusiones deliberadas</strong> (documentadas en el catálogo): NFCI y STLFSI (se revisan hacia atrás → filtrarían información futura), spreads OAS de ICE BofA (FRED solo publica 3 años por licencia), % de acciones del S&amp;P 500 sobre SMA200 (exige constituyentes históricos point-in-time, no disponibles) y el indicador de recesión NBER (se publica con meses de retraso; solo serviría para etiquetar, nunca como entrada).</p>
        <p><strong>Controles de calidad:</strong> 0 errores de integridad en las 163 series del catálogo (fechas duplicadas/desordenadas, precios no positivos, high &lt; low); los 92 avisos informativos (movimientos diarios extremos, algún valor nulo aislado, rachas de cierres idénticos) se publican en <code>data/quality_report.md</code> y no bloquean el uso. <strong>Sesgo de supervivencia:</strong> no aplica a este experimento (SPY, RSP, sectores SPDR y bonos, no acciones individuales).</p>
      </Sec>

      {/* ---------------- 4 Índice ---------------- */}
      <Sec id="indice" n="4" titulo="Construcción del índice, paso a paso">
        <p><Etiqueta tipo="pre" /> <strong>Paso 4.1 — Z-score expansivo.</strong> Cada dimensión cruda <em>x<sub>t</sub></em> se estandariza con la media y la desviación muestral (ddof = 1) de <em>todo</em> su historial hasta <em>t</em> inclusive, con un mínimo de 252 observaciones válidas. Así el valor en <em>t</em> nunca depende de datos posteriores (hay pruebas que alteran el futuro y verifican que el pasado no cambia).</p>
        <Eq>{`z_t = ( x_t − mean(x_1..x_t) ) / std_ddof1(x_1..x_t)        (NaN si t < 252 observaciones)`}</Eq>
        <p><strong>Paso 4.2 — Las seis dimensiones crudas</strong> (mayor valor = más estrés):</p>
        <Tabla
          cab={["Dimensión", "Cálculo crudo x_t", "Series", "Ventanas"]}
          filas={[
            ["trend", "−( SPY_t / SMA200_t − 1 )", "SPY", "SMA de 200 días"],
            ["vol", "promedio de z[ln VIX_t] y z[ln(VIX_t / VIX_{t−5})] (nivel y cambio)", "^VIX", "cambio a 5 días"],
            ["correlation", "media de las correlaciones por pares (36 pares) de los retornos diarios de 9 sectores", "XLK…XLB", "ventana móvil de 60 días"],
            ["credit", "spread Baa − Tesoro 10 años (en puntos porcentuales)", "BAA10Y", "—"],
            ["breadth", "−( ln(RSP/SPY)_t − ln(RSP/SPY)_{t−60} )  (la razón cayendo = amplitud que se estrecha)", "RSP, SPY", "cambio a 60 días"],
            ["drawdown_velocity", "−( SPY_t / SPY_{t−10} − 1 )", "SPY", "cambio a 10 días"],
          ]}
        />
        <p><strong>Paso 4.3 — Índice compuesto.</strong> Promedio ponderado por fila <em>solo de las dimensiones disponibles</em> (no NaN), con los pesos renormalizados entre ellas; si ninguna está disponible, NaN. Dos esquemas de pesos: <code>equal</code> (todos 1) y <code>tvc2</code> (tendencia, volatilidad y crédito = 2; el resto 1).</p>
        <Eq>{`score_t = Σ_i w_i·z_{i,t}·1[z_{i,t} válido]  /  Σ_i w_i·1[z_{i,t} válido]`}</Eq>
        <p><strong>Paso 4.4 — Niveles y máquina de estados.</strong> Con un umbral θ ∈ {"{0.5, 1.0, 1.5}"} el nivel crudo es <code>clip(⌊score/θ⌋, 0, 4)</code> (score negativo o NaN → 0). Para evitar saltos por una sola señal, el nivel confirmado <em>L<sub>t</sub></em> sigue estas reglas, con persistencia de subida <em>k</em> ∈ {"{2, 3, 5}"} y de bajada <em>m</em> ∈ {"{5, 10, 20}"} días:</p>
        <Eq>{`subir : si  min(nivel_crudo[t−k+1 .. t]) > L_{t−1}   →  L_t = min(nivel_crudo[t−k+1 .. t])
bajar : si no subió y  max(nivel_crudo[t−m+1 .. t]) < L_{t−1}  →  L_t = max(nivel_crudo[t−m+1 .. t])
si no : L_t = L_{t−1}                                (L_0 = 0)`}</Eq>
        <p><strong>Paso 4.5 — Exposición objetivo:</strong> nivel 0 → 100 %, 1 → 75 %, 2 → 50 %, 3 → 25 %, 4 → 0 % acciones. Niveles: {NIVELES.join(" · ")}.</p>
      </Sec>

      {/* ---------------- 5 Simulación ---------------- */}
      <Sec id="simulacion" n="5" titulo="Simulación de la política">
        <p><Etiqueta tipo="pre" /> La exposición <em>e<sub>t</sub></em> se decide con los datos al cierre de <em>t</em> y se aplica al retorno del día <em>t+1</em> (sin look-ahead). El retorno diario de la cartera y el costo son:</p>
        <Eq>{`ret_t   = e_{t−1}·r_SPY,t + (1 − e_{t−1})·r_refugio,t − costo_t
costo_t = 2 · c · | e_{t−1} − e_{t−2} |                  con c = 0.001 por lado
        (cambiar exposición implica vender un lado y comprar el otro)
equity_t = Π (1 + ret_s)      CAGR = equity_final^(1/años) − 1,   años = días_calendario / 365.25`}</Eq>
        <p>Refugios evaluados: <code>TLT</code> (100 % bonos del Tesoro 20+ años), <code>CASH</code> (índice de T-Bills descrito en 4) y <code>MIX</code> (50/50), rebalanceados diariamente. Benchmarks sobre las mismas fechas fuera de muestra: comprar y mantener SPY (e = 1), regla SMA200 (e<sub>t</sub> = 1 si SPY<sub>t</sub> &gt; SMA200<sub>t</sub>, si no 0, con refugio en efectivo; e = 1 mientras no haya 200 observaciones) y 60/40 (e = 0.6 constante, refugio TLT).</p>
        <p><strong>Métricas</strong> (<code>prl.emergency.backtest.metrics</code>): peor caída = mín(equity/máx. acumulado − 1); Calmar = CAGR/|peor caída|; Sharpe = media/desv.(ddof = 1)·√252 con tasa libre de riesgo 0; Sortino = media/desv. a la baja (objetivo 0)·√252.</p>
        <p><strong>Validación del simulador:</strong> el backtest se rechaza con error si la exposición trae NaN o valores fuera de [0,1], si los precios usados traen NaN, o si los pesos del refugio no suman 1. Esta regla surgió de la revisión de una versión previa del módulo que, ante datos faltantes, devolvía resultados erróneos sin avisar (equity 1.06 vs 1.12 en una prueba controlada).</p>
      </Sec>

      {/* ---------------- 6 Validación ---------------- */}
      <Sec id="validacion" n="6" titulo="Selección de variante y validación">
        <p><Etiqueta tipo="pre" /> <strong>Grilla cerrada: 2 × 3 × 3 × 3 × 3 = {r.n_variants} variantes</strong> (pesos × θ × k × m × refugio). Ninguna variante adicional se prueba.</p>
        <p><strong>Walk-forward expansivo anual.</strong> Para cada año de prueba <em>Y</em> ≥ {r.first_test_year}: (1) se calcula el Calmar de <em>cada</em> variante usando solo retornos hasta el 31-dic de <em>Y−1</em>; (2) se elige la de mayor Calmar (NaN cuenta como −∞; empates → primera del orden); (3) sus retornos del año <em>Y</em> son los retornos fuera de muestra. El estado de la máquina continúa día a día entre años (como ocurriría en operación real); lo único que se reelige cada año es la variante.</p>
        <Tabla
          densa
          cab={["Año", "Variante elegida (pesos | θ | k | m | refugio)", "Año", "Variante elegida", "Año", "Variante elegida"]}
          filas={(() => {
            const ent3 = Object.entries(r.chosen_by_year);
            const filas = [];
            const n = Math.ceil(ent3.length / 3);
            for (let i = 0; i < n; i++) {
              const fila = [];
              for (let c = 0; c < 3; c++) {
                const it = ent3[i + c * n];
                fila.push(it ? it[0] : "", it ? <code key={`${i}${c}`}>{it[1]}</code> : "");
              }
              filas.push(fila);
            }
            return filas;
          })()}
        />
        <p>
          <strong>Estabilidad de la selección:</strong>{" "}
          {frec.map(([id, n]) => `${id} (${n} de ${nAnios} años)`).join("; ")}. La variante elegida casi nunca cambia, así que el walk-forward aporta poca diversidad:
          el resultado fuera de muestra se parece al de una sola variante fija.
        </p>
      </Sec>

      {/* ---------------- 7 Resultados ---------------- */}
      <Sec id="resultados" n="7" titulo="Resultados fuera de muestra">
        <p><Etiqueta tipo="pre" /> Métricas completas ({ent(r.n_oos_days)} días, {r.oos_start} → {r.oos_end}):</p>
        <Tabla
          cab={["Cartera", "CAGR", "Peor caída", "Calmar", "Sharpe", "Sortino"]}
          filas={CART.map(([k, n]) => [n, pct(m[k].cagr, 2), pct(m[k].max_drawdown, 2), num(m[k].calmar, 3), num(m[k].sharpe, 3), num(m[k].sortino, 3)])}
        />
        <p><strong>Verificación de los criterios:</strong></p>
        <Tabla
          cab={["Criterio", "Umbral", "Modelo", "Referencia", "¿Cumple?"]}
          filas={[
            ["|Peor caída| ≤ 70 % de comprar y mantener", "≤ 70 %", `${pct(Math.abs(mod.max_drawdown), 2)} (${pct(ratioDD, 1)} de la referencia)`, pct(Math.abs(bh.max_drawdown), 2), sn(ratioDD <= 0.7)],
            ["CAGR ≥ 90 % del de comprar y mantener", `≥ ${pct(0.9 * bh.cagr, 2)}`, pct(mod.cagr, 2), pct(bh.cagr, 2), sn(mod.cagr >= 0.9 * bh.cagr)],
            ["Calmar > Calmar de SMA200", "—", num(mod.calmar, 3), num(sma.calmar, 3), sn(mod.calmar > sma.calmar)],
            ["Límite inferior IC95 % de ΔCalmar vs SMA200 > 0", "> 0", `${sg(ic.ci_lo, 3)} (punto ${sg(ic.value, 3)}; IC [${sg(ic.ci_lo, 3)}, ${sg(ic.ci_hi, 3)}])`, "—", sn(ic.ci_lo > 0)],
          ]}
        />
        <h4>Curva de capital (escala logarítmica, base 1 en {r.oos_start})</h4>
        <CurvaEquity curvas={ap.curves} claves={["model", "buy_hold", "sma200", "sixty_forty"]} />
        <Leyenda claves={["model", "buy_hold", "sma200", "sixty_forty"]} />
        <h4>Caída desde el máximo previo (underwater)</h4>
        <CurvaUnderwater curvas={ap.curves} claves={["buy_hold", "sma200", "model"]} />
        <Leyenda claves={["buy_hold", "sma200", "model"]} />

        <h4>Rendimiento por año calendario <Etiqueta tipo="exp" /></h4>
        <Tabla
          densa
          cab={["Año", "Días", "Modelo", "Comprar y mantener", "SMA200", "60/40", "Modelo − B&H"]}
          filas={ap.annual.map((a) => [a.year, a.n_days, pct(a.model), pct(a.buy_hold), pct(a.sma200), pct(a.sixty_forty), pp(a.model - a.buy_hold)])}
        />
        <p>
          El modelo supera a comprar y mantener en {ganaBH} de {nAnios} años, empata (±0.05 pp) en {igualBH} —años en que nunca redujo exposición— y rinde menos en {pierdeBH}.
          La diferencia se concentra en pocos años: 2008 ({pct(a2008.model)} vs {pct(a2008.buy_hold)}, {pp(a2008.model - a2008.buy_hold, 1)}), 2009 ({pct(a2009.model)} vs {pct(a2009.buy_hold)}, {pp(a2009.model - a2009.buy_hold, 1)}: el costo de permanecer defensivo durante el rebote)
          y 2022 ({pct(a2022.model)} vs {pct(a2022.buy_hold)}, {pp(a2022.model - a2022.buy_hold, 1)}).
        </p>

        <h4>Peores caídas (picos a recuperación) <Etiqueta tipo="exp" /></h4>
        <Tabla
          densa
          cab={["Cartera", "#", "Pico", "Mínimo", "Recuperación", "Profundidad", "Días pico→mínimo", "Días pico→recuperación"]}
          filas={["model", "buy_hold", "sma200"].flatMap((k) =>
            ap.drawdowns[k].map((x, i) => [i === 0 ? CART.find((c) => c[0] === k)[1] : "", i + 1, x.peak, x.trough, x.recovery || "sin recuperar", pct(x.depth, 1), ent(x.days_to_trough), x.days_to_recover ? ent(x.days_to_recover) : "—"])
          )}
        />
        <p>La peor caída del modelo ({pct(ddModelo.depth, 1)}) ocurre en el episodio {ddModelo.peak.slice(0, 4)}, no en 2008: en 2022 SPY cayó {pct(aa.SPY["2022"])} y TLT {pct(aa.TLT["2022"])} en el año, y el refugio no protegió.</p>

        <h4>Episodios de crisis (regla pre-registrada) <Etiqueta tipo="pre" /></h4>
        <p>Detección = primer día con nivel ≥ 2 (Defensivo) en la ventana [pico − 90 días, primer día con −20 % desde el pico]; anticipación = días entre la detección y ese cruce del −20 %.</p>
        <Tabla
          cab={["Episodio", "Pico SPY", "Mínimo", "Cruce −20 %", "Detección", "Anticipación"]}
          filas={r.episodes.episodes.map((e) => [e.name, e.peak, e.trough, e.cross20, e.detection_date || "no detectado", e.lead_days != null ? `${e.lead_days} días` : "—"])}
        />
        <p>
          Fuera de muestra y no evaluable: {r.episodes_excluded_not_oos.join(", ")}. Alarmas de nivel 4 (Crisis): {r.episodes.alarms.n_alarms}; falsas según la regla
          (sin caída adicional ≥ 10 % en las 60 filas siguientes): {r.episodes.alarms.n_false} ({r.episodes.alarms.false_dates.join(", ")}). Esa alarma ocurrió en pleno colapso de COVID, cuando la caída ya
          estaba hecha: la regla penaliza las alarmas tardías, y es una limitación de la definición, no un error de cálculo.
        </p>

        <h4>Uso del tiempo, exposición y costos <Etiqueta tipo="exp" /></h4>
        <Tabla
          cab={["Medida", "Valor"]}
          filas={[
            ["Fracción de días por nivel (0 / 1 / 2 / 3 / 4)", [0, 1, 2, 3, 4].map((i) => pct(r.level_fractions[String(i)], 1)).join(" / ")],
            ["Exposición promedio aplicada", pct(ex.mean_exposure, 1)],
            ["Días 100 % invertido en acciones", `${pct(ex.share_fully_invested, 1)} (${ent(ex.days_by_exposure["1.0"])} días)`],
            ["Días con 0 % en acciones", `${pct(ex.share_zero_equity, 1)} (${ent(ex.days_by_exposure["0.0"])} días)`],
            ["Cambios de exposición", `${ex.n_exposure_changes} en total (${num(ex.changes_per_year, 1)} por año)`],
            ["Costo total por transacciones (suma de costos diarios)", `${pct(ex.total_cost_drag, 2)} (${pct(ex.cost_drag_per_year, 2)} por año)`],
            ["Rotación acumulada Σ|Δe|", num(r.turnover, 1)],
          ]}
        />
      </Sec>

      {/* ---------------- 8 Inferencia ---------------- */}
      <Sec id="inferencia" n="8" titulo="Inferencia estadística">
        <h4>8.1 Block bootstrap pareado <Etiqueta tipo="pre" /> / <Etiqueta tipo="exp" /></h4>
        <p>
          Los retornos diarios están autocorrelacionados en volatilidad y los días de un mismo episodio no son independientes, por lo que se usa un <em>moving-block bootstrap</em> pareado:
          en cada réplica se concatenan ⌈<em>n</em>/20⌉ bloques de 20 días consecutivos (inicio uniforme), se recorta a <em>n</em> filas y se aplica <strong>la misma</strong> selección de filas
          al modelo y al benchmark; las series remuestreadas conservan el índice temporal original (así el CAGR, que usa el lapso calendario, sigue siendo válido). El intervalo es el percentil 2.5–97.5 de la estadística.
          El IC de ΔCalmar vs SMA200 es el pre-registrado ({ent(ic.n_boot)} réplicas); los demás son exploratorios ({ent(b.cagr_model_minus_buyhold.n_boot)} réplicas, semilla 0).
        </p>
        <Tabla
          cab={["Estadística (modelo − referencia)", "Punto", "IC 95 %", "¿Incluye 0?"]}
          filas={[
            ["ΔCalmar vs SMA200 (pre-registrado)", sg(ic.value, 3), `[${sg(ic.ci_lo, 3)}, ${sg(ic.ci_hi, 3)}]`, ic.ci_lo <= 0 && ic.ci_hi >= 0 ? "sí" : "no"],
            ...[
              ["cagr_model_minus_buyhold", "ΔCAGR vs comprar y mantener", true],
              ["maxdd_model_minus_buyhold", "ΔPeor caída vs comprar y mantener", true],
              ["sharpe_model_minus_buyhold", "ΔSharpe vs comprar y mantener", false],
              ["calmar_model_minus_buyhold", "ΔCalmar vs comprar y mantener", false],
              ["cagr_model_minus_sma200", "ΔCAGR vs SMA200", true],
              ["sharpe_model_minus_sma200", "ΔSharpe vs SMA200", false],
              ["maxdd_model_minus_sma200", "ΔPeor caída vs SMA200", true],
            ].map(([k, n, esPct]) => [
              n,
              esPct ? pp(b[k].point, 2) : sg(b[k].point, 3),
              esPct ? `[${pp(b[k].ci_lo, 2)}, ${pp(b[k].ci_hi, 2)}]` : `[${sg(b[k].ci_lo, 3)}, ${sg(b[k].ci_hi, 3)}]`,
              b[k].ci_lo <= 0 && b[k].ci_hi >= 0 ? "sí" : "no",
            ]),
          ]}
        />
        <p>
          <strong>Lectura.</strong> Frente a comprar y mantener, el rendimiento anual es estadísticamente indistinguible (ΔCAGR {pp(b.cagr_model_minus_buyhold.point, 2)}), y ni el Sharpe ni el Calmar difieren de forma significativa al 95 %.
          Frente a SMA200 la única diferencia cuyo IC excluye el cero es el CAGR ({pp(b.cagr_model_minus_sma200.point, 2)}, IC [{pp(b.cagr_model_minus_sma200.ci_lo, 2)}, {pp(b.cagr_model_minus_sma200.ci_hi, 2)}]): SMA200 pasa mucho tiempo en efectivo.
          <strong> Advertencia metodológica:</strong> la peor caída es un estadístico de dependencia de largo plazo (una secuencia de meses), y bloques de 20 días no pueden reproducir una caída de −55 %. Por eso el IC bootstrap de ΔPeor caída
          [{pp(b.maxdd_model_minus_buyhold.ci_lo, 2)}, {pp(b.maxdd_model_minus_buyhold.ci_hi, 2)}] debe leerse con cautela: infraestima la incertidumbre en el eje en que el modelo luce mejor y no sustituye evidencia de más episodios.
        </p>

        <h4>8.2 Deflated Sharpe Ratio (corrección por 162 intentos) <Etiqueta tipo="pre" /></h4>
        <p>Se prueba la variante elegida contra el máximo Sharpe esperable por azar entre {d.n_trials} intentos (Bailey &amp; López de Prado). Con <em>n</em> retornos diarios, Sharpe diario SR, asimetría γ<sub>3</sub> y curtosis γ<sub>4</sub> (no exceso):</p>
        <Eq>{`σ_SR = sqrt( (1 − γ3·SR + (γ4 − 1)/4 · SR²) / (n − 1) )
SR0  = σ_SR · ( (1 − γ)·Φ⁻¹(1 − 1/N) + γ·Φ⁻¹(1 − 1/(N·e)) ),    γ = 0.5772156649,  N = ${d.n_trials}
DSR  = Φ( (SR − SR0) / σ_SR )`}</Eq>
        <Tabla
          cab={["Componente", "Valor"]}
          filas={[
            ["n (días OOS)", ent(d.n)], ["SR diario / anualizado (×√252)", `${num(d.sr_daily, 5)} / ${num(d.sr_annualized, 3)}`],
            ["Asimetría γ3 / curtosis γ4", `${num(d.skew, 3)} / ${num(d.kurtosis, 2)} (colas pesadas)`], ["σ_SR", num(d.sr_std, 5)],
            ["SR0 diario / anualizado (máximo esperado por azar entre N)", `${num(d.sr0, 5)} / ${num(d.sr0_annualized, 3)}`],
            ["PSR frente a SR = 0 (sin corregir por intentos)", num(d.psr_vs_zero, 5)], ["DSR (N = 162)", num(d.dsr, 4)],
          ]}
        />
        <p>
          Tras corregir por los 162 intentos, la probabilidad de que el Sharpe verdadero supere al máximo esperable por azar es {pct(d.dsr, 1)}, por debajo del 95 % usual. Es una corrección conservadora: las 162 variantes no son independientes (están muy correlacionadas), así que el número efectivo de pruebas independientes es menor que 162.
        </p>

        <h4>8.3 Prueba placebo por desplazamiento circular <Etiqueta tipo="exp" /></h4>
        <p>
          Pregunta: ¿importa <em>cuándo</em> el modelo reduce exposición, o bastaría estar defensivo la misma fracción del tiempo en fechas al azar? Se toma la serie de exposición decidida de la variante más elegida (<code>{pl.variant}</code>, {frec[0][1]} de {nAnios} años) y se desplaza circularmente
          {" "}{ent(pl.n_placebo)} veces por un desfase uniforme en [252, n − 252] días. Cada desplazamiento conserva exactamente la ocupación de niveles y la persistencia, pero rompe su alineación con el mercado; se vuelve a simular con los mismos precios y costos.
          Nota: elegir esta variante después de ver los resultados es post-hoc.
        </p>
        <Tabla
          cab={["Estadística", "Observada", "Placebo p05", "p25", "mediana", "p75", "p95", "p (una cola)"]}
          filas={[
            ["Calmar", num(pl.observed_calmar, 3), num(pl.placebo_calmar.p05, 3), num(pl.placebo_calmar.p25, 3), num(pl.placebo_calmar.p50, 3), num(pl.placebo_calmar.p75, 3), num(pl.placebo_calmar.p95, 3), num(pl.p_value_calmar, 3)],
            ["Peor caída", pct(pl.observed_maxdd, 1), pct(pl.placebo_maxdd.p05, 1), pct(pl.placebo_maxdd.p25, 1), pct(pl.placebo_maxdd.p50, 1), pct(pl.placebo_maxdd.p75, 1), pct(pl.placebo_maxdd.p95, 1), num(pl.p_value_maxdd, 3)],
          ]}
        />
        <p>
          p = (1 + nº de placebos con resultado igual o mejor que el observado) / (1 + {ent(pl.n_placebo)}). El Calmar observado supera al percentil 95 de los placebos y la peor caída es menor que la de casi todos: <strong>el momento de las señales importa</strong>, no solo la fracción de tiempo defensivo.
          Límite: la prueba mide una variante, elegida post-hoc, y sus 3 episodios de crisis aportan casi toda la señal; no corrige por haber probado muchas variantes.
        </p>
      </Sec>

      {/* ---------------- 9 Sensibilidad ---------------- */}
      <Sec id="sensibilidad" n="9" titulo="Sensibilidad y robustez de las 162 variantes">
        <p>
          <Etiqueta tipo="exp" /> Se calcula el desempeño de <em>cada</em> variante sobre las mismas fechas fuera de muestra (descriptivo: aquí todas se ven sobre el mismo período, no es una validación). Referencias: Calmar de comprar y mantener {num(bh.calmar, 3)}, de SMA200 {num(sma.calmar, 3)}.
        </p>
        <Tabla
          densa
          cab={["Grupo", "Valor", "n", "Calmar mediana [Q1–Q3]", "Peor caída mediana", "% con peor caída < B&H", "% con Calmar > SMA200", "% con Calmar > B&H"]}
          filas={[
            ["Todas", "—", s.all.n, `${num(s.all.calmar_median, 3)} [${num(s.all.calmar_q25, 3)}–${num(s.all.calmar_q75, 3)}]`, pct(s.all.maxdd_median, 1), pct(s.all.share_maxdd_better_than_bh, 0), pct(s.all.share_calmar_above_sma200, 0), pct(s.all.share_calmar_above_bh, 0)],
            ...[["theta", "θ"], ["destination", "Refugio"], ["k", "k (subir)"], ["m", "m (bajar)"], ["weights", "Pesos"]].flatMap(([col, nom]) =>
              Object.entries(s[col]).map(([val, g], i) => [i === 0 ? nom : "", val, g.n, `${num(g.calmar_median, 3)} [${num(g.calmar_q25, 3)}–${num(g.calmar_q75, 3)}]`, pct(g.maxdd_median, 1), pct(g.share_maxdd_better_than_bh, 0), pct(g.share_calmar_above_sma200, 0), pct(g.share_calmar_above_bh, 0)])
            ),
          ]}
        />
        <p>
          Mejor variante: <code>{s.best_variant.id}</code> (Calmar {num(s.best_variant.calmar, 3)}, peor caída {pct(s.best_variant.maxdd, 1)}, CAGR {pct(s.best_variant.cagr, 1)}); peor: <code>{s.worst_variant.id}</code> (Calmar {num(s.worst_variant.calmar, 3)}, peor caída {pct(s.worst_variant.maxdd, 1)}, CAGR {pct(s.worst_variant.cagr, 1)}).
        </p>
        <ul className="exp-lista">
          <li><strong>La mejora frente a comprar y mantener es robusta:</strong> el {pct(s.all.share_maxdd_better_than_bh, 0)} de las variantes reduce la peor caída y el {pct(s.all.share_calmar_above_bh, 0)} mejora el Calmar. No depende de haber elegido bien.</li>
          <li><strong>La ventaja frente a SMA200 depende de un parámetro:</strong> supera a SMA200 el {pct(s.theta["0.5"].share_calmar_above_sma200, 0)} de las variantes con θ = 0.5, el {pct(s.theta["1.0"].share_calmar_above_sma200, 0)} con θ = 1.0 y el {pct(s.theta["1.5"].share_calmar_above_sma200, 0)} con θ = 1.5. Un índice más sensible protege mejor en este período.</li>
          <li><strong>Problema de borde de grilla:</strong> el mejor θ coincide con el valor más bajo probado (0.5). Cuando el óptimo está en el borde, la grilla no lo encierra, y no sabemos si valores menores (más sensibles aún) mejorarían o empeorarían. Esa pregunta requiere un nuevo experimento pre-registrado, no una reexploración sobre estos datos.</li>
          <li><strong>El refugio importa, pero menos:</strong> TLT mediana {num(s.destination.TLT.calmar_median, 3)}, MIX {num(s.destination.MIX.calmar_median, 3)}, CASH {num(s.destination.CASH.calmar_median, 3)}. Rendimiento anual de TLT: {pct(aa.TLT["2008"])} en 2008, {pct(aa.TLT["2009"])} en 2009, {pct(aa.TLT["2020"])} en 2020 y {pct(aa.TLT["2022"])} en 2022 (SPY: {pct(aa.SPY["2008"])}, {pct(aa.SPY["2009"])}, {pct(aa.SPY["2020"])}, {pct(aa.SPY["2022"])}; efectivo: {pct(aa.CASH["2008"])}, {pct(aa.CASH["2009"])}, {pct(aa.CASH["2020"])}, {pct(aa.CASH["2022"])}). TLT amortiguó 2008 y 2020, pero cayó junto con las acciones en 2022 y perdió en el rebote de 2009.</li>
        </ul>
      </Sec>

      {/* ---------------- 10 Dimensiones ---------------- */}
      <Sec id="dimensiones" n="10" titulo="Diagnóstico de las dimensiones">
        <p><Etiqueta tipo="exp" /> Correlación de Pearson entre las seis dimensiones y el índice compuesto (pesos iguales) sobre las {ent(ap.dims.n_rows)} fechas fuera de muestra con las seis disponibles:</p>
        <Tabla
          densa
          cab={["", ...DIMS.map((x) => x[1]), "Score"]}
          filas={[...DIMS, ["score", "Score"]].map(([a, na]) => [<strong key={a}>{na}</strong>, ...[...DIMS, ["score", "Score"]].map(([c]) => num(ap.dims.correlation[a][c], 2))])}
        />
        <Tabla
          densa
          cab={["Dimensión", "Media", "Desv. est.", "% días con z > 1"]}
          filas={[...DIMS, ["score", "Score"]].map(([k, n]) => [n, num(ap.dims.mean[k], 3), num(ap.dims.std[k], 3), pct(ap.dims.share_above_1[k], 1)])}
        />
        <p><strong>Valor promedio de cada dimensión en la ventana previa a cada crisis</strong> (de 90 días antes del pico hasta el cruce del −20 %):</p>
        <Tabla
          densa
          cab={["Episodio", "Ventana", "Días", ...DIMS.map((x) => x[1]), "Score"]}
          filas={ap.dims.pre_crisis.map((e) => [e.name, `${e.window[0]} → ${e.window[1]}`, e.n_days, ...DIMS.map(([k]) => sg(e.mean_in_window[k], 2)), sg(e.mean_in_window.score, 2)])}
        />
        <p>Los valores son z-scores medios (0 = promedio histórico a esa fecha). Esta tabla es descriptiva: no prueba que cada dimensión «cause» ni «prediga» por sí sola; solo muestra qué señales estaban elevadas antes de cada caída.</p>
      </Sec>

      {/* ---------------- 11 Lectura crítica ---------------- */}
      <Sec id="lectura" n="11" titulo="Lectura crítica de los resultados">
        <ol className="exp-lista">
          <li><strong>Frente a comprar y mantener:</strong> la reducción de la peor caída (de {pct(Math.abs(bh.max_drawdown), 1)} a {pct(Math.abs(mod.max_drawdown), 1)}) con CAGR equivalente es robusta a la variante (sección 9). Pero su incertidumbre real es alta: casi todo el beneficio proviene de un episodio (2008) y el bootstrap por bloques no la captura bien.</li>
          <li><strong>Frente a SMA200:</strong> la diferencia de Calmar ({sg(ic.value, 3)}) tiene un IC95 % de [{sg(ic.ci_lo, 3)}, {sg(ic.ci_hi, 3)}]. Con {r.episodes.episodes.length} episodios evaluables y una ventaja que solo aparece con θ = 0.5, no es posible distinguirla de cero. Por eso <strong>INCONCLUSIVE</strong> y no <em>VALIDATED</em>.</li>
          <li><strong>No es un rechazo:</strong> el modelo no es peor que SMA200 (Calmar mayor, CAGR {pp(b.cagr_model_minus_sma200.point, 1)} mayor con IC que excluye 0) y la prueba placebo sugiere que el momento de las señales aporta información. Rechazar exigiría evidencia en contra, y aquí no la hay.</li>
          <li><strong>Costo de la cautela:</strong> {pct(ex.share_fully_invested, 0)} de los días 100 % invertido, {pct(r.level_fractions["4"], 1)} en Crisis. En 2009 el modelo rindió {pp(a2009.model - a2009.buy_hold, 1)} menos que comprar y mantener por tardar en volver a exponerse.</li>
          <li><strong>El caso 2022 es la advertencia principal:</strong> cuando bonos y acciones caen juntos, el refugio TLT no protege y el índice no dio alerta (no detectado). Su peor caída ({pct(ddModelo.depth, 1)}) fue mayor que la de comprar y mantener en ese episodio ({pct(ap.drawdowns.buy_hold.find((x) => x.peak === ddModelo.peak)?.depth ?? null, 1)}).</li>
        </ol>
      </Sec>

      {/* ---------------- 12 Validez ---------------- */}
      <Sec id="validez" n="12" titulo="Amenazas a la validez y limitaciones">
        <Tabla
          cab={["Amenaza", "Estado / mitigación"]}
          filas={[
            ["Look-ahead en las dimensiones", "Mitigado: z-scores expansivos; pruebas que truncan o alteran el futuro y exigen que el pasado no cambie (por dimensión y para la máquina de estados)."],
            ["Look-ahead en la ejecución", "Mitigado: exposición decidida en t, aplicada en t+1; hay pruebas que verifican que una caída ocurrida el mismo día de la decisión no se evita."],
            ["Selección de parámetros con datos futuros", "Mitigado: walk-forward (la variante de cada año usa solo datos previos). Residual: la grilla y el esquema general (SMA200, VIX, etc.) provienen de conocimiento público de mercado."],
            ["Múltiples comparaciones", `162 variantes: se reporta el número de intentos y el Deflated Sharpe (${num(d.dsr, 3)}). Las variantes están correlacionadas, lo que hace la corrección conservadora.`],
            ["Pocos eventos independientes", `${r.episodes.episodes.length} episodios evaluables fuera de muestra. La potencia estadística es baja por construcción; INCONCLUSIVE es un resultado esperado y legítimo.`],
            ["Régimen de tasas (TLT)", "El período 2004–2020 fue de tasas a la baja, favorable a TLT como refugio. 2022 muestra el riesgo contrario. Resultados específicos de este régimen."],
            ["Borde de grilla (θ = 0.5)", "No resuelto: requiere un experimento nuevo con una grilla que encierre el óptimo."],
            ["Modelo de costos", "0.10 % por lado, aplicado al cambio de exposición. El rebalanceo diario del refugio (y de la mezcla 60/40) se asume sin costo, lo que favorece ligeramente a todas las carteras con refugio."],
            ["Datos de terceros", "yfinance y FRED no son point-in-time. Para ETFs e índices sin revisiones sustantivas el riesgo es bajo; no se esperan revisiones sustantivas en BAA10Y, pero no se verificó contra vintages históricos (ALFRED). Los archivos se congelan por hash."],
            ["Crédito y amplitud simplificados", "Solo BAA10Y (sin HYG/LQD) y proxies de amplitud (RSP/SPY); no hay % de acciones sobre su media móvil (requiere constituyentes históricos)."],
            ["Alarma de COVID «falsa»", "Artefacto de la definición (la caída ya estaba hecha); se reporta tal cual."],
            ["Análisis exploratorio", "Las secciones marcadas EXPLORATORIO son post-hoc: describen, no prueban. No cambian la etiqueta del experimento."],
          ]}
        />
      </Sec>

      {/* ---------------- 13 Siguiente ---------------- */}
      <Sec id="siguiente" n="13" titulo="Qué haría falta para validar (o rechazar)">
        <ul className="exp-lista">
          <li><strong>EXP-002 (propuesta, requiere su propio pre-registro):</strong> grilla de θ que encierre el óptimo (p. ej. 0.25–1.0) y estricta separación entre elección de grilla y evaluación; el estudio de θ en el borde no puede hacerse sobre estos mismos datos sin invalidar la inferencia.</li>
          <li><strong>Más eventos independientes:</strong> mercados internacionales y otros activos de riesgo; períodos previos a 2002 con refugio en efectivo (la serie DTB3 llega a 1954); series con más crisis.</li>
          <li><strong>Evidencia fuera de muestra verdadera:</strong> el medidor diario publicado en este sitio acumula, día a día, predicciones que no pudieron ajustarse con datos futuros. Es modo «sombra», sin influencia sobre ninguna operación.</li>
          <li><strong>Refugios alternativos para el escenario inflacionario</strong> (2022): evaluar la señal con distintos destinos por tipo de crisis, ya previsto en el pre-registro.</li>
        </ul>
      </Sec>

      {/* ---------------- 14 Repro ---------------- */}
      <Sec id="repro" n="14" titulo="Reproducibilidad y transparencia">
        <Eq>{`git clone ${REPO}
pip install -e ".[dev]"
# 1. datos congelados (Release data-2026-11-11) y verificación de hashes
python -m prl.data.build --verify
# 2. experimento (cálculo fijo; el LLM solo redacta)
python -m prl.runner experiments/EXP-001-emergency-model
# 3. apéndice exploratorio (verifica primero que reproduce results.json exactamente)
python experiments/EXP-001-emergency-model/appendix.py <inputs> <salida>`}</Eq>
        <ul className="exp-lista">
          <li><a href={`${BLOB}/experiments/EXP-001-emergency-model/PREREGISTRATION.md`}>Pre-registro (v1 + aclaraciones v1.1)</a> · <a href={`${BLOB}/experiments/EXP-001-emergency-model/IMPLEMENTATION_SPEC.md`}>contrato de implementación</a> · <a href={`${BLOB}/METHODOLOGY.md`}>metodología</a></li>
          <li><a href={`${BLOB}/${RUN}/results.json`}>results.json</a> · <a href={`${BLOB}/experiments/EXP-001-emergency-model/appendix.json`}>appendix.json</a> · <a href={`${BLOB}/experiments/EXP-001-emergency-model/appendix.py`}>appendix.py</a> · <a href={`${BLOB}/src/prl/emergency`}>código del modelo</a></li>
        </ul>
        <p>
          <strong>Uso de modelos de lenguaje.</strong> El código del modelo fue escrito por DeepSeek (<code>deepseek-flash</code>) dentro de un ciclo de pruebas: contrato y tests escritos por una persona/Claude, ejecución del código generado sin secretos, y revisión humana
          antes de integrarlo (la revisión encontró y corrigió tres defectos: manejo de datos faltantes en el backtest, bootstrap que perdía el orden temporal y una copia del indicador diario que divergía del modelo en la correlación). Los números de este reporte los producen el código del experimento y el apéndice; ningún modelo de lenguaje calcula ni recuerda cifras.
          El texto de este reporte lo redactó Claude (Anthropic), que administra el sitio, y cada cifra proviene de <code>results.json</code> y <code>appendix.json</code>. La etiqueta del experimento (<strong>{r.label}</strong>) la calcula código con criterios fijados antes de ver resultados.
        </p>
        <p className="exp-nota">Material de investigación y educativo. No es asesoría de inversión ni una recomendación de compra o venta.</p>
      </Sec>
    </article>
  );
}
