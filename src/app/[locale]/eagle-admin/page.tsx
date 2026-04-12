import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import EagleCMS from "@/eagle_admin/EagleCMS";

export const metadata: Metadata = {
  title: "EAGLE Admin — prototyp",
  description:
    "UI/UX prototyp Media Decision Intelligence pre redakčné testovanie.",
  robots: { index: false, follow: false },
};

export default async function EagleAdminPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <EagleCMS />;
}
