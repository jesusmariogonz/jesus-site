import Link from "next/link";
import { LIBROS } from "@/lib/recursos";
import LibroCover from "@/components/LibroCover";
import AutorLibro from "@/components/AutorLibro";

export const metadata = {
  title: "Cómo leer el mercado — colección de 4 libros",
  description:
    "Metodología de 90 días por libro para comprender los mercados financieros, construir sistemas de inversión y evaluar decisiones con datos, riesgo y evidencia. De cero a cuantitativo, con práctica contra los datos reales de Pulso de Mercado.",
  alternates: { canonical: "/recursos/como-leer-el-mercado" },
};

const IDS_COLECCION = [
  "como-leer-el-mercado-fundamentos",
  "como-leer-el-mercado-sistemas",
  "como-leer-el-mercado-cuantitativo",
  "como-leer-el-mercado-practica-ia",
];

export default function ColeccionComoLeerElMercado() {
  const libros = IDS_COLECCION.map((id) => LIBROS.find((l) => l.id === id)).filter(Boolean);

  return (
    <section className="lib-page">
      <div className="container tk-product-container">
        <Link href="/recursos" className="lib-back">
          ← Biblioteca
        </Link>

        <div className="lib-hero">
          <span className="sql-meta">colección · 4 libros · jesús gonzález</span>
          <h1 className="lib-hero-title">Cómo leer el mercado</h1>
          <p className="lib-hero-desc">
            Una formación progresiva para comprender los mercados financieros,
            construir sistemas de inversión y evaluar decisiones con datos,
            riesgo y evidencia. Cuatro libros, cada uno con una metodología
            didáctica de 13 semanas (91 días): lección diaria, ejercicios con
            respuesta, práctica documentada contra datos reales de{" "}
            <Link href="/pulso-mercado">Pulso de Mercado</Link> y un proyecto
            que crece de libro en libro — tu propio sistema de inversión,
            documentado y probado. Paper trading siempre: dinero ficticio,
            sin apalancamiento. Ningún libro es asesoría financiera ni
            recomienda comprar o vender nada.
          </p>
        </div>

        <div className="lib-product-section">
          <h2>La colección</h2>
          <div className="jx-stats" style={{ marginTop: "1.2rem" }}>
            {libros.map((libro, i) => (
              <Link
                key={libro.id}
                href={`/recursos/${libro.id}`}
                className="jx-stat"
                style={{ textAlign: "left", textDecoration: "none" }}
              >
                <div style={{ maxWidth: 140, margin: "0 auto 12px" }}>
                  <LibroCover
                    variante={libro.variante}
                    titulo={libro.titulo}
                    eyebrow={libro.detalle?.eyebrow || "Biblioteca"}
                    paginas={libro.paginas}
                    precio={libro.precio}
                    gratis={!libro.precio}
                    imagen={libro.imagenPortada}
                    size="card"
                  />
                </div>
                <b style={{ fontSize: "1rem" }}>Libro {i + 1}</b>
                <small>
                  {libro.subtitulo}
                  <br />
                  {libro.stripePriceId ? (
                    <strong>${libro.precio} MXN</strong>
                  ) : (
                    <em>Próximamente</em>
                  )}
                </small>
              </Link>
            ))}
          </div>
        </div>

        <div className="lib-product-section">
          <h2>Cómo funciona cada día</h2>
          <ul>
            <li>
              <strong>Lunes a jueves:</strong> lección nueva en tres capas
              (intuición, mecanismo, fórmula), con ejemplo numérico, cuándo
              falla y ejercicios en tres niveles (reproducir, aplicar,
              transferir) con respuesta al final de la semana.
            </li>
            <li>
              <strong>Viernes:</strong> repaso mezclado (en el Libro 2,
              laboratorio en hoja de cálculo).
            </li>
            <li>
              <strong>Sábado:</strong> técnica Feynman — explicar la idea con
              palabras simples, se aprueba con 4 de 5 criterios.
            </li>
            <li>
              <strong>Domingo:</strong> revisión con mínimos medibles y una
              puerta que decide si avanzas o refuerzas un punto antes de
              seguir.
            </li>
            <li>
              Cada día incluye también práctica documentada contra Pulso de
              Mercado (ficha de cinco campos, con fecha y fuente) y tarjetas
              de repaso espaciado (N−1, N−3, N−7, N−14, N−30).
            </li>
          </ul>
        </div>

        <div className="lib-product-section">
          <h2>Qué puedes esperar</h2>
          <p className="lib-product-resultado">
            Al terminar el Libro 1: entender cómo se forma un precio, leer
            estados financieros y gráficas con criterio, escribir reglas con
            números, y tener un Plan base con registro de práctica. Al
            terminar el Libro 2: un sistema probado con backtest honesto y
            simulación. Lo que el curso NO promete: rendimientos, ni volverte
            experto en 90 días — "todavía no" es un resultado válido de cada
            puerta, y nada de esto es asesoría financiera personalizada.
          </p>
        </div>

        <AutorLibro />

        <div className="lib-cta-final">
          <p>¿Quieres llevar la práctica más lejos con herramientas listas para usar?</p>
          <Link href="/the-toolkit" className="btn">
            Conoce The Toolkit →
          </Link>
        </div>
      </div>
    </section>
  );
}
