import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

/* Web App Manifest: mejora la instalación en móvil y la ficha del sitio. */
export default function manifest() {
  return {
    name: SITE_NAME,
    short_name: "Jesús G.",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1220",
    theme_color: "#1c48c9",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
