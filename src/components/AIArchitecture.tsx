"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Search,
  PenTool,
  CheckCircle2,
  Share2,
  Fingerprint,
  Database,
  Lock,
  ArrowRight,
  Zap,
  Layers,
  History,
  Cpu,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

/** Fixed particle paths — avoids Math.random() SSR/hydration mismatch */
const FLOW_PARTICLES: Array<{
  cx: number[];
  cy: number[];
  fill: string;
  duration: number;
  delay?: number;
  r: number;
}> = [
  { cx: [300, 900], cy: [300, 300], fill: "#f59e0b", duration: 4, r: 4 },
  { cx: [300, 900], cy: [300, 300], fill: "#f59e0b", duration: 4, delay: 2, r: 3 },
  { cx: [900, 900], cy: [300, 600], fill: "#ef4444", duration: 3, r: 4 },
  { cx: [900, 300], cy: [600, 600], fill: "#10b981", duration: 4, r: 4 },
  { cx: [300, 300], cy: [600, 300], fill: "#3b82f6", duration: 3, r: 4 },
  /* Vertical: governance → engine */
  { cx: [600, 600], cy: [120, 280], fill: "#60a5fa", duration: 2.8, r: 3 },
  { cx: [600, 600], cy: [120, 280], fill: "#93c5fd", duration: 2.8, delay: 1.4, r: 2.5 },
  /* Vertical: engine → core */
  { cx: [600, 600], cy: [520, 700], fill: "#60a5fa", duration: 2.6, r: 3 },
  { cx: [600, 600], cy: [520, 700], fill: "#93c5fd", duration: 2.6, delay: 1.3, r: 2.5 },
];

const NOISE_PARTICLES: Array<{ cx: number[]; cy: number[]; duration: number }> = [
  { cx: [120, 480], cy: [200, 420], duration: 5 },
  { cx: [800, 1050], cy: [150, 310], duration: 7 },
  { cx: [400, 920], cy: [500, 180], duration: 6 },
  { cx: [200, 640], cy: [380, 120], duration: 8 },
  { cx: [950, 700], cy: [220, 580], duration: 5.5 },
  { cx: [550, 200], cy: [100, 400], duration: 7.5 },
  { cx: [720, 1100], cy: [450, 200], duration: 6.5 },
  { cx: [300, 850], cy: [650, 350], duration: 8.5 },
];

const BENEFITS: Array<{
  icon: typeof ShieldCheck;
  slug: "b1" | "b2" | "b3" | "b4";
  iconClass: string;
}> = [
  { icon: ShieldCheck, slug: "b1", iconClass: "text-blue-400" },
  { icon: Layers, slug: "b2", iconClass: "text-purple-400" },
  { icon: History, slug: "b3", iconClass: "text-amber-400" },
  { icon: Zap, slug: "b4", iconClass: "text-emerald-400" },
];

const LIST_KEYS = ["i1", "i2", "i3", "i4", "i5"] as const;

/** Vertikálny „tok“ medzi vrstvami architektúry */
function VerticalFlowBridge({ variant }: { variant: "toEngine" | "toCore" }) {
  const trackClass =
    variant === "toEngine"
      ? "bg-gradient-to-b from-blue-500/80 via-blue-400/35 to-transparent"
      : "bg-gradient-to-b from-transparent via-blue-400/30 to-blue-500/75";
  const duration = variant === "toEngine" ? 2.35 : 2.15;

  return (
    <div
      className="relative z-[6] flex flex-col items-center justify-center py-2 pointer-events-none"
      aria-hidden
    >
      <div className={`relative h-20 w-[2px] rounded-full ${trackClass}`}>
        <motion.div
          className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.95)]"
          animate={{ y: [0, 72] }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}

const AIArchitecture: React.FC = () => {
  const t = useTranslations("AIArchitecture");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
              <Cpu size={12} />
              <span>{t("heroBadge")}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-sora font-black tracking-tighter leading-[1.1] text-white max-w-5xl">
              {t("heroTitleLine1")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                {t("heroTitleAccent")}
              </span>
            </h1>

            <p className="w-full max-w-5xl md:max-w-6xl text-xl md:text-2xl text-slate-400 font-medium italic leading-relaxed text-balance px-2">
              {t("heroLead")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pt-4 pb-8 px-3 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 w-full min-w-0">
          <div className="text-center mb-12 sm:mb-20 px-1">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-sora font-black tracking-tighter mb-6 text-balance">
              {t("diagramTitle")}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-medium text-balance">
              {t("diagramLead")}
            </p>
          </div>

          <div className="relative p-4 sm:p-6 md:p-8 lg:pt-16 lg:pb-10 bg-white/[0.02] backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem] lg:rounded-[4rem] border border-white/5 shadow-2xl w-full min-w-0">
            <div className="flex justify-center mb-0 w-full min-w-0">
              <motion.div
                whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 0 30px rgba(59,130,246,0.2)",
                }}
                animate={{
                  boxShadow: [
                    "0 0 28px rgba(59,130,246,0.12)",
                    "0 0 48px rgba(59,130,246,0.22)",
                    "0 0 28px rgba(59,130,246,0.12)",
                  ],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-full min-w-0 bg-white/5 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] text-center relative z-20 transition-all"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3">
                  <div className="shrink-0 p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Lock size={24} />
                  </div>
                  <h3 className="font-black text-white uppercase tracking-tight text-base sm:text-lg md:text-2xl text-balance max-w-full leading-snug">
                    {t("governance.title")}
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider sm:tracking-widest text-balance px-1">
                  {t("governance.sub")}
                </p>
              </motion.div>
            </div>

            <VerticalFlowBridge variant="toEngine" />

            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <svg className="w-full h-full opacity-80" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow-arch">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="arch-connector-v" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                <motion.line
                  x1="600"
                  y1="88"
                  x2="600"
                  y2="278"
                  stroke="url(#arch-connector-v)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.18, 0.5, 0.18] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.line
                  x1="600"
                  y1="518"
                  x2="600"
                  y2="712"
                  stroke="url(#arch-connector-v)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray="6 14"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.18, 0.48, 0.18] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                />

                {FLOW_PARTICLES.map((p, i) => (
                  <motion.circle
                    key={`flow-${i}`}
                    r={p.r}
                    fill={p.fill}
                    filter="url(#glow-arch)"
                    animate={{
                      cx: p.cx,
                      cy: p.cy,
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{ repeat: Infinity, duration: p.duration, ease: "linear", delay: p.delay ?? 0 }}
                  />
                ))}

                {NOISE_PARTICLES.map((p, i) => (
                  <motion.circle
                    key={`noise-${i}`}
                    r={1.5}
                    fill="#3b82f6"
                    animate={{
                      cx: p.cx,
                      cy: p.cy,
                      opacity: [0, 0.6, 0],
                    }}
                    transition={{ repeat: Infinity, duration: p.duration, ease: "linear" }}
                  />
                ))}
              </svg>
            </div>

            <div className="p-3 sm:p-5 md:p-8 lg:p-10 border-2 border-dashed border-white/5 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] relative bg-black/20 w-full min-w-0">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative items-stretch w-full min-w-0">
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-[auto_auto_auto] gap-5 sm:gap-6 lg:gap-8 w-full min-w-0">
                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)" }}
                    className="order-1 sm:order-none sm:col-start-1 sm:row-start-1 bg-white/[0.03] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-amber-500/30 shadow-sm space-y-5 sm:space-y-6 transition-all w-full min-w-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="shrink-0 p-2 bg-amber-500/10 rounded-lg text-amber-400">
                        <Search size={22} className="sm:w-6 sm:h-6" />
                      </div>
                      <h4 className="font-black text-white uppercase tracking-tight text-sm sm:text-base md:text-lg leading-snug text-balance min-w-0 flex-1">
                        {t("discovery.title")}
                      </h4>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2.5 sm:space-y-3 text-slate-400 font-medium">
                      {LIST_KEYS.map((k) => (
                        <li key={k} className="flex items-start gap-2.5 sm:gap-3">
                          <div className="mt-1.5 shrink-0 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                          <span className="min-w-0 leading-snug">{t(`discovery.${k}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
                    className="order-2 sm:order-none sm:col-start-2 sm:row-start-1 bg-white/[0.03] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-red-500/30 shadow-sm space-y-5 sm:space-y-6 transition-all w-full min-w-0"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="shrink-0 p-2 bg-red-500/10 rounded-lg text-red-400">
                          <ShieldCheck size={22} className="sm:w-6 sm:h-6" />
                        </div>
                        <h4 className="font-black text-white uppercase tracking-tight text-sm sm:text-base md:text-lg leading-snug text-balance min-w-0">
                          {t("validation.title")}
                        </h4>
                      </div>
                      <CheckCircle2 size={20} className="text-red-500/50 shrink-0 hidden sm:block" />
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2.5 sm:space-y-3 text-slate-400 font-medium">
                      {LIST_KEYS.map((k) => (
                        <li key={k} className="flex items-start gap-2.5 sm:gap-3">
                          <div className="mt-1.5 shrink-0 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                          <span className="min-w-0 leading-snug">{t(`validation.${k}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
                    className="order-5 sm:order-none sm:col-start-1 sm:row-start-2 bg-white/[0.03] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-sm space-y-5 sm:space-y-6 transition-all w-full min-w-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="shrink-0 p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <PenTool size={22} className="sm:w-6 sm:h-6" />
                      </div>
                      <h4 className="font-black text-white uppercase tracking-tight text-sm sm:text-base md:text-lg leading-snug text-balance min-w-0 flex-1">
                        {t("creation.title")}
                      </h4>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2.5 sm:space-y-3 text-slate-400 font-medium">
                      {LIST_KEYS.map((k) => (
                        <li key={k} className="flex items-start gap-2.5 sm:gap-3">
                          <div className="mt-1.5 shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          <span className="min-w-0 leading-snug">{t(`creation.${k}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <div className="order-3 sm:order-none sm:col-start-2 sm:row-start-2 flex justify-center items-center py-2 sm:py-3 pointer-events-none w-full min-w-0">
                    <div className="bg-blue-600 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full border-2 border-[#030303] shadow-[0_0_20px_rgba(37,99,235,0.4)] text-[9px] sm:text-[10px] font-black text-white uppercase tracking-wide sm:tracking-widest text-center leading-tight max-w-[min(100%,240px)] sm:max-w-none">
                      {t("publishGate.line1")}
                      <br />
                      {t("publishGate.line2")}
                    </div>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
                    className="order-4 sm:order-none sm:col-start-2 sm:row-start-3 bg-white/[0.03] p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-emerald-500/30 shadow-sm space-y-5 sm:space-y-6 transition-all w-full min-w-0"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="shrink-0 p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                        <Share2 size={22} className="sm:w-6 sm:h-6" />
                      </div>
                      <h4 className="font-black text-white uppercase tracking-tight text-sm sm:text-base md:text-lg leading-snug text-balance min-w-0 flex-1">
                        {t("distribution.title")}
                      </h4>
                    </div>
                    <ul className="text-xs sm:text-sm space-y-2.5 sm:space-y-3 text-slate-400 font-medium">
                      {LIST_KEYS.map((k) => (
                        <li key={k} className="flex items-start gap-2.5 sm:gap-3">
                          <div className="mt-1.5 shrink-0 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="min-w-0 leading-snug">{t(`distribution.${k}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                <div className="lg:col-span-4 w-full min-w-0">
                  <motion.div
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 0 30px rgba(59,130,246,0.3)",
                    }}
                    className="h-full min-h-[280px] sm:min-h-0 bg-white/[0.08] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-blue-500/30 shadow-xl flex flex-col items-center justify-center text-center gap-6 sm:gap-8 transition-all w-full"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-500/20 rounded-full flex items-center justify-center shadow-inner border border-blue-500/30 shrink-0">
                      <Fingerprint size={44} className="text-blue-400 max-sm:scale-90" />
                    </div>
                    <div className="space-y-3 sm:space-y-4 w-full min-w-0 px-1">
                      <h4 className="font-black text-white uppercase tracking-tight text-base sm:text-lg md:text-xl text-balance leading-snug">
                        {t("identity.title")}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed text-balance">
                        {t("identity.desc")}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            <VerticalFlowBridge variant="toCore" />

            <div className="flex justify-center mt-2 w-full min-w-0">
              <motion.div
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                animate={{
                  boxShadow: [
                    "0 0 22px rgba(59,130,246,0.1)",
                    "0 0 40px rgba(59,130,246,0.2)",
                    "0 0 22px rgba(59,130,246,0.1)",
                  ],
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="w-full min-w-0 bg-white/5 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl border border-blue-500/20 shadow-md text-center relative z-20 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3">
                  <div className="shrink-0 p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Database size={24} />
                  </div>
                  <h3 className="font-black text-white uppercase tracking-tight text-base sm:text-lg md:text-2xl text-balance max-w-full leading-snug">
                    {t("core.title")}
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wide sm:tracking-[0.15em] md:tracking-[0.2em] text-balance px-1 leading-relaxed">
                  {t("core.sub")}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-8 pb-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {BENEFITS.map((benefit, idx) => (
              <motion.div
                key={benefit.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform">
                  <benefit.icon size={28} className={benefit.iconClass} />
                </div>
                <h3 className="text-xl font-bold text-white">{t(`benefits.${benefit.slug}.title`)}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{t(`benefits.${benefit.slug}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-4 pb-10 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <p className="text-lg md:text-2xl font-sora font-extralight leading-snug text-slate-200/95 text-balance">
                &ldquo;{t("quote")}&rdquo;
              </p>
              <div className="flex items-center space-x-4 pt-6">
                <div className="h-px w-12 bg-blue-500/40" />
                <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-blue-400/90">{t("quoteRole")}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pt-2 pb-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter leading-tight">{t("cta.title")}</h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">{t("cta.lead")}</p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/kontakt")}
                className="group relative px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 mx-auto flex items-center space-x-4"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>{t("cta.button")}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AIArchitecture;
