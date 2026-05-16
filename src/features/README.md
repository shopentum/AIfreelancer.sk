# Features (`src/features`)

**Zameranie:** default pre menšie veci — klientske decky, landingy, prezentácie, logika pod jednou URL **`aifreelancer.sk/<path>`**. Nie samostatné repo, nie nový Vercel projekt z monorepa.

Príklady (aktuálne mimo tohto priečinka — historicky v `components/` / `app/`):

| Feature | Odporúčané umiestnenie (budúcnosť) | Dnes |
|---------|-----------------------------------|------|
| IZYVAPE landing | `features/izyvape/` | `components/Izyvape*.tsx`, `app/(site)/izyvape*` |
| Shopentum use case | `features/shopentum/` | `components/Shopentum*.tsx` |

Pri väčšom refaktore presúvaj sem; pri novej prezentácii preferuj `src/features/<name>/` pred ďalším plochým `components/`.

Register: [`../../SYSTEM_REGISTRY.md`](../../SYSTEM_REGISTRY.md)
