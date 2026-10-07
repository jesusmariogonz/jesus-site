import { getPostsListado } from "@/lib/posts";
import { calcularMinutos } from "@/lib/lectura";

import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import PulsoMercadoMini from "@/components/PulsoMercadoMini";
import NotasDestacadas from "@/components/NotasDestacadas";
import CtaContacto from "@/components/CtaContacto";
import NewsletterForm from "@/components/NewsletterForm";
import Reveal from "@/components/Reveal";
import Link from "next/link";

export default function Inicio() {
  const ultimos = getPostsListado()
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      titulo: p.titulo ?? p.title ?? "Sin título",
      resumen: p.resumen ?? p.summary ?? p.description ?? p.excerpt ?? "",
      fecha: p.fecha ?? p.date ?? null,
      imagen: p.imagen ?? null,
      categoria:
        p.categoria ??
        p.category ??
        (Array.isArray(p.tags) ? p.tags[0] : p.tags) ??
        "Nota",
      minutos:
        p.minutos ??
        (typeof p.content === "string" ? calcularMinutos(p.content) : null),
    }));

  return (
    <>
      <Hero />
      <Reveal delay={0.05}>
        <FeaturedProjects />
      </Reveal>
      <Reveal>
        <section className="jx-wrap jx-toolkit-home">
          <p className="jx-toolkit-home-texto">
            <strong>Aprende con lo que uso en proyectos reales.</strong> 22
            consultas SQL de retail ya resueltas y un curso de Power BI desde
            cero. Descarga inmediata, pago único.{" "}
            <Link href="/the-toolkit">Ver Toolkit →</Link>
          </p>
        </section>
      </Reveal>
      <NotasDestacadas notas={ultimos} />
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
