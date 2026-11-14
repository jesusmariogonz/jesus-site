import r from "@/lib/research/exp002-results.json";
import ap from "@/lib/research/exp002-appendix.json";
import { CurvaEquity, CurvaUnderwater, Leyenda } from "@/components/research/Curvas";

/* Reporte técnico de EXP-002. Toda cifra sale de results.json (pre-registrado)
   o del apéndice EXPLORATORIO (appendix.json, prl.growth_max.exp002 + el
   script appendix.py); aquí solo se les da formato. */

const REPO = "https://github.com/jesusmariogonz/pulso-research-lab";
const BLOB = `${REPO}/blob/main`;
const RUN = "runs/EXP-002-growth-max-global/20261113T202608Z";
const MANIFEST_SHA = "bd5bae2b97b7725c30a8370e269aba0750fea976c63c0aaa48c07a0c7c7d490b";

const pct = (v, d = 1) => (v == null ? "—" : `${(v * 100).toFixed(d)}%`);
const pp = (v, d = 1) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${(v * 100).toFixed(d)} pp`);
const num = (v, d = 2) => (v == null ? "—" : v.toFixed(d));
const sg = (v, d = 2) => (v == null ? "—" : `${v >= 0 ? "+" : ""}${v.toFixed(d)}`);
const ent = (v) => v.toLocaleString("es-MX");

const NIVELES = [
  ["Conservative", "Conservative (cash 20%, 1.0x)"],
  ["Growth25", "Growth25 (cash 10%, 1.0x)"],
  ["Growth50", "Growth50 (cash 5%, 1.5x)"],
  ["Growth75", "Growth75 (sin cash, 1.5x)"],
  ["Max", "Max (sin cash, 2.0x)"],
];

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
function Eq({ children }) { return <pre className="exp-eq">{children}</pre>; }
function Sec({ id, n, titulo, children }) {
  return <section id={id} className="exp-sec"><h2>{n}. {titulo}</h2>{children}</section>;
}
function Etiqueta({ tipo }) {
  const txt = tipo === "pre" ? "PRE-REGISTRADO" : "EXPLORATORIO · post-hoc";
  return <span className={`exp-etq exp-etq-${tipo}`}>{txt}</span>;
}

function decodeVariantId(vid) {
  const [L, W, B, V, cp, cash, lev, spread, k] = vid.split("|");
  const [construccion, param] = cp.split(":");
  return { L, W, B, V, construccion, param: param === "None" ? null : param, cash, lev, spread, k };
}

export default function Exp002Reporte() {
  const g50 = r.niveles.Growth50;
  const cmp = r.comparacion_bootstrap_growth50;
  const vg = decodeVariantId(r.variant_id_ganador);
  const ds = ap.dsr_steps;
  const rc = ap.reality_check;
  const tr = ap.trials;
  const sens = ap.sensitivity;
  const regev = ap.regime_events;
  const plReg = ap.placebo_regimen;
  const plPre = ap.placebo_preregistrado;
  const niveles5 = NIVELES.map(([k]) => k);

  return (
    <article className="exp-reporte">
      <nav className="exp-toc" aria-label="Contenido del reporte">
        <strong>Contenido</strong>
        {[
          ["ficha", "Ficha técnica"], ["abstract", "1 · Resumen técnico"], ["diseno", "2 · Hipótesis y diseño"],
          ["datos", "3 · Datos"], ["senales", "4 · Señales y construcción de portafolio"], ["simulacion", "5 · Simulación"],
          ["validacion", "6 · Selección de la variante"], ["resultados", "7 · Resultados"],
          ["regimen", "8 · Entradas y salidas de régimen"], ["inferencia", "9 · Inferencia estadística"],
          ["sensibilidad", "10 · Sensibilidad y robustez"], ["lectura", "11 · Lectura crítica"],
          ["validez", "12 · Amenazas a la validez"], ["siguiente", "13 · Qué falta para validar"],
          ["repro", "14 · Reproducibilidad"],
        ].map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
      </nav>

      {/* ---------------- Ficha ---------------- */}
      <section id="ficha" className="exp-sec">
        <h2>Ficha técnica</h2>
        <Tabla cab={["Campo", "Valor"]} filas={[
          ["Identificador / estado", <><strong>EXP-002</strong> · <span className="exp-badge exp-badge-rechazado">{r.label}</span> (etiqueta calculada por código)</>],
          ["Pregunta", "¿Puede una política de apalancamiento y rotación de régimen macro, elegida entre 17,280 variantes con datos de 2006–2019, hacer crecer el capital más rápido que un portafolio simple 60/40, fuera de la muestra con la que se eligió (2020–2026)?"],
          ["Pre-registro", <>v1.5 bloqueado (manifiesto <code>{MANIFEST_SHA.slice(0, 12)}…</code>, 207 series, fecha de inicio 2006-02-06)</>],
          ["Universo", "65 instrumentos (ETF/índices globales: acciones por país/sector/factor, bonos, materias primas, divisas, REIT) + régimen macro de 3 series point-in-time (ALFRED)"],
          ["Muestra", <>discovery {r.fecha_inicio_backtest.slice(0, 10)} → {r.discovery_end} · validation → {r.validation_end} (una sola vez) · <strong>locked test</strong> → hoy ({ent(r.n_dias_locked_test)} días hábiles, nunca visto hasta la corrida)</>],
          ["Variantes evaluadas", `${ent(r.n_variants)} (grilla cerrada, pre-registrada: señales × construcción × cash × apalancamiento × spread × k)`],
          ["Variante ganadora", <code>{r.variant_id_ganador}</code>],
          ["Código de la corrida", <>sin LLM en tiempo de ejecución (<code>prl.growth_max.exp002.run</code>) · <a href={`${BLOB}/${RUN}/results.json`}>results.json</a></>],
          ["Bootstrap", `bloques de 20 días hábiles, ${ent(10000)} réplicas, semilla 0`],
        ]} />
      </section>

      {/* ---------------- 1 Abstract ---------------- */}
      <Sec id="abstract" n="1" titulo="Resumen técnico">
        <p>
          Se construye una grilla cerrada de {ent(r.n_variants)} variantes que combinan 6 familias de señales (momentum, tendencia, breakout,
          reversión, volatilidad, régimen macro), 4 métodos de construcción de portafolio (igual peso, inverso a la volatilidad, volatilidad
          objetivo, Kelly fraccional), 5 políticas de cash, 3 niveles de apalancamiento (1.0x–2.0x, con costo de financiamiento explícito) y
          un factor <code>k</code> que reduce la exposición cuando el régimen macro point-in-time (M2, balance de la Fed, índice líder) indica
          contracción. Se selecciona una sola variante con discovery (2006–2015) y validation (2016–2019): la que pasa el filtro de
          probabilidad de pérdida ≥50 % sobre esa ventana y maximiza el crecimiento geométrico en validation.
        </p>
        <p>
          En el <strong>locked test</strong> ({r.fecha_inicio_backtest.slice(0,4)}–hoy no visto, {ent(r.n_dias_locked_test)} días), el nivel
          Growth50 obtiene CAGR {pct(g50.metricas.cagr, 2)}, peor caída {pct(g50.metricas.max_drawdown, 1)}, Sharpe {num(g50.metricas.sharpe, 2)},
          y solo supera al benchmark 60/40 en {pct(cmp.frac_supera_benchmark, 1)} de las réplicas bootstrap pareado (se exigía ≥80 % para
          validar). El Deflated Sharpe Ratio sobre el periodo de validación, corrigiendo por los {ent(r.n_variants)} intentos, es{" "}
          {ds.dsr.toExponential(2)}: prácticamente cero. <strong>Etiqueta: {r.label}</strong> (razón: {r.motivo_seleccion === "filtro_50" ? "la variante pasó el filtro de selección pero no superó al benchmark en el locked test" : r.motivo_seleccion}).
          Mirando toda la historia (no solo el locked test, sección 7): la estrategia defendió bien la crisis de 2008 y después quedó
          rezagada frente al 60/40 casi todos los años siguientes — el locked test no es una mala racha aislada, es la continuación de un
          patrón de 15 años.
        </p>
        <p>
          El análisis exploratorio (secciones 8–10, post-hoc) agrega tres hallazgos no anticipados en el pre-registro: (i) a mayor
          apalancamiento, peor resultado — los niveles Conservative y Growth25 sí dan CAGR positivo; (ii) <strong>el régimen macro nunca
          entró en estado de contracción en los datos reales</strong>: el factor <em>k</em> no tuvo ningún efecto en ninguna de las{" "}
          {ent(r.n_variants)} variantes (sección 8) — la mitad de la grilla (el eje <em>k</em>) es redundante; (iii) ninguna de las{" "}
          {ent(r.n_variants)} variantes superó al benchmark en el periodo de validación (2016–2019, un mercado alcista fuerte para 60/40), y
          el Reality Check de White lo confirma formalmente (p = {num(rc.p_value, 3)}); (iv) el placebo pre-registrado (percentil{" "}
          {pct(r.percentil_vs_placebo, 1)}) no tiene poder estadístico real — es una rotación circular de un estadístico invariante a la
          rotación, y el número es ruido de redondeo de punto flotante, no evidencia (sección 9.4).
        </p>
      </Sec>

      {/* ---------------- 2 Diseño ---------------- */}
      <Sec id="diseno" n="2" titulo="Hipótesis y diseño">
        <p><Etiqueta tipo="pre" /> Hipótesis, criterios y grilla se fijaron y bloquearon antes de correr nada sobre datos reales.</p>
        <ul className="exp-lista">
          <li><strong>H0 (nula):</strong> ninguna variante de la grilla produce, fuera de muestra, un crecimiento distinguible del de un portafolio 60/40.</li>
          <li><strong>H1:</strong> una política de apalancamiento + rotación de régimen, elegida con discovery/validation, hace crecer el capital más rápido que 60/40 en el locked test, con probabilidad de ruina acotada.</li>
          <li><strong>H2 (niveles):</strong> existe una frontera de apetito de riesgo (Conservative→Max) donde más riesgo se traduce en más crecimiento esperado, al costo de más probabilidad de pérdida.</li>
        </ul>
        <p><strong>Criterio de selección</strong> (discovery+validation, sin tocar el locked test):</p>
        <Eq>{`candidatas = { v en grilla : P(perdida >= 50%, bootstrap bloques=20, 10000 replicas) < 20% }
si candidatas vacío: relajar una vez a 50% < 25%; si sigue vacío -> INCONCLUSIVE sin tocar locked test
ganador = argmax_{v en candidatas} tasa_crecimiento_geometrica(retorno_validation(v))`}</Eq>
        <p><strong>Criterio de etiqueta</strong> (orden de prioridad, código <code>evaluation.etiqueta</code>):</p>
        <Eq>{`INCONCLUSIVE  si  n_dias_locked_test < 756
REJECTED      si  frac_supera_benchmark <= 0.50  o  P(perdida>=75% en Growth50) > 0.20
VALIDATED     si  IC95%_inferior(CAGR_modelo) > 0  y  frac_supera_benchmark >= 0.80
INCONCLUSIVE  en cualquier otro caso`}</Eq>
        <p>En esta corrida: n_dias_locked_test = {ent(r.n_dias_locked_test)} (≥756, no aplica INCONCLUSIVE por eso) y frac_supera_benchmark = {pct(cmp.frac_supera_benchmark, 1)} ≤ 50 % → <strong>REJECTED</strong>, sin necesidad de evaluar el criterio de VALIDATED.</p>

        <h4>2.1 Trabajo relacionado</h4>
        <p>Se citan solo trabajos cuya referencia se verificó.</p>
        <ul className="exp-lista">
          <li><strong>Momentum de series de tiempo.</strong> Moskowitz, Ooi y Pedersen (2012), «Time Series Momentum», <em>Journal of Financial Economics</em> 104(2), 228–250 (DOI 10.1016/j.jfineco.2011.11.003), documentan persistencia de 1 a 12 meses en 58 futuros líquidos. La señal <code>ts_momentum_signal</code> de este experimento es de la misma familia.</li>
          <li><strong>Kelly fraccional.</strong> MacLean, Thorp y Ziemba (2010), «Long-term capital growth: the good and bad properties of the Kelly and fractional Kelly capital growth criteria», <em>Quantitative Finance</em> 10(7) (DOI 10.1080/14697688.2010.506108): el Kelly completo es riesgoso en el corto plazo y sobre-apostar puede llevar a la ruina incluso con una ventaja real — la razón de pre-registrar <code>kelly_frac</code> con parámetros 0.25/0.50/1.00 en vez de Kelly completo.</li>
          <li><strong>Regímenes y asignación de riesgo.</strong> Costa y Kwon (2019), «Risk parity portfolio optimization under a Markov regime-switching framework», <em>Quantitative Finance</em> 19(3), 453–471: una versión de risk parity consciente del régimen supera a la versión nominal a igual riesgo en sus pruebas fuera de muestra. El factor <code>k</code> de este experimento es una versión mucho más simple (binaria, 2 estados) de la misma idea.</li>
        </ul>
      </Sec>

      {/* ---------------- 3 Datos ---------------- */}
      <Sec id="datos" n="3" titulo="Datos">
        <p>
          {ap.series.length} series: precios diarios (<code>yfinance</code>, <code>adj_close</code> para retornos totales) para el universo de
          65 instrumentos, más 3 series macro <strong>point-in-time</strong> (ALFRED/FRED vintages: M2, balance de la Fed, índice líder) y la
          tasa de efectivo (DTB3). Las series macro se reconstruyen "tal como se conocían" en cada fecha de corte (sin look-ahead de
          revisiones). Congeladas con SHA-256 por archivo, verificadas contra el manifiesto antes de cada corrida.
        </p>
        <Tabla densa cab={["Serie", "Fuente · símbolo", "Rol", "Desde", "Hasta", "Filas", "SHA-256"]} filas={ap.series.map((x) => [
          <strong key="i">{x.id}</strong>, `${x.source} · ${x.symbol || "—"}`, x.role || "—", x.desde || "—", x.hasta || "—",
          x.filas != null ? ent(x.filas) : "—", <code key="h">{(x.sha256 || "").slice(0, 10)}…</code>,
        ])} />
      </Sec>

      {/* ---------------- 4 Señales ---------------- */}
      <Sec id="senales" n="4" titulo="Señales y construcción de portafolio">
        <p><Etiqueta tipo="pre" /> Seis familias de señales, cada una calculada por activo con una ventana de la grilla:</p>
        <Tabla cab={["Señal", "Idea", "Parámetro de grilla"]} filas={[
          ["Momentum (L meses)", "Signo del retorno trailing de L meses", "L ∈ {3, 6, 12}"],
          ["Tendencia (W días)", "Precio vs. su media móvil de W días", "W ∈ {50, 100, 200}"],
          ["Breakout (B días)", "Precio vs. su máximo/mínimo de B días", "B ∈ {55, 252}"],
          ["Reversión (z-score)", "Reversión a la media de 10 días, solo en régimen de rango", "fijo"],
          ["Volatilidad realizada (V días)", "Usada para inv_vol / vol_target / Kelly", "V ∈ {20, 60}"],
          ["Régimen macro", "Combinación de liquidez (M2, balance Fed) y crecimiento (índice líder), point-in-time", "fijo"],
        ]} />
        <p>Las señales direccionales (momentum/tendencia/breakout) se promedian; en régimen de rango la señal direccional se sustituye por la de reversión. El resultado se combina con 4 métodos de construcción:</p>
        <Tabla cab={["Construcción", "Parámetro", "Idea"]} filas={[
          ["equal", "—", "Peso igual entre activos con señal positiva"],
          ["inv_vol", "—", "Peso inversamente proporcional a la volatilidad realizada"],
          ["vol_target", "0.10 / 0.15 / 0.20", "Escala los pesos para que la volatilidad del portafolio iguale el objetivo"],
          ["kelly_frac", "0.25 / 0.50 / 1.00", "Fracción de la apuesta de Kelly (retorno esperado / varianza) trailing"],
        ]} />
        <p>
          El factor de régimen <code>k</code> ∈ {"{0.5, 0.75}"} escala TODA la fila de pesos (los 4 métodos por igual) cuando el régimen macro
          indica contracción: <code>factor = 1 + (k−1)·1[régimen ∈ {"{contracción}"}]</code>. El apalancamiento (1.0x/1.5x/2.0x) y el cash
          (0 % / 5 % / 10 % / 20 % / dinámico) se aplican después, con un costo de financiamiento explícito sobre la porción apalancada
          (tasa de efectivo + spread de 1 % o 2 %).
        </p>
      </Sec>

      {/* ---------------- 5 Simulación ---------------- */}
      <Sec id="simulacion" n="5" titulo="Simulación">
        <p><Etiqueta tipo="pre" /> Los pesos se deciden con datos al cierre de <em>t</em> y se aplican al retorno de <em>t+1</em> (rezago interno del backtest, sin look-ahead). Retorno diario:</p>
        <Eq>{`ret_t = Σ_activo peso_aplicado_{activo,t} · retorno_{activo,t}  −  costo_transaccion_t  −  costo_apalancamiento_t
costo_transaccion_t = 0.1% por lado · turnover_t     (turnover = Σ|Δpeso aplicado|)
costo_apalancamiento_t = max(0, apalancamiento − 1) · (tasa_cash_anual + spread) / 252`}</Eq>
        <p>
          El efectivo ocioso gana la tasa libre de riesgo (DTB3), modelado como un activo sintético "CASH" agregado al panel de precios y
          retornos antes de llamar a la misma función de backtest genérica usada para todos los activos — sin casos especiales. El panel de
          precios no se recorta a un inicio común: cada variante solo sostiene peso en activos con retorno disponible ese día (validado
          estrictamente; el backtest rechaza con error si no se cumple).
        </p>
      </Sec>

      {/* ---------------- 6 Selección ---------------- */}
      <Sec id="validacion" n="6" titulo="Selección de la variante ganadora">
        <p><Etiqueta tipo="pre" /> La variante ganadora, decodificada:</p>
        <Tabla cab={["Parámetro", "Valor"]} filas={[
          ["Momentum (L)", `${vg.L} meses`], ["Tendencia (W)", `${vg.W} días`], ["Breakout (B)", `${vg.B} días`],
          ["Volatilidad (V)", `${vg.V} días`], ["Construcción", `${vg.construccion}${vg.param ? ` (${vg.param})` : ""}`],
          ["Cash (en la selección)", vg.cash], ["Apalancamiento (en la selección)", `${vg.lev}x`],
          ["Spread de financiamiento", `${(parseFloat(vg.spread) * 100).toFixed(0)}%`], ["Factor k de régimen", vg.k],
        ]} />
        <p>
          Nótese que el cash/apalancamiento de la selección (cash 20 %, 1.0x) <strong>coinciden exactamente</strong> con los del nivel
          "Conservative": la selección se hizo sobre esa combinación específica de señales, y los 5 niveles de apetito solo cambian
          cash/apalancamiento, reusando la misma combinación de señales y el mismo factor k.
        </p>
      </Sec>

      {/* ---------------- 7 Resultados ---------------- */}
      <Sec id="resultados" n="7" titulo="Resultados fuera de muestra">
        <p><Etiqueta tipo="pre" /> Métricas completas del locked test ({ent(r.n_dias_locked_test)} días):</p>
        <Tabla cab={["Nivel", "CAGR", "Peor caída", "Calmar", "Sharpe", "Sortino"]} filas={NIVELES.map(([k, n]) => {
          const m = r.niveles[k].metricas;
          return [n, pct(m.cagr, 2), pct(m.max_drawdown, 1), num(m.calmar, 3), num(m.sharpe, 3), num(m.sortino, 3)];
        })} />
        <p><strong>Probabilidad de ruina</strong> (bootstrap, locked test):</p>
        <Tabla densa cab={["Nivel", "P(pérdida≥50%)", "P(pérdida≥75%)", "P(pérdida≥90%)", "P(pérdida≥99%)"]} filas={NIVELES.map(([k, n]) => {
          const p = r.niveles[k].probabilidad_ruina;
          return [n, pct(p["0.5"], 1), pct(p["0.75"], 1), pct(p["0.9"], 1), pct(p["0.99"], 1)];
        })} />
        <p><strong>Verificación del criterio de etiqueta (Growth50 vs. benchmark 60/40):</strong></p>
        <Tabla cab={["Criterio", "Umbral", "Observado", "¿Cumple?"]} filas={[
          ["Días del locked test", "≥ 756", ent(r.n_dias_locked_test), "Sí"],
          ["Growth50 supera al benchmark", "> 50% (y ≥80% para validar)", pct(cmp.frac_supera_benchmark, 1), "No"],
          ["P(pérdida≥75%) en Growth50", "≤ 20%", pct(g50.probabilidad_ruina["0.75"], 1), "Sí (pero no evita REJECTED por el criterio anterior)"],
          ["IC95% inferior del CAGR de Growth50", "> 0", `${pct(cmp.ci_cagr_modelo[0], 1)} (IC [${pct(cmp.ci_cagr_modelo[0], 1)}, ${pct(cmp.ci_cagr_modelo[1], 1)}])`, "No"],
        ]} />

        <h4>Curva de capital (escala logarítmica, base 1 en {r.fecha_inicio_backtest.slice(0, 10)})</h4>
        <CurvaEquity curvas={ap.curves} claves={["Conservative", "Growth50", "Max", "benchmark"]} base="Growth50" />
        <Leyenda claves={["Conservative", "Growth50", "Max", "benchmark"]} />
        <p className="exp-nota">
          Patrón visible en toda la historia (no solo en el locked test): la estrategia defendió bien la crisis de 2008
          ({ap.annual.find((a) => a.year === 2008)?.Growth50 != null ? pct(ap.annual.find((a) => a.year === 2008).Growth50, 1) : "—"}{" "}
          en Growth50 vs. {pct(ap.annual.find((a) => a.year === 2008)?.benchmark, 1)} del benchmark), pero desde 2009 quedó rezagada frente
          al 60/40 en la gran mayoría de los años siguientes — el locked test (2020–2026) no es una mala racha aislada, es la continuación
          de un patrón de 15 años.
        </p>
        <h4>Caída desde el máximo previo (underwater)</h4>
        <CurvaUnderwater curvas={ap.curves} claves={["Growth50", "Max", "benchmark"]} base="Growth50" />
        <Leyenda claves={["Growth50", "Max", "benchmark"]} />

        <h4>Rendimiento por año calendario <Etiqueta tipo="exp" /></h4>
        <Tabla densa cab={["Año", ...niveles5, "Benchmark"]} filas={ap.annual.map((a) => [a.year, ...niveles5.map((k) => pct(a[k])), pct(a.benchmark)])} />

        <h4>Peores caídas <Etiqueta tipo="exp" /></h4>
        <Tabla densa cab={["Cartera", "#", "Pico", "Mínimo", "Recuperación", "Profundidad", "Días pico→mínimo"]} filas={
          Object.entries(ap.drawdowns).flatMap(([k, lista]) => lista.map((x, i) => [
            i === 0 ? k : "", i + 1, x.peak, x.trough, x.recovery || "sin recuperar", pct(x.depth, 1), ent(x.days_to_trough),
          ]))
        } />
      </Sec>

      {/* ---------------- 8 Régimen ---------------- */}
      <Sec id="regimen" n="8" titulo="El régimen macro nunca activó el factor k">
        <p>
          <Etiqueta tipo="exp" /> El factor <em>k</em> debía reducir exposición cuando el régimen (combinación de liquidez y crecimiento,
          ambos point-in-time) entrara en <strong>contracción</strong> (liquidez a la baja Y crecimiento a la baja o al alza, estados 3/4 de{" "}
          <code>signals.regimen_macro</code>). En los datos reales, eso <strong>nunca ocurrió</strong>: {ent(regev.dias_en_contraccion)} días
          en contracción en todo el backtest ({pct(regev.fraccion_en_contraccion, 1)} de los días), {ent(regev.n_entradas_contraccion)} entradas.
        </p>
        <p>
          La causa no es que la liquidez nunca se contrajera (sí lo hizo: el signo combinado de M2 y del balance de la Fed fue negativo en
          397 de los días del backtest, sobre todo durante el ciclo de ajuste de 2022–2023), sino que <strong>cada vez que la liquidez
          estaba en contracción, el signo del crecimiento (índice líder) era simultáneamente 0 o indeterminado (NaN)</strong> — nunca +1 ni
          −1 al mismo tiempo. Por la regla de <code>regimen_macro</code> (exige ambos signos estrictamente no nulos), esos días caen en
          "régimen desconocido" (NaN) en lugar de clasificarse como contracción. El resultado: <strong>k no tuvo ningún efecto en ninguna de
          las {ent(r.n_variants)} variantes</strong> — se puede verificar directamente en la tabla de sensibilidad (sección 10): k=0.5 y
          k=0.75 dan exactamente la misma mediana de crecimiento, los mismos cuartiles y el mismo número de variantes que superan el
          benchmark, variante por variante.
        </p>
        <p>
          <strong>Consecuencia metodológica:</strong> el eje <em>k</em> de la grilla pre-registrada es redundante en esta corrida — cada
          variante con k=0.5 tiene un gemelo idéntico con k=0.75. La grilla de {ent(r.n_variants)} "variantes" probó, en la práctica, solo{" "}
          {ent(r.n_variants / 2)} combinaciones distintas de señales/construcción/cash/apalancamiento/spread. Usar n_trials={ent(r.n_variants)}{" "}
          en el Deflated Sharpe (sección 9.2) es, si acaso, <em>más</em> conservador que lo necesario — no cambia la conclusión (que ya era
          un rechazo contundente), pero es una imprecisión del pre-registro que vale la pena anotar para un futuro experimento: la grilla
          debería garantizar que cada eje realmente varíe el resultado antes de contarlo como un intento independiente.
        </p>
      </Sec>

      {/* ---------------- 9 Inferencia ---------------- */}
      <Sec id="inferencia" n="9" titulo="Inferencia estadística">
        <h4>9.1 Comparación bootstrap pareada (Growth50 vs. benchmark) <Etiqueta tipo="pre" /></h4>
        <p>
          Block bootstrap pareado (bloques de 20 días, {ent(10000)} réplicas, semilla 0) sobre el locked test. Diferencia de CAGR
          (modelo − benchmark), IC 95 %: [{pct(cmp.ci_cagr_modelo[0], 1)}, {pct(cmp.ci_cagr_modelo[1], 1)}] — incluye el cero. Fracción de
          réplicas en que Growth50 supera al benchmark: <strong>{pct(cmp.frac_supera_benchmark, 1)}</strong> (se exigía ≥80 % para validar).
        </p>

        <h4>9.2 Deflated Sharpe Ratio: derivación paso a paso <Etiqueta tipo="pre" /> / <Etiqueta tipo="exp" /></h4>
        <p>
          Se calcula sobre el retorno de <strong>validación</strong> (2016–2019) de la variante ganadora, antes de aplicar el nivel de
          apetito (<em>n</em> = {ent(ds.n)} días), corrigiendo por los {ent(ds.n_trials)} intentos de la grilla.
        </p>
        <h4>Paso 1 — Sharpe diario</h4>
        <Eq>{`media = ${ds.mean_daily.toFixed(8)}     desv.est.(ddof=1) = ${ds.std_daily.toFixed(8)}
SR = media / desv.est. = ${ds.sr.toFixed(6)}      (anualizado: ${(ds.sr * Math.sqrt(252)).toFixed(4)})`}</Eq>
        <h4>Paso 2 — Momentos (los retornos no son normales)</h4>
        <Eq>{`asimetría γ3 = ${ds.skew.toFixed(5)}        curtosis γ4 = ${ds.kurtosis.toFixed(4)}      (normal: γ3=0, γ4=3)`}</Eq>
        <h4>Paso 3 — Varianza del estimador del Sharpe (Mertens, 2002)</h4>
        <Eq>{`Var(SR̂) = (1 − γ3·SR + (γ4−1)/4·SR²) / (n−1)
         = (${ds.term_one.toFixed(6)} + ${ds.term_skew.toFixed(6)} + ${ds.term_kurt.toFixed(6)}) / ${ent(ds.denominator)}
         = ${ds.numerator.toFixed(6)} / ${ent(ds.denominator)} = ${ds.variance_sr.toExponential(5)}
σ_SR = ${ds.sr_std.toFixed(6)}`}</Eq>
        <h4>Paso 4 — Sharpe máximo esperable por azar entre N = {ent(ds.n_trials)} intentos</h4>
        <Eq>{`z1 = Φ⁻¹(1 − 1/N) = ${ds.z1.toFixed(5)}      z2 = Φ⁻¹(1 − 1/(N·e)) = ${ds.z2.toFixed(5)}
máximo esperado = (1−γ)·z1 + γ·z2 = ${ds.part1.toFixed(5)} + ${ds.part2.toFixed(5)} = ${ds.expected_max_z.toFixed(5)}
SR0 = σ_SR × ${ds.expected_max_z.toFixed(5)} = ${ds.sr0.toFixed(6)}  (anualizado: ${ds.sr0_annualized.toFixed(4)})`}</Eq>
        <h4>Paso 5 — Estadístico y probabilidad</h4>
        <Eq>{`z = (SR − SR0) / σ_SR = (${ds.sr.toFixed(6)} − ${ds.sr0.toFixed(6)}) / ${ds.sr_std.toFixed(6)} = ${ds.z_stat.toFixed(4)}
DSR = Φ(z) = ${ds.dsr.toExponential(4)}`}</Eq>
        <p><strong>Resultado: DSR = {ds.dsr.toExponential(3)}.</strong> Prácticamente cero: no hay evidencia de que el Sharpe verdadero supere al mejor esperable por puro azar entre 17,280 intentos.</p>
        <Tabla densa cab={["N", "SR0 anualizado", "DSR"]} filas={ds.sensitivity_n_trials.map((x) => [
          ent(x.n_trials) + (x.n_trials === ds.n_trials ? " (pre-registrado)" : ""), num(x.sr0_annualized, 3), x.dsr.toExponential(3),
        ])} />
        <p className="exp-nota">Incluso sin corregir por selección (N=1) el Sharpe de validación no es alto; con N=17,280 la corrección lo hunde a prácticamente cero.</p>

        <h4>9.3 ¿Son 17,280 pruebas independientes? Número efectivo (muestra de {ent(tr.n_muestra)}) <Etiqueta tipo="exp" /></h4>
        <p>
          Calcular la correlación entre las 17,280 variantes exactas no es viable (matriz de 17,280²); se usa una muestra aleatoria de{" "}
          {ent(tr.n_muestra)} variantes (semilla 0). Correlación promedio entre pares: <strong>{num(tr.mean_pairwise_corr, 3)}</strong>;
          el primer autovalor explica el {pct(tr.top_eigenvalue_share, 1)} de la varianza. Número efectivo de intentos (razón de
          participación): <strong>N<sub>eff</sub> ≈ {num(tr.n_eff_participation, 1)}</strong>. La mayoría de las variantes comparten casi
          toda su exposición al mercado — la penalización pre-registrada (N=17,280) es, en ese sentido, muy conservadora, pero sigue sin
          cambiar la conclusión: el Sharpe de validación en sí no es alto.
        </p>

        <h4>9.4 El placebo pre-registrado no tiene poder estadístico <Etiqueta tipo="pre" /> / <Etiqueta tipo="exp" /></h4>
        <p>
          El pre-registro define el placebo como una rotación circular del retorno diario <em>ya realizado</em> de Growth50 en el locked
          test, comparando el CAGR real contra {ent(10000)} rotaciones. El resultado publicado: percentil {pct(r.percentil_vs_placebo, 1)}.
        </p>
        <p>
          <strong>Este test no tiene poder.</strong> El CAGR se calcula como <code>Π(1+retorno) ^ (365.25/días) − 1</code>: el producto es
          conmutativo, así que toda rotación circular del mismo conjunto de retornos da <em>exactamente</em> el mismo valor, salvo por el
          orden en que el punto flotante acumula el redondeo (~10<sup>-16</sup>). Reproducir el cálculo con una implementación
          matemáticamente idéntica (este apéndice) da un percentil distinto ({pct(plPre.percentil, 1)} aquí vs. {pct(plPre.percentil_publicado, 1)}
          publicado, diferencia máxima entre placebos y el valor real: {plPre.max_abs_diff_vs_real.toExponential(2)}): es ruido de redondeo, no una señal.
        </p>
        <h4>Un placebo mejor especificado, que terminó midiendo otra cosa <Etiqueta tipo="exp" /></h4>
        <p>
          Se intentó un placebo más riguroso: rotar circularmente la serie de régimen macro ({ent(plReg.n_placebo)} rotaciones, desfase
          uniforme), recalcular los pesos escalados por <em>k</em> con ese régimen rotado, y volver a simular con los precios y costos
          reales — igual que EXP-001 rotó su exposición, no su retorno ya realizado. Pero esta prueba también resultó sin poder, por una
          razón distinta y más interesante: como se documenta en la sección 8, el régimen <strong>nunca</strong> toma el valor de
          contracción en los datos reales, en ninguna fecha. Rotar una serie que vale "sin contracción" en el 100 % de sus puntos da,
          para cualquier desfase, exactamente la misma serie rotada: las {ent(plReg.n_placebo)} simulaciones placebo dieron el{" "}
          <strong>mismo CAGR, idéntico hasta el último dígito</strong>, que la corrida real ({pct(plReg.valor_real, 2)}). El percentil
          resultante (100 %) no es evidencia de que el momento de las señales importe: es la confirmación, por un camino distinto, de que
          el factor <em>k</em> nunca se activó.
        </p>
      </Sec>

      {/* ---------------- 10 Sensibilidad ---------------- */}
      <Sec id="sensibilidad" n="10" titulo="Sensibilidad y robustez">
        <p>
          <Etiqueta tipo="exp" /> Crecimiento geométrico en el periodo de validación (2016–2019, un mercado alcista fuerte para acciones
          de EE.UU.) de las {ent(r.n_variants)} variantes, agrupado por cada dimensión de la grilla. Referencia: benchmark 60/40 en
          validación = {pct(sens.benchmark_growth_val, 2)} anual. <strong>Ninguna de las {ent(r.n_variants)} variantes lo superó</strong>{" "}
          (columna "% supera benchmark" = 0% en todas las filas: se deja en la tabla precisamente porque esa uniformidad es el hallazgo).
          Como la fila de <em>k</em> confirma: 0.5 y 0.75 dan números idénticos (sección 8).
        </p>
        <Tabla densa cab={["Dimensión", "Valor", "n", "Crecimiento mediana [Q1–Q3]", "% supera benchmark"]} filas={[
          ["Todas", "—", sens.all.n, `${pct(sens.all.growth_median, 1)} [${pct(sens.all.growth_q25, 1)}–${pct(sens.all.growth_q75, 1)}]`, pct(sens.all.share_supera_benchmark, 0)],
          ...["L_meses", "W_dias", "B_dias", "V_dias", "construccion", "cash_politica", "leverage", "spread", "k"].flatMap((col) =>
            Object.entries(sens[col]).map(([val, g], i) => [i === 0 ? col : "", val, g.n, `${pct(g.growth_median, 1)} [${pct(g.growth_q25, 1)}–${pct(g.growth_q75, 1)}]`, pct(g.share_supera_benchmark, 0)])
          ),
        ]} />
        <p>
          Mejor variante en validación: <code>{sens.best_variant.id}</code> ({pct(sens.best_variant.growth_val, 1)}); peor:{" "}
          <code>{sens.worst_variant.id}</code> ({pct(sens.worst_variant.growth_val, 1)}).
        </p>

        <h4>10.1 Reality Check de White sobre las {ent(r.n_variants)} variantes <Etiqueta tipo="exp" /></h4>
        <p>
          Controlando por haber probado {ent(rc.n_variantes)} variantes (bootstrap de bloques del máximo, {ent(rc.n_boot)} réplicas):
          la mejor variante en validación (<code>{rc.mejor_variante}</code>) supera al benchmark por {pct(rc.observado_max_diff, 2)} de
          retorno medio diario; la probabilidad de que ese máximo se deba al azar de haber probado tantas variantes es{" "}
          <strong>p = {num(rc.p_value, 3)}</strong>.
        </p>

        <h4>10.2 Sensibilidad a costos de transacción (Growth50, locked test) <Etiqueta tipo="exp" /></h4>
        <Tabla densa cab={["Costo por lado", "CAGR", "Peor caída", "Calmar", "Sharpe"]} filas={[0, 10, 20, 30, 40, 50].map((bps) => {
          const m = ap.cost_sensitivity[String(bps)];
          return [`${bps} pb`, pct(m.cagr, 2), pct(m.max_drawdown, 1), num(m.calmar, 3), num(m.sharpe, 3)];
        })} />
      </Sec>

      {/* ---------------- 11 Lectura crítica ---------------- */}
      <Sec id="lectura" n="11" titulo="Lectura crítica de los resultados">
        <ol className="exp-lista">
          <li><strong>El resultado es un REJECTED limpio, no un empate:</strong> Growth50 solo supera al benchmark en {pct(cmp.frac_supera_benchmark, 1)} de las réplicas, muy lejos del 50% que ya hubiera bastado para no rechazar y mucho más lejos del 80% exigido para validar.</li>
          <li><strong>Más riesgo, peor resultado:</strong> en este periodo (2020–2026) los niveles con más apalancamiento rindieron sistemáticamente peor — el patrón contrario al que motivó el experimento.</li>
          <li><strong>El Sharpe de validación no es alto incluso sin corregir por selección</strong> (sección 9.2, N=1): el "éxito" en validation no era un pico sospechoso de un Sharpe altísimo corregido a la baja por la selección múltiple, sino un Sharpe modesto desde el principio.</li>
          <li><strong>No es un problema de la grilla ser muy chica:</strong> el Reality Check (sección 10.1) controla por las {ent(r.n_variants)} variantes probadas y sigue sin encontrar una ventaja significativa.</li>
          <li><strong>El placebo pre-registrado fue mal especificado</strong> (sección 9.4): no medía nada, por construcción matemática. El placebo corregido (rotar el régimen, no el retorno) sí mide algo, y da la misma conclusión: sin ventaja distinguible del azar.</li>
        </ol>
      </Sec>

      {/* ---------------- 12 Validez ---------------- */}
      <Sec id="validez" n="12" titulo="Amenazas a la validez y limitaciones">
        <Tabla cab={["Amenaza", "Estado / mitigación"]} filas={[
          ["Look-ahead en régimen macro", "Mitigado: series ALFRED point-in-time, reconstruidas con lo conocido a cada fecha de corte."],
          ["Look-ahead en ejecución", "Mitigado: pesos decididos en t, aplicados en t+1 (rezago interno del backtest)."],
          ["Múltiples comparaciones", `${ent(r.n_variants)} variantes; Deflated Sharpe y Reality Check corrigen por esto (sección 9–10). N efectivo (muestra) ≈ ${num(tr.n_eff_participation, 1)}: la corrección pre-registrada es conservadora, pero no cambia la conclusión.`],
          ["Placebo pre-registrado sin poder estadístico", "Documentado explícitamente (sección 9.4): el CAGR es invariante a la rotación circular de su propio retorno. El placebo alternativo (post-hoc) también resultó sin poder, por una razón distinta: el régimen nunca varía (sección 8)."],
          ["El factor k nunca se activó / grilla con un eje redundante", `Verificado directamente (sección 8): k=0.5 y k=0.75 dan resultados idénticos para las ${ent(r.n_variants)} variantes. No afecta la etiqueta (el rechazo no depende de k), pero sí la cuenta de "intentos independientes" usada en el Deflated Sharpe, que termina siendo conservadora.`],
          ["Costo de financiamiento del apalancamiento", "Modelado explícitamente (tasa de cash + spread), pero con un solo nivel de spread por variante seleccionada — no se sweepea spread en la sensibilidad de costos."],
          ["Datos de terceros", "yfinance y FRED/ALFRED no son 100% point-in-time para todo; las series ALFRED sí lo son para M2/balance Fed/índice líder. Archivos congelados por hash."],
          ["Régimen macro limitado", "Solo 3 series (M2, balance de la Fed, índice líder): un régimen más rico podría comportarse distinto, pero esa es una pregunta para un experimento nuevo, no una reinterpretación de este."],
          ["Universo sin acciones individuales", "Solo ETF/índices: sin sesgo de supervivencia, pero tampoco captura selección de activos individual."],
          ["Análisis exploratorio", "Las secciones marcadas EXPLORATORIO son post-hoc: describen, no prueban, y no cambian la etiqueta."],
        ]} />
      </Sec>

      {/* ---------------- 13 Siguiente ---------------- */}
      <Sec id="siguiente" n="13" titulo="Qué haría falta para validar (o explorar distinto)">
        <ul className="exp-lista">
          <li><strong>Régimen macro más rico:</strong> incorporar más series point-in-time (crédito, inflación, empleo) requeriría su propio pre-registro; no se puede probar sobre estos mismos datos sin invalidar la inferencia.</li>
          <li><strong>Separar "selección de señales" de "nivel de riesgo":</strong> este diseño elige una sola combinación de señales y luego varía apalancamiento; valdría la pena pre-registrar una selección independiente por nivel.</li>
          <li><strong>Más periodos fuera de muestra:</strong> el locked test cubre un solo régimen de mercado reciente (2020–2026, dominado por la respuesta a COVID y el ciclo de tasas); más historia o mercados internacionales añadirían episodios independientes.</li>
          <li><strong>Costo de financiamiento variable:</strong> pre-registrar un sweep de spread de financiamiento, no solo dos valores fijos por variante.</li>
        </ul>
      </Sec>

      {/* ---------------- 14 Repro ---------------- */}
      <Sec id="repro" n="14" titulo="Reproducibilidad y transparencia">
        <Eq>{`git clone ${REPO}
pip install -e ".[dev]"
python -m prl.data.build --verify
python scripts/run_exp002.py                 # corrida real (sin LLM)
python experiments/EXP-002-growth-max-global/appendix.py <inputs> <salida> <results.json>`}</Eq>
        <ul className="exp-lista">
          <li><a href={`${BLOB}/experiments/EXP-002-growth-max-global/PREREGISTRATION.md`}>Pre-registro (v1.5)</a> · <a href={`${BLOB}/experiments/EXP-002-growth-max-global/IMPLEMENTATION_SPEC.md`}>contrato de implementación</a> · <a href={`${BLOB}/METHODOLOGY.md`}>metodología</a></li>
          <li><a href={`${BLOB}/${RUN}/results.json`}>results.json</a> · <a href={`${BLOB}/experiments/EXP-002-growth-max-global/appendix.json`}>appendix.json</a> · <a href={`${BLOB}/experiments/EXP-002-growth-max-global/appendix.py`}>appendix.py</a> · <a href={`${BLOB}/src/prl/growth_max`}>código del modelo</a></li>
        </ul>
        <p>
          <strong>Uso de modelos de lenguaje.</strong> El código de los módulos (<code>prl.growth_max.*</code>, <code>prl.data.macro_vintage</code>)
          lo escribió DeepSeek dentro de un ciclo de pruebas (contrato y tests de Claude, revisión humana antes de integrar). La corrida real
          (<code>prl.growth_max.exp002.run</code>) es código determinístico: ningún LLM interviene al ejecutarse. El apéndice exploratorio
          (<code>appendix.py</code>) lo escribió Claude directamente (no vía el ciclo DeepSeek, por tratarse de análisis post-hoc que no
          afecta la etiqueta), verificando primero que reproduce exactamente los 5 niveles publicados en <code>results.json</code> antes de
          calcular nada nuevo. El texto de este reporte lo redactó Claude; cada cifra proviene de <code>results.json</code> o{" "}
          <code>appendix.json</code>. La etiqueta (<strong>{r.label}</strong>) la calcula código con criterios fijados antes de ver resultados.
        </p>
        <p className="exp-nota">Material de investigación y educativo. No es asesoría de inversión.</p>
      </Sec>
    </article>
  );
}
