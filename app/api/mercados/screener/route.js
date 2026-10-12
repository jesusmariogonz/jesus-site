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

// Horizontes fijos que se calculan siempre en el servidor — el selector de
// horizonte del cliente solo elige cuál de estos mostrar/ordenar (más
// "Personalizado", que se calcula en el cliente a partir del historial
// completo que ya se manda, sin pedir otra vez al servidor).
const HORIZONTES = { h1m: 21, h3m: 63, h6m: 126, h12m: 252 };

// El plan gratuito de Finnhub permite ~60 llamadas/minuto. Con un universo
// de ~94 activos, pedir todas las cotizaciones de golpe (Promise.all sobre
// todo UNIVERSO) dispara más de 60 llamadas en el mismo segundo y una parte
// vuelve con 429 — no rompe nada (fetchQuote ya devuelve null en ese caso,
// y la fila queda como "no disponible"), pero es evitable: se procesa en
// lotes de TAMANO_LOTE con una pausa entre lotes para quedar bajo el límite.
const TAMANO_LOTE = 50;
const PAUSA_ENTRE_LOTES_MS = 1100;

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  const procesarActivo = async (a) => {
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
        // El histórico completo (5 años OHLCV) para el comparador ya NO se
        // manda aquí — con ~94 activos en el universo sería varios MB de
        // JSON en cada carga de página. Se pide bajo demanda por símbolo en
        // /api/mercados/historial cuando el usuario lo marca para comparar.
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
  };

  const rows = [];
  for (let i = 0; i < UNIVERSO.length; i += TAMANO_LOTE) {
    const lote = UNIVERSO.slice(i, i + TAMANO_LOTE);
    const resultadosLote = await Promise.all(lote.map(procesarActivo));
    rows.push(...resultadosLote);
    if (i + TAMANO_LOTE < UNIVERSO.length) await esperar(PAUSA_ENTRE_LOTES_MS);
  }

  return NextResponse.json({
    rows,
    horizontesDisponibles: Object.keys(HORIZONTES),
    actualizado: new Date().toISOString(),
  });
}
