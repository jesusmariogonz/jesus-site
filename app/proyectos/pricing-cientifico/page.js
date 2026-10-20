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
            La elasticidad-precio se estima con una regresión log-log sobre panel data, con
            efectos fijos por tienda (vía el estimador <em>within</em>, restando el promedio de
            cada tienda a cada variable) y controles de estacionalidad:
          </p>
          <pre>
            <code>{`ln(Q_it) = alpha_i + beta * ln(P_it) + gamma1*sin(2*pi*s/52)
             + gamma2*cos(2*pi*s/52) + delta*Promo_it + e_it

# beta es la elasticidad-precio: % de cambio en cantidad
# ante un 1% de cambio en precio.`}</code>
          </pre>
          <p>El código real (statsmodels, errores estándar agrupados por tienda):</p>
          <pre>
            <code>{`X = sm.add_constant(df_demeaned[["ln_p", "sin_s", "cos_s", "promo"]])
y = df_demeaned["ln_q"]

modelo = sm.OLS(y, X).fit(
    cov_type="cluster",
    cov_kwds={"groups": df_demeaned["tienda"]},
)
beta = modelo.params["ln_p"]  # -1.769`}</code>
          </pre>
          <p>
            Los tres scripts (<code>generar_datos.py</code>, <code>modelo_elasticidad.py</code>,{" "}
            <code>optimizar_precio.py</code>) se ejecutan en secuencia, sin dependencias ocultas
            ni estado manual — cada uno lee los archivos que produjo el anterior y escribe su
            propia salida en JSON/CSV. Reproducirlo de punta a punta:
          </p>
          <pre>
            <code>{`python3 proyectos-propios/pricing-cientifico/generar_datos.py
python3 proyectos-propios/pricing-cientifico/modelo_elasticidad.py
python3 proyectos-propios/pricing-cientifico/optimizar_precio.py`}</code>
          </pre>

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

          <p>
            Con la elasticidad estimada y el costo marginal conocido, el precio que maximiza la
            utilidad de un producto con poder de mercado local tiene una fórmula cerrada clásica
            de teoría de precios (el Índice de Lerner):
          </p>
          <pre>
            <code>{`(P* - costo) / P* = -1 / elasticidad
P* = costo / (1 + 1/elasticidad)

# con elasticidad = -1.769 y costo = $11.20:
P* = 11.20 / (1 + 1/-1.769) = $25.76`}</code>
          </pre>
          <p>
            Para confirmar que la fórmula se aplicó bien, el proyecto también calcula la utilidad
            esperada en una grilla fina de 4,000 precios distintos (fuerza bruta) y busca el
            máximo por separado. Los dos métodos coinciden exactamente en $
            {optimizacion.precio_optimo_grid_search_mxn} MXN — si no coincidieran, habría un
            error de álgebra o de código en alguno de los dos caminos.
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
