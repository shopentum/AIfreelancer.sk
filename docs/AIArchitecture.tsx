
import React from 'react';
import { motion } from 'framer-motion';
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
  Sparkles,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';

const AIArchitecture: React.FC = () => {
  const navigate = useNavigate();

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
              <Cpu size={12} />
              <span>Enterprise AI Architecture</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-sora font-black tracking-tighter leading-[1.1] text-white max-w-5xl">
              Enterprise AI Architektúra: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Od chaosu k riadenému výkonu
              </span>
            </h1>

            <p className="max-w-4xl text-xl md:text-2xl text-slate-400 font-medium italic leading-relaxed">
              Navrhujem a implementujem systémy rozhodovacej inteligencie (Decision Intelligence), ktoré sú bezpečné, auditovateľné a plne integrované do vašich biznis procesov.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Me Block */}
      <section className="pt-16 pb-8 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] p-10 md:p-16 border border-white/10 relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
              <div className="space-y-4">
                <p className="text-xl md:text-2xl font-sora font-[300] leading-tight italic text-slate-200">
                  "Za 20 rokov v digitále som pochopil, že najväčšie riziko nie je technológia, ale chaos. Moja AI architektúra prináša do generatívnych procesov poriadok a biznisovú logiku. Nepredávam prompty, predávam infraštruktúru pre vaše rozhodovanie."
                </p>
                <div className="flex items-center space-x-4 pt-1">
                  <div className="h-px w-12 bg-blue-500/50"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">AI ARCHITEKT & STRATÉG</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Diagram Section */}
      <section className="pt-4 pb-8 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-sora font-black tracking-tighter mb-6">Use Case: Intelligence Engine</h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium">
              Príklad architektúry systému riadeného stavom, kde sú agenti aktivovaní dynamicky na základe aktuálneho stavu objektu.
            </p>
          </div>

          <div className="relative p-8 md:pt-16 md:pb-10 bg-white/[0.02] backdrop-blur-sm rounded-[4rem] border border-white/5 shadow-2xl">
            {/* Top Layer: Governance */}
            <div className="flex justify-center mb-16">
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 0 30px rgba(59,130,246,0.2)" }}
                className="w-full max-w-4xl bg-white/5 p-10 rounded-3xl border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.1)] text-center relative z-20 transition-all"
              >
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Governance, Security & Control Layer</h3>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Policy • Risk • Human Authority • Publish Gate</p>
              </motion.div>
            </div>

            {/* Data Flow Visualization Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <svg className="w-full h-full opacity-80" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Discovery (TL) to Validation (TR) */}
                <motion.circle
                  r="4"
                  fill="#f59e0b"
                  filter="url(#glow)"
                  animate={{ 
                    cx: [300, 900],
                    cy: [300, 300],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />
                <motion.circle
                  r="3"
                  fill="#f59e0b"
                  filter="url(#glow)"
                  animate={{ 
                    cx: [300, 900],
                    cy: [300, 300],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear", delay: 2 }}
                />

                {/* Validation (TR) to Distribution (BR) */}
                <motion.circle
                  r="4"
                  fill="#ef4444"
                  filter="url(#glow)"
                  animate={{ 
                    cx: [900, 900],
                    cy: [300, 600],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />

                {/* Distribution (BR) to Creation (BL) */}
                <motion.circle
                  r="4"
                  fill="#10b981"
                  filter="url(#glow)"
                  animate={{ 
                    cx: [900, 300],
                    cy: [600, 600],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                />

                {/* Creation (BL) to Discovery (TL) */}
                <motion.circle
                  r="4"
                  fill="#3b82f6"
                  filter="url(#glow)"
                  animate={{ 
                    cx: [300, 300],
                    cy: [600, 300],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />

                {/* Random particles for "noise" */}
                {[...Array(8)].map((_, i) => (
                  <motion.circle
                    key={i}
                    r="1.5"
                    fill="#3b82f6"
                    animate={{ 
                      cx: [Math.random() * 1200, Math.random() * 1200],
                      cy: [Math.random() * 800, Math.random() * 800],
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{ repeat: Infinity, duration: 4 + Math.random() * 6, ease: "linear" }}
                  />
                ))}
              </svg>
            </div>

            {/* Middle Grid Container */}
            <div className="p-8 md:p-10 border-2 border-dashed border-white/5 rounded-[3rem] relative bg-black/20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative items-stretch">
                {/* Main Workflow (Left 9 columns) */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-10 relative">
                
                {/* Discovery */}
                <motion.div 
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(245, 158, 11, 0.4)" }}
                  className="bg-white/[0.03] p-8 rounded-3xl border border-amber-500/30 shadow-sm space-y-6 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                      <Search size={24} />
                    </div>
                    <h4 className="font-black text-white uppercase tracking-tight text-lg">Discovery & Analysis</h4>
                  </div>
                  <ul className="text-sm space-y-3 text-slate-400 font-medium">
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div><span>Audience Signals & Analytics</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div><span>Market Trends & Signals</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div><span>Authoritative Sources</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div><span>Competitive Gaps</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div><span>Topic Prioritization</span></li>
                  </ul>
                </motion.div>

                {/* Validation */}
                <motion.div 
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(239, 68, 68, 0.4)" }}
                  className="bg-white/[0.03] p-8 rounded-3xl border border-red-500/30 shadow-sm space-y-6 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="font-black text-white uppercase tracking-tight text-lg">Validation & Verification</h4>
                    </div>
                    <CheckCircle2 size={20} className="text-red-500/50" />
                  </div>
                  <ul className="text-sm space-y-3 text-slate-400 font-medium">
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div><span>Claim Extraction</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div><span>Source Verification & Comparison</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div><span>Editorial & Policy Check</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div><span>Risk Scoring & Trust</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div><span>Risk Heatmap (targeted review)</span></li>
                  </ul>
                </motion.div>

                {/* Creation */}
                <motion.div 
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)" }}
                  className="bg-white/[0.03] p-8 rounded-3xl border border-blue-500/30 shadow-sm space-y-6 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <PenTool size={24} />
                    </div>
                    <h4 className="font-black text-white uppercase tracking-tight text-lg">Creation & Optimization</h4>
                  </div>
                  <ul className="text-sm space-y-3 text-slate-400 font-medium">
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59, 130, 246, 0.5)]"></div><span>Brand Context & Memory</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59, 130, 246, 0.5)]"></div><span>Content Modes: Fact • Value • Opinion</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59, 130, 246, 0.5)]"></div><span>Structure & Intent</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59, 130, 246, 0.5)]"></div><span>Source-based drafting</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59, 130, 246, 0.5)]"></div><span>Variations & Optimization</span></li>
                  </ul>
                </motion.div>

                {/* Distribution */}
                <motion.div 
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" }}
                  className="bg-white/[0.03] p-8 rounded-3xl border border-emerald-500/30 shadow-sm space-y-6 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Share2 size={24} />
                    </div>
                    <h4 className="font-black text-white uppercase tracking-tight text-lg">Distribution & Performance</h4>
                  </div>
                  <ul className="text-sm space-y-3 text-slate-400 font-medium">
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16, 185, 129, 0.5)]"></div><span>Channel Selection</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16, 185, 129, 0.5)]"></div><span>Timing Optimization</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16, 185, 129, 0.5)]"></div><span>A/B Testing</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16, 185, 129, 0.5)]"></div><span>Audience Targeting</span></li>
                    <li className="flex items-center space-x-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16, 185, 129, 0.5)]"></div><span>Performance Feedback Loop</span></li>
                  </ul>
                </motion.div>

                {/* Central Publish Gate Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-blue-600 px-6 py-3 rounded-full border-2 border-[#030303] shadow-[0_0_20px_rgba(37,99,235,0.4)] text-[10px] font-black text-white uppercase tracking-widest text-center">
                    Publish Gate<br/>Explicit Commit
                  </div>
                </div>
              </div>

              {/* Right Column: Identity Layer */}
              <div className="lg:col-span-3">
                <motion.div 
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)", boxShadow: "0 0 30px rgba(59,130,246,0.3)" }}
                  className="h-full bg-white/[0.08] p-8 rounded-3xl border border-blue-500/30 shadow-xl flex flex-col items-center justify-center text-center space-y-8 transition-all"
                >
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center shadow-inner border border-blue-500/30">
                    <Fingerprint size={48} className="text-blue-400" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-white uppercase tracking-tight text-xl">Brand Identity Layer</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      Every brand has its own tone, rules, and risk profile. (Multi-brand / multi-tenant architecture).
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Layer: Core */}
            <div className="flex justify-center mt-10">
              <motion.div 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="w-full max-w-4xl bg-white/5 p-10 rounded-3xl border border-blue-500/20 shadow-md text-center relative z-20 transition-colors"
              >
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Database size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Common Intelligence Core</h3>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Shared Memory • Audit Trail • Decision Context • Content • Claims • Policy • Events</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="pt-8 pb-16 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Bezpečnosť a Súlad", 
                desc: "Plná kontrola nad dátami a výstupmi (Governance). Vaše know-how nikdy neopustí bezpečný perimeter.",
                color: "blue"
              },
              { 
                icon: Layers, 
                title: "Škálovateľnosť", 
                desc: "Multi-tenant architektúra umožňuje jeden systém pre viacero značiek, trhov alebo oddelení pri zachovaní identity.",
                color: "purple"
              },
              { 
                icon: History, 
                title: "Auditovateľnosť", 
                desc: "Každé rozhodnutie AI je zaznamenané v Audit Trail a spätne overiteľné. Koniec \"čiernej skrinky\".",
                color: "amber"
              },
              { 
                icon: Zap, 
                title: "Efektivita", 
                desc: "Automatizácia rutinných analytických a kreatívnych úloh uvoľňuje ruky seniorným expertom pre strategickú prácu.",
                color: "emerald"
              }
            ].map((benefit, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 hover:bg-white/[0.04] transition-colors group"
              >
                <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform`}>
                  <benefit.icon size={28} className={`text-${benefit.color}-400`} />
                </div>
                <h3 className="text-xl font-bold text-white">{benefit.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-2 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter leading-tight">
                  AI Architektúra pod kontrolou
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
                  Navrhnem vám uzavretý Intelligence Engine, ktorý rešpektuje vašu identitu a bezpečnostné pravidlá. Architektúra, ktorá váš biznis udrží pod kontrolou.
                </p>
              </div>
              <button 
                onClick={() => navigate('/kontakt')}
                className="group relative px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 mx-auto flex items-center space-x-4"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Konzultovať AI stratégiu</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIArchitecture;
