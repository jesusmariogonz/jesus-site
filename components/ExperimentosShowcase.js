"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/* Tarjetas de experimentos del Research Lab. Mismo patrón que
   ProjectShowcase en /proyectos: imagen, más información al pasar el
   mouse (o al tocar), y un enlace a la página de detalle. */

const ETIQUETA_ESTADO = {
  EXPERIMENTAL: "Experimental",
  VALIDATED: "Validado",
  REJECTED: "Rechazado",
  INCONCLUSIVE: "Inconcluso",
};

export default function ExperimentosShowcase({ experimentos }) {
  const [abierto, setAbierto] = useState(null);

  return (
    <div className="pshow-grid">
      {experimentos.map((e) => {
        const on = abierto === e.slug;
        return (
          <article
            key={e.slug}
            className={`pshow-card${on ? " on" : ""}`}
            onMouseEnter={() => setAbierto(e.slug)}
            onMouseLeave={() => setAbierto((cur) => (cur === e.slug ? null : cur))}
          >
            <button
              type="button"
              className="pshow-art"
              onClick={() => setAbierto((cur) => (cur === e.slug ? null : e.slug))}
              aria-expanded={on}
              aria-label={`Ver detalle: ${e.nombre}`}
            >
              <span className="pshow-art-photo" style={{ backgroundImage: `url(${e.imagen})` }} />
              <span className="pshow-art-overlay" />
              <span className="pshow-num">{e.id}</span>
              <h3 className="pshow-art-title">{e.nombre}</h3>
              <span className="pshow-region">{e.dominio}</span>
            </button>

            <div className="pshow-body">
              <span className={`pshow-tipo exp-estado exp-estado--${e.estado.toLowerCase()}`}>
                {ETIQUETA_ESTADO[e.estado] || e.estado}
              </span>

              <div className="pshow-chips">
                {e.chips.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>

              <AnimatePresence initial={false}>
                {on && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                    className="pshow-expand"
                  >
                    <p className="pshow-desc">{e.resumen}</p>
                    <dl className="pshow-case">
                      <div>
                        <dt>Pregunta</dt>
                        <dd>{e.pregunta}</dd>
                      </div>
                      <div>
                        <dt>Hallazgo</dt>
                        <dd>{e.hallazgo}</dd>
                      </div>
                    </dl>
                    <Link href={`/pulso-mercado/research/${e.slug}`} className="pshow-cta">
                      Ver el experimento completo →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {!on && (
                <Link href={`/pulso-mercado/research/${e.slug}`} className="pshow-toggle exp-ver-link">
                  Abrir {e.id} →
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
