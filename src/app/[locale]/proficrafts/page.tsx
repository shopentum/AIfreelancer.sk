import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import ProfiCraftsWeb from "@/components/proficrafts/ProfiCraftsWeb";

export const metadata: Metadata = {
  title: "ProfiCrafts.eu — remeselná síla pre váš projekt",
  description:
    "Kvalifikovaní odborníci pre priemyselné a rezidenčné stavby: elektrina, SDK, hrubá stavba, dokončovacie práce.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-proficrafts-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-proficrafts-space",
});

export default async function ProfiCraftsPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <ProfiCraftsWeb locale={locale} />
    </div>
  );
}
