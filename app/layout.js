import Script from "next/script";
import "./globals.css";
import "./inicio.css";
import Header from "@/components/Header";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  AUTHOR,
  GOOGLE_SITE_VERIFICATION,
} from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Jesús Mario González Siller — Datos, Analítica & IA",
    template: "%s · Jesús González — Datos & Analítica",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Jesús Mario González Siller",
    "Jesús González datos",
    "Chuy González",
    "arquitecto de datos",
    "Snowflake",
    "Databricks",
    "ingeniería de datos",
    "IA generativa",
    "analítica retail",
    "FEMSA datos",
    "Saltillo",
  ],
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  ...(GOOGLE_SITE_VERIFICATION
    ? { verification: { google: GOOGLE_SITE_VERIFICATION } }
    : {}),
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Jesús Mario González Siller — Datos, Analítica & IA",
    description: SITE_DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

// Datos estructurados de identidad: quién es Jesús (Person) y el sitio
// (WebSite). Es lo que ayuda a que, al buscar tu nombre, Google muestre
// tu sitio como tu resultado de identidad.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: AUTHOR.name,
  alternateName: AUTHOR.alternateName,
  jobTitle: AUTHOR.jobTitle,
  url: SITE_URL,
  image: AUTHOR.image,
  email: `mailto:${AUTHOR.email}`,
  worksFor: { "@type": "Organization", name: AUTHOR.worksFor },
  address: {
    "@type": "PostalAddress",
    addressLocality: AUTHOR.locality,
    addressRegion: AUTHOR.region,
    addressCountry: "MX",
  },
  knowsAbout: AUTHOR.knowsAbout,
  sameAs: AUTHOR.sameAs,
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "es-MX",
  author: { "@type": "Person", name: AUTHOR.name },
};

// Anti-flash: aplica el tema guardado ANTES de pintar
const temaScript = `
try {
  const t = localStorage.getItem('tema');
  const dark = t ? t === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.classList.toggle('dark', dark);
} catch (_) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: temaScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dot-grid">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <span className="sql-meta">
              © {new Date().getFullYear()} · hecho con Next.js · desplegado en
              Vercel
            </span>
          </div>
        </footer>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
