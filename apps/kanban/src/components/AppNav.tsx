import { NavLink } from "react-router-dom";
import { getTaskStorageMode } from "@/repositories";
import { cn } from "@/lib/utils";

export function AppNav() {
  const storageMode = getTaskStorageMode();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors",
      isActive
        ? "border border-white/15 bg-white/10 text-white"
        : "text-slate-400 hover:bg-white/5 hover:text-white",
    );

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-3 border-b border-white/10 pb-4">
      <NavLink to="/" className={linkClass} end>
        Board
      </NavLink>
      <NavLink to="/archive" className={linkClass}>
        Archív
      </NavLink>
      <span
        className="ml-auto rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
        title={
          storageMode === "local"
            ? "Dáta len v tomto prehliadači. Sync medzi zariadeniami cez Supabase bude neskôr."
            : "Supabase režim (vyžaduje konfiguráciu)"
        }
      >
        Úložisko: {storageMode === "local" ? "Local" : "Supabase"}
      </span>
    </nav>
  );
}
