/* ============================================================
   Medidor de riesgo y volatilidad de mercado (Pulso de Mercado)
   ------------------------------------------------------------
   Indicador propio de 0 a 100 que sintetiza seis dimensiones del riesgo de
   mercado a partir de precios públicos diarios (Yahoo Finance). EXPERIMENTAL:
   describe el entorno de hoy; NO se ha validado que prediga nada, y no es una
   recomendación. El estudio de poder predictivo es una fase posterior.

   Diseño:
   - Cada componente se normaliza contra SU PROPIA historia (percentil sobre
     los últimos 5 años), no contra umbrales fijos ("VIX > 20"). La excepción
     es el drawdown, que usa una tabla fija pensada para calibrarse después.
   - El historial NO se guarda en una tabla: se recalcula de forma
     determinista a partir de los precios cada vez, con las mismas fórmulas.
     Cada fecha usa solo datos hasta esa fecha (sin información del futuro).
   - Si falta un componente (un símbolo no responde), se excluye y los pesos
     se renormalizan; se informa cuáles faltan. Nunca se inventa un valor.

   Sin imports con alias "@/" para poder usarse también desde scripts de Node.
   ============================================================ */

const YAHOO = "https://query1.finance.yahoo.com/v8/finance/chart/";

// Símbolos de Yahoo. Los ETFs usan cierre ajustado (incluye dividendos).
export const SIMBOLOS = {
  vix: "^VIX",
  vix3m: "^VIX3M",
  vvix: "^VVIX",
  spy: "SPY",
  qqq: "QQQ",
  vt: "VT",
  vwo: "VWO",
  vnq: "VNQ",
  tlt: "TLT",
  gld: "GLD",
  hyg: "HYG",
  lqd: "LQD",
};
const CANASTA_CORRELACION = ["spy", "qqq", "vt", "vwo", "vnq", "tlt", "gld"];

export const PESOS = {
  implicita: 0.25,
  realizada: 0.2,
  drawdown: 0.15,
  correlacion: 0.15,
  cola: 0.15,
  estres: 0.1,
};

const VENTANA_PERCENTIL = 1260; // ~5 años de sesiones
const MIN_OBS_PERCENTIL = 500;
const RV_CORTA = 20;
const RV_LARGA = 252;
const VENTANA_CORR = 60;
const VENTANA_COLA = 120;
const TABLA_DRAWDOWN = [
  [0, 0],
  [-0.02, 25],
  [-0.05, 50],
  [-0.1, 75],
  [-0.2, 100],
];

export const NIVELES = [
  { max: 20, nombre: "Muy bajo", color: "#16a34a" },
  { max: 40, nombre: "Bajo", color: "#84cc16" },
  { max: 60, nombre: "Moderado", color: "#eab308" },
  { max: 80, nombre: "Alto", color: "#f97316" },
  { max: 100, nombre: "Extremo", color: "#dc2626" },
];

export function nivelDe(score) {
  const i = NIVELES.findIndex((n) => score <= n.max);
  return i === -1 ? NIVELES.length - 1 : i;
}

/* ---------- descarga ---------- */

/** Yahoo a veces deja el cierre/adjclose de la sesión más reciente en null
 *  por uno o dos días (su pipeline de ajuste por dividendos de los ETFs va
 *  detrás del de los índices) aunque la sesión ya cerró y ya trae volumen.
 *  meta.regularMarketPrice es ese mismo precio de cierre oficial, reportado
 *  por un campo distinto que sí se actualiza al cierre — no es un valor
 *  inventado, solo evita esperar a que el backfill del arreglo histórico
 *  alcance a la sesión más reciente. Solo se usa para la última barra, y
 *  solo si regularMarketTime confirma que la sesión regular de esa fecha ya
 *  terminó (nunca para una cotización en vivo a media sesión). */
function cierreOficialMasReciente(r) {
  const meta = r.meta;
  const fin = meta?.currentTradingPeriod?.regular?.end;
  if (meta?.regularMarketPrice == null || meta?.regularMarketTime == null || fin == null) return null;
  if (meta.regularMarketTime < fin) return null; // sesión regular aún en curso
  const off = meta.gmtoffset ?? 0;
  const fecha = new Date((meta.regularMarketTime + off) * 1000).toISOString().slice(0, 10);
  return { fecha, precio: meta.regularMarketPrice };
}

export async function descargar(simbolo, opts = {}) {
  const url = `${YAHOO}${encodeURIComponent(simbolo)}?range=10y&interval=1d&includeAdjustedClose=true`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    ...(opts.next ? { next: opts.next } : {}),
  });
  if (!res.ok) throw new Error(`Yahoo ${simbolo}: ${res.status}`);
  const json = await res.json();
  const r = json?.chart?.result?.[0];
  if (!r?.timestamp) throw new Error(`Yahoo ${simbolo}: sin datos`);
  const off = r.meta?.gmtoffset ?? 0;
  const cierre = r.indicators?.quote?.[0]?.close || [];
  const ajust = r.indicators?.adjclose?.[0]?.adjclose || null;
  const oficial = cierreOficialMasReciente(r);
  const serie = new Map();
  const ultimo = r.timestamp.length - 1;
  r.timestamp.forEach((ts, i) => {
    const fecha = new Date((ts + off) * 1000).toISOString().slice(0, 10);
    let v = ajust && ajust[i] != null ? ajust[i] : cierre[i];
    if ((v == null || !Number.isFinite(v)) && i === ultimo && oficial?.fecha === fecha) {
      v = oficial.precio;
    }
    if (v == null || !Number.isFinite(v)) return;
    serie.set(fecha, v);
  });
  return serie;
}

/* ---------- utilidades numéricas ---------- */

function media(a) {
  let s = 0;
  for (const x of a) s += x;
  return s / a.length;
}
function desv(a) {
  const m = media(a);
  let s = 0;
  for (const x of a) s += (x - m) * (x - m);
  return Math.sqrt(s / (a.length - 1));
}
function corr(a, b) {
  const ma = media(a);
  const mb = media(b);
  let sab = 0;
  let saa = 0;
  let sbb = 0;
  for (let i = 0; i < a.length; i++) {
    const da = a[i] - ma;
    const db = b[i] - mb;
    sab += da * db;
    saa += da * da;
    sbb += db * db;
  }
  const d = Math.sqrt(saa * sbb);
  return d === 0 ? 0 : sab / d;
}

/** Percentil (0-100) del valor en i respecto a las últimas VENTANA_PERCENTIL
 *  observaciones válidas hasta i (inclusive). null si hay muy poca historia. */
function percentilEn(valores, i) {
  const x = valores[i];
  if (x == null || !Number.isFinite(x)) return null;
  let n = 0;
  let menorIgual = 0;
  for (let j = Math.max(0, i - VENTANA_PERCENTIL + 1); j <= i; j++) {
    const v = valores[j];
    if (v == null || !Number.isFinite(v)) continue;
    n++;
    if (v <= x) menorIgual++;
  }
  if (n < MIN_OBS_PERCENTIL) return null;
  return (menorIgual / n) * 100;
}

function interpolar(tabla, x) {
  // tabla ordenada de x descendente (0 → -0.2); x es negativo o 0
  if (x >= tabla[0][0]) return tabla[0][1];
  for (let k = 1; k < tabla.length; k++) {
    const [x1, y1] = tabla[k - 1];
    const [x0, y0] = tabla[k];
    if (x >= x0) return y1 + ((y0 - y1) * (x - x1)) / (x0 - x1);
  }
  return tabla[tabla.length - 1][1];
}

/* ---------- cálculo ---------- */

function alinear(series, fechas) {
  // Para cada serie, valores en el calendario maestro, con relleno hacia
  // adelante de hasta 3 días (feriados distintos entre índices y ETFs).
  const out = {};
  for (const [k, mapa] of Object.entries(series)) {
    const arr = new Array(fechas.length).fill(null);
    let ultimo = null;
    let hueco = 0;
    fechas.forEach((f, i) => {
      if (mapa.has(f)) {
        ultimo = mapa.get(f);
        hueco = 0;
        arr[i] = ultimo;
      } else if (ultimo != null && hueco < 3) {
        hueco++;
        arr[i] = ultimo;
      }
    });
    out[k] = arr;
  }
  return out;
}

export function calcularSerie(series) {
  // Calendario maestro: sesiones de SPY
  const fechas = [...series.spy.keys()].sort();
  const A = alinear(series, fechas);
  const N = fechas.length;
  const disponible = (k) => A[k] && A[k].some((v) => v != null);

  const ret = {};
  for (const k of ["spy", ...CANASTA_CORRELACION, "hyg", "lqd"]) {
    if (!A[k]) continue;
    ret[k] = A[k].map((v, i) => (i > 0 && v != null && A[k][i - 1] != null ? Math.log(v / A[k][i - 1]) : null));
  }

  // 1) Volatilidad implícita: nivel del VIX
  const implicita = disponible("vix") ? A.vix : null;

  // 2) Volatilidad realizada de SPY: RV20 / RV252
  let realizada = null;
  if (ret.spy) {
    realizada = new Array(N).fill(null);
    for (let i = RV_LARGA; i < N; i++) {
      const w20 = ret.spy.slice(i - RV_CORTA + 1, i + 1);
      const w252 = ret.spy.slice(i - RV_LARGA + 1, i + 1);
      if (w20.some((v) => v == null) || w252.some((v) => v == null)) continue;
      realizada[i] = desv(w20) / desv(w252);
    }
  }

  // 3) Drawdown (SPY y QQQ) vs. máximo de 252 sesiones → puntos por tabla fija
  const drawdownScore = new Array(N).fill(null);
  const ddSpy = new Array(N).fill(null);
  const ddQqq = new Array(N).fill(null);
  for (const [k, destino] of [["spy", ddSpy], ["qqq", ddQqq]]) {
    if (!A[k]) continue;
    for (let i = 0; i < N; i++) {
      if (i < 100 || A[k][i] == null) continue;
      let pico = -Infinity;
      for (let j = Math.max(0, i - 251); j <= i; j++) if (A[k][j] != null && A[k][j] > pico) pico = A[k][j];
      destino[i] = A[k][i] / pico - 1;
    }
  }
  for (let i = 0; i < N; i++) {
    const puntos = [ddSpy[i], ddQqq[i]].filter((v) => v != null).map((v) => interpolar(TABLA_DRAWDOWN, v));
    if (puntos.length) drawdownScore[i] = media(puntos);
  }

  // 4) Correlación promedio de la canasta (60 sesiones)
  const canasta = CANASTA_CORRELACION.filter((k) => ret[k]);
  let correlacion = null;
  if (canasta.length >= 4) {
    correlacion = new Array(N).fill(null);
    for (let i = RV_LARGA; i < N; i++) {
      const ventanas = canasta.map((k) => ret[k].slice(i - VENTANA_CORR + 1, i + 1));
      if (ventanas.some((w) => w.some((v) => v == null))) continue;
      let s = 0;
      let n = 0;
      for (let a = 0; a < ventanas.length; a++)
        for (let b = a + 1; b < ventanas.length; b++) {
          s += corr(ventanas[a], ventanas[b]);
          n++;
        }
      correlacion[i] = s / n;
    }
  }

  // 5) Riesgo de cola: CVaR 95% de SPY a 120 sesiones (pérdida media del peor 5%)
  let cola = null;
  if (ret.spy) {
    cola = new Array(N).fill(null);
    const k = Math.max(1, Math.ceil(0.05 * VENTANA_COLA));
    for (let i = VENTANA_COLA; i < N; i++) {
      const w = ret.spy.slice(i - VENTANA_COLA + 1, i + 1);
      if (w.some((v) => v == null)) continue;
      const peores = [...w].sort((a, b) => a - b).slice(0, k);
      cola[i] = -media(peores);
    }
  }

  // 6) Estrés de mercado: VIX/VIX3M, VVIX y proxy de crédito (HYG vs LQD, 20 sesiones)
  const subEstres = [];
  if (disponible("vix") && disponible("vix3m")) {
    subEstres.push({ clave: "vix_vix3m", v: A.vix.map((x, i) => (x != null && A.vix3m[i] != null ? x / A.vix3m[i] : null)) });
  }
  if (disponible("vvix")) subEstres.push({ clave: "vvix", v: A.vvix });
  if (A.hyg && A.lqd && disponible("hyg") && disponible("lqd")) {
    const rel = A.hyg.map((x, i) => (x != null && A.lqd[i] != null ? Math.log(x / A.lqd[i]) : null));
    subEstres.push({
      clave: "credito",
      v: rel.map((x, i) => (i >= 20 && x != null && rel[i - 20] != null ? -(x - rel[i - 20]) : null)),
    });
  }

  const pct = (arr, i) => (arr ? percentilEn(arr, i) : null);

  const filas = [];
  for (let i = 0; i < N; i++) {
    const c = {
      implicita: pct(implicita, i),
      realizada: pct(realizada, i),
      drawdown: drawdownScore[i],
      correlacion: pct(correlacion, i),
      cola: pct(cola, i),
      estres: null,
    };
    const subs = subEstres.map((s) => pct(s.v, i)).filter((v) => v != null);
    if (subs.length) c.estres = media(subs);

    let suma = 0;
    let peso = 0;
    for (const [k, w] of Object.entries(PESOS)) {
      if (c[k] != null) {
        suma += c[k] * w;
        peso += w;
      }
    }
    // Se exige VIX (implícita) y al menos 4 de 6 componentes
    const n = Object.values(c).filter((v) => v != null).length;
    const score = c.implicita != null && n >= 4 && peso > 0 ? suma / peso : null;
    filas.push({ fecha: fechas[i], score, componentes: c });
  }

  return {
    fechas,
    filas,
    detalle: { A, ddSpy, ddQqq, realizada, correlacion, cola, subEstres },
  };
}

/* ---------- API pública ---------- */

/** Descarga los precios y devuelve el estado de hoy + historial reciente. */
export async function calcularMedidor({ dias = 90, next } = {}) {
  const resultados = await Promise.all(
    Object.entries(SIMBOLOS).map(async ([k, s]) => {
      try {
        return [k, await descargar(s, { next })];
      } catch (e) {
        return [k, null];
      }
    })
  );
  const series = {};
  const faltantes = [];
  for (const [k, serie] of resultados) {
    if (serie && serie.size > 300) series[k] = serie;
    else faltantes.push(k);
  }
  if (!series.spy || !series.vix) {
    return { ok: false, error: "No se pudieron obtener los precios base (SPY y VIX).", faltantes };
  }

  const { filas, fechas, detalle } = calcularSerie(series);

  // Descarta la barra del día en curso si la sesión de EE. UU. aún no cierra.
  const ahoraET = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hoyET = `${ahoraET.getFullYear()}-${String(ahoraET.getMonth() + 1).padStart(2, "0")}-${String(ahoraET.getDate()).padStart(2, "0")}`;
  const minutos = ahoraET.getHours() * 60 + ahoraET.getMinutes();
  let fin = filas.length - 1;
  if (filas[fin]?.fecha === hoyET && minutos < 16 * 60 + 20) fin -= 1;

  // Último día con puntaje válido
  while (fin >= 0 && filas[fin].score == null) fin -= 1;
  if (fin < 1) return { ok: false, error: "Historia insuficiente para calcular el medidor.", faltantes };

  const hoy = filas[fin];
  const ayer = filas[fin - 1];
  const historial = filas
    .slice(Math.max(0, fin - dias + 1), fin + 1)
    .filter((f) => f.score != null)
    .map((f) => ({ fecha: f.fecha, score: Math.round(f.score * 10) / 10 }));

  const { A, ddSpy, ddQqq, realizada, correlacion, cola, subEstres } = detalle;
  const f2 = (x, d = 1) => (x == null ? null : Math.round(x * 10 ** d) / 10 ** d);
  const detalles = {
    implicita: `VIX ${f2(A.vix?.[fin])}`,
    realizada: `Vol. realizada 20d / 252d de SPY: ${f2(realizada?.[fin], 2)}×`,
    drawdown: `Desde su máximo de 1 año: SPY ${f2((ddSpy[fin] ?? 0) * 100)}%, QQQ ${f2((ddQqq[fin] ?? 0) * 100)}%`,
    correlacion: `Correlación promedio (60d): ${f2(correlacion?.[fin], 2)}`,
    cola: `CVaR 95% (120d): −${f2((cola?.[fin] ?? 0) * 100, 2)}% diario`,
    estres: `VIX/VIX3M ${f2(A.vix3m ? A.vix?.[fin] / A.vix3m[fin] : null, 2)}${A.vvix ? ` · VVIX ${f2(A.vvix[fin])}` : ""}`,
  };

  const componentes = {};
  for (const k of Object.keys(PESOS)) {
    const v = hoy.componentes[k];
    componentes[k] = v == null ? null : { score: Math.round(v), peso: PESOS[k], detalle: detalles[k] };
  }

  const score = Math.round(hoy.score);
  const delta = Math.round(hoy.score) - Math.round(ayer.score);
  return {
    ok: true,
    fecha: hoy.fecha,
    score,
    nivel: NIVELES[nivelDe(score)].nombre,
    nivelIndice: nivelDe(score),
    delta1d: delta,
    componentes,
    faltantes,
    historial,
    metodo:
      "Cada componente se mide como percentil contra los últimos 5 años (el drawdown usa una tabla fija). Pesos: volatilidad implícita 25%, realizada 20%, drawdown 15%, correlación 15%, cola 15%, estrés 10%.",
    aviso:
      "Indicador informativo y EXPERIMENTAL. No es una predicción ni una recomendación, y todavía no se ha validado que tenga poder predictivo.",
    calculadoEn: new Date().toISOString(),
  };
}
