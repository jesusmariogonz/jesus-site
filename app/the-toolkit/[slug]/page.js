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

/* Mockup isométrico 3D del dashboard, en CSS puro (sin imágenes externas):
   tres paneles flotando en perspectiva, con barras y una línea de tendencia
   dorada — la misma idea visual del producto, convertida en objeto. */
function DashboardIso() {
  return (
    <div className="tk-iso" aria-hidden="true">
      <div className="tk-iso-stage">
        <div className="tk-iso-panel tk-iso-panel-back">
          <span className="tk-iso-dot" />
          <span className="tk-iso-dot" />
          <span className="tk-iso-dot" />
        </div>
        <div className="tk-iso-panel tk-iso-panel-mid">
          <div className="tk-iso-bars">
            <i style={{ "--h": "38%" }} />
            <i style={{ "--h": "62%" }} />
            <i style={{ "--h": "45%" }} />
            <i style={{ "--h": "80%" }} />
            <i style={{ "--h": "58%" }} />
            <i style={{ "--h": "94%" }} />
          </div>
        </div>
        <div className="tk-iso-panel tk-iso-panel-front">
          <svg viewBox="0 0 220 90" className="tk-iso-line">
            <polyline
              points="4,70 40,52 76,58 112,30 148,38 184,12 216,18"
              fill="none"
              stroke="url(#tkGoldLine)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="tkGoldLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8a6a2f" />
                <stop offset="100%" stopColor="#f2d879" />
              </linearGradient>
            </defs>
          </svg>
          <span className="tk-iso-kpi">
            <b>+27%</b> ticket promedio
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ProductoToolkit({ params }) {
  const producto = TOOLKIT_PRODUCTOS.find((p) => p.id === params.slug);
  if (!producto) notFound();

  const d = producto.detalle || {};

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

            <div className="tk-product-buybar">
              <div className="tk-product-precio-wrap">
                <span className="tk-card-precio tk-product-precio">
                  ${producto.precio} USD
                </span>
                <span className="tk-product-precio-nota">pago único</span>
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

          <DashboardIso />
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
              <span className="tk-card-precio tk-product-precio">
                ${producto.precio} USD
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
