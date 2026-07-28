"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import NotaCover from "@/components/NotaCover";

/* ============================================================
   Carrusel "Lo más reciente"
   ------------------------------------------------------------
   Muestra las notas más nuevas como diapositivas grandes con
   portada + título + resumen. Sirve para que, una vez dentro
   del blog o de una nota, el lector descubra lo último y siga
   navegando (mejora el alcance).

   - Avanza solo cada ~6 s (se pausa al pasar el cursor o enfocar).
   - Flechas, puntos, deslizar con el dedo y teclado ← →.
   - Respeta "reducir movimiento" del sistema.
   ============================================================ */

const AUTO_MS = 6000;

export default function NotasCarrusel({
  notas = [],
  titulo = "Lo más reciente",
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [pausado, setPausado] = useState(false);
  const total = notas.length;
  const inicioTouch = useRef(null);

  const ir = useCallback(
    (n) => {
      setDir(n > i ? 1 : -1);
      setI((prev) => (n + total) % total);
    },
    [i, total]
  );
  const siguiente = useCallback(() => {
    setDir(1);
    setI((prev) => (prev + 1) % total);
  }, [total]);
  const anterior = useCallback(() => {
    setDir(-1);
    setI((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-avance
  useEffect(() => {
    if (reduce || pausado || total <= 1) return;
    const t = setInterval(siguiente, AUTO_MS);
    return () => clearInterval(t);
  }, [reduce, pausado, total, siguiente]);

  if (total === 0) return null;

  const nota = notas[i];
  const num = String(i + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");

  const onKey = (e) => {
    if (e.key === "ArrowRight") siguiente();
    if (e.key === "ArrowLeft") anterior();
  };
  const onTouchStart = (e) => (inicioTouch.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (inicioTouch.current == null) return;
    const dx = e.changedTouches[0].clientX - inicioTouch.current;
    if (Math.abs(dx) > 45) (dx < 0 ? siguiente : anterior)();
    inicioTouch.current = null;
  };

  const variantes = {
    enter: (d) => ({ opacity: 0, x: reduce ? 0 : d * 40 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: reduce ? 0 : d * -40 }),
  };

  return (
    <section
      className="carrusel"
      aria-roledescription="carrusel"
      aria-label={titulo}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
      onKeyDown={onKey}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="carrusel-cabecera">
        <span className="carrusel-eyebrow">
          {titulo} <span className="carrusel-num">{num} / {tot}</span>
        </span>
        {total > 1 && (
          <div className="carrusel-flechas">
            <button
              type="button"
              className="carrusel-flecha"
              onClick={anterior}
              aria-label="Nota anterior"
            >
              ←
            </button>
            <button
              type="button"
              className="carrusel-flecha"
              onClick={siguiente}
              aria-label="Nota siguiente"
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="carrusel-marco">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={nota.slug}
            custom={dir}
            variants={variantes}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.21, 0.65, 0.36, 1] }}
          >
            <Link href={`/blog/${nota.slug}`} className="carrusel-slide">
              <NotaCover
                categoria={nota.categoria}
                imagen={nota.imagen}
                size="pick"
              />
              <div className="carrusel-cuerpo">
                <span className="carrusel-cat">{nota.categoriaNombre}</span>
                <h3>{nota.titulo}</h3>
                {nota.resumen && <p>{nota.resumen}</p>}
                <span className="carrusel-meta">
                  {nota.minutos} min de lectura{" "}
                  <span className="jx-flecha">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="carrusel-puntos" role="tablist" aria-label="Ir a la nota">
          {notas.map((n, idx) => (
            <button
              key={n.slug}
              type="button"
              role="tab"
              aria-selected={idx === i}
              aria-label={`Nota ${idx + 1}: ${n.titulo}`}
              className={idx === i ? "carrusel-punto on" : "carrusel-punto"}
              onClick={() => ir(idx)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
