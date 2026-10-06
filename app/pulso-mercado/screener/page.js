import Link from "next/link";
import MercadosScreener from "@/components/MercadosScreener";
import { absUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Screener de mercados",
  description:
    "Filtra el universo de las Magníficas 7 y la BMV por precio, retorno, volatilidad y Sharpe, con datos reales de Finnhub y Yahoo Finance.",
  alternates: { canonical: "/pulso-mercado/screener" },
  openGraph: {
    type: "website",
    url: absUrl("/pulso-mercado/screener"),
    title: "Screener de mercados — Pulso de Mercado",
  },
};

export default function ScreenerPage() {
  return (
    <section className="section">
      <div className="container pulsodash">
        <p style={{ marginBottom: 8 }}>
          <Link href="/pulso-mercado">← Pulso de Mercado</Link>
        </p>
        <header className="pulsodash-hero">
          <span className="pulsodash-eyebrow">Screener</span>
          <h1>Magníficas 7 y BMV, con datos reales</h1>
          <p className="pulsodash-tagline">
            Precio, retorno, volatilidad y Sharpe calculados a partir de velas diarias reales —
            sin predicciones, sin cifras inventadas donde no hay datos.
          </p>
        </header>

        <MercadosScreener />
      </div>
    </section>
  );
}
