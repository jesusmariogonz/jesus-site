import paperTrading from "@/lib/paper-trading-snapshot.json";
import { pesosDeUsd, usaPesos } from "@/lib/trading/currency";

const RATE = paperTrading?.usd_mxn_rate ?? null;
const RATE_FECHA = paperTrading?.usd_mxn_rate_fecha ?? null;

// Campos en dólares absolutos de una posición (abierta o cerrada) —
// nunca incluye pnl_pct/unrealized_pnl_pct (son %, no $) ni shares.
const CAMPOS_USD_POSICION = [
  "entry_price", "stop_price", "initial_stop_price", "exit_price", "current_price", "pnl", "unrealized_pnl",
];

function convertirPosicion(p) {
  const nueva = { ...p };
  CAMPOS_USD_POSICION.forEach((campo) => {
    if (nueva[campo] !== undefined && nueva[campo] !== null) {
      nueva[campo] = pesosDeUsd(nueva[campo], RATE);
    }
  });
  return nueva;
}

/* Capa de publicación pública del proyecto de trading algorítmico.
   Lee los mismos snapshots que ya alimentan el dashboard privado
   /trading (lib/paper-trading-snapshot.json y lib/trading-snapshot.json,
   sincronizados por las Routines del repo algo_trading_platform — nunca
   los genera ni los modifica esta capa) y deriva únicamente agregados
   seguros de publicar: nada de esto toca el motor ni las Routines.

   Regla dura: si un campo no existe en el snapshot (ej. aportaciones
   mensuales, TWR, benchmark SPY por bucket), esta capa NO lo inventa —
   lo omite y lo deja documentado como pendiente del motor. */

const BUCKET_LABELS = {
  largo_plazo: "Largo Plazo",
  mediano_plazo: "Mediano Plazo",
  riesgo_alto: "Riesgo Alto",
};

const BUCKET_META = {
  largo_plazo: {
    asignacionObjetivo: 43.33,
    estrategia: "Time-Series Momentum (12m/6m)",
    riesgoPorOperacion: "2%",
    limitePerdidaDiaria: "1%",
    drawdownRevision: "6%",
  },
  mediano_plazo: {
    asignacionObjetivo: 33.33,
    estrategia: "Trend Following + Momentum/Breakout",
    riesgoPorOperacion: "2%",
    limitePerdidaDiaria: "1.5%",
    drawdownRevision: "10%",
  },
  riesgo_alto: {
    asignacionObjetivo: 23.33,
    estrategia: "Trend Following + Momentum/Breakout",
    riesgoPorOperacion: "3%",
    limitePerdidaDiaria: "2%",
    drawdownRevision: "15%",
  },
};

function round(n, d = 2) {
  if (typeof n !== "number" || Number.isNaN(n)) return null;
  const f = 10 ** d;
  return Math.round(n * f) / f;
}

function bucketPublico(key, bucket) {
  if (!bucket) return null;
  const historial = [...(bucket.daily_history || [])]
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((h) => ({ ...h, equity: pesosDeUsd(h.equity, RATE) }));
  const ultimo = historial[historial.length - 1] || null;
  const cerradasUsd = bucket.closed_positions || [];
  const ganadoras = cerradasUsd.filter((p) => p.pnl > 0).length;
  const perdedoras = cerradasUsd.filter((p) => p.pnl < 0).length;
  const winRate = cerradasUsd.length ? round((ganadoras / cerradasUsd.length) * 100, 1) : null;
  const pnlRealizadoTotal = pesosDeUsd(round(cerradasUsd.reduce((acc, p) => acc + (p.pnl || 0), 0)), RATE);
  const bruto = cerradasUsd.filter((p) => p.pnl > 0).reduce((acc, p) => acc + p.pnl, 0);
  const perdidaBruta = Math.abs(cerradasUsd.filter((p) => p.pnl < 0).reduce((acc, p) => acc + p.pnl, 0));
  // Profit factor es un ratio $ ganado / $ perdido — no cambia con la
  // conversión de moneda (se cancela), se calcula sobre USD crudo.
  const profitFactor = perdidaBruta > 0 ? round(bruto / perdidaBruta) : cerradasUsd.length ? "∞" : null;
  const cerradas = cerradasUsd.map(convertirPosicion);

  return {
    key,
    etiqueta: BUCKET_LABELS[key] || key,
    meta: BUCKET_META[key] || null,
    startingCapital: pesosDeUsd(bucket.starting_capital, RATE),
    startDate: bucket.start_date,
    equityActual: ultimo?.equity ?? pesosDeUsd(bucket.starting_capital, RATE),
    retornoAcumuladoPct: ultimo?.cumulative_return_pct ?? 0,
    drawdownPct: ultimo?.drawdown_pct ?? 0,
    drawdownInconsistente:
      (ultimo?.equity ?? bucket.starting_capital) < bucket.starting_capital && (ultimo?.drawdown_pct || 0) === 0,
    suspendido: Boolean(bucket.suspended),
    suspendidoDesde: bucket.suspended_since || null,
    suspendidoRazon: bucket.suspended_reason || null,
    circuitBreakerHoy: Boolean(ultimo?.daily_loss_breaker_tripped),
    posicionesAbiertas: (bucket.open_positions || []).map(convertirPosicion),
    posicionesCerradas: cerradas,
    totalCerradas: cerradas.length,
    ganadoras,
    perdedoras,
    winRatePct: winRate,
    pnlRealizadoTotal,
    profitFactor,
    historialDiario: historial,
    ultimaFecha: ultimo?.date || null,
  };
}

// Bajo este número de operaciones cerradas, un win rate o profit
// factor es ruido estadístico, no una medición confiable — la UI
// muestra "—" / "historial insuficiente" en vez del número, nunca
// se omite el dato, pero tampoco se presenta como si ya dijera algo.
const MINIMO_OPERACIONES_PARA_WIN_RATE = 5;
// Bajo este número de días con historial real, cualquier métrica de
// riesgo/retorno (Sharpe, Sortino, drawdown "en vivo") describe más
// ruido de arranque que comportamiento real del sistema.
const MINIMO_DIAS_PARA_HISTORIAL_CONFIABLE = 10;

export function getTradingPublicSnapshot() {
  const buckets = Object.keys(BUCKET_LABELS).map((key) =>
    bucketPublico(key, paperTrading?.buckets?.[key])
  );
  const bucketsConDatos = buckets.filter(Boolean);

  const capitalInicialTotal = round(
    bucketsConDatos.reduce((acc, b) => acc + (b.startingCapital || 0), 0)
  );
  const equityActualTotal = round(
    bucketsConDatos.reduce((acc, b) => acc + (b.equityActual || 0), 0)
  );
  const retornoTotalPct =
    capitalInicialTotal > 0
      ? round(((equityActualTotal - capitalInicialTotal) / capitalInicialTotal) * 100)
      : null;

  const totalAbiertas = bucketsConDatos.reduce((acc, b) => acc + b.posicionesAbiertas.length, 0);
  const totalCerradas = bucketsConDatos.reduce((acc, b) => acc + b.totalCerradas, 0);
  const totalGanadoras = bucketsConDatos.reduce((acc, b) => acc + b.ganadoras, 0);
  const historialSuficienteWinRate = totalCerradas >= MINIMO_OPERACIONES_PARA_WIN_RATE;
  const winRateGlobalPct = totalCerradas ? round((totalGanadoras / totalCerradas) * 100, 1) : null;
  const drawdownMaximoPct = bucketsConDatos.length
    ? round(Math.max(...bucketsConDatos.map((b) => b.drawdownPct || 0)))
    : null;

  // El motor reporta drawdown_pct por bucket, pero se detectó al menos
  // un caso real (riesgo_alto, nov-2026) donde el equity cayó por
  // debajo del capital inicial y aun así drawdown_pct quedó en 0 — una
  // inconsistencia del cálculo en el motor, no algo que esta capa deba
  // "corregir" adivinando el peak real. Se detecta y se documenta en
  // vez de ocultarse o fabricar un número alternativo.
  const drawdownInconsistente = bucketsConDatos.some(
    (b) => b.equityActual < b.startingCapital && (b.drawdownPct || 0) === 0
  );

  const diasConHistorial = bucketsConDatos.length
    ? Math.max(...bucketsConDatos.map((b) => b.historialDiario.length))
    : 0;
  const historialSuficienteRiesgo = diasConHistorial >= MINIMO_DIAS_PARA_HISTORIAL_CONFIABLE;

  const asignacionReal = bucketsConDatos.map((b) => ({
    key: b.key,
    etiqueta: b.etiqueta,
    pct: equityActualTotal > 0 ? round((b.equityActual / equityActualTotal) * 100, 1) : null,
    objetivoPct: b.meta?.asignacionObjetivo ?? null,
  }));

  // Contribución de cada bucket al retorno TOTAL del portafolio (no al
  // retorno individual del bucket): cuánto de la ganancia/pérdida en
  // pesos de cada bucket representa, como % del capital inicial TOTAL
  // de los 4 buckets juntos — permite comparar peras con peras aunque
  // los buckets tengan distinto tamaño.
  const contribucionRetorno = bucketsConDatos.map((b) => ({
    key: b.key,
    etiqueta: b.etiqueta,
    contribucionPct:
      capitalInicialTotal > 0
        ? round(((b.equityActual - b.startingCapital) / capitalInicialTotal) * 100)
        : null,
    retornoPropioPct: b.retornoAcumuladoPct,
  }));

  // Asignación real vs. objetivo: una desviación grande (>5 puntos)
  // marca la asignación como "todavía convergiendo", no como un error
  // — ver ADR 0019, Mean Reversion arrancó con menos capital del
  // objetivo y converge de forma orgánica según cierran posiciones.
  const asignacionConvergiendo = asignacionReal.some(
    (a) => a.objetivoPct !== null && a.pct !== null && Math.abs(a.pct - a.objetivoPct) > 5
  );

  const algunCircuitBreakerHoy = bucketsConDatos.some((b) => b.circuitBreakerHoy);
  const algunBucketSuspendido = bucketsConDatos.some((b) => b.suspendido);

  const generatedAtParaScorecard = paperTrading?.generated_at ? new Date(paperTrading.generated_at) : null;
  const horasDesdeUltimaActualizacion = generatedAtParaScorecard
    ? (Date.now() - generatedAtParaScorecard.getTime()) / 3_600_000
    : null;
  // Datos "al día" si se actualizaron en las últimas ~30 horas — da
  // margen para fin de semana/feriado sin marcar como atrasado algo
  // que simplemente no tenía sesión de mercado que procesar.
  const datosAlDia = horasDesdeUltimaActualizacion !== null && horasDesdeUltimaActualizacion < 30;

  // Scorecard de salud del sistema — cada estado se deriva de datos
  // reales del snapshot, nunca es una opinión fija en el código.
  const scorecard = [
    {
      dimension: "Fuente de datos",
      estado: generatedAtParaScorecard ? (datosAlDia ? "ok" : "alerta") : "falta",
      detalle: generatedAtParaScorecard
        ? datosAlDia
          ? "Actualizado recientemente"
          : "Sin actualizar en más de 30 horas"
        : "Sin snapshot",
    },
    {
      dimension: "Controles de riesgo",
      estado: algunBucketSuspendido ? "alerta" : algunCircuitBreakerHoy ? "revision" : "ok",
      detalle: algunBucketSuspendido
        ? "Al menos un bucket suspendido por drawdown"
        : algunCircuitBreakerHoy
          ? "Límite de pérdida diaria activado hoy en algún bucket"
          : "Sin breakers activos",
    },
    {
      dimension: "Asignación de capital",
      estado: asignacionConvergiendo ? "revision" : "ok",
      detalle: asignacionConvergiendo
        ? "Todavía convergiendo al objetivo (ver Portafolios)"
        : "Cerca del objetivo por bucket",
    },
    {
      dimension: "Comparación contra benchmark (SPY)",
      estado: "falta",
      detalle: "No implementada todavía en el paper trading diario",
    },
    {
      dimension: "Seguimiento de aportaciones",
      estado: "falta",
      detalle: "El motor no exporta historial de depósitos todavía",
    },
    {
      dimension: "Historial en vivo",
      estado: historialSuficienteRiesgo ? "ok" : "revision",
      detalle: historialSuficienteRiesgo
        ? `${diasConHistorial} días de historial real`
        : `Solo ${diasConHistorial} día(s) de historial real — insuficiente para métricas de riesgo confiables`,
    },
  ];

  const generatedAt = paperTrading?.generated_at || null;

  // Curva de equity combinada: suma el equity de los 3 buckets por fecha,
  // cargando hacia adelante el último valor real conocido de un bucket si
  // ese día no tiene registro propio (nunca inventa un valor nuevo, solo
  // repite el último real hasta que haya uno nuevo).
  const todasLasFechas = [...new Set(bucketsConDatos.flatMap((b) => b.historialDiario.map((h) => h.date)))].sort();
  const ultimoConocido = {};
  bucketsConDatos.forEach((b) => {
    ultimoConocido[b.key] = b.startingCapital;
  });
  const historialCombinado = todasLasFechas.map((date) => {
    let total = 0;
    bucketsConDatos.forEach((b) => {
      const entry = b.historialDiario.find((h) => h.date === date);
      if (entry) ultimoConocido[b.key] = entry.equity;
      total += ultimoConocido[b.key];
    });
    return { date, equity: round(total) };
  });

  // Historial unificado de operaciones (abiertas + cerradas) para el
  // módulo de Operaciones — cada fila es un movimiento real, nunca se
  // omiten las pérdidas.
  const historialOperaciones = bucketsConDatos
    .flatMap((b) => [
      ...b.posicionesAbiertas.map((p) => ({ ...p, bucketEtiqueta: b.etiqueta, estado: "abierta" })),
      ...b.posicionesCerradas.map((p) => ({ ...p, bucketEtiqueta: b.etiqueta, estado: "cerrada" })),
    ])
    .sort((a, b) => {
      const fechaA = a.estado === "cerrada" ? a.exit_date || a.entry_date : a.entry_date;
      const fechaB = b.estado === "cerrada" ? b.exit_date || b.entry_date : b.entry_date;
      return fechaA < fechaB ? 1 : fechaA > fechaB ? -1 : 0;
    });

  const pendientesDelMotor = [
    "Aportaciones mensuales (USD/MXN): el motor todavía no exporta un historial de depósitos — el capital mostrado es solo el inicial de cada bucket.",
    "Time-Weighted Return ajustado por flujos: no aplica todavía porque no hay aportaciones registradas en el snapshot.",
    "Comparación contra benchmark SPY dentro del paper trading: hoy solo existe a nivel de backtest por estrategia, no como serie diaria del paper trading.",
    "Sharpe, Sortino, Calmar y retornos rolling: requieren más historial diario real del que existe todavía (el 4to bucket arrancó el 1-nov-2026) para no ser puro ruido de arranque.",
    "Distribución de resultados por operación: con tan pocas operaciones cerradas todavía, un histograma describiría una muestra de 1-2 puntos, no una distribución real.",
  ];
  if (drawdownInconsistente) {
    pendientesDelMotor.unshift(
      "Se detectó un caso real donde el drawdown_pct reportado por el motor no refleja una caída de equity por debajo del capital inicial (ver bucket marcado abajo) — es una inconsistencia conocida del cálculo en el motor, pendiente de corregir ahí, no en esta página."
    );
  }

  return {
    generatedAt,
    resumen: {
      capitalInicialTotal,
      equityActualTotal,
      retornoTotalPct,
      totalAbiertas,
      totalCerradas,
      winRateGlobalPct,
      historialSuficienteWinRate,
      drawdownMaximoPct,
      drawdownInconsistente,
      usdMxnRate: RATE,
      usdMxnRateFecha: RATE_FECHA,
      monedaUSD: !usaPesos(RATE),
      algunCircuitBreakerHoy,
      algunBucketSuspendido,
      datosAlDia,
    },
    buckets: bucketsConDatos,
    asignacionReal,
    contribucionRetorno,
    scorecard,
    historialCombinado,
    historialOperaciones,
    pendientesDelMotor,
  };
}

/* Símbolos operados por el sistema — para la página de detalle por
   símbolo (/pulso-mercado/trading/simbolo/[symbol]), con los mismos
   datos reales ya presentes en el snapshot: nunca se agrega una
   descripción de empresa/ETF que no venga de una fuente verificada. */
export function getTradingSymbols() {
  const buckets = Object.keys(BUCKET_LABELS);
  const simbolos = new Set();
  buckets.forEach((key) => {
    const bucket = paperTrading?.buckets?.[key];
    if (!bucket) return;
    (bucket.open_positions || []).forEach((p) => simbolos.add(p.symbol));
    (bucket.closed_positions || []).forEach((p) => simbolos.add(p.symbol));
  });
  return [...simbolos].sort();
}

export function getTradingSymbolDetail(symbol) {
  const buckets = Object.keys(BUCKET_LABELS);
  const operaciones = [];
  const bucketsConPresencia = new Set();

  buckets.forEach((key) => {
    const bucket = paperTrading?.buckets?.[key];
    if (!bucket) return;
    (bucket.open_positions || [])
      .filter((p) => p.symbol === symbol)
      .forEach((p) => {
        bucketsConPresencia.add(key);
        operaciones.push({ ...convertirPosicion(p), bucket: key, bucketEtiqueta: BUCKET_LABELS[key], estado: "abierta" });
      });
    (bucket.closed_positions || [])
      .filter((p) => p.symbol === symbol)
      .forEach((p) => {
        bucketsConPresencia.add(key);
        operaciones.push({ ...convertirPosicion(p), bucket: key, bucketEtiqueta: BUCKET_LABELS[key], estado: "cerrada" });
      });
  });

  if (!operaciones.length) return null;

  operaciones.sort((a, b) => {
    const fechaA = a.estado === "cerrada" ? a.exit_date || a.entry_date : a.entry_date;
    const fechaB = b.estado === "cerrada" ? b.exit_date || b.entry_date : b.entry_date;
    return fechaA < fechaB ? 1 : fechaA > fechaB ? -1 : 0;
  });

  const cerradas = operaciones.filter((o) => o.estado === "cerrada");
  const ganadoras = cerradas.filter((o) => o.pnl > 0).length;
  const pnlTotal = round(cerradas.reduce((acc, o) => acc + (o.pnl || 0), 0));
  const winRatePct = cerradas.length ? round((ganadoras / cerradas.length) * 100, 1) : null;

  return {
    symbol,
    buckets: [...bucketsConPresencia].map((key) => ({ key, etiqueta: BUCKET_LABELS[key], meta: BUCKET_META[key] })),
    operaciones,
    resumen: {
      totalOperaciones: operaciones.length,
      abiertas: operaciones.filter((o) => o.estado === "abierta").length,
      cerradas: cerradas.length,
      ganadoras,
      winRatePct,
      pnlTotal,
      usdMxnRate: RATE,
      usdMxnRateFecha: RATE_FECHA,
      monedaUSD: !usaPesos(RATE),
    },
  };
}

export const TRADING_DISCLAIMER =
  "Este proyecto tiene fines educativos y de investigación. Los resultados presentados corresponden a simulaciones históricas (backtesting) y a operaciones de paper trading. No representan operaciones ejecutadas con capital real ni constituyen recomendaciones de inversión. Los resultados históricos no garantizan rendimientos futuros.";
