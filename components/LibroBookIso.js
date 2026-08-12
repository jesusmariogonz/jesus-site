/* Mockup 3D de libro, en azul (paleta del sitio) — para /recursos.
   Usa la foto real de portada como fondo, con un degradado azul
   encima para que el título siga siendo legible. */

export default function LibroBookIso({ titulo, chip = "PDF", cover }) {
  return (
    <div className="lib-book-wrap" aria-hidden="true">
      <div className="lib-book">
        <div className="lib-book-spine" />
        <div
          className="lib-book-cover"
          style={
            cover
              ? {
                  backgroundImage: `linear-gradient(155deg, rgba(15,47,158,0.35), rgba(28,72,201,0.78)), url(${cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          <span className="lib-book-cover-mark">{chip}</span>
          <span className="lib-book-cover-title">{titulo}</span>
        </div>
        <div className="lib-book-pages" />
      </div>
    </div>
  );
}
