"use client";

import React from "react";
import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight, Sparkles } from "lucide-react";
import { scrollToSection } from "@/lib/scrollToSection";

const Foundry: React.FC = () => {
  return (
    <section
      id="foundry"
      className="relative min-h-screen flex flex-col justify-center bg-black text-white font-inter selection:bg-indigo-500/30 overflow-x-hidden pt-28 pb-24 px-6"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-15%] w-[50%] h-[50%] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[45%] h-[45%] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300"
        >
          <Sparkles size={12} className="text-indigo-400" />
          AI Works Foundry · Decision Intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-7xl font-sora font-black tracking-tighter leading-[1.05]"
        >
          aifreelancer.sk
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
            technologický náskok pre vaše vízie
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-medium"
        >
          Dávam vašim víziám technologický náskok a nevídanú rýchlosť. Stavím produkty s AI-native
          architektúrou — od rozhodovacej logiky po nasadenie.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            type="button"
            onClick={() => scrollToSection("contact")}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-white/10"
          >
            <BrainCircuit size={18} />
            Kontakt
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("shopentum")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/15 bg-white/5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
          >
            Case Study: Shopentum
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Foundry;
