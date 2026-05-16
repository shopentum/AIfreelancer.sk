import { Archive, Layout, Moon, Settings, Sun } from "lucide-react";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { getProjectIcon } from "@/config/projectStyle";
import { useKanban, type ProjectFilter } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function ProjectToolbar() {
  const { isDark, toggleTheme } = useTheme();
  const { pathname } = useLocation();
  const isArchive = pathname.startsWith("/archive");
  const [searchParams, setSearchParams] = useSearchParams();
  const { projectFilter, setProjectFilter } = useKanban();
  const { activeProjects, filterProjects, openSettings } = useProjects();

  const archiveProjectFilter =
    (searchParams.get("project") || "all") as ProjectFilter;
  const activeFilter = isArchive ? archiveProjectFilter : projectFilter;

  const projectList = isArchive ? filterProjects : activeProjects;

  function selectProject(id: ProjectFilter) {
    if (isArchive) {
      const next = new URLSearchParams(searchParams);
      if (id === "all") next.delete("project");
      else next.set("project", id);
      setSearchParams(next, { replace: true });
      return;
    }
    setProjectFilter(id);
  }

  const filterOptions: { id: ProjectFilter; label: string; inactive?: boolean }[] =
    [
      { id: "all", label: "Všetky projekty" },
      ...projectList.map((p) => ({
        id: p.id,
        label: p.label,
        inactive: !p.active,
      })),
    ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all",
      isActive
        ? t(
            isDark,
            "border border-slate-200 bg-white text-slate-900 shadow-sm",
            "bg-slate-800 text-white shadow-sm",
          )
        : t(isDark, "text-slate-500 hover:text-slate-700", "text-slate-500 hover:text-slate-200"),
    );

  return (
    <div
      className={cn(
        "border-b transition-colors duration-500",
        t(isDark, "border-slate-200/80 bg-transparent", "border-slate-800/80 bg-transparent"),
      )}
    >
      <div className="mx-auto flex max-w-[1800px] flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between md:px-8">
        <div
          className="scrollbar-kanban flex items-center gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Filter projektu"
        >
          {filterOptions.map((opt, i) => (
            <div key={opt.id} className="flex shrink-0 items-center gap-2">
              {i === 1 && (
                <div
                  className={cn(
                    "mx-2 h-4 w-px",
                    t(isDark, "bg-slate-200", "bg-slate-800"),
                  )}
                />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={activeFilter === opt.id}
                onClick={() => selectProject(opt.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all",
                  activeFilter === opt.id
                    ? t(
                        isDark,
                        "bg-slate-900 text-white shadow-lg",
                        "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20",
                      )
                    : t(
                        isDark,
                        "text-slate-400 hover:bg-slate-50 hover:text-slate-900",
                        "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
                      ),
                  opt.inactive && "opacity-70",
                )}
              >
                {opt.id !== "all" && (
                  <span className="opacity-60">
                    {getProjectIcon(opt.id, 14)}
                  </span>
                )}
                <span>{opt.label}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="flex w-full shrink-0 items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <div
            className={cn(
              "flex items-center rounded-xl border p-1 transition-colors",
              t(isDark, "border-slate-200 bg-slate-100", "border-slate-800 bg-slate-900"),
            )}
          >
            <NavLink to="/" className={navLinkClass} end>
              <Layout size={12} aria-hidden />
              <span>Board</span>
            </NavLink>
            <NavLink to="/archive" className={navLinkClass}>
              <Archive size={12} aria-hidden />
              <span>Archív</span>
            </NavLink>
          </div>

          <div
            className={cn(
              "mx-2 h-8 w-px shrink-0",
              t(isDark, "bg-slate-200", "bg-slate-800"),
            )}
            aria-hidden
          />

          <button
            type="button"
            onClick={openSettings}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
              t(
                isDark,
                "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
              ),
            )}
            aria-label="Nastavenia projektov"
          >
            <Settings size={20} />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
              t(
                isDark,
                "border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700",
                "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900",
              ),
            )}
            aria-label={isDark ? "Svetlý režim" : "Tmavý režim"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
