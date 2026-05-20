import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PDF_NAME = "financni-gramotnost.pdf";
const PDF_LEGACY = "financni-gramotnost-prusa.pdf";

function patchIndex(html) {
  let s = html;
  s = s.replace(/href="#blog"/g, 'href="blog.html"');
  s = s.replace(
    /\s*<div class="copt prim">[\s\S]*?Calendly →<\/div><\/div><\/div>\s*/,
    "\n",
  );
  s = s.replace(
    /<div class="copts">\n<div class="copt">/,
    '<div class="copts">\n        <div class="copt">',
  );
  return s;
}

function patchPdfRefs(html) {
  return html.replace(
    new RegExp(PDF_LEGACY.replace(".", "\\."), "g"),
    PDF_NAME,
  );
}

function patchZjistit(html) {
  return html
    .replace(/Zjistit,/g, "Zjistěte,")
    .replace(/Zjistit /g, "Zjistěte ")
    .replace(/Zjistit víc/g, "Zjistěte víc");
}

const indexPath = path.join(root, "finance/Web/prusafinance_9.html");
let index = fs.readFileSync(indexPath, "utf8");
index = patchIndex(index);
fs.writeFileSync(indexPath, index);

for (const rel of [
  "finance/Web/Landing page/stahnout-pruvodce.html",
  "finance/Web/Ostatni/dekujeme.html",
]) {
  const f = path.join(root, rel);
  if (fs.existsSync(f)) fs.writeFileSync(f, patchPdfRefs(fs.readFileSync(f, "utf8")));
}

for (const rel of [
  "finance/Web/Podstranky/zivotni-sen_2.html",
  "finance/Web/Landing page/ppc-modernizace-bydleni.html",
]) {
  const f = path.join(root, rel);
  if (fs.existsSync(f)) fs.writeFileSync(f, patchZjistit(fs.readFileSync(f, "utf8")));
}

console.log("prusafinance-client-tweaks: done");
