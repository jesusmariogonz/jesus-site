/* ============================================================
   Motor de indicadores — fuente única de verdad.
   ------------------------------------------------------------
   Funciones puras (sin I/O, sin Node-only, isomórficas: se importan
   tanto desde app/api/mercados/screener/route.js como desde
   components/MercadosScreener.js) que calculan cada indicador a
   partir de series OHLCV ya obtenidas. Ningún otro archivo del sitio
   debe reimplementar estas fórmulas — si hace falta el mismo cálculo
   en otro lugar, se importa de aquí.

   Cada indicador también tiene una entrada en REGISTRO con su
   metadata editorial (nombre, qué mide, fórmula, horizonte,
   limitaciones) para que la UI no tenga que mantener esas
   explicaciones por separado y desincronizadas del cálculo real.

   Convención de series: cierres/aperturas/maximos/minimos/volumenes
   son arrays paralelos (mismo índice = misma rueda), ordenados de
   más antiguo a más reciente — el mismo orden en que los entrega
   lib/mercados/finnhub.js.
   ============================================================ */

// ---------- Cálculos base ----------

/** Retorno simple en % entre hace `diasAtras` ruedas y la más reciente.
 *  Null si no hay suficiente historial — nunca se rellena con 0. */
export function retornoPeriodo(cierres, diasAtras) {
  if (!cierres || cierres.length <= diasAtras) return null;
  const actual = cierres[cierres.length - 1];
  const pasado = cierres[cierres.length - 1 - diasAtras];
  if (actual == null || pasado == null) return null;
  return (actual / pasado - 1) * 100;
}

/** Retorno simple en % entre dos fechas exactas (para horizonte
 *  "Personalizado"). `fechas` es el array paralelo de fechas ISO. */
export function retornoEntreFechas(cierres, fechas, fechaInicio, fechaFin) {
  if (!cierres || !fechas) return null;
  const iInicio = fechas.findIndex((f) => f >= fechaInicio);
  let iFin = -1;
  for (let i = fechas.length - 1; i >= 0; i--) {
    if (fechas[i] <= fechaFin) {
      iFin = i;
      break;
    }
  }
  if (iInicio < 0 || iFin < 0 || iFin <= iInicio) return null;
  const pasado = cierres[iInicio];
  const actual = cierres[iFin];
  if (pasado == null || actual == null) return null;
  return (actual / pasado - 1) * 100;
}

/** Media móvil simple terminando en `hastaIndice` (por defecto el último). */
export function sma(cierres, periodo, hastaIndice = cierres.length - 1) {
  if (!cierres || hastaIndice - periodo + 1 < 0) return null;
  let suma = 0;
  for (let i = hastaIndice - periodo + 1; i <= hastaIndice; i++) suma += cierres[i];
  return suma / periodo;
}

/** % de distancia del precio actual respecto a su SMA de `periodo`.
 *  Positivo = precio por encima de la media (tendencia alcista). */
export function distanciaSMA(cierres, periodo) {
  if (!cierres?.length) return null;
  const precio = cierres[cierres.length - 1];
  const media = sma(cierres, periodo);
  if (precio == null || media == null || media === 0) return null;
  return (precio / media - 1) * 100;
}

/** Pendiente de la SMA de `periodo`: diferencia % entre su valor hoy y
 *  su valor hace `diasAtras` ruedas. Positivo = la media está subiendo. */
export function pendienteSMA(cierres, periodo, diasAtras = 20) {
  if (!cierres?.length) return null;
  const n = cierres.length;
  const hoy = sma(cierres, periodo);
  const antes = n - 1 - diasAtras >= 0 ? sma(cierres, periodo, n - 1 - diasAtras) : null;
  if (hoy == null || antes == null || antes === 0) return null;
  return (hoy / antes - 1) * 100;
}

/** Retorno anualizado y volatilidad anualizada a partir de retornos
 *  logarítmicos diarios — estándar, sin predicciones. */
export function retornoYVolatilidad(cierres) {
  if (!cierres || cierres.length < 10) return null;
  const retornos = [];
  for (let i = 1; i < cierres.length; i++) retornos.push(Math.log(cierres[i] / cierres[i - 1]));
  const media = retornos.reduce((a, b) => a + b, 0) / retornos.length;
  const varianza = retornos.reduce((a, r) => a + (r - media) ** 2, 0) / retornos.length;
  const volatilidadDiaria = Math.sqrt(varianza);
  return {
    retornoAnualizado: Math.exp(media * 252) - 1,
    volatilidadAnualizada: volatilidadDiaria * Math.sqrt(252),
  };
}

/** Volatilidad anualizada móvil: una serie, no un solo número — un valor
 *  por cada rueda, usando una ventana móvil de `ventana` ruedas previas. */
export function volatilidadMovil(cierres, ventana = 20) {
  if (!cierres) return [];
  return cierres.map((_, i) => {
    if (i - ventana < 0) return null;
    const retornos = [];
    for (let k = i - ventana + 1; k <= i; k++) retornos.push(Math.log(cierres[k] / cierres[k - 1]));
    const media = retornos.reduce((a, b) => a + b, 0) / retornos.length;
    const varianza = retornos.reduce((a, r) => a + (r - media) ** 2, 0) / retornos.length;
    return Math.sqrt(varianza) * Math.sqrt(252) * 100;
  });
}

/** ATR (Average True Range) de `periodo` ruedas, en unidades de precio.
 *  Mide el rango real promedio reciente — estándar para stops/tamaño de
 *  posición en position/swing trading. */
export function atr(maximos, minimos, cierres, periodo = 14) {
  if (!maximos || !minimos || !cierres || cierres.length <= periodo) return null;
  const n = cierres.length;
  const rangosVerdaderos = [];
  for (let i = n - periodo; i < n; i++) {
    if (i === 0) continue;
    const tr = Math.max(
      maximos[i] - minimos[i],
      Math.abs(maximos[i] - cierres[i - 1]),
      Math.abs(minimos[i] - cierres[i - 1])
    );
    rangosVerdaderos.push(tr);
  }
  if (!rangosVerdaderos.length) return null;
  return rangosVerdaderos.reduce((a, b) => a + b, 0) / rangosVerdaderos.length;
}

/** ATR como % del precio actual — comparable entre activos de precio
 *  muy distinto (ej. una acción de $5 vs. una de $500). */
export function atrPct(maximos, minimos, cierres, periodo = 14) {
  if (!cierres?.length) return null;
  const valor = atr(maximos, minimos, cierres, periodo);
  const precio = cierres[cierres.length - 1];
  if (valor == null || !precio) return null;
  return (valor / precio) * 100;
}

/** Volumen de la rueda más reciente respecto al promedio de las
 *  `ventana` ruedas previas (sin contar la de hoy). >1 = volumen
 *  por encima de lo habitual. */
export function volumenRelativo(volumenes, ventana = 20) {
  if (!volumenes || volumenes.length <= ventana) return null;
  const n = volumenes.length;
  const hoy = volumenes[n - 1];
  let suma = 0;
  let dias = 0;
  for (let i = n - 1 - ventana; i < n - 1; i++) {
    if (typeof volumenes[i] === "number") {
      suma += volumenes[i];
      dias++;
    }
  }
  if (hoy == null || dias === 0) return null;
  const promedio = suma / dias;
  return promedio > 0 ? hoy / promedio : null;
}

/** Liquidez promedio en valor monetario: precio × volumen, promediado
 *  sobre las últimas `ventana` ruedas. */
export function liquidezPromedio(cierres, volumenes, ventana = 20) {
  if (!cierres || !volumenes || cierres.length < ventana) return null;
  const n = cierres.length;
  let suma = 0;
  let dias = 0;
  for (let i = n - ventana; i < n; i++) {
    if (typeof volumenes[i] === "number" && typeof cierres[i] === "number") {
      suma += volumenes[i] * cierres[i];
      dias++;
    }
  }
  return dias > 0 ? suma / dias : null;
}

/** % de distancia del precio actual respecto al máximo de las últimas
 *  `ventana` ruedas (negativo = por debajo de ese máximo). */
export function distanciaMaximoReciente(cierres, maximos, ventana) {
  if (!cierres?.length || !maximos?.length) return null;
  const n = cierres.length;
  const desde = Math.max(0, n - ventana);
  const maximoReciente = Math.max(...maximos.slice(desde, n));
  const precio = cierres[n - 1];
  if (!maximoReciente) return null;
  return (precio / maximoReciente - 1) * 100;
}

/** % de distancia del precio actual respecto al mínimo de las últimas
 *  `ventana` ruedas (positivo = por encima de ese mínimo). */
export function distanciaMinimoReciente(cierres, minimos, ventana) {
  if (!cierres?.length || !minimos?.length) return null;
  const n = cierres.length;
  const desde = Math.max(0, n - ventana);
  const minimoReciente = Math.min(...minimos.slice(desde, n));
  const precio = cierres[n - 1];
  if (!minimoReciente) return null;
  return (precio / minimoReciente - 1) * 100;
}

/** Heurística simple de estructura de tendencia: compara el máximo y el
 *  mínimo de la mitad más reciente de la ventana contra la mitad previa.
 *  "alcista" = máximos y mínimos crecientes; "bajista" = decrecientes;
 *  "mixta" = no coinciden (lateral o en transición). No sustituye un
 *  análisis de swings reales (pivotes), es una aproximación declarada. */
export function estructuraTendencia(maximos, minimos, ventana = 40) {
  if (!maximos?.length || !minimos?.length) return null;
  const n = maximos.length;
  if (n < ventana) return null;
  const mitad = Math.floor(ventana / 2);
  const inicio = n - ventana;
  const maxPrevio = Math.max(...maximos.slice(inicio, inicio + mitad));
  const maxReciente = Math.max(...maximos.slice(inicio + mitad, n));
  const minPrevio = Math.min(...minimos.slice(inicio, inicio + mitad));
  const minReciente = Math.min(...minimos.slice(inicio + mitad, n));
  const maximosCrecen = maxReciente > maxPrevio;
  const minimosCrecen = minReciente > minPrevio;
  if (maximosCrecen && minimosCrecen) return "alcista";
  if (!maximosCrecen && !minimosCrecen) return "bajista";
  return "mixta";
}

// ---------- Registro editorial (metadata, una sola vez) ----------

/** Catálogo de indicadores: id -> metadata. La UI (tooltips, fichas)
 *  debe leer de aquí en vez de mantener texto explicativo por su cuenta. */
export const REGISTRO = {
  retorno: {
    id: "retorno",
    nombre: "Rendimiento del periodo",
    pregunta: "¿Cuánto hubiera ganado o perdido quien compró al inicio del horizonte seleccionado?",
    formula: "(Precio final / Precio inicial − 1) × 100",
    horizonte: "Configurable (1M, 3M, 6M, 12M o personalizado)",
    unidades: "%",
    limitaciones:
      "No incorpora dividendos reinvertidos — es retorno de precio, no retorno total. No ajusta por splits anteriores a la ventana de datos si el proveedor no los refleja en el histórico ajustado.",
  },
  fuerzaRelativa: {
    id: "fuerzaRelativa",
    nombre: "Fuerza relativa vs. mercado",
    pregunta: "¿Este activo superó o quedó por debajo del S&P 500 en el mismo periodo?",
    formula: "Rendimiento del activo − Rendimiento del S&P 500 (ETF SPY), mismo horizonte",
    horizonte: "El mismo horizonte seleccionado para 'Rendimiento del periodo'",
    unidades: "puntos porcentuales",
    limitaciones:
      "Usa SPY como proxy del S&P 500 (no el índice puro). No es RSI (indicador de momentum de precio, no de comparación contra un benchmark) — son conceptos distintos con el mismo nombre abreviado 'fuerza relativa' en distintas tradiciones de análisis técnico.",
  },
  distanciaSMA50: {
    id: "distanciaSMA50",
    nombre: "Precio vs. SMA 50",
    pregunta: "¿El precio está por encima o por debajo de su media móvil de 50 ruedas?",
    formula: "(Precio / SMA50 − 1) × 100",
    horizonte: "~50 ruedas (≈10 semanas)",
    unidades: "%",
    limitaciones: "Una media móvil es un resumen retrospectivo, no una señal predictiva por sí sola.",
  },
  distanciaSMA200: {
    id: "distanciaSMA200",
    nombre: "Precio vs. SMA 200",
    pregunta: "¿El precio está por encima o por debajo de su media móvil de 200 ruedas (tendencia de largo plazo)?",
    formula: "(Precio / SMA200 − 1) × 100",
    horizonte: "~200 ruedas (≈10 meses)",
    unidades: "%",
    limitaciones: "Igual que SMA50: descriptivo, no predictivo. Requiere al menos 200 ruedas de historial.",
  },
  pendienteSMA200: {
    id: "pendienteSMA200",
    nombre: "Pendiente de SMA 200",
    pregunta: "¿La media móvil de 200 ruedas está subiendo o bajando?",
    formula: "(SMA200 hoy / SMA200 hace 20 ruedas − 1) × 100",
    horizonte: "20 ruedas de comparación sobre una SMA de 200",
    unidades: "%",
    limitaciones: "Sensible a la ventana de comparación elegida (20 ruedas); otras ventanas darían lecturas distintas.",
  },
  volatilidadAnualizada: {
    id: "volatilidadAnualizada",
    nombre: "Volatilidad anualizada",
    pregunta: "¿Qué tanto se mueve el precio día a día, proyectado a un año?",
    formula: "Desviación estándar de retornos logarítmicos diarios × √252",
    horizonte: "180 ruedas para el valor puntual de la tabla; móvil de 20 ruedas en la gráfica",
    unidades: "%",
    limitaciones: "Volatilidad pasada, no garantiza volatilidad futura. No distingue movimientos al alza de movimientos a la baja.",
  },
  atrPct: {
    id: "atrPct",
    nombre: "ATR (% del precio)",
    pregunta: "¿Qué tan grande es el rango de movimiento diario típico de este activo, en proporción a su precio?",
    formula: "Promedio del rango verdadero (True Range) de 14 ruedas, dividido entre el precio actual",
    horizonte: "14 ruedas",
    unidades: "%",
    limitaciones: "Uso típico: dimensionar stops y tamaño de posición, no predecir dirección.",
  },
  volumenRelativo: {
    id: "volumenRelativo",
    nombre: "Volumen relativo",
    pregunta: "¿Hoy se operó más o menos de lo habitual en este activo?",
    formula: "Volumen de hoy / promedio de volumen de las 20 ruedas previas",
    horizonte: "20 ruedas",
    unidades: "veces (1.0 = volumen normal)",
    limitaciones: "Un volumen relativo alto no indica por sí solo la dirección del movimiento.",
  },
  liquidezPromedio: {
    id: "liquidezPromedio",
    nombre: "Liquidez promedio",
    pregunta: "¿Qué tan fácil o costoso sería operar este activo sin mover mucho el precio?",
    formula: "Precio × volumen, promediado sobre 20 ruedas",
    horizonte: "20 ruedas",
    unidades: "USD",
    limitaciones: "Es un proxy de liquidez (valor negociado), no el spread bid-ask real, que esta fuente no provee.",
  },
  distanciaMaximo52s: {
    id: "distanciaMaximo52s",
    nombre: "Distancia al máximo de 52 semanas",
    pregunta: "¿Qué tan lejos está el precio actual de su máximo del último año?",
    formula: "(Precio / Máximo de 252 ruedas − 1) × 100",
    horizonte: "252 ruedas (~52 semanas)",
    unidades: "%",
    limitaciones: "Usa el máximo intradía (high) reportado por la fuente de datos, no necesariamente el máximo de cierre.",
  },
  distanciaMinimo52s: {
    id: "distanciaMinimo52s",
    nombre: "Distancia al mínimo de 52 semanas",
    pregunta: "¿Qué tan lejos está el precio actual de su mínimo del último año?",
    formula: "(Precio / Mínimo de 252 ruedas − 1) × 100",
    horizonte: "252 ruedas (~52 semanas)",
    unidades: "%",
    limitaciones: "Usa el mínimo intradía (low) reportado por la fuente de datos.",
  },
  estructuraTendencia: {
    id: "estructuraTendencia",
    nombre: "Estructura de tendencia",
    pregunta: "¿Los máximos y mínimos recientes son crecientes, decrecientes o mixtos?",
    formula:
      "Compara el máximo y el mínimo de las últimas 20 ruedas contra los de las 20 ruedas anteriores (ventana total de 40)",
    horizonte: "40 ruedas",
    unidades: "categoría (alcista / bajista / mixta)",
    limitaciones:
      "Aproximación simplificada — no identifica pivotes (swings) reales como lo haría un análisis técnico manual; con ventanas distintas puede cambiar la lectura.",
  },
};
