import { NextResponse } from "next/server";
import { getPost } from "@/lib/posts";
import { ensurePosturasSchema, crearComentario } from "@/lib/db";
import { clasificarComentario } from "@/lib/moderacion";

const NOMBRE_MAX = 60;
const TEXTO_MAX = 1000;

export async function POST(request) {
  const { slug, nombre, texto } = await request.json().catch(() => ({}));

  if (!slug || !texto || !texto.trim()) {
    return NextResponse.json({ error: "Falta el comentario." }, { status: 400 });
  }
  if (texto.length > TEXTO_MAX) {
    return NextResponse.json({ error: `El comentario no puede pasar de ${TEXTO_MAX} caracteres.` }, { status: 400 });
  }

  const post = getPost(slug);
  if (!post?.postura) {
    return NextResponse.json({ error: "Esta nota no tiene postura de debate." }, { status: 404 });
  }

  const nombreFinal = (nombre || "").trim().slice(0, NOMBRE_MAX) || "Anónimo";

  await ensurePosturasSchema();

  const { clasificacion, justificacion } = await clasificarComentario(texto.trim());
  const estado = clasificacion === "limpio" ? "aprobado" : clasificacion === "toxico" ? "rechazado" : "pendiente";

  const comentario = await crearComentario({
    slug,
    nombre: nombreFinal,
    texto: texto.trim(),
    estado,
    clasificacion,
    justificacion,
  });

  let mensaje;
  if (estado === "aprobado") mensaje = "Tu comentario ya está publicado.";
  else if (estado === "pendiente") mensaje = "Tu comentario quedó en revisión antes de publicarse.";
  else mensaje = "Tu comentario no se pudo publicar.";

  return NextResponse.json({
    ok: estado !== "rechazado",
    estado,
    mensaje,
    comentario: estado === "aprobado" ? comentario : null,
  });
}
