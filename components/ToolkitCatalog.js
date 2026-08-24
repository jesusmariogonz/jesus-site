"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import BuyButton from "@/components/BuyButton";

/* Compara dos conjuntos de ids sin importar el orden. */
function mismoConjunto(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((id) => setA.has(id));
}

export default function ToolkitCatalog({ productos, bundles }) {
  const [seleccion, setSeleccion] = useState([]);
  const [abierto, setAbierto] = useState(null);

  const toggle = (id) => {
    setSeleccion((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const bundleActivo = useMemo(() => {
    if (seleccion.length < 2) return null;
    return bundles.find((b) => mismoConjunto(b.ids, seleccion)) || null;
  }, [seleccion, bundles]);

  const productoUnico =
    seleccion.length === 1
      ? productos.find((p) => p.id === seleccion[0])
      : null;

  const totalIndividual = seleccion.reduce((sum, id) => {
    const p = productos.find((x) => x.id === id);
    return sum + (p ? p.precio : 0);
  }, 0);

  return (
    <>
      <div className="tk-grid">
        {productos.map((p) => {
          const marcado = seleccion.includes(p.id);
          const on = abierto === p.id;
          return (
            <article
              key={p.id}
              className={`tk-card${marcado ? " tk-card-selected" : ""}${on ? " on" : ""}`}
              onMouseEnter={() => setAbierto(p.id)}
              onMouseLeave={() => setAbierto((cur) => (cur === p.id ? null : cur))}
            >
              <div
                className="tk-card-cover"
                style={p.imagen ? { backgroundImage: `url(${p.imagen})` } : undefined}
              >
                <label className="tk-card-check">
                  <input
                    type="checkbox"
                    checked={marcado}
                    onChange={() => toggle(p.id)}
                    aria-label={`Seleccionar ${p.nombre}`}
                  />
                  <span className="tk-card-check-box" aria-hidden="true" />
                </label>
                {p.badge && <span className="tk-card-badge">{p.badge}</span>}
                <span className="tk-card-formato">{p.formato}</span>
                <h3 className="tk-card-title">
                  <Link href={`/the-toolkit/${p.id}`} className="tk-card-title-link">
                    {p.nombre}
                  </Link>
                </h3>
              </div>

              <div className="tk-card-body">
                <div className="tk-card-footer">
                  <span className="tk-card-precio">
                    {p.precioLista && (
                      <span className="tk-bundle-tachado tk-card-tachado">
                        ${p.precioLista}
                      </span>
                    )}{" "}
                    {p.precio === 0 ? (
                      <span className="tk-card-gratis">GRATIS</span>
                    ) : (
                      `$${p.precio} MXN`
                    )}
                  </span>
                  <BuyButton checkoutUrl={p.checkoutUrl} />
                </div>

                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: "easeInOut" }}
                      className="tk-card-expand"
                    >
                      <p className="tk-card-desc">{p.resumen}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  className="tk-card-toggle"
                  onClick={() => setAbierto((cur) => (cur === p.id ? null : p.id))}
                  aria-expanded={on}
                >
                  {on ? "Ver menos −" : "Ver detalle +"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {seleccion.length > 0 && (
        <div className="tk-selector-bar">
          <div className="tk-selector-info">
            <span className="tk-selector-count">
              {seleccion.length} seleccionado{seleccion.length > 1 ? "s" : ""}
            </span>

            {seleccion.length === 1 && productoUnico && (
              <span className="tk-selector-precio">
                ${productoUnico.precio} MXN
              </span>
            )}

            {seleccion.length > 1 && bundleActivo && (
              <span className="tk-selector-precio">
                <span className="tk-bundle-tachado">
                  ${bundleActivo.precioLista} MXN
                </span>{" "}
                ${bundleActivo.precio} MXN · {bundleActivo.nombre}
              </span>
            )}

            {seleccion.length > 1 && !bundleActivo && (
              <span className="tk-selector-nota">
                Aún no tenemos un bundle para esta combinación exacta
                (compra por separado, o{" "}
                <Link href="/contacto">escríbenos</Link> y lo armamos).
                Suma individual: ${totalIndividual.toFixed(2)} MXN
              </span>
            )}
          </div>

          <div className="tk-selector-actions">
            {seleccion.length === 1 && productoUnico && (
              <BuyButton
                checkoutUrl={productoUnico.checkoutUrl}
                label="Comprar"
                className="tk-buy-lg"
              />
            )}
            {seleccion.length > 1 && bundleActivo && (
              <BuyButton
                checkoutUrl={bundleActivo.checkoutUrl}
                label="Comprar bundle"
                className="tk-buy-lg"
              />
            )}
            <button
              type="button"
              className="tk-selector-clear"
              onClick={() => setSeleccion([])}
            >
              Limpiar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
