import type { ReactNode } from "react";

/** Standalone shell: no marketing Navbar/Footer. */
export default function CashflowLayout({
  children,
}: Readonly<{children: ReactNode}>) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-zinc-100">
      {children}
    </div>
  );
}
