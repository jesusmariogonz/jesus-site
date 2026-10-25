"""
Análisis estadístico del Experimento 2, idéntico en método al del
Experimento 1: Wilson CI para proporciones, McNemar exacto (pareado)
para la comparación de tasas de resurrección A vs. B.
"""
import json
from pathlib import Path
from math import sqrt
from scipy.stats import binomtest

ENTRADA = Path(__file__).parent / "resultados_crudos.jsonl"
SALIDA = Path(__file__).parent / "resumen_estadistico.json"


def wilson_ci(exitos, n, conf=0.95):
    if n == 0:
        return (0.0, 0.0)
    z = 1.959963984540054 if conf == 0.95 else None
    p = exitos / n
    denom = 1 + z**2 / n
    centro = p + z**2 / (2 * n)
    margen = z * sqrt(p * (1 - p) / n + z**2 / (4 * n**2))
    return ((centro - margen) / denom, (centro + margen) / denom)


def mcnemar_exacto(b, c):
    n = b + c
    if n == 0:
        return 1.0
    return binomtest(min(b, c), n, 0.5, alternative="two-sided").pvalue


def cargar():
    with open(ENTRADA) as f:
        return [json.loads(l) for l in f]


def main():
    filas = cargar()
    tipo_b = [r for r in filas if r["tipo"] == "b"]
    tipo_a = [r for r in filas if r["tipo"] == "a"]

    n = len(tipo_b)
    resurreccion_a = sum(1 for r in tipo_b if r["juicio_a"]["resurreccion"])
    resurreccion_b = sum(1 for r in tipo_b if r["juicio_b"]["resurreccion"])
    ci_a = wilson_ci(resurreccion_a, n)
    ci_b = wilson_ci(resurreccion_b, n)

    # pares discordantes para McNemar: b = A sí / B no, c = A no / B sí
    disc_b = sum(1 for r in tipo_b if r["juicio_a"]["resurreccion"] and not r["juicio_b"]["resurreccion"])
    disc_c = sum(1 for r in tipo_b if not r["juicio_a"]["resurreccion"] and r["juicio_b"]["resurreccion"])
    p_valor = mcnemar_exacto(disc_b, disc_c)

    correctas_calidad = sum(1 for r in tipo_a if r["juicio_b"]["calidad"] == "correcta")

    resumen = {
        "n_trials_tipo_b": n,
        "resurreccion_condicion_a": {
            "tasa": resurreccion_a / n if n else 0,
            "ic95": ci_a,
            "n_exitos": resurreccion_a,
        },
        "resurreccion_condicion_b": {
            "tasa": resurreccion_b / n if n else 0,
            "ic95": ci_b,
            "n_exitos": resurreccion_b,
        },
        "mcnemar_exacto": {"discordantes_b": disc_b, "discordantes_c": disc_c, "p_valor": p_valor},
        "calidad_hecho_seguro_condicion_b": {
            "n": len(tipo_a),
            "correctas": correctas_calidad,
            "sobre": len(tipo_a),
        },
    }

    print(json.dumps(resumen, ensure_ascii=False, indent=2))
    with open(SALIDA, "w") as f:
        json.dump(resumen, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
