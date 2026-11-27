import Image from "next/image";
import Link from "next/link";
import CvTimeline from "@/components/CvTimeline";
import SobreFocos from "@/components/SobreFocos";

export const metadata = {
  title: "Sobre mí",
  description:
    "Jesús Mario González Siller (Chuy): Data, Analytics & AI Solutions Architect en FEMSA Proximidad y Salud, desde Saltillo, México. Trayectoria, logros y CV.",
  alternates: { canonical: "/sobre-mi" },
};

const focos = [
  {
    titulo: "Producto de datos",
    desc: "Definición, evolución y entrega de productos de datos alineados a objetivos de negocio.",
    icono: "producto",
    imagen: "/images/sobre-mi/producto.jpg",
  },
  {
    titulo: "Arquitectura analítica",
    desc: "Diseño de soluciones sobre Snowflake, Databricks y Azure bajo estándares de gobierno de datos.",
    icono: "arquitectura",
    imagen: "/images/sobre-mi/arquitectura.jpg",
  },
  {
    titulo: "IA aplicada",
    desc: "Analítica avanzada e inteligencia artificial generativa llevadas a casos de uso reales.",
    icono: "ia",
    imagen: "/images/sobre-mi/ia.jpg",
  },
  {
    titulo: "Valor y ROI",
    desc: "Casos de negocio, TCO y retorno de inversión de plataformas de datos, contados en lenguaje ejecutivo.",
    icono: "roi",
    imagen: "/images/sobre-mi/roi.jpg",
  },
];

export default function SobreMi() {
  return (
    <article className="article">
      <div className="container">
        <div className="sobre-mi-foto-wrap">
          <Image
            src="/jesus-hero-card.jpg"
            alt="Jesús González — Data, AI & Business. Más de 13 años convirtiendo datos en decisiones que generan valor."
            width={1254}
            height={1254}
            priority
            className="sobre-mi-foto"
          />
        </div>
        <header>
          <span className="sql-meta">sobre mí</span>
          <h1>Hola, soy Jesús González.</h1>
        </header>
        <div className="prose">
          <p>
            Soy <strong>Data, Analytics &amp; AI Solutions Architect</strong> en
            FEMSA Proximidad y Salud, desde Saltillo, Coahuila. Ingeniero en Electrónica y
            Comunicaciones por la UANL, con más de 13 años de experiencia en
            tecnologías de información y datos.
          </p>
          <p>
            Mi trabajo consiste en liderar la definición, evolución y entrega
            de soluciones analíticas y productos de datos que habilitan la
            toma de decisiones estratégicas y operativas del negocio:
            asegurando la alineación entre las necesidades de las unidades de
            negocio, la arquitectura tecnológica y los estándares de gobierno
            de datos, y generando valor mediante analítica avanzada,
            inteligencia artificial y capacidades digitales.
          </p>

          <p className="sobre-evolucion">
            Infraestructura → Ingeniería de datos → Analítica → Arquitectura
            de datos → Productos de datos → IA / GenAI
          </p>

          <h2>Cómo trabajo</h2>
          <p>
            Parto siempre del negocio antes que de la tecnología: entender qué
            decisión se quiere tomar mejor, para luego diseñar la arquitectura
            de datos que la soporta, construir el producto sobre ella, y
            aplicar IA donde realmente mueve la aguja — todo bajo estándares
            de gobierno de datos que hacen esa solución sostenible, no un
            experimento aislado.
          </p>
          <SobreFocos focos={focos} />

          <h2>Logros destacados</h2>
          <ul>
            <li>
              Más de <strong>20 iniciativas estratégicas</strong> de datos e IA
              en <strong>7 países</strong> y más de 5 unidades de negocio.
            </li>
            <li>
              Arquitectura de plataformas analíticas que procesan{" "}
              <strong>millones de transacciones diarias</strong> en retail.
            </li>
            <li>
              Liderazgo de migraciones de infraestructura cloud a Snowflake,
              con casos de negocio ante comités financieros (ROI, TIR, VPN).
            </li>
            <li>
              Formación de equipos multidisciplinarios: cursos internos de IA
              generativa y despliegue de casos de uso de negocio.
            </li>
            <li>
              Autor de <em>La Analítica Avanzada: Fundamentos, Implementación
              y Aplicaciones en la Industria</em>.
            </li>
          </ul>

          <h2>Mi trayectoria</h2>
          <p>
            Antes de mi rol actual fui <strong>Arquitecto de Datos en FEMSA
            Comercio</strong>, administrando el repositorio central de datos y
            automatizando la generación de información para nuevos negocios.
            Pasé también por la ingeniería de datos (Raken Data Group), la
            inteligencia de clientes en retail (Falabella · Soriana), la
            consultoría de Business Intelligence en el sector financiero
            (Dimex Capital) y la infraestructura de TI (Neoris de México). Esa
            mezcla me permite hablar el idioma técnico y el de negocio con la
            misma soltura.
          </p>

          <p style={{ margin: "20px 0 8px" }}>
            <a className="btn" href="/cv/cv.pdf" download>
              Descargar CV (PDF)
            </a>{" "}
            <a
              className="btn ghost"
              href="/cv/cv.pdf"
              target="_blank"
              rel="noopener"
              style={{ marginLeft: 10 }}
            >
              Ver PDF
            </a>
          </p>
          <CvTimeline />

          <h2>En qué estoy construyendo</h2>
          <p>
            Mi siguiente paso es llevar el rigor de la arquitectura de datos
            corporativa a la IA aplicada y a la investigación cuantitativa
            abierta. No lo cuento como promesa: lo estoy haciendo en público,
            con resultados que cualquiera puede revisar.
          </p>
          <ul>
            <li>
              <Link href="/pulso-mercado">Pulso de Mercado</Link>: un medidor
              de riesgo y volatilidad que se actualiza a diario, con su
              metodología publicada y probada contra datos históricos.
            </li>
            <li>
              <Link href="/pulso-mercado/research">Research Lab</Link>:
              experimentos con hipótesis fijadas antes de ver resultados, y
              resultados publicados aunque sean negativos o inconclusos.
            </li>
            <li>
              <Link href="/tesis-rag">Tesis RAG</Link>: una serie de
              investigación con experimentos reproducibles sobre persistencia
              no gobernada en sistemas RAG.
            </li>
            <li>
              <Link href="/recursos">Biblioteca</Link>: libros y recursos
              sobre analítica, IA y mercados, con nuevos títulos en
              preparación.
            </li>
          </ul>

          <h2>Qué encontrarás en este sitio</h2>
          <ul>
            <li>
              <strong>Notas técnicas</strong> sobre Snowflake, PySpark,
              Databricks y arquitectura de datos, basadas en problemas reales.
            </li>
            <li>
              <strong>Reflexiones</strong> sobre IA aplicada, retail y el rol
              de producto en equipos de datos.
            </li>
            <li>
              <strong>Proyectos</strong> personales y experimentos.
            </li>
          </ul>

          <p className="sobre-cierre">
            Trabajo en la intersección entre datos, inteligencia artificial y
            negocio.
          </p>

          <p style={{ margin: "24px 0 0" }}>
            <Link href="/proyectos">Ver proyectos →</Link>{" "}
            ·{" "}
            <Link href="/blog">Leer el blog →</Link>{" "}
            ·{" "}
            <Link href="/contacto">Contactar →</Link>
          </p>
        </div>
      </div>
    </article>
  );
}
