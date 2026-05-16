import { NavLink } from "react-router-dom";
import { getTaskStorageMode } from "@/repositories";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const storageMode = getTaskStorageMode();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors",
      isActive
        ? "border border-white/15 bg-white/10 text-white"
        : "text-slate-400 hover:bg-white/5 hover:text-white",
    );

  return (
    <header className="mb-6 flex flex-wrap items-center gap-4">
      <h1 className="kanban-h1 shrink-0">{title}</h1>
      <nav className="ml-auto flex flex-wrap items-center gap-2">
        <NavLink to="/" className={linkClass} end>
          Board
        </NavLink>
        <NavLink to="/archive" className={linkClass}>
          Archív
        </NavLink>
        <span
          className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500"
          title={
            storageMode === "local"
              ? "Dáta len v tomto prehliadači."
              : "Supabase režim"
          }
        >
          {storageMode === "local" ? "Local" : "Supabase"}
        </span>
      </nav>
    </header>
  );
}
