import { NextResponse } from "next/server";
import {
  ensurePosturasSchema,
  listarComentariosPendientes,
  moderarComentario,
  ensureResenasSchema,
  listarResenasPendientes,
  moderarResena,
} from "@/lib/db";

function autorizado(request) {
  const secret = request.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_MODERATION_SECRET;
  return Boolean(expected) && secret === expected;
}

export async function GET(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  await Promise.all([ensurePosturasSchema(), ensureResenasSchema()]);
  const [pendientes, resenasPendientes] = await Promise.all([
    listarComentariosPendientes(),
    listarResenasPendientes(),
  ]);
  return NextResponse.json({ pendientes, resenasPendientes });
}

export async function PATCH(request) {
  if (!autorizado(request)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }
  const { id, decision, tipo } = await request.json().catch(() => ({}));
  if (!id || !["aceptar", "rechazar"].includes(decision)) {
    return NextResponse.json({ error: "Falta id o la decisión no es válida." }, { status: 400 });
  }

  if (tipo === "resena") {
    await ensureResenasSchema();
    const actualizado = await moderarResena(id, decision);
    if (!actualizado) {
      return NextResponse.json({ error: "La reseña ya no está pendiente." }, { status: 409 });
    }
    return NextResponse.json({ ok: true, resena: actualizado });
  }

  await ensurePosturasSchema();
  const actualizado = await moderarComentario(id, decision);
  if (!actualizado) {
    return NextResponse.json({ error: "El comentario ya no está pendiente." }, { status: 409 });
  }
  return NextResponse.json({ ok: true, comentario: actualizado });
}
