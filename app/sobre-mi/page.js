export const metadata = { title: "Sobre mí" };

export default function SobreMi() {
  return (
    <article className="article">
      <div className="container">
        <header>
          <span className="sql-meta">sobre mí</span>
          <h1>Hola, soy Jesús.</h1>
        </header>
        <div className="prose">
          <p>
            Trabajo como Product Owner de Datos y Analítica en el sector
            retail, desde Saltillo, Coahuila. Mi día a día está entre dos
            mundos: el técnico (PySpark, Databricks, Snowflake, Azure) y el de
            negocio (stakeholders, presentaciones ejecutivas, decisiones de
            inversión en datos).
          </p>
          <p>
            Me interesa especialmente la intersección entre ingeniería de
            datos y producto: cómo se migra un data lake sin romper nada, cómo
            se calcula el ROI de una plataforma de datos, y cómo la IA está
            cambiando la forma en que los equipos trabajan.
          </p>
          <h2>Qué encontrarás en este sitio</h2>
          <ul>
            <li>
              <strong>Notas técnicas</strong> sobre Snowflake, PySpark y
              arquitectura de datos, basadas en problemas reales.
            </li>
            <li>
              <strong>Reflexiones</strong> sobre IA aplicada, retail y el rol
              de producto en equipos de datos.
            </li>
            <li>
              <strong>Proyectos</strong> personales y experimentos.
            </li>
          </ul>
          <p>
            ✏️ <em>Edita este texto en</em> <code>app/sobre-mi/page.js</code>{" "}
            <em>para contar tu propia historia.</em>
          </p>
        </div>
      </div>
    </article>
  );
}
