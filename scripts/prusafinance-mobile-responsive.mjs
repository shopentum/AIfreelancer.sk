/**
 * Injects mobile nav (hamburger + mob-menu) and responsive grid/table rules
 * for Průša Finance static HTML. Idempotent (marker: pf-mob).
 *
 * Run after sync + prefix on public/prusafinance, and on finance/Web sources
 * so the next sync keeps the markup.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const SOURCE_FILES = [
  "finance/Web/prusafinance_9.html",
  "finance/Web/Podstranky/vlastni-domov_7.html",
  "finance/Web/Podstranky/ochrana_8.html",
  "finance/Web/Podstranky/budoucnost_6.html",
  "finance/Web/Podstranky/zivotni-sen_2.html",
  "finance/Web/Ostatni/blog_2.html",
  "finance/Web/Ostatni/hypoteka-2025_1.html",
  "finance/Web/Ostatni/gdpr_1.html",
  "finance/Web/Ostatni/obchodni-podminky_1.html",
  "finance/Web/Landing page/stahnout-pruvodce.html",
  "finance/Web/Landing page/ppc-bezurocne-uvery.html",
  "finance/Web/Landing page/ppc-refinancovani.html",
  "finance/Web/Landing page/ppc-pojisteni-osvc.html",
  "finance/Web/Landing page/ppc-modernizace-bydleni.html",
  "finance/Web/Landing page/ppc-raiffeisen-ucet.html",
];

const MOB_MARKER = "/* pf-mob */";

const MOB_CSS = `
${MOB_MARKER}
.hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;padding:4px;cursor:pointer;margin-left:4px;flex-shrink:0}
.hamburger span{display:block;width:22px;height:1.5px;background:var(--bl);border-radius:1px;transition:all .3s}
.mob-menu{display:none;position:fixed;inset:64px 0 0;background:var(--w);z-index:150;overflow-y:auto;padding:16px var(--pad) 32px;border-top:1px solid var(--gl)}
.mob-menu.open{display:block}
.mob-section{margin-bottom:8px}
.mob-section-label{font-size:10px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#bbb;padding:12px 4px 6px}
.mob-link{display:flex;align-items:center;gap:14px;padding:13px 4px;font-size:15px;font-weight:500;color:var(--bl);border-bottom:1px solid var(--gl);text-decoration:none}
.mob-link:last-child{border-bottom:none}
.m-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0}
.mob-cta{display:block;width:100%;margin-top:20px;padding:15px;background:var(--y);color:var(--bl);font-size:14px;font-weight:600;border:none;border-radius:100px;text-align:center;cursor:pointer}
body.mob-open{overflow:hidden}
/* pf-mob-grid */
@media(max-width:900px){
  .hamburger{display:flex}
  .nav-cta{display:none}
  div[style*="grid-template-columns:1fr 400px"],
  div[style*="grid-template-columns:1fr 420px"]{grid-template-columns:1fr !important;gap:28px !important}
  div[style*="grid-template-columns:repeat(4,1fr);gap:0"]{grid-template-columns:repeat(2,1fr) !important}
  div[style*="grid-template-columns:repeat(4,1fr)"][style*="gap:16px"]{grid-template-columns:1fr !important}
  div[style*="grid-template-columns:repeat(3,1fr)"][style*="gap:0"]{grid-template-columns:1fr !important}
  div[style*="grid-template-columns:repeat(3,1fr)"][style*="gap:16px"]{grid-template-columns:1fr !important}
  div[style*="grid-template-columns:repeat(3,1fr)"][style*="gap:20px"]{grid-template-columns:1fr !important}
  .pain-grid,.myths,.products-grid,.sav-grid,.uver-inner,.steps{grid-template-columns:1fr !important}
  div[style*="grid-template-columns:360px 1fr"]{grid-template-columns:1fr !important;gap:32px !important}
  div[style*="grid-template-columns:1fr 1fr"][style*="gap:64px"]{grid-template-columns:1fr !important;gap:32px !important}
  div[style*="grid-template-columns:1fr 1fr"][style*="gap:20px"]{grid-template-columns:1fr !important}
  a[style*="grid-template-columns:1fr 1fr"][style*="border-radius:16px"]{grid-template-columns:1fr !important}
  div[style*="display:grid;grid-template-columns:1fr 1fr"]:not(.fng){grid-template-columns:1fr !important}
  .comp{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .comp-head,.comp-row{min-width:560px}
}
`;

const MOB_MENU_HTML = `<!-- pf-mob-menu -->
<div class="mob-menu" id="mob">
  <div class="mob-section">
    <div class="mob-section-label">Cíle</div>
    <a class="mob-link" href="vlastni-domov.html" onclick="closeMob()"><div class="m-icon" style="background:#EFF6FF">🏠</div> Vlastní domov</a>
    <a class="mob-link" href="ochrana.html" onclick="closeMob()"><div class="m-icon" style="background:#FFF7ED">🛡️</div> Ochrana Vás a rodiny</a>
    <a class="mob-link" href="budoucnost.html" onclick="closeMob()"><div class="m-icon" style="background:#F0FDF4">💰</div> Klidná budoucnost</a>
    <a class="mob-link" href="zivotni-sen.html" onclick="closeMob()"><div class="m-icon" style="background:#FFFBE5">✈️</div> Životní sen</a>
  </div>
  <div class="mob-section">
    <div class="mob-section-label">Další</div>
    <a class="mob-link" href="blog.html" onclick="closeMob()"><div class="m-icon" style="background:#F7F7F5">📝</div> Blog</a>
    <a class="mob-link" href="index.html#o-mne" onclick="closeMob()"><div class="m-icon" style="background:#F7F7F5">👤</div> O mně</a>
    <a class="mob-link" href="index.html#kontakt" onclick="closeMob()"><div class="m-icon" style="background:#F7F7F5">✉️</div> Kontakt</a>
  </div>
  __MOB_CTA__
</div>`;

const HAMBURGER_HTML = `<button class="hamburger" id="ham" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>`;

const MOB_JS = `<script>
/* pf-mob */
function closeMob(){var m=document.getElementById('mob');if(m)m.classList.remove('open');document.body.classList.remove('mob-open');var h=document.getElementById('ham');if(h)h.classList.remove('open')}
(function(){var ham=document.getElementById('ham'),mob=document.getElementById('mob');if(!ham||!mob)return;ham.addEventListener('click',function(){var o=mob.classList.toggle('open');document.body.classList.toggle('mob-open',o);ham.classList.toggle('open',o)})})();
</script>`;

/** @param {string} html */
function mobCtaButton(html) {
  if (/s\(['"]kontakt-sec['"]\)/.test(html)) {
    return `<button class="mob-cta" type="button" onclick="s('kontakt-sec');closeMob()">☕ Domluvit konzultaci →</button>`;
  }
  if (/getElementById\(['"]cta-sec['"]\)/.test(html)) {
    return `<button class="mob-cta" type="button" onclick="document.getElementById('cta-sec').scrollIntoView({behavior:'smooth'});closeMob()">☕ Domluvit konzultaci →</button>`;
  }
  return `<a class="mob-cta" href="index.html#kontakt" onclick="closeMob()" style="display:block;text-decoration:none">☕ Domluvit konzultaci →</a>`;
}

const MOB_GRID_GAP16_MARKER = 'repeat(3,1fr)"][style*="gap:16px"]';
const MOB_GRID_EXTRA = `  div[style*="grid-template-columns:repeat(3,1fr)"][style*="gap:16px"]{grid-template-columns:1fr !important}
  .pain-grid,.myths,.products-grid,.sav-grid,.uver-inner,.steps{grid-template-columns:1fr !important}`;

/** @param {string} html */
function patchMobGridBlock(html) {
  let s = html;
  s = s.replace(
    /div\[style\*="grid-template-columns:repeat\(4,1fr\)"\]\[style\*="gap:16px"\]\{grid-template-columns:1fr 1fr !important\}/g,
    'div[style*="grid-template-columns:repeat(4,1fr)"][style*="gap:16px"]{grid-template-columns:1fr !important}',
  );
  if (s.includes("/* pf-mob-grid */") && !s.includes(MOB_GRID_GAP16_MARKER)) {
    s = s.replace(
      /(\/\* pf-mob-grid \*\/\s*@media\(max-width:900px\)\{[\s\S]*?)(  \.comp\{)/,
      `$1${MOB_GRID_EXTRA}\n$2`,
    );
  }
  return s;
}

/** @param {string} html */
export function applyPrusafinanceMobile(html) {
  let s = html;

  if (!s.includes(MOB_MARKER)) {
    s = s.replace("</style>", `${MOB_CSS}\n</style>`);
  }
  s = patchMobGridBlock(s);

  // Dedupe accidental double-injection of nav toggle rules
  s = s.replace(
    /(\s*\.hamburger\{display:flex\}\s*\.nav-cta\{display:none\}){2,}/g,
    "\n  .hamburger{display:flex}\n  .nav-cta{display:none}",
  );
  // Legacy @media: hide desktop nav only; hamburger toggle lives in pf-mob-grid block
  s = s.replace(
    /(@media\(max-width:900px\)\{[^}]*\.nav-links\{display:none\})\s*\.hamburger\{display:flex\}\s*\.nav-cta\{display:none\}/,
    "$1",
  );

  if (s.includes('id="ham"')) {
    return s;
  }
  if (!s.includes('class="nav-links"')) {
    return s;
  }

  if (!s.includes('id="ham"')) {
    s = s.replace(
      /(<button class="nav-cta"[^>]*>[\s\S]*?<\/button>)(\s*<\/div>\s*<\/nav>)/,
      `$1\n    ${HAMBURGER_HTML}$2`,
    );
  }

  if (!s.includes('id="mob"')) {
    const menu = MOB_MENU_HTML.replace("__MOB_CTA__", mobCtaButton(s));
    s = s.replace(/<\/nav>/, `</nav>\n\n${menu}`);
  }

  if (!s.includes("/* pf-mob */\nfunction closeMob")) {
    s = s.replace("</body>", `${MOB_JS}\n</body>`);
  }

  return s;
}

/** @param {string} filePath */
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`skip (missing): ${path.relative(root, filePath)}`);
    return false;
  }
  const before = fs.readFileSync(filePath, "utf8");
  const after = applyPrusafinanceMobile(before);
  if (after !== before) {
    fs.writeFileSync(filePath, after, "utf8");
    console.log(`patched: ${path.relative(root, filePath)}`);
    return true;
  }
  return false;
}

function main() {
  const publicDir = path.join(root, "public", "prusafinance");
  let n = 0;

  for (const rel of SOURCE_FILES) {
    if (processFile(path.join(root, rel))) n++;
  }

  if (fs.existsSync(publicDir)) {
    for (const name of fs.readdirSync(publicDir)) {
      if (!name.endsWith(".html")) continue;
      if (processFile(path.join(publicDir, name))) n++;
    }
  }

  console.log(`prusafinance-mobile: ${n} file(s) updated`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
