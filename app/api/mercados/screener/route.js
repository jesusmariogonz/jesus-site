import { NextResponse } from "next/server";
import { UNIVERSO } from "@/lib/mercados/universo";
import {
  fetchQuote,
  fetchDailyCandlesRange,
  calcularRetornoYVolatilidad,
  calcularSMA,
} from "@/lib/mercados/finnhub";

export const revalidate = 300; // 5 min — no consumir el límite de Finnhub de más

const DIAS_3A = 756; // ~252 ruedas/año × 3

function retornoDesde(cierres, diasAtras) {
  if (!cierres || cierres.length <= diasAtras) return null;
  const actual = cierres[cierres.length - 1];
  const pasado = cierres[cierres.length - 1 - diasAtras];
  if (!actual || !pasado) return null;
  return (actual / pasado - 1) * 100;
}

export async function GET() {
  // Benchmark (S&P 500 vía SPY) para "fuerza relativa vs. mercado".
  const velasSpy = await fetchDailyCandlesRange("SPY", "5y");
  const cierresSpy = velasSpy?.map((v) => v.close) || null;
  const retornoSpy12m = cierresSpy ? retornoDesde(cierresSpy, 252) : null;

  const rows = await Promise.all(
    UNIVERSO.map(async (a) => {
      const [quote, velas] = await Promise.all([
        fetchQuote(a.symbol),
        fetchDailyCandlesRange(a.symbol, "5y"),
      ]);

      const cierres = velas?.map((v) => v.close) || null;
      const volumenes = velas?.map((v) => v.volume) || null;
      const stats = cierres ? calcularRetornoYVolatilidad(cierres.slice(-180)) : null;
      const sharpe =
        stats && stats.volatilidadAnualizada > 0
          ? (stats.retornoAnualizado - 0.045) / stats.volatilidadAnualizada // 4.5% tasa libre de riesgo (Cetes 28d aprox.), fija y documentada en UI
          : null;

      // Indicadores adicionales del comparador — todos calculados a partir
      // de precio/volumen reales (Yahoo Finance). Los que requieren datos
      // fundamentales (ingresos, EPS, ROIC, P/E forward) no se incluyen:
      // no hay fuente gratuita confiable conectada todavía para esos — ver nota en UI.
      const n = cierres?.length ?? 0;
      const sma200Hoy = cierres ? calcularSMA(cierres, 200) : null;
      const sma200Hace20 = cierres && n > 20 ? calcularSMA(cierres, 200, n - 1 - 20) : null;
      const precioActual = cierres ? cierres[n - 1] : null;
      const retorno12m = cierres ? retornoDesde(cierres, 252) : null;
      const fuerzaRelativa =
        retorno12m != null && retornoSpy12m != null ? retorno12m - retornoSpy12m : null;
      const tendenciaAlcista =
        precioActual != null && sma200Hoy != null ? precioActual > sma200Hoy : null;
      const sma200Pendiente =
        sma200Hoy != null && sma200Hace20 != null ? sma200Hoy - sma200Hace20 : null;
      const liquidezPromedio =
        volumenes && cierres && n >= 20
          ? (() => {
              let suma = 0;
              let dias = 0;
              for (let i = n - 20; i < n; i++) {
                if (typeof volumenes[i] === "number" && typeof cierres[i] === "number") {
                  suma += volumenes[i] * cierres[i];
                  dias++;
                }
              }
              return dias > 0 ? suma / dias : null;
            })()
          : null;

      return {
        symbol: a.symbol,
        name: a.name,
        sector: a.sector,
        mercado: a.mercado,
        price: quote?.price ?? null,
        changePct: quote?.changePct ?? null,
        retornoAnualizado: stats?.retornoAnualizado ?? null,
        volatilidadAnualizada: stats?.volatilidadAnualizada ?? null,
        sharpe,
        sparkline: cierres ? cierres.slice(-30) : null,
        disponible: Boolean(quote),
        // Datos para el comparador (gráfica + indicadores):
        historial: velas ? velas.slice(-DIAS_3A).map((v) => [v.date, v.close]) : null,
        indicadores: {
          retorno12m,
          fuerzaRelativa,
          tendenciaAlcista,
          sma200Pendiente,
          volatilidadAnualizada: stats?.volatilidadAnualizada ?? null,
          liquidezPromedio,
        },
      };
    })
  );

  return NextResponse.json({ rows, actualizado: new Date().toISOString() });
}
