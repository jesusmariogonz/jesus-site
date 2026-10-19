/* ============================================================
   Carga los resultados ya calculados (JSON/CSV reales, generados por
   los scripts de Python en proyectos-propios/pricing-cientifico/) para
   el primer "proyecto propio" de /proyectos. Nada de esto se inventa a
   mano: son los números que produjeron generar_datos.py,
   modelo_elasticidad.py y optimizar_precio.py — si se vuelven a correr
   los scripts, estos archivos se regeneran y la página cambia con ellos.
   ============================================================ */
import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "proyectos-propios", "pricing-cientifico");

function leerJSON(nombre) {
  return JSON.parse(fs.readFileSync(path.join(dir, nombre), "utf8"));
}

function leerCSV(nombre) {
  const raw = fs.readFileSync(path.join(dir, nombre), "utf8").trim();
  const [cabecera, ...filas] = raw.split("\n");
  const columnas = cabecera.split(",");
  return filas.map((fila) => {
    const valores = fila.split(",");
    const obj = {};
    columnas.forEach((col, i) => {
      obj[col] = Number(valores[i]);
    });
    return obj;
  });
}

export function getPricingCientifico() {
  const meta = leerJSON("datos_meta.json");
  const modelo = leerJSON("resultado_modelo.json");
  const optimizacion = leerJSON("resultado_optimizacion.json");
  const curvaUtilidad = leerCSV("curva_utilidad.csv");

  // Muestra reducida del panel (una fila por tienda-semana completa es
  // demasiado para un scatter legible) — una observación de cada
  // combinación (tienda%5===0), suficiente para ver la nube de puntos
  // precio-cantidad real sin mandar las 2,080 filas al navegador.
  const panelCompleto = leerCSV("datos_panel.csv");
  const muestraScatter = panelCompleto.filter((r) => r.tienda % 5 === 0);

  return { meta, modelo, optimizacion, curvaUtilidad, muestraScatter };
}
