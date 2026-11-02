/* Conversión de USD a MXN para mostrar el dashboard de trading en
   pesos. El motor (algo_trading_platform) sigue operando y guardando
   todo en USD — esto es SOLO una capa de visualización, nunca toca el
   dato fuente. El tipo de cambio viene del snapshot exportado
   (usd_mxn_rate/usd_mxn_rate_fecha, ver src/paper_trading/export.py
   del otro repo), obtenido el mismo día vía una API real. Si ese día
   la API falló, el snapshot trae usd_mxn_rate: null — en ese caso
   NUNCA se inventa un tipo de cambio ni se reusa uno viejo: se
   degrada a mostrar USD con una nota explícita (ver usaPesos()). */

export function usaPesos(rate) {
  return typeof rate === "number" && rate > 0;
}

export function pesosDeUsd(usdValue, rate) {
  if (usdValue === null || usdValue === undefined || !usaPesos(rate)) return usdValue;
  return Math.round(usdValue * rate * 100) / 100;
}

export function formatMoney(value, { signo = false } = {}) {
  if (value === null || value === undefined) return "—";
  const s = signo && value > 0 ? "+" : "";
  return `${s}$${value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
