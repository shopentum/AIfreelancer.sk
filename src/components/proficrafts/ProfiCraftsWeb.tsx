"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Zap,
  Layers,
  Construction,
  Hammer,
  ShieldCheck,
  Clock,
  TrendingUp,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Logo = ({
  uppercase = false,
  className = "",
}: {
  uppercase?: boolean;
  className?: string;
}) => {
  const grayColor = "#64748b";

  return (
    <div className={cn("flex w-fit flex-col items-center", className)}>
      <div
        className="flex items-baseline leading-none tracking-tighter select-none"
        style={{
          fontFamily: "var(--font-proficrafts-inter), sans-serif",
          fontWeight: 600,
          fontSize: "inherit",
        }}
      >
        <span className="text-[#E63946]">
          {uppercase ? "PROFI" : "Profi"}
        </span>
        <span className="text-[#111827]">
          {uppercase ? "CRAFTS" : "crafts"}
        </span>
        <span
          className="ml-[0.05em] text-[0.45em] font-semibold lowercase"
          style={{ color: grayColor }}
        >
          .eu
        </span>
      </div>
      <div className="mt-[0.3em] w-full">
        <p
          className="text-center text-[0.22em] font-bold tracking-[0.4em] whitespace-nowrap uppercase"
          style={{ color: grayColor, marginRight: "-0.4em" }}
        >
          Partner for your project
        </p>
      </div>
    </div>
  );
};

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  specialties,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  specialties?: string[];
}) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group rounded-3xl border border-white/5 bg-white p-8 shadow-2xl transition-all hover:shadow-red-500/10"
  >
    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 transition-colors group-hover:bg-red-500">
      <Icon
        className="text-red-500 transition-colors group-hover:text-white"
        size={28}
      />
    </div>
    <h3 className="mb-3 text-xl font-black tracking-tight text-slate-900 uppercase">
      {title}
    </h3>
    <p className="mb-6 text-sm leading-relaxed text-slate-500">{description}</p>
    {specialties ? (
      <div className="flex flex-wrap gap-2">
        {specialties.map((item, id) => (
          <span
            key={id}
            className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase"
          >
            {item}
          </span>
        ))}
      </div>
    ) : null}
  </motion.div>
);

function WorkerForm() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-red-600 py-5 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:bg-red-700"
      >
        <span>Chcem sa zaregistrovať</span>
        <ChevronRight
          className={cn("transition-transform", isOpen ? "rotate-90" : "")}
          size={16}
        />
      </button>

      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden pt-6"
        >
          <div className="space-y-4 rounded-2xl bg-slate-800/50 p-6">
            <input
              type="text"
              placeholder="Vaša profesia (napr. Elektrikár)"
              className="w-full rounded-xl border-none bg-slate-900/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
            <input
              type="tel"
              placeholder="Telefónne číslo"
              className="w-full rounded-xl border-none bg-slate-900/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-red-500 outline-none"
            />
            <button
              type="button"
              className="w-full rounded-xl bg-white/10 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-white/20"
            >
              Odoslať kontakt
            </button>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

export default function ProfiCraftsWeb() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 [font-family:var(--font-proficrafts-inter),sans-serif]">
      <nav className="fixed top-0 z-[100] flex h-20 w-full items-center border-b border-slate-100 bg-white/90 px-6 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="text-[20px] md:text-[24px]">
            <Logo />
          </div>
          <div className="hidden items-center space-x-10 md:flex">
            {["Služby", "O nás", "Kontakt"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[12px] font-bold tracking-[0.15em] text-slate-900/60 uppercase transition-colors hover:text-red-600"
                style={{
                  fontFamily: "var(--font-proficrafts-space), sans-serif",
                }}
              >
                {item}
              </a>
            ))}
            <a
              href="#kontakt"
              className="rounded-xl bg-[#111827] px-6 py-3 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-black/10 transition-all hover:bg-red-600"
            >
              Dopytovať odborníka
            </a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-40 pb-20 px-6 md:px-12 md:pt-60 md:pb-32">
        <div className="absolute top-0 left-1/2 -z-10 h-full max-w-4xl w-full -translate-x-1/2 rounded-full bg-red-500/5 blur-[120px]" />

        <div className="mx-auto max-w-5xl space-y-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="mx-auto inline-flex items-center space-x-3 rounded-full bg-red-50 px-5 py-2 text-red-600">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                Overení špecialisti pre EU trh
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-[0.9] md:text-8xl">
              Projekty v rukách <br />
              <span className="text-red-600">profesionálov.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:text-2xl">
              ProfiCrafts.eu zabezpečuje kvalifikovaných odborníkov pre
              priemyselné a rezidenčné stavby. Od elektriny až po finálne
              detaily v interiéri.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#kontakt"
                className="group flex w-full items-center justify-center space-x-3 rounded-2xl bg-[#111827] px-10 py-6 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-2xl transition-all hover:bg-red-600 sm:w-auto"
              >
                <span>Naplánovať konzultáciu</span>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#služby"
                className="flex w-full items-center justify-center rounded-2xl border border-slate-200 px-10 py-6 text-[12px] font-black tracking-[0.2em] text-slate-600 uppercase transition-all hover:bg-slate-50 sm:w-auto"
              >
                <span>Preskúmať naše služby</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 gap-12 border-t border-slate-100 pt-16 md:grid-cols-3"
          >
            <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter text-slate-900">
                100%
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Garancia odvedenej kvality
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter text-slate-900">
                DE / SK / EU
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Medzinárodná pôsobnosť
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter text-slate-900">
                CERTIFIKÁCIA
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Odborne overené tímy
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="služby"
        className="bg-[#0f172a] px-6 py-32 md:px-12"
      >
        <div className="mx-auto max-w-7xl space-y-20">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase">
              Fokus a expertíza
            </span>
            <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none md:text-5xl">
              Zabezpečujeme tie najnáročnejšie remeslá.
            </h2>
            <p className="text-slate-400">
              Pripravujeme tímy odborníkov s dôrazom na technickú správnosť a
              dodržiavanie medzinárodných štandardov.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon={Zap}
              title="Elektrikári"
              description="Priemyselné inštalácie, rozvodové skrine a revízne správy podľa VDE noriem."
              specialties={["Priemysel", "VDE Normy", "Revízie"]}
            />
            <ServiceCard
              icon={Layers}
              title="SDK Práce"
              description="Sadrokartónové systémy pre moderné kancelárie a rezidenčné haly v najvyššom štandarde."
              specialties={["Priečky", "Podhľady", "Akustika"]}
            />
            <ServiceCard
              icon={Construction}
              title="Hrubé stavby"
              description="Koordinácia a realizácia základových dosiek, murovacích prác a hrubých konštrukcií."
              specialties={["Betonáž", "Murivo", "Základy"]}
            />
            <ServiceCard
              icon={Hammer}
              title="Dokončovacie práce"
              description="Precízne omietky, obklady a dlažby, ktoré dodávajú stavbe finálny vizuálny charakter."
              specialties={["Obklady", "Omietky", "Sanita"]}
            />
          </div>
        </div>
      </section>

      <section id="o nás" className="px-6 py-32 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-24 lg:grid-cols-2">
          <div className="relative grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=1000"
                  alt="Construction work"
                  fill
                  className="object-cover brightness-90 grayscale contrast-110"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-slate-900 p-8 text-white">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-red-600/20 blur-[50px]" />
                <div className="relative z-10 text-center">
                  <Clock size={40} className="mx-auto mb-4 text-red-500" />
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Garancia
                  </p>
                  <p className="text-xl font-bold tracking-tight uppercase">
                    Termínov
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-red-600 p-8 text-white">
                <div className="text-center">
                  <p className="mb-2 text-6xl font-black leading-none">15+</p>
                  <p className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">
                    Aktívnych <br /> tímov
                  </p>
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1000"
                  alt="Professional electrician"
                  fill
                  className="object-cover brightness-90 grayscale"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <span className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase">
                Kto sme
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none md:text-5xl">
                Partner, na ktorého sa môžete spoľahnúť.
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-500">
              Pôsobíme ako most medzi špičkovými remeselníkmi a tými, ktorí
              hľadajú spoľahlivú pracovnú silu pre svoje projekty. Naším cieľom
              je odstrániť bariéry neefektivity a dodať kapacity vtedy, keď ich
              najviac potrebujete.
            </p>
            <div className="grid gap-8 border-t border-slate-100 pt-8 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <ShieldCheck className="text-slate-900" size={20} />
                </div>
                <h4 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                  Vysoký štandard výberu
                </h4>
                <p className="text-xs text-slate-500">
                  Pracujeme len s preverenými ľuďmi s jasnou históriou
                  referencií.
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <TrendingUp className="text-slate-900" size={20} />
                </div>
                <h4 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                  Flexibilné kapacity
                </h4>
                <p className="text-xs text-slate-500">
                  Dokážeme pokryť malé opravy aj veľké priemyselné celky.
                </p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white">
              <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 space-y-6">
                <h4 className="text-xl font-black tracking-tight uppercase">
                  Hľadáte prácu?
                </h4>
                <p className="text-sm text-slate-400">
                  Ste kvalifikovaný elektrikár alebo stavbár? Neustále
                  rozširujeme naše tímy pre projekty v zahraničí.
                </p>
                <WorkerForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt" className="bg-[#9A9FA7] px-6 py-32 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8 text-slate-900">
            <h2 className="text-5xl font-black tracking-tighter uppercase leading-none md:text-8xl">
              Pošlite nám <br />
              <span className="text-red-700">dopyt.</span>
            </h2>
            <p className="max-w-sm text-lg font-medium text-slate-700 md:text-xl">
              Hľadáte odborníkov pre váš projekt? Zanechajte nám základné údaje
              a my sa vám ozveme s návrhom spolupráce.
            </p>
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-4 text-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
                  <Phone size={18} className="text-red-600" />
                </div>
                <span className="font-black">+421 911 111 222</span>
              </div>
              <div className="flex items-center space-x-4 text-slate-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-lg">
                  <Mail size={18} className="text-red-600" />
                </div>
                <span className="font-black">jan@proficrafts.eu</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] md:p-12">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    Vaše Meno
                  </label>
                  <input
                    type="text"
                    placeholder="Jan Novák"
                    className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="jan@firma.sk"
                    className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  O ktorú službu máte záujem?
                </label>
                <select className="w-full cursor-pointer appearance-none rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-red-500">
                  <option>Elektroinštalácie</option>
                  <option>Sadrokartónové práce</option>
                  <option>Hrubá stavba</option>
                  <option>Finálne práce v interiéri</option>
                  <option>Iné</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  Stručný dopyt
                </label>
                <textarea
                  placeholder="Popíšte nám váš projekt..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-red-600 py-5 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-red-600/20 transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                Odoslať nezáväzný dopyt
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white px-6 py-20 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row">
          <Logo className="text-[28px]" />
          <div className="flex space-x-10">
            {["Služby", "O nás", "Kontakt"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-black tracking-[0.2em] text-slate-900/40 uppercase transition-colors hover:text-red-500"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
              © 2026 PROFICRAFTS.EU | Všetky práva vyhradené. <br />
              DIČ: SK2120000000
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
