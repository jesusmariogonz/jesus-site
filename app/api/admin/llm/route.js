import { NextResponse } from "next/server";
import { ensureLlmSchema, metricasLlm } from "@/lib/db";

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_MODERATION_SECRET;
  return Boolean(expected) && secret === expected;
}

export const dynamic = "force-dynamic";

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const dias = Math.min(Math.max(parseInt(new URL(request.url).searchParams.get("dias") || "30", 10) || 30, 1), 365);
  await ensureLlmSchema();
  return NextResponse.json(await metricasLlm(dias));
}
