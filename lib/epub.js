import JSZip from "jszip";
import { absUrl } from "@/lib/site";

/* ============================================================
   Generador mínimo de EPUB (para el envío a Kindle)
   ------------------------------------------------------------
   "Send to Kindle" por correo acepta EPUB como formato de entrada
   y lo convierte del lado de Amazon. A diferencia del HTML plano
   (que antes se mandaba como adjunto), aquí las imágenes se
   DESCARGAN y se EMPAQUETAN dentro del .epub como archivos binarios
   reales — no como <img src="https://..."> remoto. Eso es lo que
   evita que las imágenes aparezcan rotas o ausentes: el conversor
   de Amazon no siempre trae imágenes remotas de forma confiable,
   pero un archivo ya embebido en el paquete siempre se muestra.
   ============================================================ */

function extensionDeContentType(contentType, url) {
  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("jpeg") || contentType?.includes("jpg")) return "jpg";
  if (contentType?.includes("gif")) return "gif";
  if (contentType?.includes("webp")) return "webp";
  const m = url.match(/\.(png|jpe?g|gif|webp)(\?|$)/i);
  if (m) return m[1].toLowerCase().replace("jpeg", "jpg");
  return "jpg";
}

function escapeXml(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mediaTypeDeExtension(ext) {
  return { png: "image/png", jpg: "image/jpeg", gif: "image/gif", webp: "image/webp" }[ext] || "image/jpeg";
}

/** Descarga cada <img src="..."> del HTML, lo agrega al zip del EPUB como
 *  binario, y reescribe el HTML para que apunte al archivo local embebido.
 *  Las URLs relativas (empiezan con "/") se resuelven contra el sitio. */
async function embeberImagenes(html, oebps) {
  const srcs = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/g)].map((m) => m[1]);
  const unicos = [...new Set(srcs)];
  const mapa = new Map();

  let n = 0;
  for (const src of unicos) {
    const url = src.startsWith("http") ? src : absUrl(src);
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const ext = extensionDeContentType(res.headers.get("content-type"), url);
      n += 1;
      const nombre = `images/img${n}.${ext}`;
      oebps.file(nombre, buf);
      mapa.set(src, { nombre, mediaType: mediaTypeDeExtension(ext) });
    } catch {
      // Si una imagen no se puede descargar, se omite en vez de romper
      // todo el envío — mejor un epub sin esa imagen que ningún epub.
    }
  }

  const htmlConImagenesLocales = html.replace(
    /<img([^>]*)\ssrc="([^"]+)"([^>]*)>/g,
    (full, antes, src, despues) => {
      const entry = mapa.get(src);
      if (!entry) return ""; // imagen que no se pudo descargar: se quita
      return `<img${antes} src="${entry.nombre}"${despues}>`;
    }
  );

  return { html: htmlConImagenesLocales, imagenes: [...mapa.values()] };
}

/** Construye un .epub válido (EPUB 3) a partir de un bloque de HTML ya
 *  armado (el mismo que antes se mandaba como adjunto .html) y devuelve
 *  un Buffer listo para adjuntar al correo. */
export async function buildEpubBuffer({ titulo, autor = "jgonzalez.app", html, lang = "es" }) {
  const zip = new JSZip();
  const tituloXml = escapeXml(titulo);
  const autorXml = escapeXml(autor);

  // El mimetype va SIN comprimir y debe ser el primer archivo del zip —
  // es lo que hace que un lector reconozca el paquete como EPUB.
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  const oebps = zip.folder("OEBPS");
  const { html: htmlFinal, imagenes } = await embeberImagenes(html, oebps);

  const uid = `urn:uuid:jx-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const fecha = new Date().toISOString().replace(/\.\d+Z$/, "Z");

  oebps.file(
    "chapter1.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang}" lang="${lang}">
<head>
  <meta charset="utf-8" />
  <title>${tituloXml}</title>
  <link rel="stylesheet" type="text/css" href="style.css" />
</head>
<body>
${htmlFinal}
</body>
</html>`
  );

  oebps.file(
    "style.css",
    `body { font-family: Georgia, "Times New Roman", serif; line-height: 1.55; }
.jx-marca { font-family: Helvetica, Arial, sans-serif; font-weight: bold; font-size: 0.85em; letter-spacing: 0.04em; text-transform: uppercase; color: #1c48c9; }
.jx-meta { font-family: Helvetica, Arial, sans-serif; font-size: 0.85em; letter-spacing: 0.04em; text-transform: uppercase; color: #1c48c9; }
.jx-resumen { font-style: italic; margin: 0 0 1.5em; }
.jx-cover { max-width: 100%; }
figure { margin: 1em 0; text-align: center; }
figure img { max-width: 100%; }
figcaption { font-family: Helvetica, Arial, sans-serif; font-size: 0.8em; color: #555; margin-top: 0.4em; }
blockquote { font-style: italic; margin: 0 0 1em; padding-left: 1em; border-left: 3px solid #1c48c9; }
table { border-collapse: collapse; width: 100%; margin: 0 0 1em; }
th, td { border: 1px solid #ccc; padding: 0.3em 0.5em; text-align: left; }
.jx-footer { margin-top: 2em; padding-top: 1em; border-top: 1px solid #ccc; font-family: Helvetica, Arial, sans-serif; font-size: 0.8em; }`
  );

  oebps.file(
    "nav.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}" lang="${lang}">
<head><meta charset="utf-8" /><title>Índice</title></head>
<body>
  <nav epub:type="toc" id="toc">
    <ol><li><a href="chapter1.xhtml">${tituloXml}</a></li></ol>
  </nav>
</body>
</html>`
  );

  const manifestImagenes = imagenes
    .map(
      (img, idx) =>
        `<item id="img${idx}" href="${img.nombre}" media-type="${img.mediaType}" />`
    )
    .join("\n    ");

  oebps.file(
    "content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookId">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookId">${uid}</dc:identifier>
    <dc:title>${tituloXml}</dc:title>
    <dc:creator>${autorXml}</dc:creator>
    <dc:language>${lang}</dc:language>
    <meta property="dcterms:modified">${fecha}</meta>
  </metadata>
  <manifest>
    <item id="chapter1" href="chapter1.xhtml" media-type="application/xhtml+xml" />
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="style" href="style.css" media-type="text/css" />
    ${manifestImagenes}
  </manifest>
  <spine>
    <itemref idref="chapter1" />
  </spine>
</package>`
  );

  return zip.generateAsync({ type: "nodebuffer", mimeType: "application/epub+zip" });
}
