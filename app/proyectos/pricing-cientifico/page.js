import Link from "next/link";
import { getPricingCientifico } from "@/lib/pricingCientifico";
import { GraficaDemanda, GraficaUtilidad } from "@/components/PricingCientificoCharts";
import PricingCientificoArquitectura from "@/components/PricingCientificoArquitectura";
import { absUrl } from "@/lib/site";

const REPO_URL = "https://github.com/jesusmariogonz/jesus-site/tree/main/proyectos-propios/pricing-cientifico";

export const metadata = {
  title: "Pricing Científico — elasticidad-precio y optimización de margen",
  description:
    "Proyecto propio y demostrativo: estimación de elasticidad-precio con regresión log-log, validada contra un valor verdadero conocido, y optimización de precio vía el Índice de Lerner. Datos simulados, código Python real y arquitectura de referencia.",
  alternates: { canonical: "/proyectos/pricing-cientifico" },
  openGraph: {
    type: "article",
    url: absUrl("/proyectos/pricing-cientifico"),
    title: "Pricing Científico — elasticidad-precio y optimización de margen",
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
          Proyecto propio · demostrativo
        </span>
        <h1 style={{ margin: "14px 0 10px" }}>Pricing Científico</h1>
        <p className="pmap-intro" style={{ marginBottom: 8 }}>
          Elasticidad-precio de la demanda y optimización de margen en retail — con datos
          simulados, metodología econométrica estándar y el código Python completo.
        </p>
        <p style={{ color: "var(--ink-soft)", maxWidth: "70ch", lineHeight: 1.6 }}>
          Los ocho proyectos de arriba son reales, pero están anonimizados por los acuerdos
          de confidencialidad que firmé con cada empresa — no puedo mostrar cálculos, código
          ni cifras propietarias. Este es distinto: lo construí desde cero, con datos
          simulados y declarados como tales, precisamente para poder enseñar el proceso
          completo sin romper ningún acuerdo — la metodología, el código y los diagramas
          son exactamente los que usaría en un caso real.
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
              <span className="highlight-etiqueta">Mejora de utilidad semanal esperada en el óptimo</span>
              <span className="highlight-meta">siempre que el modelo generalice — ver límites abajo</span>
            </div>
          </div>
        </div>

        <div className="prose">
          <h2>El problema de negocio</h2>
          <p>
            Cuando un equipo comercial decide subir o bajar el precio de un producto, está
            apostando sobre algo que casi nunca mide con rigor: cuánto va a cambiar la
            cantidad vendida. Subir precio aumenta el margen por unidad pero reduce las
            unidades vendidas; bajar precio hace lo contrario. La pregunta que resuelve este
            proyecto es la que debería responderse antes de mover cualquier precio: ¿cuánto,
            exactamente, cambia la demanda cuando cambia el precio — y dado eso, qué precio
            maximiza la utilidad, no solo las ventas?
          </p>

          <h2>Los datos — simulados, y por qué</h2>
          <p>
            Esta sección usa un panel sintético de {meta.n_tiendas} tiendas × {meta.n_semanas}{" "}
            semanas ({meta.n_observaciones} observaciones) para un SKU único, generado con
            una elasticidad-precio <strong>verdadera y conocida</strong> ({meta.elasticidad_verdadera}
            ). No son datos de ninguna empresa real. Generarlos así, con un valor verdadero
            fijado de antemano, tiene un propósito preciso: permite validar el método — si la
            regresión de la siguiente sección recupera un número cercano a{" "}
            {meta.elasticidad_verdadera}, eso demuestra que el método funciona bajo los
            supuestos declarados, antes de confiar en él con datos reales.
          </p>
          <p>
            El precio en estos datos varía de forma <em>exógena</em> (la cadena simulada baja
            precio en promociones programadas, independientes del shock de demanda de esa
            semana) — ese es el supuesto de identificación que hace válida la regresión. En
            datos reales de retail esto casi nunca se cumple limpiamente: el precio suele
            cambiar reaccionando a la demanda esperada (bajar precio cuando se anticipa
            demanda débil, por ejemplo), lo que sesga una regresión simple. Las dos
            soluciones estándar para ese problema de endogeneidad son variables
            instrumentales (una variable que mueve el precio sin afectar la demanda por
            otra vía, ej. el costo del insumo) o un experimento controlado de precio
            (A/B testing real en un subconjunto de tiendas) — un proyecto real empezaría
            por confirmar cuál de las dos aplica antes de construir el modelo.
          </p>

          <table>
            <thead>
              <tr>
                <th>Parámetro</th>
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

          <h2>Metodología: regresión log-log con efectos fijos de tienda</h2>
          <p>
            La elasticidad-precio se estima con una regresión log-log sobre panel data,
            con efectos fijos por tienda (vía el estimador <em>within</em>, restando el
            promedio de cada tienda a cada variable) y controles de estacionalidad:
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
            El resultado: elasticidad estimada de <strong>{modelo.elasticidad_estimada}</strong>,
            con intervalo de confianza del 95% de [{modelo.ic_95_inferior}, {modelo.ic_95_superior}]
            y R² de {modelo.r2}. La elasticidad verdadera usada para generar los datos
            ({modelo.elasticidad_verdadera}) cae dentro de ese intervalo, con un error de solo{" "}
            {modelo.error_vs_verdadera_pct}% — el método recupera el parámetro real cuando
            se cumplen sus supuestos.
          </p>
        </div>

        <div className="pc-chart-wrap">
          <span className="screener-grafica-eje">Precio vs. cantidad vendida — puntos observados y curva de demanda ajustada</span>
          <GraficaDemanda muestraScatter={muestraScatter} meta={meta} modelo={modelo} />
        </div>

        <div className="prose">
          <h2>Optimización de precio: el Índice de Lerner</h2>
          <p>
            Con la elasticidad estimada y el costo marginal conocido, el precio que
            maximiza la utilidad de un producto con poder de mercado local tiene una
            fórmula cerrada clásica de teoría de precios (el Índice de Lerner):
          </p>
          <pre>
            <code>{`(P* - costo) / P* = -1 / elasticidad
P* = costo / (1 + 1/elasticidad)

# con elasticidad = -1.769 y costo = $11.20:
P* = 11.20 / (1 + 1/-1.769) = $25.76`}</code>
          </pre>
          <p>
            Para confirmar que la fórmula se aplicó bien, el proyecto también calcula la
            utilidad esperada en una grilla fina de 4,000 precios distintos (fuerza bruta)
            y busca el máximo por separado. Los dos métodos coinciden exactamente en{" "}
            ${optimizacion.precio_optimo_grid_search_mxn} MXN — si no coincidieran, habría un
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
            El precio óptimo sugerido (${optimizacion.precio_optimo_grid_search_mxn}) implica un
            aumento de {optimizacion.cambio_precio_vs_lista_pct}% sobre el precio de lista — muy
            por fuera del rango de precios que realmente se observó en los datos (${meta.precio_min_observado}
            {" "}–{" "}${meta.precio_max_observado}). El modelo está extrapolando la curva de demanda hacia
            una zona donde nunca vio comportamiento real: la relación precio-cantidad podría
            dejar de ser log-lineal ahí (saturación, sustitución hacia otros productos, reacción
            de la competencia). La recomendación correcta no es "subir el precio 39%", es
            diseñar un experimento controlado que pruebe un aumento más moderado, medir la
            respuesta real, y repetir el proceso de forma incremental.
          </div>

          <h2>Arquitectura de implementación en producción</h2>
          <p>
            Así se vería este mismo proceso corriendo de forma continua en una organización
            real, con reentrenamiento periódico conforme se acumulan nuevas semanas de datos
            (y, después de cada cambio de precio ejecutado, los resultados reales retroalimentan
            al modelo):
          </p>
        </div>

        <div className="pc-chart-wrap">
          <PricingCientificoArquitectura />
        </div>

        <div className="prose">
          <h2>Límites del método y qué seguiría</h2>
          <ul>
            <li>
              <strong>Endogeneidad del precio:</strong> en datos reales, confirmar que el
              precio varía por razones ajenas a la demanda (o usar variables instrumentales /
              un experimento controlado) antes de confiar en el coeficiente.
            </li>
            <li>
              <strong>Extrapolación:</strong> el precio óptimo cae fuera del rango observado —
              validarlo con un aumento incremental real antes de aplicarlo a toda la red.
            </li>
            <li>
              <strong>Un solo producto:</strong> este modelo no captura elasticidad cruzada
              (clientes que cambian a un producto sustituto en vez de dejar de comprar) — un
              siguiente paso natural es un modelo multi-producto por categoría.
            </li>
            <li>
              <strong>Estacionalidad simplificada:</strong> una onda senoidal de 52 semanas es
              una aproximación; datos reales necesitarían controles de calendario (días
              festivos, quincena de pago) más finos.
            </li>
          </ul>

          <h2>Código fuente completo</h2>
          <p>
            Los tres scripts reales (<code>generar_datos.py</code>, <code>modelo_elasticidad.py</code>,{" "}
            <code>optimizar_precio.py</code>) y los archivos de resultados que alimentan esta
            página están en el repositorio del sitio:
          </p>
          <p>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn">
              Ver código en GitHub →
            </a>
          </p>
        </div>

        <div className="lib-cta-final">
          <p>¿Quieres ver los proyectos reales (anonimizados) o leer más análisis de datos?</p>
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
