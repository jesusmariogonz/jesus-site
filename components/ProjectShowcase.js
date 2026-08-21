"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROYECTOS } from "@/lib/proyectos";
import ProjectArt from "@/components/ProjectArt";

/* Paleta por proyecto: variaciones sobre el acento del sitio +
   un segundo tono, para que cada tarjeta se distinga sin salirse
   de la paleta general. */
const PALETA = {
  lealtad: ["#4f8cff", "#1c2c52"],
  modernizacion: ["#22c39a", "#0f2b28"],
  recomendacion: ["#a78bfa", "#241a45"],
  pos: ["#f2b84a", "#3a2a10"],
  agente: ["#4f8cff", "#22183f"],
  clima: ["#5fd0f2", "#0f2438"],
  pricing: ["#f2814a", "#3a1c10"],
  genai: ["#e05fd8", "#2a1030"],
};

export default function ProjectShowcase() {
  const [abierto, setAbierto] = useState(null);

  return (
    <div className="pshow-grid">
      {PROYECTOS.map((p) => {
        const [hueA, hueB] = PALETA[p.arte] || PALETA.genai;
        const on = abierto === p.id;
        return (
          <article
            key={p.id}
            className={`pshow-card${on ? " on" : ""}`}
            onMouseEnter={() => setAbierto(p.id)}
            onMouseLeave={() => setAbierto((cur) => (cur === p.id ? null : cur))}
          >
            <button
              type="button"
              className="pshow-art"
              onClick={() => setAbierto((cur) => (cur === p.id ? null : p.id))}
              aria-expanded={on}
              aria-label={`Ver detalle: ${p.nombre}`}
            >
              {p.imagen ? (
                <span
                  className="pshow-art-photo"
                  style={{ backgroundImage: `url(${p.imagen})` }}
                />
              ) : (
                <ProjectArt variant={p.arte} hueA={hueA} hueB={hueB} />
              )}
              <span className="pshow-art-overlay" />
              <span className="pshow-num">{p.num}</span>
              <h3 className="pshow-art-title">{p.corto}</h3>
              <span className="pshow-region">{p.region}</span>
            </button>

            <div className="pshow-body">
              <div className="pshow-chips">
                {p.chips.slice(0, 3).map((c) => (
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
                    <p className="pshow-desc">{p.descripcion}</p>
                    {p.chips.length > 3 && (
                      <div className="pshow-chips">
                        {p.chips.slice(3).map((c) => (
                          <span key={c}>{c}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                className="pshow-toggle"
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
  );
}
