import { SITE_URL } from "@/lib/site";

/* Genera https://TU-SITIO/robots.txt
   Permite que Google rastree todo y le señala el sitemap. */
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
