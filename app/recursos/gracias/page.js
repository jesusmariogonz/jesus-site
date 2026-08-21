import Link from "next/link";

export const metadata = {
  title: "Gracias por tu compra",
  robots: { index: false, follow: false },
};

export default function GraciasBiblioteca() {
  return (
    <section className="lib-page">
      <div className="container">
        <div className="lib-hero">
          <span className="lib-hero-eyebrow">Biblioteca</span>
          <h1 className="lib-hero-title">¡Gracias por tu compra!</h1>
          <p className="lib-hero-desc">
            Te acabamos de enviar un correo con el link para descargar tu
            libro. Si no lo ves en unos minutos, revisa spam/promociones —
            el correo llega de un remitente automático.
          </p>
          <Link href="/recursos" className="btn">
            ← Volver a la Biblioteca
          </Link>
        </div>
      </div>
    </section>
  );
}
