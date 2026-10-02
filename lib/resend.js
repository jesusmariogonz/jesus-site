/* ============================================================
   Newsletter — helper de Resend
   ------------------------------------------------------------
   Usa fetch directo a la API REST de Resend (sin agregar el
   paquete "resend" como dependencia). Necesita estas variables
   de entorno en Vercel (Project Settings → Environment Variables):

   RESEND_API_KEY        → tu API key de Resend (empieza con "re_")
   RESEND_SEGMENT_ID      → el ID del segmento/lista de newsletter
   RESEND_FROM_EMAIL     → remitente verificado, ej:
                            "Jesús González <notas@tudominio.com>"
   NEWSLETTER_NOTIFY_SECRET → clave secreta inventada por ti, para
                            proteger el endpoint que dispara el aviso
                            de nueva nota (evita que cualquiera lo use).
   ============================================================ */

const RESEND_API = "https://api.resend.com";

function apiKey() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Falta configurar RESEND_API_KEY en Vercel.");
  return key;
}

function headers() {
  return {
    Authorization: `Bearer ${apiKey()}`,
    "Content-Type": "application/json",
  };
}

/** Da de alta (o reactiva) un correo en el segmento de newsletter. */
export async function subscribeContact(email) {
  // 1) Crea (o actualiza) el contacto global.
  const createRes = await fetch(`${RESEND_API}/contacts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  const createData = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    throw new Error(createData?.message || "No se pudo registrar el correo.");
  }

  // 2) Lo añade al segmento de la newsletter.
  const segmentId = process.env.RESEND_SEGMENT_ID;
  if (segmentId) {
    const segRes = await fetch(
      `${RESEND_API}/contacts/${encodeURIComponent(email)}/segments/${segmentId}`,
      { method: "POST", headers: headers() }
    );
    if (!segRes.ok) {
      const segData = await segRes.json().catch(() => ({}));
      throw new Error(segData?.message || "No se pudo unir al segmento.");
    }
  }

  return true;
}

/** Envía un broadcast al segmento avisando de una nota nueva. */
export async function sendNewPostBroadcast({ titulo, resumen, url, imagen }) {
  const segmentId = process.env.RESEND_SEGMENT_ID;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!segmentId) throw new Error("Falta configurar RESEND_SEGMENT_ID.");
  if (!from) throw new Error("Falta configurar RESEND_FROM_EMAIL.");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      ${imagen ? `<img src="${imagen}" alt="" style="width:100%;border-radius:10px;margin-bottom:20px;" />` : ""}
      <p style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#8a8a8a;">
        Nueva nota
      </p>
      <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px;">${titulo}</h1>
      <p style="font-size:15px;line-height:1.6;color:#333;">${resumen || ""}</p>
      <p style="margin:28px 0;">
        <a href="${url}" style="background:#1c48c9;color:#fff;padding:12px 20px;
           border-radius:8px;text-decoration:none;font-weight:600;">
          Leer la nota →
        </a>
      </p>
      <p style="font-size:12px;color:#999;margin-top:40px;">
        Te llegó este correo porque te suscribiste en el blog de Jesús González.
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#999;">Cancelar suscripción</a>
      </p>
    </div>
  `;

  const res = await fetch(`${RESEND_API}/broadcasts`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      segment_id: segmentId,
      from,
      subject: `Nueva nota: ${titulo}`,
      html,
      send: true,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "No se pudo enviar el aviso.");
  }
  return data;
}

/** Envía una copia de la nota nueva al Kindle del autor, vía "Send to
 *  Kindle" de Amazon (funciona mandando un correo desde una dirección
 *  ya aprobada en la cuenta de Amazon a la dirección @kindle.com del
 *  dispositivo). Requiere que RESEND_FROM_EMAIL esté en la lista de
 *  remitentes aprobados en Amazon → Contenido y dispositivos →
 *  Preferencias → Ajustes de documentos personales. */
export async function sendKindleCopy({
  titulo,
  resumen,
  url,
  contenidoHtml,
  imagen,
  categoriaNombre,
  fecha,
  minutos,
}) {
  const kindleEmail = process.env.KINDLE_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!kindleEmail || !from) return; // integración opcional, no truena si falta

  // Amazon "Send to Kindle" por correo solo convierte ARCHIVOS ADJUNTOS,
  // no el cuerpo del correo — por eso la nota va como adjunto .html,
  // no en el body del mensaje. Manda la nota COMPLETA (no solo el
  // resumen), con el mismo tratamiento visual del sitio (portada,
  // categoría, meta, tipografía) en vez de HTML plano sin estilo —
  // así se ve igual de "arreglada" que cuando la mandas tú mismo a
  // mano con "Enviar a Kindle" desde el navegador.
  const meta = [categoriaNombre, fecha, minutos ? `${minutos} min de lectura` : null]
    .filter(Boolean)
    .join(" · ");

  const documento = `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${titulo}</title>
        <style>
          body { font-family: Georgia, "Times New Roman", serif; color: #0d1420; max-width: 640px; margin: 0 auto; padding: 0 16px 40px; line-height: 1.55; }
          .jx-marca { font-family: Helvetica, Arial, sans-serif; font-weight: bold; font-size: 13px; letter-spacing: 0.04em; color: #1c48c9; text-transform: uppercase; margin: 24px 0 12px; }
          .jx-cover { width: 100%; height: auto; margin: 0 0 18px; }
          .jx-meta { font-family: Helvetica, Arial, sans-serif; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; color: #1c48c9; margin: 0 0 10px; }
          h1 { font-family: Georgia, "Times New Roman", serif; font-size: 28px; line-height: 1.25; margin: 0 0 14px; }
          h2 { font-size: 21px; margin: 28px 0 10px; }
          h3 { font-size: 18px; margin: 22px 0 8px; }
          .jx-resumen { font-style: italic; color: #454e59; border-left: 3px solid #1c48c9; padding-left: 14px; margin: 0 0 24px; }
          p { margin: 0 0 16px; }
          blockquote { border-left: 3px solid #1c48c9; padding-left: 14px; margin: 0 0 16px; color: #454e59; font-style: italic; }
          a { color: #1c48c9; }
          table { border-collapse: collapse; width: 100%; margin: 0 0 16px; }
          th, td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 14px; }
          .jx-footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ccc; font-family: Helvetica, Arial, sans-serif; font-size: 13px; }
        </style>
      </head>
      <body>
        <p class="jx-marca">jgonzalez.app</p>
        ${imagen ? `<img class="jx-cover" src="${imagen}" alt="" />` : ""}
        ${meta ? `<p class="jx-meta">${meta}</p>` : ""}
        <h1>${titulo}</h1>
        ${resumen ? `<p class="jx-resumen">${resumen}</p>` : ""}
        ${contenidoHtml || ""}
        <p class="jx-footer">Ver en el sitio: <a href="${url}">${url}</a></p>
      </body>
    </html>
  `;

  const nombreArchivo = `${titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80)}.html`;

  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      from,
      to: kindleEmail,
      subject: titulo,
      html: "<p>Adjunto: nota nueva para tu Kindle.</p>",
      attachments: [
        {
          filename: nombreArchivo,
          content: Buffer.from(documento, "utf8").toString("base64"),
        },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "No se pudo enviar la copia al Kindle.");
  }
  return data;
}

/** Envía el correo de confirmación de compra de The Toolkit, con los
 *  links de descarga de cada archivo incluido. Usa el endpoint de
 *  envío individual de Resend (no un broadcast — es un correo
 *  transaccional a un solo destinatario). */
export async function sendPurchaseEmail({ to, nombreProducto, links }) {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("Falta configurar RESEND_FROM_EMAIL.");

  const filas = links
    .map(
      (l) => `
        <p style="margin:0 0 14px;">
          <a href="${l.url}" style="background:#1c48c9;color:#fff;padding:10px 18px;
             border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
            Descargar ${l.nombre} →
          </a>
        </p>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
      <p style="font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#8a8a8a;">
        Compra confirmada
      </p>
      <h1 style="font-size:22px;line-height:1.3;margin:0 0 12px;">${nombreProducto}</h1>
      <p style="font-size:15px;line-height:1.6;color:#333;">
        Gracias por tu compra. Aquí tienes tus archivos:
      </p>
      <div style="margin:24px 0;">${filas}</div>
      <p style="font-size:12px;color:#999;margin-top:40px;">
        Guarda este correo — estos links no caducan, pero son personales:
        no los compartas.
      </p>
    </div>
  `;

  const res = await fetch(`${RESEND_API}/emails`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      from,
      to,
      subject: `Tu compra: ${nombreProducto}`,
      html,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || "No se pudo enviar el correo de compra.");
  }
  return data;
}
