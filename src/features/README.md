# Features (`src/features`)

**Zameranie:** produktové alebo klientské featury s vlastnou doménou logiky a UI, ktoré **nie sú** samostatná Vercel appka.

Príklady (aktuálne mimo tohto priečinka — historicky v `components/` / `app/`):

| Feature | Odporúčané umiestnenie (budúcnosť) | Dnes |
|---------|-----------------------------------|------|
| IZYVAPE landing | `features/izyvape/` | `components/Izyvape*.tsx`, `app/(site)/izyvape*` |
| Shopentum use case | `features/shopentum/` | `components/Shopentum*.tsx` |

Pri väčšom refaktore presúvaj sem; pri novej prezentácii preferuj `src/features/<name>/` pred ďalším plochým `components/`.

Register: [`../../SYSTEM_REGISTRY.md`](../../SYSTEM_REGISTRY.md)
