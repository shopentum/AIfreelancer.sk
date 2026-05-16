import { FormEvent, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { DEFAULT_PROJECT_ID } from "@/config/defaultProjects";
import { useProjects } from "@/hooks/useProjects";
import { useKanban } from "@/hooks/useKanbanStore";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface KanbanHeaderProps {
  title?: string;
  showBrainDump: boolean;
}

export function KanbanHeader({ title, showBrainDump }: KanbanHeaderProps) {
  const { isDark } = useTheme();
  const { addTask, projectFilter } = useKanban();
  const { selectableProjects } = useProjects();
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
      <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-center gap-3">
        {showBrainDump ? (
          <form
            onSubmit={submit}
            className="group relative flex w-full max-w-3xl items-center"
          >
            <div className="relative shrink-0">
              <select
                value={projectForNewTask}
                onChange={(e) => setBrainProject(e.target.value)}
                disabled={projectFilter !== "all"}
                className={cn(
                  "cursor-pointer appearance-none rounded-l-2xl border-r py-3.5 pl-4 pr-10 text-xs font-bold outline-none transition-all md:py-4",
                  t(
                    isDark,
                    "border-slate-200 bg-slate-100 text-slate-500 group-focus-within:border-slate-300 focus:text-slate-900",
                    "border-slate-800 bg-slate-900 text-slate-400 group-focus-within:border-indigo-500/50 focus:text-indigo-400",
                  ),
                )}
                aria-label="Projekt pre novú úlohu"
              >
                {selectableProjects.map((p) => (
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
                "min-w-0 flex-1 rounded-r-2xl border-none px-5 py-3.5 text-sm outline-none transition-all focus:ring-2 md:px-6 md:py-4",
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
        ) : (
          title && (
            <h1
              className={cn(
                "w-full text-left text-xl font-bold tracking-tight md:max-w-3xl",
                t(isDark, "text-slate-900", "text-white"),
              )}
            >
              {title}
            </h1>
          )
        )}
      </div>
    </header>
  );
}
