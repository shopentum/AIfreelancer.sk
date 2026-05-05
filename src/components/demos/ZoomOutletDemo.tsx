"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  Search,
  User,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function ZoomOutletDemo() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState<string | null>(
    null,
  );

  const categories = [
    { name: "Novinky", subs: ["Jar/Leto 26", "Minimalista", "Limitované edície"] },
    { name: "Ženy", subs: ["Kabáty", "Šaty", "Pleteniny", "Doplnky"] },
    { name: "Muži", subs: ["Obleky", "Denim", "Základy", "Obuv"] },
    { name: "Doplnky", subs: ["Tašky", "Šperky", "Okuliare"] },
    { name: "Výpredaj", subs: ["Posledná šanca", "Archív"] },
  ];

  const products = [
    {
      id: 1,
      name: "VLNENÉ SAKO SLIM-FIT",
      price: "450 €",
      image:
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
      category: "SAKÁ",
      size: "large",
    },
    {
      id: 2,
      name: "HODVÁBNE NOHAVICE WIDE-LEG",
      price: "280 €",
      image:
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
      category: "NOHAVICE",
      size: "small",
    },
    {
      id: 3,
      name: "KOŽENÁ TAŠKA MINIMAL",
      price: "120 €",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800",
      category: "DOPLNKY",
      size: "small",
    },
    {
      id: 4,
      name: "KOŽENÉ LODIČKY NA PODPÄTKU",
      price: "320 €",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
      category: "OBUV",
      size: "large",
    },
  ];

  const journalArticles = [
    {
      id: 1,
      title: "5 kúskov, ktoré nesmú chýbať vo vašom jarnom šatníku",
      category: "TRENDY",
      date: "24. MAREC 2026",
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Ako kombinovať luxusné materiály pre každodenný look",
      category: "INŠPIRÁCIA",
      date: "02. APRÍL 2026",
      image:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-[#F5F2ED]/80 backdrop-blur-md border-b border-[#1A1A1A]/5">
        <div className="flex items-center space-x-12">
          <Link href="/" className="group flex flex-col items-start">
            <span className="text-2xl font-serif italic leading-none tracking-tighter">
              ZOOM
            </span>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase -mt-1 group-hover:tracking-[0.5em] transition-all duration-500">
              OUTLET
            </span>
          </Link>
          <div className="hidden lg:flex space-x-8 text-[10px] font-black tracking-widest uppercase">
            <a href="#" className="hover:opacity-50 transition-opacity">
              Ženy
            </a>
            <a href="#" className="hover:opacity-50 transition-opacity">
              Muži
            </a>
            <a href="#" className="hover:opacity-50 transition-opacity">
              Kolekcie
            </a>
            <a href="#" className="hover:opacity-50 transition-opacity">
              Editorial
            </a>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <button type="button" className="hover:opacity-50 transition-opacity">
              <Search size={18} />
            </button>
            <button type="button" className="hover:opacity-50 transition-opacity">
              <User size={18} />
            </button>
            <button type="button" className="hover:opacity-50 transition-opacity">
              <Heart size={18} />
            </button>
          </div>
          <button type="button" className="relative group flex items-center space-x-2">
            <ShoppingBag size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">
              Košík (0)
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Functional Menu Overlay */}
      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed inset-0 bg-white z-40 flex flex-col lg:flex-row ${isMenuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        <div className="flex-1 p-8 md:p-24 flex flex-col justify-center overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                Nakupovať podľa kategórie
              </p>
              <ul className="space-y-6">
                {categories.map((cat) => (
                  <li key={cat.name} className="group">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveCategory(
                          activeCategory === cat.name ? null : cat.name,
                        )
                      }
                      className="flex items-center space-x-4 text-3xl md:text-5xl font-serif italic hover:pl-4 transition-all duration-300 w-full text-left"
                    >
                      <span>{cat.name}</span>
                      <motion.div
                        animate={{ rotate: activeCategory === cat.name ? 180 : 0 }}
                        className="text-slate-300 group-hover:text-black transition-colors"
                      >
                        <ArrowRight size={24} className="rotate-90" />
                      </motion.div>
                    </button>
                    <motion.ul
                      initial={false}
                      animate={{
                        height: activeCategory === cat.name ? "auto" : 0,
                        opacity: activeCategory === cat.name ? 1 : 0,
                        marginTop: activeCategory === cat.name ? 16 : 0,
                        display: activeCategory === cat.name ? "block" : "none",
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden pl-8 space-y-3 border-l border-slate-100"
                    >
                      {cat.subs.map((sub) => (
                        <li key={sub}>
                          <a
                            href="#"
                            className="text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-black transition-colors"
                          >
                            {sub}
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:flex flex-col justify-between">
              <div className="space-y-8">
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">
                  Editorial
                </p>
                <ul className="space-y-4 text-xl font-serif italic">
                  <li>
                    <a href="#" className="hover:pl-4 transition-all duration-300">
                      Žurnál
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:pl-4 transition-all duration-300">
                      Predajne
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:pl-4 transition-all duration-300">
                      Udržateľnosť
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:pl-4 transition-all duration-300">
                      Kontakt
                    </a>
                  </li>
                </ul>
              </div>

              <div className="pt-12 border-t border-slate-100 flex justify-between items-center">
                <div className="flex space-x-8">
                  <Instagram
                    size={20}
                    className="hover:text-slate-400 cursor-pointer"
                  />
                  <Twitter
                    size={20}
                    className="hover:text-slate-400 cursor-pointer"
                  />
                  <Facebook
                    size={20}
                    className="hover:text-slate-400 cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[10px] font-black tracking-widest uppercase border-b border-black pb-1"
                >
                  Zatvoriť menu
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-1/3 bg-slate-50 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800"
            alt="Menu Visual"
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#F5F2ED]/20" />
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <h1 className="text-[12vw] font-serif italic leading-none text-[#1A1A1A]/5 select-none whitespace-nowrap origin-left -rotate-90 -translate-x-1/2">
            ZOOM OUTLET / SS26
          </h1>
        </div>

        <div className="container mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 lg:col-start-2 z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#1A1A1A]/40">
                PRÉMIOVÝ OUTLET
              </p>
              <h2 className="text-6xl md:text-8xl font-serif italic leading-[0.9] tracking-tighter">
                Štýl Bez <br />
                <span className="pl-12 md:pl-24">Kompromisov.</span>
              </h2>
              <p className="max-w-md text-[#1A1A1A]/60 leading-relaxed">
                Objavte kurátorský výber svetových značiek za outletové ceny.
                Nadčasové kúsky, ktoré definujú váš osobitý štýl.
              </p>
              <button
                type="button"
                className="group flex items-center space-x-4 text-[10px] font-black tracking-widest uppercase border-b border-[#1A1A1A] pb-2 hover:opacity-50 transition-all"
              >
                <span>Preskúmať kolekciu</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </motion.div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 relative">
            <motion.div
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="aspect-[4/5] bg-white overflow-hidden relative shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000"
                alt="Hero Product"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/5" />
            </motion.div>

            {/* Floating Detail */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -bottom-12 -left-12 bg-white p-8 shadow-2xl hidden md:block max-w-[200px]"
            >
              <p className="text-[10px] font-black tracking-widest uppercase mb-2">
                BESTSELLER
              </p>
              <p className="text-sm font-serif italic mb-4">
                Vlnený kabát v odtieni Bone
              </p>
              <p className="text-lg font-bold">890 €</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Quote */}
      <section className="py-32 bg-[#1E293B] text-[#F5F2ED] overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/30 via-transparent to-transparent" />
        </div>
        <div className="container mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-5xl mx-auto text-center space-y-12"
          >
            <h3
              className="text-3xl md:text-5xl font-sans italic leading-tight tracking-tight"
              style={{ fontWeight: 100 }}
            >
              &quot;Kvalita, ktorá pretrvá. Štýl, ktorý nepotrebuje vysvetlenie.
              ZOOM OUTLET prináša to najlepšie zo svetovej módy priamo k
              vám.&quot;
            </h3>
            <div className="flex flex-col items-center space-y-4">
              <div className="h-20 w-[1px] bg-[#F5F2ED]/30" />
              <p className="text-[10px] font-black tracking-[0.5em] uppercase">
                FILOZOFIA ZNAČKY
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-32 px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#1A1A1A]/40">
                NAKUPUJTE LOOK
              </p>
              <h4 className="text-5xl font-serif italic">Kurátorský výber</h4>
            </div>
            <a
              href="#"
              className="text-[10px] font-black tracking-widest uppercase border-b border-[#1A1A1A] pb-1"
            >
              Zobraziť všetko
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${product.size === "large" ? "lg:col-span-7" : "lg:col-span-5"} group cursor-pointer`}
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors" />
                  <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      className="bg-[#1A1A1A] text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest"
                    >
                      Rýchly nákup
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black tracking-widest text-[#1A1A1A]/40 uppercase mb-1">
                      {product.category}
                    </p>
                    <h5 className="text-sm font-bold tracking-tight">
                      {product.name}
                    </h5>
                  </div>
                  <p className="text-sm font-serif italic">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section (SK/CZ Market Style) */}
      <section className="py-20 bg-white border-y border-[#1A1A1A]/5 px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              {
                icon: Truck,
                title: "EXPRESNÉ DORUČENIE",
                desc: "Doručenie do 24-48 hodín",
              },
              {
                icon: RotateCcw,
                title: "30 DNÍ NA VRÁTENIE",
                desc: "Bezplatná výmena a vrátenie",
              },
              {
                icon: ShieldCheck,
                title: "AUTENTICITA",
                desc: "100% originálne produkty",
              },
              {
                icon: CreditCard,
                title: "BEZPEČNÁ PLATBA",
                desc: "Platba kartou alebo na dobierku",
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col items-center text-center space-y-4 group"
                >
                  <div className="p-4 bg-[#F5F2ED] rounded-full group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-500">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black tracking-widest uppercase">
                      {benefit.title}
                    </p>
                    <p className="text-[11px] text-[#1A1A1A]/50 font-medium">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Journal / Blog Section */}
      <section className="py-32 px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div className="space-y-4">
              <p className="text-[10px] font-black tracking-[0.5em] uppercase text-[#1A1A1A]/40">
                ŽURNÁL
              </p>
              <h4 className="text-5xl font-serif italic">Zoom Editorial</h4>
            </div>
            <a
              href="#"
              className="text-[10px] font-black tracking-widest uppercase border-b border-[#1A1A1A] pb-1"
            >
              Čítať viac
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {journalArticles.map((article, idx) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="group cursor-pointer space-y-8"
              >
                <div className="aspect-video overflow-hidden bg-white shadow-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <p className="text-[9px] font-black tracking-widest text-[#1A1A1A]/40 uppercase">
                      {article.category}
                    </p>
                    <div className="w-1 h-1 bg-[#1A1A1A]/20 rounded-full" />
                    <p className="text-[9px] font-black tracking-widest text-[#1A1A1A]/40 uppercase">
                      {article.date}
                    </p>
                  </div>
                  <h5 className="text-3xl font-serif italic leading-tight group-hover:pl-4 transition-all duration-500">
                    {article.title}
                  </h5>
                  <button
                    type="button"
                    className="flex items-center space-x-3 text-[10px] font-black tracking-widest uppercase group-hover:text-slate-400 transition-colors"
                  >
                    <span>Čítať článok</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Banner */}
      <section className="pb-32 px-8">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="bg-white text-[#1A1A1A] p-12 md:p-24 rounded-[3rem] relative overflow-hidden flex flex-col items-center text-center space-y-10 shadow-2xl border border-[#1A1A1A]/5"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[120px] -ml-48 -mb-48" />

            <div className="relative z-10 space-y-4">
              <p className="text-[10px] font-black tracking-[0.5em] uppercase opacity-40">
                ZÍSKAJTE EXKLUZÍVNY PRÍSTUP
              </p>
              <h4 className="text-4xl md:text-6xl font-serif italic leading-tight">
                Získajte 10% zľavu na váš <br />
                prvý nákup u nás.
              </h4>
            </div>

            <div className="relative z-10 w-full max-w-md">
              <div className="flex border-b border-[#1A1A1A]/20 pb-4 group focus-within:border-[#1A1A1A] transition-colors">
                <input
                  type="email"
                  placeholder="Zadajte vašu e-mailovú adresu"
                  className="bg-transparent border-none outline-none text-lg font-serif italic w-full placeholder:text-[#1A1A1A]/20"
                />
                <button type="button" className="hover:translate-x-2 transition-transform">
                  <ArrowRight size={24} />
                </button>
              </div>
              <p className="text-[9px] font-medium opacity-30 mt-6 tracking-widest uppercase">
                Prihlásením súhlasíte s našimi Zásadami ochrany osobných údajov
                a Zmluvnými podmienkami.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-20 px-8 border-t border-[#1A1A1A]/5">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex flex-col items-start">
              <span className="text-2xl font-serif italic leading-none tracking-tighter">
                ZOOM
              </span>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase -mt-1">
                OUTLET
              </span>
            </div>
            <p className="text-xs text-[#1A1A1A]/60 leading-relaxed max-w-xs">
              Definujeme budúcnosť digitálneho obchodu prostredníctvom
              architektonického dizajnu a technickej dokonalosti.
            </p>
            <div className="flex space-x-4">
              <Instagram
                size={18}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] cursor-pointer"
              />
              <Twitter
                size={18}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] cursor-pointer"
              />
              <Facebook
                size={18}
                className="text-[#1A1A1A]/40 hover:text-[#1A1A1A] cursor-pointer"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-6">
              Obchod
            </p>
            <ul className="space-y-4 text-xs text-[#1A1A1A]/60">
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Novinky
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Najpredávanejšie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Kolekcie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Doplnky
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-6">
              Podpora
            </p>
            <ul className="space-y-4 text-xs text-[#1A1A1A]/60">
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Doprava a vrátenie
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Veľkostná tabuľka
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  Kontaktujte nás
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#1A1A1A]">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black tracking-widest uppercase mb-6">
              Newsletter
            </p>
            <p className="text-xs text-[#1A1A1A]/60 mb-6">
              Prihláste sa k odberu exkluzívneho obsahu a skoršieho prístupu.
            </p>
            <div className="flex border-b border-[#1A1A1A] pb-2">
              <input
                type="email"
                placeholder="E-mailová adresa"
                className="bg-transparent border-none outline-none text-xs w-full"
              />
              <button type="button">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
        <div className="container mx-auto mt-20 pt-8 border-t border-[#1A1A1A]/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[9px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">
          <p>© 2026 ZOOM OUTLET. VŠETKY PRÁVA VYHRADENÉ.</p>
          <div className="flex space-x-8">
            <a href="#" className="hover:text-[#1A1A1A]">
              Zásady ochrany osobných údajov
            </a>
            <a href="#" className="hover:text-[#1A1A1A]">
              Zmluvné podmienky
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
