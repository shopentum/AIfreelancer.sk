/**
 * Rewrites relative .html / .pdf links to /prusafinance/... so they work when the page
 * is served as .../prusafinance (no trailing slash). Browser relative resolution would
 * otherwise point to site root (/vlastni-domov.html).
 *
 * Idempotent: skips links that already start with /prusafinance/
 * Run: node scripts/prusafinance-prefix-paths.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dir = path.join(root, "public", "prusafinance");

/** @type {string} */
const BASE = "/prusafinance";

/**
 * @param {string} html
 * @returns {string}
 */
export function applyPrusafinancePathPrefix(html) {
  let s = html;
  // Safety: avoid double prefix if script runs twice
  s = s.replace(/\/prusafinance\/prusafinance\//g, "/prusafinance/");

  // href="file.html" / "file.html#frag" / .pdf (not http/mailto/tel/# only/already prefixed)
  const hrefRe =
    /href="(?!https?:\/\/|mailto:|tel:|\/prusafinance\/|#)([^"]+\.(?:html|pdf))(#[^"]*)?"/g;
  s = s.replace(hrefRe, (_, file, frag) => `href="${BASE}/${file}${frag || ""}"`);

  const hrefSqRe =
    /href='(?!https?:\/\/|mailto:|tel:|\/prusafinance\/|#)([^']+\.(?:html|pdf))(#[^']*)?'/g;
  s = s.replace(hrefSqRe, (_, file, frag) => `href='${BASE}/${file}${frag || ""}'`);

  // onclick / window.location — single quotes
  s = s.replace(
    /window\.location\.href='(?!\/prusafinance\/)([^']+\.html)(#[^']*)?'/g,
    (_, file, frag) => `window.location.href='${BASE}/${file}${frag || ""}'`,
  );
  // double quotes
  s = s.replace(
    /window\.location\.href="(?!\/prusafinance\/)([^"]+\.html)(#[^"]*)?"/g,
    (_, file, frag) => `window.location.href="${BASE}/${file}${frag || ""}"`,
  );

  return s;
}

function main() {
  if (!fs.existsSync(dir)) {
    console.warn("[prusafinance-prefix] Missing directory:", path.relative(root, dir));
    process.exit(0);
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
  let n = 0;
  for (const f of files) {
    const p = path.join(dir, f);
    const before = fs.readFileSync(p, "utf8");
    const after = applyPrusafinancePathPrefix(before);
    if (after !== before) {
      fs.writeFileSync(p, after, "utf8");
      n++;
    }
  }
  console.log(
    "[prusafinance-prefix] Processed",
    files.length,
    "HTML files, updated",
    n,
    "file(s).",
  );
}

main();
