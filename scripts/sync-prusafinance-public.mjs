/**
 * Copies finance/Web HTML into public/prusafinance for deployment at /prusafinance/*.
 * Run: node scripts/sync-prusafinance-public.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "prusafinance");
const pfLeadSrc = path.join(root, "finance", "Web", "assets", "pf-lead.js");

const copies = [
  ["finance/Web/prusafinance_9.html", "index.html"],
  ["finance/Web/Podstranky/vlastni-domov_7.html", "vlastni-domov.html"],
  ["finance/Web/Podstranky/ochrana_8.html", "ochrana.html"],
  ["finance/Web/Podstranky/budoucnost_6.html", "budoucnost.html"],
  ["finance/Web/Podstranky/zivotni-sen_2.html", "zivotni-sen.html"],
  ["finance/Web/Ostatni/blog_2.html", "blog.html"],
  ["finance/Web/Ostatni/hypoteka-2025_1.html", "hypoteka-2025.html"],
  ["finance/Web/Ostatni/gdpr_1.html", "gdpr.html"],
  ["finance/Web/Ostatni/obchodni-podminky_1.html", "obchodni-podminky.html"],
  ["finance/Web/Ostatni/dekujeme.html", "dekujeme.html"],
  ["finance/Web/Landing page/stahnout-pruvodce.html", "stahnout-pruvodce.html"],
  ["finance/Web/Landing page/ppc-bezurocne-uvery.html", "ppc-bezurocne-uvery.html"],
  ["finance/Web/Landing page/ppc-refinancovani.html", "ppc-refinancovani.html"],
  ["finance/Web/Landing page/ppc-pojisteni-osvc.html", "ppc-pojisteni-osvc.html"],
  ["finance/Web/Landing page/ppc-modernizace-bydleni.html", "ppc-modernizace-bydleni.html"],
  ["finance/Web/Landing page/ppc-raiffeisen-ucet.html", "ppc-raiffeisen-ucet.html"],
];

/** Ecomail tag per deployed HTML filename */
const FORM_TAGS = {
  "index.html": "formular:index-kontakt",
  "stahnout-pruvodce.html": "formular:stahnout-pruvodce",
  "ppc-bezurocne-uvery.html": "formular:ppc-bezurocne-uvery",
  "ppc-refinancovani.html": "formular:ppc-refinancovani",
  "ppc-pojisteni-osvc.html": "formular:ppc-pojisteni-osvc",
  "ppc-modernizace-bydleni.html": "formular:ppc-modernizace-bydleni",
  "ppc-raiffeisen-ucet.html": "formular:ppc-raiffeisen-ucet",
};

const PF_LEAD_SCRIPT =
  '<script src="/prusafinance/pf-lead.js"></script>\n';

/** Tiny valid PDF placeholder — replace with real asset when the client provides it. */
const MINIMAL_PDF = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
trailer<< /Size 4 /Root 1 0 R >>
startxref
190
%%EOF`;

function applyTransforms(html) {
  let s = html;

  const pairs = [
    [/pribeh-bydleni\.html/g, "vlastni-domov.html"],
    [/pribeh-ochrana\.html/g, "ochrana.html"],
    [/pribeh-rezerva\.html/g, "budoucnost.html"],
    [/pribeh-sen\.html/g, "zivotni-sen.html"],
    [/pojisteni-prijmu\.html/g, "ochrana.html"],
    [/sporeni-automaticky\.html/g, "budoucnost.html"],
    [/penzijni-sporeni-generali\.html/g, "budoucnost.html"],
    [/sen-bali\.html/g, "zivotni-sen.html"],
    [/vlastni-bydleni-bez-uspor\.html/g, "vlastni-domov.html"],
    [/href="#gdpr" id="gdpr"/g, 'href="gdpr.html"'],
    [/href="#podminky" id="podminky"/g, 'href="obchodni-podminky.html"'],
    [/href="#gdpr" style=/g, 'href="gdpr.html" style='],
    [/href="#gdpr">📄 GDPR<\/a>/g, 'href="gdpr.html">📄 GDPR</a>'],
    [/href="#podminky">📋 Obchodní podmínky<\/a>/g, 'href="obchodni-podminky.html">📋 Obchodní podmínky</a>'],
    [/href="#podminky">📋 Obch\. podmínky<\/a>/g, 'href="obchodni-podminky.html">📋 Obch. podmínky</a>'],
    [
      /<a class="see-all" href="#">Všechny články →<\/a>/g,
      '<a class="see-all" href="blog.html">Všechny články →</a>',
    ],
    [
      /<div class="foot-legal"><a href="#">GDPR &amp; Ochrana osobních údajů<\/a><a href="#">Obchodní podmínky<\/a><\/div>/g,
      '<div class="foot-legal"><a href="gdpr.html">GDPR &amp; Ochrana osobních údajů</a><a href="obchodni-podminky.html">Obchodní podmínky</a></div>',
    ],
    [
      /<a href="#">📄 GDPR<\/a>/g,
      '<a href="gdpr.html">📄 GDPR</a>',
    ],
    [
      /<a href="#">📋 Obch\. podmínky<\/a>/g,
      '<a href="obchodni-podminky.html">📋 Obch. podmínky</a>',
    ],
    [/https:\/\/formspree\.io\/f\/VAŠID/g, "#"],
    [/https:\/\/formspree\.io\/f\/REPLACE_WITH_YOUR_FORM_ID/g, "#"],
  ];

  for (const [re, rep] of pairs) {
    s = s.replace(re, rep);
  }

  return s;
}

function formPlacement(formId) {
  if (/bottom|bot/i.test(formId)) return "bottom";
  return "hero";
}

function applyLeadForms(html, destName) {
  const tag = FORM_TAGS[destName];
  if (!tag) return html;

  let s = html;

  s = s.replace(/<form\b([^>]*)>/gi, (full, attrs) => {
    if (/data-pf-lead/i.test(attrs)) return full;
    const idMatch = attrs.match(/\sid="([^"]+)"/i);
    const formId = idMatch ? idMatch[1] : "form";
    const placement = formPlacement(formId);
    const pdfAttr = destName === "stahnout-pruvodce.html" ? ' data-pf-pdf="1"' : "";
    const cleaned = attrs
      .replace(/\saction="[^"]*"/gi, "")
      .replace(/\sonsubmit="[^"]*"/gi, "");
    return `<form${cleaned} action="#" method="post" data-pf-lead data-pf-tag="${tag}" data-pf-placement="${placement}"${pdfAttr}>`;
  });

  s = s.replace(
    /<script>\s*function (handleSubmit|sub)\([\s\S]*?<\/script>\s*(?=<\/body>)/i,
    PF_LEAD_SCRIPT,
  );

  if (!s.includes("pf-lead.js")) {
    s = s.replace("</body>", `${PF_LEAD_SCRIPT}</body>`);
  }

  return s;
}

const markerSrc = path.join(root, copies[0][0]);
if (!fs.existsSync(markerSrc)) {
  console.warn(
    "[sync-prusafinance] finance/Web not found — skipping regenerate (using committed public/prusafinance).",
  );
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });

for (const [srcRel, destName] of copies) {
  const src = path.join(root, srcRel);
  if (!fs.existsSync(src)) {
    console.error("Missing source:", srcRel);
    process.exit(1);
  }
  let html = fs.readFileSync(src, "utf8");
  html = applyTransforms(html);
  html = applyLeadForms(html, destName);
  fs.writeFileSync(path.join(outDir, destName), html, "utf8");
}

if (!fs.existsSync(pfLeadSrc)) {
  console.error("Missing:", path.relative(root, pfLeadSrc));
  process.exit(1);
}
fs.copyFileSync(pfLeadSrc, path.join(outDir, "pf-lead.js"));

fs.writeFileSync(path.join(outDir, "financni-gramotnost-prusa.pdf"), MINIMAL_PDF, "utf8");

console.log(
  "Wrote",
  copies.length,
  "HTML + pf-lead.js + placeholder PDF to",
  path.relative(root, outDir),
);
