"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

/* Coordenadas [lat, lon] de cada país en MARCADORES (world-geo.js) —
   la proyección x/y de ese archivo es para el mapa plano viejo, el
   globo necesita lat/lon reales. */
const COORDS = {
  mexico: [23.6345, -102.5528],
  chile: [-35.6751, -71.543],
  colombia: [4.5709, -74.2973],
  peru: [-9.19, -75.0152],
  suiza: [46.8182, 8.2275],
  luxemburgo: [49.8153, 6.1296],
  alemania: [51.1657, 10.4515],
};

const TAM = 600; // resolución interna fija; el CSS la escala responsivamente

export default function Globe({ marcadores, paisesActivos }) {
  const canvasRef = useRef(null);
  const phiRef = useRef(0);
  const activosRef = useRef(paisesActivos);
  activosRef.current = paisesActivos;

  const paisesDisponibles = Object.keys(marcadores).filter((k) => COORDS[k]);

  useEffect(() => {
    const globo = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: TAM * 2,
      height: TAM * 2,
      phi: 0,
      theta: 0.28,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [0.35, 0.6, 1],
      glowColor: [1.1, 1.1, 1.1],
      markers: paisesDisponibles.map((k) => ({ location: COORDS[k], size: 0.05 })),
      onRender: (state) => {
        // Marcadores activos más grandes y brillantes que el resto
        state.markers = paisesDisponibles.map((k) => ({
          location: COORDS[k],
          size: activosRef.current.has(k) ? 0.11 : 0.05,
        }));
        state.phi = phiRef.current;
        phiRef.current += 0.0032;
      },
    });

    return () => globo.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pglobe-wrap">
      <canvas
        ref={canvasRef}
        className="pglobe-canvas"
        style={{ width: TAM, height: TAM }}
        role="img"
        aria-label="Globo terráqueo girando con la ubicación de los proyectos"
      />
    </div>
  );
}
