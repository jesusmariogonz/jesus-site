import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* Bloque reutilizable de contenido para las páginas de horizonte
   (/swing, /position, /long-term): título + markdown, o un estado
   vacío si esa sección todavía no existe. */
export default function HorizonteBloque({ titulo, fuente, markdown, vacio }) {
  return (
    <div className="horizonte-bloque">
      <div className="horizonte-bloque-head">
        <h2>{titulo}</h2>
        {fuente && <span className="horizonte-bloque-fuente">{fuente}</span>}
      </div>
      {markdown ? (
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      ) : (
        <p className="pulsodash-vacio">{vacio}</p>
      )}
    </div>
  );
}
