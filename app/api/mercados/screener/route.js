import { NextResponse } from "next/server";
import { UNIVERSO } from "@/lib/mercados/universo";
import { fetchQuote, fetchDailyCandles, calcularRetornoYVolatilidad } from "@/lib/mercados/finnhub";

export const revalidate = 300; // 5 min — no consumir el límite de Finnhub de más

export async function GET() {
  const rows = await Promise.all(
    UNIVERSO.map(async (a) => {
      const [quote, candles] = await Promise.all([
        fetchQuote(a.symbol),
        fetchDailyCandles(a.symbol, 180),
      ]);

      const cierres = candles?.map((c) => c.close) || null;
      const stats = cierres ? calcularRetornoYVolatilidad(cierres) : null;
      const sharpe =
        stats && stats.volatilidadAnualizada > 0
          ? (stats.retornoAnualizado - 0.045) / stats.volatilidadAnualizada // 4.5% tasa libre de riesgo (Cetes 28d aprox.), fija y documentada en UI
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
      };
    })
  );

  return NextResponse.json({ rows, actualizado: new Date().toISOString() });
}
