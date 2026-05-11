"use client";

import React from "react";
import {
  Sparkles,
  ShieldCheck,
  PenLine,
  Search,
  Link2,
  ChevronRight,
  CheckCircle2,
  CircleDot,
  Lock,
  ExternalLink,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

type PriorityKind = "block" | "warn" | "opportunity";

const PRIORITY_STYLES: Record<
  PriorityKind,
  { label: string; bar: string; pill: string }
> = {
  block: {
    label: "Blokuje",
    bar: "border-l-rose-500 bg-rose-50/90",
    pill: "bg-rose-100 text-rose-800 ring-rose-200",
  },
  warn: {
    label: "Upozornenie",
    bar: "border-l-amber-500 bg-amber-50/90",
    pill: "bg-amber-100 text-amber-900 ring-amber-200",
  },
  opportunity: {
    label: "Príležitosť",
    bar: "border-l-sky-500 bg-sky-50/90",
    pill: "bg-sky-100 text-sky-900 ring-sky-200",
  },
};

const MOCK_PRIORITIES: {
  rank: number;
  kind: PriorityKind;
  title: string;
  hint: string;
}[] = [
  {
    rank: 1,
    kind: "block",
    title: "Dôvera: silné tvrdenie bez zdroja",
    hint: "Odstavec 3 · AI navrhuje zmäkčenie alebo doplnenie citácie",
  },
  {
    rank: 2,
    kind: "warn",
    title: "SEO: hlavné kľúčové slovo v sklonovanom tvare",
    hint: "Checker akceptuje lemma · overte formuláciu v tele",
  },
  {
    rank: 3,
    kind: "opportunity",
    title: "Štýl: úvod je dlhší než odporúčanie brandu",
    hint: "Skrátenie perexu môže zlepšiť CTR",
  },
];

export default function NmhCopilotShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200/80 text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2C5282] shadow-sm">
              <Sparkles className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-slate-900">
                Editorial Copilot
              </h1>
              <p className="text-xs text-slate-500">
                NMH koncept · výkladná skriňa v pravom paneli
              </p>
            </div>
          </div>
          <Link
            href="/eagle-admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-[#2C5282]/40 hover:text-[#2C5282]"
          >
            Plný EAGLE prototyp
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1400px] gap-4 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6 sm:px-6">
        {/* Fake editor */}
        <section
          aria-label="Ukážka editora článku"
          className="rounded-2xl border border-slate-200/90 bg-white shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              Draft
            </span>
            <span className="text-sm font-medium text-slate-800">
              Nová štúdia o kreatíne a mozgovom metabolizme
            </span>
          </div>
          <div className="space-y-4 p-5 text-sm leading-relaxed text-slate-700">
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Perex
            </p>
            <p className="rounded-lg bg-slate-50/80 p-3 text-slate-600">
              Výskumníci skúmajú spojenie medzi doplnkami a{' '}
              <mark className="rounded bg-amber-100/90 px-0.5 text-slate-800">
                kreatínom
              </mark>{' '}
              pri niektorých typoch kognitívnych zmien. Text je ukážkový.
            </p>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              Telo článku (výrez)
            </p>
            <p>
              Podľa predbežných záverov mohol{' '}
              <mark className="rounded bg-rose-100/80 px-0.5">
                kreatín monohydrát výrazne zvrátiť priebeh ochorenia u všetkých pacientov
              </mark>{' '}
              bez výnimky — čo je v tejto podobe príliš silné tvrdenie.
            </p>
            <p className="text-slate-500">
              Ďalší odstavce by pokračovali v editore…
            </p>
          </div>
        </section>

        {/* Right panel — výkladná skriňa */}
        <aside
          aria-label="Copilot panel"
          className="flex flex-col gap-4 lg:sticky lg:top-5"
        >
          {/* Čo teraz */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-200/50">
            <div className="border-b border-slate-100 bg-gradient-to-r from-[#2C5282] to-[#2B6CB0] px-4 py-3 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                Čo teraz
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold leading-tight">
                  Takmer pripravené
                </span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm">
                  3 priority pred odoslaním
                </span>
              </div>
            </div>
            <ul className="divide-y divide-slate-100 p-2">
              {MOCK_PRIORITIES.map((p) => {
                const st = PRIORITY_STYLES[p.kind];
                return (
                  <li
                    key={p.rank}
                    className={`rounded-xl border-l-4 p-3 ${st.bar}`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={[
                          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-1 ring-inset",
                          st.pill,
                        ].join(" ")}
                      >
                        {p.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span
                          className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${st.pill}`}
                        >
                          {st.label}
                        </span>
                        <p className="mt-1 text-sm font-medium text-slate-900">
                          {p.title}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">{p.hint}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Postup */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Postup vo workflow
            </p>
            <ol className="space-y-2">
              <StepRow
                status="done"
                label="Validácia pilierov"
                detail="Prebieha · návrhy čakajú na vás"
              />
              <StepRow
                status="current"
                label="Tagy (Krok A)"
                detail="2 návrhy čakajú na prijatie"
              />
              <StepRow
                status="locked"
                label="Interné odkazy (Krok B)"
                detail="Po prijatí tagov"
              />
              <StepRow
                status="pending"
                label="Kontrola pred publikáciou"
                detail="SEO friendly · brand checklist"
              />
            </ol>
          </div>

          {/* Pilierové sekcie */}
          <div className="space-y-3">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Aktívne návrhy podľa piliera
            </p>
            <PillarCard
              icon={<ShieldCheck className="h-4 w-4" />}
              title="Dôvera"
              tone="needs"
              summary="1 návrh na úpravu textu"
              actionLabel="Zobraziť návrh"
            />
            <PillarCard
              icon={<PenLine className="h-4 w-4" />}
              title="Štýl"
              tone="ok"
              summary="Žiadny blokujúci problém"
              actionLabel="Voliteľné tipy"
            />
            <PillarCard
              icon={<Search className="h-4 w-4" />}
              title="SEO"
              tone="needs"
              summary="Kľúčové slovo · štruktúra nadpisov"
              actionLabel="2 položky"
            />
          </div>

          {/* Linkbuilding */}
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Link2 className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              <span className="text-sm font-semibold">Interné linkovanie</span>
            </div>
            <p className="mt-2 flex items-start gap-2 text-xs text-slate-600">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              Návrhy odkazov sa odomknú po dokončení kroku Tagy. Žiadne automatické vloženie do textu.
            </p>
          </div>

          {/* Spodný súhrn */}
          <div className="rounded-xl bg-slate-800 px-4 py-3 text-white shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              Zostáva
            </p>
            <p className="mt-1 text-sm font-medium">
              3 otvorené položky · žiadne blokujúce mimo zoznamu vyššie
            </p>
          </div>
        </aside>
      </main>

      <footer className="mx-auto max-w-[1400px] px-4 py-6 text-center text-[11px] text-slate-500 sm:px-6">
        Statický koncept UI · priority sú zoradené podľa závažnosti · redaktor vždy rozhoduje
      </footer>
    </div>
  );
}

function StepRow({
  status,
  label,
  detail,
}: {
  status: "done" | "current" | "locked" | "pending";
  label: string;
  detail: string;
}) {
  const icon =
    status === "done" ? (
      <CheckCircle2 className="h-5 w-5 text-emerald-500" aria-hidden />
    ) : status === "current" ? (
      <CircleDot className="h-5 w-5 text-[#2C5282]" aria-hidden />
    ) : status === "locked" ? (
      <Lock className="h-5 w-5 text-slate-300" aria-hidden />
    ) : (
      <CircleDot className="h-5 w-5 text-slate-300" aria-hidden />
    );

  return (
    <li className="flex gap-3 rounded-lg bg-slate-50/50 px-2 py-2">
      <div className="flex shrink-0 items-center pt-0.5">{icon}</div>
      <div className="min-w-0">
        <p
          className={`text-sm font-medium ${status === "locked" ? "text-slate-400" : "text-slate-800"}`}
        >
          {label}
        </p>
        <p className="text-xs text-slate-500">{detail}</p>
      </div>
      {status === "current" && (
        <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[#2C5282]" aria-hidden />
      )}
    </li>
  );
}

function PillarCard({
  icon,
  title,
  tone,
  summary,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  tone: "ok" | "needs";
  summary: string;
  actionLabel: string;
}) {
  const ok = tone === "ok";
  return (
    <button
      type="button"
      className={[
        "flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition hover:shadow-sm",
        ok
          ? "border-emerald-200/80 bg-emerald-50/40 hover:border-emerald-300"
          : "border-slate-200 bg-white hover:border-[#2C5282]/35",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          ok ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-[#2C5282]",
        ].join(" ")}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-600">{summary}</p>
        <span className="mt-2 inline-flex items-center text-xs font-medium text-[#2C5282]">
          {actionLabel}
          <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        </span>
      </div>
    </button>
  );
}
