import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import NmhCopilotShowcase from "@/eagle_admin/NmhCopilotShowcase";

export const metadata: Metadata = {
  title: "NMH — Editorial Copilot koncept",
  description:
    "Friendly ukážka pravého panelu: priority, workflow a pilierové návrhy (strategický koncept NMH).",
  robots: { index: false, follow: false },
};

export default async function NmhPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <NmhCopilotShowcase />;
}
