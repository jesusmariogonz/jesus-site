import { NextResponse } from "next/server";
import { UNIVERSO } from "@/lib/mercados/universo";
import { fetchQuote, fetchDailyCandlesRange } from "@/lib/mercados/finnhub";
import {
  retornoPeriodo,
  retornoYVolatilidad,
  distanciaSMA,
  pendienteSMA,
  atrPct,
  volumenRelativo,
  liquidezPromedio,
  distanciaMaximoReciente,
  distanciaMinimoReciente,
  estructuraTendencia,
} from "@/lib/mercados/indicadores";

export const revalidate = 300; // 5 min — no consumir el límite de Finnhub de más

const DIAS_5A = 1260; // ~252 ruedas/año × 5
// Horizontes fijos que se calculan siempre en el servidor — el selector de
// horizonte del cliente solo elige cuál de estos mostrar/ordenar (más
// "Personalizado", que se calcula en el cliente a partir del historial
// completo que ya se manda, sin pedir otra vez al servidor).
const HORIZONTES = { h1m: 21, h3m: 63, h6m: 126, h12m: 252 };

export async function GET() {
  // Benchmark (S&P 500 vía SPY) para "fuerza relativa vs. mercado", en los
  // mismos horizontes que se calculan para cada activo.
  const velasSpy = await fetchDailyCandlesRange("SPY", "10y");
  const cierresSpy = velasSpy?.map((v) => v.close) || null;
  const retornoSpyPorHorizonte = Object.fromEntries(
    Object.entries(HORIZONTES).map(([clave, dias]) => [
      clave,
      cierresSpy ? retornoPeriodo(cierresSpy, dias) : null,
    ])
  );

  const rows = await Promise.all(
    UNIVERSO.map(async (a) => {
      const [quote, velas] = await Promise.all([
        fetchQuote(a.symbol),
        fetchDailyCandlesRange(a.symbol, "10y"),
      ]);

      const cierres = velas?.map((v) => v.close) || null;
      const maximos = velas?.map((v) => v.high) || null;
      const minimos = velas?.map((v) => v.low) || null;
      const volumenes = velas?.map((v) => v.volume) || null;
      const stats = cierres ? retornoYVolatilidad(cierres.slice(-180)) : null;
      const sharpe =
        stats && stats.volatilidadAnualizada > 0
          ? (stats.retornoAnualizado - 0.045) / stats.volatilidadAnualizada // 4.5% tasa libre de riesgo (Cetes 28d aprox.), fija y documentada en UI
          : null;

      const retornoPorHorizonte = Object.fromEntries(
        Object.entries(HORIZONTES).map(([clave, dias]) => [
          clave,
          cierres ? retornoPeriodo(cierres, dias) : null,
        ])
      );
      const fuerzaRelativaPorHorizonte = Object.fromEntries(
        Object.entries(HORIZONTES).map(([clave]) => {
          const ret = retornoPorHorizonte[clave];
          const retSpy = retornoSpyPorHorizonte[clave];
          return [clave, ret != null && retSpy != null ? ret - retSpy : null];
        })
      );

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
        // Datos para el comparador (gráfica + indicadores). Se manda algo
        // más de 5 años (+200 ruedas de colchón) para que la SMA 200 se
        // pueda calcular incluso en el primer punto visible de la ventana 5A.
        // Formato de cada punto: [fecha, apertura, máximo, mínimo, cierre, volumen].
        historial: velas
          ? velas
              .slice(-(DIAS_5A + 200))
              .map((v) => [v.date, v.open, v.high, v.low, v.close, v.volume])
          : null,
        indicadores: {
          // Por horizonte (el selector de horizonte del cliente elige cuál mostrar):
          retorno: retornoPorHorizonte,
          fuerzaRelativa: fuerzaRelativaPorHorizonte,
          // Técnicos, de parámetro fijo (no cambian con el horizonte):
          distanciaSMA50: cierres ? distanciaSMA(cierres, 50) : null,
          distanciaSMA200: cierres ? distanciaSMA(cierres, 200) : null,
          pendienteSMA200: cierres ? pendienteSMA(cierres, 200, 20) : null,
          volatilidadAnualizada: stats?.volatilidadAnualizada ?? null,
          atrPct: cierres && maximos && minimos ? atrPct(maximos, minimos, cierres, 14) : null,
          volumenRelativo: volumenes ? volumenRelativo(volumenes, 20) : null,
          liquidezPromedio: cierres && volumenes ? liquidezPromedio(cierres, volumenes, 20) : null,
          distanciaMaximo52s: cierres && maximos ? distanciaMaximoReciente(cierres, maximos, 252) : null,
          distanciaMinimo52s: cierres && minimos ? distanciaMinimoReciente(cierres, minimos, 252) : null,
          estructuraTendencia: maximos && minimos ? estructuraTendencia(maximos, minimos, 40) : null,
          // Compatibilidad con el comparador existente (mismo signo que
          // distanciaSMA200):
          tendenciaAlcista: (() => {
            const d = cierres ? distanciaSMA(cierres, 200) : null;
            return d == null ? null : d > 0;
          })(),
        },
      };
    })
  );

  return NextResponse.json({
    rows,
    horizontesDisponibles: Object.keys(HORIZONTES),
    actualizado: new Date().toISOString(),
  });
}
