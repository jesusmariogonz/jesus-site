import { getPostsListadoLite } from "@/lib/posts";

import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import PulsoMercadoMini from "@/components/PulsoMercadoMini";
import IdeasCarrusel from "@/components/IdeasCarrusel";
import StatsStrip from "@/components/StatsStrip";
import BibliotecaMini from "@/components/BibliotecaMini";
import ToolkitMini from "@/components/ToolkitMini";
import CtaContacto from "@/components/CtaContacto";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";

export default function Inicio() {
  // Carrusel "Lo más reciente": las 5 notas más nuevas (mismos datos que /blog).
  const recientes = getPostsListadoLite().slice(0, 5);

  return (
    <>
      <Hero />
      <Reveal>
        <StatsStrip />
      </Reveal>
      <Reveal delay={0.05}>
        <FeaturedProjects />
      </Reveal>
      <Reveal>
        <ToolkitMini />
      </Reveal>
      <Reveal>
        <BibliotecaMini />
      </Reveal>
      <IdeasCarrusel notas={recientes} />
      <PulsoMercadoMini />
      <Reveal>
        <section className="jx-wrap jx-newsletter-home">
          <NewsletterForm
            titulo="Recibe las notas nuevas por correo"
            desc="Sin spam: solo aviso cuando publico una nota nueva. Cancela cuando quieras."
          />
        </section>
      </Reveal>
      <Reveal>
        <CtaContacto />
      </Reveal>
    </>
  );
}
