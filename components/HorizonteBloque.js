import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { proximaCorrida, formatProximaCorrida } from "@/lib/pulsoSchedule";

/* Bloque reutilizable de contenido para las páginas de horizonte
   (/swing, /position, /long-term): título + markdown, o un estado
   vacío si esa sección todavía no existe. `tipoCorrida` (daily,
   weeklyOutlook, monthly) es opcional: si se pasa, muestra junto a la
   fecha cuándo se actualizó por última vez y cuándo corre la próxima
   vez la rutina que alimenta esta sección. */
export default function HorizonteBloque({ titulo, fuente, markdown, vacio, tipoCorrida }) {
  const proxima = tipoCorrida ? formatProximaCorrida(proximaCorrida(tipoCorrida)) : null;
  return (
    <div className="horizonte-bloque">
      <div className="horizonte-bloque-head">
        <h2>{titulo}</h2>
        <span className="horizonte-bloque-meta">
          {fuente && <span className="horizonte-bloque-fuente">Última: {fuente}</span>}
          {proxima && <span className="horizonte-bloque-proxima">Próxima: {proxima}</span>}
        </span>
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
