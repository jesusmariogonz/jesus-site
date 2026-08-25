"use client";

import { useState } from "react";
import { MARCADORES } from "@/components/world-geo";
import { PROYECTOS } from "@/lib/proyectos";
import Globe from "@/components/Globe";

/* ============================================================
   Globo terráqueo interactivo de proyectos.
   - Globo 3D girando (cobe) con un marcador por país.
   - Selector tipo chip debajo: al elegir un proyecto, sus países
     se marcan más grandes/brillantes en el globo.
   - Ficha de detalle con la descripción del proyecto seleccionado.
   ============================================================ */

export default function ProjectsMap() {
  const [activo, setActivo] = useState(null);
  const proyecto = PROYECTOS.find((p) => p.id === activo) || null;

  const paisesActivos = new Set(proyecto ? proyecto.paises : []);

  return (
    <div className="pmap">
      <Globe marcadores={MARCADORES} paisesActivos={paisesActivos} />

      <div className="pmap-chips" role="tablist" aria-label="Proyectos">
        {PROYECTOS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={activo === p.id}
            className={`pmap-chip${activo === p.id ? " on" : ""}`}
            onClick={() => setActivo((cur) => (cur === p.id ? null : p.id))}
          >
            <span className="pmap-chip-num">{p.num}</span> {p.corto}
          </button>
        ))}
      </div>

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
            Toca el nombre de un proyecto para ver el detalle y su ubicación
            en el globo.
          </p>
        )}
      </div>
    </div>
  );
}
