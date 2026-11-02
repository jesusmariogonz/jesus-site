import paperTrading from "@/lib/paper-trading-snapshot.json";

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
  mean_reversion: "Mean Reversion",
};

const BUCKET_META = {
  largo_plazo: {
    asignacionObjetivo: 28.17,
    estrategia: "Time-Series Momentum (12m/6m)",
    riesgoPorOperacion: "2%",
    limitePerdidaDiaria: "1%",
    drawdownRevision: "6%",
  },
  mediano_plazo: {
    asignacionObjetivo: 21.67,
    estrategia: "Trend Following + Momentum/Breakout",
    riesgoPorOperacion: "2%",
    limitePerdidaDiaria: "1.5%",
    drawdownRevision: "10%",
  },
  riesgo_alto: {
    asignacionObjetivo: 15.17,
    estrategia: "Trend Following + Momentum/Breakout",
    riesgoPorOperacion: "3%",
    limitePerdidaDiaria: "2%",
    drawdownRevision: "15%",
  },
  mean_reversion: {
    asignacionObjetivo: 35.0,
    estrategia: "Mean Reversion RSI(2)",
    riesgoPorOperacion: "2%",
    limitePerdidaDiaria: "1.5%",
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
  const historial = [...(bucket.daily_history || [])].sort((a, b) => (a.date < b.date ? -1 : 1));
  const ultimo = historial[historial.length - 1] || null;
  const cerradas = bucket.closed_positions || [];
  const ganadoras = cerradas.filter((p) => p.pnl > 0).length;
  const perdedoras = cerradas.filter((p) => p.pnl < 0).length;
  const winRate = cerradas.length ? round((ganadoras / cerradas.length) * 100, 1) : null;
  const pnlRealizadoTotal = round(cerradas.reduce((acc, p) => acc + (p.pnl || 0), 0));
  const bruto = cerradas.filter((p) => p.pnl > 0).reduce((acc, p) => acc + p.pnl, 0);
  const perdidaBruta = Math.abs(cerradas.filter((p) => p.pnl < 0).reduce((acc, p) => acc + p.pnl, 0));
  const profitFactor = perdidaBruta > 0 ? round(bruto / perdidaBruta) : cerradas.length ? "∞" : null;

  return {
    key,
    etiqueta: BUCKET_LABELS[key] || key,
    meta: BUCKET_META[key] || null,
    startingCapital: bucket.starting_capital,
    startDate: bucket.start_date,
    equityActual: ultimo?.equity ?? bucket.starting_capital,
    retornoAcumuladoPct: ultimo?.cumulative_return_pct ?? 0,
    drawdownPct: ultimo?.drawdown_pct ?? 0,
    suspendido: Boolean(bucket.suspended),
    suspendidoDesde: bucket.suspended_since || null,
    suspendidoRazon: bucket.suspended_reason || null,
    circuitBreakerHoy: Boolean(ultimo?.daily_loss_breaker_tripped),
    posicionesAbiertas: bucket.open_positions || [],
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
  const winRateGlobalPct = totalCerradas ? round((totalGanadoras / totalCerradas) * 100, 1) : null;
  const drawdownMaximoPct = bucketsConDatos.length
    ? round(Math.max(...bucketsConDatos.map((b) => b.drawdownPct || 0)))
    : null;

  const asignacionReal = bucketsConDatos.map((b) => ({
    key: b.key,
    etiqueta: b.etiqueta,
    pct: equityActualTotal > 0 ? round((b.equityActual / equityActualTotal) * 100, 1) : null,
    objetivoPct: b.meta?.asignacionObjetivo ?? null,
  }));

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

  return {
    generatedAt,
    resumen: {
      capitalInicialTotal,
      equityActualTotal,
      retornoTotalPct,
      totalAbiertas,
      totalCerradas,
      winRateGlobalPct,
      drawdownMaximoPct,
    },
    buckets: bucketsConDatos,
    asignacionReal,
    historialCombinado,
    historialOperaciones,
    pendientesDelMotor: [
      "Aportaciones mensuales (USD/MXN): el motor todavía no exporta un historial de depósitos — el capital mostrado es solo el inicial de cada bucket.",
      "Time-Weighted Return ajustado por flujos: no aplica todavía porque no hay aportaciones registradas en el snapshot.",
      "Comparación contra benchmark SPY dentro del paper trading: hoy solo existe a nivel de backtest por estrategia, no como serie diaria del paper trading.",
    ],
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
        operaciones.push({ ...p, bucket: key, bucketEtiqueta: BUCKET_LABELS[key], estado: "abierta" });
      });
    (bucket.closed_positions || [])
      .filter((p) => p.symbol === symbol)
      .forEach((p) => {
        bucketsConPresencia.add(key);
        operaciones.push({ ...p, bucket: key, bucketEtiqueta: BUCKET_LABELS[key], estado: "cerrada" });
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
    },
  };
}

export const TRADING_DISCLAIMER =
  "Este proyecto tiene fines educativos y de investigación. Los resultados presentados corresponden a simulaciones históricas (backtesting) y a operaciones de paper trading. No representan operaciones ejecutadas con capital real ni constituyen recomendaciones de inversión. Los resultados históricos no garantizan rendimientos futuros.";
