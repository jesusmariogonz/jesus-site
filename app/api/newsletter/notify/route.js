import { NextResponse } from "next/server";
import { getPostsListado } from "@/lib/posts";
import { absUrl } from "@/lib/site";
import { sendNewPostBroadcast, sendKindleCopy } from "@/lib/resend";
import { markdownToHtml } from "@/lib/mdToHtml";
import { postToFacebookPage } from "@/lib/facebook";
import { postToLinkedIn } from "@/lib/linkedin";

/* ============================================================
   Aviso de nota nueva por correo
   ------------------------------------------------------------
   Cómo usarlo, cada que publiques una nota nueva:

   Visita en el navegador (o guárdalo como marcador/favorito):
   https://TU-SITIO/api/newsletter/notify?secret=TU_CLAVE

   Toma automáticamente la nota más reciente y le manda el aviso
   a todo el segmento de newsletter en Resend. TU_CLAVE es el
   valor que pongas en la variable de entorno
   NEWSLETTER_NOTIFY_SECRET (en Vercel).
   ============================================================ */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const expected = process.env.NEWSLETTER_NOTIFY_SECRET;

  if (!expected) {
    return NextResponse.json(
      { error: "Falta configurar NEWSLETTER_NOTIFY_SECRET en Vercel." },
      { status: 500 }
    );
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  // Excluye notas de Pulso de Mercado y ocultas: no queremos mandar un
  // correo cada vez que se publica un briefing diario de mercados.
  const [ultima] = getPostsListado();
  if (!ultima) {
    return NextResponse.json({ error: "No hay notas publicadas." }, { status: 404 });
  }

  try {
    await sendNewPostBroadcast({
      titulo: ultima.titulo,
      resumen: ultima.resumen,
      url: absUrl(`/blog/${ultima.slug}`),
      imagen: ultima.imagen ? absUrl(ultima.imagen) : null,
    });
    try {
      // Falla independiente del newsletter: si el Kindle rechaza el
      // remitente o no está configurado, no debe tumbar el aviso ya enviado.
      await sendKindleCopy({
        titulo: ultima.titulo,
        resumen: ultima.resumen,
        url: absUrl(`/blog/${ultima.slug}`),
        contenidoHtml: markdownToHtml(ultima.content || ""),
      });
    } catch (kindleErr) {
      console.error("newsletter/notify (kindle):", kindleErr);
    }
    try {
      // Falla independiente: si Facebook rechaza el token o no está
      // configurado, no debe tumbar el resto del aviso ya enviado.
      await postToFacebookPage({
        titulo: ultima.titulo,
        resumen: ultima.resumen,
        url: absUrl(`/blog/${ultima.slug}`),
        imagenUrl: ultima.imagen ? absUrl(ultima.imagen) : null,
      });
    } catch (fbErr) {
      console.error("newsletter/notify (facebook):", fbErr);
    }
    try {
      // Falla independiente: si LinkedIn rechaza el token o no está
      // configurado, no debe tumbar el resto del aviso ya enviado.
      await postToLinkedIn({
        titulo: ultima.titulo,
        resumen: ultima.resumen,
        url: absUrl(`/blog/${ultima.slug}`),
        imagenUrl: ultima.imagen ? absUrl(ultima.imagen) : null,
      });
    } catch (liErr) {
      console.error("newsletter/notify (linkedin):", liErr);
    }
    return NextResponse.json({
      ok: true,
      enviado: ultima.titulo,
      slug: ultima.slug,
    });
  } catch (err) {
    console.error("newsletter/notify:", err);
    return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
  }
}
