import { NextResponse } from "next/server";
import { TOOLKIT_PRODUCTOS } from "@/lib/toolkit";
import { LIBROS } from "@/lib/recursos";
import {
  ensureResenasSchema,
  listarResenasAprobadas,
  getPromedioEstrellas,
} from "@/lib/db";

function existeProducto(id) {
  return TOOLKIT_PRODUCTOS.some((p) => p.id === id) || LIBROS.some((l) => l.id === id);
}

export async function GET(request, { params }) {
  const { productoId } = await params;
  if (!existeProducto(productoId)) {
    return NextResponse.json({ error: "Producto no encontrado." }, { status: 404 });
  }

  await ensureResenasSchema();

  const [resenas, resumen] = await Promise.all([
    listarResenasAprobadas(productoId),
    getPromedioEstrellas(productoId),
  ]);

  return NextResponse.json({ resenas, resumen });
}
