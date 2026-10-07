import { NextResponse } from "next/server";
import { TOOLKIT_PRODUCTOS } from "@/lib/toolkit";
import { LIBROS } from "@/lib/recursos";
import { ensureResenasSchema, crearResena } from "@/lib/db";
import { clasificarComentario } from "@/lib/moderacion";

const NOMBRE_MAX = 60;
const TEXTO_MAX = 1000;

function existeProducto(id) {
  return TOOLKIT_PRODUCTOS.some((p) => p.id === id) || LIBROS.some((l) => l.id === id);
}

export async function POST(request) {
  const { productoId, nombre, estrellas, texto } = await request.json().catch(() => ({}));

  if (!productoId || !existeProducto(productoId)) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }
  const estrellasNum = Number(estrellas);
  if (!Number.isInteger(estrellasNum) || estrellasNum < 1 || estrellasNum > 5) {
    return NextResponse.json({ error: "La calificación debe ser de 1 a 5 estrellas." }, { status: 400 });
  }
  if (!texto || !texto.trim()) {
    return NextResponse.json({ error: "Falta el comentario." }, { status: 400 });
  }
  if (texto.length > TEXTO_MAX) {
    return NextResponse.json({ error: `El comentario no puede pasar de ${TEXTO_MAX} caracteres.` }, { status: 400 });
  }

  const nombreFinal = (nombre || "").trim().slice(0, NOMBRE_MAX) || "Anónimo";

  await ensureResenasSchema();

  const { clasificacion, justificacion } = await clasificarComentario(texto.trim());
  const estado = clasificacion === "limpio" ? "aprobado" : clasificacion === "toxico" ? "rechazado" : "pendiente";

  const resena = await crearResena({
    productoId,
    nombre: nombreFinal,
    estrellas: estrellasNum,
    texto: texto.trim(),
    estado,
    clasificacion,
    justificacion,
  });

  let mensaje;
  if (estado === "aprobado") mensaje = "¡Gracias! Tu reseña ya está publicada.";
  else if (estado === "pendiente") mensaje = "Tu reseña quedó en revisión antes de publicarse.";
  else mensaje = "Tu reseña no se pudo publicar.";

  return NextResponse.json({
    ok: estado !== "rechazado",
    estado,
    mensaje,
    resena: estado === "aprobado" ? resena : null,
  });
}
