"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Layers,
  Target,
  ShieldCheck,
  TrendingDown,
  Package,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

function AccordionSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="group border border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-black uppercase tracking-widest text-white">{title}</span>
        <ChevronDown
          className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-white/10 px-5 pb-5 pt-3 text-slate-400 text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </details>
  );
}

export default function IzyvapeMvpLanding() {
  const t = useTranslations("IzyvapeMvp");

  const promiseCards = [
    {
      icon: Layers,
      title: t("cards.c1.title"),
      body: t("cards.c1.body"),
      accent: "text-blue-400",
    },
    {
      icon: Target,
      title: t("cards.c2.title"),
      body: t("cards.c2.body"),
      accent: "text-purple-400",
    },
    {
      icon: ShieldCheck,
      title: t("cards.c3.title"),
      body: t("cards.c3.body"),
      accent: "text-emerald-400",
    },
  ] as const;

  const flows = [
    {
      icon: TrendingDown,
      title: t("flows.f1.title"),
      question: t("flows.f1.question"),
      output: t("flows.f1.output"),
      chip: "text-rose-300 border-rose-500/25 bg-rose-500/10",
    },
    {
      icon: Package,
      title: t("flows.f2.title"),
      question: t("flows.f2.question"),
      output: t("flows.f2.output"),
      chip: "text-amber-300 border-amber-500/25 bg-amber-500/10",
    },
    {
      icon: Clock,
      title: t("flows.f3.title"),
      question: t("flows.f3.question"),
      output: t("flows.f3.output"),
      chip: "text-cyan-300 border-cyan-500/25 bg-cyan-500/10",
    },
  ] as const;

  const layers = [
    { title: t("acc.arch.l1t"), desc: t("acc.arch.l1d") },
    { title: t("acc.arch.l2t"), desc: t("acc.arch.l2d") },
    { title: t("acc.arch.l3t"), desc: t("acc.arch.l3d") },
    { title: t("acc.arch.l4t"), desc: t("acc.arch.l4d") },
    { title: t("acc.arch.l5t"), desc: t("acc.arch.l5d") },
  ];

  const govItems = [t("acc.gov.i1"), t("acc.gov.i2"), t("acc.gov.i3"), t("acc.gov.i4"), t("acc.gov.i5")];
  const scopeItems = [t("acc.scope.i1"), t("acc.scope.i2"), t("acc.scope.i3"), t("acc.scope.i4"), t("acc.scope.i5"), t("acc.scope.i6")];
  const metricItems = [t("acc.metrics.i1"), t("acc.metrics.i2"), t("acc.metrics.i3"), t("acc.metrics.i4")];
  const depItems = [t("acc.deps.i1"), t("acc.deps.i2"), t("acc.deps.i3"), t("acc.deps.i4")];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      <section className="relative pt-36 pb-16 md:pt-40 md:pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[42%] h-[42%] bg-purple-600/18 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[5%] left-[-12%] w-[34%] h-[34%] bg-blue-600/12 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="space-y-10 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-purple-400">
              <Layers size={12} />
              <span>{t("eyebrow")}</span>
            </div>

            <h1 className="text-4xl md:text-[3.75rem] font-sora font-black tracking-tighter leading-[1.06] text-white">
              {t("heroTitlePrefix")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                {t("heroTitleAccent")}
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
              {t("heroLead")}
            </p>

            <div className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-5 text-left">
              <p className="text-base md:text-lg text-slate-200 font-medium leading-relaxed italic border-l-2 border-purple-500/70 pl-4">
                {t("heroQuote")}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-lg shadow-white/5"
              >
                {t("primaryCta")}
                <ArrowRight size={14} />
              </Link>
              <a
                href="#podrobnosti"
                className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors py-3"
              >
                {t("secondaryCta")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tri páky */}
      <section className="relative px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{t("promiseEyebrow")}</p>
            <h2 className="text-2xl md:text-4xl font-sora font-black tracking-tight text-white">{t("promiseTitle")}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {promiseCards.map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-white/15 transition-colors"
              >
                <card.icon className={`w-10 h-10 mb-4 ${card.accent}`} strokeWidth={1.25} />
                <h3 className="text-lg font-sora font-bold text-white mb-3">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tri flow */}
      <section className="relative px-6 pb-24 border-t border-white/5 pt-20 bg-gradient-to-b from-transparent to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-400">{t("flowsEyebrow")}</p>
            <h2 className="text-2xl md:text-4xl font-sora font-black tracking-tight text-white">{t("flowsTitle")}</h2>
            <p className="max-w-2xl mx-auto text-slate-400 text-sm md:text-base">{t("flowsLead")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {flows.map((flow, idx) => (
              <motion.div
                key={flow.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="rounded-2xl border border-white/10 bg-[#070708] p-6 flex flex-col"
              >
                <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest w-fit mb-4 ${flow.chip}`}>
                  <flow.icon size={12} />
                  {t("flows.badge")}
                </div>
                <h3 className="text-lg font-sora font-bold text-white mb-3">{flow.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t("flows.questionLabel")}</p>
                <p className="text-sm text-slate-300 mb-4 flex-1">{flow.question}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{t("flows.outputLabel")}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{flow.output}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Accordions */}
      <section id="podrobnosti" className="relative px-6 pb-28 scroll-mt-28">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{t("accordionEyebrow")}</p>
            <h2 className="text-xl md:text-2xl font-sora font-black text-white">{t("accordionTitle")}</h2>
            <p className="text-sm text-slate-500">{t("accordionLead")}</p>
          </div>

          <AccordionSection title={t("acc.arch.title")}>
            <p>{t("acc.arch.intro")}</p>
            <ul className="space-y-4 pt-2">
              {layers.map((layer) => (
                <li key={layer.title} className="border-l border-purple-500/40 pl-4">
                  <span className="text-white font-semibold block">{layer.title}</span>
                  <span className="text-slate-400">{layer.desc}</span>
                </li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title={t("acc.gov.title")}>
            <ul className="list-disc pl-5 space-y-2 marker:text-purple-400">
              {govItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title={t("acc.scope.title")}>
            <ul className="list-disc pl-5 space-y-2 marker:text-rose-400">
              {scopeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title={t("acc.metrics.title")}>
            <ul className="list-disc pl-5 space-y-2 marker:text-emerald-400">
              {metricItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title={t("acc.deps.title")}>
            <ul className="list-disc pl-5 space-y-2 marker:text-blue-400">
              {depItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection title={t("acc.phase2.title")}>
            <p>{t("acc.phase2.body")}</p>
          </AccordionSection>

          <p className="text-center text-xs text-slate-600 pt-4">{t("docFootnote")}</p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative px-6 pb-32">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent px-8 py-14 text-center space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">{t("closingEyebrow")}</p>
          <h2 className="text-2xl md:text-3xl font-sora font-black text-white">{t("closingTitle")}</h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">{t("closingLead")}</p>
          <Link
            href="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-colors"
          >
            {t("closingCta")}
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
