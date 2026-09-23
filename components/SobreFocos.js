import ProjectArt from "@/components/ProjectArt";

/* Tarjetas de "Cómo trabajo" (Sobre mí) — mismo lenguaje visual que
   las tarjetas de Proyectos: arte SVG propio con degradado y overlay,
   título sobre la imagen, sin fotos de stock. */

const PALETA = {
  producto: ["#38bdf8", "#0c2a3a"],
  arquitectura: ["#8b5cf6", "#241a45"],
  ia: ["#10b981", "#0a2e22"],
  roi: ["#f59e0b", "#3a2508"],
};

export default function SobreFocos({ focos }) {
  return (
    <div className="sobre-focos-grid">
      {focos.map((f) => {
        const [hueA, hueB] = PALETA[f.icono] || PALETA.producto;
        return (
          <article key={f.titulo} className="sobre-foco-card">
            <div className="sobre-foco-art">
              <ProjectArt variant={f.icono} hueA={hueA} hueB={hueB} />
              <span className="sobre-foco-overlay" />
              <strong className="sobre-foco-titulo">{f.titulo}</strong>
            </div>
            <p className="sobre-foco-desc">{f.desc}</p>
          </article>
        );
      })}
    </div>
  );
}
