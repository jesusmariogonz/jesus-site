"use client";

import { useState } from "react";

// ✏️ PASO ÚNICO DE CONFIGURACIÓN:
// 1. Crea una cuenta gratis en https://formspree.io con jesusmariogonz@gmail.com
// 2. Crea un formulario nuevo y copia su ID (algo como "xzbqwxyz")
// 3. Pégalo aquí abajo. Listo: los mensajes llegarán a tu correo.
const FORMSPREE_ID = "TU_ID_AQUI";

export default function ContactForm() {
  const [estado, setEstado] = useState("idle"); // idle | enviando | ok | error

  const configurado = FORMSPREE_ID !== "xgogwzoe";

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!configurado) {
      // Fallback: abre el cliente de correo con el mensaje prellenado
      const nombre = data.get("nombre") || "";
      const correo = data.get("correo") || "";
      const mensaje = data.get("mensaje") || "";
      const body = encodeURIComponent(
        `Nombre: ${nombre}\nCorreo: ${correo}\n\n${mensaje}`
      );
      window.location.href = `mailto:jesusmariogonz@gmail.com?subject=${encodeURIComponent(
        "Mensaje desde tu sitio web"
      )}&body=${body}`;
      return;
    }

    setEstado("enviando");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setEstado("ok");
        form.reset();
      } else {
        setEstado("error");
      }
    } catch {
      setEstado("error");
    }
  }

  const campo = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--line)",
    background: "var(--surface)",
    color: "var(--ink)",
    font: "inherit",
    fontSize: "0.95rem",
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius)",
        padding: "22px 22px 20px",
        maxWidth: 560,
        display: "grid",
        gap: 14,
        marginTop: 26,
      }}
    >
      <strong>Déjame un mensaje</strong>
      <label style={{ display: "grid", gap: 6, fontSize: "0.88rem" }}>
        Tu nombre
        <input name="nombre" type="text" required style={campo} />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: "0.88rem" }}>
        Tu correo
        <input name="correo" type="email" required style={campo} />
      </label>
      <label style={{ display: "grid", gap: 6, fontSize: "0.88rem" }}>
        Mensaje
        <textarea name="mensaje" rows={5} required style={campo} />
      </label>
      <div>
        <button className="btn" type="submit" disabled={estado === "enviando"}>
          {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
        </button>
      </div>
      {estado === "ok" && (
        <p style={{ color: "var(--accent)", margin: 0, fontSize: "0.9rem" }}>
          ✓ ¡Gracias! Tu mensaje fue enviado y me llegará al correo.
        </p>
      )}
      {estado === "error" && (
        <p style={{ color: "#e5484d", margin: 0, fontSize: "0.9rem" }}>
          Ocurrió un error al enviar. Intenta de nuevo o escríbeme directo a
          jesusmariogonz@gmail.com.
        </p>
      )}
    </form>
  );
}
