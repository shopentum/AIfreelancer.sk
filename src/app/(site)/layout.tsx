import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getLocale();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PageTransition>
        <Navbar />
        <div className="min-h-screen flex flex-col bg-black">{children}</div>
        <Footer />
      </PageTransition>
    </NextIntlClientProvider>
  );
}
