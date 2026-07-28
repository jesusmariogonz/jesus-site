import Image from "next/image";

export const metadata = {
  title: "Sobre mí",
  description:
    "Jesús Mario González Siller (Chuy): Arquitecto de Soluciones y Product Owner de Data, Analytics & IA en FEMSA, desde Saltillo, México.",
  alternates: { canonical: "/sobre-mi" },
};

const focos = [
  {
    titulo: "Producto de datos",
    desc: "Definición, evolución y entrega de productos de datos alineados a objetivos de negocio.",
  },
  {
    titulo: "Arquitectura analítica",
    desc: "Diseño de soluciones sobre Snowflake, Databricks y Azure bajo estándares de gobierno de datos.",
  },
  {
    titulo: "IA aplicada",
    desc: "Analítica avanzada e inteligencia artificial generativa llevadas a casos de uso reales.",
  },
  {
    titulo: "Valor y ROI",
    desc: "Casos de negocio, TCO y retorno de inversión de plataformas de datos, contados en lenguaje ejecutivo.",
  },
];

export default function SobreMi() {
  return (
    <article className="article">
      <div className="container">
        <header>
          <span className="sql-meta">-- sobre mí</span>
          <h1>Hola, soy Jesús González.</h1>
        </header>
        <div className="prose">
          <p>
            Soy <strong>Responsable de Producto Data &amp; Analytics y
            Arquitecto de Soluciones Analíticas</strong> en FEMSA Proximidad y
            Salud, desde Saltillo, Coahuila. Ingeniero en Electrónica y
            Comunicaciones por la UANL, con más de 13 años de experiencia en
            tecnologías de información y datos.
          </p>
          <p>
            Mi trabajo consiste en liderar la definición, evolución y entrega
            de soluciones analíticas y productos de datos que habilitan la
            toma de decisiones estratégicas y operativas del negocio:
            asegurando la alineación entre las necesidades de las unidades de
            negocio, la arquitectura tecnológica y los estándares de gobierno
            de datos, y generando valor mediante analítica avanzada,
            inteligencia artificial y capacidades digitales.
          </p>

          <h2>En qué me enfoco</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 14,
              margin: "18px 0 8px",
            }}
          >
            {focos.map((f) => (
              <div
                key={f.titulo}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--radius)",
                  padding: "16px 18px",
                }}
              >
                <strong style={{ color: "var(--accent)" }}>{f.titulo}</strong>
                <p style={{ margin: "6px 0 0", fontSize: "0.94rem" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <h2>Mi trayectoria</h2>
          <p>
            Antes de mi rol actual fui <strong>Data Manager en FEMSA
            Comercio</strong>, administrando el repositorio central de datos y
            automatizando la generación de información para nuevos negocios.
            Pasé también por la ingeniería de datos (Raken Data Group), la
            inteligencia de clientes en retail (Falabella · Soriana), la
            consultoría de Business Intelligence en el sector financiero
            (Dimex Capital) y la infraestructura de TI (Neoris de México). Esa
            mezcla me permite hablar el idioma técnico y el de negocio con la
            misma soltura.
          </p>

          <h2>Qué encontrarás en este sitio</h2>
          <ul>
            <li>
              <strong>Notas técnicas</strong> sobre Snowflake, PySpark,
              Databricks y arquitectura de datos, basadas en problemas reales.
            </li>
            <li>
              <strong>Reflexiones</strong> sobre IA aplicada, retail y el rol
              de producto en equipos de datos.
            </li>
            <li>
              <strong>Proyectos</strong> personales y experimentos.
            </li>
          </ul>
        </div>
      </div>
    </article>
  );
}
