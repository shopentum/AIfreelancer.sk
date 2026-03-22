import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Footer } from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PageTransition>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-black">{children}</div>
      <Footer />
    </PageTransition>
  );
}
