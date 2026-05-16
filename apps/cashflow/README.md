# Cashflow (samostatný produkt — externý repozitár)

Tento priečinok **neobsahuje zdroják**. Kotva v `/apps` + pripomienka: cashflow spĺňa pravidlo **standalone-product** (nie „menšia vec na aifreelancer.sk/“).

| | |
|--|--|
| **Repo** | https://github.com/shopentum/cashflow |
| **Vercel** | `cashflow-omega` |
| **Produkcia** | https://cashflow.aifreelancer.sk |
| **Register** | [`SYSTEM_REGISTRY.md`](../../SYSTEM_REGISTRY.md) |

Vývoj a deploy len v `shopentum/cashflow`. V monorepe `AIfreelancer.sk` nekopíruj `omega-cashflow/` ani `src/cashflow/`.

Hlavný web: `/cashflow` → redirect na subdoménu (`src/lib/cashflow.ts`).
