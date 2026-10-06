import { NextResponse } from "next/server";
import { ensurePosturasSchema, listarComentariosPendientes, moderarComentario } from "@/lib/db";

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_MODERATION_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  await ensurePosturasSchema();
  const pendientes = await listarComentariosPendientes();
  return NextResponse.json({ pendientes });
}

export async function PATCH(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id, decision } = await request.json().catch(() => ({}));
  if (!id || !["aceptar", "rechazar"].includes(decision)) {
    return NextResponse.json({ error: "Falta id o la decisión no es válida." }, { status: 400 });
  }
  await ensurePosturasSchema();
  const actualizado = await moderarComentario(id, decision);
  if (!actualizado) {
    return NextResponse.json({ error: "El comentario ya no está pendiente." }, { status: 409 });
  }
  return NextResponse.json({ ok: true, comentario: actualizado });
}
