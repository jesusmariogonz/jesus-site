"use client";

import { useState } from "react";
import { VIEWBOX, LAND_PATH, MARCADORES } from "@/components/world-geo";
import { PROYECTOS } from "@/lib/proyectos";

/* ============================================================
   Mapa mundial interactivo de proyectos.
   - Silueta real de los continentes (pre-generada, sin d3 en runtime)
   - Marcadores por país con líneas guía hacia el nombre del proyecto
   - Hover / focus / tap sobre una etiqueta o marcador → resalta
     sus países y muestra la ficha de detalle debajo del mapa
   - En pantallas chicas las etiquetas del SVG se ocultan y la
     selección se hace con los botones tipo chip bajo el mapa
   ============================================================ */

// Puntos de anclaje de las líneas guía (coordenadas del viewBox)
const ANCLA_IZQ = 240; // etiquetas de la izquierda, alineadas a la derecha
const ANCLA_DER = 866; // etiquetas de la derecha, alineadas a la izquierda

export default function ProjectsMap() {
  const [activo, setActivo] = useState(null);
  const proyecto = PROYECTOS.find((p) => p.id === activo) || null;

  // Países que deben resaltarse
  const paisesActivos = new Set(proyecto ? proyecto.paises : []);

  return (
    <div className="pmap">
      <svg
        className="pmap-svg"
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        role="img"
        aria-label="Mapa mundial con la ubicación de los proyectos"
      >
        <defs>
          {/* Sombra que despega el mapa del fondo */}
          <filter id="pmap-sombra" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="16"
              floodColor="#0a1430"
              floodOpacity="0.35"
            />
          </filter>
          <radialGradient id="pmap-halo" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.10" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Halo de fondo */}
        <ellipse
          cx={VIEWBOX.w / 2}
          cy={VIEWBOX.h / 2}
          rx={430}
          ry={250}
          fill="url(#pmap-halo)"
        />

        {/* Continentes */}
        <g filter="url(#pmap-sombra)">
          <path d={LAND_PATH} className="pmap-land" />
        </g>

        {/* Líneas guía etiqueta → país */}
        {PROYECTOS.map((p) => {
          const x0 = p.lado === "izq" ? ANCLA_IZQ + 8 : ANCLA_DER - 8;
          const on = activo === p.id;
          return p.paises.map((k) => {
            const m = MARCADORES[k];
            return (
              <line
                key={`${p.id}-${k}`}
                x1={x0}
                y1={p.labelY - 5}
                x2={m.x}
                y2={m.y}
                className={`pmap-linea${on ? " on" : ""}`}
              />
            );
          });
        })}

        {/* Marcadores por país */}
        {Object.entries(MARCADORES).map(([k, m]) => {
          const on = paisesActivos.has(k);
          return (
            <g key={k} className={`pmap-marker${on ? " on" : ""}`}>
              <circle cx={m.x} cy={m.y} r="11" className="pmap-pulso" />
              <circle cx={m.x} cy={m.y} r="4.5" className="pmap-punto" />
              {on && (
                <text x={m.x + 12} y={m.y + 4} className="pmap-pais">
                  {m.nombre}
                </text>
              )}
            </g>
          );
        })}

        {/* Etiquetas de proyecto (solo escritorio) */}
        {PROYECTOS.map((p) => {
          const izq = p.lado === "izq";
          const x = izq ? ANCLA_IZQ : ANCLA_DER;
          const on = activo === p.id;
          return (
            <g
              key={p.id}
              className={`pmap-label${on ? " on" : ""}`}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalle: ${p.nombre}`}
              onMouseEnter={() => setActivo(p.id)}
              onFocus={() => setActivo(p.id)}
              onClick={() => setActivo(p.id)}
            >
              {/* Zona de hover más generosa que el texto */}
              <rect
                x={izq ? x - 230 : x}
                y={p.labelY - 26}
                width={230}
                height={36}
                fill="transparent"
              />
              <text
                x={x}
                y={p.labelY - 12}
                textAnchor={izq ? "end" : "start"}
                className="pmap-num"
              >
                {p.num}
              </text>
              <text
                x={x}
                y={p.labelY + 5}
                textAnchor={izq ? "end" : "start"}
                className="pmap-nombre"
              >
                {p.corto}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Selector tipo chip (visible en pantallas chicas) */}
      <div className="pmap-chips" role="tablist" aria-label="Proyectos">
        {PROYECTOS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={activo === p.id}
            className={`pmap-chip${activo === p.id ? " on" : ""}`}
            onClick={() => setActivo(p.id)}
          >
            <span className="pmap-chip-num">{p.num}</span> {p.corto}
          </button>
        ))}
      </div>

      {/* Ficha de detalle */}
      <div className="pmap-detalle" aria-live="polite">
        {proyecto ? (
          <>
            <span className="sql-meta">-- {proyecto.region}</span>
            <h3>{proyecto.nombre}</h3>
            <p>{proyecto.descripcion}</p>
            <div className="pmap-detalle-chips">
              {proyecto.chips.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
          </>
        ) : (
          <p className="pmap-vacio">
            Pasa el cursor (o toca) el nombre de un proyecto para ver el
            detalle y su ubicación en el mapa.
          </p>
        )}
      </div>
    </div>
  );
}
