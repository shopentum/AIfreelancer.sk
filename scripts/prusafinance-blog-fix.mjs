/**
 * Blog page fixes: Kdo jsem layout + badge, Z naší praxe 6 articles (2×3), Čím vám mohu pomoci.
 * Run after sync copies blog_2.html → public/prusafinance/blog.html
 */
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

/** 6 article cards — 2 rows × 3 cols */
function buildPraxeArticlesGrid() {
  const cards = [
    {
      href: "hypoteka-2025.html",
      tag: "Hypotéky",
      date: "15. dubna 2025",
      read: "4 min",
      title: "Hypotéka v roce 2025: 5 věcí, které většina lidí přehlédne",
      excerpt:
        "Sazba není všechno. Podmínky při výpadku příjmu, flexibilita mimořádných splátek nebo pojistná doložka — to rozhoduje ve chvíli, kdy to potřebujete.",
      accent: "#EFF6FF",
    },
    {
      href: "clanek-pojisteni.html",
      tag: "Pojištění",
      date: "28. března 2025",
      read: "3 min",
      title: "Máte smlouvy, ale jste skutečně pojištěni?",
      excerpt:
        "70 % lidí platí za smlouvy, které je v klíčovém momentu nepokryjí. Typický příklad: pojištění trvalé...",
      accent: "#FFF7ED",
    },
    {
      href: "clanek-sporeni.html",
      tag: "Finanční plánování",
      date: "10. března 2025",
      read: "5 min",
      title: "Proč „začnu spořit příští měsíc“ nikdy nefunguje",
      excerpt:
        "Markéta to říkala pět let. Pak jsme nastavili automatický převod na den výplaty a problém byl vyřešen...",
      accent: "#F0FDF4",
    },
    {
      href: "hypoteka-2025.html",
      tag: "Penzijní spoření",
      date: "20. února 2025",
      read: "6 min",
      title: "Penzijní spoření u Generali: proč 9 % ročně mění všechno",
      excerpt:
        "Starý konzervativní fond s 1 % výnosem dnes nepokryje ani inflaci. Nový dynamický fond Generali hist...",
      accent: "#FFFBE5",
    },
    {
      href: "zivotni-sen.html",
      tag: "Životní sen",
      date: "5. února 2025",
      read: "4 min",
      title: "Splnění životního snu: plán místo přání",
      excerpt:
        "Exotická dovolená nebo nové auto — když máte čísla a postup, sen přestane být „někdy“ a stane se cílem.",
      accent: "#FFFBE5",
    },
    {
      href: "vlastni-domov.html",
      tag: "Vlastní bydlení",
      date: "22. ledna 2025",
      read: "5 min",
      title: "Vlastní bydlení bez desetiletí čekání",
      excerpt:
        "Hypotéka nebo úvěr ze stavební spořitelny — porovnám obě varianty pro vaši situaci a najdu cestu.",
      accent: "#EFF6FF",
    },
  ];

  const cells = cards
    .map(
      (c) => `
      <a href="${c.href}" style="text-decoration:none;color:inherit;display:flex;flex-direction:column;border-radius:14px;overflow:hidden;border:1px solid var(--gl);background:#fff;transition:all .25s" onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 32px rgba(0,0,0,.09)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
        <div style="height:8px;background:${c.accent}"></div>
        <div style="padding:20px 22px 22px;flex:1;display:flex;flex-direction:column">
          <div style="font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--yd);margin-bottom:8px">${c.tag}</div>
          <div style="font-size:11px;color:var(--gr);margin-bottom:10px">${c.date} · ${c.read} čtení</div>
          <h3 style="font-family:var(--serif);font-size:17px;line-height:1.25;color:var(--bl);margin-bottom:10px;letter-spacing:-.3px">${c.title}</h3>
          <p style="font-size:13px;font-weight:300;color:var(--gr);line-height:1.65;flex:1">${c.excerpt}</p>
          <div style="margin-top:14px;font-size:13px;font-weight:500;color:var(--bl)">Číst článek →</div>
        </div>
      </a>`,
    )
    .join("");

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
