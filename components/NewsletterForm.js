"use client";

import { useState } from "react";

/* Formulario de newsletter. Se puede reutilizar en el blog,
   al final de cada nota, o donde haga falta. */

export default function NewsletterForm({
  titulo = "Recibe las notas nuevas por correo",
  desc = "Sin spam: solo aviso cuando publico una nota nueva.",
}) {
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState("idle"); // idle | cargando | ok | error
  const [mensaje, setMensaje] = useState("");

  const enviar = async (e) => {
    e.preventDefault();
    setEstado("cargando");
    setMensaje("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Algo salió mal.");
      setEstado("ok");
      setEmail("");
    } catch (err) {
      setEstado("error");
      setMensaje(err.message || "No se pudo completar el registro.");
    }
  };

  if (estado === "ok") {
    return (
      <div className="newsletter-box">
        <p className="newsletter-ok">
          ✓ Listo. Revisa tu correo para confirmar la suscripción.
        </p>
      </div>
    );
  }

  return (
    <div className="newsletter-box">
      <p className="newsletter-titulo">{titulo}</p>
      <p className="newsletter-desc">{desc}</p>
      <form className="newsletter-form" onSubmit={enviar}>
        <input
          type="email"
          required
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="newsletter-input"
          aria-label="Correo electrónico"
        />
        <button
          type="submit"
          className="btn"
          disabled={estado === "cargando"}
        >
          {estado === "cargando" ? "Enviando…" : "Suscribirme"}
        </button>
      </form>
      {estado === "error" && <p className="newsletter-error">{mensaje}</p>}
    </div>
  );
}
