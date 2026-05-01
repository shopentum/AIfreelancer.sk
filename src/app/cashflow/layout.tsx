import type { ReactNode } from "react";

/** Standalone: works at /cashflow without [locale] segment (middleware off / direct match). */
export default function CashflowRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100">
      {children}
    </div>
  );
}
