# `/apps` — deployovateľné aplikácie

Jeden podpriečinok = jedna SPA s vlastným `package.json` a (typicky) vlastným Vercel projektom.

**Register:** [`../SYSTEM_REGISTRY.md`](../SYSTEM_REGISTRY.md)

| Priečinok | Stav | Kód |
|-----------|------|-----|
| [`site/`](site/) | live | README only — Next.js v koreni repa |
| [`kanban/`](kanban/) | live | plná appka |
| [`cashflow/`](cashflow/) | external | len README → repo `shopentum/cashflow` |

Novú appku sem **nepridávaj** bez záznamu v `SYSTEM_REGISTRY.md` a bez rozhodnutia monorepo vs. samostatný repo.
