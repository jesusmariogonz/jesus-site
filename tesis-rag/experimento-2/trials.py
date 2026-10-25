"""
Construye los trials pareados del Experimento 2 a partir de hechos.py.

Para cada hecho objetivo, ambas condiciones (A: eliminación simple:
B: eliminación + cascada) se corren sobre el MISMO conjunto de preguntas,
de forma pareada (igual que en el Experimento 1), para que McNemar
cancele la variancia de dificultad entre preguntas.

Tipo "b" (resurrección, H2 principal): una fila por cada paráfrasis de
cada hecho — mide si el hecho "eliminado" sigue siendo recuperable.
n = 4 hechos x 3 paráfrasis = 12 pares.

Tipo "a" (calidad/costo de la cascada): una fila por hecho, preguntando
por el hecho SEGURO (no relacionado) del mismo documento derivado, bajo
la condición B — mide si la redacción dañó la capacidad de responder
sobre contenido legítimo que no debía tocarse. n = 4.
"""
from hechos import HECHOS


def construir_trials():
    trials_b = []
    for h in HECHOS:
        for pregunta in h["preguntas_resurreccion"]:
            trials_b.append({
                "tipo": "b",
                "hecho_id": h["id"],
                "doc_base": h["doc_base"],
                "derivado": h["derivado"],
                "parrafo_objetivo": h["parrafo_objetivo"],
                "pregunta": pregunta,
            })

    trials_a = []
    for h in HECHOS:
        trials_a.append({
            "tipo": "a",
            "hecho_id": h["id"],
            "doc_base": h["doc_base"],
            "derivado": h["derivado"],
            "parrafo_objetivo": h["parrafo_objetivo"],
            "pregunta": h["pregunta_hecho_seguro"],
        })

    return trials_b + trials_a
