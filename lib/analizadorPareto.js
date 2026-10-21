/* ============================================================
   Carga los resultados ya calculados (JSON reales, generados por
   proyectos-propios/analizador-pareto/analizador_pareto.py sobre los
   tres datasets de ejemplo) para el proyecto "Analizador de Pareto" de
   /proyectos. Nada de esto se inventa a mano: si se vuelve a correr el
   script sobre cualquier CSV con columnas (categoria, valor), estos
   archivos se regeneran y la página cambia con ellos.
   ============================================================ */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "proyectos-propios", "analizador-pareto", "salidas");

function leerJSON(nombre) {
  return JSON.parse(fs.readFileSync(path.join(dir, nombre), "utf8"));
}

export function getAnalizadorPareto() {
  return {
    devoluciones: leerJSON("devoluciones_retail.json"),
    defectos: leerJSON("defectos_manufactura.json"),
    skus: leerJSON("ventas_skus.json"),
  };
}
