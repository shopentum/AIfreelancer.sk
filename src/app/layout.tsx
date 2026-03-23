import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Sora } from "next/font/google";
import { headers } from "next/headers";
import {
  defaultTitle,
  seoDescription,
  seoKeywords,
  siteName,
  siteUrl,
} from "@/lib/site";
import { ProfessionalServiceJsonLd } from "@/components/ProfessionalServiceJsonLd";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const keywordString = [...seoKeywords].join(", ");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s · ${siteName}`,
  },
  description: seoDescription,
  keywords: keywordString,
  authors: [{ name: "Mgr. Daniel Budziňák", url: siteUrl }],
  creator: "Mgr. Daniel Budziňák",
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName,
    title: defaultTitle,
    description: seoDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: seoDescription,
  },
  alternates: {
    languages: {
      sk: siteUrl,
      en: `${siteUrl}/en`,
      "x-default": siteUrl,
    },
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = (await headers()).get("x-next-intl-locale") ?? "sk";

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} h-full antialiased bg-black`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100">
        <ProfessionalServiceJsonLd />
        {children}
      </body>
    </html>
  );
}
