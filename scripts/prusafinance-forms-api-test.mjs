#!/usr/bin/env node
/**
 * API smoke test for all 12 Průša form tags (no browser).
 * Creates real Ecomail leads unless PF_E2E_MOCK=1.
 *
 *   node scripts/prusafinance-forms-api-test.mjs
 *   PF_E2E_BASE_URL=https://www.aifreelancer.sk node scripts/prusafinance-forms-api-test.mjs
 *   PF_E2E_MOCK=1 node scripts/prusafinance-forms-api-test.mjs
 */

const base =
  (process.env.PF_E2E_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const mock = process.env.PF_E2E_MOCK === "1";

const CASES = [
  {n: 1, tag: "formular:index-kontakt", placement: "kontakt"},
  {n: 2, tag: "formular:stahnout-pruvodce", placement: "hero", emailField: true},
  {n: 3, tag: "formular:ppc-refinancovani", placement: "hero"},
  {n: 4, tag: "formular:ppc-refinancovani", placement: "bottom"},
  {n: 5, tag: "formular:ppc-bezurocne-uvery", placement: "hero"},
  {n: 6, tag: "formular:ppc-bezurocne-uvery", placement: "bottom"},
  {n: 7, tag: "formular:ppc-pojisteni-osvc", placement: "hero"},
  {n: 8, tag: "formular:ppc-pojisteni-osvc", placement: "bottom"},
  {n: 9, tag: "formular:ppc-modernizace-bydleni", placement: "hero"},
  {n: 10, tag: "formular:ppc-modernizace-bydleni", placement: "bottom"},
  {n: 11, tag: "formular:ppc-raiffeisen-ucet", placement: "hero"},
  {n: 12, tag: "formular:ppc-raiffeisen-ucet", placement: "bottom"},
];

async function runOne(c) {
  const email = `test${c.n}@test.sk`;
  const payload = {
    tag: c.tag,
    jmeno: `Test${c.n}`,
    kontakt: c.emailField ? "" : email,
    email: c.emailField ? email : "",
    zprava: `API test #${c.n}`,
    temata: "",
    placement: c.placement,
  };

  if (mock) {
    console.log(`[mock OK] ${c.n}/12 ${c.tag} (${c.placement}) → ${email}`);
    return true;
  }

  const res = await fetch(`${base}/api/prusafinance/contact`, {
    method: "POST",
    headers: {"Content-Type": "application/json", Accept: "application/json"},
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  const ok = res.ok && data.ok === true;
  console.log(
    `${ok ? "OK" : "FAIL"} ${c.n}/12 ${c.tag} (${c.placement}) → ${email} [${res.status}]`,
    ok ? "" : JSON.stringify(data),
  );
  return ok;
}

async function main() {
  console.log(`Base URL: ${base}${mock ? " (MOCK)" : ""}\n`);
  let passed = 0;
  for (const c of CASES) {
    if (await runOne(c)) passed++;
  }
  console.log(`\n${passed}/${CASES.length} passed`);
  process.exit(passed === CASES.length ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
