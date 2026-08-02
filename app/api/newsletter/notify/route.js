import { NextResponse } from "next/server";
import { getPosts } from "@/lib/posts";
import { absUrl } from "@/lib/site";
import { sendNewPostBroadcast } from "@/lib/resend";

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

  const [ultima] = getPosts();
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
