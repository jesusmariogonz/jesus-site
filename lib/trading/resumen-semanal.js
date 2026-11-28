import fs from "fs";
import path from "path";

/* Lee los resúmenes semanales de trading (uno por viernes) de
   lib/resumen-semanal/<YYYY-MM-DD>.json. Los genera la rutina de los
   viernes (ver src/reports/resumen_semanal.py en el repo del motor). */

const DIR = path.join(process.cwd(), "lib", "resumen-semanal");
const SLUG = /^\d{4}-\d{2}-\d{2}$/;

export function listarSemanas() {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .map((f) => f.replace(/\.json$/, ""))
    .filter((s) => SLUG.test(s))
    .sort()
    .reverse();
}

export function getSemana(slug) {
  if (!SLUG.test(slug)) return null;
  const archivo = path.join(DIR, `${slug}.json`);
  if (!fs.existsSync(archivo)) return null;
  return JSON.parse(fs.readFileSync(archivo, "utf8"));
}

export function getUltimaSemana() {
  const [slug] = listarSemanas();
  return slug ? { slug, resumen: getSemana(slug) } : null;
}
