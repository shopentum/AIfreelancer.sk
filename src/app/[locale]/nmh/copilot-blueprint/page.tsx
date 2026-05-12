import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { CopilotBlueprintPlayground } from "@/features/editorial-copilot";

export const metadata: Metadata = {
  title: "NMH — Editorial Copilot blueprint",
  description:
    "Izolovaný mock pravého Copilot panelu (fixtures + callbacks) bez plného EagleCMS.",
  robots: { index: false, follow: false },
};

export default async function CopilotBlueprintPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <CopilotBlueprintPlayground />
    </main>
  );
}
