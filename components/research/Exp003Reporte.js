import r from "@/lib/research/exp003-resultados.json";

/* Reporte técnico de EXP-003. A diferencia de EXP-001/EXP-002, este
   experimento no corre en el pipeline propio de pulso-research-lab
   (DeepSeek-TDD, data/manifest.json) — valida el motor de trading
   algorítmico de un repositorio distinto (algo_trading_platform).
   Toda cifra de este reporte sale de exp003-resultados.json, una
   transcripción fiel de los archivos reales de esa corrida (ver
   sección de Reproducibilidad para los commits y rutas exactas). */

const REPO_PRL = "https://github.com/jesusmariogonz/pulso-research-lab";
const REPO_ATP = "https://github.com/jesusmariogonz/algo_trading_platform";
const BLOB_PRL = `${REPO_PRL}/blob/main`;
const BLOB_ATP = `${REPO_ATP}/blob/main`;
const EXP_DIR_PRL = `${BLOB_PRL}/experiments/EXP-003-validacion-motor-produccion`;
const EXP_DIR_ATP = `${BLOB_ATP}/research/exp-003-validacion-motor-produccion`;

const pct = (v, d = 1) => (v == null ? "—" : `${v >= 0 ? "" : ""}${v.toFixed(d)}%`);
const num = (v, d = 2) => (v == null ? "—" : v.toFixed(d));

const BUCKET_NOMBRE = { largo_plazo: "Largo Plazo", mediano_plazo: "Mediano Plazo", riesgo_alto: "Riesgo Alto" };
const BUCKETS = ["largo_plazo", "mediano_plazo", "riesgo_alto"];

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
function Label({ v }) {
  const cls = { VALIDATED: "exp-ok", REJECTED: "exp-no", INCONCLUSIVE: "", AMBIGUO: "" }[v] || "";
  const color = v === "VALIDATED" ? "#16a34a" : v === "REJECTED" ? "#dc2626" : v === "AMBIGUO" ? "#7c3aed" : "#eab308";
  return <strong className={cls} style={{ color }}>{v}</strong>;
}

export default function Exp003Reporte() {
  const c1 = r.capa1_walkforward, c2 = r.capa2_supervivencia, c3 = r.capa3_dsr_pbo;
  const c4 = r.capa4_placebo, c5 = r.capa5_leave_one_group_out, c6 = r.capa6_perturbacion_parametros;
  const c7 = r.capa7_ejecucion, corr = r.correccion_2026_11_19;

  return (
    <article className="exp-reporte">
      <nav className="exp-toc" aria-label="Contenido del reporte">
        <strong>Contenido</strong>
        {[
          ["ficha", "Ficha técnica"], ["abstract", "1 · Resumen técnico"], ["alcance", "2 · Alcance y nota metodológica"],
          ["capas", "3 · Las 7 capas y su criterio"], ["resultados", "4 · Resultados por capa"],
          ["bug", "5 · El bug encontrado a mitad del experimento"], ["sintesis", "6 · Síntesis"],
          ["lectura", "7 · Lectura crítica"], ["validez", "8 · Amenazas a la validez"],
          ["capital", "9 · Qué significa esto para el capital"], ["repro", "10 · Reproducibilidad"],
        ].map(([id, t]) => <a key={id} href={`#${id}`}>{t}</a>)}
      </nav>

      {/* ---------------- Ficha ---------------- */}
      <section id="ficha" className="exp-sec">
        <h2>Ficha técnica</h2>
        <Tabla cab={["Campo", "Valor"]} filas={[
          ["Identificador / estado", <><strong>EXP-003</strong> · <span className="exp-badge exp-badge-mixto">MIXED</span> — no es una sola etiqueta, ver sección 6</>],
          ["Pregunta", "¿Tiene la configuración exacta de producción de cada uno de los 3 buckets del motor de trading una ventaja de rendimiento distinguible del azar, y esa ventaja resiste supuestos de ejecución realistas, perturbaciones de parámetros, concentración sectorial y el sesgo de elegir el universo con el diario de lo que ya ganó?"],
          ["Qué se valida", "La configuración EXACTA de producción de hoy de 3 buckets reales: largo_plazo (time_series_momentum), mediano_plazo (trend_following), riesgo_alto (momentum_breakout) — nunca una variante ni una mejora propuesta."],
          ["Repositorio de origen", <>sin este laboratorio — <a href={REPO_ATP}>algo_trading_platform</a>, directorio <code>{r.ruta_origen}</code></>],
          ["Pre-registro", <>bloqueado el {r.fecha_registro} con commit <code>{r.commit_inicio}</code>, antes de correr ninguna capa</>],
          ["Cierre", <>{r.fecha_cierre}, commit <code>{r.commit_fin}</code> · suite completa {r.n_tests_suite}/{r.n_tests_suite} tests, cero cambios de producción en todo el experimento</>],
          ["Código", "escrito directamente (no vía DeepSeek: ese repositorio no usa esa infraestructura), autoverificado contra resultados ya publicados antes de cada cómputo nuevo"],
        ]} />
      </section>

      {/* ---------------- 1 Abstract ---------------- */}
      <Sec id="abstract" n="1" titulo="Resumen técnico">
        <p>
          Se diseñaron 7 pruebas de robustez y habilidad real, independientes entre sí, cada una con su criterio
          VALIDATED/REJECTED/INCONCLUSIVE fijado antes de correr nada, aplicadas a los 3 buckets de producción del motor de
          trading algorítmico. Las dos pruebas construidas específicamente para distinguir una ventaja real de una racha de
          azar — el Deflated Sharpe Ratio corrigiendo por las {c3.n_catalogo} configuraciones ya exploradas en la historia
          documentada del proyecto, y un placebo de reordenamiento de bloques mensuales con potencia estadística verificada —
          rechazan a los 3 buckets. Las tres pruebas de robustez (sensibilidad a sector, a parámetros y a supuestos de
          ejecución) las pasan los 3: el resultado no depende de un sector concentrado, de un valor de parámetro exacto, ni de
          un supuesto de ejecución optimista.
        </p>
        <p>
          A mitad del experimento se encontró que el código de validación había estado probando, para <code>largo_plazo</code>,
          una versión de la estrategia distinta a la que realmente opera en producción (sección 5) — un bug propio, no un
          hallazgo sobre el motor. Se corrigió y se re-corrieron las capas afectadas antes de cerrar el experimento, dejando
          los números anteriores visibles con una nota de corrección, nunca borrados.
        </p>
        <p>
          <code>riesgo_alto</code> se lleva el hallazgo adicional más severo: su universo curado a mano (PLTR, SMCI, COIN,
          RIVN, SOFI…) rinde {pct(c2.resultado.riesgo_alto.curado_pct)} anual contra apenas {pct(c2.resultado.riesgo_alto.neutral_pct)}{" "}
          de una muestra neutral del S&P 500 corrida con la misma estrategia — confirmando con números, por primera vez, una
          advertencia de sesgo de supervivencia que el proyecto de origen había dejado abierta desde su fase inicial.
        </p>
      </Sec>

      {/* ---------------- 2 Alcance ---------------- */}
      <Sec id="alcance" n="2" titulo="Alcance y nota metodológica">
        <p>
          Este experimento no sigue el pipeline propio de este laboratorio (código escrito por DeepSeek dentro de un ciclo
          de pruebas, datos congelados con hash en <code>data/manifest.json</code>) — valida un sistema distinto, con su
          propio pipeline de datos (yfinance vía <code>src/data/download.py</code> de ese repositorio). Se cataloga aquí,
          con el mismo nivel de rigor y la misma disciplina de pre-registro, porque la pregunta de fondo es la misma que
          rige todo lo demás en este laboratorio: un hallazgo no cuenta como válido sin validación fuera de muestra, y un
          resultado negativo (o, como aquí, mixto) se documenta con el mismo detalle que uno positivo.
        </p>
        <p>
          Tampoco es un experimento de una sola hipótesis con una sola etiqueta, como EXP-001/EXP-002: son 3 estrategias
          independientes × 7 capas de validación independientes. El pre-registro fue explícito desde el inicio en que la
          síntesis final no sería "un promedio ni una votación de las 7 capas" — ver sección 6.
        </p>
      </Sec>

      {/* ---------------- 3 Las 7 capas ---------------- */}
      <Sec id="capas" n="3" titulo="Las 7 capas y su criterio (fijado antes de correr nada)">
        <Tabla cab={["#", "Capa", "Pregunta", "Criterio VALIDATED", "Criterio REJECTED"]} filas={[
          ["1", "Walk-forward rolling", "¿Es consistente a través del tiempo?", "≥4/5 ventanas con Sharpe OOS>0", "≤2/5 ventanas positivas"],
          ["2", "Sesgo de supervivencia", "¿Depende del universo elegido con hindsight?", "Diferencia de retorno ≤30% vs. universo neutral", "Diferencia >30%"],
          ["3", "DSR + PBO", "¿Es el mejor de muchos intentos por azar?", "DSR>0.95 y PBO<0.5", "DSR≤0.5"],
          ["4", "Placebo con potencia", "¿El orden real importó, o un orden al azar da lo mismo?", "Percentil≥95 con potencia confirmada", "Percentil<80 con potencia confirmada"],
          ["5", "Leave-one-group-out", "¿Depende de un sector concentrado?", "Ninguna caída >40% al quitar un grupo", "Alguna caída >40%"],
          ["6", "Perturbación de parámetros", "¿Es un pico aislado (sobreajuste)?", "Ninguna caída >50% dentro de ±15%", "Alguna caída >50% dentro de ±15%"],
          ["7", "Robustez de ejecución", "¿Sobrevive a fill tardío + 2x fricción?", "Sharpe>0 y retorno neto positivo", "Sharpe≤0 o retorno neto negativo"],
        ]} />
      </Sec>

      {/* ---------------- 4 Resultados ---------------- */}
      <Sec id="resultados" n="4" titulo="Resultados por capa">
        <Tabla densa cab={["Capa", ...BUCKETS.map((b) => BUCKET_NOMBRE[b])]} filas={[
          ["1 — Walk-forward", ...BUCKETS.map((b) => <Label v={c1.resultado[b].label} />)],
          ["2 — Supervivencia", ...BUCKETS.map((b) => <Label v={c2.resultado[b].label} />)],
          ["3 — DSR + PBO", <Label v="AMBIGUO" />, <Label v={c3.resultado.mediano_plazo.label} />, <Label v={c3.resultado.riesgo_alto.label} />],
          ["4 — Placebo", ...BUCKETS.map((b) => <Label v={c4.resultado[b].label} />)],
          ["5 — Leave-one-group-out", ...BUCKETS.map((b) => <Label v={c5.resultado[b].label} />)],
          ["6 — Parámetros", ...BUCKETS.map((b) => <Label v={c6.resultado[b].label} />)],
          ["7 — Ejecución", ...BUCKETS.map((b) => <Label v={c7.resultado[b].label} />)],
        ]} />

        <h4>4.1 Capa 1 — Walk-forward rolling</h4>
        <p>{c1.metodo}. <strong>Los 3 buckets: INCONCLUSIVE</strong> — {c1.resultado.largo_plazo.nota}; {c1.resultado.mediano_plazo.nota}.
          En <code>riesgo_alto</code>: {c1.resultado.riesgo_alto.nota} — ejemplo directo de por qué una muestra tan chica no distingue una
          ventaja real de una racha.</p>

        <h4>4.2 Capa 2 — Sesgo de supervivencia</h4>
        <p>{c2.metodo}.</p>
        <Tabla cab={["Bucket", "Universo curado", "Universo neutral", "Diferencia", "Label"]} filas={[
          ["mediano_plazo", `${pct(c2.resultado.mediano_plazo.curado_pct)} (${c2.resultado.mediano_plazo.n_curado} símbolos)`, `${pct(c2.resultado.mediano_plazo.neutral_pct)} (${c2.resultado.mediano_plazo.n_neutral} símbolos)`, pct(c2.resultado.mediano_plazo.diferencia_pct), <Label v="VALIDATED" />],
          ["riesgo_alto", `${pct(c2.resultado.riesgo_alto.curado_pct)} (${c2.resultado.riesgo_alto.n_curado} símbolos)`, `${pct(c2.resultado.riesgo_alto.neutral_pct)} (${c2.resultado.riesgo_alto.n_neutral} símbolos)`, pct(c2.resultado.riesgo_alto.diferencia_pct), <Label v="REJECTED" />],
          ["largo_plazo", "—", "—", "no aplica", <Label v="INCONCLUSIVE" />],
        ]} />
        <p>
          <code>riesgo_alto</code> confirma cuantitativamente una advertencia nunca resuelta del proyecto de origen: su universo
          incluye nombres elegidos porque ya se sabe que ganaron el rally de IA/growth 2023-2025. Nota honesta en la dirección
          opuesta: el universo neutral (S&P 500 large-cap) es estructuralmente más estable que el universo real de{" "}
          <code>riesgo_alto</code> (small/mid-cap de alta volatilidad) — la diferencia de {pct(c2.resultado.riesgo_alto.diferencia_pct)}{" "}
          es, si algo, un piso del sesgo real, no un techo. <code>largo_plazo</code> queda INCONCLUSIVE por diseño: es un
          universo de ETFs de clase de activo, no acciones elegidas a mano — el tipo de sesgo medido aquí no aplica igual.
        </p>

        <h4>4.3 Capa 3 — Deflated Sharpe Ratio + PBO sobre el espacio de búsqueda histórico</h4>
        <p>
          Catálogo auditable de <strong>{c3.n_catalogo} configuraciones materialmente distintas</strong> ya probadas en la
          historia documentada del proyecto (leyendo todos los registros de decisiones de ese repositorio). De esas,{" "}
          {c3.n_con_sharpe} tienen un Sharpe explícitamente reportado — usado para estimar la dispersión de Sharpe entre
          intentos (σ<sub>SR</sub> = {c3.sigma_sr}) con la fórmula de Bailey & López de Prado (misma derivación del appendix de
          EXP-002 de este laboratorio). Con {c3.n_catalogo} intentos y esa dispersión, el techo de Sharpe esperable por puro
          azar es ≈{num(c3.sharpe_techo_azar, 2)}.
        </p>
        <Tabla cab={["Bucket", "Sharpe usado", "DSR", "PBO", "Label"]} filas={[
          ["mediano_plazo", num(c3.resultado.mediano_plazo.sharpe), num(c3.resultado.mediano_plazo.dsr, 4), num(c3.resultado.mediano_plazo.pbo, 2), <Label v="REJECTED" />],
          ["riesgo_alto", num(c3.resultado.riesgo_alto.sharpe), num(c3.resultado.riesgo_alto.dsr, 4), num(c3.resultado.riesgo_alto.pbo, 2), <Label v="REJECTED" />],
          ["largo_plazo (sin filtro)", "0.78", "0.0000", "0.00", <Label v="REJECTED" />],
          ["largo_plazo (walk-forward OOS con filtro real)", "2.25", "1.0000", "0.00", <Label v="VALIDATED" />],
        ]} />
        <p>
          <strong><code>mediano_plazo</code> y <code>riesgo_alto</code> quedan REJECTED sin ambigüedad bajo cualquier
          lectura</strong>: con {c3.n_catalogo} intentos ya documentados, su Sharpe observado no se distingue de la mejor racha
          que ese volumen de búsqueda produciría sin ninguna habilidad real. <code>largo_plazo</code> queda{" "}
          <Label v="AMBIGUO" />: {c3.resultado.largo_plazo.nota}. El PBO solo cubre 3 de las {c3.n_catalogo} variantes del
          catálogo (las únicas con datos ventana-por-ventana re-simulables) — no contradice el DSR sobre el total.
        </p>

        <h4>4.4 Capa 4 — Placebo con potencia verificada</h4>
        <p>{c4.metodo}.</p>
        <Tabla cab={["Bucket", "Sharpe real", "Percentil dentro del placebo", "Potencia confirmada", "Label"]} filas={
          BUCKETS.map((b) => [BUCKET_NOMBRE[b], num(c4.resultado[b].sharpe_real), pct(c4.resultado[b].percentil), c4.resultado[b].potencia_confirmada ? "Sí" : "No", <Label v={c4.resultado[b].label} />])
        } />
        <p>
          <strong>Los 3 buckets caen prácticamente en la mediana de la distribución placebo</strong> — si los mismos
          movimientos reales de ~1 mes hubieran ocurrido en otro orden, la estrategia de producción no habría rendido distinto
          en promedio. Límite explícito de esta prueba: un bloque de 21 días destruye deliberadamente la persistencia de
          tendencia de varios meses que dos de las tres estrategias buscan explotar — un tamaño de bloque distinto podría dar
          un resultado distinto. Durante la corrección del 19 de noviembre se encontró y corrigió un bug propio en el primer
          cálculo del percentil (ver sección 5).
        </p>

        <h4>4.5 Capa 5 — Leave-one-group-out</h4>
        <Tabla cab={["Bucket", "Grupo con mayor caída", "Caída", "Label"]} filas={
          BUCKETS.map((b) => [BUCKET_NOMBRE[b], c5.resultado[b].grupo_peor, pct(c5.resultado[b].caida_pct), <Label v="VALIDATED" />])
        } />
        <p>Los 3 buckets: VALIDATED — ninguna caída cruza el umbral de 40%; varios grupos incluso mejoran el Sharpe al
          quitarse, indicando dilución, no dependencia concentrada en un clúster correlacionado.</p>

        <h4>4.6 Capa 6 — Superficie de perturbación de parámetros</h4>
        <Tabla cab={["Bucket", "Parámetro(s)", "Caída máxima dentro de ±10%", "Label"]} filas={
          BUCKETS.map((b) => [BUCKET_NOMBRE[b], c6.resultado[b].parametro, pct(c6.resultado[b].caida_max_10pct), <Label v="VALIDATED" />])
        } />
        <p>
          Los 3 buckets: VALIDATED, sin firma de pico aislado (sobreajuste). Hallazgo adicional que no cambia el label: en{" "}
          <code>largo_plazo</code> y <code>riesgo_alto</code>, el valor de parámetro de producción no está en el máximo local
          de la malla — documentado como observación, no usado para proponer un cambio (fuera del alcance pre-registrado de
          esta capa).
        </p>

        <h4>4.7 Capa 7 — Robustez a supuestos de ejecución</h4>
        <p>{c7.metodo}.</p>
        <Tabla cab={["Bucket", "Sharpe base → pesimista", "Retorno base → pesimista", "Label"]} filas={
          BUCKETS.map((b) => [BUCKET_NOMBRE[b], `${num(c7.resultado[b].sharpe_base)} → ${num(c7.resultado[b].sharpe_pesimista)}`, `+${pct(c7.resultado[b].retorno_base_pct)} → +${pct(c7.resultado[b].retorno_pesimista_pct)}`, <Label v="VALIDATED" />])
        } />
        <p>
          Los 3 buckets: VALIDATED — se degradan fuerte (Sharpe cae 50-80%) pero ninguno cruza a pérdida neta.{" "}
          <code>largo_plazo</code> es el caso más delgado (Sharpe cae ~80%) y el único que cambió de label durante la
          corrección — ver sección 5.
        </p>
      </Sec>

      {/* ---------------- 5 El bug ---------------- */}
      <Sec id="bug" n="5" titulo="El bug encontrado a mitad del experimento, y la corrección">
        <p>
          Al catalogar las {c3.n_catalogo} configuraciones de la Capa 3, se encontró que el código compartido de validación de
          las Capas 1, 4, 5, 6 y 7 nunca implementó un filtro de cross-sectional momentum que SÍ está activo en producción
          real para <code>largo_plazo</code> desde una decisión anterior de ese mismo repositorio — confirmado leyendo el
          código fuente actual del motor, tanto el simulado como el conectado a IBKR en vivo. Consecuencia: 5 de las 7 capas
          habían estado probando una versión vieja de la estrategia (Sharpe de periodo completo {corr.sharpe_full_period_sin_filtro}),
          no la real de producción (Sharpe {corr.sharpe_full_period_con_filtro_corregido} con el filtro aplicado correctamente).
          Afecta exclusivamente a <code>largo_plazo</code> — <code>mediano_plazo</code>/<code>riesgo_alto</code> no usan ese
          filtro, sus resultados en todas las capas son válidos tal cual.
        </p>
        <p>
          Se corrigió el código de validación y se re-corrieron las 5 capas afectadas solo para <code>largo_plazo</code>. El
          único cambio real de resultado: <strong>Capa 7, de REJECTED a VALIDATED</strong> — con el filtro correcto activo, el
          escenario pesimista de ejecución se queda positivo (antes: Sharpe 0.78→−0.09, retorno +45.96%→−9.28%; corregido:
          Sharpe {corr.sharpe_full_period_con_filtro_corregido}→{num(c7.resultado.largo_plazo.sharpe_pesimista)}, retorno +
          {pct(c7.resultado.largo_plazo.retorno_base_pct)}→+{pct(c7.resultado.largo_plazo.retorno_pesimista_pct)}). El hallazgo
          original de fragilidad de <code>largo_plazo</code> era un artefacto de probar la configuración equivocada, no un
          riesgo real de la configuración vigente. Las Capas 1, 5 y 6 no cambiaron de label; la Capa 4 tampoco cambió de label
          pero sí de número (percentil 27.67→48.33).
        </p>
        <p>
          De paso, durante esta misma corrección se encontró y corrigió un segundo bug, propio de esta validación: el primer
          cálculo del percentil de la Capa 4 usaba una fórmula (<code>np.mean([1 for s in sharpes if s &lt; real])</code>) que
          matemáticamente siempre da 1.0 — produjo un percentil falso de 100.0 (que habría dado VALIDATED) antes de
          corregirse y volver a correr las 300 réplicas completas. Ambos bugs, y la corrección completa con los números
          "antes" dejados visibles (nunca borrados), están documentados con el mismo nivel de detalle en el repositorio de
          origen — ver sección 10.
        </p>
      </Sec>

      {/* ---------------- 6 Síntesis ---------------- */}
      <Sec id="sintesis" n="6" titulo="Síntesis (no es un promedio ni una votación)">
        <p>
          El pre-registro fijó esto explícitamente desde el inicio: con 3 estrategias × 7 capas independientes, forzar un
          semáforo único promediaría preguntas que no son comparables entre sí. La lectura de fondo, sin forzar un veredicto:
        </p>
        <ul className="exp-lista">
          <li><strong>Las dos capas diseñadas específicamente para distinguir habilidad real de azar (3 y 4) rechazan a los 3
            buckets</strong> (con la ambigüedad sin resolver de <code>largo_plazo</code> en la Capa 3).</li>
          <li><strong>Las tres capas de robustez (5, 6, 7) las pasan los 3</strong> — el resultado no depende de un sector, un
            parámetro exacto, ni un supuesto de ejecución optimista.</li>
          <li><strong>La Capa 1 queda INCONCLUSIVE en los 3</strong> por pocas operaciones — la pregunta de consistencia
            temporal sigue abierta con los datos disponibles.</li>
          <li><strong><code>riesgo_alto</code> se agrava con un hallazgo adicional</strong>: sesgo de supervivencia material
            confirmado (Capa 2).</li>
        </ul>
        <p>
          <strong>No hay evidencia validada de que la configuración actual de producción tenga una ventaja real sobre el
          azar, en ninguno de los 3 buckets</strong> — y en <code>riesgo_alto</code> esto se agrava con el sesgo de
          supervivencia. Esto no equivale a "está probado que no vale nada" (la Capa 1 deja esa pregunta abierta). EXP-003 no
          busca ni propone una configuración alternativa — valida o rechaza únicamente la de hoy, por diseño del
          pre-registro.
        </p>
      </Sec>

      {/* ---------------- 7 Lectura crítica ---------------- */}
      <Sec id="lectura" n="7" titulo="Lectura crítica de los resultados">
        <ol className="exp-lista">
          <li><strong>Robustez y ventaja real son cosas distintas, y este experimento las separa con cuidado:</strong> un
            resultado puede no ser frágil (Capas 5/6/7) y, al mismo tiempo, no distinguirse de azar (Capas 3/4) — no es una
            contradicción, son preguntas distintas.</li>
          <li><strong>El propio proceso de validación tuvo un bug real, y se corrigió en público:</strong> el harness
            compartido no implementaba un filtro que sí está en producción, afectando 5 de 7 capas para un bucket. Se
            documentó con los números "antes" visibles, no se ocultó.</li>
          <li><strong>El DSR es la prueba más dura y la más consistente con el placebo:</strong> dos metodologías
            completamente distintas (corrección por intentos históricos vs. reordenamiento de bloques) señalan el mismo
            problema para <code>mediano_plazo</code>/<code>riesgo_alto</code>.</li>
          <li><strong><code>riesgo_alto</code> acumula la evidencia más desfavorable de los 3</strong>: DSR≈0, placebo en la
            mediana, y ahora sesgo de supervivencia confirmado — tres hallazgos independientes en la misma dirección.</li>
          <li><strong>El placebo de bloques de 21 días no es la última palabra</strong>: destruye a propósito la persistencia
            de tendencia de varios meses que dos de las tres estrategias buscan explotar. Un diseño de placebo distinto
            podría dar un resultado distinto — se documenta como límite explícito, no se presenta como prueba cerrada.</li>
        </ol>
      </Sec>

      {/* ---------------- 8 Validez ---------------- */}
      <Sec id="validez" n="8" titulo="Amenazas a la validez y limitaciones">
        <Tabla cab={["Amenaza", "Estado / mitigación"]} filas={[
          ["Bug de harness en largo_plazo (5 de 7 capas)", "Encontrado, corregido y re-corrido antes de cerrar el experimento — ver sección 5. Números anteriores dejados visibles con nota de corrección."],
          ["Capa 3 (DSR) nunca se re-corrió con el Sharpe corregido de largo_plazo", "Ambigüedad documentada explícitamente (sección 4.3), no resuelta ni oculta — queda como pregunta abierta."],
          ["Potencia del placebo depende del tamaño de bloque elegido (21 días)", "Verificada empíricamente (varianza entre réplicas no-trivial en los 3 buckets), pero un bloque de tamaño distinto podría dar otro resultado — documentado como límite, no como prueba cerrada."],
          ["Sesgo de supervivencia medido solo parcialmente", "El universo neutral (S&P 500 actual) elimina la selección manual con hindsight, pero no la supervivencia completa (empresas que salieron del índice no aparecen en ningún lado) — declarado explícitamente como un piso, no un techo."],
          ["PBO cubre solo 3 de 47 variantes del catálogo de la Capa 3", "Las únicas con datos ventana-por-ventana re-simulables disponibles — no contradice el DSR sobre el total, declarado explícitamente."],
          ["Sin infraestructura DeepSeek-TDD ni data/manifest.json de este laboratorio", "El código vive en un repositorio con su propio estándar (autoverificación contra resultados publicados antes de cada cómputo nuevo) — distinto, no ausente, declarado en la sección 2."],
          ["No busca ni propone una configuración mejor", "Decisión de diseño explícita del pre-registro: validar o rechazar la configuración de hoy, nunca buscar una alternativa — buscar más entre configuraciones es exactamente el riesgo que mide la Capa 3."],
        ]} />
      </Sec>

      {/* ---------------- 9 Capital ---------------- */}
      <Sec id="capital" n="9" titulo="Qué significa esto para el capital">
        <p>
          El motor en vivo corre contra la cuenta paper (simulada) de IBKR, como paso previo antes de comprometer capital
          real. Con este resultado: no se gradúa esta configuración a capital real todavía, y no se le asigna más capital
          simulado del que ya tiene — las dos pruebas diseñadas para medir ventaja real, no solo robustez, no encontraron
          evidencia de que la valide. El motor sigue corriendo como generador de datos (la Capa 1 quedó INCONCLUSIVE
          precisamente por pocas operaciones; más tiempo, no más búsqueda sobre lo mismo, es lo único que puede resolver esa
          ambigüedad). Una canasta de comparación simple, diversificada y sin pretensión de ventaja activa (documentada en el
          mismo repositorio de origen) corre en paralelo desde el 16 de noviembre de 2026 como punto de referencia de más bajo
          riesgo.
        </p>
      </Sec>

      {/* ---------------- 10 Repro ---------------- */}
      <Sec id="repro" n="10" titulo="Reproducibilidad y transparencia">
        <ul className="exp-lista">
          <li><a href={`${EXP_DIR_PRL}/PREREGISTRATION.md`}>Pre-registro</a> · <a href={`${EXP_DIR_PRL}/RESULTADOS.md`}>resultados completos de las 7 capas</a> · <a href={`${EXP_DIR_PRL}/LOG.md`}>bitácora cronológica</a> (en este laboratorio)</li>
          <li>Código y datos de cada capa, versionados desde el día 1 (nunca gitignored): <a href={EXP_DIR_ATP}>{r.ruta_origen}</a> en <a href={REPO_ATP}>algo_trading_platform</a></li>
          <li>Commits de referencia en <code>main</code> de ese repositorio: <code>{r.commit_inicio}</code> (pre-registro) .. <code>{r.commit_fin}</code> (síntesis final)</li>
        </ul>
        <p>
          <strong>Uso de modelos de lenguaje.</strong> El código de cada capa lo escribió Claude directamente (ese
          repositorio no usa el ciclo DeepSeek-TDD de este laboratorio), autoverificando cada corrida contra resultados ya
          publicados antes de confiar en cualquier cálculo nuevo — mismo estándar que el appendix de EXP-002 de este
          laboratorio. El texto de este reporte lo redactó Claude; cada cifra proviene de la transcripción fiel de los
          archivos de resultado reales de esa corrida (<code>exp003-resultados.json</code>). La etiqueta de cada capa la
          calculó código con el criterio fijado en el pre-registro, nunca un LLM.
        </p>
        <p className="exp-nota">Material de investigación y educativo. No es asesoría de inversión.</p>
      </Sec>
    </article>
  );
}
