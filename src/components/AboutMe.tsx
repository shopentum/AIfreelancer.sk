"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Boxes,
  Braces,
  BrainCircuit,
  Database,
  Globe,
  Heart,
  Mail,
  Music,
  Phone,
  Plane,
  Rocket,
  Sparkles,
  SquareKanban,
  Terminal,
  Webhook,
  Workflow,
} from "lucide-react";

const STACK_ITEMS = [
  { key: "s1" as const, icon: Workflow, color: "text-indigo-400" },
  { key: "s2" as const, icon: Boxes, color: "text-cyan-400" },
  { key: "s3" as const, icon: Terminal, color: "text-sky-400" },
  { key: "s4" as const, icon: Database, color: "text-emerald-500" },
  { key: "s5" as const, icon: Rocket, color: "text-orange-400" },
  { key: "s6" as const, icon: Webhook, color: "text-violet-400" },
  { key: "s7" as const, icon: Braces, color: "text-purple-500" },
  { key: "s8" as const, icon: SquareKanban, color: "text-amber-400" },
];

const AboutMe: React.FC = () => {
  const tAbout = useTranslations("About");
  const tAboutPage = useTranslations("AboutPage");

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-indigo-500/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
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

            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-2 block">
                  {tAbout("title")}
                </span>
                <h1 className="text-4xl md:text-6xl font-sora font-black tracking-tighter mb-6 leading-tight">
                  {tAboutPage("heroTitlePrefix")} <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                    {tAboutPage("heroTitleAccent")}
                  </span>
                </h1>
                <div className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl space-y-6 text-left mx-auto md:mx-0">
                  <p>{tAboutPage("intro.lead")}</p>
                  <ul className="space-y-3 list-disc pl-5 marker:text-indigo-500/80">
                    <li>{tAboutPage("intro.b1")}</li>
                    <li>{tAboutPage("intro.b2")}</li>
                    <li>{tAboutPage("intro.b3")}</li>
                  </ul>
                  <p>{tAboutPage("intro.closing")}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center justify-center md:justify-start gap-x-8 gap-y-4 mt-8"
              >
                <a
                  href="mailto:daniel.budzinak@gmail.com"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                    <Mail size={16} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">daniel.budzinak@gmail.com</span>
                </a>
                <a
                  href="tel:+421911694025"
                  className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                    <Phone size={16} />
                  </div>
                  <span className="text-sm font-bold tracking-tight">+421 911 694 025</span>
                </a>
                <div className="hidden md:block h-4 w-px bg-white/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {tAboutPage("location")}
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & value */}
      <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-sora font-bold tracking-tight flex items-center gap-3">
              <BrainCircuit className="text-indigo-500 shrink-0" size={24} />
              {tAboutPage("philosophyTitle")}
            </h2>
            <p className="text-slate-400 leading-relaxed">{tAboutPage("philosophyText")}</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-sora font-bold tracking-tight flex items-center gap-3">
              <Sparkles className="text-cyan-500 shrink-0" size={24} />
              {tAboutPage("valueTitle")}
            </h2>
            <p className="text-slate-400 leading-relaxed">{tAboutPage("valueText")}</p>
          </div>
        </div>
      </section>

      {/* Tech stack — Agency-style cards */}
      <section className="pt-20 pb-12 px-6 border-t border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400">
              {tAboutPage("stackEyebrow")}
            </p>
            <h2 className="text-3xl md:text-5xl font-sora font-black tracking-tighter uppercase">
              {tAboutPage("stackTitle")}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STACK_ITEMS.map((tech, i) => (
              <motion.div
                key={tech.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center text-center space-y-6 hover:bg-white/10 transition-all group"
              >
                <div
                  className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center ${tech.color} group-hover:scale-110 transition-all shadow-inner relative`}
                >
                  <div
                    className={`absolute inset-0 blur-xl opacity-20 ${tech.color.replace("text-", "bg-")}`}
                  />
                  <tech.icon size={28} className="relative z-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white">
                    {tAboutPage(`skills.${tech.key}`)}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                    {tAboutPage(`stackDesc.${tech.key}`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-sora font-black tracking-tighter mb-16 text-center uppercase">
            {tAboutPage("timelineTitle")}
          </h2>

          <div className="space-y-12 relative before:absolute before:left-0 md:before:left-1/2 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-indigo-400 font-mono text-xs mb-1 block">
                  {tAboutPage("timeline.t1.period")}
                </span>
                <h3 className="text-xl font-bold">{tAboutPage("timeline.t1.company")}</h3>
                <p className="text-slate-500 text-sm">{tAboutPage("timeline.t1.role")}</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">{tAboutPage("timeline.t1.desc")}</p>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-slate-500 font-mono text-xs mb-1 block">
                  {tAboutPage("timeline.t2.period")}
                </span>
                <h3 className="text-xl font-bold">{tAboutPage("timeline.t2.company")}</h3>
                <p className="text-slate-500 text-sm">{tAboutPage("timeline.t2.role")}</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">{tAboutPage("timeline.t2.desc")}</p>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-slate-500 font-mono text-xs mb-1 block">
                  {tAboutPage("timeline.t3.period")}
                </span>
                <h3 className="text-xl font-bold">{tAboutPage("timeline.t3.company")}</h3>
                <p className="text-slate-500 text-sm">{tAboutPage("timeline.t3.role")}</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">{tAboutPage("timeline.t3.desc")}</p>
              </div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="absolute left-[-4px] md:left-1/2 md:-translate-x-1/2 w-2 h-2 rounded-full bg-slate-700 z-10" />
              <div className="md:w-1/2 md:pr-12 md:text-right">
                <span className="text-slate-500 font-mono text-xs mb-1 block">
                  {tAboutPage("timeline.t4.period")}
                </span>
                <h3 className="text-xl font-bold">{tAboutPage("timeline.t4.company")}</h3>
                <p className="text-slate-500 text-sm">{tAboutPage("timeline.t4.role")}</p>
              </div>
              <div className="md:w-1/2 md:pl-12">
                <p className="text-slate-400 text-sm leading-relaxed">{tAboutPage("timeline.t4.desc")}</p>
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
              {tAboutPage("personalTitle")}
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                  <Plane size={20} />
                </div>
                <h4 className="font-bold">{tAboutPage("personal.p1.title")}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{tAboutPage("personal.p1.desc")}</p>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400">
                  <Music size={20} />
                </div>
                <h4 className="font-bold">{tAboutPage("personal.p2.title")}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{tAboutPage("personal.p2.desc")}</p>
              </div>

              <div className="space-y-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Globe size={20} />
                </div>
                <h4 className="font-bold">{tAboutPage("personal.p3.title")}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{tAboutPage("personal.p3.desc")}</p>
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
