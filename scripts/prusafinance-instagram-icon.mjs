/**
 * Instagram footer icon — stroke camera glyph (readable at 16px).
 * Run: node scripts/prusafinance-instagram-icon.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const webRoot = path.join(root, "finance", "Web");

const IG_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle class="pf-ig-dot" cx="17.5" cy="6.5" r="1.25"/></svg>`;

const IG_CSS = `.foot-soc-icon.soc-ig svg,.fsi.soc-ig svg{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.foot-soc-icon.soc-ig svg .pf-ig-dot,.fsi.soc-ig svg .pf-ig-dot{fill:#fff;stroke:none}`;

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

function patch(html) {
  let s = html;
  if (s.includes(".soc-ig{") && !s.includes("pf-ig-dot")) {
    s = s.replace(/(\.soc-ig\{[^}]+\})/, `$1\n${IG_CSS}`);
  }
  s = s.replace(
    /(<div class="foot-soc-icon soc-ig">)\s*<svg[\s\S]*?<\/svg>/g,
    `$1${IG_SVG}`,
  );
  s = s.replace(/(<div class="fsi soc-ig">)\s*<svg[\s\S]*?<\/svg>/g, `$1${IG_SVG}`);
  return s;
}

let n = 0;
for (const file of walkHtml(webRoot)) {
  const before = fs.readFileSync(file, "utf8");
  const after = patch(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    n++;
  }
}
console.log(`prusafinance-instagram-icon: updated ${n} file(s)`);
