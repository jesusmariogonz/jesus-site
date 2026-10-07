import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import { get } from "@vercel/blob";
import { buscarProducto, getArchivoPreview } from "@/lib/toolkit";

/* Vista previa: primeras páginas del PDF del producto (guía/manual),
   para que el visitante vea el contenido real antes de comprar. Mismo
   patrón que /api/recursos/[id]/preview: el archivo completo vive en
   el store PRIVADO de Vercel Blob, aquí se lee con el SDK (nunca se
   expone la URL completa) y se devuelve solo un recorte. */

const PAGINAS_PREVIEW = 10;

export async function GET(_request, { params }) {
  const producto = buscarProducto(params.id);
  if (!producto) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  const archivo = getArchivoPreview(producto);
  if (!archivo) {
    return NextResponse.json({ error: "Este producto no tiene vista previa" }, { status: 404 });
  }

  let bytes;
  try {
    const resultado = await get(archivo.blobPath, { access: "private" });
    if (!resultado?.stream) throw new Error("blob sin stream");
    const res = new Response(resultado.stream);
    bytes = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.error("preview toolkit: error leyendo el PDF fuente:", err);
    return NextResponse.json({ error: "Archivo no disponible" }, { status: 502 });
  }

  let previewBytes;
  try {
    const fuente = await PDFDocument.load(bytes);
    const n = Math.min(PAGINAS_PREVIEW, fuente.getPageCount());
    const preview = await PDFDocument.create();
    const paginas = await preview.copyPages(fuente, Array.from({ length: n }, (_, i) => i));
    paginas.forEach((p) => preview.addPage(p));
    previewBytes = await preview.save();
  } catch (err) {
    console.error("preview toolkit: error recortando el PDF:", err);
    return NextResponse.json({ error: "No se pudo generar la vista previa" }, { status: 500 });
  }

  return new NextResponse(previewBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
