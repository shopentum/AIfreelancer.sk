"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
const Cookies: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#030303] text-white font-inter selection:bg-indigo-500/30 overflow-x-hidden">
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-12 relative z-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors group"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Späť</span>
          </button>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-sora font-black tracking-tighter leading-tight">
              Zásady používania <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">cookies.</span>
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-slate-400 text-lg leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Čo sú súbory cookie?</h2>
              <p>
                Súbory cookie sú malé textové súbory, ktoré sa ukladajú do vášho počítača alebo mobilného zariadenia pri návšteve webových stránok. Pomáhajú webovej lokalite zapamätať si vaše akcie a preferencie (napríklad prihlasovacie meno, jazyk, veľkosť písma a iné nastavenia zobrazenia) počas určitého obdobia, takže ich nemusíte znova zadávať pri každom návrate na lokalitu alebo pri prechádzaní z jednej stránky na druhú.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Ako používame súbory cookie?</h2>
              <p>
                Naše webové stránky používajú súbory cookie na zlepšenie používateľského zážitku, analýzu návštevnosti a personalizáciu obsahu. Používame nasledujúce typy cookies:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Nevyhnutné cookies:</strong> Tieto sú potrebné pre základné fungovanie webu.</li>
                <li><strong>Analytické cookies:</strong> Pomáhajú nám pochopiť, ako návštevníci interagujú s webom (napr. Google Analytics).</li>
                <li><strong>Funkčné cookies:</strong> Umožňujú webu zapamätať si vaše voľby.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Kontrola súborov cookie</h2>
              <p>
                Súbory cookie môžete kontrolovať alebo zmazať podľa vlastného uváženia. Podrobnosti nájdete na stránke aboutcookies.org. Môžete vymazať všetky súbory cookie, ktoré sú už uložené vo vašom počítači, a väčšinu prehliadačov môžete nastaviť tak, aby ste im zabránili v ich ukladaní.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Kontakt</h2>
              <p>
                Ak máte akékoľvek otázky týkajúce sa našich zásad používania cookies, kontaktujte nás na daniel.budzinak@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cookies;
