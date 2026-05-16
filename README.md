This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Apps v monorepe

| App | Priečinok | Produkcia |
|-----|-----------|-----------|
| **Hlavný web (Next.js)** | `/` (root) | `www.aifreelancer.sk` — `/izyvape`, `/eagle-admin`, … (voliteľne aj `/cashflow` v Next) |
| **Kanban (Vite)** | `apps/kanban` | `kanban.aifreelancer.sk` |
| **Cashflow (Vite)** | repo **`shopentum/cashflow`** | **`cashflow-omega`** → https://cashflow.aifreelancer.sk |

Priečinok `omega-cashflow/` v tomto monorepe je len lokálna kópia — **nenasadzuj** z `AIfreelancer.sk`. Detail: [`omega-cashflow/README.md`](omega-cashflow/README.md)

Detail Kanban: [`apps/kanban/README.md`](apps/kanban/README.md)

### Vercel — repozitár `shopentum/AIfreelancer.sk`

**Nechaj napojené len 2 projekty** (ostatné z dashboardu zmaž alebo **Settings → Git → Disconnect**):

| Vercel projekt | Root Directory | Doména |
|----------------|----------------|--------|
| Hlavný web (**jeden!**) | `.` (prázdne) | `www.aifreelancer.sk` |
| `kanban_app` | `apps/kanban` | `kanban.aifreelancer.sk` |

**Cashflow — z tohto repa nič:**

| Projekt (zmazať / odpojiť) | Prečo |
|----------------------------|--------|
| `cashflow` (import `AIfreelancer.sk`) | Duplicita; doména patrí na `cashflow-omega` |
| `omega-cashflow` (ak importuje monorepo) | Nepoužívať |

**Cashflow — nechaj:**

| Vercel projekt | Git repo | Doména |
|----------------|----------|--------|
| **`cashflow-omega`** | `shopentum/cashflow` | `cashflow.aifreelancer.sk` |

Over, že `cashflow.aifreelancer.sk` je **iba** v projekte `cashflow-omega` (Settings → Domains). Ak ju má ešte projekt `cashflow`, odstráň ju tam.

**Nevytváraj** Vercel projekt pre `eagle-cms`, `izyvape` — sú v Next.js (`src/app/…`).

**Zmaž / odpoj** duplicity hlavného webu: `a-ifreelancer-sk-hfyh`, `a-ifreelancer-sk-3j5k`, `eagle-cms` (ak importujú `AIfreelancer.sk`).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
