import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ProfiCraftsWeb from "@/components/proficrafts/ProfiCraftsWeb";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-proficrafts-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-proficrafts-space",
});

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ProfiCrafts" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
  };
}

export default async function ProfiCraftsPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <ProfiCraftsWeb />
    </div>
  );
}
