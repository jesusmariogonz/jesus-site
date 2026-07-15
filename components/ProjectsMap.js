"use client";

import { useState } from "react";
import { VIEWBOX, LAND_PATH, MARCADORES } from "@/components/world-geo";

/* ============================================================
   Mapa mundial interactivo de proyectos.
   - Silueta real de los continentes (pre-generada, sin d3 en runtime)
   - Marcadores por país con líneas guía hacia el nombre del proyecto
   - Hover / focus / tap sobre una etiqueta o marcador → resalta
     sus países y muestra la ficha de detalle debajo del mapa
   - En pantallas chicas las etiquetas del SVG se ocultan y la
     selección se hace con los botones tipo chip bajo el mapa
   ============================================================ */

const PROYECTOS = [
  {
    id: "lealtad",
    num: "01",
    corto: "Lealtad y analítica de clientes",
    nombre: "Transformación de plataformas de lealtad y analítica de clientes",
    paises: ["mexico"],
    region: "México",
    lado: "izq",
    labelY: 62,
    descripcion:
      "Liderazgo en la evolución tecnológica de plataformas de lealtad y analítica de clientes, impulsando la modernización de arquitecturas de datos, migraciones tecnológicas e integración de información para fortalecer capacidades analíticas.",
    chips: [
      "Arquitectura de datos",
      "Migración a la nube",
      "Gobierno de datos",
      "Personalización",
    ],
  },
  {
    id: "modernizacion",
    num: "02",
    corto: "Modernización analítica",
    nombre: "Evaluación de estrategia analítica y modernización tecnológica",
    paises: ["mexico"],
    region: "México",
    lado: "izq",
    labelY: 132,
    descripcion:
      "Lideré la evaluación de la estrategia de datos y la evolución tecnológica de plataformas analíticas, definiendo hojas de ruta para migraciones hacia arquitecturas modernas en la nube, optimización de procesos de datos y adopción de nuevas capacidades de inteligencia artificial y analítica avanzada.",
    chips: ["Snowflake", "Azure Data Factory", "Databricks", "Gobierno de Datos"],
  },
  {
    id: "recomendacion",
    num: "03",
    corto: "Motor de recomendación",
    nombre: "Motor de recomendación de productos",
    paises: ["chile", "colombia", "peru"],
    region: "Chile · Colombia · Perú",
    lado: "izq",
    labelY: 202,
    descripcion:
      "Diseñé la estrategia analítica para implementar motores de recomendación personalizados utilizando modelos de comportamiento de compra, afinidad entre productos (Market Basket Analysis), segmentación de clientes y patrones de consumo. El objetivo: incrementar la venta cruzada, mejorar la experiencia del cliente y aumentar el ticket promedio mediante recomendaciones inteligentes en distintos canales comerciales.",
    chips: ["Snowflake", "Databricks", "Python", "Spark", "Machine Learning"],
  },
  {
    id: "pos",
    num: "04",
    corto: "Plataforma Punto de Venta",
    nombre: "Evolución de la plataforma de Punto de Venta",
    paises: ["colombia"],
    region: "Colombia",
    lado: "izq",
    labelY: 272,
    descripcion:
      "Participé en la evolución tecnológica y analítica del ecosistema de Punto de Venta, diseñando soluciones para mejorar la captura, procesamiento y explotación de información transaccional. El proyecto fortaleció la disponibilidad de datos para inteligencia comercial, pricing, promociones y operación de tiendas.",
    chips: ["Datos transaccionales", "Inteligencia comercial", "Retail"],
  },
  {
    id: "agente",
    num: "05",
    corto: "Agente IA de procesos",
    nombre: "Agente Inteligente para Automatización de Procesos",
    paises: ["peru"],
    region: "Perú",
    lado: "izq",
    labelY: 342,
    descripcion:
      "Diseñé la estrategia funcional y técnica para un agente basado en Inteligencia Artificial Generativa enfocado en automatizar procesos de negocio, asistir a usuarios en consultas operativas y reducir tiempos de ejecución mediante automatización inteligente e integración con fuentes corporativas de información.",
    chips: ["IA Generativa", "Copilot", "RAG", "Automatización"],
  },
  {
    id: "clima",
    num: "06",
    corto: "Forecast climático",
    nombre: "Pronóstico de ventas basado en variables climáticas",
    paises: ["suiza"],
    region: "Suiza",
    lado: "der",
    labelY: 92,
    descripcion:
      "Participé en el diseño de un modelo predictivo que incorporó información meteorológica como variable explicativa para anticipar la demanda de productos sensibles al clima. El proyecto permitió mejorar la precisión de los pronósticos y optimizar decisiones de abastecimiento e inventario.",
    chips: ["Forecasting", "Machine Learning", "Datos climáticos"],
  },
  {
    id: "pricing",
    num: "07",
    corto: "Pricing inteligente",
    nombre: "Estrategia de Pricing Inteligente",
    paises: ["luxemburgo", "alemania"],
    region: "Luxemburgo · Alemania",
    lado: "der",
    labelY: 162,
    descripcion:
      "Definí la arquitectura analítica para iniciativas de pricing dinámico y optimización de precios, utilizando elasticidad de demanda, comportamiento histórico de ventas y simulaciones de escenarios para maximizar rentabilidad sin afectar el volumen de ventas.",
    chips: ["Revenue Management", "Data Science", "Optimización comercial"],
  },
  {
    id: "genai",
    num: "08",
    corto: "Plataforma GenAI",
    nombre:
      "Plataforma de Inteligencia Artificial Generativa para analítica empresarial",
    paises: ["suiza"],
    region: "Suiza",
    lado: "der",
    labelY: 232,
    descripcion:
      "Liderazgo en el diseño de una solución de IA Generativa enfocada en democratizar el acceso a la información empresarial mediante asistentes conversacionales capaces de responder preguntas de negocio utilizando datos corporativos confiables.",
    chips: ["GenAI", "NLP", "RAG", "Analítica self-service"],
  },
];

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
