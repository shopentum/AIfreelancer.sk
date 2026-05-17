import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function applyGlobal(html) {
  const SOCIAL = {
    facebook: "https://www.facebook.com/martin.prusa.5/",
    instagram: "https://www.instagram.com/prusafinance/",
    linkedin: "https://www.linkedin.com/in/martin-prusa-71b489136",
  };
  let s = html;
  s = s.replace(/☕\s*Zvu vás na kávu zdarma/g, "Domluvit konzultaci zdarma");
  s = s.replace(/☕\s*Zvu vás na kávu/g, "Domluvit konzultaci");
  s = s.replace(/Zvu vás na kávu zdarma/g, "Domluvit konzultaci zdarma");
  s = s.replace(/Zvu vás na kávu/g, "Domluvit konzultaci");
  s = s.replace(/href="https:\/\/facebook\.com"/g, `href="${SOCIAL.facebook}"`);
  s = s.replace(/href="https:\/\/linkedin\.com"/g, `href="${SOCIAL.linkedin}"`);
  s = s.replace(/href="https:\/\/instagram\.com"/g, `href="${SOCIAL.instagram}"`);
  return s;
}

const idxPath = path.join(root, "finance/Web/prusafinance_9.html");
let idx = fs.readFileSync(idxPath, "utf8");
if (!idx.includes('class="photo-card-wrap"')) {
  idx = idx.replace(
    /(\s*)<div>\n\s*<div class="photo-card">/,
    '$1<div class="photo-card-wrap">\n$1  <div class="photo-card">',
  );
}
idx = applyGlobal(idx);
fs.writeFileSync(idxPath, idx);

const blogPath = path.join(root, "finance/Web/Ostatni/blog_2.html");
let blog = fs.readFileSync(blogPath, "utf8");
blog = blog.replace(
  /<!-- Čím mohu pomoci — 4 oblasti -->[\s\S]*?(?=\n<!-- CTA \+ REZERVACE -->)/,
  "",
);
blog = blog.replace(/<\/?motion\.motion\.div>/g, (m) => m.replace("motion.", ""));
blog = applyGlobal(blog);
fs.writeFileSync(blogPath, blog);

for (const rel of [
  "finance/Web/Ostatni/clanek-pojisteni_1.html",
  "finance/Web/Ostatni/clanek-sporeni_1.html",
]) {
  const p = path.join(root, rel);
  fs.writeFileSync(p, applyGlobal(fs.readFileSync(p, "utf8")));
}

console.log("prusafinance-client-feedback-fix: done");
