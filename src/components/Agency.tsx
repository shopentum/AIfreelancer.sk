"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Cpu, 
  BrainCircuit, 
  ArrowRight, 
  Code, 
  Database, 
  Activity, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  Globe,
  BarChart3,
  Layers,
  Rocket,
  Terminal,
  Mail,
  Calendar,
  Github,
  Network
} from 'lucide-react';
import { useRouter } from "next/navigation";

const Agency: React.FC = () => {
  const router = useRouter();

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
              <span>Externý AI Engine pre Agentúry</span>
            </div>
            
            <h1 className="text-4xl md:text-[4.5rem] font-sora font-black tracking-tighter leading-[1.05] text-white">
              Staviam moderné produkty <br />
              s AI-native architektúrou <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400">
                v rekordnom čase.
              </span>
            </h1>

            <div className="max-w-4xl mx-auto space-y-8 text-xl md:text-2xl text-slate-400 font-medium leading-relaxed">
              <div className="space-y-6">
                <p>
                  Pomáham agentúram a tímom doručovať projekty, ktoré by inak boli technicky a časovo náročné.
                </p>
                <p>
                  Staviam riešenia, ktoré sú pripravené na produkciu - nie len demo alebo prototyp. Od Figma dizajnu cez frontend a backend až po AI workflow.
                </p>
              </div>
              
              <div className="relative mt-12 p-8 md:px-12 md:py-8 rounded-[2rem] bg-white/[0.03] border border-white/10 max-w-xl mx-auto overflow-hidden group shadow-2xl flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                <p className="text-white font-black not-italic text-lg md:text-xl tracking-tight">
                  Výsledok: funkčný web alebo aplikácia, nie prototyp
                </p>
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg whitespace-nowrap">
                  FAST DELIVERY
                </span>
                <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
              <button
                type="button"
                onClick={() => router.push("/kontakt")}
                className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 text-center"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <span>Prebrať váš projekt (15 min)</span>
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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500">Najčastejšie spolupráce:</p>
            <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">3 EXKLUZÍVNE SLUŽBY</h2>
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
                <h3 className="text-2xl font-sora font-black tracking-tight">Produkčný frontend</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Vysoko výkonné a škálovateľné rozhrania postavené na modernom stacku. Zameriavam sa na rýchlosť, stabilitu a bezchybný používateľský zážitok.
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {['pixel-accurate implementácia', 'komponentová štruktúra', 'pripravené na backend / integrácie', 'rýchle nasadenie'].map((item, i) => (
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
                <h3 className="text-2xl font-sora font-black tracking-tight">AI workflow & automatizácia</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Zefektívňovanie procesov pomocou inteligentných nástrojov a automatizovaných tokov dát. Šetrím váš čas a eliminujem manuálne chyby.
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {['AI asistované workflow', 'prepojenie nástrojov (API, data flow)', 'interné nástroje pre tímy', 'decision support systémy'].map((item, i) => (
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
                <h3 className="text-2xl font-sora font-black tracking-tight">Od nápadu k funkčnému produktu</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Kompletné zastrešenie vývoja od prvotného konceptu až po finálne nasadenie. Rýchlo a efektívne mením nápady na realitu.
                </p>
              </div>
              <ul className="space-y-3 pt-4">
                {['MVP development', 'rýchle prototypovanie → produkcia', 'validácia nápadu', 'škálovateľný základ'].map((item, i) => (
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
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">MODERN AI STACK</p>
            <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">Nástroje, ktoré menia pravidlá hry</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {[
              { name: "Cursor", icon: Terminal, desc: "AI-Native IDE", color: "text-sky-400" },
              { name: "Builder.io", icon: LayoutGrid, desc: "Visual CMS & AI", color: "text-blue-500" },
              { name: "API First", icon: Network, desc: "Connected Logic", color: "text-purple-500" },
              { name: "Github", icon: Github, desc: "Version Control", color: "text-slate-200" },
              { name: "Supabase", icon: Database, desc: "Backend & Auth", color: "text-emerald-500" },
              { name: "Vercel", icon: Zap, desc: "Deployment & Edge", color: "text-white" }
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500">TECH STACK / SYSTEM LAYER</p>
                <h2 className="text-3xl md:text-4xl font-sora font-black tracking-tighter">Ako sú moje systémy postavené</h2>
              </div>
              
              <div className="grid gap-6">
                {[
                  { title: "Pipeline-based architektúra", desc: "Žiadne ad-hoc skripty, ale robustné, zreťazené procesy." },
                  { title: "Data Gap detection", desc: "Systém aktívne identifikuje slepé miesta v dátach." },
                  { title: "Deterministic výstupy", desc: "Prísna kontrola nad výstupmi, eliminácia halucinácií." },
                  { title: "Auditovateľné rozhodnutia", desc: "Kompletný trace: od vstupu cez logiku až po výsledok." },
                  { title: "Runtime vs Snapshot logika", desc: "Jasné oddelenie okamžitého spracovania od historických dát." },
                  { title: "Production-first návrh", desc: "Staviam systémy pripravené na záťaž, nie len demá." }
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">AKO PRACUJEM S AI</p>
                <h2 className="text-3xl md:text-4xl font-sora font-black tracking-tighter">Ako pristupujem k AI systémom</h2>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-slate-300 font-medium italic">
                  „AI nepoužívam ako black box.“
                </p>
                
                <div className="space-y-6">
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Každý systém navrhujem ako riadený proces:
                  </p>
                  <ul className="space-y-4">
                    {[
                      { label: "Jasný vstup", val: "data contract" },
                      { label: "Kontrolovaný výstup", val: "no guessing" },
                      { label: "Validácia rozhodnutí", val: "confidence, trace" },
                      { label: "Oddelenie interpretácie", val: "fakty vs. odhady" }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                        <span className="text-xs font-mono text-blue-400">{item.val}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <p className="text-sm font-bold text-white">Výsledok:</p>
                  <p className="text-sm text-slate-400 mt-1">AI, ktorá sa dá riadiť, nie len “používať”.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact / Footer Section */}
      <section className="py-40 px-6 bg-gradient-to-b from-transparent to-purple-900/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter leading-tight">
              Posuňte hranice toho, <br />
              čo je možné.
            </h2>
            <p className="text-xl text-slate-400 font-medium italic leading-relaxed max-w-2xl mx-auto">
              Či už budujete komplexnú infraštruktúru alebo hľadáte technologický motor pre vaše štúdio, som tu, aby som vaše vízie zhmotnil. Premeňme vašu kreativitu na funkčný, high-end softvér bez zbytočných prieťahov.
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
                <span>Prebrať váš projekt (15 min)</span>
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
    </div>
  );
};

export default Agency;
