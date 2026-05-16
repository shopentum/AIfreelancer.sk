# Route map (site)

Implementácia: `src/app/`. Middleware: `middleware.ts` (i18n).

| Path | Modul | Súbory |
|------|-------|--------|
| `/` | marketing | `(site)/page.tsx` |
| `/agency`, `/o-mne`, `/kontakt`, `/gdpr`, `/cookies` | marketing | `(site)/…` |
| `/ai-architektura`, `/use-case/shopentum` | marketing | `(site)/…` |
| `/izyvape`, `/izyvape-strategy` | izyvape | `(site)/izyvape*`, `components/Izyvape*` |
| `/cashflow` | redirect | → `cashflow.aifreelancer.sk` |
| `/eagle-admin` | eagle-admin | `[locale]/eagle-admin`, `eagle_admin/` |
| `/nmh`, `/nmh/copilot-blueprint` | nmh | `[locale]/nmh/` |
| `/proficrafts` | proficrafts | `[locale]/proficrafts` |
| `/ai-studio` | ai-studio | `ai-studio/` |
| `/prusafinance/*` | prusafinance | `public/prusafinance/` |

Lokalizované varianty: `/[locale]/…` (sk, en, de).
