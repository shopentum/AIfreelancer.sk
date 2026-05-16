import { FormEvent, useState } from "react";
import { CheckCircle2, ChevronDown, Plus } from "lucide-react";
import { DEFAULT_PROJECT_ID, PROJECTS } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface KanbanHeaderProps {
  title: string;
  subtitle: string;
  showBrainDump: boolean;
}

export function KanbanHeader({
  title,
  subtitle,
  showBrainDump,
}: KanbanHeaderProps) {
  const { isDark } = useTheme();
  const { addTask, projectFilter } = useKanban();
  const [titleInput, setTitleInput] = useState("");
  const [brainProject, setBrainProject] = useState(DEFAULT_PROJECT_ID);
  const projectForNewTask =
    projectFilter !== "all" ? projectFilter : brainProject;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = titleInput.trim();
    if (!trimmed) return;
    addTask(trimmed, projectForNewTask || DEFAULT_PROJECT_ID);
    setTitleInput("");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b px-4 py-4 backdrop-blur-md transition-colors duration-500 md:px-8",
        t(
          isDark,
          "border-slate-200 bg-white/80",
          "border-slate-800 bg-slate-950/80",
        ),
      )}
    >
      <div className="mx-auto flex max-w-[1800px] flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex shrink-0 items-center gap-4">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-colors",
              t(isDark, "bg-slate-900 text-white", "bg-indigo-600 text-white"),
            )}
          >
            <CheckCircle2 size={24} aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                t(isDark, "text-slate-400", "text-slate-500"),
              )}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {showBrainDump && (
          <form
            onSubmit={submit}
            className="group relative flex max-w-2xl flex-1 items-center md:px-4"
          >
            <div className="relative">
              <select
                value={projectForNewTask}
                onChange={(e) => setBrainProject(e.target.value)}
                disabled={projectFilter !== "all"}
                className={cn(
                  "cursor-pointer appearance-none rounded-l-2xl border-r py-4 pl-4 pr-10 text-xs font-bold outline-none transition-all",
                  t(
                    isDark,
                    "border-slate-200 bg-slate-100 text-slate-500 group-focus-within:border-slate-300 focus:text-slate-900",
                    "border-slate-800 bg-slate-900 text-slate-400 group-focus-within:border-indigo-500/50 focus:text-indigo-400",
                  ),
                )}
                aria-label="Projekt pre novú úlohu"
              >
                {PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronDown size={14} aria-hidden />
              </div>
            </div>
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Rýchly zápis: názov úlohy… (Enter = uložiť)"
              className={cn(
                "flex-1 rounded-r-2xl border-none px-6 py-4 text-sm outline-none transition-all focus:ring-2",
                t(
                  isDark,
                  "bg-slate-100 text-slate-900 placeholder-slate-400 focus:ring-slate-900",
                  "bg-slate-900 text-white placeholder-slate-600 focus:ring-indigo-500",
                ),
              )}
              autoComplete="off"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <span
                className={cn(
                  "hidden rounded-lg border px-2 py-1 text-[10px] font-bold group-focus-within:block",
                  t(
                    isDark,
                    "border-slate-200 bg-white text-slate-400",
                    "border-slate-700 bg-slate-800 text-slate-500",
                  ),
                )}
              >
                ENTER
              </span>
              <button
                type="submit"
                className={cn(
                  "rounded-xl p-2 shadow-lg transition-all",
                  t(
                    isDark,
                    "bg-slate-900 text-white shadow-slate-500/20 hover:bg-slate-800",
                    "bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-500",
                  ),
                )}
                aria-label="Pridať úlohu"
              >
                <Plus size={18} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
}
