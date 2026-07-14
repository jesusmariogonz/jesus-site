import "./globals.css";
import "./inicio.css";
import Header from "@/components/Header";

export const metadata = {
  metadataBase: new URL("https://jesus-site-silk.vercel.app"),
  title: {
    default: "Jesús — Datos & Analítica",
    template: "%s · Jesús — Datos & Analítica",
  },
  description:
    "Notas sobre ingeniería de datos, Snowflake, arquitectura, IA y retail desde Saltillo, México.",
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
    url: "https://jesus-site-silk.vercel.app",
    siteName: "Jesús — Datos & Analítica",
    title: "Jesús — Datos & Analítica",
    description:
      "Notas sobre ingeniería de datos, Snowflake, arquitectura, IA y retail desde Saltillo, México.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="dot-grid">
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
      </body>
    </html>
  );
}
