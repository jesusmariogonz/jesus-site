"""
Con la elasticidad estimada (Semana 2) y el costo marginal conocido,
calcula el precio que maximiza la utilidad semanal esperada, por dos
caminos independientes que deben coincidir si el álgebra es correcta:

1. Fórmula cerrada (Índice de Lerner): para un monopolista/tomador de
   precio con poder de mercado local, el markup óptimo sobre costo
   cumple (P* - c) / P* = -1/elasticidad, es decir:

       P* = c / (1 + 1/elasticidad)

2. Barrido numérico (grid search): calcula la utilidad esperada en una
   grilla fina de precios, usando la curva de demanda estimada
   Q(P) = Q_base * (P/P_base)^elasticidad, y toma el máximo.

Si ambos métodos coinciden (dentro de la resolución de la grilla), eso
valida que la fórmula cerrada se aplicó correctamente.
"""
import json
import numpy as np
import pandas as pd

with open("proyectos-propios/pricing-cientifico/datos_meta.json") as f:
    meta = json.load(f)
with open("proyectos-propios/pricing-cientifico/resultado_modelo.json") as f:
    resultado = json.load(f)

costo = meta["costo_marginal_mxn"]
precio_base = meta["precio_base_mxn"]
cantidad_base = meta["cantidad_promedio_semanal"]
elasticidad = resultado["elasticidad_estimada"]

# 1. Fórmula cerrada (Índice de Lerner) — solo válida si |elasticidad| > 1
#    (demanda elástica); si no, no existe un precio óptimo interior.
precio_optimo_formula = costo / (1 + 1 / elasticidad)

# 2. Barrido numérico sobre la curva de demanda estimada
grid_precios = np.linspace(costo * 1.02, precio_base * 1.6, 4000)
cantidad_estimada = cantidad_base * (grid_precios / precio_base) ** elasticidad
utilidad = (grid_precios - costo) * cantidad_estimada

idx_optimo = np.argmax(utilidad)
precio_optimo_grid = float(grid_precios[idx_optimo])
utilidad_en_optimo = float(utilidad[idx_optimo])

# Utilidad al precio de lista actual, para cuantificar la oportunidad
cantidad_en_base = cantidad_base  # por definición, Q(precio_base) = cantidad_base
utilidad_en_base = (precio_base - costo) * cantidad_en_base

curva = pd.DataFrame(
    {
        "precio": grid_precios,
        "cantidad_esperada": cantidad_estimada,
        "utilidad_esperada": utilidad,
    }
)
# Reduce a ~80 puntos para graficar en el sitio sin mandar 4000 filas.
curva_reducida = curva.iloc[:: max(1, len(curva) // 80)].copy()
curva_reducida.to_csv("proyectos-propios/pricing-cientifico/curva_utilidad.csv", index=False)

salida = {
    "costo_marginal_mxn": costo,
    "precio_lista_actual_mxn": precio_base,
    "cantidad_base_semanal": cantidad_base,
    "elasticidad_usada": elasticidad,
    "precio_optimo_formula_lerner_mxn": round(float(precio_optimo_formula), 2),
    "precio_optimo_grid_search_mxn": round(precio_optimo_grid, 2),
    "diferencia_metodos_mxn": round(abs(precio_optimo_formula - precio_optimo_grid), 3),
    "utilidad_semanal_en_precio_actual_mxn": round(float(utilidad_en_base), 0),
    "utilidad_semanal_en_precio_optimo_mxn": round(utilidad_en_optimo, 0),
    "mejora_utilidad_semanal_pct": round(
        (utilidad_en_optimo / utilidad_en_base - 1) * 100, 2
    ),
    "cambio_precio_vs_lista_pct": round(
        (precio_optimo_grid / precio_base - 1) * 100, 2
    ),
}

with open("proyectos-propios/pricing-cientifico/resultado_optimizacion.json", "w") as f:
    json.dump(salida, f, indent=2, ensure_ascii=False)

print(json.dumps(salida, indent=2, ensure_ascii=False))
