/**
 * Client feedback batch (PDF 2026-05) — finance/Web sources.
 * Run: node scripts/prusafinance-client-feedback.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const webRoot = path.join(root, "finance", "Web");

const SOCIAL = {
  facebook: "https://www.facebook.com/martin.prusa.5/",
  instagram: "https://www.instagram.com/prusafinance/",
  linkedin: "https://www.linkedin.com/in/martin-prusa-71b489136",
};

const IG_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle class="pf-ig-dot" cx="17.5" cy="6.5" r="1.25"/></svg>`;
const IG_ICON_CSS = `.foot-soc-icon.soc-ig svg,.fsi.soc-ig svg{fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.foot-soc-icon.soc-ig svg .pf-ig-dot,.fsi.soc-ig svg .pf-ig-dot{fill:#fff;stroke:none}`;

const MOBILE_CSS = `
/* pf-client-mobile */
@media(max-width:860px){
  .photo-card-wrap{max-width:min(280px,92vw);margin:0 auto;overflow:hidden;border-radius:20px}
  .photo-card{transform:scale(1.08);transform-origin:center top}
  .fwrap{max-width:min(420px,94vw);margin-left:auto;margin-right:auto;padding:28px 24px}
  .contact-grid > div:first-child{padding:0 4px}
}
`;

const CALC_NUM_CSS = `
.calc-num-input{width:100%;margin:0 0 12px;padding:10px 14px;border:1px solid var(--gl);border-radius:8px;font-size:15px;font-family:var(--sans)}
.gc-num-input{width:100%;margin-top:8px;padding:8px 12px;border:1px solid var(--gl);border-radius:8px;font-size:14px;font-family:var(--sans)}
`;

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walkHtml(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

function applyGlobal(html) {
  let s = html;
  s = s.replace(/Zjistit, kolik můžete ušetřit →/g, "Zjistěte →");
  s = s.replace(/Zjistit, jestli jste opravdu krytí →/g, "Zjistěte →");
  s = s.replace(/Zjistit, jak si vytvořit vlastní důchod →/g, "Zjistěte →");
  s = s.replace(/Zjistit, jak si splnit svůj sen →/g, "Zjistěte →");
  s = s.replace(/☕\s*Zvu vás na kávu zdarma/g, "Domluvit konzultaci zdarma");
  s = s.replace(/☕\s*Zvu vás na kávu/g, "Domluvit konzultaci");
  s = s.replace(/Zvu vás na kávu zdarma/g, "Domluvit konzultaci zdarma");
  s = s.replace(/Zvu vás na kávu/g, "Domluvit konzultaci");
  s = s.replace(/href="https:\/\/facebook\.com"/g, `href="${SOCIAL.facebook}"`);
  s = s.replace(/href="https:\/\/linkedin\.com"/g, `href="${SOCIAL.linkedin}"`);
  s = s.replace(/href="https:\/\/instagram\.com"/g, `href="${SOCIAL.instagram}"`);
  if (s.includes(".soc-ig{") && !s.includes("pf-ig-dot")) {
    s = s.replace(/(\.soc-ig\{[^}]+\})/, `$1\n${IG_ICON_CSS}`);
  }
  s = s.replace(
    /(<motion.div class="foot-soc-icon soc-ig">)\s*<svg[\s\S]*?<\/svg>/g,
    `$1${IG_SVG}`,
  );
  s = s.replace(/(<div class="foot-soc-icon soc-ig">)\s*<svg[\s\S]*?<\/svg>/g, `$1${IG_SVG}`);
  s = s.replace(/(<div class="fsi soc-ig">)\s*<svg[\s\S]*?<\/svg>/g, `$1${IG_SVG}`);
  return s;
}

function patchIndexBlog(html) {
  const hrefs = [
    "hypoteka-2025.html",
    "clanek-pojisteni.html",
    "clanek-sporeni.html",
  ];
  let i = 0;
  return html.replace(/<article class="bcrd">([\s\S]*?)<\/article>/g, (_, inner) => {
    const href = hrefs[Math.min(i++, hrefs.length - 1)];
    return `<a href="${href}" class="bcrd" style="text-decoration:none;color:inherit">${inner}</a>`;
  });
}

function extractHeroImg(indexHtml) {
  const m = indexHtml.match(
    /<motion\.div class="photo-card">[\s\S]*?<img src="(data:image\/jpeg;base64,[^"]+)"/,
  ) || indexHtml.match(/<div class="photo-card">[\s\S]*?<img src="(data:image\/jpeg;base64,[^"]+)"/);
  return m ? m[1] : null;
}

function extractStoryImgs(indexHtml, n = 3) {
  const out = [];
  const re = /<div class="story-img"><img src="(data:image\/jpeg;base64,[^"]+)"/g;
  let m;
  while ((m = re.exec(indexHtml)) && out.length < n) out.push(m[1]);
  return out;
}

function buildPhotoGallery(imgs) {
  if (!imgs.length) return "";
  const cells = imgs
    .map(
      (src, i) =>
        `<div style="border-radius:14px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 8px 28px rgba(0,0,0,.08)"><img src="${src}" alt="Martin Průša — ${i + 1}" style="width:100%;height:100%;object-fit:cover;display:block"></motion.div>`.replace("</motion.div>", "</div>"),
    )
    .join("\n");
  return `
<!-- Fotky z úvodní stránky (klient) -->
<section style="padding:48px var(--pad);background:var(--w);border-top:1px solid var(--gl)">
  <motion.div style="max-width:var(--max);margin:0 auto">
    <motion.div style="font-size:10.5px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:var(--yd);margin-bottom:20px;display:flex;align-items:center;gap:8px">Z naší praxe<span style="width:16px;height:2px;background:var(--yd);display:block"></span></motion.div>
    <motion.div style="display:grid;grid-template-columns:repeat(${Math.min(imgs.length, 3)},1fr);gap:16px">${cells}</motion.div>
  </motion.div>
</section>
`.replace(/<\/motion\.motion\.motion\.div>/g, "</div>").replace(/<motion\.div/g, "<div").replace(/<\/motion\.div>/g, "</motion.div>");
}

function patchBlog(html, heroImg, storyImgs) {
  const lines = html.split("\n");
  const out = [];
  let i = 0;
  let insertedGallery = false;

  while (i < lines.length) {
    const line = lines[i];
    if (line.includes("<!-- STARŠÍ ČLÁNKY — carousel -->")) {
      if (!insertedGallery && storyImgs.length) {
        out.push(buildPhotoGallery(storyImgs).trim());
        insertedGallery = true;
      }
      while (i < lines.length && !lines[i].includes("<!-- KDO JSEM")) i++;
      continue;
    }
    if (line.includes("<!-- Čím mohu pomoci — 4 oblasti -->")) {
      while (i < lines.length) {
        i++;
        if (lines[i - 1]?.trim() === "</section>" && i > 340) break;
      }
      continue;
    }
    if (heroImg && line.includes("<!-- Hlavní představení -->")) {
      out.push(line);
      i++;
      while (i < lines.length) {
        if (lines[i].includes("<img src=")) {
          out.push(
            `        <img src="${heroImg}" alt="Mgr. Martin Průša" style="width:100%;height:100%;object-fit:cover;object-position:center 15%;display:block">`,
          );
          i++;
          while (i < lines.length && !lines[i].includes("</div>")) i++;
          continue;
        }
        out.push(lines[i]);
        i++;
        if (lines[i - 1]?.includes("<!-- Čím mohu") || lines[i - 1]?.includes("<!-- CTA + REZERVACE")) break;
      }
      continue;
    }
    out.push(line);
    i++;
  }

  let s = out.join("\n");
  s = s.replace(/href="pojisteni-prijmu\.html"/g, 'href="clanek-pojisteni.html"');
  s = s.replace(/href="sporeni-automaticky\.html"/g, 'href="clanek-sporeni.html"');
  s = s.replace(/href="penzijni-sporeni-generali\.html"/g, 'href="hypoteka-2025.html"');
  s = s.replace(/href="sen-bali\.html"/g, 'href="zivotni-sen.html"');
  s = s.replace(/href="vlastni-bydleni-bez-uspor\.html"/g, 'href="vlastni-domov.html"');
  return s;
}

function patchIndexMobile(html) {
  let s = html;
  if (!s.includes("/* pf-client-mobile */")) {
    s = s.replace("</style>", `${MOBILE_CSS}\n</style>`);
  }
  if (!s.includes("photo-card-wrap")) {
    s = s.replace(
      '<div class="photo-card">',
      '<div class="photo-card-wrap"><motion.div class="photo-card">'.replace(
        "<motion.div",
        "<motion.div",
      ),
    );
    s = s.replace(
      /(<div class="photo-card-wrap"><div class="photo-card">[\s\S]*?<\/div>\s*)<\/div>\s*<\/section>/,
      "$1</motion.div></motion.div></section>",
    );
    // plain div version
    s = s.replace(
      /(<div class="photo-card-wrap"><div class="photo-card">)/,
      '<motion.div class="photo-card-wrap"><motion.div class="photo-card">',
    );
  }
  // fix: use only plain divs
  s = s.replace(/<motion\.motion\.div/g, "<motion.div");
  if (!s.includes("photo-card-wrap")) {
    s = s.replace(
      /(\s*)<div class="photo-card">/,
      '$1<div class="photo-card-wrap"><motion.div class="photo-card">'.replace(
        "<motion.div",
        "<motion.div",
      ),
    );
    s = s.replace(
      /(<div class="photo-card-wrap"><div class="photo-card">[\s\S]*?<\/div>\s*<div class="photo-badge">[\s\S]*?<\/div>\s*<\/motion.div>)/,
      (block) => block.replace(/<\/div>\s*$/, "</motion.div></motion.div>"),
    );
  }
  return s
    .replace(/<motion\.div class="photo-card-wrap">/g, '<div class="photo-card-wrap">')
    .replace(/<motion\.motion\.div class="photo-card">/g, '<div class="photo-card">')
    .replace(/<motion\.motion\.motion\.motion\.div class="photo-card">/g, '<div class="photo-card">')
    .replace(/<motion\.div class="photo-card">/g, '<div class="photo-card">')
    .replace(/<\/motion\.div>/g, "</motion.div>");
}

function patchLoanCalc(html) {
  if (html.includes("loanNum")) return html;
  let s = html;
  if (!s.includes(".calc-num-input")) {
    s = s.replace("</style>", `${CALC_NUM_CSS}\n</style>`);
  }
  s = s.replace(
    /(<div class="calc-amount-display">\s*<span class="calc-amount-val" id="loanVal">[\s\S]*?<\/div>\s*)<input type="range" class="calc-slider" id="loanSlider"/,
    `$1<input type="number" class="calc-num-input" id="loanNum" min="50000" max="2000000" step="50000" value="600000" aria-label="Částka v Kč">\n            <input type="range" class="calc-slider" id="loanSlider"`,
  );
  s = s.replace(
    /(<div class="calc-amount-display">\s*<span class="calc-amount-val" id="yearsVal">[\s\S]*?<\/div>\s*)<input type="range" class="calc-slider" id="yearsSlider"/,
    `$1<input type="number" class="calc-num-input" id="yearsNum" min="5" max="20" step="1" value="20" aria-label="Doba splácení v letech">\n            <input type="range" class="calc-slider" id="yearsSlider"`,
  );
  const syncJs = `
function pfBindCalcPair(sliderId, numId, onChange){
  var slider=document.getElementById(sliderId);
  var num=document.getElementById(numId);
  if(!slider||!num) return;
  function fromSlider(){ num.value=slider.value; onChange(); }
  function fromNum(){
    var v=parseInt(num.value,10);
    if(isNaN(v)) return;
    v=Math.max(parseInt(slider.min,10),Math.min(parseInt(slider.max,10),v));
    slider.value=v; num.value=v; onChange();
  }
  slider.addEventListener('input', fromSlider);
  num.addEventListener('input', fromNum);
  num.addEventListener('change', fromNum);
}
`;
  if (!s.includes("pfBindCalcPair")) {
    s = s.replace(
      "document.getElementById('loanSlider').addEventListener('input', updateCalc);\ndocument.getElementById('yearsSlider').addEventListener('input', updateCalc);",
      `${syncJs}pfBindCalcPair('loanSlider','loanNum',updateCalc);\npfBindCalcPair('yearsSlider','yearsNum',updateCalc);`,
    );
  }
  return s;
}

function patchPensionCalc(html) {
  if (html.includes("gc-age-num")) return html;
  let s = html;
  if (!s.includes(".gc-num-input")) {
    s = s.replace("</style>", `${CALC_NUM_CSS}\n</style>`);
  }
  const fields = [
    ["gc-age", "gc-age-num", 18, 62, 1, 35, "let"],
    ["gc-client", "gc-client-num", 100, 10000, 100, 1700, "Kč"],
    ["gc-emp", "gc-emp-num", 0, 3000, 100, 0, "Kč"],
  ];
  for (const [rangeId, numId, min, max, step, val] of fields) {
    const re = new RegExp(
      `(<input type="range" id="${rangeId}"[^>]*>)`,
      "g",
    );
    s = s.replace(
      re,
      `$1\n              <input type="number" class="gc-num-input" id="${numId}" min="${min}" max="${max}" step="${step}" value="${val}">`,
    );
  }
  const bind = `
function pfBindGc(id,numId){
  var s=document.getElementById(id),n=document.getElementById(numId);
  if(!s||!n) return;
  function syncFromSlider(){ n.value=s.value; gcCalc(); }
  function syncFromNum(){
    var v=parseInt(n.value,10); if(isNaN(v)) return;
    v=Math.max(parseInt(s.min,10),Math.min(parseInt(s.max,10),v));
    s.value=v; n.value=v; gcCalc();
  }
  s.addEventListener('input',syncFromSlider);
  n.addEventListener('input',syncFromNum);
  n.addEventListener('change',syncFromNum);
}
pfBindGc('gc-age','gc-age-num');
pfBindGc('gc-client','gc-client-num');
pfBindGc('gc-emp','gc-emp-num');
`;
  if (!s.includes("pfBindGc")) {
    s = s.replace("gcCalc();", `${bind}\ngcCalc();`);
  }
  return s;
}

function createArticleFromTemplate(template, spec) {
  let s = template;
  s = s.replace(/<title>[\s\S]*?<\/title>/, `<title>${spec.title} — PrůšaFinance</title>`);
  s = s.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${spec.description}">`,
  );
  s = s.replace(/<span class="bc-cur">[^<]*<\/span>/, `<span class="bc-cur">${spec.bc}</span>`);
  s = s.replace(/<h1 class="art-h1">[\s\S]*?<\/h1>/, `<h1 class="art-h1">${spec.h1}</h1>`);
  s = s.replace(
    /<div class="art-meta">[\s\S]*?<\/motion.div>/,
    `<div class="art-meta"><span>${spec.meta}</span><span>·</span><strong>Mgr. Martin Průša</strong></div>`,
  );
  s = s.replace(/<figure class="art-photo">[\s\S]*?<\/figure>/, "");
  s = s.replace(
    /<div class="art-body art-clearfix">[\s\S]*?<\/div>\s*<!-- AUTHOR BOX -->/,
    `<div class="art-body art-clearfix">\n${spec.body}\n  </div>\n\n  <!-- AUTHOR BOX -->`,
  );
  return s;
}

const ARTICLES = [
  {
    file: "clanek-pojisteni_1.html",
    out: "clanek-pojisteni.html",
    title: "Máte pojistky, ale jste skutečně pojištěni?",
    description:
      "70 % lidí platí za pojistky, které je v klíčovém momentu nepokryjí. Co zkontrolovat u příjmů a invalidity.",
    bc: "Pojištění příjmu",
    h1: "Máte pojistky, ale jste skutečně pojištěni? Pravděpodobně ne.",
    meta: "Březen 2025 · 3 min čtení",
    body: `<p>Typický příklad: pojištění trvalé invalidity bez pokrytí pracovní neschopnosti. Rozdíl je zásadní — a v okamžiku výpadku příjmu rozhoduje o tom, zda vás pojistka skutečně podrží.</p>
<h2>Co většina smluv nepokrývá</h2>
<p>U OSVČ i zaměstnanců často chybí sladění limitů s reálnými výdaji domácnosti. Doporučuji projít tři oblasti: pracovní neschopnost, invaliditu a smrt s odkazem na hypotéku nebo závazky.</p>
<h2>Praktický postup</h2>
<ul><li>Sepsat měsíční fixní náklady domácnosti</li><li>Ověřit čekací doby a výluky ve smlouvách</li><li>Sjednotit krytí s partnerem a dětmi</li></ul>
<blockquote>„Pojistka, která neplatí v momentě, kdy ji potřebujete, je drahá iluze.“</blockquote>
<p>Na konzultaci zdarma projdeme vaše smlouvy a ukážeme konkrétní mezery — bez závazku.</p>`,
  },
  {
    file: "clanek-sporeni_1.html",
    out: "clanek-sporeni.html",
    title: "Proč většina lidí spoří špatně",
    description:
      "Inflace, poplatky a chybějící automatizace — tři důvody, proč úspory mizí rychleji, než čekáte.",
    bc: "Spoření",
    h1: "Proč většina lidí spoří špatně (a co s tím)",
    meta: "Únor 2025 · 5 min čtení",
    body: `<p>Účet s nulovým úrokem nebo fond s vysokými poplatky často nevydělá víc než inflace. Cílem není „mít něco stranou“, ale mít jasný plán podle horizontu a rizika.</p>
<h2>Tři časté chyby</h2>
<ul><li>Spoření bez cíle a termínu</li><li>Ignorování státních příspěvků u penzijního spoření</li><li>Jednorázové vklady místo automatického měsíčního převodu</li></ul>
<h2>Co funguje lépe</h2>
<p>Kombinace rezervy na 3–6 měsíců, stavebního spoření pro bydlení a penzijního produktu s podporou státu. Konkrétní poměr závisí na věku, příjmu a závazcích.</p>
<p>Chcete spořit chytřeji? Domluvte si konzultaci — spočítáme scénáře na míru.</p>`,
  },
];

function main() {
  const indexPath = path.join(webRoot, "prusafinance_9.html");
  const indexHtml = fs.readFileSync(indexPath, "utf8");
  const heroImg = extractHeroImg(indexHtml);
  const storyImgs = extractStoryImgs(indexHtml, 3);

  const hypotekaPath = path.join(webRoot, "Ostatni", "hypoteka-2025_1.html");
  const hypotekaTpl = fs.readFileSync(hypotekaPath, "utf8");

  let n = 0;
  for (const file of walkHtml(webRoot)) {
    let html = fs.readFileSync(file, "utf8");
    const before = html;
    html = applyGlobal(html);

    if (file.endsWith("prusafinance_9.html")) {
      html = patchIndexBlog(html);
      html = patchIndexMobile(html);
    }
    if (file.endsWith("blog_2.html")) {
      html = patchBlog(html, heroImg, storyImgs);
    }
    if (file.endsWith("vlastni-domov_7.html")) {
      html = patchLoanCalc(html);
    }
    if (file.endsWith("budoucnost_6.html")) {
      html = patchPensionCalc(html);
    }

    if (html !== before) {
      fs.writeFileSync(file, html);
      n++;
    }
  }

  for (const spec of ARTICLES) {
    const outPath = path.join(webRoot, "Ostatni", spec.file);
    const article = createArticleFromTemplate(hypotekaTpl, spec);
    fs.writeFileSync(outPath, article.replace(/<\/motion\.div>/g, "</motion.div>"));
    console.log(`  created ${spec.file}`);
  }

  console.log(`prusafinance-client-feedback: updated ${n} HTML file(s)`);
}

main();
