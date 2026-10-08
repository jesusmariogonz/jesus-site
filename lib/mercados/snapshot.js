/* ============================================================
   Market Snapshot con datos reales — reemplaza la dependencia de que
   la Routine del Daily "encuentre" los cierres buscando en la web.
   ------------------------------------------------------------
   La Routine de Pulso de Mercado escribe el Market Snapshot buscando
   en internet cada mañana; cuando sus búsquedas devuelven resultados
   contradictorios (pasó varios días en octubre 2026), prefiere dejar
   "—" en vez de inventar — correcto, pero deja la tabla en blanco.

   Este módulo trae los mismos 9 indicadores directo de Yahoo Finance
   (mismo endpoint ya usado por el Screener en lib/mercados/finnhub.js,
   confirmado que responde desde Vercel sin clave ni costo), así que
   el nivel y el % de cambio no dependen de que una IA busque bien.
   Si Yahoo no responde para algún símbolo, esa fila cae de vuelta al
   Market Snapshot que escribió la Routine (con su propio respaldo,
   ver completarMarketSnapshot en lib/posts.js) — nunca se inventa.
   ============================================================ */

import { fetchDailyCandles } from "@/lib/mercados/finnhub";

// symbol: ticker de Yahoo Finance. formato: cómo mostrar el nivel.
const ACTIVOS_SNAPSHOT = [
  { activo: "S&P 500", symbol: "^GSPC", formato: "indice" },
  { activo: "Nasdaq Composite", symbol: "^IXIC", formato: "indice" },
  { activo: "Dow Jones", symbol: "^DJI", formato: "indice" },
  { activo: "Russell 2000", symbol: "^RUT", formato: "indice" },
  { activo: "VIX", symbol: "^VIX", formato: "decimal" },
  { activo: "S&P/BMV IPC", symbol: "^MXX", formato: "indice" },
  { activo: "USD/MXN", symbol: "MXN=X", formato: "fx" },
  { activo: "US 10Y", symbol: "^TNX", formato: "yield" },
  { activo: "WTI", symbol: "CL=F", formato: "dolar" },
];

function formatearNivel(valor, formato) {
  if (formato === "indice") {
    return valor.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (formato === "yield") return `${valor.toFixed(3)}%`;
  if (formato === "fx") return valor.toFixed(2);
  if (formato === "dolar") return valor.toFixed(2);
  return valor.toFixed(2); // decimal (VIX)
}

/** Para cada activo del Market Snapshot, trae su último cierre real +
 *  % de cambio vs. el cierre anterior desde Yahoo Finance. Devuelve un
 *  mapa { activo: { nivel, cambio, fecha } | null } — null cuando
 *  Yahoo no responde para ese símbolo (el llamador decide el respaldo,
 *  nunca inventa aquí). */
export async function fetchMarketSnapshotReal() {
  const resultados = await Promise.all(
    ACTIVOS_SNAPSHOT.map(async ({ activo, symbol, formato, divisor }) => {
      const velas = await fetchDailyCandles(symbol, 5);
      if (!velas || velas.length < 2) return [activo, null];

      const ultima = velas[velas.length - 1];
      const anterior = velas[velas.length - 2];
      const cierre = divisor ? ultima.close / divisor : ultima.close;
      const cierreAnterior = divisor ? anterior.close / divisor : anterior.close;
      const cambioPct = ((cierre - cierreAnterior) / cierreAnterior) * 100;

      return [
        activo,
        {
          nivel: formatearNivel(cierre, formato),
          cambio: `${cambioPct >= 0 ? "+" : ""}${cambioPct.toFixed(2)}%`,
          fecha: ultima.date,
        },
      ];
    })
  );
  return Object.fromEntries(resultados);
}
