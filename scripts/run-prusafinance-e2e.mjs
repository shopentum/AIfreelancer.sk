#!/usr/bin/env node
import {spawnSync} from "node:child_process";

const args = process.argv.slice(2);
const mock = args.includes("--mock");
const prod = args.includes("--prod");

if (mock) process.env.PF_E2E_MOCK = "1";
if (prod) {
  process.env.PF_E2E_BASE_URL = "https://www.aifreelancer.sk";
  process.env.PF_E2E_SKIP_SERVER = "1";
  console.warn(
    "⚠️  Produkčný E2E: vytvorí 12 reálnych leadov v Ecomail (test1@test.sk … test12@test.sk).",
  );
}

const extra = args.filter((a) => !a.startsWith("--"));
const result = spawnSync(
  "npx",
  ["playwright", "test", "e2e/prusafinance-forms.spec.ts", ...extra],
  {stdio: "inherit", shell: true, env: process.env},
);

process.exit(result.status ?? 1);
