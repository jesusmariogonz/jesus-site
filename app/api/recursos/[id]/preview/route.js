import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { PDFDocument } from "pdf-lib";
import { get } from "@vercel/blob";
import { LIBROS } from "@/lib/recursos";

/* Vista previa: primeras 10 páginas de un libro, para enganchar la
   venta antes de pedir compra/descarga. El PDF completo de los
   libros de pago vive en el store PRIVADO de Vercel Blob — aquí lo
   leemos con el SDK (nunca se expone la URL del archivo completo) y
   devolvemos solo un recorte de las primeras páginas. */

const PAGINAS_PREVIEW = 10;

export async function GET(_request, { params }) {
  const libro = LIBROS.find((l) => l.id === params.id);
  if (!libro) {
    return NextResponse.json({ error: "Recurso no encontrado" }, { status: 404 });
  }

  let bytes;
  try {
    if (libro.archivo) {
      bytes = await readFile(path.join(process.cwd(), "public", libro.archivo));
    } else if (libro.archivos?.[0]?.blobPath) {
      const resultado = await get(libro.archivos[0].blobPath, { access: "private" });
      if (!resultado?.stream) throw new Error("blob sin stream");
      const res = new Response(resultado.stream);
      bytes = Buffer.from(await res.arrayBuffer());
    } else {
      return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });
    }
  } catch (err) {
    console.error("preview: error leyendo el PDF fuente:", err);
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
    console.error("preview: error recortando el PDF:", err);
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
