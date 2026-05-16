# Modules (`src/modules`)

**Zameranie:** väčšie interné nástroje / prototypy integrované do hlavného Next.js (`site`), **bez** vlastného Vercel projektu.

| Modul | Kód dnes | Route |
|-------|----------|-------|
| Eagle Admin | `src/eagle_admin/` | `/eagle-admin` |
| NMH | `src/app/[locale]/nmh/` | `/nmh` |

**Nepoužívaj** názov modulu ako názov Vercel projektu (`eagle-cms` bola chyba).

Pri novom module: záznam v `SYSTEM_REGISTRY.md` → sekcia **Site moduly**, nie nový riadok v tabuľke aplikácií (pokiaľ to nie je samostatná SPA v `apps/`).
