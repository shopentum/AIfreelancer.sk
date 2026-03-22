"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ShieldCheck } from "lucide-react";
const GDPR: React.FC = () => {
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
              Ochrana osobných <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">údajov (GDPR).</span>
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-slate-400 text-lg leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Prevádzkovateľ</h2>
              <p>
                Prevádzkovateľom vašich osobných údajov je Mgr. Daniel Budziňák, so sídlom v Slovenskej republike. Kontaktovať nás môžete na e-mailovej adrese daniel.budzinak@gmail.com.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Účel spracúvania</h2>
              <p>
                Vaše osobné údaje spracúvame na nasledujúce účely:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Odpovedanie na dopyty:</strong> Na základe vášho súhlasu alebo oprávneného záujmu spracúvame údaje z kontaktného formulára.</li>
                <li><strong>Analýza návštevnosti:</strong> Na zlepšenie našich služieb anonymizovane analyzujeme správanie na webe.</li>
                <li><strong>Marketing:</strong> Ak ste nám udelili súhlas, môžeme vás informovať o novinkách.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Rozsah spracúvaných údajov</h2>
              <p>
                Spracúvame len nevyhnutné údaje, ako sú meno, e-mailová adresa, telefónne číslo a IP adresa.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Vaše práva</h2>
              <p>
                Podľa nariadenia GDPR máte právo na prístup k svojim údajom, právo na ich opravu, vymazanie, obmedzenie spracúvania, právo na prenosnosť údajov a právo namietať proti spracúvaniu.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Zabezpečenie</h2>
              <p>
                Vaše údaje chránime pomocou moderných bezpečnostných technológií a šifrovania. Prístup k nim majú len poverené osoby.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Kontakt</h2>
              <p>
                V prípade akýchkoľvek otázok alebo uplatnenia vašich práv nás kontaktujte na daniel.budzinak@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GDPR;
