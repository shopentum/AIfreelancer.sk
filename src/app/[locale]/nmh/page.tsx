import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import EagleCMS from "@/eagle_admin/EagleCMS";
import NmhPasswordGate from "@/eagle_admin/NmhPasswordGate";

export const metadata: Metadata = {
  title: "NMH — EAGLE Admin",
  description: "Interný redakčný prototyp Media Decision Intelligence Engine.",
  robots: { index: false, follow: false },
};

export default async function NmhPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <NmhPasswordGate>
      <EagleCMS />
    </NmhPasswordGate>
  );
}
