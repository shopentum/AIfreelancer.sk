This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Apps v monorepe

| App | Priečinok | `package.json` | Produkcia |
|-----|-----------|----------------|-----------|
| **Hlavný web (Next.js)** | `/` (root) | root | `www.aifreelancer.sk` — routes `/izyvape`, `/cashflow`, `/eagle-admin`, … |
| **Kanban (Vite SPA)** | `apps/kanban` | `apps/kanban/package.json` | `kanban.aifreelancer.sk` |
| **OMEGA Cashflow (Vite)** | `omega-cashflow` | `omega-cashflow/package.json` | voliteľne `cashflow.aifreelancer.sk` — duplicitne aj `/cashflow` v Next.js (`src/cashflow/`) |

Detail Kanban: [`apps/kanban/README.md`](apps/kanban/README.md)

### Vercel — jeden Git repo, viac projektov (poriadok)

**Problém:** Každý import toho istého repa spúšťa deploy na všetky napojené projekty. Duplicitné projekty s rovnakým Root Directory = chaos (doména na jednom, úspešný build na druhom).

**Maj len tieto 3 produkčné projekty** (ostatné odpoj Git alebo zmaž):

| Vercel projekt | Root Directory | `vercel.json` | Doména |
|----------------|----------------|---------------|--------|
| Hlavný web (jeden!) | `.` (prázdne) | `/vercel.json` — `ignoreCommand` preskočí build pri commitoch len do `apps/kanban` alebo `omega-cashflow` | `www.aifreelancer.sk`, `aifreelancer.sk` |
| Kanban | `apps/kanban` | `apps/kanban/vercel.json` — build len pri zmene `apps/kanban/**` | `kanban.aifreelancer.sk` |
| Cashflow (voliteľný) | `omega-cashflow` | `omega-cashflow/vercel.json` — build len pri zmene `omega-cashflow/**` | `cashflow.aifreelancer.sk` ak používaš subdoménu |

**Nevytváraj** samostatný Vercel projekt pre: `eagle-cms`, `nmh`, `izyvape` — to sú stránky v Next.js (`src/app/…`), nie samostatné appky.

**Zmaž / odpoj Git** na duplicitách typu `a-ifreelancer-sk-hfyh`, `a-ifreelancer-sk-3j5k` — nech ostane **jeden** hlavný projekt s doménou.

**Overenie po deployi:** Settings → Domains (kde je `www`) → Deployments → Production commit = `main` + build zelený → napr. `/izyvape-strategy` musí existovať.

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
