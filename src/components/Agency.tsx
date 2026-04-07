"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import {
  Zap,
  BrainCircuit,
  ArrowRight,
  Layers,
  Rocket,
  Terminal,
  Mail,
  Calendar,
  Network,
  Github,
  Database,
  LayoutGrid,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import dashboard01 from "@/app/(site)/img/shopentum_dashboard_01.webp";
import dashboard02 from "@/app/(site)/img/shopentum_dashboard_02.webp";
import dashboard03 from "@/app/(site)/img/shopentum_dashboard_03.webp";

const Agency: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("Agency");
  const [activeImageIndex, setActiveImageIndex] = React.useState<number | null>(null);

  // NOTE: Keep these three files in public/img (or adjust paths below).
  const dashboardShots = [
    { src: dashboard01, alt: "Shopentum dashboard screenshot 1" },
    { src: dashboard02, alt: "Shopentum dashboard screenshot 2" },
    { src: dashboard03, alt: "Shopentum dashboard screenshot 3" },
  ];

  const openImage = (index: number) => setActiveImageIndex(index);
  const closeImage = () => setActiveImageIndex(null);
  const showPrev = () =>
    setActiveImageIndex((prev) => (prev === null ? null : (prev - 1 + dashboardShots.length) % dashboardShots.length));
  const showNext = () =>
    setActiveImageIndex((prev) => (prev === null ? null : (prev + 1) % dashboardShots.length));

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 text-center"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-purple-400">
              <Terminal size={12} />
              <span>{t("eyebrow")}</span>
            </div>
            
            <h1 className="text-4xl md:text-[4.5rem] font-sora font-black tracking-tighter leading-[1.05] text-white">
              {t("heroTitlePrefix")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                {t("heroTitleAccent")}
              </span>
            </h1>

            <div className="max-w-4xl mx-auto space-y-8 text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              <div className="space-y-6">
                <p>
                  {t("heroLead1")}
                </p>
                <p>
                  {t("heroLead2")}
                </p>
              </div>
              
              <div className="mt-8 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs md:text-sm font-black uppercase tracking-[0.24em] rounded-full shadow-lg whitespace-nowrap">
                  <Zap size={14} className="shrink-0" />
                  FAST DELIVERY
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
              <button
                type="button"
                onClick={() => router.push("/kontakt")}
                className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 text-center"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span>{t("heroPrimaryCta")}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/use-case/shopentum")}
                className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all text-center"
              >
                Case Study
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="pt-40 pb-20 px-6 relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">{t("servicesEyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">{t("servicesTitle")}</h2>
            <div className="w-20 h-1 bg-purple-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-white/[0.07] border border-white/10 space-y-8 group hover:border-purple-500/30 transition-all shadow-2xl"
            >
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                <Layers size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-sora font-black tracking-tight">{t("services.s1.title")}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {t("services.s1.desc")}
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {[t("services.s1.f1"), t("services.s1.f2"), t("services.s1.f3"), t("services.s1.f4")].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Zap size={12} className="text-purple-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Service 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-white/[0.07] border border-white/10 space-y-8 group hover:border-blue-500/30 transition-all shadow-2xl"
            >
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <BrainCircuit size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-sora font-black tracking-tight">{t("services.s2.title")}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {t("services.s2.desc")}
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {[t("services.s2.f1"), t("services.s2.f2"), t("services.s2.f3"), t("services.s2.f4")].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Zap size={12} className="text-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Service 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="p-10 rounded-[3rem] bg-white/[0.07] border border-white/10 space-y-8 group hover:border-emerald-500/30 transition-all shadow-2xl"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Rocket size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-sora font-black tracking-tight">{t("services.s3.title")}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {t("services.s3.desc")}
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {[t("services.s3.f1"), t("services.s3.f2"), t("services.s3.f3"), t("services.s3.f4")].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <Zap size={12} className="text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="pt-20 pb-12 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">{t("stackEyebrow")}</p>
            <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">{t("stackTitle")}</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { name: "Cursor", icon: Terminal, desc: t("stack.cursor"), color: "text-sky-400" },
              { name: "Builder.io", icon: LayoutGrid, desc: t("stack.builder"), color: "text-blue-500" },
              { name: "API First", icon: Network, desc: t("stack.api"), color: "text-purple-500" },
              { name: "Github", icon: Github, desc: t("stack.github"), color: "text-slate-200" },
              { name: "Supabase", icon: Database, desc: t("stack.supabase"), color: "text-emerald-500" },
              { name: "Vercel", icon: Zap, desc: t("stack.vercel"), color: "text-white" }
            ].map((tech, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-6 hover:bg-white/10 transition-all group"
              >
                <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${tech.color} group-hover:scale-110 transition-all shadow-inner relative`}>
                  <div className={`absolute inset-0 blur-xl opacity-20 ${tech.color.replace('text-', 'bg-')}`}></div>
                  <tech.icon size={28} className="relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">{tech.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech & Approach Sections */}
      <section className="py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {/* Section 1: Tech Stack */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] bg-white/[0.08] border border-white/20 space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:bg-white/[0.1] transition-all"
            >
              <div className="space-y-2 pb-6 border-b border-white/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">{t("systemLayerEyebrow")}</p>
                <h2 className="text-3xl md:text-4xl font-sora font-black tracking-tighter">{t("systemLayerTitle")}</h2>
              </div>
              
              <div className="grid gap-6">
                {[
                  { title: t("systemList.i1.title"), desc: t("systemList.i1.desc") },
                  { title: t("systemList.i2.title"), desc: t("systemList.i2.desc") },
                  { title: t("systemList.i3.title"), desc: t("systemList.i3.desc") },
                  { title: t("systemList.i4.title"), desc: t("systemList.i4.desc") },
                  { title: t("systemList.i5.title"), desc: t("systemList.i5.desc") },
                  { title: t("systemList.i6.title"), desc: t("systemList.i6.desc") }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 group">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Section 2: AI Approach */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[3rem] bg-white/[0.08] border border-white/20 space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] hover:bg-white/[0.1] transition-all"
            >
              <div className="space-y-2 pb-6 border-b border-white/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">{t("approachEyebrow")}</p>
                <h2 className="text-3xl md:text-4xl font-sora font-black tracking-tighter">{t("approachTitle")}</h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-slate-300 font-medium italic">
                  {t("approachQuote")}
                </p>
                
                <div className="space-y-6">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {t("approachLead")}
                  </p>
                  <ul className="space-y-4">
                    {[
                      { label: t("approachList.i1.label"), val: t("approachList.i1.val") },
                      { label: t("approachList.i2.label"), val: t("approachList.i2.val") },
                      { label: t("approachList.i3.label"), val: t("approachList.i3.val") },
                      { label: t("approachList.i4.label"), val: t("approachList.i4.val") }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                        <span className="text-xs font-mono text-blue-400">{item.val}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-bold text-white">{t("approachResultLabel")}</p>
                  <p className="text-sm text-slate-400 mt-1">{t("approachResultText")}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shopentum Dashboard Gallery */}
      <section className="py-24 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-fuchsia-400">SHOPENTUM PREVIEW</p>
            <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">
              Ukážky dashboardu
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboardShots.map((shot, index) => (
              <button
                key={index}
                type="button"
                onClick={() => openImage(index)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] hover:border-fuchsia-500/40 transition-all text-left"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Footer Section */}
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

          <div className="flex flex-col items-center space-y-8">
            <button
              type="button"
              onClick={() => router.push("/kontakt")}
              className="group relative px-12 py-6 bg-white text-black rounded-2xl font-black text-lg uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
            >
              <span className="relative z-10 flex items-center space-x-4">
                <Calendar size={24} />
                <span>{t("heroPrimaryCta")}</span>
              </span>
            </button>
            
            <div className="flex items-center space-x-8 pt-8">
              <div className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
                <Mail size={18} />
                <span className="text-sm font-bold">daniel.budzinak@gmail.com</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="text-sm font-bold text-slate-400">+421 911 694 025</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm">
          <button
            type="button"
            onClick={closeImage}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close gallery"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          <div className="w-full h-full overflow-auto px-4 py-20 md:px-12">
            <div className="mx-auto w-[95vw] max-w-[1600px]">
              <Image
                src={dashboardShots[activeImageIndex].src}
                alt={dashboardShots[activeImageIndex].alt}
                width={1600}
                height={1000}
                sizes="95vw"
                className="w-full h-auto rounded-2xl border border-white/10"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agency;
