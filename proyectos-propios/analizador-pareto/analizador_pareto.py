#!/usr/bin/env python3
"""
Analizador de Pareto genérico y reutilizable.

Recibe CUALQUIER dataset de causas/categorías en CSV (dos columnas:
"categoria" y "valor" — frecuencia, costo, unidades, lo que se esté
midiendo) y produce, sin tocar código:

  1. La clasificación ordenada de mayor a menor.
  2. El porcentaje de cada categoría sobre el total.
  3. El porcentaje acumulado.
  4. El corte de "pocos vitales": cuántas categorías (y qué % del total
     de categorías) concentran al menos `--umbral` % del total (80% por
     defecto, pero configurable — el 80/20 es una heurística común, no
     una ley fija, ver la nota del blog que ancla este proyecto).
  5. El diagrama de Pareto (barras + línea acumulada) como PNG.
  6. Un JSON con todos los resultados, para consumir desde cualquier
     otro sistema (incluida la página web de este proyecto).

Uso:
  python3 analizador_pareto.py <entrada.csv> <prefijo_salida> "<Título del análisis>" [--umbral 80] [--etiqueta-valor "unidades"]

Ejemplo:
  python3 analizador_pareto.py datasets/devoluciones_retail.csv \
      salidas/devoluciones_retail "Causas de devolución — tienda retail" \
      --umbral 80 --etiqueta-valor "devoluciones"

Esto es una herramienta genérica: los tres datasets de ejemplo que
acompañan este proyecto (devoluciones, defectos de manufactura, ventas
por SKU) son ilustrativos y están declarados como tales — no son datos
de ninguna empresa real. La herramienta en sí misma es la que es
reproducible con cualquier CSV real que alguien le pase.
"""
import argparse
import json
import os

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

AZUL = "#1c48c9"
NARANJA = "#eb6834"
GRIS = "#5b6472"
FONDO = "#ffffff"


def analizar(df: pd.DataFrame, umbral: float):
    """Core del método: ordenar, calcular %, acumular, encontrar el corte.
    No depende de qué represente `valor` (frecuencia, costo, unidades) —
    el álgebra es la misma sea cual sea la unidad."""
    df = df.sort_values("valor", ascending=False).reset_index(drop=True)
    total = df["valor"].sum()
    df["pct"] = df["valor"] / total * 100
    df["acumulado"] = df["pct"].cumsum()

    # Corte de "pocos vitales": primera categoría donde el acumulado
    # alcanza o supera el umbral. searchsorted es O(log n) pero con <100
    # categorías típicas, un argmax directo es igual de rápido y más claro.
    corte_idx = int(np.argmax(df["acumulado"].values >= umbral))
    n_corte = corte_idx + 1  # +1 porque el índice es 0-based

    return df, {
        "total": float(total),
        "n_categorias": int(len(df)),
        "umbral_pct": float(umbral),
        "n_categorias_corte": n_corte,
        "pct_categorias_corte": round(n_corte / len(df) * 100, 1),
        "pct_valor_cubierto_en_corte": round(float(df["acumulado"].iloc[corte_idx]), 1),
    }


def graficar(df: pd.DataFrame, resumen: dict, titulo: str, etiqueta_valor: str, salida_png: str):
    fig, ax1 = plt.subplots(figsize=(10.5, 5.6), dpi=170)
    fig.patch.set_facecolor(FONDO)
    ax1.set_facecolor(FONDO)

    x = np.arange(len(df))
    barras = ax1.bar(x, df["valor"], color=AZUL, width=0.62, zorder=3)
    ax1.set_ylabel(etiqueta_valor.capitalize(), fontsize=11, color="#1a1f2b")
    ax1.set_ylim(0, df["valor"].max() * 1.32)
    ax1.set_xticks(x)
    ax1.set_xticklabels(df["categoria"], fontsize=8.8, color="#1a1f2b", rotation=22, ha="right")
    ax1.tick_params(axis="y", labelsize=9, colors="#1a1f2b")
    for spine in ["top", "right"]:
        ax1.spines[spine].set_visible(False)
    ax1.spines["left"].set_color("#c7cdd6")
    ax1.spines["bottom"].set_color("#c7cdd6")
    ax1.grid(axis="y", color="#e7eaef", zorder=0)

    for rect, val, pct in zip(barras, df["valor"], df["pct"]):
        ax1.text(rect.get_x() + rect.get_width() / 2, rect.get_height() + df["valor"].max() * 0.02,
                  f"{pct:.0f}%", ha="center", fontsize=8.5, color="#1a1f2b", fontweight="bold")

    ax2 = ax1.twinx()
    ax2.plot(x, df["acumulado"], color=NARANJA, marker="o", markersize=5, linewidth=2.2, zorder=4)
    ax2.set_ylabel("% acumulado", fontsize=11, color=NARANJA)
    ax2.set_ylim(0, 108)
    ax2.tick_params(axis="y", labelsize=9, colors=NARANJA)
    for spine in ["top", "left"]:
        ax2.spines[spine].set_visible(False)
    ax2.spines["right"].set_color(NARANJA)

    ax2.axhline(resumen["umbral_pct"], color=GRIS, linestyle="--", linewidth=1.1, zorder=2)
    ax2.text(len(df) - 0.4, resumen["umbral_pct"] + 2.5, f"{resumen['umbral_pct']:.0f}%",
              fontsize=9, color=GRIS, ha="right")
    n = resumen["n_categorias_corte"]
    ax1.axvspan(-0.5, n - 0.5, color=AZUL, alpha=0.07, zorder=0)
    ax1.text((n - 1) / 2, df["valor"].max() * 1.24,
              f"Pocos vitales ({n} de {resumen['n_categorias']} = {resumen['pct_valor_cubierto_en_corte']:.0f}%)",
              ha="center", fontsize=9.5, color=AZUL, fontweight="bold")

    fig.suptitle(f"Diagrama de Pareto — {titulo}", fontsize=13, color="#0d1420", fontweight="bold", y=0.99)
    fig.tight_layout(rect=[0, 0, 1, 0.95])
    fig.savefig(salida_png, facecolor=FONDO)
    plt.close(fig)


def main():
    ap = argparse.ArgumentParser(description="Analizador de Pareto genérico: CSV (categoria,valor) -> clasificación, % acumulado, corte de pocos vitales, gráfica y JSON.")
    ap.add_argument("entrada_csv")
    ap.add_argument("prefijo_salida", help="Prefijo de ruta para los archivos de salida (sin extensión)")
    ap.add_argument("titulo", help="Título del análisis, para la gráfica y el JSON")
    ap.add_argument("--umbral", type=float, default=80.0, help="Umbral de % acumulado para el corte de 'pocos vitales' (default 80)")
    ap.add_argument("--etiqueta-valor", default="valor", help="Nombre de la unidad que mide 'valor' (ej. 'devoluciones', 'defectos', 'ingresos MXN')")
    args = ap.parse_args()

    df_crudo = pd.read_csv(args.entrada_csv)
    assert set(["categoria", "valor"]).issubset(df_crudo.columns), "El CSV debe tener columnas 'categoria' y 'valor'"

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
    main()
