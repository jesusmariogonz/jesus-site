import fs from "fs";
import path from "path";

/* Lee el resumen semanal de trading más reciente de
   lib/resumen-semanal/<YYYY-MM-DD>.json. Solo se conserva la última
   semana: la rutina de los viernes (src/reports/resumen_semanal.py en el
   repo del motor) borra la anterior al publicar la nueva. */

const DIR = path.join(process.cwd(), "lib", "resumen-semanal");
const ARCHIVO = /^(\d{4}-\d{2}-\d{2})\.json$/;

export function getUltimaSemana() {
  if (!fs.existsSync(DIR)) return null;
  const [slug] = fs
    .readdirSync(DIR)
    .map((f) => f.match(ARCHIVO)?.[1])
    .filter(Boolean)
    .sort()
    .reverse();
  if (!slug) return null;
  return { slug, resumen: JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), "utf8")) };
}
