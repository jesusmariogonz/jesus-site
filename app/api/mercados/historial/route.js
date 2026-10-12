import { NextResponse } from "next/server";
import { fetchDailyCandlesRange } from "@/lib/mercados/finnhub";

export const revalidate = 3600; // 1h — el histórico diario no cambia más seguido que eso

const DIAS_5A = 1260; // ~252 ruedas/año × 5

/** Histórico OHLCV completo de UN activo, bajo demanda — separado del
 *  listado principal del screener para no mandar 5 años de velas de los
 *  ~94 activos del universo en cada carga de página (sería varios MB de
 *  JSON para datos que la mayoría de las visitas nunca usa). Se pide solo
 *  cuando el usuario marca un activo en el comparador. */
export async function GET(request) {
  const symbol = new URL(request.url).searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Falta el parámetro symbol" }, { status: 400 });
  }

  const velas = await fetchDailyCandlesRange(symbol, "10y");
  if (!velas) {
    return NextResponse.json({ symbol, historial: null });
  }

  // Formato de cada punto: [fecha, apertura, máximo, mínimo, cierre, volumen].
  // Colchón de +200 ruedas sobre los 5 años para que la SMA 200 se pueda
  // calcular incluso en el primer punto visible de la ventana 5A del comparador.
  const historial = velas
    .slice(-(DIAS_5A + 200))
    .map((v) => [v.date, v.open, v.high, v.low, v.close, v.volume]);

  return NextResponse.json({ symbol, historial });
}
