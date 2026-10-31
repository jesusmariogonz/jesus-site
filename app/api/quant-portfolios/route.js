import { NextResponse } from "next/server";
import snapshot from "@/lib/quant-portfolios-snapshot.json";

/* Misma clave que /api/trading (TRADING_DASHBOARD_SECRET) — es el
   mismo panel privado, solo que estos 3 portafolios (Conservative
   Alpha / Balanced Growth / Aggressive Momentum) son un modelo
   DISTINTO y COEXISTENTE con los 4 buckets por horizonte, por
   decisión explícita del usuario — no un reemplazo. Ver
   algo_trading_platform/src/quant_portfolios/. */

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.TRADING_DASHBOARD_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  return NextResponse.json({ ...snapshot, live: false });
}
