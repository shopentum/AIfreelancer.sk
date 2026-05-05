"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

const PROFICRAFTS_PATH = "/proficrafts";

/** Skutočná vlajka (SK má erb); EN = gb. Zdroj: flagcdn.com (w40 PNG). */
function LocaleFlagPhoto({ iso }: { iso: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block h-3.5 w-[22px] shrink-0 overflow-hidden rounded-[1px]",
        "border border-black/30 shadow-[1px_1px_0_rgba(0,0,0,0.12)]",
      )}
    >
      <Image
        src={`https://flagcdn.com/w40/${iso}.png`}
        alt=""
        fill
        className="object-cover object-center"
        sizes="22px"
      />
    </span>
  );
}

function ProfiCraftsLocaleSwitch() {
  const locale = useLocale();
  const tNav = useTranslations("ProfiCrafts.nav");
  const tLang = useTranslations("ProfiCrafts.lang");

  const chip = (active: boolean, extra?: string) =>
    cn(
      "inline-flex shrink-0 items-center gap-1 rounded border px-2 py-[3px] text-[10px] font-black tracking-wide text-slate-700 uppercase",
      "md:gap-0 md:px-1.5 md:py-[5px]",
      "border-slate-300/95 bg-gradient-to-b from-white to-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),1px_1px_0_rgba(0,0,0,0.08)] transition-colors",
      active
        ? "border-red-500/70 bg-red-50 text-red-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"
        : "hover:border-slate-400",
      extra,
    );

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={tNav("langAria")}>
      <Link
        href={PROFICRAFTS_PATH}
        locale="de"
        prefetch={false}
        className={cn(chip(locale === "de"), "no-underline")}
        aria-label={tLang("de")}
        title={tLang("de")}
      >
        <LocaleFlagPhoto iso="de" />
        <span className="md:hidden">DE</span>
      </Link>
      <Link
        href={PROFICRAFTS_PATH}
        locale="en"
        prefetch={false}
        className={cn(chip(locale === "en"), "no-underline")}
        aria-label={tLang("enAria")}
        title={tLang("en")}
      >
        <LocaleFlagPhoto iso="gb" />
        <span className="md:hidden">EN</span>
      </Link>
      <Link
        href={PROFICRAFTS_PATH}
        locale="sk"
        prefetch={false}
        className={cn(chip(locale === "sk"), "no-underline")}
        aria-label={tLang("sk")}
        title={tLang("sk")}
      >
        <LocaleFlagPhoto iso="sk" />
        <span className="md:hidden">SK</span>
      </Link>
    </div>
  );
}

const IMG = {
  zaklady: "/img/proficrafts_fundamente.webp",
  elektrika: "/img/proficrafts_elektrik.webp",
  omietka: "/img/proficrafts_putz.webp",
  sadrokarton: "/img/proficrafts_trockenbau.webp",
} as const;

const IMG_ABOUT = {
  elektro: "/img/proficrafts_elektro_detail.webp",
  putz: "/img/proficrafts_putz_detail.webp",
} as const;

type ServiceKey = "electricians" | "drywall" | "shell" | "finishing";

const SERVICE_ROWS: readonly {
  key: ServiceKey;
  icon: LucideIcon;
  imageSrc: string;
}[] = [
  { key: "electricians", icon: Zap, imageSrc: IMG.elektrika },
  { key: "drywall", icon: Layers, imageSrc: IMG.sadrokarton },
  { key: "shell", icon: Construction, imageSrc: IMG.zaklady },
  { key: "finishing", icon: Hammer, imageSrc: IMG.omietka },
];

const Logo = ({
  uppercase = false,
  className = "",
  tagline,
}: {
  uppercase?: boolean;
  className?: string;
  tagline: string;
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
          {tagline}
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
  imageSrc,
  imageAlt,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  specialties?: string[];
  imageSrc: string;
  imageAlt: string;
}) => (
  <motion.div
    whileHover={{ y: -8 }}
    className="group overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl transition-all hover:border-slate-300/90 hover:shadow-red-500/10"
  >
    <div className="relative aspect-[4/3] w-full">
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />
    </div>
    <div className="p-8 pt-7">
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
    </div>
  </motion.div>
);

const workerPanelTransition = {
  duration: 0.32,
  ease: [0.4, 0, 0.2, 1] as const,
};

function WorkerForm() {
  const [isOpen, setIsOpen] = React.useState(false);
  const t = useTranslations("ProfiCrafts.workerForm");

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-center space-x-3 rounded-2xl bg-red-600 py-5 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all hover:bg-red-700"
      >
        <span>{t("toggle")}</span>
        <ChevronRight
          className={cn(
            "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            isOpen ? "rotate-90" : "",
          )}
          size={16}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="worker-register-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={workerPanelTransition}
            className="overflow-hidden"
          >
            <div className="mt-6 space-y-4 rounded-2xl bg-slate-800/50 p-6">
              <input
                type="text"
                placeholder={t("professionPh")}
                className="w-full rounded-xl border-none bg-slate-900/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-red-500 outline-none"
              />
              <input
                type="tel"
                placeholder={t("phonePh")}
                className="w-full rounded-xl border-none bg-slate-900/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:ring-1 focus:ring-red-500 outline-none"
              />
              <button
                type="button"
                className="w-full rounded-xl bg-white/10 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-white/20"
              >
                {t("submit")}
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function ProfiCraftsWeb() {
  const t = useTranslations("ProfiCrafts");
  const tc = useTranslations("ProfiCrafts.contact");
  const tf = useTranslations("ProfiCrafts.footer");
  const serviceOptions = (t.raw("contact.serviceOptions") as string[]) ?? [];

  const NAV = [
    { hash: "sluzby", label: t("nav.services") },
    { hash: "o-nas", label: t("nav.about") },
    { hash: "kontakt", label: t("nav.contact") },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 [font-family:var(--font-proficrafts-inter),sans-serif]">
      <nav className="fixed top-0 z-[100] flex h-20 w-full items-center border-b border-slate-100 bg-white/90 px-6 backdrop-blur-xl md:px-12">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0 text-[20px] md:text-[24px]">
            <Logo tagline={t("logoTagline")} />
          </div>
          <div className="flex shrink-0 items-center gap-4 md:gap-10">
            <ProfiCraftsLocaleSwitch />
            <div className="hidden items-center space-x-10 md:flex">
              {NAV.map(({ hash, label }) => (
                <a
                  key={hash}
                  href={`#${hash}`}
                  className="text-[12px] font-bold tracking-[0.15em] text-slate-900/60 uppercase transition-colors hover:text-red-600"
                  style={{
                    fontFamily: "var(--font-proficrafts-space), sans-serif",
                  }}
                >
                  {label}
                </a>
              ))}
              <a
                href="#kontakt"
                className="rounded-xl bg-[#111827] px-6 py-3 text-[11px] font-black tracking-[0.2em] text-white uppercase shadow-lg shadow-black/10 transition-all hover:bg-red-600"
              >
                {t("nav.ctaInquiry")}
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-6 pt-[6.25rem] pb-20 md:px-12 md:pb-32 md:pt-[7.5rem]">
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
                {t("hero.badge")}
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase leading-[0.9] md:text-8xl">
              {t("hero.titleLine1")} <br />
              <span className="block text-[2.25rem] leading-[0.92] text-red-600 sm:text-5xl md:text-8xl">
                {t("hero.titleLine2")}
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-slate-500 md:text-2xl">
              {t("hero.lead")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#kontakt"
                className="group flex w-full items-center justify-center space-x-3 rounded-2xl bg-[#111827] px-10 py-6 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-2xl transition-all hover:bg-red-600 sm:w-auto"
              >
                <span>{t("hero.ctaConsult")}</span>
                <ChevronRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="#sluzby"
                className="flex w-full items-center justify-center rounded-2xl border border-slate-200 px-10 py-6 text-[12px] font-black tracking-[0.2em] text-slate-600 uppercase transition-all hover:bg-slate-50 sm:w-auto"
              >
                <span>{t("hero.ctaServices")}</span>
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
                {t("hero.stat100Label")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter text-slate-900">
                {t("hero.statRegions")}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {t("hero.statRegionsLabel")}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
                {t("hero.statCert")}
              </p>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {t("hero.statCertLabel")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="sluzby" className="bg-[#F1F5F9] px-6 py-32 md:px-12">
        <div className="mx-auto max-w-7xl space-y-20">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-red-600 uppercase">
              {t("servicesSection.eyebrow")}
            </span>
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none md:text-5xl">
              {t("servicesSection.title")}
            </h2>
            <p className="text-slate-600">{t("servicesSection.lead")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {SERVICE_ROWS.map(({ key, icon: Icon, imageSrc }) => {
              const title = t(`services.${key}.title`);
              const tags = (t.raw(`services.${key}.tags`) as string[]) ?? [];
              return (
                <ServiceCard
                  key={key}
                  icon={Icon}
                  title={title}
                  description={t(`services.${key}.desc`)}
                  specialties={tags}
                  imageSrc={imageSrc}
                  imageAlt={`${title} ${t("services.imageAltSuffix")}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section id="o-nas" className="px-6 py-32 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-24 lg:grid-cols-2">
          <div className="relative grid grid-cols-2 gap-6">
            <div className="space-y-6 pt-12">
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-slate-100 shadow-sm">
                <Image
                  src={IMG_ABOUT.putz}
                  alt={t("about.imagePutzAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-slate-900 p-8 text-white">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-red-600/20 blur-[50px]" />
                <div className="relative z-10 text-center">
                  <Clock size={40} className="mx-auto mb-4 text-red-500" />
                  <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {t("about.deadlineEyebrow")}
                  </p>
                  <p className="text-xl font-bold tracking-tight uppercase">
                    {t("about.deadlineTitle")}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-red-600 p-8 text-white">
                <div className="text-center">
                  <p className="mb-2 text-6xl font-black leading-none">15+</p>
                  <p className="whitespace-pre-line text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">
                    {t("about.activeTeams")}
                  </p>
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 shadow-sm">
                <Image
                  src={IMG_ABOUT.elektro}
                  alt={t("about.imageElektroAlt")}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <span className="text-[10px] font-black tracking-[0.5em] text-red-500 uppercase">
                {t("about.eyebrow")}
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-slate-900 uppercase leading-none md:text-5xl">
                {t("about.title")}
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-slate-500">{t("about.body")}</p>
            <div className="grid gap-8 border-t border-slate-100 pt-8 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <ShieldCheck className="text-slate-900" size={20} />
                </div>
                <h4 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                  {t("about.standardTitle")}
                </h4>
                <p className="text-xs text-slate-500">{t("about.standardDesc")}</p>
              </div>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                  <TrendingUp className="text-slate-900" size={20} />
                </div>
                <h4 className="text-xs font-black tracking-tight text-slate-900 uppercase">
                  {t("about.capacityTitle")}
                </h4>
                <p className="text-xs text-slate-500">{t("about.capacityDesc")}</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white">
              <div className="absolute top-0 right-0 h-32 w-32 bg-red-600/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative z-10 space-y-6">
                <h4 className="text-xl font-black tracking-tight uppercase">
                  {t("about.jobsTitle")}
                </h4>
                <p className="text-sm text-slate-400">{t("about.jobsLead")}</p>
                <WorkerForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kontakt" className="bg-[#0f172a] px-6 py-32 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          <div className="space-y-8 text-slate-100">
            <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none md:text-8xl">
              {t("contact.titleLine1")} <br />
              <span className="text-red-500">{t("contact.titleAccent")}</span>
            </h2>
            <p className="max-w-sm text-lg font-medium text-slate-300 md:text-xl">
              {t("contact.lead")}
            </p>
            <div className="flex flex-col space-y-4 pt-4">
              <div className="flex items-center space-x-4 text-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 shadow-lg">
                  <Phone size={18} className="text-red-500" />
                </div>
                <span className="font-black">+421 911 111 222</span>
              </div>
              <div className="flex items-center space-x-4 text-slate-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-slate-800/60 shadow-lg">
                  <Mail size={18} className="text-red-500" />
                </div>
                <span className="font-black">info@proficrafts.eu</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] md:p-12">
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {tc("labels.name")}
                  </label>
                  <input
                    type="text"
                    placeholder={tc("placeholders.name")}
                    className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    {tc("labels.email")}
                  </label>
                  <input
                    type="email"
                    placeholder={tc("placeholders.email")}
                    className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {tc("labels.phone")}
                </label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder={tc("placeholders.phone")}
                  className="w-full rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold transition-all outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {tc("labels.service")}
                </label>
                <select className="w-full cursor-pointer appearance-none rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-red-500">
                  {serviceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-black tracking-widest text-slate-400 uppercase">
                  {tc("labels.message")}
                </label>
                <textarea
                  placeholder={tc("placeholders.message")}
                  rows={4}
                  className="w-full resize-none rounded-2xl border-none bg-slate-50 px-6 py-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-2xl bg-red-600 py-5 text-[12px] font-black tracking-[0.2em] text-white uppercase shadow-xl shadow-red-600/20 transition-all hover:bg-red-700 active:scale-[0.98]"
              >
                {tc("submit")}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white px-6 py-20 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 md:flex-row">
          <Logo className="text-[28px]" tagline={t("logoTagline")} />
          <div className="flex space-x-10">
            {NAV.map(({ hash, label }) => (
              <a
                key={hash}
                href={`#${hash}`}
                className="text-[10px] font-black tracking-[0.2em] text-slate-900/40 uppercase transition-colors hover:text-red-500"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] leading-relaxed font-bold tracking-widest text-slate-400 uppercase">
              {tf("copyrightPrefix")} {tf("rights")}
              <br />
              {tf("taxLine")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
