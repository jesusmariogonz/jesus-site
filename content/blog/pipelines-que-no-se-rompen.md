---
titulo: "Tres hábitos para pipelines que no se rompen en producción"
fecha: "2026-06-20"
categoria: "ingenieria-de-datos"
resumen: "Lecciones de depurar pipelines en PySpark: diagnostica antes de corregir, valida a la granularidad correcta y desconfía de los joins."
---

Después de meses depurando pipelines en PySpark, estos son los tres hábitos que más errores me han evitado.

## 1. Diagnostica antes de corregir

Antes de tocar el código, escribe una query que **demuestre** el problema. Si no puedes reproducirlo con datos, no entiendes el bug todavía.

## 2. Valida a la granularidad correcta

Muchos bugs de agregación vienen de operar a un nivel más grueso del real. Si tu dato vive a nivel `folio + producto`, validar solo por `producto` esconde duplicados.

## 3. Desconfía de todo join

Todo join es un *fan-out* en potencia. Cuenta filas antes y después:

```python
antes = df.count()
df = df.join(catalogo, on="upc", how="left")
despues = df.count()
assert antes == despues, f"Fan-out: {antes} -> {despues}"
```

Tres líneas que te ahorran una semana de reconciliaciones.
