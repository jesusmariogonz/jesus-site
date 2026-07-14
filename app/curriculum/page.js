import CvTimeline from "@/components/CvTimeline";

export const metadata = { title: "Currículum" };

export default function Curriculum() {
  return (
    <section className="section">
      <div className="container">
        <span className="sql-meta">currículum</span>
        <h2>Trayectoria</h2>
        <p style={{ margin: "20px 0 36px" }}>
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
