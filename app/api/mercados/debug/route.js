import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://stooq.com/q/d/l/?s=nvda.us&i=d";
  try {
    const res = await fetch(url, { cache: "no-store" });
    const text = await res.text();
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      bodyPreview: text.slice(0, 500),
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) });
  }
}
