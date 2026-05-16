import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AppNav() {
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
    </nav>
  );
}
