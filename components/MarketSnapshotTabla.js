import Link from "next/link";
import { buscarActivo } from "@/lib/activos";

// Activos donde "bajar" es la lectura favorable y "subir" la desfavorable
// (al revés que el resto de la tabla): el VIX mide miedo/volatilidad, así
// que un VIX a la baja es una señal positiva; USD/MXN a la baja significa
// un peso más fuerte, que para esta columna se trata como positivo.
const INVERTIDOS = [/\bvix\b/i, /usd\s*\/?\s*mxn/i];

function esInvertido(activo) {
  return INVERTIDOS.some((re) => re.test(activo));
}

function signoDeCambio(cambio) {
  if (!cambio || typeof cambio !== "string") return null;
  if (cambio.trim().startsWith("-")) return -1;
  if (cambio.trim().startsWith("+")) return 1;
  return null;
}

function claseColor(activo, cambio) {
  const signo = signoDeCambio(cambio);
  if (signo == null) return undefined; // sin dato o sin signo explícito ("—"): sin color
  const favorable = esInvertido(activo) ? signo < 0 : signo > 0;
  return favorable ? "snapshot-cambio-positivo" : "snapshot-cambio-negativo";
}

/** Tabla del Market Snapshot, renderizada directamente (sin pasar por
 *  markdown) para poder colorear la columna "Cambio" según el signo —
 *  con lectura invertida para VIX y USD/MXN, donde bajar es la noticia
 *  favorable. `filas` es [[activo, nivel, cambio], ...]. */
export default function MarketSnapshotTabla({ filas }) {
  return (
    <table className="snapshot-tabla">
      <thead>
        <tr>
          <th>Activo</th>
          <th>Nivel</th>
          <th>Cambio</th>
        </tr>
      </thead>
      <tbody>
        {filas.map(([activo, nivel, cambio]) => {
          const match = buscarActivo(activo);
          return (
            <tr key={activo}>
              <td>
                {match ? <Link href={`/pulso-mercado/activos/${match.slug}`}>{activo}</Link> : activo}
              </td>
              <td>{nivel}</td>
              <td className={claseColor(activo, cambio)}>{cambio}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
