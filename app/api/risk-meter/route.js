import { NextResponse } from "next/server";
import { calcularMedidor } from "@/lib/risk/riskMeter";

// Se recalcula con datos frescos de Yahoo Finance como máximo cada hora; el CDN
// sirve la copia en caché y la refresca en segundo plano. No usa llaves ni base
// de datos: el historial se deriva de los precios con fórmulas fijas.
export const revalidate = 3600;

export async function GET() {
  try {
    const data = await calcularMedidor({ dias: 90, next: { revalidate: 3600 } });
    if (!data.ok) {
      return NextResponse.json(data, { status: 503, headers: { "Cache-Control": "s-maxage=300" } });
    }
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=21600" },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "No se pudo calcular el medidor en este momento." },
      { status: 503, headers: { "Cache-Control": "s-maxage=300" } }
    );
  }
}
