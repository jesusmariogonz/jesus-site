"use client";

/* ============================================================
   Globo "que gira" sin WebGL: silueta real de continentes (la
   misma geografía de world-geo.js) repetida dos veces en una tira
   horizontal, animada con un scroll infinito dentro de un círculo
   recortado — el truco clásico de "tierra girando" de toda la vida,
   sin depender de una librería 3D que puede fallar según el
   dispositivo.
   ============================================================ */

import { VIEWBOX, LAND_PATH } from "@/components/world-geo";

export default function Globe({ marcadores, paisesActivos }) {
  const { w, h } = VIEWBOX;

  return (
    <div className="pglobe-wrap">
      <div className="pglobe-circulo">
        <div className="pglobe-tira">
          {[0, 1].map((copia) => (
            <svg
              key={copia}
              className="pglobe-svg"
              viewBox={`0 0 ${w} ${h}`}
              width={w}
              height={h}
              role={copia === 0 ? "img" : undefined}
              aria-label={
                copia === 0
                  ? "Globo terráqueo girando con la ubicación de los proyectos"
                  : undefined
              }
              aria-hidden={copia === 1 || undefined}
            >
              <path d={LAND_PATH} className="pglobe-land" />
              {Object.entries(marcadores).map(([k, m]) => {
                const on = paisesActivos.has(k);
                return (
                  <g key={k} className={`pglobe-marker${on ? " on" : ""}`}>
                    <circle cx={m.x} cy={m.y} r="10" className="pglobe-pulso" />
                    <circle cx={m.x} cy={m.y} r="4.5" className="pglobe-punto" />
                  </g>
                );
              })}
            </svg>
          ))}
        </div>
        <div className="pglobe-sombra" />
      </div>
    </div>
  );
}
