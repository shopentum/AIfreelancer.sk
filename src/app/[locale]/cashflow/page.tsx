import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cashflowAppUrl } from "@/lib/cashflow";

export const metadata: Metadata = {
  title: "Cashflow",
  description: "Presmerovanie na OMEGA cashflow aplikáciu.",
  robots: { index: false, follow: false },
};

export default function CashflowLocaleRedirectPage() {
  redirect(cashflowAppUrl);
}
