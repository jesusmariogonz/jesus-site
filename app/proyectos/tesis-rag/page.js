import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { absUrl } from "@/lib/site";

/* Reporte técnico del proyecto "Persistencia no gobernada en sistemas RAG".
   Toda cifra sale de tesis-rag/experimento-{1,2}/ (resumen_estadistico.json,
   verificacion_calidad.json y resultados_crudos.jsonl); aquí solo se les da
   formato. El texto replica la estructura del reporte de EXP-002: ficha,
   hipótesis pre-especificadas, diseño, resultados, inferencia, análisis
   exploratorio etiquetado como post-hoc, amenazas a la validez y
   reproducibilidad. */

export const metadata = {
  title: "Persistencia no gobernada en sistemas RAG — reporte técnico",
  description:
    "Dos experimentos pareados sobre un RAG empresarial controlado: fuga de información restringida con y sin filtro por nivel de acceso (H1) y resurrección de datos eliminados con y sin cascada de redacción (H2). Hipótesis, criterio de falsabilidad, estadística exacta, análisis exploratorio, amenazas a la validez y código reproducible.",
  alternates: { canonical: "/proyectos/tesis-rag" },
  openGraph: {
    type: "article",
    url: absUrl("/proyectos/tesis-rag"),
    title: "Persistencia no gobernada en sistemas RAG — reporte técnico",
  },
};

const REPO = "https://github.com/jesusmariogonz/jesus-site";
const BLOB = `${REPO}/blob/main/tesis-rag`;
const raiz = path.join(process.cwd(), "tesis-rag");
const leerJson = (...p) => JSON.parse(fs.readFileSync(path.join(raiz, ...p), "utf8"));
const leerJsonl = (...p) =>
  fs.readFileSync(path.join(raiz, ...p), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));

const pct = (v, d = 1) => (v == null ? "—" : `${(v * 100).toFixed(d)}%`);
const ic = (a) => `[${pct(a[0])}, ${pct(a[1])}]`;
const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
const exp = (v) => {
  const [m, e] = v.toExponential(2).split("e");
  const n = parseInt(e, 10);
  return `${m} × 10${n < 0 ? "⁻" : ""}${String(Math.abs(n)).split("").map((d) => SUP[d]).join("")}`;
};

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
  const txt = tipo === "pre" ? "ESPECIFICADO ANTES DE LOS DATOS" : "EXPLORATORIO · post-hoc";
  return <span className={`exp-etq exp-etq-${tipo === "pre" ? "pre" : "exp"}`}>{txt}</span>;
}

function datos() {
  const e1 = leerJson("experimento-1", "resumen_estadistico.json");
  const e2 = leerJson("experimento-2", "resumen_estadistico.json");
  const ver = leerJson("experimento-2", "verificacion_calidad.json");
  const f1 = leerJsonl("experimento-1", "resultados_crudos.jsonl");
  const f2 = leerJsonl("experimento-2", "resultados_crudos.jsonl");

  const b1 = f1.filter((r) => r.tipo === "b");
  const porDoc = {};
  for (const r of b1) {
    const k = r.doc_fuente;
    porDoc[k] ??= { nivel: r.nivel_doc_fuente, n: 0, a: 0, b: 0 };
    porDoc[k].n += 1; porDoc[k].a += r.fuga_a ? 1 : 0; porDoc[k].b += r.fuga_b ? 1 : 0;
  }
  const porRol = {};
  for (const r of b1) {
    porRol[r.rol] ??= { n: 0, a: 0, b: 0 };
    porRol[r.rol].n += 1; porRol[r.rol].a += r.fuga_a ? 1 : 0; porRol[r.rol].b += r.fuga_b ? 1 : 0;
  }
  const fuenteRecA = b1.filter((r) => r.docs_recuperados_a.includes(r.doc_fuente)).length;
  const fuenteRecB = b1.filter((r) => r.docs_recuperados_b.includes(r.doc_fuente)).length;
  const residuales = b1.filter((r) => r.fuga_b);

  const b2 = f2.filter((r) => r.tipo === "b");
  const porHecho = {};
  for (const r of b2) {
    porHecho[r.hecho_id] ??= { n: 0, a: 0, b: 0 };
    porHecho[r.hecho_id].n += 1;
    porHecho[r.hecho_id].a += r.juicio_a.resurreccion ? 1 : 0;
    porHecho[r.hecho_id].b += r.juicio_b.resurreccion ? 1 : 0;
  }
  const calidad2 = f2.filter((r) => r.tipo === "a").map((r) => ({ id: r.hecho_id, juez: r.juicio_b.calidad }));
  return { e1, e2, ver, b1, porDoc, porRol, fuenteRecA, fuenteRecB, residuales, porHecho, calidad2, n1: f1.length };
}

const NOMBRE_HECHO = {
  reestructura: "Reestructura organizacional",
  retencion_talento: "Retención de talento",
  investigacion_conducta: "Investigación de conducta",
  presupuesto_migracion_ia: "Partida de migración de IA",
};

export default function TesisRagProyecto() {
  const { e1, e2, ver, porDoc, porRol, fuenteRecA, fuenteRecB, residuales, porHecho, calidad2, n1 } = datos();
  const t = e1.tabla_pareada;
  const reduccion1 = e1.tasa_fuga_a - e1.tasa_fuga_b;
  const reduccion2 = e2.resurreccion_condicion_a.tasa - e2.resurreccion_condicion_b.tasa;
  const mc2 = e2.mcnemar_exacto;

  return (
    <section className="section pc-page">
      <div className="container prose-container">
        <Link href="/proyectos" className="lib-back">← Proyectos</Link>

        <span className="lib-hero-eyebrow" style={{ marginTop: 20 }}>
          Proyecto independiente · reproducible · tesis en 10 entregas
        </span>
        <h1 style={{ margin: "14px 0 10px" }}>Persistencia no gobernada en sistemas RAG</h1>
        <p className="pmap-intro" style={{ marginBottom: 8 }}>
          ¿Cuánta información restringida filtra un RAG empresarial a quien no está autorizado, y cuánto de
          un dato "eliminado" sigue siendo recuperable? Dos experimentos pareados, con hipótesis y criterio
          de falsabilidad fijados antes de los datos, estadística exacta y todo el código y las respuestas
          crudas versionados.
        </p>
        <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", lineHeight: 1.6 }}>
          Igual que los otros proyectos independientes de esta página, éste no parte de ningún cliente: el
          corpus es ficticio (la empresa EIA Corp del libro <em>AI Solution Architect</em>), declarado como
          tal. La serie completa se publicó semana a semana en el{" "}
          <Link href="/tesis-rag">hub de la tesis</Link>; esta página es el reporte técnico consolidado. El
          texto largo, con marco teórico y referencias, está en la{" "}
          <a href="/tesis-rag/tesis-completa.md">tesis completa</a>.
        </p>

        <div className="article-highlights article-highlights--top" style={{ marginTop: 32 }}>
          <span className="article-highlights-titulo">En una mirada</span>
          <div className="highlights-grid">
            <div className="highlight-item">
              <span className="highlight-valor">{pct(e1.tasa_fuga_a)} → {pct(e1.tasa_fuga_b)}</span>
              <span className="highlight-etiqueta">H1 · fuga de información restringida, sin y con filtro por nivel de acceso</span>
              <span className="highlight-meta">McNemar exacto p = {exp(e1.mcnemar_p_value)} · n = {e1.n_tipo_b} pares</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">{pct(e2.resurreccion_condicion_a.tasa)} → {pct(e2.resurreccion_condicion_b.tasa)}</span>
              <span className="highlight-etiqueta">H2 · resurrección del dato eliminado, con borrado simple y con cascada</span>
              <span className="highlight-meta">McNemar exacto p = {mc2.p_valor.toFixed(5)} · n = {e2.n_trials_tipo_b} pares</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">{fuenteRecB} de {e1.n_tipo_b}</span>
              <span className="highlight-etiqueta">veces que el documento restringido llegó al contexto del modelo con el filtro (frente a {fuenteRecA} de {e1.n_tipo_b} sin él)</span>
              <span className="highlight-meta">hallazgo exploratorio, sección 9</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">1 de 3 vías</span>
              <span className="highlight-etiqueta">de persistencia planteadas en H2 que se evaluaron (documentos derivados)</span>
              <span className="highlight-meta">caché semántico y contexto de conversación: sin medir</span>
            </div>
          </div>
        </div>

        <article className="exp-reporte">
          <nav className="exp-toc" aria-label="Contenido del reporte">
            <strong>Contenido</strong>
            {[
              ["ficha", "Ficha técnica"], ["abstract", "1 · Resumen técnico"], ["diseno", "2 · Hipótesis y diseño"],
              ["datos", "3 · Datos y roles"], ["metodo", "4 · Pipeline y condiciones"], ["medicion", "5 · Medición"],
              ["res1", "6 · Resultados H1"], ["res2", "7 · Resultados H2"], ["inferencia", "8 · Inferencia estadística"],
              ["exploratorio", "9 · Análisis exploratorio"], ["lectura", "10 · Lectura crítica"],
              ["validez", "11 · Amenazas a la validez"], ["siguiente", "12 · Qué falta"],
              ["repro", "13 · Reproducibilidad"], ["correcciones", "14 · Correcciones registradas"],
            ].map(([id, tt]) => <a key={id} href={`#${id}`}>{tt}</a>)}
          </nav>

          {/* ---------- Ficha ---------- */}
          <section id="ficha" className="exp-sec">
            <h2>Ficha técnica</h2>
            <Tabla cab={["Campo", "Valor"]} filas={[
              ["Estado", <><span className="exp-badge exp-badge-inconcluso">H1 y H2 NO REFUTADAS</span> · H2 evaluada en 1 de 3 vías · muestras pequeñas</>],
              ["Pregunta", "¿En qué medida un pipeline RAG preserva información fuera de los límites de gobernanza definidos (falta de autorización o solicitud de eliminación), y qué controles cierran esa fuga sin destruir la utilidad del sistema?"],
              ["Hipótesis", "H1: el filtro por nivel de acceso previo al ranking reduce significativamente la fuga. H2: la redacción en cascada de documentos derivados reduce significativamente la resurrección de un dato eliminado."],
              ["Criterio de falsabilidad", "Publicado el 27 de septiembre de 2026 (Semana 2), antes de ejecutar ningún experimento. No es un registro externo (p. ej. OSF): es un compromiso público y fechado."],
              ["Diseño", "Pareado: cada pregunta (H1) o hecho (H2) se evalúa en la Condición A (sin control) y en la B (con control)."],
              ["Pruebas", "McNemar exacto (pares discordantes); IC 95% de Wilson por tasa; diferencia absoluta de proporciones como tamaño de efecto."],
              ["Modelo", <><code>claude-haiku-4-5-20251001</code>, tanto para responder como para juzgar</>],
              ["Corpus", <>18 documentos base ficticios (4 niveles de acceso) + 4 documentos derivados, en <code>tesis-rag/corpus/</code></>],
              ["Trials", `H1: ${n1} (${e1.n_tipo_b} de acceso no autorizado + ${e1.n_tipo_a} de acceso legítimo) · H2: 16 (${e2.n_trials_tipo_b} de resurrección + 4 de calidad)`],
              ["Recuperador", "TF-IDF con bigramas (scikit-learn), top-k fijo; sin reranking"],
              ["Fechas", "Experimento 1 ejecutado el 4 de octubre de 2026 · Experimento 2 el 26 de octubre de 2026"],
            ]} />
          </section>

          {/* ---------- 1 Abstract ---------- */}
          <Sec id="abstract" n="1" titulo="Resumen técnico">
            <p>
              Se construye un RAG mínimo sobre un corpus de 18 documentos clasificados en cuatro niveles de
              acceso y se somete a {e1.n_tipo_b} preguntas formuladas por roles sin autorización para el documento
              que contiene la respuesta. Con retrieval sobre todo el corpus (Condición A), {e1.fuga_a} de {e1.n_tipo_b}
              respuestas ({pct(e1.tasa_fuga_a)}, IC 95% {ic(e1.ci95_fuga_a)}) revelaron información restringida. Con un
              filtro por nivel de acceso aplicado antes del ranking (Condición B), {e1.fuga_b} de {e1.n_tipo_b}{" "}
              ({pct(e1.tasa_fuga_b)}, IC 95% {ic(e1.ci95_fuga_b)}). La tabla pareada ({t.solo_a_fuga} pares a favor del
              control, {t.solo_b_fuga} en contra) da McNemar exacto p = {exp(e1.mcnemar_p_value)}. En {e1.n_tipo_a} preguntas
              de acceso legítimo, la calidad fue {e1.calidad_a_correcta} de {e1.n_tipo_a} correctas sin filtro y{" "}
              {e1.calidad_b_correcta} de {e1.n_tipo_a} con él.
            </p>
            <p>
              El Experimento 2 mide si un dato "eliminado" sigue recuperable a través de documentos derivados que
              lo citaban. Con borrado simple del documento base, el dato resucitó en {e2.resurreccion_condicion_a.n_exitos} de{" "}
              {e2.n_trials_tipo_b} trials ({pct(e2.resurreccion_condicion_a.tasa)}, IC 95% {ic(e2.resurreccion_condicion_a.ic95)});
              con borrado más redacción en cascada del párrafo derivado, en {e2.resurreccion_condicion_b.n_exitos} de {e2.n_trials_tipo_b}{" "}
              (IC 95% {ic(e2.resurreccion_condicion_b.ic95)}). McNemar exacto p = {mc2.p_valor.toFixed(5)} ({mc2.discordantes_b} pares
              a favor de la cascada, {mc2.discordantes_c} en contra).
            </p>
            <p>
              Ninguna hipótesis fue refutada bajo el criterio fijado de antemano. El alcance medido es más
              estrecho que la pregunta: no se implementaron un caché semántico ni una memoria de largo plazo, y
              H2 se evaluó solo en la vía de documentos derivados. Un análisis exploratorio posterior (sección 9)
              encontró que, con el filtro activo, el documento restringido <strong>nunca</strong> llegó al contexto
              del modelo ({fuenteRecB} de {e1.n_tipo_b}): las {residuales.length} "fugas" residuales son respuestas que
              revelan metadatos de acceso, no el contenido del documento. Las muestras son pequeñas, el corpus es
              sintético y el juez y el modelo evaluado son el mismo.
            </p>
          </Sec>

          {/* ---------- 2 Diseño ---------- */}
          <Sec id="diseno" n="2" titulo="Hipótesis y diseño">
            <p><Etiqueta tipo="pre" /> Hipótesis y criterio se publicaron en la Semana 2, antes de correr los experimentos.</p>
            <ul className="exp-lista">
              <li><strong>H0 (H1):</strong> el filtro por nivel de acceso no cambia la tasa de fuga frente al retrieval sin filtro.</li>
              <li><strong>H1:</strong> un RAG sin metadatos de acceso filtra información restringida a una tasa medible; el filtro la reduce de forma significativa, a un costo de calidad aceptable.</li>
              <li><strong>H0 (H2):</strong> la cascada no cambia la tasa de resurrección frente al borrado simple.</li>
              <li><strong>H2:</strong> tras un borrado oficial, el dato sigue recuperable por una vía indirecta a una tasa medible; la cascada la reduce de forma significativa.</li>
            </ul>
            <p><strong>Criterio de refutación</strong> (fijado antes de los datos):</p>
            <Eq>{`H1 refutada  si  McNemar(A vs B) con p >= 0.05
             o  el filtro reduce la fuga a un costo de calidad que lo vuelva impracticable
H2 refutada  si  la cascada no reduce la resurrección de forma significativa
                 por ninguna de las vías evaluadas (el criterio listaba caché semántico
                 y contexto de conversación)
             o  la tasa de resurrección en la Condición A es indistinguible de cero`}</Eq>
            <p>
              La serie se comprometió a reportar una refutación con el mismo detalle que una confirmación. Nótese que
              el criterio de H2 nombraba tres vías y el experimento cubrió una: ver secciones 11 y 12.
            </p>
          </Sec>

          {/* ---------- 3 Datos ---------- */}
          <Sec id="datos" n="3" titulo="Datos y roles">
            <p>
              Los documentos se escribieron para el experimento, con cifras, plazos y decisiones específicas, de modo que
              una respuesta pueda distinguirse inequívocamente como reveladora o no. Son ficticios y declarados como tales.
            </p>
            <Tabla cab={["Nivel", "Documentos", "Ejemplos"]} filas={[
              ["Público", "7", "política de vacaciones, código de conducta, manual de marca"],
              ["Interno", "3", "manual de onboarding, clasificación de datos, protocolo de incidentes"],
              ["Confidencial", "5", "matriz de compensación, presupuesto de TI, plan de retención, roadmap del asistente"],
              ["Restringido", "3", "plan de reestructura, contrato con proveedor cloud, investigación de conducta"],
            ]} />
            <Tabla cab={["Rol", "Niveles autorizados"]} filas={[
              ["Becario", "Público, Interno"],
              ["Gerente", "Público, Interno, Confidencial"],
              ["Director", "Público, Interno, Confidencial, Restringido"],
            ]} />
            <p>
              <strong>Experimento 1.</strong> {n1} preguntas: {e1.n_tipo_a} de tipo (a), acceso legítimo (una por documento, con el rol de
              menor jerarquía autorizado), y {e1.n_tipo_b} de tipo (b), acceso no autorizado (3 a 4 variantes por cada uno de los 8
              documentos confidenciales o restringidos, con cada rol sin acceso). El mínimo de n ≥ 40 para tipo (b) se fijó en la metodología.
            </p>
            <p>
              <strong>Experimento 2.</strong> 4 hechos objetivo, cada uno documentado en un documento base y citado de forma indirecta en un
              documento derivado (minuta de comité, reporte de RH, reporte de ética, resumen de finanzas). Cada derivado tiene dos párrafos
              independientes: el que repite el hecho objetivo y otro sobre un hecho distinto (el "hecho seguro"). 16 trials: 12 de resurrección
              (3 paráfrasis por hecho) y 4 de calidad (una pregunta por hecho seguro).
            </p>
          </Sec>

          {/* ---------- 4 Pipeline ---------- */}
          <Sec id="metodo" n="4" titulo="Pipeline y condiciones">
            <Eq>{`pregunta -> retrieve(corpus_visible, k) -> contexto -> LLM (claude-haiku-4-5) -> respuesta -> juez`}</Eq>
            <Tabla cab={["", "Condición A", "Condición B"]} filas={[
              ["H1", "retrieval sobre todo el corpus, sin considerar el rol", "candidatos filtrados a los niveles autorizados del rol, antes del ranking"],
              ["H2", "se borra solo el documento base", "se borra el documento base y se redacta, en cada derivado, exactamente el párrafo que repetía el hecho (marcador de contenido eliminado)"],
            ]} />
            <p>
              El sistema de respuesta recibe la instrucción de responder solo con el contexto recuperado y de decir explícitamente si el contexto
              no contiene la información. Mismo recuperador, mismo modelo y mismo juez en ambas condiciones: lo único que cambia es el control.
            </p>
          </Sec>

          {/* ---------- 5 Medición ---------- */}
          <Sec id="medicion" n="5" titulo="Medición">
            <ul className="exp-lista">
              <li><strong>Fuga (H1).</strong> Una respuesta cuenta si revela, total o parcialmente, información que solo aparece en el documento restringido correspondiente. La decide un juez LLM que recibe el documento, la pregunta y la respuesta y devuelve un veredicto en JSON.</li>
              <li><strong>Resurrección (H2).</strong> Una respuesta cuenta si el hecho eliminado es sustantivamente recuperable de ella, sin importar que la redacción coincida. Misma mecánica de juez.</li>
              <li><strong>Calidad.</strong> Correcta, parcial o incorrecta/rechazada, según un juez LLM; en H2, además, una <strong>verificación determinista</strong> (sin LLM) de que la respuesta contiene el dato literal del párrafo no tocado.</li>
            </ul>
            <p>
              <strong>Limitación central:</strong> el juez es el mismo modelo que responde y su precisión no se validó contra una muestra anotada
              manualmente. Todas las tasas son, por tanto, tasas según el juez.
            </p>
          </Sec>

          {/* ---------- 6 Resultados H1 ---------- */}
          <Sec id="res1" n="6" titulo="Resultados del Experimento 1 (H1)">
            <Tabla cab={["Condición", "Fuga", "Tasa", "IC 95% (Wilson)"]} filas={[
              ["A · sin filtro", `${e1.fuga_a} de ${e1.n_tipo_b}`, pct(e1.tasa_fuga_a), ic(e1.ci95_fuga_a)],
              ["B · con filtro", `${e1.fuga_b} de ${e1.n_tipo_b}`, pct(e1.tasa_fuga_b), ic(e1.ci95_fuga_b)],
            ]} />
            <p>
              Los intervalos no se solapan: el límite superior de B ({pct(e1.ci95_fuga_b[1])}) queda por debajo del inferior de A ({pct(e1.ci95_fuga_a[0])}).
              Reducción absoluta: <strong>{(reduccion1 * 100).toFixed(1)} pp</strong>.
            </p>
            <h4>Tabla pareada (n = {e1.n_tipo_b})</h4>
            <Tabla cab={["", "Fuga en B", "Sin fuga en B"]} filas={[
              ["Fuga en A", t.ambos_fuga, t.solo_a_fuga],
              ["Sin fuga en A", t.solo_b_fuga, t.ninguno],
            ]} />
            <h4>Calidad en acceso legítimo (n = {e1.n_tipo_a})</h4>
            <Tabla cab={["Condición", "Correctas", "Tasa", "IC 95% (Wilson)"]} filas={[
              ["A · sin filtro", `${e1.calidad_a_correcta} de ${e1.n_tipo_a}`, pct(e1.calidad_a_correcta / e1.n_tipo_a), ic(e1.ci95_calidad_a)],
              ["B · con filtro", `${e1.calidad_b_correcta} de ${e1.n_tipo_a}`, pct(e1.calidad_b_correcta / e1.n_tipo_a), ic(e1.ci95_calidad_b)],
            ]} />
            <p>
              Las dos preguntas incorrectas o rechazadas lo fueron en ambas condiciones por causas ajenas al filtro (un falso rechazo a un
              director autorizado y un problema de fundamentación). Que B tenga más respuestas correctas que A no se interpreta como mejora:
              la diferencia es de 2 preguntas, dentro de la variabilidad de generación del modelo.
            </p>
          </Sec>

          {/* ---------- 7 Resultados H2 ---------- */}
          <Sec id="res2" n="7" titulo="Resultados del Experimento 2 (H2)">
            <Tabla cab={["Condición", "Resurrección", "Tasa", "IC 95% (Wilson)"]} filas={[
              ["A · borrado simple", `${e2.resurreccion_condicion_a.n_exitos} de ${e2.n_trials_tipo_b}`, pct(e2.resurreccion_condicion_a.tasa), ic(e2.resurreccion_condicion_a.ic95)],
              ["B · borrado + cascada", `${e2.resurreccion_condicion_b.n_exitos} de ${e2.n_trials_tipo_b}`, pct(e2.resurreccion_condicion_b.tasa), ic(e2.resurreccion_condicion_b.ic95)],
            ]} />
            <p>
              Reducción absoluta: <strong>{(reduccion2 * 100).toFixed(1)} pp</strong>. La tasa observada en B es cero, pero con 12 trials el límite
              superior del intervalo es {pct(e2.resurreccion_condicion_b.ic95[1])}: no puede descartarse una tasa cercana a una cuarta parte.
            </p>
            <h4>Por hecho objetivo (3 paráfrasis cada uno)</h4>
            <Tabla cab={["Hecho objetivo", "Resurrección en A", "Resurrección en B"]} filas={Object.entries(porHecho).map(([k, v]) => [
              NOMBRE_HECHO[k] || k, `${v.a} de ${v.n}`, `${v.b} de ${v.n}`,
            ])} />
            <p>
              El par sin resurrección en A corresponde a una pregunta (qué área debe confirmar un cronograma) cuya respuesta correcta no contiene la
              cifra del hecho objetivo, de modo que no cuenta como evidencia a favor de la cascada.
            </p>
            <h4>Costo de la cascada sobre el contenido legítimo (n = 4)</h4>
            <Tabla cab={["Hecho seguro del derivado", "Juez LLM", "Dato literal en la respuesta"]} filas={calidad2.map((c) => {
              const v = ver.detalle.find((d) => d.hecho_id === c.id);
              return [NOMBRE_HECHO[c.id] || c.id, c.juez.replaceAll("_", " "), v?.dato_en_respuesta_b ? `sí (“${v.dato_esperado}”)` : "no"];
            })} />
            <p>
              El juez dio {e2.calidad_hecho_seguro_condicion_b.correctas} de {e2.calidad_hecho_seguro_condicion_b.sobre} como correctas; la
              verificación literal, {ver.con_dato_correcto} de {ver.n}. Las objeciones del juez fueron de criterio (una respuesta correcta sobre
              un contrato de arrendamiento se calificó "incorrecta" por parecerle confidencial; otra, "parcial", por citar el nombre del
              documento fuente). La verificación literal solo detecta presencia del dato: con 4 casos, el hallazgo es "no se observó pérdida", no
              "la cascada es inocua".
            </p>
          </Sec>

          {/* ---------- 8 Inferencia ---------- */}
          <Sec id="inferencia" n="8" titulo="Inferencia estadística">
            <Tabla cab={["", "H1 (n = 44 pares)", "H2 (n = 12 pares)"]} filas={[
              ["Pares discordantes a favor del control", t.solo_a_fuga, mc2.discordantes_b],
              ["Pares discordantes en contra", t.solo_b_fuga, mc2.discordantes_c],
              ["McNemar exacto (p bilateral)", exp(e1.mcnemar_p_value), mc2.p_valor.toFixed(5)],
              ["Diferencia absoluta de tasas", `${(reduccion1 * 100).toFixed(1)} pp`, `${(reduccion2 * 100).toFixed(1)} pp`],
            ]} />
            <p>
              Se usa la variante exacta porque la prueba asintótica no es fiable con pocos pares discordantes (Fagerland et al., 2013). La
              significancia no dice cuánto generaliza el efecto: los intervalos de Wilson sí muestran la incertidumbre de cada tasa, y son anchos,
              sobre todo en H2. No se corrigió por comparaciones múltiples porque cada hipótesis tiene una sola prueba primaria pre-especificada.
              Las pruebas de calidad (n = 18 y n = 4) son descriptivas y no tienen potencia para detectar un costo moderado.
            </p>
          </Sec>

          {/* ---------- 9 Exploratorio ---------- */}
          <Sec id="exploratorio" n="9" titulo="Análisis exploratorio">
            <p>
              <Etiqueta tipo="exp" /> Lo siguiente se calculó después de ver los resultados, a partir de <code>resultados_crudos.jsonl</code>. Describe, no
              prueba, y no cambia el estado de ninguna hipótesis.
            </p>
            <h4>9.1 Fuga por documento fuente (H1, tipo b)</h4>
            <Tabla densa cab={["Documento", "Nivel", "Preguntas", "Fuga en A", "Fuga en B"]} filas={Object.entries(porDoc).map(([k, v]) => [
              <code key={k}>{k}</code>, v.nivel, v.n, `${v.a} (${pct(v.a / v.n, 0)})`, `${v.b} (${pct(v.b / v.n, 0)})`,
            ])} />
            <p>
              Tres documentos fugaron en el 100% de sus variantes bajo la Condición A. La fuga residual en B se concentra en pocos documentos.
              Por rol: {Object.entries(porRol).map(([k, v]) => `${k} ${v.a}/${v.n} → ${v.b}/${v.n}`).join(" · ")}.
            </p>
            <h4>9.2 ¿Llegó el documento restringido al contexto del modelo?</h4>
            <Tabla cab={["Condición", "Preguntas en que el documento fuente se recuperó"]} filas={[
              ["A · sin filtro", `${fuenteRecA} de ${e1.n_tipo_b}`],
              ["B · con filtro", `${fuenteRecB} de ${e1.n_tipo_b}`],
            ]} />
            <p>
              Con el filtro, el documento restringido <strong>nunca</strong> se recuperó. El filtro cumplió su función mecánica en el 100% de los
              casos; lo que queda por explicar son las {residuales.length} respuestas que el juez clasificó como fuga.
            </p>
            <h4>9.3 Las fugas residuales de la Condición B</h4>
            <Tabla densa cab={["Registro", "Rol", "Documento fuente", "Fuente recuperada en B"]} filas={residuales.map((r) => [
              r.id, r.rol, <code key={r.id}>{r.doc_fuente}</code>, r.docs_recuperados_b.includes(r.doc_fuente) ? "sí" : "no",
            ])} />
            <p>
              En las {residuales.length} respuestas, según las justificaciones del juez y el texto de las respuestas, lo revelado son <em>metadatos
              de acceso</em> obtenidos de otros documentos autorizados (que existe una matriz de perfiles, qué rol accede a un repositorio, la
              clasificación de un documento), no el contenido del documento restringido. Es una lectura mía de {residuales.length} registros; podría
              discutirse si revelar la existencia o el nivel de acceso de un documento es una fuga que importa. Pero cambia la interpretación de la
              Semana 5, que atribuyó el 9.1% a documentos restringidos que "llegaron igual al contexto" del modelo: esos datos no lo respaldan.
            </p>
          </Sec>

          {/* ---------- 10 Lectura crítica ---------- */}
          <Sec id="lectura" n="10" titulo="Lectura crítica">
            <ol className="exp-lista">
              <li><strong>Ambos controles funcionaron en el sentido predicho, con efectos grandes.</strong> En H1 los intervalos de las dos condiciones no se solapan; en H2 los 11 pares discordantes van todos en la misma dirección.</li>
              <li><strong>El mecanismo de H1 es estructural, no del modelo.</strong> En A, el documento fuente se recuperó en {fuenteRecA} de {e1.n_tipo_b} preguntas: el modelo respondió con lo que el retrieval le entregó. El filtro impide que el documento llegue; no depende de que el modelo "decida" negarse.</li>
              <li><strong>Lo que une ambos resultados es una interpretación, no un hallazgo.</strong> Un control puesto solo en el punto más visible (el acceso, el borrado del archivo) dejó pasar la información por otra ruta; puesto donde la ruta existe, la bloqueó. Ninguna prueba compara un experimento con el otro y miden cosas distintas.</li>
              <li><strong>El 9.1% residual de H1 no es evidencia de que el filtro falle</strong> en bloquear documentos (sección 9.2). Sí es evidencia de que la definición operacional de "fuga" incluye revelar metadatos de acceso, y de que esa definición condiciona la tasa que se reporta.</li>
              <li><strong>La calidad no es el resultado fuerte.</strong> Con n = 18 y n = 4, no se puede afirmar ausencia de costo.</li>
            </ol>
          </Sec>

          {/* ---------- 11 Validez ---------- */}
          <Sec id="validez" n="11" titulo="Amenazas a la validez y limitaciones">
            <Tabla cab={["Amenaza", "Estado / mitigación"]} filas={[
              ["Juez y modelo evaluado son el mismo modelo", "No mitigada. Sin validación manual de la precisión del juez; en H2, el juez y la verificación literal discreparon sobre la calidad."],
              ["Corpus sintético", "Documentos escritos para el experimento, con hechos limpios y derivados que los citan de forma directa. Un corpus real es más ruidoso. No mitigada."],
              ["Un solo modelo y un solo recuperador", "claude-haiku-4-5 con TF-IDF. Recuperadores densos y otros modelos pueden comportarse distinto."],
              ["Muestras pequeñas", "H1: 44 y 18; H2: 12 y 4. Los intervalos lo reflejan y son anchos, sobre todo en H2."],
              ["Una corrida por trial", "Sin repeticiones que midan la variabilidad del modelo; algunas diferencias de calidad pueden ser ruido de generación."],
              ["Alcance de H2", "Solo documentos derivados. No se implementaron caché semántico ni memoria de largo plazo, ni se evaluó el contexto de conversación."],
              ["Definición de fuga", "Incluye revelar metadatos de acceso (sección 9.3). Con una definición de solo contenido, la tasa de B probablemente sería menor; no se recalculó."],
              ["Criterio publicado, no registrado externamente", "Fechado públicamente antes de los datos, pero sin un registro de terceros que lo certifique."],
              ["Sin costo de adopción ni conclusión jurídica", "No se midió el costo de implementar los controles ni se evalúa si un sistema real cumple una ley."],
              ["Análisis exploratorio", "La sección 9 es post-hoc: describe, no prueba."],
            ]} />
          </Sec>

          {/* ---------- 12 Siguiente ---------- */}
          <Sec id="siguiente" n="12" titulo="Qué falta para validar (o explorar distinto)">
            <ul className="exp-lista">
              <li><strong>Implementar y medir las vías no evaluadas:</strong> caché semántico, memoria de largo plazo y contexto de conversación, con su propio criterio de falsabilidad.</li>
              <li><strong>Validar el juez</strong> contra anotación manual y usar un modelo distinto al evaluado.</li>
              <li><strong>Separar dos definiciones de fuga</strong> (contenido vs. metadatos de acceso) y reportar ambas tasas.</li>
              <li><strong>Más trials y repeticiones</strong> por pregunta, para medir la variabilidad del modelo y estrechar los intervalos.</li>
              <li><strong>Corpus y modelos distintos,</strong> idealmente con documentos reales anonimizados y recuperadores densos con reranking.</li>
              <li><strong>Medir el costo de adopción</strong> de los controles en ingeniería y latencia.</li>
            </ul>
          </Sec>

          {/* ---------- 13 Repro ---------- */}
          <Sec id="repro" n="13" titulo="Reproducibilidad y transparencia">
            <Eq>{`git clone ${REPO}
pip install anthropic scikit-learn scipy python-frontmatter
export ANTHROPIC_API_KEY=...            # el script falla con RuntimeError si no existe
python tesis-rag/experimento-1/run_experimento.py && python tesis-rag/experimento-1/analisis.py
python tesis-rag/experimento-2/run_experimento.py && python tesis-rag/experimento-2/analisis.py
python tesis-rag/experimento-2/verificacion_calidad.py`}</Eq>
            <ul className="exp-lista">
              <li>Experimento 1: <a href={`${BLOB}/experimento-1/resultados_crudos.jsonl`}>resultados_crudos.jsonl</a> · <a href={`${BLOB}/experimento-1/resumen_estadistico.json`}>resumen_estadistico.json</a> · <a href={`${BLOB}/experimento-1/rag.py`}>rag.py</a> · <a href={`${BLOB}/experimento-1/analisis.py`}>analisis.py</a></li>
              <li>Experimento 2: <a href={`${BLOB}/experimento-2/resultados_crudos.jsonl`}>resultados_crudos.jsonl</a> · <a href={`${BLOB}/experimento-2/resumen_estadistico.json`}>resumen_estadistico.json</a> · <a href={`${BLOB}/experimento-2/rag2.py`}>rag2.py</a> · <a href={`${BLOB}/experimento-2/verificacion_calidad.py`}>verificacion_calidad.py</a></li>
              <li>Corpus: <a href={`${BLOB}/corpus`}>tesis-rag/corpus/</a> · Estado de la serie: <a href={`${BLOB}/ESTADO.md`}>ESTADO.md</a> · <a href="/tesis-rag/tesis-completa.md">Tesis completa</a></li>
            </ul>
            <p>
              <strong>Uso de modelos de lenguaje.</strong> Las respuestas, los veredictos de los jueces y la verificación de calidad usan{" "}
              <code>claude-haiku-4-5</code>. El código de los experimentos y el texto de la serie y de este reporte los redactó Claude con la
              dirección del autor; cada cifra de esta página se lee de los archivos de resultados al compilar. El análisis estadístico (McNemar
              exacto, Wilson) es código determinístico y ningún LLM interviene en él. La corrida del Experimento 2 requirió corregir el parseo
              del JSON del juez (sección 14).
            </p>
            <p className="exp-nota">Material de investigación y educativo. Datos y empresa ficticios. No es asesoría legal ni de cumplimiento normativo.</p>
          </Sec>

          {/* ---------- 14 Correcciones ---------- */}
          <Sec id="correcciones" n="14" titulo="Correcciones registradas durante la serie">
            <Tabla cab={["Cuándo", "Qué cambió"]} filas={[
              ["Semana 7", "El script del Experimento 2 no interpretaba el JSON del juez cuando venía en un bloque de código; se corrigió el parseo y se subió el límite de tokens del juez de 200 a 400. No se tocaron el diseño ni los trials."],
              ["Semana 8", "La lectura del costo de calidad (2 de 4 según el juez) se contrastó con una verificación determinista (4 de 4); ambas cifras se conservan."],
              ["Semana 10", "Se retiró una cita (Vickers, 2005) y se reencuadró una analogía sobre bases de datos que la Semana 2 respaldaba con una referencia que no la sostiene."],
              ["Cierre del proyecto", "El análisis de la sección 9 muestra que el documento restringido no llegó al contexto en la Condición B, lo que corrige la explicación especulativa de la Semana 5 sobre el 9.1% residual."],
            ]} />
          </Sec>
        </article>

        <p style={{ marginTop: 32 }}>
          <Link href="/proyectos">← Volver a Proyectos</Link> · <Link href="/tesis-rag">Hub de la tesis</Link>
        </p>
      </div>
    </section>
  );
}
