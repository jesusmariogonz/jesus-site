import Link from "next/link";

export const metadata = {
  title: "The Toolkit",
  description:
    "Plantillas, kits y recursos de analítica, datos e IA para retail — Power BI, SQL, Excel y más, listos para usar.",
  alternates: { canonical: "/the-toolkit" },
};

const RECURSOS = [
  {
    id: "power-bi",
    nombre: "Power BI de Cero a Hero",
    resumen:
      "Curso práctico para construir dashboards de analítica desde cero, con buenas prácticas de modelado.",
    formato: "Curso + PDF",
  },
  {
    id: "excel-finanzas",
    nombre: "Excel & Finanzas Caseras",
    resumen:
      "Plantillas de Excel listas para usar y el manual de finanzas personales, para ordenar números rápido.",
    formato: "Plantillas + Manual",
  },
  {
    id: "sql-retail",
    nombre: "SQL for Retail",
    resumen:
      "Kit completo de consultas y ejercicios SQL aplicados a analítica de retail y punto de venta.",
    formato: "Kit completo",
  },
  {
    id: "retail-analytics-claude",
    nombre: "Retail Analytics con Claude",
    resumen:
      "Skills y prompts listos para usar Claude como copiloto de analítica retail en el día a día.",
    formato: "Kit de skills",
  },
  {
    id: "modelo-punto-venta",
    nombre: "Modelo analítico de punto de venta",
    resumen:
      "Framework para estructurar un modelo analítico de punto de venta de principio a fin.",
    formato: "Kit completo",
  },
  {
    id: "prompting-profesional",
    nombre: "Prompting Profesional",
    resumen:
      "Manual para escribir prompts que de verdad rinden en trabajo real de datos y negocio.",
    formato: "Manual",
  },
];

export default function TheToolkit() {
  return (
    <section className="tk-page">
      <div className="container">
        <div className="tk-hero">
          <span className="tk-hero-eyebrow">The Toolkit</span>
          <h1 className="tk-hero-title">
            Recursos de datos y analítica, listos para usar.
          </h1>
          <p className="tk-hero-desc">
            Plantillas, kits y cursos que uso en proyectos reales de datos,
            IA y retail — empaquetados para que los apliques directo, sin
            reinventar la rueda.
          </p>
          <span className="tk-hero-badge">Muy pronto disponible</span>
        </div>

        <div className="tk-grid">
          {RECURSOS.map((r) => (
            <article key={r.id} className="tk-card">
              <span className="tk-card-formato">{r.formato}</span>
              <h3 className="tk-card-title">{r.nombre}</h3>
              <p className="tk-card-desc">{r.resumen}</p>
              <span className="tk-card-status">Próximamente</span>
            </article>
          ))}
        </div>

        <div className="tk-cta-final">
          <p>
            ¿Quieres que te avise en cuanto abra The Toolkit?
          </p>
          <Link href="/contacto" className="tk-banner-cta">
            Avísenme →
          </Link>
        </div>
      </div>
    </section>
  );
}
