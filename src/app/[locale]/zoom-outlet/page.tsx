import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import ZoomOutletDemo from "@/components/demos/ZoomOutletDemo";

export const metadata: Metadata = {
  title: "ZOOM OUTLET — ukážka e-shopu",
  description:
    "Statická ukážka moderného outlet e-shopu (vizuálna šablóna pre klienta, bez napojenia na backend).",
  robots: { index: false, follow: false },
};

export default async function ZoomOutletPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ZoomOutletDemo />;
}
