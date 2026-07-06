export const metadata = { title: "Currículum" };

export default function Curriculum() {
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">currículum</span>
        <h2>Mi trayectoria en una página</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
          Puedes verlo aquí mismo o descargarlo en PDF. Para actualizarlo,
          reemplaza el archivo <code>public/cv/cv.pdf</code> del proyecto.
        </p>
        <p style={{ margin: "20px 0 28px" }}>
          <a className="btn" href="/cv/cv.pdf" download>
            Descargar PDF
          </a>{" "}
          <a
            className="btn ghost"
            href="/cv/cv.pdf"
            target="_blank"
            rel="noopener"
            style={{ marginLeft: 10 }}
          >
            Abrir en otra pestaña
          </a>
        </p>
        <object
          className="pdf-frame"
          data="/cv/cv.pdf"
          type="application/pdf"
          aria-label="Currículum en PDF"
        >
          <p style={{ padding: 24 }}>
            Tu navegador no puede mostrar el PDF aquí.{" "}
            <a href="/cv/cv.pdf">Descárgalo directamente</a>.
          </p>
        </object>
      </div>
    </section>
  );
}
