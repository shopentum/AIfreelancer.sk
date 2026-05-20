/**
 * Blog page fixes: Kdo jsem layout + badge, Z naší praxe 6 articles (2×3), Čím vám mohu pomoci.
 * Run after sync copies blog_2.html → public/prusafinance/blog.html
 */
import {execSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const blogPath = path.join(root, "finance", "Web", "Ostatni", "blog_2.html");
const docsBlogPath = path.join(root, "docs", "prusa-finance-texty", "Ostatni", "blog_2.html");
const indexPath = path.join(root, "finance", "Web", "prusafinance_9.html");

const PHOTO_BADGE = `<div style="position:absolute;bottom:18px;left:16px;right:16px;background:rgba(255,255,255,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.35);border-radius:11px;padding:13px 16px;z-index:2">
          <div style="font-family:'DM Serif Display',Georgia,serif;font-size:16px;color:#0C0C0C;margin-bottom:3px">Mgr. Martin Průša</div>
          <div style="font-size:10.5px;color:#6B6B6B;font-weight:400">Komplexní poradce · <strong style="color:#C9951A;font-weight:500">Certifikace ČNB</strong></div>
        </div>`;

const BLOG_MOBILE_CSS = `
/* pf-blog-fix */
@media(max-width:900px){
  .pf-blog-about{display:grid !important;grid-template-columns:1fr !important;gap:36px !important}
  .pf-blog-praxe-grid{grid-template-columns:1fr !important}
  .pf-blog-cim-grid{grid-template-columns:repeat(2,1fr) !important}
}
@media(max-width:560px){
  .pf-blog-cim-grid{grid-template-columns:1fr !important}
}`;

/** @param {string} html */
function extractCimSection(html) {
  const start = html.indexOf("<!-- Čím mohu pomoci — 4 oblasti -->");
  if (start < 0) return null;
  const end = html.indexOf("<!-- CTA + REZERVACE", start);
  if (end < 0) return null;
  return html.slice(start, end).trim();
}

/** @param {string} html @param {number} n */
function extractStoryImgs(html, n = 6) {
  const out = [];
  const re = /<div class="story-img"><img src="(data:image\/jpeg;base64,[^"]+)"/g;
  let m;
  while ((m = re.exec(html)) && out.length < n) out.push(m[1]);
  return out;
}

/** @param {string[]} imgs */
function buildPraxeGallery(imgs) {
  const cells = imgs
    .map(
      (src, i) =>
        `<div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 8px 28px rgba(0,0,0,.08)"><img src="${src}" alt="Martin Průša — praxe ${i + 1}" style="width:100%;height:100%;object-fit:cover;display:block"></div>`,
    )
    .join("\n      ");
  return `<!-- Fotky z úvodní stránky (klient) -->
<section style="padding:48px var(--pad);background:var(--w);border-top:1px solid var(--gl)">
  <div style="max-width:var(--max);margin:0 auto">
    <div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--yd);margin-bottom:20px;display:flex;align-items:center;gap:8px">Z naší praxe<span style="width:16px;height:2px;background:var(--yd);display:block"></span></div>
    <div class="pf-blog-praxe-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
      ${cells}
    </div>
  </div>
</section>`;
}

const CARD_LINK_STYLE =
  'style="text-decoration:none;color:inherit;display:flex;flex-direction:column;border-radius:14px;overflow:hidden;border:1px solid var(--gl);background:#fff;transition:all .25s" onmouseover="this.style.transform=\'translateY(-4px)\';this.style.boxShadow=\'0 12px 32px rgba(0,0,0,.09)\'" onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'"';

/** @param {string} chunk */
function extractArticleCards(chunk) {
  const cards = [];
  const re =
    /<a href="([^"]+\.html)"[^>]*style="[^"]*display:flex;flex-direction:column[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = re.exec(chunk))) {
    if (
      m[2].includes("data:image") ||
      m[2].includes("height:130px") ||
      m[2].includes("height:200px")
    ) {
      cards.push({href: m[1], full: m[0]});
    }
  }
  return cards;
}

/** @param {string} full @param {string} href */
function normalizeArticleCard(full, href) {
  let s = full.replace(/href="[^"]+\.html"/, `href="${href}"`);
  s = s.replace(
    /style="text-decoration:none;color:inherit;display:flex;flex-direction:column;flex:1"/,
    CARD_LINK_STYLE,
  );
  s = s.replace(
    /style="text-decoration:none;color:inherit;display:flex;flex-direction:column;border-radius:14px[^"]*"(?:\s+onmouseover="[^"]*"\s+onmouseout="[^"]*")?/,
    CARD_LINK_STYLE,
  );
  return `      ${s}`;
}

/** @param {{href: string, full: string}[]} pool @param {string} href */
function pickCard(pool, href) {
  const c = pool.find((x) => x.href === href);
  if (!c) throw new Error(`[prusafinance-blog-fix] Missing article card: ${href}`);
  return c;
}

/** 6 article cards with original thumbnails (2×3) */
function buildPraxeArticlesGrid() {
  let legacyHtml = "";
  try {
    legacyHtml = execSync("git show 2ac2a96:finance/Web/Ostatni/blog_2.html", {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch {
    legacyHtml = fs.existsSync(docsBlogPath)
      ? fs.readFileSync(docsBlogPath, "utf8")
      : "";
  }

  if (!legacyHtml && fs.existsSync(docsBlogPath)) {
    legacyHtml = fs.readFileSync(docsBlogPath, "utf8");
  }

  const dalsiStart = legacyHtml.indexOf("Další články");
  const dalsiEnd = legacyHtml.indexOf("Fotky z úvodní", dalsiStart);
  const dalsiPool =
    dalsiStart >= 0 && dalsiEnd > dalsiStart
      ? extractArticleCards(legacyHtml.slice(dalsiStart, dalsiEnd))
      : [];

  let carouselPool = [];
  if (fs.existsSync(docsBlogPath)) {
    const docs = fs.readFileSync(docsBlogPath, "utf8");
    const carStart = docs.indexOf("STARŠÍ ČLÁNKY");
    if (carStart >= 0) {
      let carEnd = docs.indexOf("Další články", carStart);
      if (carEnd < 0) carEnd = docs.indexOf("<!-- KDO JSEM", carStart);
      if (carEnd < 0) carEnd = docs.indexOf("Čím vám mohu pomoci", carStart);
      if (carEnd < 0) carEnd = docs.length;
      carouselPool = extractArticleCards(docs.slice(carStart, carEnd));
    }
  }

  const order = [
    {source: "dalsi", href: "hypoteka-2025.html"},
    {source: "dalsi", href: "clanek-pojisteni.html"},
    {source: "dalsi", href: "clanek-sporeni.html"},
    {source: "carousel", href: "penzijni-sporeni-generali.html", link: "hypoteka-2025.html"},
    {source: "carousel", href: "sen-bali.html", link: "zivotni-sen.html"},
    {source: "carousel", href: "vlastni-bydleni-bez-uspor.html", link: "vlastni-domov.html"},
  ];

  const cells = order
    .map((item) => {
      const pool = item.source === "dalsi" ? dalsiPool : carouselPool;
      const card = pickCard(pool, item.href);
      return normalizeArticleCard(card.full, item.link || item.href);
    })
    .join("\n");

  return `<!-- Z naší praxe — 6 článků -->
<section style="padding:56px var(--pad);background:var(--w);border-top:1px solid var(--gl)">
  <div style="max-width:var(--max);margin:0 auto">
    <div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--yd);margin-bottom:20px;display:flex;align-items:center;gap:8px">Z naší praxe<span style="width:16px;height:2px;background:var(--yd);display:block"></span></div>
    <div class="pf-blog-praxe-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">
${cells}
    </div>
  </div>
</section>`;
}

const BADGE_MARKER =
  "position:absolute;bottom:18px;left:16px;right:16px;background:rgba(255,255,255,.92)";

/** @param {string} html */
function fixKdoJsem(html) {
  let s = html;

  s = s.replace(
    /<div style="display:grid;grid-template-columns:360px 1fr;gap:64px;align-items:center;margin-bottom:64px">/,
    '<div class="pf-blog-about" style="display:grid;grid-template-columns:minmax(280px,360px) 1fr;gap:64px;align-items:center;margin-bottom:64px">',
  );

  if (!s.includes(BADGE_MARKER)) {
    const portraitRe =
      /(<div style="position:relative;border-radius:18px;overflow:hidden;aspect-ratio:4\/5;box-shadow:0 20px 52px rgba\(0,0,0,\.15\)">\s*)<img([^>]+)>\s*(?:<div style="font-family:[\s\S]*?<\/div>\s*){0,3}(?:<\/div>\s*)*/;
    s = s.replace(
      portraitRe,
      `$1<img$2>\n        ${PHOTO_BADGE}\n      </div>\n      `,
    );
  }

  // Stray closing div or duplicate badge breaks the 2-column grid
  s = s.replace(
    /(<\/div>\s*<\/div>\s*)<div style="position:absolute;bottom:18px[\s\S]*?<\/div>\s*<\/div>\s*(?=<div>\s*<div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C9951A;margin-bottom:12px[^>]*>Kdo jsem)/,
    "$1",
  );
  s = s.replace(
    /(box-shadow:0 20px 52px rgba\(0,0,0,\.15\)">[\s\S]*?<\/div>\s*<\/div>\s*)<\/div>\s*(<div>\s*<div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C9951A;margin-bottom:12px[^>]*>Kdo jsem)/,
    "$1$2",
  );

  // Close portrait column before „Kdo jsem“ text column
  s = s.replace(
    /(Certifikace ČNB<\/strong><\/div>\s*<\/div>\s*)(<div>\s*<div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#C9951A;margin-bottom:12px[^>]*>Kdo jsem)/,
    "$1</div>\n      $2",
  );

  return s;
}

/** @param {string} html @param {string} cimBlock */
function insertCimSection(html, cimBlock) {
  if (html.includes("Čím vám mohu pomoci")) return html;
  if (!cimBlock) return html;
  let block = cimBlock.replace(
    /grid-template-columns:repeat\(4,1fr\)/,
    "grid-template-columns:repeat(4,1fr)",
  );
  block = block.replace(
    /<div style="display:grid;grid-template-columns:repeat\(4,1fr\);gap:16px">/,
    '<div class="pf-blog-cim-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">',
  );
  return html.replace(/\s*<!-- CTA \+ REZERVACE -->/, `\n\n    ${block}\n\n<!-- CTA + REZERVACE -->`);
}

/** @param {string} html */
function replacePraxeSection(html, useArticles) {
  const galleryStart = html.indexOf("<!-- Fotky z úvodní stránky");
  const praxeStart = html.indexOf("<!-- Z naší praxe");
  const start = galleryStart >= 0 ? galleryStart : praxeStart;
  if (start < 0) return html;
  const end = html.indexOf("<!-- KDO JSEM", start);
  if (end < 0) return html;

  const replacement = useArticles
    ? buildPraxeArticlesGrid()
    : buildPraxeGallery(extractStoryImgs(fs.readFileSync(indexPath, "utf8"), 6));

  return html.slice(0, start) + replacement + "\n\n" + html.slice(end);
}

/** @param {string} html */
function removeDuplicateDalsiClanky(html) {
  const marker = "<div style=\"font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--yd);margin-bottom:20px;display:flex;align-items:center;gap:8px\">Další články";
  const idx = html.indexOf(marker);
  if (idx < 0) return html;
  const sectionStart = html.lastIndexOf("<section", idx);
  const nextSection = html.indexOf("<!-- Fotky z úvodní", idx);
  const nextPraxe = html.indexOf("<!-- Z naší praxe", idx);
  const end = Math.min(
    ...[nextSection, nextPraxe].filter((x) => x > idx),
  );
  if (sectionStart < 0 || end < 0) return html;
  return html.slice(0, sectionStart) + html.slice(end);
}

/** @param {string} html */
function patchBlog(html) {
  let s = html;
  if (!s.includes("/* pf-blog-fix */")) {
    s = s.replace("</style>", `${BLOG_MOBILE_CSS}\n</style>`);
  }

  const docsHtml = fs.existsSync(docsBlogPath) ? fs.readFileSync(docsBlogPath, "utf8") : "";
  const cimBlock = docsHtml ? extractCimSection(docsHtml) : null;

  s = fixKdoJsem(s);
  s = replacePraxeSection(s, true);
  s = removeDuplicateDalsiClanky(s);
  s = insertCimSection(s, cimBlock);

  return s;
}

function main() {
  if (!fs.existsSync(blogPath)) {
    console.warn("[prusafinance-blog-fix] Missing", blogPath);
    process.exit(0);
  }
  const before = fs.readFileSync(blogPath, "utf8");
  const after = patchBlog(before);
  if (after !== before) {
    fs.writeFileSync(blogPath, after, "utf8");
    console.log("[prusafinance-blog-fix] Updated finance/Web/Ostatni/blog_2.html");
  } else {
    console.log("[prusafinance-blog-fix] No changes needed");
  }
}

main();
