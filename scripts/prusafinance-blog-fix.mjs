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

/** Committed blog snapshot with carousel + Čím vám (docs/ is not in repo / Vercel) */
const GIT_BLOG_CAROUSEL = "51378a0:finance/Web/Ostatni/blog_2.html";
const GIT_BLOG_DALSI = "2ac2a96:finance/Web/Ostatni/blog_2.html";

/** When carousel HTML unavailable, reuse Další články thumbnails */
const CAROUSEL_FALLBACK_HREF = {
  "penzijni-sporeni-generali.html": "hypoteka-2025.html",
  "sen-bali.html": "clanek-sporeni.html",
  "vlastni-bydleni-bez-uspor.html": "clanek-pojisteni.html",
};

const PHOTO_BADGE = `<div style="position:absolute;bottom:18px;left:16px;right:16px;background:rgba(255,255,255,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.35);border-radius:11px;padding:13px 16px;z-index:2">
          <div style="font-family:'DM Serif Display',Georgia,serif;font-size:16px;color:#0C0C0C;margin-bottom:3px">Mgr. Martin Průša</div>
          <div style="font-size:10.5px;color:#6B6B6B;font-weight:400">Komplexní poradce · <strong style="color:#C9951A;font-weight:500">Certifikace ČNB</strong></div>
        </div>`;

const BLOG_MOBILE_CSS = `
/* pf-blog-fix */
.pf-blog-cim-grid{
  display:grid !important;
  grid-template-columns:repeat(4,minmax(0,1fr)) !important;
  gap:16px !important;
  width:100% !important;
  max-width:100% !important;
  align-items:stretch;
}
.pf-blog-cim-grid>a{
  min-width:0 !important;
  max-width:100% !important;
  width:100% !important;
  display:flex !important;
  flex-direction:column !important;
  overflow:hidden !important;
  box-sizing:border-box;
}
.pf-blog-cim-card-photo{
  height:130px !important;
  min-height:130px !important;
  max-height:130px !important;
  width:100% !important;
  max-width:100% !important;
  overflow:hidden !important;
  position:relative;
  flex-shrink:0;
  box-sizing:border-box;
}
.pf-blog-cim-card-photo img{
  width:100% !important;
  height:100% !important;
  max-width:100% !important;
  object-fit:cover !important;
  display:block !important;
}
@media(max-width:900px){
  .pf-blog-about{display:grid !important;grid-template-columns:1fr !important;gap:36px !important}
  .pf-blog-praxe-grid{grid-template-columns:1fr !important}
  .pf-blog-cim-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important}
}
@media(max-width:560px){
  .pf-blog-cim-grid{grid-template-columns:minmax(0,1fr) !important}
}`;

/** @param {string} html */
function extractCimSection(html) {
  const start = html.indexOf("<!-- Čím mohu pomoci — 4 oblasti -->");
  if (start < 0) return null;
  const end = html.indexOf("<!-- CTA + REZERVACE", start);
  if (end < 0) return null;
  return html.slice(start, end).trim();
}

const HOME_STORY_IMG = {
  "ochrana.html": "Zlomil jsem si nohu",
  "zivotni-sen.html": "Tři banky nám hypotéku zamítly",
};

/** @param {string} html @param {string} titlePart */
function extractHomeStoryImage(html, titlePart) {
  const h3Idx = html.indexOf(titlePart);
  if (h3Idx < 0) return null;
  const before = html.slice(Math.max(0, h3Idx - 200000), h3Idx);
  const imgs = [...before.matchAll(/<div class="story-img"><img src="(data:image[^"]+)"/g)];
  if (imgs.length) return imgs[imgs.length - 1][1];
  const after = html.slice(h3Idx, h3Idx + 50000);
  const m = after.match(/<div class="story-img"><img src="(data:image[^"]+)"/);
  return m ? m[1] : null;
}

/** @param {string} html */
function repairBrokenCimCards(html) {
  let s = html;
  s = s.replace(
    /(<div class="pf-blog-cim-card-photo"[^>]*>\s*<img[^>]*>)\s*<\/div>\s*<div style="position:absolute;bottom:10px;left:12px;font-size:20px">[^<]*<\/div>\s*<\/div>\s*(<div style="padding:16px">)/g,
    "$1\n        </div>\n        $2",
  );
  s = s.replace(
    /(<div class="pf-blog-cim-card-photo"[^>]*>\s*<img[^>]*>)\s*<\/div>\s*(<div style="padding:16px">)/g,
    "$1\n        </div>\n        $2",
  );
  return s;
}

/** @param {string} html @param {string} href @param {string} imgSrc */
function setCimCardPhoto(html, href, imgSrc) {
  const cimStart = html.indexOf("<!-- Čím mohu pomoci");
  const cimLabel = html.indexOf("Čím vám mohu pomoci");
  const sectionStart =
    cimStart >= 0 ? cimStart : cimLabel >= 0 ? cimLabel : -1;
  const sectionEnd = html.indexOf("<!-- CTA + REZERVACE", sectionStart);
  if (sectionStart < 0 || sectionEnd < 0) return html;

  const chunk = html.slice(sectionStart, sectionEnd);
  const anchor = `<a href="${href}" style="border-radius`;
  const relStart = chunk.indexOf(anchor);
  if (relStart < 0) return html;

  const paddingStart = chunk.indexOf('<div style="padding:16px">', relStart);
  const heightIdx = chunk.indexOf("height:130px", relStart);
  if (paddingStart < 0 || heightIdx < 0 || heightIdx > relStart + 8000) return html;

  const divOpenStart = chunk.lastIndexOf("<div", heightIdx);
  if (divOpenStart < 0) return html;

  const photoDivOpen = `<div class="pf-blog-cim-card-photo" style="height:130px;overflow:hidden;position:relative">`;
  const imgBlock = `<img src="${imgSrc}" alt="" style="width:100%;height:100%;max-width:100%;object-fit:cover;display:block">`;
  const patchedChunk = `${chunk.slice(0, divOpenStart)}${photoDivOpen}\n          ${imgBlock}\n        </div>\n        ${chunk.slice(paddingStart)}`;
  return html.slice(0, sectionStart) + patchedChunk + html.slice(sectionEnd);
}

/** @param {string} html */
function normalizeCimGridLayout(html) {
  let s = html;
  s = s.replace(
    /class="pf-blog-cim-grid" style="display:grid;grid-template-columns:repeat\(4,1fr\);gap:16px"/g,
    'class="pf-blog-cim-grid" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px"',
  );
  s = s.replace(
    /<div style="height:130px;overflow:hidden;position:relative">(\s*<img)/g,
    '<div class="pf-blog-cim-card-photo" style="height:130px;overflow:hidden;position:relative">$1',
  );
  return s;
}

/** @param {string} html */
function patchCimSection(html) {
  let s = html;

  s = s.replace(/Čim vám mohu pomoci/gi, "Čím vám mohu pomoci");
  s = s.replace(
    />Čim vám mohu pomoci</gi,
    ">Čím vám mohu pomoci<",
  );

  if (!s.includes("Čím vám mohu pomoci") && !s.includes("<!-- Čím mohu pomoci")) {
    return s;
  }

  s = normalizeCimGridLayout(s);
  s = repairBrokenCimCards(s);

  const indexHtml = fs.readFileSync(indexPath, "utf8");
  for (const [href, titlePart] of Object.entries(HOME_STORY_IMG)) {
    const src = extractHomeStoryImage(indexHtml, titlePart);
    if (!src) {
      console.warn(`[prusafinance-blog-fix] Homepage story image not found: ${titlePart}`);
      continue;
    }
    const next = setCimCardPhoto(s, href, src);
    if (next === s) {
      console.warn(`[prusafinance-blog-fix] Could not patch Čím vám card: ${href}`);
    } else {
      s = next;
    }
  }

  return s;
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

/** @param {string} ref git ref:path */
function loadGitFile(ref) {
  try {
    return execSync(`git show ${ref}`, {
      encoding: "utf8",
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch {
    return "";
  }
}

/** @param {string} html */
function extractCarouselPool(html) {
  const carStart = html.indexOf("STARŠÍ ČLÁNKY");
  if (carStart < 0) return [];
  let carEnd = html.indexOf("Další články", carStart);
  if (carEnd < 0) carEnd = html.indexOf("<!-- KDO JSEM", carStart);
  if (carEnd < 0) carEnd = html.indexOf("Čím vám mohu pomoci", carStart);
  if (carEnd < 0) carEnd = html.length;
  return extractArticleCards(html.slice(carStart, carEnd));
}

/** @param {string} html */
function extractDalsiPool(html) {
  const dalsiStart = html.indexOf("Další články");
  const dalsiEnd = html.indexOf("Fotky z úvodní", dalsiStart);
  if (dalsiStart < 0 || dalsiEnd <= dalsiStart) return [];
  return extractArticleCards(html.slice(dalsiStart, dalsiEnd));
}

/**
 * @param {{href: string, full: string}[]} dalsiPool
 * @param {{href: string, full: string}[]} carouselPool
 * @param {string} href
 */
function resolveCard(dalsiPool, carouselPool, href) {
  let c = carouselPool.find((x) => x.href === href);
  if (!c) c = dalsiPool.find((x) => x.href === href);
  const fallbackHref = CAROUSEL_FALLBACK_HREF[href];
  if (!c && fallbackHref) c = dalsiPool.find((x) => x.href === fallbackHref);
  if (!c && dalsiPool.length) {
    console.warn(
      `[prusafinance-blog-fix] Card ${href} not in git/docs; reusing ${dalsiPool[0].href} thumbnail`,
    );
    c = dalsiPool[0];
  }
  if (!c) {
    throw new Error(
      `[prusafinance-blog-fix] No article cards in git history (need ${GIT_BLOG_DALSI})`,
    );
  }
  return c;
}

/** @param {string} html */
function praxeSectionHasThumbnails(html) {
  const start = html.indexOf("<!-- Z naší praxe — 6 článků -->");
  if (start < 0) return false;
  const end = html.indexOf("<!-- KDO JSEM", start);
  const chunk = end > start ? html.slice(start, end) : html.slice(start, start + 400000);
  return (chunk.match(/data:image/g) || []).length >= 6;
}

/** 6 article cards with original thumbnails (2×3) */
function buildPraxeArticlesGrid() {
  let dalsiHtml = loadGitFile(GIT_BLOG_DALSI);
  if (!dalsiHtml && fs.existsSync(docsBlogPath)) {
    dalsiHtml = fs.readFileSync(docsBlogPath, "utf8");
  }
  const dalsiPool = extractDalsiPool(dalsiHtml);

  let carouselPool = extractCarouselPool(loadGitFile(GIT_BLOG_CAROUSEL));
  if (!carouselPool.length && fs.existsSync(docsBlogPath)) {
    carouselPool = extractCarouselPool(fs.readFileSync(docsBlogPath, "utf8"));
  }

  const order = [
    {href: "hypoteka-2025.html", link: "hypoteka-2025.html"},
    {href: "clanek-pojisteni.html", link: "clanek-pojisteni.html"},
    {href: "clanek-sporeni.html", link: "clanek-sporeni.html"},
    {href: "penzijni-sporeni-generali.html", link: "hypoteka-2025.html"},
    {href: "sen-bali.html", link: "zivotni-sen.html"},
    {href: "vlastni-bydleni-bez-uspor.html", link: "vlastni-domov.html"},
  ];

  const cells = order
    .map((item) => {
      const card = resolveCard(dalsiPool, carouselPool, item.href);
      return normalizeArticleCard(card.full, item.link);
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
    '<div class="pf-blog-cim-grid" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px">',
  );
  return html.replace(/\s*<!-- CTA \+ REZERVACE -->/, `\n\n    ${block}\n\n<!-- CTA + REZERVACE -->`);
}

/** @param {string} html */
function replacePraxeSection(html, useArticles) {
  if (useArticles && praxeSectionHasThumbnails(html)) {
    return html;
  }

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
  const cssStart = s.indexOf("/* pf-blog-fix */");
  if (cssStart >= 0) {
    const cssEnd = s.indexOf("</style>", cssStart);
    if (cssEnd >= 0) {
      s = `${s.slice(0, cssStart)}${BLOG_MOBILE_CSS.trim()}\n${s.slice(cssEnd)}`;
    }
  } else {
    s = s.replace("</style>", `${BLOG_MOBILE_CSS}\n</style>`);
  }

  let cimBlock = null;
  if (fs.existsSync(docsBlogPath)) {
    cimBlock = extractCimSection(fs.readFileSync(docsBlogPath, "utf8"));
  }
  if (!cimBlock) {
    const gitCim = loadGitFile(GIT_BLOG_CAROUSEL);
    if (gitCim) cimBlock = extractCimSection(gitCim);
  }

  s = fixKdoJsem(s);
  s = replacePraxeSection(s, true);
  s = removeDuplicateDalsiClanky(s);
  s = insertCimSection(s, cimBlock);
  s = patchCimSection(s);
  s = normalizeCimGridLayout(s);
  s = repairBrokenCimCards(s);

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
