import { NextResponse } from "next/server";
import {
  fetchQuote,
  fetchProfile,
  fetchCompanyNews,
  fetchDailyCandlesRange,
} from "@/lib/mercados/finnhub";

export const revalidate = 300; // 5 min

function hoyISO(offsetDias = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDias);
  return d.toISOString().slice(0, 10);
}

export async function GET(request) {
  const symbol = new URL(request.url).searchParams.get("symbol");
  if (!symbol) {
    return NextResponse.json({ error: "Falta el parámetro symbol" }, { status: 400 });
  }

  const [quote, perfil, velas, noticias] = await Promise.all([
    fetchQuote(symbol),
    fetchProfile(symbol),
    fetchDailyCandlesRange(symbol, "1y"),
    fetchCompanyNews(symbol, hoyISO(-90), hoyISO()),
  ]);

  let rango52 = null;
  let volumenPromedio20 = null;
  if (velas && velas.length > 0) {
    const ultimoAnio = velas.slice(-252);
    const maximos = ultimoAnio.map((v) => v.high).filter((v) => typeof v === "number");
    const minimos = ultimoAnio.map((v) => v.low).filter((v) => typeof v === "number");
    if (maximos.length && minimos.length) {
      rango52 = { max: Math.max(...maximos), min: Math.min(...minimos) };
    }
    const ultimos20 = velas.slice(-20).map((v) => v.volume).filter((v) => typeof v === "number");
    if (ultimos20.length) {
      volumenPromedio20 = ultimos20.reduce((a, b) => a + b, 0) / ultimos20.length;
    }
  }

  return NextResponse.json({
    symbol,
    quote,
    perfil,
    rango52,
    volumenPromedio20,
    noticias,
    actualizado: new Date().toISOString(),
  });
}
