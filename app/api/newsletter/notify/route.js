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

   Parámetros opcionales, para recuperar un envío que falló o que
   salió mal (ej. una carrera de despliegues hizo que se tomara la
   nota equivocada) sin repetir TODO el aviso:
   - canal=facebook,linkedin  → solo dispara esos canales (valores:
     newsletter, kindle, facebook, linkedin; separados por coma).
   - slug=mi-nota             → usa esa nota en vez de "la más
     reciente" (por si el deploy que sirvió la corrida automática
     estaba momentáneamente desactualizado).
   ============================================================ */

const CANALES_VALIDOS = ["newsletter", "kindle", "facebook", "linkedin"];

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

  const canalParam = searchParams.get("canal");
  const canales = canalParam
    ? canalParam.split(",").map((c) => c.trim().toLowerCase()).filter((c) => CANALES_VALIDOS.includes(c))
    : CANALES_VALIDOS;

  const slugParam = searchParams.get("slug");
  const listado = getPostsListado();
  // Excluye notas de Pulso de Mercado y ocultas: no queremos mandar un
  // correo cada vez que se publica un briefing diario de mercados.
  const ultima = slugParam
    ? listado.find((p) => p.slug === slugParam)
    : listado[0];
  if (!ultima) {
    // Si vino un slug explícito (ej. desde el GitHub Action) y no aparece
    // en el listado, lo más probable es que sea una nota de Pulso de
    // Mercado/oculta (nunca se avisan) o que el deploy todavía no la tenga
    // — en ambos casos, no es un error: simplemente no hay nada que avisar.
    return NextResponse.json({
      ok: true,
      enviado: null,
      motivo: slugParam
        ? `"${slugParam}" no está en el listado avisable (Pulso de Mercado/oculta) o el deploy aún no la tiene.`
        : "No hay notas publicadas.",
    });
  }

  const url = absUrl(`/blog/${ultima.slug}`);
  const imagen = ultima.imagen ? absUrl(ultima.imagen) : null;
  const resultado = { ok: true, enviado: ultima.titulo, slug: ultima.slug, canales };

  if (canales.includes("newsletter")) {
    try {
      await sendNewPostBroadcast({ titulo: ultima.titulo, resumen: ultima.resumen, url, imagen });
    } catch (err) {
      console.error("newsletter/notify (newsletter):", err);
      return NextResponse.json({ error: String(err.message || err) }, { status: 500 });
    }
  }
  if (canales.includes("kindle")) {
    try {
      // Falla independiente del newsletter: si el Kindle rechaza el
      // remitente o no está configurado, no debe tumbar el aviso ya enviado.
      await sendKindleCopy({
        titulo: ultima.titulo,
        resumen: ultima.resumen,
        url,
        contenidoHtml: markdownToHtml(ultima.content || ""),
      });
    } catch (kindleErr) {
      console.error("newsletter/notify (kindle):", kindleErr);
    }
  }
  if (canales.includes("facebook")) {
    try {
      // Falla independiente: si Facebook rechaza el token o no está
      // configurado, no debe tumbar el resto del aviso ya enviado.
      await postToFacebookPage({ titulo: ultima.titulo, resumen: ultima.resumen, url, imagenUrl: imagen });
    } catch (fbErr) {
      console.error("newsletter/notify (facebook):", fbErr);
    }
  }
  if (canales.includes("linkedin")) {
    try {
      // Falla independiente: si LinkedIn rechaza el token o no está
      // configurado, no debe tumbar el resto del aviso ya enviado.
      await postToLinkedIn({ titulo: ultima.titulo, resumen: ultima.resumen, url, imagenUrl: imagen });
    } catch (liErr) {
      console.error("newsletter/notify (linkedin):", liErr);
    }
  }

  return NextResponse.json(resultado);
}
