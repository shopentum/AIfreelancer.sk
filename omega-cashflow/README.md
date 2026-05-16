# omega-cashflow (lokálna kópia v monorepe)

**Produkčný cashflow nie je nasadený z tohto priečinka.**

| Čo | Kde |
|----|-----|
| Produkcia | Vercel projekt **`cashflow-omega`** → repo [`shopentum/cashflow`](https://github.com/shopentum/cashflow) |
| URL | https://cashflow.aifreelancer.sk |
| Monorepo `AIfreelancer.sk` | Priečinok `omega-cashflow/` len na vývoj / sync; **žiadny Vercel projekt** s Root `omega-cashflow` na tomto repozitári |

Vercel projekty **`cashflow`** a **`omega-cashflow`** napojené na `shopentum/AIfreelancer.sk` alebo duplicitný repo → zmaž alebo odpoj Git.

Lokálny dev:

```bash
cd omega-cashflow
npm install
npm run dev
```

Nasadenie: pozri `shopentum/cashflow` (projekt `cashflow-omega`).
