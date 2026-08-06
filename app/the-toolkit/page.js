import Link from "next/link";
import { TOOLKIT_PRODUCTOS, TOOLKIT_BUNDLE } from "@/lib/toolkit";
import BuyButton from "@/components/BuyButton";

export const metadata = {
  title: "The Toolkit",
  description:
    "Plantillas, kits y cursos de analítica, datos e IA para retail — Power BI, SQL, Excel y más, listos para usar.",
  alternates: { canonical: "/the-toolkit" },
};

export default function TheToolkit() {
  const hayAlgunoDisponible = TOOLKIT_PRODUCTOS.some((p) => p.checkoutUrl);

  return (
    <section className="tk-page">
      <div className="container">
        <div className="tk-hero">
          <span className="tk-hero-eyebrow">The Toolkit</span>
          <h1 className="tk-hero-title">
            Recursos de datos y analítica, listos para usar.
          </h1>
          <p className="tk-hero-desc">
            Plantillas, kits y cursos que uso en proyectos reales de datos,
            IA y retail — empaquetados para que los apliques directo, sin
            reinventar la rueda. Compra individual, con descarga
            automática al pagar.
          </p>
          {!hayAlgunoDisponible && (
            <span className="tk-hero-badge">Muy pronto disponible</span>
          )}
        </div>

        {TOOLKIT_BUNDLE.checkoutUrl && (
          <div className="tk-bundle">
            <div>
              <span className="tk-bundle-eyebrow">Ahorra comprando todo junto</span>
              <h2 className="tk-bundle-title">{TOOLKIT_BUNDLE.nombre}</h2>
              <p className="tk-bundle-desc">{TOOLKIT_BUNDLE.resumen}</p>
            </div>
            <div className="tk-bundle-precio">
              <span className="tk-bundle-tachado">${TOOLKIT_BUNDLE.precioLista} USD</span>
              <span className="tk-bundle-num">${TOOLKIT_BUNDLE.precio} USD</span>
              <BuyButton checkoutUrl={TOOLKIT_BUNDLE.checkoutUrl} label="Comprar el bundle" />
            </div>
          </div>
        )}

        <div className="tk-grid">
          {TOOLKIT_PRODUCTOS.map((p) => (
            <article key={p.id} className="tk-card">
              <span className="tk-card-formato">{p.formato}</span>
              <h3 className="tk-card-title">
                <Link href={`/the-toolkit/${p.id}`} className="tk-card-title-link">
                  {p.nombre}
                </Link>
              </h3>
              <p className="tk-card-desc">{p.resumen}</p>
              <div className="tk-card-footer">
                <span className="tk-card-precio">
                  {p.precioLista && (
                    <span className="tk-bundle-tachado tk-card-tachado">${p.precioLista}</span>
                  )}{" "}
                  ${p.precio} USD
                </span>
                <BuyButton checkoutUrl={p.checkoutUrl} />
              </div>
            </article>
          ))}
        </div>

        <div className="tk-cta-final">
          <p>¿Quieres que te avise en cuanto abra un recurso nuevo?</p>
          <Link href="/blog" className="tk-banner-cta">
            Suscríbete al newsletter →
          </Link>
        </div>
      </div>
    </section>
  );
}
