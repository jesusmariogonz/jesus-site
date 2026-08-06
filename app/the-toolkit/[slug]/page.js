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

/* Mockup 3D de laptop mostrando el producto en pantalla — inspirado en la
   referencia (laptop + panel flotando), pero en negro/dorado y con datos
   reales del curso, hecho en CSS/SVG puro (sin imágenes externas). */
function LaptopIso({ chip = "PBI" }) {
  return (
    <div className="tk-laptop-wrap" aria-hidden="true">
      <div className="tk-laptop">
        <div className="tk-laptop-screen">
          <div className="tk-laptop-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="tk-laptop-content">
            <div className="tk-iso-bars tk-iso-bars-flat">
              <i style={{ "--h": "38%" }} />
              <i style={{ "--h": "62%" }} />
              <i style={{ "--h": "45%" }} />
              <i style={{ "--h": "80%" }} />
              <i style={{ "--h": "58%" }} />
              <i style={{ "--h": "94%" }} />
              <i style={{ "--h": "70%" }} />
              <i style={{ "--h": "52%" }} />
            </div>
            <svg viewBox="0 0 220 60" className="tk-iso-line">
              <polyline
                points="4,46 34,34 64,38 94,18 124,26 154,8 184,14 216,4"
                fill="none"
                stroke="url(#tkGoldLine2)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="tkGoldLine2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8a6a2f" />
                  <stop offset="100%" stopColor="#f2d879" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
        <div className="tk-laptop-base" />
      </div>
      <div className="tk-laptop-chip">{chip}</div>
    </div>
  );
}

/* Mockup 3D de libro/cuadernillo — para productos tipo manual, plantillas
   o PDF, donde un "librito" flotando comunica mejor el producto que un
   laptop. También en negro/dorado, CSS puro. */
function BookIso({ nombre, chip = "PDF" }) {
  return (
    <div className="tk-book-wrap" aria-hidden="true">
      <div className="tk-book">
        <div className="tk-book-spine" />
        <div className="tk-book-cover">
          <span className="tk-book-cover-mark">{chip}</span>
          <span className="tk-book-cover-title">{nombre}</span>
        </div>
        <div className="tk-book-pages" />
      </div>
    </div>
  );
}

/* Elige el mockup 3D según el formato del producto: cursos en video se
   ven mejor como laptop con pantalla; manuales/plantillas/PDF se ven
   mejor como un librito con lomo y páginas. */
function heroVisual(producto) {
  const f = (producto.formato || "").toLowerCase();
  const esLibro =
    f.includes("manual") || f.includes("plantilla") || f.includes("pdf");
  if (esLibro) {
    return <BookIso nombre={producto.nombre} chip={producto.id === "prompting-profesional" ? "AI" : "PDF"} />;
  }
  return <LaptopIso chip={producto.formato?.includes("Kit") ? "KIT" : "PBI"} />;
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
                      ${producto.precioLista} USD
                    </span>
                  )}
                  {ahorro && <span className="tk-product-ahorro">-{ahorro}%</span>}
                </div>
                <span className="tk-card-precio tk-product-precio">
                  ${producto.precio} USD
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
                <span className="tk-bundle-tachado">${producto.precioLista} USD</span>
              )}{" "}
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
