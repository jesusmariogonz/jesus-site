import Link from "next/link";

export const metadata = {
  title: "Gracias por tu compra",
  robots: { index: false, follow: false },
};

export default function GraciasToolkit() {
  return (
    <section className="tk-page">
      <div className="container">
        <div className="tk-hero">
          <span className="tk-hero-eyebrow">The Toolkit</span>
          <h1 className="tk-hero-title">¡Gracias por tu compra!</h1>
          <p className="tk-hero-desc">
            Te acabamos de enviar un correo con los links para descargar tu(s)
            archivo(s). Si no lo ves en unos minutos, revisa spam/promociones
            — el correo llega de un remitente automático.
          </p>
          <Link href="/the-toolkit" className="tk-banner-cta">
            ← Volver a The Toolkit
          </Link>
        </div>
      </div>
    </section>
  );
}
