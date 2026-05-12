import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import EagleCMS from "@/eagle_admin/EagleCMS";

export const metadata: Metadata = {
  title: "NMH — EAGLE Admin",
  description:
    "Prototyp editora s asistentom kvality: dôvera, štýl, SEO a HITL návrhy.",
  robots: { index: false, follow: false },
};

export default async function NmhPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EagleCMS />;
}
