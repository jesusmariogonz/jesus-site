/* Genera public/cv/cv.pdf desde scripts/cv/cv.html (fuente editable del CV).
   Uso: node scripts/cv/build-cv.mjs   (requiere playwright + chromium)
   El QR (scripts/cv/qr.svg) apunta a https://jgonzalez.app/sobre-mi. */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const req = createRequire(import.meta.url);
let pw;
try { pw = req("playwright"); } catch { pw = createRequire(join(execSync("npm root -g").toString().trim(), "x"))("playwright"); }
const { chromium } = pw;
const dir = dirname(fileURLToPath(import.meta.url));
const qr = readFileSync(join(dir, "qr.svg"), "utf8").replace(/<\?xml[^>]*\?>/, "").replace(/width="[^"]*" height="[^"]*"/, 'preserveAspectRatio="xMidYMid meet"');
const html = readFileSync(join(dir, "cv.html"), "utf8").replace("{{QR}}", qr.replace("<path ", '<path fill="#101626" '));
const tmp = join(dir, ".cv.render.html");
writeFileSync(tmp, html);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1254, height: 1600 } });
await page.goto("file://" + tmp, { waitUntil: "networkidle" });
const h = await page.evaluate(() => document.documentElement.scrollHeight);
await page.pdf({ path: join(dir, "../../public/cv/cv.pdf"), width: "1254px", height: `${h}px`, printBackground: true, pageRanges: "1" });
await browser.close();
console.log("OK cv.pdf, alto", h, "px");
