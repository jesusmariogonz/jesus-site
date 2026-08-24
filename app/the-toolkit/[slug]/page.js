import Link from "next/link";
import { notFound } from "next/navigation";
import { TOOLKIT_PRODUCTOS } from "@/lib/toolkit";
import BuyButton from "@/components/BuyButton";

export function generateStaticParams() {
  return TOOLKIT_PRODUCTOS.map((p) => ({ slug: p.id }));
}

export function generateMetadata({ params }) {
  const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === params.slug);
  if (!producto) return {};
  return {
    title: producto.nombre,
    description: producto.resumen,
    alternates: { canonical: `/the-toolkit/${producto.id}` },
  };
}

/* Foto temática del producto (ver `imagen` en lib/toolkit.js). */
function heroVisual(producto) {
  if (!producto.imagen) return null;
  return (
    <div className="tk-product-photo-wrap">
      <div
        className="tk-product-photo"
        style={{ backgroundImage: `url(${producto.imagen})` }}
      />
    </div>
  );
}

export default function ProductoToolkit({ params }) {
  const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === params.slug);
  if (!producto) notFound();

  const d = producto.detalle || {};
  const ahorro =
    producto.precioLista && producto.precioLista > producto.precio
      ? Math.round(100 - (producto.precio / producto.precioLista) * 100)
      : null;

  return (
    <section className="tk-page tk-product-page">
      <div className="container tk-product-container">
        <Link href="/the-toolkit" className="tk-back">
          ← The Toolkit
        </Link>

        <div className="tk-product-hero">
          <div className="tk-product-copy">
            {d.eyebrow && <span className="tk-hero-eyebrow">{d.eyebrow}</span>}
            <h1 className="tk-product-title">{producto.nombre}</h1>
            <p className="tk-product-hook">{d.hook || producto.resumen}</p>

            {d.badges && (
              <div className="tk-product-badges">
                {d.badges.map((b, i) => (
                  <span key={i} className="tk-product-badge">
                    {b}
                  </span>
                ))}
              </div>
            )}

            <div className="tk-product-buybar">
              <div className="tk-product-precio-wrap">
                <div className="tk-product-precio-row">
                  {producto.precioLista && (
                    <span className="tk-bundle-tachado tk-product-tachado">
                      ${producto.precioLista} MXN
                    </span>
                  )}
                  {ahorro && <span className="tk-product-ahorro">-{ahorro}%</span>}
                </div>
                <span className="tk-card-precio tk-product-precio">
                  ${producto.precio} MXN
                </span>
                <span className="tk-product-precio-nota">pago único · precio de lanzamiento</span>
              </div>
              <BuyButton
                checkoutUrl={producto.checkoutUrl}
                label="Comprar ahora"
                className="tk-buy-lg"
              />
            </div>
            {!producto.checkoutUrl && (
              <p className="tk-product-soon-note">
                Estamos por abrir este producto. Déjanos tu correo en el
                newsletter y te avisamos apenas esté disponible.
              </p>
            )}
          </div>

          {heroVisual(producto)}
        </div>

        {(d.paraQuien || d.incluye) && (
          <div className="tk-product-grid">
            {d.paraQuien && (
              <div className="tk-product-block">
                <h2 className="tk-product-block-title">¿Es para ti?</h2>
                <ul className="tk-product-list">
                  {d.paraQuien.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {d.incluye && (
              <div className="tk-product-block">
                <h2 className="tk-product-block-title">Qué incluye</h2>
                <ul className="tk-product-list tk-product-list-check">
                  {d.incluye.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {d.resultado && (
          <div className="tk-product-resultado">
            <span className="tk-hero-eyebrow">Resultado</span>
            <p>{d.resultado}</p>
          </div>
        )}

        <div className="tk-product-meta">
          {d.formatoDetalle && (
            <div>
              <span className="tk-card-formato">Formato</span>
              <p>{d.formatoDetalle}</p>
            </div>
          )}
          {d.duracion && (
            <div>
              <span className="tk-card-formato">Duración</span>
              <p>{d.duracion}</p>
            </div>
          )}
          {d.nivel && (
            <div>
              <span className="tk-card-formato">Nivel</span>
              <p>{d.nivel}</p>
            </div>
          )}
        </div>

        <div className="tk-product-footer-cta">
          <div>
            <p className="tk-product-precio-wrap-inline">
              {producto.precioLista && (
                <span className="tk-bundle-tachado">${producto.precioLista} MXN</span>
              )}{" "}
              <span className="tk-card-precio tk-product-precio">
                ${producto.precio} MXN
              </span>{" "}
              · pago único · acceso inmediato
            </p>
          </div>
          <BuyButton
            checkoutUrl={producto.checkoutUrl}
            label="Comprar ahora"
            className="tk-buy-lg"
          />
        </div>
      </div>
    </section>
  );
}
