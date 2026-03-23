"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  BrainCircuit,
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  Globe,
} from "lucide-react";
import { AIFreelancerLogo } from "./AIFreelancerLogo";

const AIStudio: React.FC = () => {
  const router = useRouter();
  const tHero = useTranslations("Hero");
  const tServices = useTranslations("Services");
  const tCase = useTranslations("CaseStudy");
  const tStudio = useTranslations("Studio");

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 text-center flex flex-col items-center"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-blue-400">
              <Sparkles size={12} />
              <span>{tStudio("eyebrow")}</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-sora font-black tracking-tighter leading-[0.9] text-white max-w-5xl">
              {tHero("titlePrefix")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                {tHero("titleAccent")}
              </span>
              <br />
              {tHero("titleSuffix")}
            </h1>

            <p className="max-w-4xl text-xl md:text-2xl text-slate-400 font-medium italic leading-relaxed">
              {tHero("subtitle")}
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
              <button
                type="button"
                onClick={() => router.push("/use-case/shopentum")}
                className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>{tCase("cta")}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/kontakt")}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {tHero("cta")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack / Studio Principles */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-sora font-black tracking-tighter">
            {tServices("title")}
          </h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 border border-blue-500/20">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold">{tServices("service1")}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{tStudio("services.s1Desc")}</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-bold">{tServices("service2")}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{tStudio("services.s2Desc")}</p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold">{tServices("service3")}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{tStudio("services.s3Desc")}</p>
          </div>
        </div>
      </section>

      {/* Shopentum Reference Section */}
      <section id="shopentum-case" className="py-40 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-400">
                  {tStudio("caseEyebrow")}
                </div>
                <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter leading-tight">
                  {tCase("title")}
                </h2>
                <p className="text-xl text-slate-400 font-medium italic leading-relaxed">
                  {tCase("description")}
                </p>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 pt-2">
                  {tCase("metric")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-start space-x-6 group hover:bg-white/[0.08] transition-all">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{tStudio("highlights.h1Title")}</h4>
                    <p className="text-slate-500 text-sm">{tStudio("highlights.h1Desc")}</p>
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-start space-x-6 group hover:bg-white/[0.08] transition-all">
                  <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{tStudio("highlights.h2Title")}</h4>
                    <p className="text-slate-500 text-sm">{tStudio("highlights.h2Desc")}</p>
                  </div>
                </div>
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-start space-x-6 group hover:bg-white/[0.08] transition-all">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{tStudio("highlights.h3Title")}</h4>
                    <p className="text-slate-500 text-sm">{tStudio("highlights.h3Desc")}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={() => router.push("/use-case/shopentum")}
                  className="group relative px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-white/5"
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <span>{tCase("cta")}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>

                <div className="aspect-[3/4] rounded-[3rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 overflow-hidden relative shadow-2xl">
                  <Image
                    src="/img/case-study-1.png"
                    alt={tStudio("caseImageAlt")}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-top opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-8 left-8 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <AIFreelancerLogo size={16} variant="light" showText={false} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white">Shopentum OS</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{tStudio("badgeSub")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-10 -right-10 p-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tStudio("uptimeLabel")}</p>
                    <p className="text-xl font-bold">99.99%</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 p-6 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl hidden md:block">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tStudio("latencyLabel")}</p>
                    <p className="text-xl font-bold">42ms</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIStudio;
