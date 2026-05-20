/**
 * Ensures internal links stay relative (no /prusafinance/ prefix in href/src).
 * Relative links work on both aifreelancer.sk/prusafinance/* and prusafinance.com/* (clean URLs).
 *
 * Idempotent: strips any leftover /prusafinance/ prefix from prior builds.
 * Run: node scripts/prusafinance-prefix-paths.mjs
 */

import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dir = path.join(root, "public", "prusafinance");

/**
 * @param {string} html
 * @returns {string}
 */
export function applyPrusafinanceRelativePaths(html) {
  let s = html;
  s = s.replace(/\/prusafinance\/prusafinance\//g, "/prusafinance/");

  s = s.replace(/href="\/prusafinance\//g, 'href="');
  s = s.replace(/href='\/prusafinance\//g, "href='");
  s = s.replace(/src="\/prusafinance\//g, 'src="');
  s = s.replace(/src='\/prusafinance\//g, "src='");

  s = s.replace(
    /window\.location\.href="\/prusafinance\//g,
    'window.location.href="',
  );
  s = s.replace(
    /window\.location\.href='\/prusafinance\//g,
    "window.location.href='",
  );

  return s;
}

function main() {
  if (!fs.existsSync(dir)) {
    console.warn("[prusafinance-paths] Missing directory:", path.relative(root, dir));
    process.exit(0);
  }
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".html"));
  let n = 0;
  for (const f of files) {
    const p = path.join(dir, f);
    const before = fs.readFileSync(p, "utf8");
    const after = applyPrusafinanceRelativePaths(before);
    if (after !== before) {
      fs.writeFileSync(p, after, "utf8");
      n++;
    }
  }
  console.log(
    "[prusafinance-paths] Processed",
    files.length,
    "HTML files, updated",
    n,
    "file(s).",
  );
}

main();
