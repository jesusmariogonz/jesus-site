import CvTimeline from "@/components/CvTimeline";

export const metadata = { title: "Currículum" };

export default function Curriculum() {
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">currículum</span>
<<<<<<< HEAD
        <h2>Trayectoria</h2>
        <p style={{ margin: "20px 0 36px" }}>
=======
        <h2>Mi trayectoria en una página</h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: "60ch" }}>
          Puedes verlo aquí mismo o descargarlo en PDF.
        </p>
        <p style={{ margin: "20px 0 28px" }}>
>>>>>>> e40169ad88cf7072119c9ff793b8c4989a83d7b2
          <a className="btn" href="/cv/cv.pdf" download>
            Descargar CV (PDF)
          </a>{" "}
          <a
            className="btn ghost"
            href="/cv/cv.pdf"
            target="_blank"
            rel="noopener"
            style={{ marginLeft: 10 }}
          >
            Ver PDF
          </a>
        </p>
        <CvTimeline />
      </div>
    </section>
  );
}
