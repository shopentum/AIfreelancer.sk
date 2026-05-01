import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CashflowShell } from "@/cashflow/components/CashflowShell";

export const metadata: Metadata = {
  title: "Cashflow",
  description: "OMEGA - osobný cashflow (lokálne dáta)",
  robots: { index: false, follow: false },
};

export default async function CashflowPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CashflowShell />;
}
