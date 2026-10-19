"""
Genera un panel sintético de ventas semanales por tienda para un SKU
único (ej. "refresco de cola 600 ml"), con una elasticidad-precio de la
demanda VERDADERA conocida de antemano (ELASTICIDAD_VERDADERA). Esto es
lo que permite validar el método: el modelo de la Semana 2 (log-log)
debe recuperar un valor cercano a esta elasticidad real para considerarse
correcto.

Esto es un dataset SIMULADO para fines demostrativos — no son datos de
ningún cliente ni empresa real. La variación de precio se genera de forma
exógena (independiente del error de demanda no observado) a propósito,
para que la regresión log-log sea un estimador consistente de la
elasticidad bajo los supuestos declarados en la metodología. En datos
reales de retail el precio casi nunca es exógeno (la cadena sube precio
quincenas de baja demanda, lo baja en promociones ya anticipadas) — ese
problema de endogeneidad se discute explícitamente en la metodología del
proyecto, junto con las dos soluciones estándar (variables instrumentales
o experimentos controlados A/B de precio).
"""
import json
import numpy as np
import pandas as pd

np.random.seed(42)

N_TIENDAS = 40
N_SEMANAS = 52
PRECIO_BASE = 18.50  # MXN, precio de lista del SKU
COSTO_MARGINAL = 11.20  # MXN, costo variable unitario (producción + distribución)
ELASTICIDAD_VERDADERA = -1.8  # elasticidad-precio real usada para generar los datos

semanas = np.arange(1, N_SEMANAS + 1)
tiendas = np.arange(1, N_TIENDAS + 1)

filas = []
for tienda in tiendas:
    # Efecto fijo de tienda: algunas venden sistemáticamente más (ubicación,
    # tráfico peatonal, tamaño) — en log, para que entre linealmente al modelo.
    efecto_tienda = np.random.normal(0, 0.25)
    demanda_base_tienda = 850 * np.exp(efecto_tienda)

    for semana in semanas:
        # Estacionalidad: más demanda en semanas "de calor" (mitad del año),
        # modelada con una onda senoidal simple sobre las 52 semanas.
        estacionalidad = 0.18 * np.sin(2 * np.pi * (semana - 13) / 52)

        # Variación de precio EXÓGENA: la cadena corre descuentos puntuales
        # (promo) en semanas pseudo-aleatorias, independientes del shock de
        # demanda de esa semana — esta independencia es el supuesto de
        # identificación de la Semana 2.
        promo = 1 if np.random.random() < 0.18 else 0
        descuento_promo = np.random.uniform(0.08, 0.20) if promo else 0.0
        ruido_precio = np.random.normal(0, 0.02)
        precio = PRECIO_BASE * (1 - descuento_promo) * (1 + ruido_precio)
        precio = max(precio, COSTO_MARGINAL * 1.02)  # nunca vender bajo costo

        # Demanda log-log: ln(Q) = ln(base) + estacionalidad + ELASTICIDAD*ln(P/PRECIO_BASE) + ruido
        ruido_demanda = np.random.normal(0, 0.12)
        log_cantidad = (
            np.log(demanda_base_tienda)
            + estacionalidad
            + ELASTICIDAD_VERDADERA * np.log(precio / PRECIO_BASE)
            + ruido_demanda
        )
        cantidad = max(1, round(np.exp(log_cantidad)))

        filas.append(
            {
                "tienda": int(tienda),
                "semana": int(semana),
                "precio": round(float(precio), 2),
                "promo": promo,
                "cantidad": int(cantidad),
            }
        )

df = pd.DataFrame(filas)
df.to_csv("proyectos-propios/pricing-cientifico/datos_panel.csv", index=False)

meta = {
    "n_tiendas": N_TIENDAS,
    "n_semanas": N_SEMANAS,
    "n_observaciones": len(df),
    "precio_base_mxn": PRECIO_BASE,
    "costo_marginal_mxn": COSTO_MARGINAL,
    "elasticidad_verdadera": ELASTICIDAD_VERDADERA,
    "precio_promedio_observado": round(float(df["precio"].mean()), 2),
    "precio_min_observado": round(float(df["precio"].min()), 2),
    "precio_max_observado": round(float(df["precio"].max()), 2),
    "cantidad_promedio_semanal": round(float(df["cantidad"].mean()), 1),
    "pct_semanas_con_promo": round(float(df["promo"].mean()) * 100, 1),
}
with open("proyectos-propios/pricing-cientifico/datos_meta.json", "w") as f:
    json.dump(meta, f, indent=2, ensure_ascii=False)

print(json.dumps(meta, indent=2, ensure_ascii=False))
