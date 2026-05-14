"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Layers,
  TrendingDown,
  Package,
  Clock,
  ArrowRight,
  Activity,
  Target,
  ShoppingBag,
  Landmark,
  BarChart3,
  Plug,
  ListTodo,
  ClipboardList,
  UserCircle,
  FileSpreadsheet,
  Terminal,
  LayoutGrid,
  Network,
  Github,
  Database,
  Zap,
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

/** Tok dát v štýle Shopentum case study – vstupy / jadro / výstupy ako úlohy */
function IzyvapeDataFlowDiagram() {
  const t = useTranslations("IzyvapeMvp");

  const inputs = [
    { icon: ShoppingBag, label: t("diagram.inputs.i1"), color: "text-blue-400" },
    { icon: Landmark, label: t("diagram.inputs.i2"), color: "text-blue-500" },
    { icon: BarChart3, label: t("diagram.inputs.i3"), color: "text-fuchsia-500" },
    { icon: Plug, label: t("diagram.inputs.i4"), color: "text-blue-400" },
  ] as const;

  const outputs = [
    { icon: ListTodo, label: t("diagram.outputs.i1"), color: "text-purple-400" },
    { icon: ClipboardList, label: t("diagram.outputs.i2"), color: "text-blue-400" },
    { icon: UserCircle, label: t("diagram.outputs.i3"), color: "text-emerald-400" },
    { icon: FileSpreadsheet, label: t("diagram.outputs.i4"), color: "text-amber-400" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.75 }}
      className="relative w-full max-w-7xl mx-auto"
    >
      <div className="text-center mb-14 md:mb-20 space-y-4 px-2">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-sora font-black tracking-tighter text-white leading-tight">
          {t("diagram.title")}
        </h2>
        <p className="max-w-3xl mx-auto text-slate-400 text-base md:text-lg leading-relaxed">
          {t("diagram.lead")}
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-60 z-0">
          <style>{`
            @keyframes izyvape-dash-flow {
              to { stroke-dashoffset: -20; }
            }
            .izyvape-animate-dash {
              animation: izyvape-dash-flow 1.5s linear infinite;
            }
          `}</style>
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 600" preserveAspectRatio="none">
            <defs>
              <linearGradient id="izyvape-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                <stop offset="50%" stopColor="rgba(59,130,246,0.55)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>
            <path d="M 280 120 L 380 160" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 280 240 L 380 260" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 280 360 L 380 340" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 280 480 L 380 440" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 820 160 L 920 120" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 820 260 L 920 240" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 820 340 L 920 360" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
            <path d="M 820 440 L 920 480" stroke="url(#izyvape-line-grad)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="izyvape-animate-dash" />
          </svg>
        </div>

        <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 text-center lg:text-left">
            {t("diagram.inputsTitle")}
          </p>
          {inputs.map((item, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md group hover:border-purple-500/50 transition-all shadow-lg shadow-black/20"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-black/60 flex items-center justify-center ${item.color} border border-white/5`}
              >
                <item.icon size={24} />
              </div>
              <span className="text-xs font-black tracking-widest text-left">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="lg:col-span-6 flex justify-center py-12 lg:py-0">
          <div className="relative w-full max-w-md rounded-[4rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 p-10 flex flex-col items-center justify-center text-center space-y-8 overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.22)]">
            <div className="absolute inset-0 bg-blue-500/15 blur-[120px] rounded-full" />

            <div className="relative w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center p-4 shadow-xl shadow-blue-500/20">
              <Layers size={40} className="text-blue-400" strokeWidth={1.25} />
            </div>

            <div className="space-y-3 relative">
              <h3 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">{t("diagram.engineBrand")}</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.45em] text-blue-400">{t("diagram.engineLabel")}</p>
            </div>

            <p className="text-base text-slate-300 leading-relaxed font-medium relative">{t("diagram.engineLead")}</p>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 text-center lg:text-right">
            {t("diagram.outputsTitle")}
          </p>
          {outputs.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md group hover:border-blue-500/50 transition-all shadow-lg shadow-black/20"
            >
              <span className="text-xs font-black tracking-widest text-left lg:text-right lg:order-2">{item.label}</span>
              <div
                className={`w-12 h-12 rounded-xl bg-black/60 flex items-center justify-center ${item.color} border border-white/5 lg:order-1`}
              >
                <item.icon size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function IzyvapeMvpLanding() {
  const t = useTranslations("IzyvapeMvp");
  const tAgency = useTranslations("Agency");

  const essenceSteps = [
    {
      icon: Activity,
      title: t("essence.s1.title"),
      body: t("essence.s1.body"),
      accent: "text-blue-400",
    },
    {
      icon: Layers,
      title: t("essence.s2.title"),
      body: t("essence.s2.body"),
      accent: "text-purple-400",
    },
    {
      icon: ListTodo,
      title: t("essence.s3.title"),
      body: t("essence.s3.body"),
      accent: "text-emerald-400",
    },
  ] as const;

  const snapshotBullets = [t("snapshot.b1"), t("snapshot.b2"), t("snapshot.b3"), t("snapshot.b4")];

  const stackItems = [
    { name: "Cursor", icon: Terminal, desc: tAgency("stack.cursor"), color: "text-sky-400" },
    { name: "Claude", icon: LayoutGrid, desc: tAgency("stack.builder"), color: "text-blue-500" },
    { name: "API First", icon: Network, desc: tAgency("stack.api"), color: "text-purple-500" },
    { name: "Github", icon: Github, desc: tAgency("stack.github"), color: "text-slate-200" },
    { name: "Supabase", icon: Database, desc: tAgency("stack.supabase"), color: "text-emerald-500" },
    { name: "Vercel", icon: Zap, desc: tAgency("stack.vercel"), color: "text-white" },
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

  const govItems = [t("acc.gov.i1"), t("acc.gov.i2"), t("acc.gov.i3"), t("acc.gov.i4"), t("acc.gov.i5")];
  const scopeItems = [
    t("acc.scope.i1"),
    t("acc.scope.i2"),
    t("acc.scope.i3"),
    t("acc.scope.i4"),
    t("acc.scope.i5"),
    t("acc.scope.i6"),
  ];
  const metricItems = [t("acc.metrics.i1"), t("acc.metrics.i2"), t("acc.metrics.i3"), t("acc.metrics.i4")];
  const depItems = [t("acc.deps.i1"), t("acc.deps.i2"), t("acc.deps.i3"), t("acc.deps.i4")];

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero – krátka podstata */}
      <section className="relative pt-36 pb-12 md:pt-40 md:pb-16 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[42%] h-[42%] bg-purple-600/18 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[5%] left-[-12%] w-[34%] h-[34%] bg-blue-600/12 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-purple-400">
              <Layers size={12} />
              <span>{t("eyebrow")}</span>
            </div>

            <h1 className="mt-8 text-4xl md:text-[3.5rem] font-sora font-black tracking-tighter leading-[1.06] text-white">
              {t("heroTitlePrefix")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                {t("heroTitleAccent")}
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-400 font-medium leading-relaxed">{t("heroLead")}</p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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

      {/* 1. Diagram toku – ako Shopentum */}
      <section className="relative pb-20 md:pb-28 px-6 border-t border-white/5 pt-16 md:pt-20 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_65%)]">
        <IzyvapeDataFlowDiagram />
      </section>

      {/* 2. Čo presne budujeme */}
      <section className="relative px-6 pb-24 border-t border-white/5 pt-16 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{t("essence.eyebrow")}</p>
            <h2 className="text-2xl md:text-4xl font-sora font-black tracking-tight text-white">{t("essence.title")}</h2>
            <p className="max-w-3xl mx-auto text-slate-400 leading-relaxed">{t("essence.lead")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {essenceSteps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.07 }}
                className="rounded-2xl border border-white/10 bg-[#070708] p-6 hover:border-white/15 transition-colors"
              >
                <step.icon className={`w-10 h-10 mb-4 ${step.accent}`} strokeWidth={1.25} />
                <h3 className="text-lg font-sora font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Snapshot – časové úseky */}
      <section className="relative px-6 pb-24 pt-4">
        <div className="max-w-5xl mx-auto rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-950/40 via-[#070708] to-purple-950/25 p-8 md:p-12 space-y-8">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-blue-400">{t("snapshot.eyebrow")}</p>
            <h2 className="text-2xl md:text-3xl font-sora font-black text-white">{t("snapshot.title")}</h2>
            <p className="text-slate-400 leading-relaxed max-w-3xl">{t("snapshot.lead")}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {snapshotBullets.map((line) => (
              <li
                key={line}
                className="flex gap-3 items-start text-sm text-slate-300 leading-relaxed border border-white/5 rounded-xl bg-white/[0.03] p-4"
              >
                <Target className="w-5 h-5 shrink-0 text-purple-400 mt-0.5" strokeWidth={1.5} />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Stack – zhoda s Agency */}
      <section className="relative px-6 pb-24 border-t border-white/5 pt-16 bg-black/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">{tAgency("stackEyebrow")}</p>
            <h2 className="text-2xl md:text-4xl font-sora font-black tracking-tighter uppercase">{tAgency("stackTitle")}</h2>
            <p className="max-w-2xl mx-auto text-sm text-slate-500">{t("stackFootnote")}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {stackItems.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-5 hover:bg-white/[0.07] transition-all"
              >
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 bg-white/5 rounded-2xl flex items-center justify-center ${tech.color} border border-white/5`}
                >
                  <tech.icon size={24} className="md:w-7 md:h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">{tech.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <Link
              href="/agency"
              className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              {t("stackLinkLabel")}
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. MVP príklady use case */}
      <section className="relative px-6 pb-24 border-t border-white/5 pt-16 bg-gradient-to-b from-transparent to-purple-950/15">
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
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="rounded-2xl border border-white/10 bg-[#070708] p-6 flex flex-col"
              >
                <div
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest w-fit mb-4 ${flow.chip}`}
                >
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

      {/* 6. Accordions */}
      <section id="podrobnosti" className="relative px-6 pb-28 scroll-mt-28 border-t border-white/5 pt-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-10 space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{t("accordionEyebrow")}</p>
            <h2 className="text-xl md:text-2xl font-sora font-black text-white">{t("accordionTitle")}</h2>
            <p className="text-sm text-slate-500">{t("accordionLead")}</p>
          </div>

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

      {/* CTA */}
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
