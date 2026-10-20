import Link from "next/link";
import { getPricingCientifico } from "@/lib/pricingCientifico";
import { GraficaDemanda, GraficaUtilidad } from "@/components/PricingCientificoCharts";
import PricingCientificoArquitectura from "@/components/PricingCientificoArquitectura";
import { absUrl } from "@/lib/site";

const REPO_URL = "https://github.com/jesusmariogonz/jesus-site/tree/main/proyectos-propios/pricing-cientifico";
const DESCARGAS = "/proyectos/pricing-cientifico";

export const metadata = {
  title: "Pricing Científico — expediente de proyecto independiente",
  description:
    "Expediente completo de un proyecto independiente y reproducible: tesis de negocio, diccionario de datos, diseño científico, implementación en Python, resultados, arquitectura, gobierno y evaluación económica. Datos simulados, declarados como tales.",
  alternates: { canonical: "/proyectos/pricing-cientifico" },
  openGraph: {
    type: "article",
    url: absUrl("/proyectos/pricing-cientifico"),
    title: "Pricing Científico — expediente de proyecto independiente",
  },
};

export default function PricingCientifico() {
  const { meta, modelo, optimizacion, curvaUtilidad, muestraScatter } = getPricingCientifico();

  return (
    <section className="section pc-page">
      <div className="container prose-container">
        <Link href="/proyectos" className="lib-back">
          ← Proyectos
        </Link>

        <span className="lib-hero-eyebrow" style={{ marginTop: 20 }}>
          Proyecto independiente · reproducible
        </span>
        <h1 style={{ margin: "14px 0 10px" }}>Pricing Científico</h1>
        <p className="pmap-intro" style={{ marginBottom: 8 }}>
          Elasticidad-precio de la demanda y optimización de margen en retail — expediente
          completo, con datos simulados, metodología econométrica estándar y código Python
          reproducible.
        </p>
        <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", lineHeight: 1.6 }}>
          Los otros ocho proyectos en esta página son experiencia profesional real, anonimizada
          por los acuerdos de confidencialidad que firmé con cada empresa — no puedo mostrar
          cálculos, código ni cifras propietarias de ésos. Éste es distinto: lo construí desde
          cero, con datos sintéticos declarados como tales, precisamente para poder enseñar el
          proceso completo — desde la pregunta de negocio hasta el monitoreo en producción — sin
          romper ningún acuerdo. No es una implementación real de ningún empleador; es una
          reconstrucción de referencia con la misma profundidad técnica.
        </p>

        {/* En una mirada — mismo patrón visual que el blog (highlights-grid) */}
        <div className="article-highlights article-highlights--top" style={{ marginTop: 32 }}>
          <span className="article-highlights-titulo">En una mirada</span>
          <div className="highlights-grid">
            <div className="highlight-item">
              <span className="highlight-valor">{modelo.elasticidad_estimada}</span>
              <span className="highlight-etiqueta">Elasticidad-precio estimada (regresión log-log)</span>
              <span className="highlight-meta">verdadera: {modelo.elasticidad_verdadera} · error {modelo.error_vs_verdadera_pct}%</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">R² {modelo.r2}</span>
              <span className="highlight-etiqueta">Ajuste del modelo, IC 95% [{modelo.ic_95_inferior}, {modelo.ic_95_superior}]</span>
              <span className="highlight-meta">n = {modelo.n_observaciones} observaciones</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">${optimizacion.precio_optimo_grid_search_mxn}</span>
              <span className="highlight-etiqueta">Precio óptimo sugerido por el modelo (MXN)</span>
              <span className="highlight-meta">vs. ${optimizacion.precio_lista_actual_mxn} de lista</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-valor">+{optimizacion.mejora_utilidad_semanal_pct}%</span>
              <span className="highlight-etiqueta">Mejora de utilidad esperada bajo los supuestos del modelo</span>
              <span className="highlight-meta">proyección, no un resultado observado — ver sección 05</span>
            </div>
          </div>
        </div>

        {/* Índice del expediente */}
        <div className="prose">
          <h2>Índice del expediente</h2>
          <ol className="pc-indice">
            <li><a href="#tesis">Tesis de negocio</a></li>
            <li><a href="#datos">Datos y contrato de información</a></li>
            <li><a href="#diseno">Diseño científico</a></li>
            <li><a href="#implementacion">Implementación reproducible</a></li>
            <li><a href="#resultados">Resultados y tablero</a></li>
            <li><a href="#arquitectura">Arquitectura de solución</a></li>
            <li><a href="#gobierno">Gobierno y operación</a></li>
            <li><a href="#evaluacion">Evaluación económica y siguientes pasos</a></li>
          </ol>

          <h2 id="tesis">01 · Tesis de negocio</h2>
          <p>
            Cuando un equipo comercial decide subir o bajar el precio de un producto, está
            apostando sobre algo que casi nunca mide con rigor: cuánto va a cambiar la cantidad
            vendida. Subir precio aumenta el margen por unidad pero reduce las unidades vendidas;
            bajar precio hace lo contrario. La decisión que este proyecto busca mejorar es
            exactamente ésa — qué precio de lista fijar para un SKU — y la toma, en un escenario
            real, el equipo de revenue management o pricing comercial, típicamente de forma
            manual y por categoría.
          </p>
          <p>
            <strong>Pregunta de negocio:</strong> ¿cuánto cambia la demanda cuando cambia el
            precio, y dado eso, qué precio maximiza la utilidad semanal — no solo las ventas?
          </p>
          <p>
            <strong>Cómo se mide el éxito:</strong> utilidad semanal esperada (margen × unidades)
            frente a la línea base del precio de lista actual, contrastada contra un experimento
            controlado antes de ejecutarse a toda la red (ver secciones 03 y 08) — nunca contra
            la sola mejora teórica del modelo.
          </p>

          <h2 id="datos">02 · Datos y contrato de información</h2>
          <p>
            Panel sintético de {meta.n_tiendas} tiendas × {meta.n_semanas} semanas (
            {meta.n_observaciones} observaciones) para un SKU único, generado con una
            elasticidad-precio <strong>verdadera y conocida</strong> ({meta.elasticidad_verdadera}
            ). No son datos de ninguna empresa real. Fijar un valor verdadero de antemano tiene un
            propósito preciso: permite validar el método — si la regresión de la sección 03
            recupera un número cercano a {meta.elasticidad_verdadera}, eso demuestra que el
            método funciona bajo los supuestos declarados, antes de confiar en él con datos
            reales.
          </p>

          <h3>Diccionario de datos</h3>
          <table>
            <thead>
              <tr>
                <th>Campo</th>
                <th>Granularidad</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>tienda</code></td><td>Tienda (1–{meta.n_tiendas})</td><td>Identificador de tienda; captura el efecto fijo no observable (ubicación, tamaño, mezcla de clientes).</td></tr>
              <tr><td><code>semana</code></td><td>Semana (1–{meta.n_semanas})</td><td>Semana del panel; alimenta los controles de estacionalidad senoidal.</td></tr>
              <tr><td><code>precio</code></td><td>Tienda-semana</td><td>Precio de venta efectivo del SKU, en MXN. Varía por promociones, no por reacción a la demanda (supuesto de identificación, ver sección 03).</td></tr>
              <tr><td><code>cantidad</code></td><td>Tienda-semana</td><td>Unidades vendidas del SKU en esa tienda-semana. Variable dependiente del modelo.</td></tr>
              <tr><td><code>promo</code></td><td>Tienda-semana</td><td>Indicador binario de semana con promoción programada — el "empujón" exógeno que mueve el precio.</td></tr>
            </tbody>
          </table>

          <h3>Calidad y linaje</h3>
          <p>
            Al ser datos generados, no hay nulos, duplicados ni outliers de captura que limpiar
            — una decisión deliberada para aislar la metodología estadística del trabajo de
            calidad de datos. En un proyecto real, esta sección documentaría en su lugar: reglas
            de validación en origen (precio y cantidad no negativos, tienda activa), reconciliación
            contra el total de ventas del ERP, y el linaje completo punto de venta → warehouse →
            tabla de features (ver arquitectura, sección 06).
          </p>

          <table>
            <thead>
              <tr>
                <th>Parámetro del panel</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Precio de lista</td><td>${meta.precio_base_mxn} MXN</td></tr>
              <tr><td>Costo marginal</td><td>${meta.costo_marginal_mxn} MXN</td></tr>
              <tr><td>Rango de precio observado</td><td>${meta.precio_min_observado} – ${meta.precio_max_observado} MXN</td></tr>
              <tr><td>Cantidad promedio semanal</td><td>{meta.cantidad_promedio_semanal} unidades</td></tr>
              <tr><td>% de semanas con promoción</td><td>{meta.pct_semanas_con_promo}%</td></tr>
            </tbody>
          </table>

          <h2 id="diseno">03 · Diseño científico</h2>
          <p>
            El precio en estos datos varía de forma <em>exógena</em>: la cadena simulada baja
            precio en promociones programadas, independientes del shock de demanda de esa
            semana — ese es el supuesto de identificación que hace válida la regresión. En
            datos reales de retail esto casi nunca se cumple limpiamente: el precio suele
            cambiar reaccionando a la demanda esperada (bajar precio cuando se anticipa demanda
            débil, por ejemplo), un problema clásico llamado <strong>endogeneidad del precio</strong>,
            que sesga una regresión simple.
          </p>
          <p>
            Las dos soluciones estándar para ese problema son variables instrumentales (una
            variable que mueve el precio sin afectar la demanda por otra vía, ej. el costo del
            insumo) o un experimento controlado de precio (A/B testing real en un subconjunto de
            tiendas). Un proyecto real empezaría por confirmar cuál de las dos aplica antes de
            construir el modelo — este proyecto sintético evita el problema por construcción
            (el precio no reacciona a la demanda), precisamente para poder validar primero que el
            método de estimación es correcto antes de preocuparse por la identificación causal.
          </p>
          <p>
            <strong>Hipótesis:</strong> la demanda del SKU sigue una relación de elasticidad
            constante respecto al precio (log-log), con efectos fijos no observables por tienda
            y un componente estacional de 52 semanas.
          </p>

          <h2 id="implementacion">04 · Implementación reproducible</h2>
          <p>
            Esta sección no resume el código — lo incluye completo, los tres scripts tal como
            están en el repositorio, en el mismo orden en que se ejecutan. Cada uno lee los
            archivos que produjo el anterior y escribe su propia salida en JSON/CSV; no hay
            estado oculto ni pasos manuales entre medio. Para reproducirlo de punta a punta
            (requiere Python 3 con <code>numpy</code>, <code>pandas</code> y{" "}
            <code>statsmodels</code>):
          </p>
          <pre>
            <code>{`pip install numpy pandas statsmodels

python3 proyectos-propios/pricing-cientifico/generar_datos.py
python3 proyectos-propios/pricing-cientifico/modelo_elasticidad.py
python3 proyectos-propios/pricing-cientifico/optimizar_precio.py`}</code>
          </pre>

          <h3>Paso 1 · <code>generar_datos.py</code> — genera el panel sintético</h3>
          <p>
            Construye {meta.n_tiendas} tiendas × {meta.n_semanas} semanas de datos, cada una con
            un efecto fijo de tienda distinto (<code>efecto_tienda</code>, log-normal), una
            estacionalidad senoidal de 52 semanas, una promoción exógena pseudo-aleatoria que
            mueve el precio, y una demanda generada exactamente con la fórmula log-log que el
            Paso 2 intentará recuperar — con una elasticidad verdadera fijada a mano (
            <code>ELASTICIDAD_VERDADERA = {meta.elasticidad_verdadera}</code>) precisamente para
            poder comprobar después si el método funciona:
          </p>
          <pre>
            <code>{`"""
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

print(json.dumps(meta, indent=2, ensure_ascii=False))`}</code>
          </pre>
          <p>
            Salida real de esta corrida (<code>datos_meta.json</code>): precio promedio $
            {meta.precio_promedio_observado} MXN, rango ${meta.precio_min_observado}–$
            {meta.precio_max_observado}, {meta.pct_semanas_con_promo}% de semanas con promoción.
          </p>

          <h3>Paso 2 · <code>modelo_elasticidad.py</code> — estima la elasticidad</h3>
          <p>
            La elasticidad-precio se estima con una regresión log-log sobre panel data, con
            efectos fijos por tienda (vía el estimador <em>within</em>) y controles de
            estacionalidad:
          </p>
          <pre>
            <code>{`ln(Q_it) = alpha_i + beta * ln(P_it) + gamma1*sin(2*pi*s/52)
             + gamma2*cos(2*pi*s/52) + delta*Promo_it + e_it

# beta es la elasticidad-precio: % de cambio en cantidad
# ante un 1% de cambio en precio.`}</code>
          </pre>
          <pre>
            <code>{`"""
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
print(json.dumps(resultado, indent=2, ensure_ascii=False))`}</code>
          </pre>

          <p><strong>¿Por qué logaritmos (log-log)?</strong> Tomar el logaritmo de precio y de
          cantidad antes de la regresión convierte la pregunta "¿cuántas unidades menos se venden
          si el precio sube $1?" (que depende del nivel de precio) en "¿qué % cambia la cantidad
          si el precio sube 1%?" — una relación mucho más estable entre productos y rangos de
          precio distintos. El coeficiente de <code>ln_p</code> en esa regresión <em>es</em>, por
          construcción, la elasticidad-precio.</p>

          <p><strong>El estimador <em>within</em> (demeaning), línea por línea:</strong> cada
          tienda tiene un nivel base de ventas distinto (tamaño, ubicación, tráfico) que nada
          tiene que ver con el precio — si no se controla, ese efecto de tienda contamina el
          coeficiente. El bloque{" "}
          <code>df_demeaned[v] = df[v] - df.groupby("tienda")[v].transform("mean")</code> resta a
          cada variable (precio, cantidad, estación, promo) el promedio histórico de esa misma
          tienda:</p>
          <pre>
            <code>{`ln_p_demeaned_it = ln_p_it - promedio_tienda_i(ln_p)
ln_q_demeaned_it = ln_q_it - promedio_tienda_i(ln_q)
# la regresión sobre las variables "demeaned" ya no necesita
# una columna por tienda: el efecto fijo desaparece algebraicamente.`}</code>
          </pre>
          <p>Es matemáticamente equivalente a agregar 40 variables dummy (una por tienda) a la
          regresión, pero mucho más barato de calcular y sin el riesgo de multicolinealidad de
          tener tantas columnas.</p>

          <p><strong>Errores estándar agrupados (clustered) por tienda:</strong> las observaciones
          de una misma tienda en semanas consecutivas no son independientes entre sí (si una tienda
          tiene una mala semana, es probable que la siguiente también lo sea) — ignorar esa
          correlación serial hace que el modelo reporte una confianza mayor a la que realmente
          tiene. El parámetro <code>cov_type="cluster", cov_kwds={"{"}"groups": df_demeaned["tienda"]{"}"}</code>{" "}
          le dice a <code>statsmodels</code> que agrupe los errores por tienda al calcular el
          intervalo de confianza: el rango [{modelo.ic_95_inferior}, {modelo.ic_95_superior}] ya
          lo incorpora.</p>

          <p><strong>R² (coeficiente de determinación):</strong> <code>modelo.rsquared</code> mide
          qué proporción de la variación en <code>ln_q</code> explica el modelo — {modelo.r2}{" "}
          significa que cerca del {Math.round(modelo.r2 * 100)}% de esa variación se explica por
          precio, estacionalidad y el efecto fijo de tienda; el resto es ruido u otros factores no
          modelados. Es una medida de ajuste a estos datos, no de qué tan bien predeciría datos
          futuros (ver la advertencia de la sección 05).</p>

          <p><strong>Intervalo de confianza del 95%:</strong> <code>modelo.conf_int(alpha=0.05)</code>{" "}
          devuelve el rango [{modelo.ic_95_inferior}, {modelo.ic_95_superior}] — el conjunto de
          valores de elasticidad consistentes con los datos observados, con 95% de confianza
          estadística. Esto no significa que la elasticidad verdadera tenga 95% de probabilidad
          de estar ahí (una distinción técnica real entre la estadística frecuentista clásica y
          la bayesiana); significa que si se repitiera este mismo experimento muchas veces, el
          95% de los intervalos construidos así contendrían el valor verdadero. Aquí sabemos que
          sí lo contiene ({modelo.elasticidad_verdadera}) porque generamos los datos nosotros
          mismos — la validación que motiva todo este proyecto.</p>

          <p>
            Salida real de esta corrida (<code>resultado_modelo.json</code>): elasticidad{" "}
            {modelo.elasticidad_estimada}, IC 95% [{modelo.ic_95_inferior}, {modelo.ic_95_superior}
            ], p-value {modelo.p_value}, R² {modelo.r2}, n = {modelo.n_observaciones}.
          </p>

          <h2 id="resultados">05 · Resultados y tablero</h2>
          <p>
            El resultado: elasticidad estimada de <strong>{modelo.elasticidad_estimada}</strong>,
            con intervalo de confianza del 95% de [{modelo.ic_95_inferior}, {modelo.ic_95_superior}]
            y R² de {modelo.r2}. La elasticidad verdadera usada para generar los datos (
            {modelo.elasticidad_verdadera}) cae dentro de ese intervalo, con un error de solo{" "}
            {modelo.error_vs_verdadera_pct}% — el método recupera el parámetro real cuando se
            cumplen sus supuestos.
          </p>
        </div>

        <div className="pc-chart-wrap">
          <span className="screener-grafica-eje">Precio vs. cantidad vendida — puntos observados y curva de demanda ajustada</span>
          <GraficaDemanda muestraScatter={muestraScatter} meta={meta} modelo={modelo} />
        </div>

        <div className="prose">
          <div className="pc-advertencia">
            <strong>Ajuste estadístico no es lo mismo que capacidad predictiva.</strong> El R² de{" "}
            {modelo.r2} y el intervalo de confianza describen qué tan bien la curva se ajusta a
            estos datos y cuánta incertidumbre tiene el coeficiente — no demuestran que el modelo
            prediga bien semanas futuras. Antes de usarlo en producción, un proyecto real
            necesitaría: una validación temporal (entrenar con las primeras semanas, probar
            contra las últimas), un modelo base de comparación (ej. elasticidad fija por
            categoría, sin efectos fijos), un análisis de residuos por tienda y por semana, y una
            prueba de sensibilidad a los supuestos (quitar la estacionalidad, cambiar la ventana
            de datos). Aquí se presentan como extensiones pendientes, no como algo ya demostrado.
          </div>

          <h3>Paso 3 · <code>optimizar_precio.py</code> — calcula el precio óptimo</h3>
          <p>
            Con la elasticidad estimada y el costo marginal conocido, el precio que maximiza la
            utilidad de un producto con poder de mercado local tiene una fórmula cerrada clásica
            de teoría de precios (el Índice de Lerner). De dónde sale: la utilidad semanal es
            margen por unidad × cantidad vendida, <code>U(P) = (P - costo) × Q(P)</code>, y con la
            curva de demanda log-log estimada, <code>Q(P) = Q_base × (P/P_base)^elasticidad</code>.
            Derivando <code>U(P)</code> respecto a <code>P</code> e igualando a cero (la condición
            de primer orden de un máximo) se llega, tras simplificar, a la fórmula del Índice de
            Lerner:
          </p>
          <pre>
            <code>{`(P* - costo) / P* = -1 / elasticidad   # el "margen de Lerner" óptimo
P* = costo / (1 + 1/elasticidad)

# con elasticidad = ${modelo.elasticidad_estimada} y costo = $${meta.costo_marginal_mxn}:
P* = ${meta.costo_marginal_mxn} / (1 + 1/${modelo.elasticidad_estimada}) = $${optimizacion.precio_optimo_formula_lerner_mxn}`}</code>
          </pre>
          <p>
            La fórmula solo tiene un máximo interior válido cuando la demanda es elástica
            (|elasticidad| &gt; 1, como aquí: {Math.abs(modelo.elasticidad_estimada)}); con
            demanda inelástica no existe un precio óptimo finito bajo este modelo — subir el
            precio siempre mejoraría la utilidad, una señal de que el modelo dejó de ser realista
            en ese rango. El script completo, que calcula esa fórmula y además la valida por
            fuerza bruta:
          </p>
          <pre>
            <code>{`"""
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

print(json.dumps(salida, indent=2, ensure_ascii=False))`}</code>
          </pre>
          <p>
            <strong>Por qué el grid search es una validación real, no un adorno:</strong> la línea{" "}
            <code>grid_precios = np.linspace(costo * 1.02, precio_base * 1.6, 4000)</code> evalúa
            la utilidad en 4,000 precios distintos entre un poco arriba del costo y 1.6× el precio
            de lista, y <code>np.argmax(utilidad)</code> busca el máximo por fuerza bruta — sin
            usar cálculo diferencial, solo evaluar la función muchas veces y comparar. Los dos
            métodos coinciden exactamente en ${optimizacion.precio_optimo_grid_search_mxn} MXN (
            diferencia: ${optimizacion.diferencia_metodos_mxn}) — si no coincidieran, habría un
            error de álgebra o de código en alguno de los dos caminos; que coincidan es la prueba
            de que ambos están bien implementados.
          </p>
          <p>
            Salida real de esta corrida (<code>resultado_optimizacion.json</code>): precio óptimo
            ${optimizacion.precio_optimo_grid_search_mxn} MXN, utilidad semanal en el precio actual
            ${optimizacion.utilidad_semanal_en_precio_actual_mxn} MXN vs. $
            {optimizacion.utilidad_semanal_en_precio_optimo_mxn} MXN en el óptimo.
          </p>
        </div>

        <div className="pc-chart-wrap">
          <span className="screener-grafica-eje">Utilidad semanal esperada según el precio — el óptimo cae fuera del rango de precios observado</span>
          <GraficaUtilidad curvaUtilidad={curvaUtilidad} meta={meta} optimizacion={optimizacion} />
        </div>

        <div className="prose">
          <div className="pc-advertencia">
            <strong>Esto es exactamente el tipo de resultado que no se debe ejecutar tal cual.</strong>{" "}
            El +{optimizacion.mejora_utilidad_semanal_pct}% es la mejora de utilidad{" "}
            <em>esperada bajo los supuestos de la simulación</em>, no un incremento observado en
            tiendas reales — son cosas distintas y conviene no confundirlas. El precio óptimo
            sugerido (${optimizacion.precio_optimo_grid_search_mxn}) implica un aumento de{" "}
            {optimizacion.cambio_precio_vs_lista_pct}% sobre el precio de lista — muy por fuera
            del rango de precios que realmente se observó (${meta.precio_min_observado} – $
            {meta.precio_max_observado}). El modelo está extrapolando la curva de demanda hacia
            una zona donde nunca vio comportamiento real: la relación precio-cantidad podría
            dejar de ser log-lineal ahí (saturación, sustitución hacia otros productos, reacción
            de la competencia). La recomendación correcta no es "subir el precio 39%", es diseñar
            un experimento controlado con grupo de tratamiento y grupo de control (ver sección 08)
            que pruebe un aumento más moderado, medir la respuesta real, y repetir el proceso de
            forma incremental.
          </div>

          <h3>Extensiones de la optimización comercial, no capacidades ya demostradas</h3>
          <p>
            El precio óptimo actual se calcula para un solo producto, con costo marginal y
            elasticidad constantes. Un caso real ampliaría esto en varias direcciones, cada una
            como un siguiente proyecto, no como algo que esta versión ya resuelve: restricciones
            de precio (mínimos de margen, techos regulatorios o de competencia), elasticidad
            variable por rango de precio en vez de constante, efecto de promociones superpuestas,
            canibalización entre productos del mismo portafolio, y diferencias de elasticidad por
            tienda o segmento de cliente en vez de un único coeficiente para toda la red.
          </p>

          <h3>Evidencia descargable</h3>
          <p>
            Los archivos reales que alimentan esta página — no capturas de pantalla, los datos y
            resultados tal como los producen los scripts — están disponibles para inspeccionar o
            reproducir el análisis de forma independiente:
          </p>
          <ul className="pc-descargas">
            <li><a href={`${DESCARGAS}/datos_panel.csv`}>datos_panel.csv</a> — panel completo, {meta.n_observaciones} filas</li>
            <li><a href={`${DESCARGAS}/datos_meta.json`}>datos_meta.json</a> — parámetros de la simulación</li>
            <li><a href={`${DESCARGAS}/resultado_modelo.json`}>resultado_modelo.json</a> — salida real de la regresión</li>
            <li><a href={`${DESCARGAS}/resultado_optimizacion.json`}>resultado_optimizacion.json</a> — salida real de la optimización</li>
            <li><a href={`${DESCARGAS}/curva_utilidad.csv`}>curva_utilidad.csv</a> — curva de utilidad vs. precio, muestreada</li>
          </ul>

          <h2 id="arquitectura">06 · Arquitectura de solución</h2>
          <p>
            Así se vería este mismo proceso corriendo de forma continua en una organización real,
            con reentrenamiento periódico conforme se acumulan nuevas semanas de datos — y,
            después de cada cambio de precio ejecutado, los resultados reales retroalimentan al
            modelo:
          </p>
        </div>

        <div className="pc-chart-wrap">
          <PricingCientificoArquitectura />
        </div>

        <div className="prose">
          <p>
            Ingesta desde punto de venta hacia una capa de ingesta (batch diario o streaming),
            consolidada en un data warehouse con una tabla de ventas tienda·SKU·semana. Desde ahí,
            un paso de feature engineering construye las variables del modelo (precio, promoción,
            estación), que alimentan tanto el modelo de elasticidad (Python, statsmodels) como,
            río abajo, el simulador de precio (grid search + Índice de Lerner). El resultado se
            publica en un tablero comercial con el precio recomendado y su intervalo de confianza,
            para que el equipo comercial decida — nunca para que el modelo ejecute el cambio
            directamente.
          </p>

          <h2 id="gobierno">07 · Gobierno y operación</h2>
          <p>
            Un modelo no está terminado cuando genera un coeficiente. Para que esta arquitectura
            fuera mantenible en producción (MLOps, no solo ciencia de datos), necesitaría:
          </p>
          <ul>
            <li><strong>Control de acceso:</strong> quién puede ver el precio recomendado y quién puede autorizar su ejecución — roles distintos.</li>
            <li><strong>Trazabilidad:</strong> cada recomendación de precio debe poder rastrearse hasta la versión exacta del modelo y los datos que la produjeron.</li>
            <li><strong>Versionado:</strong> del modelo (coeficientes, fecha de reentrenamiento) y de los datos de entrada, para poder reproducir cualquier recomendación pasada.</li>
            <li><strong>Monitoreo:</strong> comparar la demanda real posterior a un cambio de precio contra la predicha, para detectar cuándo el modelo se degrada (drift).</li>
            <li><strong>Alertas y reversión:</strong> umbrales que disparen una alerta si la demanda real se desvía mucho de la esperada, con un camino claro para revertir el precio.</li>
            <li><strong>Responsables:</strong> un dueño de producto de datos (el modelo) y un dueño de negocio (la decisión de ejecutar) — nunca la misma persona que valida su propio resultado sin contraparte.</li>
          </ul>

          <h2 id="evaluacion">08 · Evaluación económica y siguientes pasos</h2>
          <p>
            La utilidad incremental potencial, bajo los supuestos del modelo, es de +
            {optimizacion.mejora_utilidad_semanal_pct}% semanal frente al precio de lista actual.
            Separar esa cifra del impacto real observado importa: es una proyección bajo
            supuestos declarados, no una medición de campo. Los costos de operar esto en
            producción (cómputo de reentrenamiento, mantenimiento del pipeline, tiempo del equipo
            comercial revisando recomendaciones) y los riesgos (extrapolación, endogeneidad no
            resuelta en datos reales, canibalización no modelada) son parte del mismo balance, no
            un pie de página.
          </p>
          <p>
            <strong>Diseño del experimento piloto antes de escalar:</strong> un grupo de
            tratamiento (un subconjunto de tiendas donde se aplica un aumento moderado, dentro del
            rango observado) y un grupo de control (tiendas que mantienen el precio de lista),
            asignados aleatoriamente para evitar sesgo de selección. Métrica de evaluación:
            utilidad semanal real del grupo de tratamiento vs. control, durante un periodo fijo
            (ej. 8 semanas). Regla de suspensión: si la cantidad vendida cae más de lo que el
            modelo predijo para ese nivel de precio, se revierte el experimento antes de escalar
            a más tiendas.
          </p>

          <h2>Código fuente completo</h2>
          <p>
            Los tres scripts reales y los archivos de resultados que alimentan esta página están
            en el repositorio del sitio:
          </p>
          <p>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn">
              Ver código en GitHub →
            </a>
          </p>
        </div>

        <div className="lib-cta-final">
          <p>¿Quieres ver los demás proyectos o leer más análisis de datos?</p>
          <div className="lib-cta-botones">
            <Link href="/proyectos" className="btn ghost">
              ← Volver a Proyectos
            </Link>
            <Link href="/blog" className="btn ghost">
              Leer el blog →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
