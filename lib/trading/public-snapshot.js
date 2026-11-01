import paperTrading from "@/lib/paper-trading-snapshot.json";
import research from "@/lib/trading-snapshot.json";

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
    riesgoPorOperacion: "1%",
    limitePerdidaDiaria: "1%",
    drawdownRevision: "6%",
  },
  mediano_plazo: {
    asignacionObjetivo: 33.33,
    estrategia: "Trend Following + Momentum/Breakout",
    riesgoPorOperacion: "1%",
    limitePerdidaDiaria: "1.5%",
    drawdownRevision: "10%",
  },
  riesgo_alto: {
    asignacionObjetivo: 23.33,
    estrategia: "Trend Following + Momentum/Breakout",
    riesgoPorOperacion: "2%",
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

  // Backtest: solo agregados por estrategia (nunca se mezcla con la curva
  // de paper trading). research.json es el snapshot manual sincronizado
  // desde los backtests/walk-forward del motor.
  const estrategiasBacktest = Object.entries(research?.strategies || {}).map(([id, data]) => {
    const summary = data?.backtest?.summary || [];
    const mejor = summary[0] || null;
    const promedio = summary.length
      ? round(summary.reduce((acc, r) => acc + (r.total_return_pct || 0), 0) / summary.length)
      : null;
    return {
      id,
      nombre: data.name,
      version: data.strategy_version,
      universeSize: data.backtest?.universe_size ?? null,
      mejorSimbolo: mejor?.symbol ?? null,
      mejorRetornoPct: mejor?.total_return_pct ?? null,
      retornoPromedioPct: promedio,
      fees: data.backtest?.fees ?? null,
      slippage: data.backtest?.slippage ?? null,
      walkForward: data.walk_forward || null,
    };
  });

  const generatedAt = paperTrading?.generated_at || null;
  const researchGeneratedAt = research?.generated_at || null;

  return {
    generatedAt,
    researchGeneratedAt,
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
    estrategiasBacktest,
    pendientesDelMotor: [
      "Aportaciones mensuales (USD/MXN): el motor todavía no exporta un historial de depósitos — el capital mostrado es solo el inicial de cada bucket.",
      "Time-Weighted Return ajustado por flujos: no aplica todavía porque no hay aportaciones registradas en el snapshot.",
      "Comparación contra benchmark SPY dentro del paper trading: hoy solo existe a nivel de backtest por estrategia, no como serie diaria del paper trading.",
    ],
  };
}

export const TRADING_DISCLAIMER =
  "Este proyecto tiene fines educativos y de investigación. Los resultados presentados corresponden a simulaciones históricas (backtesting) y a operaciones de paper trading. No representan operaciones ejecutadas con capital real ni constituyen recomendaciones de inversión. Los resultados históricos no garantizan rendimientos futuros.";
