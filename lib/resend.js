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
