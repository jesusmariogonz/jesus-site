/* Catálogo unificado del Strategy Lab: une estrategias de trading
   (bitácora de ADRs de algo_trading_platform, ya vigente/descartada en
   producción) con candidatas de investigación (Research Lab, pulso-research-
   lab). No calcula ningún "score" — cada fila cita su fuente real y su
   estado tal cual ya está documentado ahí, para no inventar una confianza
   que todavía no existe. Se completa conforme se publiquen más
   experimentos y ADRs, nunca de golpe. */

// EN_PRODUCCION | DESCARTADA | CANDIDATA (research, sin promover)
export const ESTRATEGIAS_TRADING = [
  {
    id: "STR-T01",
    nombre: "Time-Series Momentum + filtro Cross-Sectional",
    bucket: "Largo Plazo",
    origen: "ADR 0007, 0034",
    estado: "EN_PRODUCCION",
    resumen:
      "Momentum de serie de tiempo sobre 26 ETFs, con un filtro adicional (ADR 0034) que exige percentil ≥70 de retorno relativo del universo antes de entrar — de 2 hipótesis que sobrevivieron una investigación de 10 vía walk-forward.",
    evidencia: "Walk-forward: Sharpe 1.33 → 2.25, retorno 8.91% → 19.14%, 0 de 5 ventanas con pérdida (antes 1 de 5).",
    href: "/pulso-mercado/trading/bitacora#adr-0034",
  },
  {
    id: "STR-T02",
    nombre: "Trend Following + Momentum/Breakout",
    bucket: "Mediano Plazo",
    origen: "Configuración original de producción",
    estado: "EN_PRODUCCION",
    resumen: "Seguimiento de tendencia sobre 74 símbolos, sin el filtro adicional de ADR 0034 (ese filtro solo se implementó para Largo Plazo).",
    evidencia: "Parte de la configuración de 3 buckets validada en EXP-003 (ver Research Lab).",
    href: "/pulso-mercado/trading",
  },
  {
    id: "STR-T03",
    nombre: "Trend Following + Momentum/Breakout",
    bucket: "Riesgo Alto",
    origen: "Configuración original de producción",
    estado: "EN_PRODUCCION",
    resumen: "Mismo tipo de estrategia que Mediano Plazo, sobre un universo de 45 símbolos de mayor volatilidad y límites de riesgo más amplios.",
    evidencia: "EXP-003 (Capa 2) encontró sesgo de supervivencia material en este bucket: 26.21% vs. 11.57% anual contra un universo neutral — riesgo conocido, no corregido.",
    href: "/pulso-mercado/research/exp-003-validacion-motor-produccion",
  },
  {
    id: "STR-T04",
    nombre: "Mean Reversion RSI(2)",
    bucket: "—",
    origen: "ADR 0019 → 0026 → 0027",
    estado: "DESCARTADA",
    resumen:
      "Llegó a operar con capital real como 4to bucket (35% de asignación) tras medir correlación de 0.142 con el resto del sistema. Una validación walk-forward más rigurosa después encontró que no sostenía su propia evidencia.",
    evidencia: "Backtest original +43.61% no reproducible (+19.09% al repetirlo); Sharpe OOS promedio -0.032, 2 de 5 ventanas con pérdida.",
    href: "/pulso-mercado/trading/bitacora#adr-0027",
  },
  {
    id: "STR-T05",
    nombre: "Donchian Breakout",
    bucket: "—",
    origen: "ADR 0018",
    estado: "DESCARTADA",
    resumen: "Competía por el mismo cupo de símbolos que Momentum/Breakout y le ganaba la mayoría de las entradas, diluyendo la estrategia que ya funcionaba.",
    evidencia: "Empeoró el retorno sin mejorar el drawdown frente a la configuración vigente.",
    href: "/pulso-mercado/trading/bitacora#adr-0018",
  },
  {
    id: "STR-T06",
    nombre: "Risk Parity (sizing)",
    bucket: "—",
    origen: "ADR 0018",
    estado: "DESCARTADA",
    resumen: "Sobre-asignaba a Largo Plazo (el bucket más débil) por confundir baja volatilidad con buena relación riesgo/retorno.",
    evidencia: "Empeoró el retorno sin mejorar el drawdown; en el camino se encontró un bug de rebalanceo que inflaba el resultado a +103,254% antes de corregirse.",
    href: "/pulso-mercado/trading/bitacora#adr-0018",
  },
];

// Candidatas de Research Lab que podrían, en el futuro, promoverse a
// producción — ninguna lo ha hecho todavía. El estado es el mismo que ya
// vive en lib/research/experimentos.js (fuente única de verdad, no se
// duplica el valor a mano aquí salvo para los campos propios de esta vista).
export const ESTRATEGIAS_CANDIDATAS = [
  {
    expSlug: "exp-005-reverse-winners",
    nombre: "Reverse Winners (momentum con volatilidad)",
    etapa: "Validación forward en curso",
  },
  {
    expSlug: "exp-002-growth-max-global",
    nombre: "Growth-Max Global (apalancamiento + rotación macro)",
    etapa: "Cerrado — no superó el benchmark 60/40",
  },
  {
    expSlug: "exp-001-modelo-de-emergencia",
    nombre: "Índice de estrés multifactor (modelo de emergencia)",
    etapa: "Cerrado — congelado, no es una regla de entrada/salida",
  },
];

export const COLOR_ESTADO_ESTRATEGIA = {
  EN_PRODUCCION: "#16a34a",
  DESCARTADA: "#dc2626",
  CANDIDATA: "#eab308",
};

export const ETIQUETA_ESTADO_ESTRATEGIA = {
  EN_PRODUCCION: "En producción",
  DESCARTADA: "Descartada",
  CANDIDATA: "Candidata",
};
