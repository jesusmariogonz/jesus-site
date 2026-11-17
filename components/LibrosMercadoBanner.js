import Link from "next/link";
import { LIBROS } from "@/lib/recursos";

/* Banner promocional de la colección "Cómo leer el mercado" (4 libros),
   al costado del Market Snapshot en /pulso-mercado. Lleva a la página
   de colección con la explicación completa de los 4 libros.

   Todo lo que afirma sale de los datos reales de lib/recursos.js: las
   portadas, el precio y qué libros ya están disponibles (los que tienen
   páginas; el resto figura "en preparación" y se muestra como tal). */
const IDS = [
  "como-leer-el-mercado-fundamentos",
  "como-leer-el-mercado-sistemas",
  "como-leer-el-mercado-cuantitativo",
  "como-leer-el-mercado-practica-ia",
];

export default function LibrosMercadoBanner() {
  const libros = IDS.map((id) => LIBROS.find((l) => l.id === id)).filter(Boolean);
  const disponibles = libros.filter((l) => l.paginas > 0);
  const precio = libros[0]?.precio;

  return (
    <Link href="/recursos/como-leer-el-mercado" className="libros-mercado-banner">
      <span className="libros-mercado-banner-eyebrow">Cómo leer el mercado</span>
      <p className="libros-mercado-banner-titulo">
        90 días para construir tu propio sistema de inversión
      </p>

      <span className="lmb-libros" aria-hidden="true">
        {libros.map((l, i) => {
          const listo = l.paginas > 0;
          return (
            <span key={l.id} className={`lmb-libro${listo ? "" : " lmb-libro--pronto"}`}>
              <img src={l.imagenPortada} alt="" loading="lazy" />
              <span className="lmb-libro-etq">{listo ? `Libro ${i + 1}` : "Pronto"}</span>
            </span>
          );
        })}
      </span>

      <ul className="lmb-lista">
        <li>
          <strong>13 semanas por libro:</strong> lección diaria, ejercicios con respuesta y diario de
          práctica.
        </li>
        <li>
          <strong>Libro 1 · Fundamentos:</strong> parte de cero, de precios e inflación a valuación,
          riesgo y psicología de la decisión.
        </li>
        <li>
          <strong>Libro 2 · Sistemas:</strong> backtesting honesto y laboratorios en hoja de cálculo.
        </li>
        <li>
          <strong>Paper trading:</strong> dinero ficticio, nunca una recomendación de compra o venta.
        </li>
      </ul>

      <p className="lmb-resultado">
        Terminas con un Plan base propio: reglas con números, tabla de caída de 30% y registro de
        práctica.
      </p>

      <p className="lmb-precio">
        <strong>${precio} MXN cada libro.</strong>{" "}
        {disponibles.length === libros.length
          ? "Los 4 disponibles."
          : `Hoy disponibles: ${disponibles.length === 2 ? "Libros 1 y 2" : `${disponibles.length} de ${libros.length}`}; el resto, en preparación.`}
      </p>

      <span className="libros-mercado-banner-cta">Ver la colección →</span>
    </Link>
  );
}
