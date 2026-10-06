import { NextResponse } from "next/server";

export async function GET() {
  const url = "https://stooq.com/q/d/l/?s=nvda.us&i=d";
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/csv,*/*",
      },
    });
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
