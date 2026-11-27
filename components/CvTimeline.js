"use client";

import { motion, useReducedMotion } from "framer-motion";

/* Línea de tiempo del CV — dinámica, con "logo" de cada empresa.
   LOGOS: por defecto se usa un monograma con el color de la marca.
   Si quieres el logo real, guarda el archivo en /public/logos/
   (ej. public/logos/femsa.png) y pon la ruta en el campo `logo`. */

const EXPERIENCIA = [
  {
    puesto: "Data, Analytics & AI Solutions Architect",
    empresa: "FEMSA Proximidad y Salud",
    inicial: "F",
    color: "#d61027",
    logo: "/logos/femsa.png",
    periodo: "2024 — Actual",
    desc: "Productos de datos y soluciones analíticas para LATAM y Europa: estrategia, gobierno y valor con IA.",
    resultados: ["Liderazgo de iniciativas de datos, analítica avanzada e IA en múltiples unidades de negocio y geografías.","Definición de estrategias de arquitectura y gobierno de datos para plataformas analíticas corporativas.","Seguimiento del valor de negocio de iniciativas estratégicas (≈ $130 M MXN documentados, acumulado)."],
    kpis: [{ v: "7", e: "Países" }, { v: "20+", e: "Iniciativas" }, { v: "$130 M", e: "Valor MXN doc." }, { v: "5+", e: "Unidades" }],
    stack: ["Snowflake", "Databricks", "Azure", "IA"],
  },
  {
    puesto: "Arquitecto de Datos",
    empresa: "FEMSA Comercio · OXXO",
    inicial: "F",
    color: "#e4002b",
    logo: "/logos/oxxo.png",
    periodo: "2019 — 2024",
    desc: "Administración del repositorio central de datos y automatización de información para nuevos negocios.",
    resultados: ["Administración y evolución del repositorio central de datos para necesidades analíticas y operativas.","Automatización de la integración y generación de información para nuevos negocios.","Soluciones de datos sobre Azure y Snowflake para nuevas capacidades analíticas."],
    stack: ["Azure", "Snowflake", "Python"],
  },
  {
    puesto: "Data Engineer",
    empresa: "Raken Data Group",
    inicial: "R",
    color: "#6366f1",
    logo: "/logos/raken.jpeg",
    periodo: "2018 — 2019",
    desc: "Integración de datos y optimización del almacenamiento y distribución de información.",
    resultados: ["Procesos de integración y transformación de datos desde distintas fuentes.","Optimización de ETL y almacenamiento para mejorar la disponibilidad y distribución de datos.","Soluciones SQL para automatizar el procesamiento y la consulta de información."],
    stack: ["ETL", "SQL"],
  },
  {
    puesto: "Subgerente de Inteligencia de Clientes",
    empresa: "Falabella · Soriana",
    inicial: "S",
    color: "#16a34a",
    logo: "/logos/falabella.jpeg",
    periodo: "2018",
    desc: "Análisis del cliente y analítica predictiva para decisiones comerciales.",
    resultados: ["Capacidades de inteligencia de clientes para apoyar decisiones comerciales.","Analítica predictiva para identificar patrones de comportamiento y oportunidades comerciales.","Información transaccional y de clientes convertida en indicadores para decidir."],
    stack: ["BI", "Predictivo"],
  },
  {
    puesto: "Consultor de Business Intelligence",
    empresa: "Dimex Capital",
    inicial: "D",
    color: "#0ea5e9",
    logo: "/logos/dimex.png",
    periodo: "2013 — 2018",
    desc: "Arquitectura y operación de sistemas de análisis de información financiera.",
    resultados: ["Soluciones de Business Intelligence para el análisis de información financiera.","Modelos de información para el seguimiento de indicadores y resultados del negocio.","Automatización de la generación y consulta de información para áreas financieras y directivas."],
    stack: ["BI", "Finanzas"],
  },
  {
    puesto: "Ingeniero de Proyectos e Infraestructura",
    empresa: "Neoris de México",
    inicial: "N",
    color: "#f59e0b",
    logo: "/logos/neoris.jpg",
    periodo: "2012 — 2013",
    desc: "Implementación de sistemas y configuración de servidores físicos y virtuales.",
    resultados: ["Implementación y configuración de infraestructura tecnológica empresarial.","Administración de servidores físicos y virtuales que soportan servicios y aplicaciones.","Puesta en operación de soluciones tecnológicas y proyectos de infraestructura."],
    stack: ["Infraestructura"],
  },
];

export default function CvTimeline() {
  const reduce = useReducedMotion();

  return (
    <ol className="cvt">
      {EXPERIENCIA.map((e, i) => (
        <motion.li
          key={e.empresa + e.periodo}
          className="cvt-item"
          initial={reduce ? false : { opacity: 0, x: -18 }}
          whileInView={reduce ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.21, 0.65, 0.36, 1] }}
        >
          <div className="cvt-logo" style={{ background: e.logo ? "transparent" : e.color }}>
            {e.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.logo} alt={e.empresa} />
            ) : (
              e.inicial
            )}
          </div>
          <div className="cvt-body">
            <span className="cvt-periodo">{e.periodo}</span>
            <h3>{e.puesto}</h3>
            <p className="cvt-empresa">{e.empresa}</p>
            <p className="cvt-desc">{e.desc}</p>
            {e.kpis && (
              <>
                <div className="cvt-kpis">
                  {e.kpis.map((k) => (
                    <div key={k.e}>
                      <strong>{k.v}</strong>
                      <span>{k.e}</span>
                    </div>
                  ))}
                </div>
                <p className="cvt-nota">
                  Indicadores acumulados de trayectoria, no atribuibles exclusivamente a este puesto.
                </p>
              </>
            )}
            <ul className="cvt-res">
              {e.resultados.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="cvt-stack">
              {e.stack.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
