"use client";

import React, { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { AIFreelancerLogo } from "./AIFreelancerLogo";

const navLinks = [
  { key: "about", href: "/o-mne" },
  { key: "agency", href: "/agency" },
  { key: "caseStudy", href: "/use-case/shopentum" },
] as const;

export const Navbar: React.FC = () => {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleLang = () => {
    const nextLocale = locale === "sk" ? "en" : "sk";
    router.replace(pathname, { locale: nextLocale });
    setIsMenuOpen(false);
  };

  const linkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-white/10 py-3"
          : "bg-black/40 backdrop-blur-md border-white/5 py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMenuOpen(false)}>
          <div className="hidden md:block">
            <AIFreelancerLogo size={24} variant="light" />
          </div>
          <div className="md:hidden">
            <AIFreelancerLogo size={30} variant="light" />
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
          >
            <Globe size={12} className="text-blue-400 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">
              {locale.toUpperCase()}
            </span>
          </button>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                linkActive(link.href) ? "text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              {t(`links.${link.key}`)}
            </Link>
          ))}

          <div className="flex items-center space-x-4 ml-4">
            <Link
              href="/kontakt"
              className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-white/5 ${
                pathname === "/kontakt"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black hover:bg-blue-500 hover:text-white"
              }`}
            >
              {t("contact")}
            </Link>
          </div>
        </div>

        <div className="flex md:hidden items-center space-x-4">
          <button
            type="button"
            onClick={toggleLang}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
          >
            <span className="text-[10px] font-black text-white tracking-widest">
              {locale.toUpperCase()}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleMenu}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-2xl border-b border-white/10 md:hidden overflow-hidden"
          >
            <div className="p-8 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-2xl font-sora font-black tracking-tighter text-left ${
                    linkActive(link.href) ? "text-blue-400" : "text-white"
                  }`}
                >
                  {t(`links.${link.key}`)}
                </Link>
              ))}
              <Link
                href="/kontakt"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all text-center"
              >
                {t("contact")}
              </Link>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Globe size={16} className="text-slate-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {t("language")}
                  </span>
                </div>
                <div className="flex bg-white/5 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => router.replace(pathname, { locale: "sk" })}
                    className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                      locale === "sk" ? "bg-blue-500 text-white" : "text-slate-500"
                    }`}
                  >
                    SK
                  </button>
                  <button
                    type="button"
                    onClick={() => router.replace(pathname, { locale: "en" })}
                    className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${
                      locale === "en" ? "bg-blue-500 text-white" : "text-slate-500"
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
