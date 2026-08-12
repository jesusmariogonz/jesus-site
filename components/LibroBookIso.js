/* Mockup 3D de libro, en azul (paleta del sitio) — para /recursos.
   Mismo estilo que el de The Toolkit, pero sin negro/dorado. */

export default function LibroBookIso({ titulo, chip = "PDF" }) {
  return (
    <div className="lib-book-wrap" aria-hidden="true">
      <div className="lib-book">
        <div className="lib-book-spine" />
        <div className="lib-book-cover">
          <span className="lib-book-cover-mark">{chip}</span>
          <span className="lib-book-cover-title">{titulo}</span>
        </div>
        <div className="lib-book-pages" />
      </div>
    </div>
  );
}
