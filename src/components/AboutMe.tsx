"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Globe,
  Mail,
  Phone,
  Music,
  Plane,
  Heart,
  Terminal,
} from "lucide-react";

const AboutMe: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Profile Photo */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="shrink-0"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-indigo-500/20 p-1 bg-gradient-to-b from-indigo-500/10 to-transparent">
                <div className="relative w-full h-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
                  <Image
                    src="/img/daniel.png"
                    alt="Daniel Budziňák"
                    fill
                    sizes="(max-width: 768px) 128px, 160px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Intro Text */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-2 block">MGR. DANIEL BUDZIŇÁK</span>
                <h1 className="text-4xl md:text-6xl font-sora font-black tracking-tighter mb-6 leading-tight">
                  Staviam mosty medzi <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">biznisom a AI.</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                  Som produktový a projektový manažér, ktorý verí, že technológia má slúžiť ľuďom, nie naopak. 
                  Pomáham firmám robiť lepšie rozhodnutia cez dáta a inteligentné workflowy.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 mt-8"
              >
                <a href="mailto:daniel.budzinak@gmail.com" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">daniel.budzinak@gmail.com</span>
                </a>
                <a href="tel:+421911694025" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">+421 911 694 025</span>
                </a>
                <div className="hidden md:block h-4 w-px bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">SÍDLO: SLOVENSKO</span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid md:grid-grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-sora font-bold tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-indigo-500" size={24} />
              Moja filozofia
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Nehľadám najkomplikovanejšie riešenie, hľadám to najefektívnejšie. Moja práca spočíva v prepájaní biznisových potrieb, 
              dát a technológií do praktických systémov. Špecializujem sa na návrh produktov a systémové myslenie, 
              ktoré firmám umožňuje rýchlo validovať nápady a zefektívňovať procesy.
            </p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-sora font-bold tracking-tight flex items-center gap-3">
              <Terminal className="text-cyan-500" size={24} />
              Technologický stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {['AI Workflow Design', 'Product Architecture', 'Cursor', 'Supabase', 'Vercel', 'Make / N8N', 'API', 'Notion / Jira'].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-sora font-black tracking-tighter mb-16 text-center uppercase">Moja cesta</h2>
          
          <div className="space-y-12 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
            {/* Shopentum */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-indigo-400 font-mono text-xs mb-1 block">2025 – SÚČASNOSŤ</span>
                <h3 className="text-xl font-bold">SHOPENTUM</h3>
                <p className="text-slate-500 text-sm">AI Product Owner / Systems Architect</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Vývoj AI-driven decision intelligence systému pre transformáciu marketingových a UX dát do štruktúrovaných workflowov.
                </p>
              </div>
            </div>

            {/* AIfreelancer */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-slate-500 font-mono text-xs mb-1 block">2020 – 2025</span>
                <h3 className="text-xl font-bold">AIfreelancer.sk</h3>
                <p className="text-slate-500 text-sm">AI Workflow & Automation Consultant</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Implementácia AI-asistovaných workflowov a automatizačných systémov pre digitálne projekty.
                </p>
              </div>
            </div>

            {/* WebRoyal */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-slate-500 font-mono text-xs mb-1 block">2013 – 2019</span>
                <h3 className="text-xl font-bold">WebRoyal</h3>
                <p className="text-slate-500 text-sm">Digital Project Manager</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">
                  Riadenie vývoja komplexných webových aplikácií a e-commerce riešení.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Section */}
      <section className="py-20 px-6 bg-indigo-500/5 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Heart size={120} />
            </div>
            
            <h2 className="text-2xl font-sora font-bold mb-8 flex items-center gap-3">
              <Heart className="text-rose-500" size={24} />
              Mimo obrazovky
            </h2>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <Plane size={20} />
                </div>
                <h4 className="font-bold">Cestovanie</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Milujem spoznávanie nových kultúr a chutí, najradšej sa vraciam do Talianska a Španielska.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                  <Music size={20} />
                </div>
                <h4 className="font-bold">Hudba</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Sprevádza ma pri práci aj oddychu a vždy mi dodáva potrebnú motiváciu.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Globe size={20} />
                </div>
                <h4 className="font-bold">Rodina</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Voľný čas trávim prácou v záhrade a chvíľami s manželkou a našimi štyrmi deťmi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { AboutMe };
export default AboutMe;
