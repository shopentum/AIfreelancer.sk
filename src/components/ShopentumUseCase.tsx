"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  AlertCircle,
  Zap,
  Layers,
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  LayoutGrid,
  Search,
  Activity,
  Bot,
  ShoppingCart,
  Target,
} from "lucide-react";
import { useRouter } from "next/navigation";

const ShopentumUseCase: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("Shopentum");

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-purple-500/30 overflow-x-hidden">
      {/* 🧩 1. HERO (hook) */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)] pointer-events-none"></div>
              <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500">{t("eyebrow")}</p>
            <h1 className="font-sora font-black tracking-tighter leading-[0.9] text-white flex flex-col items-center">
              <span className="text-3xl md:text-5xl opacity-80 mb-2">{t("heroTitle")}</span>
              <span className="text-6xl md:text-9xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 mb-4">
                Shopentum
              </span>
              <span className="text-2xl md:text-4xl opacity-60">{t("heroSubTitle")}</span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 font-medium italic leading-relaxed">
              {t("heroLead")}
            </p>
          </motion.div>

          {/* Fading Divider */}
          <div className="pt-16 pb-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          {/* Shopentum Architecture Diagram - REFINED VERSION */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter">
                {t("diagramTitle")}
              </h2>
              <p className="max-w-3xl mx-auto text-slate-400 italic">
                {t("diagramLead")}
              </p>
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Connecting Lines (Desktop Only) - Refined to be visible in gaps */}
              <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-60 z-0">
                <style>{`
                  @keyframes dash-flow {
                    to { stroke-dashoffset: -20; }
                  }
                  .animate-dash {
                    animation: dash-flow 1.5s linear infinite;
                  }
                `}</style>
                <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 600" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="line-grad-left" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(59,130,246,0)" />
                      <stop offset="50%" stopColor="rgba(59,130,246,0.6)" />
                      <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Left side connections (Inputs -> Engine) - Visible in the gap */}
                  <path d="M 280 120 L 380 160" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  <path d="M 280 240 L 380 260" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  <path d="M 280 360 L 380 340" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  <path d="M 280 480 L 380 440" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  
                  {/* Right side connections (Engine -> Modules) - Visible in the gap */}
                  <path d="M 820 160 L 920 120" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  <path d="M 820 260 L 920 240" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  <path d="M 820 340 L 920 360" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                  <path d="M 820 440 L 920 480" stroke="url(#line-grad-left)" fill="none" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
                </svg>
              </div>

              {/* Left Column: DÁTOVÉ VSTUPY */}
              <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 text-center lg:text-left">{t("inputsTitle")}</p>
                {[
                  { icon: Activity, label: t("inputs.i1"), color: "text-blue-400" },
                  { icon: Target, label: t("inputs.i2"), color: "text-blue-500" },
                  { icon: Layers, label: t("inputs.i3"), color: "text-fuchsia-500" },
                  { icon: Search, label: t("inputs.i4"), color: "text-blue-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4 p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md group hover:border-purple-500/50 transition-all shadow-lg shadow-black/20">
                    <div className={`w-12 h-12 rounded-xl bg-black/60 flex items-center justify-center ${item.color} border border-white/5`}>
                      <item.icon size={24} />
                    </div>
                    <span className="text-xs font-black tracking-widest text-left">{item.label}</span>
                  </div>
                ))}
              </div>

              {/* Center Column: SHOPENTUM ENGINE */}
              <div className="lg:col-span-6 flex justify-center py-12 lg:py-0">
                <div className="relative w-full max-w-md rounded-[4rem] bg-gradient-to-b from-white/10 to-transparent border border-white/20 p-10 flex flex-col items-center justify-center text-center space-y-8 overflow-hidden shadow-[0_0_150px_rgba(59,130,246,0.25)]">
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full"></div>
                  
                  <div className="relative w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center p-4 shadow-xl shadow-blue-500/20">
                    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full overflow-visible">
                      <rect x="20" y="55" width="12" height="25" rx="4" fill="#4F46E5" />
                      <rect x="44" y="35" width="12" height="45" rx="4" fill="#06b6d4" />
                      <rect x="68" y="15" width="12" height="65" rx="4" fill="#10b981" />
                      <circle cx="26" cy="55" r="4" fill="#32317D" stroke="#4F46E5" strokeWidth="2" />
                      <circle cx="50" cy="35" r="5" fill="#32317D" stroke="#06b6d4" strokeWidth="2" className="animate-pulse" />
                      <circle cx="74" cy="15" r="6" fill="#32317D" stroke="#10b981" strokeWidth="2" />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-5xl font-sora font-black tracking-tighter uppercase">SHOPENTUM</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400">{t("engineLabel")}</p>
                  </div>

                  <p className="text-base text-slate-300 leading-relaxed font-medium">
                    {t("engineLead")}
                  </p>
                </div>
              </div>

              {/* Right Column: EXEKUTÍVNE MODULY */}
              <div className="lg:col-span-3 flex flex-col justify-center space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6 text-center lg:text-right">{t("modulesTitle")}</p>
                {[
                  { icon: Bot, label: t("modules.i1"), color: "text-purple-400" },
                  { icon: ShoppingCart, label: t("modules.i2"), color: "text-blue-400" },
                  { icon: TrendingUp, label: t("modules.i3"), color: "text-emerald-400" },
                  { icon: Zap, label: t("modules.i4"), color: "text-yellow-400" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md group hover:border-blue-500/50 transition-all shadow-lg shadow-black/20">
                    <span className="text-xs font-black tracking-widest">{item.label}</span>
                    <div className={`w-12 h-12 rounded-xl bg-black/60 flex items-center justify-center ${item.color} border border-white/5`}>
                      <item.icon size={24} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2️⃣ PROBLÉM (REALITA) */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">{t("problemEyebrow")}</p>
              <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter">{t("problemTitle")}</h2>
            </div>
          </div>
          
          <div className="grid gap-6">
            {[
              t("problems.i1"),
              t("problems.i2"),
              t("problems.i3"),
              t("problems.i4")
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all group">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <span className="text-lg font-medium text-slate-300 group-hover:text-white transition-colors">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ PRÍSTUP (TU SA ODLIŠUJEŠ) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">{t("architectureEyebrow")}</p>
            <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter">{t("architectureTitle")}</h2>
            <p className="max-w-2xl mx-auto text-slate-400">{t("architectureLead")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Layers, 
                title: t("architectureCards.c1.title"), 
                desc: t("architectureCards.c1.desc") 
              },
              { 
                icon: Zap, 
                title: t("architectureCards.c2.title"), 
                desc: t("architectureCards.c2.desc") 
              },
              { 
                icon: TrendingUp, 
                title: t("architectureCards.c3.title"), 
                desc: t("architectureCards.c3.desc") 
              },
              { 
                icon: Search, 
                title: t("architectureCards.c4.title"), 
                desc: t("architectureCards.c4.desc") 
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6 hover:border-blue-500/30 transition-all group">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <item.icon size={24} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4️⃣ RIEŠENIE (KONKRÉTNE) */}
      <section className="py-32 px-6 bg-purple-900/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full"></div>
            <div className="relative p-8 rounded-[3rem] bg-black border border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{t("log.file")}</span>
              </div>
              <div className="space-y-4 font-mono text-xs">
                <p className="text-emerald-400">{t("log.l1")}</p>
                <p className="text-blue-400">{t("log.l2")}</p>
                <p className="text-purple-400">{t("log.l3")}</p>
                <p className="text-yellow-400">{t("log.l4")}</p>
                <p className="text-white opacity-50">{t("log.l5")}</p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">{t("solutionEyebrow")}</p>
              <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter">{t("solutionTitle")}</h2>
            </div>
            <div className="space-y-6">
              {[
                { icon: Activity, text: t("solutionList.i1") },
                { icon: Search, text: t("solutionList.i2") },
                { icon: BrainCircuit, text: t("solutionList.i3") },
                { icon: ShieldCheck, text: t("solutionList.i4") }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="mt-1.5 w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-400">
                    <item.icon size={16} />
                  </div>
                  <p className="text-lg text-slate-300 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ DÔKAZ (KRITICKÉ) */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Visual A: Dashboard */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                <Image
                  src="https://picsum.photos/seed/dashboard/800/800?grayscale"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <LayoutGrid size={48} className="text-purple-500/50" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-xs font-black uppercase tracking-widest">{t("visuals.dashboardLabel")}</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-center">{t("visuals.dashboardTitle")}</h4>
            </div>

            {/* Visual B: Findings */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                <Image
                  src="https://picsum.photos/seed/findings/800/800?grayscale"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <BrainCircuit size={48} className="text-blue-500/50" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-xs font-black uppercase tracking-widest">{t("visuals.findingsLabel")}</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-center">{t("visuals.findingsTitle")}</h4>
            </div>

            {/* Visual C: Audit */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                <Image
                  src="https://picsum.photos/seed/audit/800/800?grayscale"
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-20 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <ShieldCheck size={48} className="text-emerald-500/50" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-xs font-black uppercase tracking-widest">{t("visuals.auditLabel")}</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-center">{t("visuals.auditTitle")}</h4>
            </div>
          </div>

          <div className="p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {[
                { label: t("metrics.m1.label"), val: t("metrics.m1.val"), desc: t("metrics.m1.desc") },
                { label: t("metrics.m2.label"), val: t("metrics.m2.val"), desc: t("metrics.m2.desc") },
                { label: t("metrics.m3.label"), val: t("metrics.m3.val"), desc: t("metrics.m3.desc") },
                { label: t("metrics.m4.label"), val: t("metrics.m4.val"), desc: t("metrics.m4.desc") }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">{item.label}</p>
                  <h5 className="text-lg font-bold text-white leading-tight">{item.val}</h5>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ CTA (prepojenie späť na predaj) */}
      <section className="py-40 px-6 bg-gradient-to-b from-transparent to-purple-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter leading-tight">
              {t("ctaTitle")}
            </h2>
            <p className="text-xl text-slate-400 font-medium italic leading-relaxed max-w-2xl mx-auto">
              {t("ctaLead")}
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button
              type="button"
              onClick={() => router.push("/agency")}
              className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>{t("ctaPrimary")}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              {t("ctaSecondary")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShopentumUseCase;
