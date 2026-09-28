import { NextResponse } from "next/server";
import { absUrl } from "@/lib/site";
import { postCustomToFacebookPage } from "@/lib/facebook";
import { postCustomToLinkedIn } from "@/lib/linkedin";
import { ensureNotifySchema, reclamarAviso } from "@/lib/db";

/* ============================================================
   Publicación del resumen semanal ("one pager") en Facebook y
   LinkedIn — dispara el GitHub Action de scripts/one_pager_semana.py
   cada domingo, no un evento de publicación de una nota individual.

   POST /api/newsletter/weekly-digest
   body JSON: { secret, imagen, caption, edicion }
   - secret   → NEWSLETTER_NOTIFY_SECRET (mismo que el resto del sitio)
   - imagen   → ruta pública de la imagen ya desplegada, ej.
                "/blog/social/one-pager-semana-2026-09-28.jpg"
   - caption  → texto que acompaña la imagen (resumen breve + link)
   - edicion  → identificador único de esta edición (ej. la fecha),
                para que reintentos del Action no dupliquen el post
   ============================================================ */

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const { secret, imagen, caption, edicion } = body;
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
  if (!imagen || !caption || !edicion) {
    return NextResponse.json(
      { error: "Faltan imagen, caption o edicion en el body." },
      { status: 400 }
    );
  }

  const imagenUrl = absUrl(imagen);

  let dbDisponible = true;
  try {
    await ensureNotifySchema();
  } catch (err) {
    dbDisponible = false;
    console.error("newsletter/weekly-digest (db):", err);
  }
  async function puedeEnviar(canal) {
    if (!dbDisponible) return true;
    try {
      return await reclamarAviso(edicion, canal);
    } catch (err) {
      console.error(`newsletter/weekly-digest (reclamar ${canal}):`, err);
      return true;
    }
  }

  const enviados = [];
  const omitidos = [];

  let fbDebug = null;
  if (await puedeEnviar("weekly-facebook")) {
    try {
      const fbResult = await postCustomToFacebookPage({ caption, imagenUrl });
      if (fbResult === undefined) {
        fbDebug = "sin_credenciales_configuradas";
      } else {
        fbDebug = fbResult;
        enviados.push("facebook");
      }
    } catch (fbErr) {
      console.error("newsletter/weekly-digest (facebook):", fbErr);
      fbDebug = { error: String(fbErr.message || fbErr) };
    }
  } else {
    omitidos.push("facebook");
  }

  if (await puedeEnviar("weekly-linkedin")) {
    try {
      await postCustomToLinkedIn({ commentary: caption, imagenUrl });
      enviados.push("linkedin");
    } catch (liErr) {
      console.error("newsletter/weekly-digest (linkedin):", liErr);
    }
  } else {
    omitidos.push("linkedin");
  }

  return NextResponse.json({
    ok: true,
    edicion,
    canales_enviados: enviados,
    canales_omitidos_por_duplicado: omitidos,
    facebook_debug: fbDebug,
  });
}
