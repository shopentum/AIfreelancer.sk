import { PROJECTS } from "@/config/projects";
import { useKanban, type ProjectFilter } from "@/hooks/useKanbanStore";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "All" },
  ...PROJECTS.map((p) => ({ id: p.id, label: p.label })),
];

export function ProjectFilter() {
  const { projectFilter, setProjectFilter } = useKanban();

  return (
    <div
      className="scrollbar-kanban flex gap-2 overflow-x-auto pb-1"
      role="tablist"
      aria-label="Filter projektu"
    >
      {FILTER_OPTIONS.map((opt) => {
        const active = projectFilter === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setProjectFilter(opt.id)}
            className={cn(
              "shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-colors",
              active
                ? "border border-white/15 bg-white/10 text-white"
                : "border border-transparent text-slate-500 hover:bg-white/[0.04] hover:text-slate-200",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
