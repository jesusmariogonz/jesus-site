import { NextResponse } from "next/server";
import snapshot from "@/lib/trading-snapshot.json";
import paperTrading from "@/lib/paper-trading-snapshot.json";

/* Igual que /api/admin/comentarios: clave simple en TRADING_DASHBOARD_SECRET,
   no es un sistema de usuarios — solo evita que cualquiera vea el panel.

   Hoy devuelve el snapshot manual de lib/trading-snapshot.json (generado
   a mano desde algo_trading_platform con cada corrida de backtest/
   walk-forward). Cuando ese motor exponga una API propia (ver
   docs/adr/0002-dashboard-hosting.md del otro repo), esta ruta cambia a
   hacer `fetch(process.env.TRADING_API_URL)` en vez de leer el JSON
   local — el frontend no necesita cambiar. */

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.TRADING_DASHBOARD_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  return NextResponse.json({
    ...snapshot,
    paperTrading,
    live: false,
  });
}
