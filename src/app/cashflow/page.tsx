import type { Metadata } from "next";
import { CashflowShell } from "@/cashflow/components/CashflowShell";

export const metadata: Metadata = {
  title: "Cashflow",
  description: "OMEGA - osobný cashflow (lokálne dáta)",
  robots: { index: false, follow: false },
};

export default function CashflowRootPage() {
  return <CashflowShell />;
}
