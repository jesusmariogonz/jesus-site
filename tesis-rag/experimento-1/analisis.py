"""
Análisis estadístico del Experimento 1 sobre resultados_crudos.jsonl:
  - Tasa de fuga (tipo b) en condición A vs B, con IC 95% Wilson.
  - Prueba de McNemar (diseño pareado) para H1.
  - Tasa de calidad/correctitud (tipo a) en condición A vs B.
"""
import json
from pathlib import Path
from scipy.stats import norm
import math

PATH = Path(__file__).parent / "resultados_crudos.jsonl"


def wilson_ci(exitos, n, conf=0.95):
    if n == 0:
        return (0.0, 0.0)
    z = norm.ppf(1 - (1 - conf) / 2)
    p = exitos / n
    denom = 1 + z**2 / n
    centro = p + z**2 / (2 * n)
    margen = z * math.sqrt((p * (1 - p) + z**2 / (4 * n)) / n)
    return ((centro - margen) / denom, (centro + margen) / denom)


def mcnemar_exacto(b, c):
    """b = casos A=1,B=0 ; c = casos A=0,B=1. Usa el test exacto binomial (McNemar exacto)."""
    from scipy.stats import binomtest
    n = b + c
    if n == 0:
        return 1.0
    return binomtest(min(b, c), n, 0.5, alternative="two-sided").pvalue


def cargar():
    registros = [json.loads(l) for l in open(PATH, encoding="utf-8")]
    return registros


def main():
    registros = cargar()
    tipo_b = [r for r in registros if r["tipo"] == "b"]
    tipo_a = [r for r in registros if r["tipo"] == "a"]

    n_b = len(tipo_b)
    fuga_a = sum(1 for r in tipo_b if r["fuga_a"])
    fuga_b = sum(1 for r in tipo_b if r["fuga_b"])

    # Tabla de contingencia pareada para McNemar
    ambos = sum(1 for r in tipo_b if r["fuga_a"] and r["fuga_b"])
    solo_a = sum(1 for r in tipo_b if r["fuga_a"] and not r["fuga_b"])
    solo_b = sum(1 for r in tipo_b if (not r["fuga_a"]) and r["fuga_b"])
    ninguno = sum(1 for r in tipo_b if (not r["fuga_a"]) and (not r["fuga_b"]))

    p_mcnemar = mcnemar_exacto(solo_a, solo_b)

    ci_a = wilson_ci(fuga_a, n_b)
    ci_b = wilson_ci(fuga_b, n_b)

    print("=== H1: Fuga de confidencialidad (preguntas tipo b, n=%d) ===" % n_b)
    print(f"Condición A (baseline):   fuga = {fuga_a}/{n_b} = {fuga_a/n_b:.3f}  IC95% Wilson [{ci_a[0]:.3f}, {ci_a[1]:.3f}]")
    print(f"Condición B (mitigación): fuga = {fuga_b}/{n_b} = {fuga_b/n_b:.3f}  IC95% Wilson [{ci_b[0]:.3f}, {ci_b[1]:.3f}]")
    print(f"Diferencia de proporciones (A-B): {(fuga_a-fuga_b)/n_b:.3f}")
    print(f"Tabla pareada: ambos_fuga={ambos}, solo_A_fuga={solo_a}, solo_B_fuga={solo_b}, ninguno={ninguno}")
    print(f"McNemar exacto p-value: {p_mcnemar:.5f}")
    print()

    # Calidad en preguntas tipo (a)
    n_a = len(tipo_a)
    cal_a_correcta = sum(1 for r in tipo_a if r["calidad_a"] == "correcta")
    cal_b_correcta = sum(1 for r in tipo_a if r["calidad_b"] == "correcta")
    cal_b_incorrecta_o_rechazada = sum(1 for r in tipo_a if r["calidad_b"] == "incorrecta_o_rechazada")
    ci_cal_a = wilson_ci(cal_a_correcta, n_a)
    ci_cal_b = wilson_ci(cal_b_correcta, n_a)

    print("=== Costo en calidad (preguntas tipo a, acceso legítimo, n=%d) ===" % n_a)
    print(f"Condición A: correctas = {cal_a_correcta}/{n_a} = {cal_a_correcta/n_a:.3f}  IC95% [{ci_cal_a[0]:.3f}, {ci_cal_a[1]:.3f}]")
    print(f"Condición B: correctas = {cal_b_correcta}/{n_a} = {cal_b_correcta/n_a:.3f}  IC95% [{ci_cal_b[0]:.3f}, {ci_cal_b[1]:.3f}]")
    print(f"Condición B: incorrecta/rechazada = {cal_b_incorrecta_o_rechazada}/{n_a} = {cal_b_incorrecta_o_rechazada/n_a:.3f} (falsos negativos del filtro)")

    resumen = {
        "n_tipo_b": n_b, "fuga_a": fuga_a, "fuga_b": fuga_b,
        "tasa_fuga_a": fuga_a / n_b, "tasa_fuga_b": fuga_b / n_b,
        "ci95_fuga_a": ci_a, "ci95_fuga_b": ci_b,
        "tabla_pareada": {"ambos_fuga": ambos, "solo_a_fuga": solo_a, "solo_b_fuga": solo_b, "ninguno": ninguno},
        "mcnemar_p_value": p_mcnemar,
        "n_tipo_a": n_a, "calidad_a_correcta": cal_a_correcta, "calidad_b_correcta": cal_b_correcta,
        "calidad_b_incorrecta_o_rechazada": cal_b_incorrecta_o_rechazada,
        "ci95_calidad_a": ci_cal_a, "ci95_calidad_b": ci_cal_b,
    }
    with open(Path(__file__).parent / "resumen_estadistico.json", "w", encoding="utf-8") as f:
        json.dump(resumen, f, ensure_ascii=False, indent=2)
    print("\nGuardado resumen_estadistico.json")


if __name__ == "__main__":
    main()
