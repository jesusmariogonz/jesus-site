"use client";

/* ============================================================
   PostHog — analítica de eventos (embudos, segmentación, qué
   convierte), a diferencia de Vercel Analytics que solo cuenta
   vistas por página.
   ------------------------------------------------------------
   Necesita NEXT_PUBLIC_POSTHOG_KEY (y opcionalmente
   NEXT_PUBLIC_POSTHOG_HOST, default el cloud de EU) en Vercel. Si
   falta la key, no se inicializa nada — no truena el sitio.

   App Router no dispara pageviews solos (es un SPA del lado del
   cliente): se capturan a mano en cada cambio de ruta.
   ============================================================ */

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

let inicializado = false;

function iniciar() {
  if (inicializado || !KEY) return;
  posthog.init(KEY, {
    api_host: HOST,
    // Las vistas se capturan a mano (ver PageviewTracker) porque
    // App Router navega sin recargar la página.
    capture_pageview: false,
    capture_pageleave: true,
    person_profiles: "identified_only",
  });
  inicializado = true;
}

function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!KEY) return;
    let url = pathname;
    const qs = searchParams?.toString();
    if (qs) url += `?${qs}`;
    posthog.capture("$pageview", { $current_url: window.location.origin + url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider() {
  useEffect(() => {
    iniciar();
  }, []);

  if (!KEY) return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}

/** Helper para mandar eventos propios desde cualquier componente
 *  cliente, ej: trackEvent("toolkit_cta_click", { ubicacion: "header" }).
 *  No hace nada si PostHog no está configurado. */
export function trackEvent(nombre, propiedades = {}) {
  if (!KEY || !inicializado) return;
  posthog.capture(nombre, propiedades);
}
