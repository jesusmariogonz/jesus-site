import Link from "next/link";

/* ── Propuesta 5: cierre con intención ─────────────────────────── */

export default function CtaContacto() {
  return (
    <section className="mx-auto mt-20 max-w-4xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-800/80 to-slate-900 px-8 py-12 text-center">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
        <p className="signature relative text-4xl text-slate-200">
          ¿Platicamos?
        </p>
        <p className="relative mx-auto mt-3 max-w-md text-sm text-slate-400">
          Si trabajas en datos, retail o loyalty y algo de lo que escribo te
          hizo ruido, me da gusto cruzar notas.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contacto"
            className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            Escríbeme
          </Link>
          <Link
            href="/blog"
            className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
          >
            Lee el blog
          </Link>
        </div>
      </div>
    </section>
  );
}
