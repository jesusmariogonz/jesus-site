import Link from "next/link";
import { getAnalizadorPareto } from "@/lib/analizadorPareto";
import ParetoAnalizadorChart from "@/components/ParetoAnalizadorChart";
import ParetoAnalizadorArquitectura from "@/components/ParetoAnalizadorArquitectura";
import { absUrl } from "@/lib/site";

const REPO_URL = "https://github.com/jesusmariogonz/jesus-site/tree/main/proyectos-propios/analizador-pareto";
const DESCARGAS = "/proyectos/analizador-pareto";

export const metadata = {
  title: "Analizador de Pareto — expediente de proyecto independiente",
  description:
    "Expediente completo de un proyecto independiente y reproducible: una herramienta genérica de línea de comandos que convierte cualquier CSV de causas en un diagrama de Pareto, con tres datasets de ejemplo, código Python completo y arquitectura de referencia.",
  alternates: { canonical: "/proyectos/analizador-pareto" },
  openGraph: {
    type: "article",
    url: absUrl("/proyectos/analizador-pareto"),
    title: "Analizador de Pareto — expediente de proyecto independiente",
  },
};

export default function AnalizadorPareto() {
  const { devoluciones, defectos, skus } = getAnalizadorPareto();
  const ejemplos = [
    { id: "devoluciones", resultado: devoluciones, archivo: "devoluciones_retail" },
    { id: "defectos", resultado: defectos, archivo: "defectos_manufactura" },
    { id: "skus", resultado: skus, archivo: "ventas_skus" },
  ];

  return (
    <section className="section pc-page">
      <div className="container prose-container">
        <Link href="/proyectos" className="lib-back">
          ← Proyectos
        </Link>

        <span className="lib-hero-eyebrow" style={{ marginTop: 20 }}>
          Proyecto independiente · reproducible
        </span>
        <h1 style={{ margin: "14px 0 10px" }}>Analizador de Pareto</h1>
        <p className="pmap-intro" style={{ marginBottom: 8 }}>
          Una herramienta genérica — no un ejemplo de un solo uso — que convierte cualquier CSV
          de causas o categorías en un diagrama de Pareto completo, con código Python reproducible.
        </p>
        <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", lineHeight: 1.6 }}>
          La nota{" "}
          <Link href="/blog/principio-pareto-regla-80-20-retail">El principio de Pareto: la regla del 80/20</Link>{" "}
          mostró un script hecho a la medida de un solo ejemplo (devoluciones en retail). Este
          proyecto generaliza ese script en una herramienta reutilizable: el mismo código,
          sin modificar una sola línea, produce el análisis completo para tres datasets
          distintos — declarados como ilustrativos, no datos de ninguna empresa real — y para
          cualquier CSV nuevo que alguien le pase.
        </p>

        {/* En una mirada */}
        <div className="article-highlights article-highlights--top" style={{ marginTop: 32 }}>
          <span className="article-highlights-titulo">En una mirada</span>
          <div className="highlights-grid">
            <div className="highlight-item">
              <span className="highlight-valor">3</span>
              <span className="highlight-etiqueta">Datasets de ejemplo corridos con el mismo script, sin cambiar código</span>
              <span className="highlight-meta">devoluciones, defectos, ventas por SKU</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">30-33%</span>
              <span className="highlight-etiqueta">% de categorías que concentran ≥80% del total, en los tres ejemplos</span>
              <span className="highlight-meta">nunca exactamente 20% — el matiz central de la nota</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">{devoluciones.n_categorias_corte}/{devoluciones.n_categorias}</span>
              <span className="highlight-etiqueta">Causas que concentran {devoluciones.pct_valor_cubierto_en_corte}% de las devoluciones</span>
              <span className="highlight-meta">ejemplo 1 de 3, ver sección 05</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">80%</span>
              <span className="highlight-etiqueta">Umbral configurable del corte de "pocos vitales"</span>
              <span className="highlight-meta">parámetro del CLI, no un valor fijo en el código</span>
            </div>
          </div>
        </div>

        {/* Índice del expediente */}
        <div className="prose">
          <h2>Índice del expediente</h2>
          <ol className="pc-indice">
            <li><a href="#tesis">Tesis de negocio</a></li>
            <li><a href="#datos">Datos y contrato de información</a></li>
            <li><a href="#diseno">Diseño metodológico</a></li>
            <li><a href="#implementacion">Implementación reproducible</a></li>
            <li><a href="#resultados">Resultados: los tres ejemplos</a></li>
            <li><a href="#arquitectura">Arquitectura de solución</a></li>
            <li><a href="#gobierno">Gobierno y operación</a></li>
            <li><a href="#evaluacion">Límites y siguientes pasos</a></li>
          </ol>

          <h2 id="tesis">01 · Tesis de negocio</h2>
          <p>
            Cada vez que alguien necesita priorizar un conjunto de causas —por qué se devuelve un
            producto, por qué falla una pieza, qué productos realmente mueven las ventas—, la
            tentación es escribir un script específico para ese caso, usarlo una vez, y
            descartarlo. El resultado es que el mismo análisis se reescribe de cero cada vez que
            aparece un conjunto de causas nuevo, en vez de construir una sola vez una herramienta
            que sirva para cualquiera de ellos.
          </p>
          <p>
            <strong>Pregunta de negocio:</strong> ¿puede un único script, sin modificaciones,
            producir el análisis de Pareto correcto para cualquier dataset de causas que alguien
            le entregue — sin importar si mide devoluciones, defectos o ingresos?
          </p>
          <p>
            <strong>Cómo se mide el éxito:</strong> que el mismo comando, cambiando solo el
            archivo de entrada y el título, produzca resultados correctos y una gráfica legible
            para datasets de naturaleza completamente distinta — la prueba está en la sección 05,
            donde se corre tres veces sin tocar el código.
          </p>

          <h2 id="datos">02 · Datos y contrato de información</h2>
          <p>
            La herramienta no asume nada sobre qué mide "valor" — puede ser conteo de
            devoluciones, número de defectos, o ingresos en pesos. Lo único que exige es el
            contrato mínimo de dos columnas:
          </p>
          <table>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Tipo</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>categoria</code></td><td>Texto</td><td>Nombre de la causa o categoría — debe ser único por fila, no se agrupan duplicados automáticamente.</td></tr>
              <tr><td><code>valor</code></td><td>Numérico</td><td>La magnitud de esa categoría, en la unidad que se esté midiendo (conteo, costo, ingresos) — el álgebra del método es la misma sin importar la unidad.</td></tr>
            </tbody>
          </table>

          <h3>Los tres datasets de ejemplo — ilustrativos, declarados como tales</h3>
          <ul>
            <li><strong>Devoluciones en retail</strong> (10 categorías, 690 devoluciones): el mismo ejemplo de la nota que ancla este proyecto.</li>
            <li><strong>Defectos de manufactura</strong> (9 categorías, 456 defectos): el contexto clásico de control de calidad donde Joseph Juran aplicó por primera vez la idea de "pocos vitales".</li>
            <li><strong>Ventas por SKU</strong> (20 productos, $1,581,000 MXN de ingresos simulados): el caso clásico de inventario — qué productos realmente mueven la caja registradora.</li>
          </ul>
          <p>
            Ninguno de los tres es de una empresa real — son datasets sintéticos construidos para
            este proyecto, con el único propósito de demostrar que la herramienta generaliza.
          </p>

          <h2 id="diseno">03 · Diseño metodológico</h2>
          <p>
            El método central —ordenar de mayor a menor, calcular el % de cada categoría sobre el
            total, y acumular ese porcentaje en ese mismo orden— es el mismo descrito en la nota
            del blog. La diferencia de diseño de este proyecto está en dos decisiones deliberadas:
          </p>
          <ul>
            <li>
              <strong>Separar el cálculo de la graficación:</strong> la función <code>analizar()</code>{" "}
              no sabe nada de matplotlib ni de colores — recibe un DataFrame y un umbral, y
              devuelve números. Eso permite probar la lógica del método sin necesidad de generar
              una imagen, y reutilizarla en cualquier otro contexto (una API, un notebook, un job
              programado).
            </li>
            <li>
              <strong>El umbral de "pocos vitales" es un parámetro, no una constante:</strong>{" "}
              el 80% es el valor por defecto porque es la heurística más citada, pero el CLI
              acepta <code>--umbral</code> con cualquier valor — la nota del blog es explícita en
              que el 80/20 es una observación empírica, no una ley exacta, y la herramienta debe
              reflejar ese matiz en su diseño, no solo en el texto.
            </li>
          </ul>

          <h2 id="implementacion">04 · Implementación reproducible</h2>
          <p>
            El script completo, tal como está en el repositorio. Se ejecuta igual para cualquiera
            de los tres ejemplos, cambiando solo los tres argumentos de entrada:
          </p>
          <pre>
            <code>{`python3 analizador_pareto.py datasets/devoluciones_retail.csv \\
    salidas/devoluciones_retail "Causas de devolución — tienda retail" \\
    --umbral 80 --etiqueta-valor "devoluciones"

python3 analizador_pareto.py datasets/defectos_manufactura.csv \\
    salidas/defectos_manufactura "Causas de defecto — línea de manufactura" \\
    --umbral 80 --etiqueta-valor "defectos"

python3 analizador_pareto.py datasets/ventas_skus.csv \\
    salidas/ventas_skus "Ventas por SKU — tienda retail (ingresos MXN)" \\
    --umbral 80 --etiqueta-valor "ingresos MXN"`}</code>
          </pre>
          <pre>
            <code>{`#!/usr/bin/env python3
"""
Analizador de Pareto genérico y reutilizable.

Recibe CUALQUIER dataset de causas/categorías en CSV (dos columnas:
"categoria" y "valor" — frecuencia, costo, unidades, lo que se esté
midiendo) y produce, sin tocar código:

  1. La clasificación ordenada de mayor a menor.
  2. El porcentaje de cada categoría sobre el total.
  3. El porcentaje acumulado.
  4. El corte de "pocos vitales": cuántas categorías (y qué % del total
     de categorías) concentran al menos \`--umbral\` % del total (80% por
     defecto, pero configurable — el 80/20 es una heurística común, no
     una ley fija).
  5. El diagrama de Pareto (barras + línea acumulada) como PNG.
  6. Un JSON con todos los resultados, para consumir desde cualquier
     otro sistema (incluida esta misma página web).
"""
import argparse
import json
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd


def analizar(df: pd.DataFrame, umbral: float):
    """Core del método: ordenar, calcular %, acumular, encontrar el corte.
    No depende de qué represente \`valor\` — el álgebra es la misma sea
    cual sea la unidad."""
    df = df.sort_values("valor", ascending=False).reset_index(drop=True)
    total = df["valor"].sum()
    df["pct"] = df["valor"] / total * 100
    df["acumulado"] = df["pct"].cumsum()

    # Corte de "pocos vitales": primera categoría donde el acumulado
    # alcanza o supera el umbral.
    corte_idx = int(np.argmax(df["acumulado"].values >= umbral))
    n_corte = corte_idx + 1

    return df, {
        "total": float(total),
        "n_categorias": int(len(df)),
        "umbral_pct": float(umbral),
        "n_categorias_corte": n_corte,
        "pct_categorias_corte": round(n_corte / len(df) * 100, 1),
        "pct_valor_cubierto_en_corte": round(float(df["acumulado"].iloc[corte_idx]), 1),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada_csv")
    ap.add_argument("prefijo_salida")
    ap.add_argument("titulo")
    ap.add_argument("--umbral", type=float, default=80.0)
    ap.add_argument("--etiqueta-valor", default="valor")
    args = ap.parse_args()

    df_crudo = pd.read_csv(args.entrada_csv)
    assert set(["categoria", "valor"]).issubset(df_crudo.columns)

    df, resumen = analizar(df_crudo, args.umbral)
    os.makedirs(os.path.dirname(args.prefijo_salida) or ".", exist_ok=True)
    df.to_csv(f"{args.prefijo_salida}.csv", index=False)

    salida_json = {
        "titulo": args.titulo,
        "etiqueta_valor": args.etiqueta_valor,
        **resumen,
        "categorias": df["categoria"].tolist(),
        "valores": [float(v) for v in df["valor"].tolist()],
        "pct": [round(float(v), 2) for v in df["pct"].tolist()],
        "acumulado": [round(float(v), 2) for v in df["acumulado"].tolist()],
    }
    with open(f"{args.prefijo_salida}.json", "w") as f:
        json.dump(salida_json, f, indent=2, ensure_ascii=False)

    graficar(df, resumen, args.titulo, args.etiqueta_valor, f"{args.prefijo_salida}.png")
    print(json.dumps(salida_json, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()`}</code>
          </pre>
          <p>
            (La función <code>graficar()</code> completa —que genera el PNG con matplotlib, igual
            estilo que la gráfica de la nota del blog— está en el archivo completo del
            repositorio; se omite aquí por espacio, el enlace está en la sección "Código fuente
            completo" al final.)
          </p>

          <h2 id="resultados">05 · Resultados: los tres ejemplos</h2>
          <p>
            El mismo script, sin cambiar una sola línea de código, corrido tres veces sobre tres
            datasets de naturaleza distinta. Cada resultado es la salida real de esa corrida —el
            JSON y el PNG están disponibles para descarga al final de esta sección.
          </p>
        </div>

        {ejemplos.map(({ id, resultado, archivo }) => (
          <div key={id}>
            <div className="pc-chart-wrap">
              <span className="screener-grafica-eje">{resultado.titulo}</span>
              <ParetoAnalizadorChart resultado={resultado} />
            </div>
            <div className="prose">
              <p>
                <strong>{resultado.n_categorias_corte} de {resultado.n_categorias}</strong> categorías
                ({resultado.pct_categorias_corte}% del total de categorías) concentran{" "}
                <strong>{resultado.pct_valor_cubierto_en_corte}%</strong> de {resultado.etiqueta_valor}.
              </p>
            </div>
          </div>
        ))}

        <div className="prose">
          <p>
            Los tres ejemplos coinciden en algo que la nota del blog señala como el matiz más
            importante del principio: el corte de "pocos vitales" ronda el 30-33% de las
            categorías, no el 20% que sugiere el nombre popular de la regla. La proporción
            80/20 es una aproximación conveniente, no un resultado garantizado — y esta
            herramienta lo hace visible en cada corrida, en vez de asumirlo.
          </p>

          <h3>Evidencia descargable</h3>
          <p>
            Los datasets de entrada y los archivos de salida reales (CSV, JSON y PNG) de los tres
            ejemplos:
          </p>
          <ul className="pc-descargas">
            <li><a href={`${DESCARGAS}/datasets/devoluciones_retail.csv`}>devoluciones_retail.csv</a> — dataset de entrada</li>
            <li><a href={`${DESCARGAS}/datasets/defectos_manufactura.csv`}>defectos_manufactura.csv</a> — dataset de entrada</li>
            <li><a href={`${DESCARGAS}/datasets/ventas_skus.csv`}>ventas_skus.csv</a> — dataset de entrada</li>
            <li><a href={`${DESCARGAS}/resultados/devoluciones_retail.json`}>devoluciones_retail.json</a> — resultado real del análisis</li>
            <li><a href={`${DESCARGAS}/resultados/defectos_manufactura.json`}>defectos_manufactura.json</a> — resultado real del análisis</li>
            <li><a href={`${DESCARGAS}/resultados/ventas_skus.json`}>ventas_skus.json</a> — resultado real del análisis</li>
          </ul>

          <h2 id="arquitectura">06 · Arquitectura de solución</h2>
          <p>
            Así se integraría esta herramienta en un flujo real de operación continua, en vez de
            correrse una sola vez a mano:
          </p>
        </div>

        <div className="pc-chart-wrap">
          <ParetoAnalizadorArquitectura />
        </div>

        <div className="prose">
          <p>
            Una fuente de datos existente (el ERP, el sistema de tickets de calidad, el punto de
            venta) exporta periódicamente un CSV con el contrato mínimo de dos columnas. El
            analizador corre sobre ese archivo —sin intervención manual— y publica la gráfica y el
            JSON de resultados, que el dueño del proceso revisa para decidir dónde enfocar el
            esfuerzo. La decisión que se tome (corregir una causa, descontinuar un SKU) cambia el
            proceso de origen, lo que altera la siguiente exportación — el análisis se vuelve a
            correr periódicamente, nunca una sola vez.
          </p>

          <h2 id="gobierno">07 · Gobierno y operación</h2>
          <p>
            Para que esta herramienta fuera mantenible como parte de un proceso real, no solo
            como un script de demostración, necesitaría:
          </p>
          <ul>
            <li><strong>Versionado del umbral:</strong> si alguien cambia <code>--umbral</code> de 80% a 90%, esa decisión debe quedar registrada junto con el resultado — un corte distinto no es un error, pero debe ser explícito y trazable.</li>
            <li><strong>Validación del contrato de datos:</strong> el <code>assert</code> actual confirma que existan las columnas correctas; en producción necesitaría además validar tipos, valores negativos y categorías duplicadas antes de analizar.</li>
            <li><strong>Separación de quien corre el análisis y quien decide:</strong> la herramienta solo prioriza — la decisión de qué hacer con esa priorización (y el riesgo de ignorar la cola larga) le corresponde al dueño del proceso, no al script.</li>
            <li><strong>Historial de corridas:</strong> guardar cada JSON de salida con fecha, para poder comparar cómo cambia el corte de "pocos vitales" en el tiempo, no solo ver la foto de una corrida aislada.</li>
          </ul>

          <h2 id="evaluacion">08 · Límites y siguientes pasos</h2>
          <p>
            La herramienta asume que las categorías son mutuamente excluyentes y que cada
            observación pertenece a una sola — si la clasificación de origen es ambigua (una
            devolución con dos causas válidas), el análisis hereda ese problema sin poder
            corregirlo. Tampoco distingue entre categorías de magnitud similar: si las primeras
            cuatro categorías tienen un peso casi idéntico, el "corte" que marca la herramienta es
            técnicamente correcto pero menos útil como guía de priorización — ahí el criterio
            humano importa más que el número exacto del corte. Extensiones razonables, no
            implementadas aquí: comparar el mismo análisis entre dos periodos para detectar si las
            causas dominantes están cambiando, y una versión que reciba el CSV por una interfaz
            web en vez de la línea de comandos.
          </p>

          <h2>Código fuente completo</h2>
          <p>
            El script completo (incluida la función <code>graficar()</code>), los tres datasets y
            los archivos de resultados que alimentan esta página están en el repositorio del
            sitio:
          </p>
          <p>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn">
              Ver código en GitHub →
            </a>
          </p>
        </div>

        <div className="lib-cta-final">
          <p>¿Quieres ver los demás proyectos o leer la nota que ancla éste?</p>
          <div className="lib-cta-botones">
            <Link href="/proyectos" className="btn ghost">
              ← Volver a Proyectos
            </Link>
            <Link href="/blog/principio-pareto-regla-80-20-retail" className="btn ghost">
              Leer la nota del principio de Pareto →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
