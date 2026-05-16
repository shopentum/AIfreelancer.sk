"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Layers,
  TrendingUp,
  Building2,
  CircleDollarSign,
  Mail,
  Share2,
  LineChart,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

const CARD_KEYS = ["c1", "c2", "c3", "c4", "c5", "c6"] as const;

const CARD_PHASE = {
  c1: "mvp2",
  c2: "mvp2",
  c3: "mvp2",
  c4: "mvp3",
  c5: "mvp3",
  c6: "future",
} as const;

type PhaseId = (typeof CARD_PHASE)[keyof typeof CARD_PHASE];

const PHASE_ORDER: PhaseId[] = ["mvp2", "mvp3", "future"];

const PHASE_VISUAL: Record<
  PhaseId,
  { badge: string; dot: string; stripe: string; legendActive: string }
> = {
  mvp2: {
    badge: "border-blue-500/35 bg-blue-500/10 text-blue-200 shadow-[0_0_28px_rgba(59,130,246,0.12)]",
    dot: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
    stripe: "from-blue-500/80 via-blue-400/40 to-transparent",
    legendActive: "border-blue-500/30 bg-blue-500/[0.08]",
  },
  mvp3: {
    badge: "border-amber-500/35 bg-amber-500/10 text-amber-100 shadow-[0_0_28px_rgba(245,158,11,0.1)]",
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.75)]",
    stripe: "from-amber-500/80 via-amber-400/40 to-transparent",
    legendActive: "border-amber-500/30 bg-amber-500/[0.08]",
  },
  future: {
    badge: "border-slate-500/40 bg-slate-500/10 text-slate-300 shadow-none",
    dot: "bg-slate-400",
    stripe: "from-slate-500/60 via-slate-500/25 to-transparent",
    legendActive: "border-slate-500/35 bg-slate-500/[0.06]",
  },
};

function PhaseBadge({ phase }: { phase: PhaseId }) {
  const t = useTranslations("IzyvapeStrategy");
  const visual = PHASE_VISUAL[phase];

  return (
    <motion.div
      className={`inline-flex flex-col items-end gap-1 px-3.5 py-2 rounded-xl border ${visual.badge}`}
    >
      <span className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${visual.dot}`} aria-hidden />
        <span className="text-[11px] font-black uppercase tracking-[0.22em] leading-none">
          {t(`phases.${phase}.label`)}
        </span>
      </span>
      <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500/90 leading-none">
        {t(`phases.${phase}.hint`)}
      </span>
    </motion.div>
  );
}

function PhaseLegend() {
  const t = useTranslations("IzyvapeStrategy");

  return (
    <motion.div className="mb-14 space-y-4">
      <p className="text-center text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
        {t("phaseLegendTitle")}
      </p>
      <motion.div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 sm:gap-2 max-w-3xl mx-auto">
        {PHASE_ORDER.map((phase, index) => {
          const visual = PHASE_VISUAL[phase];
          return (
            <motion.div key={phase} className="flex items-center gap-2 sm:contents">
              <motion.div
                className={`flex-1 min-w-0 rounded-2xl border px-4 py-3 text-center sm:text-left ${visual.legendActive}`}
              >
                <p className="flex items-center justify-center sm:justify-start gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${visual.dot}`} aria-hidden />
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    {t(`phases.${phase}.label`)}
                  </span>
                </p>
                <p className="mt-1.5 text-[10px] text-slate-500 leading-snug">{t(`phases.${phase}.legend`)}</p>
              </motion.div>
              {index < PHASE_ORDER.length - 1 ? (
                <ChevronRight
                  size={16}
                  className="text-slate-600 shrink-0 mx-auto sm:mx-0 rotate-90 sm:rotate-0"
                  aria-hidden
                />
              ) : null}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

const CARD_ICONS = {
  c1: TrendingUp,
  c2: Building2,
  c3: CircleDollarSign,
  c4: Mail,
  c5: Share2,
  c6: LineChart,
} as const;

const CARD_ACCENTS = {
  c1: "from-purple-600/20 to-fuchsia-600/5 border-purple-500/25",
  c2: "from-blue-600/20 to-cyan-600/5 border-blue-500/25",
  c3: "from-emerald-600/20 to-teal-600/5 border-emerald-500/25",
  c4: "from-amber-600/20 to-orange-600/5 border-amber-500/25",
  c5: "from-pink-600/20 to-rose-600/5 border-pink-500/25",
  c6: "from-slate-600/20 to-slate-500/5 border-slate-400/25",
} as const;

const CARD_ICON_COLOR = {
  c1: "text-purple-400",
  c2: "text-blue-400",
  c3: "text-emerald-400",
  c4: "text-amber-400",
  c5: "text-pink-400",
  c6: "text-slate-300",
} as const;

/** Deck stack: card N covers ~90% of card N-1; ~10% header strip of each previous card stays visible */
const CARD_VH = 70;
const PEEK_VH = CARD_VH * 0.1;
const STICKY_BASE_REM = 5.5;
const SCROLL_RUNWAY_VH = 92;
const LAST_RUNWAY_VH = 48;

function StackingDirectionCard({
  cardKey,
  index,
  total,
}: {
  cardKey: (typeof CARD_KEYS)[number];
  index: number;
  total: number;
}) {
  const t = useTranslations("IzyvapeStrategy");
  const isLast = index === total - 1;

  const Icon = CARD_ICONS[cardKey];
  const stickyTop = `calc(${STICKY_BASE_REM}rem + ${index * PEEK_VH}vh)`;
  const stackPull = index > 0 ? `calc(-${CARD_VH - PEEK_VH}vh)` : undefined;
  const examples = t(`cards.${cardKey}.examples`).split("|").filter(Boolean);
  const phase = CARD_PHASE[cardKey];
  const phaseVisual = PHASE_VISUAL[phase];
  const subtitle = t(`cards.${cardKey}.subtitle`);

  return (
    <article
      className="relative"
      style={{
        zIndex: index + 1,
        minHeight: isLast ? `${LAST_RUNWAY_VH}vh` : `${SCROLL_RUNWAY_VH}vh`,
        marginTop: stackPull,
      }}
    >
      <motion.div
        style={{ position: "sticky", top: stickyTop, zIndex: index + 1 }}
        className="will-change-transform"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-4%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`relative flex flex-col rounded-[2rem] border bg-gradient-to-br ${CARD_ACCENTS[cardKey]} bg-[#080809] overflow-hidden ring-1 ring-white/[0.07]`}
          style={{
            height: "min(70vh, 680px)",
            boxShadow: `0 ${12 + index * 4}px ${36 + index * 10}px rgba(0,0,0,${0.45 + index * 0.05})`,
          }}
        >
          <motion.div
            className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${phaseVisual.stripe}`}
            aria-hidden
          />

          <header
            className="shrink-0 flex items-center justify-between gap-2 px-5 md:px-7 border-b border-white/10 bg-[#080809] backdrop-blur-md overflow-hidden"
            style={{ height: `${PEEK_VH}vh`, minHeight: `${PEEK_VH}vh` }}
          >
            <motion.div className="flex items-center gap-2.5 min-w-0 flex-1 py-2">
              <motion.div
                className={`w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center ${CARD_ICON_COLOR[cardKey]}`}
              >
                <Icon size={20} strokeWidth={1.25} />
              </motion.div>
              <motion.div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                  {t("cardIndex", { current: index + 1, total })}
                </p>
                <h3 className="text-[13px] md:text-sm font-sora font-black text-white tracking-tight leading-snug line-clamp-2">
                  {t(`cards.${cardKey}.title`)}
                </h3>
              </motion.div>
            </motion.div>
            <motion.div className="shrink-0 scale-[0.86] origin-center py-1.5 pr-1">
              <PhaseBadge phase={phase} />
            </motion.div>
          </header>

          <motion.div className="flex-1 min-h-0 overflow-hidden px-5 pb-6 pt-4 md:px-8 md:pb-7 md:pt-5 flex flex-col">
            {subtitle ? <p className="text-sm text-slate-500 mb-4 shrink-0">{subtitle}</p> : null}

            <motion.div className="grid md:grid-cols-2 gap-5 md:gap-7 flex-1 min-h-0">
              <motion.div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-rose-400/90">
                  {t("labelProblem")}
                </p>
                <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">{t(`cards.${cardKey}.problem`)}</p>
              </motion.div>
              <motion.div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-400/90">
                  {t("labelProposal")}
                </p>
                <p className="text-sm md:text-[15px] text-slate-300 leading-relaxed">{t(`cards.${cardKey}.proposal`)}</p>
              </motion.div>
            </motion.div>

            {examples.length > 0 ? (
              <motion.div className="mt-4 pt-4 border-t border-white/10 shrink-0">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500 mb-2">
                  {t("labelExamples")}
                </p>
                <ul className="grid sm:grid-cols-2 gap-1.5">
                  {examples.map((item) => (
                    <li key={item} className="text-xs md:text-sm text-slate-400 pl-3 border-l border-white/10 leading-snug">
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </motion.div>
        </motion.div>
      </motion.div>
    </article>
  );
}

export default function IzyvapeStrategyLanding() {
  const t = useTranslations("IzyvapeStrategy");

  return (
    <motion.div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-40 md:pb-20 px-6 overflow-hidden">
        <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <motion.div className="absolute top-[-10%] right-[-10%] w-[42%] h-[42%] bg-purple-600/18 rounded-full blur-[120px] animate-pulse" />
          <motion.div className="absolute bottom-[5%] left-[-12%] w-[34%] h-[34%] bg-blue-600/12 rounded-full blur-[100px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto relative z-10 text-center space-y-8"
        >
          <motion.div>
            <Link
              href="/izyvape"
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft size={14} />
              {t("backLink")}
            </Link>
          </motion.div>

          <motion.div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-purple-400">
            <Layers size={12} />
            <span>{t("eyebrow")}</span>
          </motion.div>

          <h1 className="text-4xl md:text-[3.25rem] font-sora font-black tracking-tighter leading-[1.08] text-white">
            {t("heroTitlePrefix")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
              {t("heroTitleAccent")}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
            {t("heroLead")}
          </p>
        </motion.div>
      </section>

      <section className="relative px-6 pb-8">
        <motion.div className="max-w-4xl mx-auto text-center mb-12 space-y-3">
          <motion.p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-400">{t("stackEyebrow")}</motion.p>
          <motion.h2 className="text-2xl md:text-3xl font-sora font-black text-white">{t("stackTitle")}</motion.h2>
          <motion.p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">{t("stackLead")}</motion.p>
        </motion.div>
      </section>

      <section className="relative px-6 pb-12 md:pb-16">
        <motion.div className="max-w-4xl mx-auto">
          <PhaseLegend />
          <motion.div className="relative">
            {CARD_KEYS.map((key, index) => (
              <StackingDirectionCard key={key} cardKey={key} index={index} total={CARD_KEYS.length} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="relative px-6 pb-28 md:pb-36 border-t border-white/5 pt-12 md:pt-16 bg-gradient-to-b from-transparent to-purple-950/15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-8 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-400">{t("closingEyebrow")}</p>
          <h2 className="text-2xl md:text-4xl font-sora font-black text-white tracking-tight">{t("closingTitle")}</h2>
          <p className="text-slate-400 leading-relaxed text-left md:text-center">{t("closingLead")}</p>
          <motion.div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-6 text-left">
            <p className="text-base md:text-lg text-slate-200 font-medium leading-relaxed border-l-2 border-purple-500/70 pl-4">
              {t("closingQuote")}
            </p>
          </motion.div>
          <p className="text-sm text-slate-500 leading-relaxed">{t("closingPrinciple")}</p>
        </motion.div>
      </section>
    </motion.div>
  );
}
