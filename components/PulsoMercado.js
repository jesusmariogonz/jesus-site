import Link from "next/link";
import { formatFechaCorta } from "@/lib/posts";

/* ============================================================
   Pulso de Mercado
   ------------------------------------------------------------
   Franja fija con las 4 notas vigentes del sistema de inteligencia
   de mercados: Daily, Weekly Review, Weekly Outlook y Monthly
   Review. Siempre muestra como máximo una tarjeta por tipo (la más
   reciente) — así nunca se acumulan "mil" notas de mercados en el
   listado del blog.
   ============================================================ */

const TIPOS = [
  { key: "daily", etiqueta: "Daily", desc: "Qué pasó hoy" },
  { key: "weeklyReview", etiqueta: "Weekly Review", desc: "Cierre de semana" },
  { key: "weeklyOutlook", etiqueta: "Weekly Outlook", desc: "Apertura de semana" },
  { key: "monthly", etiqueta: "Monthly Review", desc: "Cierre de mes" },
];

function TarjetaPulso({ tipo, nota }) {
  if (!nota) {
    return (
      <div className="pulso-card pulso-card-vacia">
        <span className="pulso-card-tipo">{tipo.etiqueta}</span>
        <span className="pulso-card-vacia-texto">Próximamente</span>
      </div>
    );
  }
  return (
    <Link href={`/blog/${nota.slug}`} className="pulso-card">
      <span className="pulso-card-tipo">{tipo.etiqueta}</span>
      <h3>{nota.titulo}</h3>
      <span className="pulso-card-fecha">{formatFechaCorta(nota.fecha)}</span>
    </Link>
  );
}

export default function PulsoMercado({ pulso }) {
  return (
    <section className="pulso-mercado">
      <div className="pulso-mercado-head">
        <span className="pulso-mercado-kicker">MARKET PULSE</span>
        <h2>Pulso de mercado</h2>
        <p className="pulso-mercado-tagline">
          Qué pasó. Qué cambió. Qué importa.
        </p>
      </div>
      <div className="pulso-mercado-grid">
        {TIPOS.map((t) => (
          <TarjetaPulso key={t.key} tipo={t} nota={pulso?.[t.key]} />
        ))}
      </div>
    </section>
  );
}
