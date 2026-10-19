"""
Estima la elasticidad-precio de la demanda con una regresión log-log de
efectos fijos por tienda:

    ln(Q_it) = alpha_i + beta * ln(P_it) + gamma1*sin(2*pi*s/52)
               + gamma2*cos(2*pi*s/52) + delta*Promo_it + e_it

beta es la elasticidad-precio estimada. Los efectos fijos de tienda
(alpha_i) se implementan "demeaning" cada variable por tienda (equivalente
a dummies de tienda, pero sin inflar la matriz de diseño) — esto es el
estimador "within" estándar de panel data.
"""
import json
import numpy as np
import pandas as pd
import statsmodels.api as sm

df = pd.read_csv("proyectos-propios/pricing-cientifico/datos_panel.csv")

df["ln_q"] = np.log(df["cantidad"])
df["ln_p"] = np.log(df["precio"])
df["sin_s"] = np.sin(2 * np.pi * df["semana"] / 52)
df["cos_s"] = np.cos(2 * np.pi * df["semana"] / 52)

# Estimador "within": resta el promedio por tienda a cada variable, así el
# efecto fijo de tienda (alpha_i) desaparece de la ecuación sin necesidad
# de 40 variables dummy.
vars_modelo = ["ln_q", "ln_p", "sin_s", "cos_s", "promo"]
df_demeaned = df.copy()
for v in vars_modelo:
    df_demeaned[v] = df[v] - df.groupby("tienda")[v].transform("mean")

X = sm.add_constant(df_demeaned[["ln_p", "sin_s", "cos_s", "promo"]])
y = df_demeaned["ln_q"]

# Errores estándar agrupados (clustered) por tienda: las observaciones de
# una misma tienda a lo largo de 52 semanas no son independientes entre sí,
# así que los errores estándar "normales" subestimarían la incertidumbre.
modelo = sm.OLS(y, X).fit(cov_type="cluster", cov_kwds={"groups": df_demeaned["tienda"]})

beta = modelo.params["ln_p"]
ic_95 = modelo.conf_int(alpha=0.05).loc["ln_p"].tolist()
p_value = modelo.pvalues["ln_p"]
r2 = modelo.rsquared

with open("proyectos-propios/pricing-cientifico/datos_meta.json") as f:
    meta = json.load(f)

resultado = {
    "elasticidad_estimada": round(float(beta), 3),
    "ic_95_inferior": round(float(ic_95[0]), 3),
    "ic_95_superior": round(float(ic_95[1]), 3),
    "p_value": float(p_value),
    "r2": round(float(r2), 3),
    "n_observaciones": int(modelo.nobs),
    "elasticidad_verdadera": meta["elasticidad_verdadera"],
    "error_vs_verdadera_pct": round(
        abs(beta - meta["elasticidad_verdadera"]) / abs(meta["elasticidad_verdadera"]) * 100, 2
    ),
}

with open("proyectos-propios/pricing-cientifico/resultado_modelo.json", "w") as f:
    json.dump(resultado, f, indent=2, ensure_ascii=False)

print(modelo.summary())
print()
print(json.dumps(resultado, indent=2, ensure_ascii=False))
