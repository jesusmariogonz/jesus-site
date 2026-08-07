"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BuyButton from "@/components/BuyButton";

/* Compara dos conjuntos de ids sin importar el orden. */
function mismoConjunto(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((id) => setA.has(id));
}

export default function ToolkitCatalog({ productos, bundles }) {
  const [seleccion, setSeleccion] = useState([]);

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
          return (
            <article
              key={p.id}
              className={`tk-card${marcado ? " tk-card-selected" : ""}`}
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
              <p className="tk-card-desc">{p.resumen}</p>
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
                    `$${p.precio} USD`
                  )}
                </span>
                <BuyButton checkoutUrl={p.checkoutUrl} />
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
                ${productoUnico.precio} USD
              </span>
            )}

            {seleccion.length > 1 && bundleActivo && (
              <span className="tk-selector-precio">
                <span className="tk-bundle-tachado">
                  ${bundleActivo.precioLista} USD
                </span>{" "}
                ${bundleActivo.precio} USD · {bundleActivo.nombre}
              </span>
            )}

            {seleccion.length > 1 && !bundleActivo && (
              <span className="tk-selector-nota">
                Aún no tenemos un bundle para esta combinación exacta
                (compra por separado, o{" "}
                <Link href="/contacto">escríbenos</Link> y lo armamos).
                Suma individual: ${totalIndividual.toFixed(2)} USD
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
