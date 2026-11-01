"""
Verificación determinista (sin LLM) de los 4 trials tipo "a" del
Experimento 2: comprueba si la respuesta de la Condición B contiene el
dato literal del párrafo seguro del documento derivado (que la cascada
no debía tocar). Complementa — no reemplaza — el juicio del juez LLM
reportado en resumen_estadistico.json. Solo lee resultados_crudos.jsonl.
"""
import json
from pathlib import Path

AQUI = Path(__file__).parent
CORPUS = AQUI.parent / "corpus"
# hecho_id -> (archivo derivado, dato literal que debe estar en el derivado y en la respuesta)
ESPERADO = {
    "reestructura": ("derivado-01-minuta-comite-directivo-q4.md", "3 años"),
    "retencion_talento": ("derivado-02-reporte-rh-consejo.md", "92"),
    "investigacion_conducta": ("derivado-03-reporte-comite-etica.md", "97%"),
    "presupuesto_migracion_ia": ("derivado-04-resumen-finanzas-q3.md", "2%"),
}


def main():
    filas = [json.loads(l) for l in open(AQUI / "resultados_crudos.jsonl") if l.strip()]
    salida, ok = [], 0
    for r in filas:
        if r["tipo"] != "a":
            continue
        archivo, dato = ESPERADO[r["hecho_id"]]
        en_derivado = dato in (CORPUS / archivo).read_text()
        en_respuesta = dato in r["resp_b"]
        ok += en_respuesta and en_derivado
        salida.append({
            "hecho_id": r["hecho_id"], "dato_esperado": dato,
            "dato_en_derivado": en_derivado, "dato_en_respuesta_b": en_respuesta,
            "calidad_juez": r["juicio_b"]["calidad"],
        })
    print(json.dumps({"n": len(salida), "con_dato_correcto": ok, "detalle": salida}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
