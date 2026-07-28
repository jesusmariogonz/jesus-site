"use client";

import { useEffect, useState } from "react";

/* Barra fina de progreso de lectura, fija arriba del artículo.
   Da al lector una señal de cuánto le falta: sube la permanencia. */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf = 0;
    const calcular = () => {
      const h = document.documentElement;
      const alto = h.scrollHeight - h.clientHeight;
      setPct(alto > 0 ? Math.min(100, (h.scrollTop / alto) * 100) : 0);
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(calcular);
    };
    calcular();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="lectura-progreso" aria-hidden>
      <div className="lectura-progreso-barra" style={{ width: `${pct}%` }} />
    </div>
  );
}
