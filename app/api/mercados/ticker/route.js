import { NextResponse } from "next/server";
import { CINTA } from "@/lib/mercados/universo";
import { fetchQuote } from "@/lib/mercados/finnhub";

export const revalidate = 60;

export async function GET() {
  const items = await Promise.all(
    CINTA.map(async (a) => {
      const q = await fetchQuote(a.symbol);
      return { ...a, ...q };
    })
  );
  return NextResponse.json({ items });
}
