import { ArrowRight, Trash2 } from "lucide-react";
import { BACKLOG_PROJECT_ID } from "@/config/defaultProjects";
import { useKanban } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { t, useTheme } from "@/hooks/useTheme";
import { getTaskCardLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

export function BacklogList() {
  const { isDark } = useTheme();
  const { backlogTasks, openTaskDetail, deleteTask, promoteToReady } = useKanban();
  const { boardProjects, getLabel } = useProjects();

  const defaultTargetProject = boardProjects[0]?.id ?? "shopentum";

  function handleDelete(task: Task) {
    if (
      !window.confirm(
        `Odstrániť „${getTaskCardLabel(task)}" natrvalo?`,
      )
    ) {
      return;
    }
    deleteTask(task.id);
  }

  const rowClass = cn(
    "flex flex-col gap-3 border-b px-4 py-4 transition-colors last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
    t(
      isDark,
      "border-slate-100 hover:bg-slate-50",
      "border-slate-800/60 hover:bg-white/[0.02]",
    ),
  );

  if (backlogTasks.length === 0) {
    return (
      <p
        className={cn(
          "rounded-2xl border px-6 py-16 text-center text-sm",
          t(isDark, "border-slate-200 text-slate-400", "border-slate-800 text-slate-500"),
        )}
      >
        Backlog je prázdny. Pridaj nápad v poli hore.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border",
        t(isDark, "border-slate-200 bg-white", "border-slate-800 bg-slate-900/40"),
      )}
    >
      {backlogTasks.map((task) => (
        <article key={task.id} className={rowClass}>
          <button
            type="button"
            onClick={() => openTaskDetail(task.id)}
            className="min-w-0 flex-1 text-left"
          >
            <p
              className={cn(
                "truncate font-semibold",
                t(isDark, "text-slate-900", "text-white"),
              )}
            >
              {getTaskCardLabel(task)}
            </p>
            {task.summary.trim() && (
              <p
                className={cn(
                  "mt-1 line-clamp-2 text-sm",
                  t(isDark, "text-slate-500", "text-slate-400"),
                )}
              >
                {task.summary.trim()}
              </p>
            )}
            <p className={cn("mt-2 text-[10px] uppercase tracking-widest", t(isDark, "text-slate-400", "text-slate-600"))}>
              {getLabel(BACKLOG_PROJECT_ID)} · {task.status}
            </p>
          </button>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <select
              id={`promote-${task.id}`}
              defaultValue={defaultTargetProject}
              className={cn(
                "max-w-[140px] rounded-xl border px-2 py-2 text-xs font-medium outline-none",
                t(
                  isDark,
                  "border-slate-200 bg-slate-50 text-slate-700",
                  "border-slate-700 bg-slate-800 text-slate-200",
                ),
              )}
              aria-label="Cieľový projekt"
              onClick={(e) => e.stopPropagation()}
            >
              {boardProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const select = document.getElementById(
                  `promote-${task.id}`,
                ) as HTMLSelectElement | null;
                const projectId = select?.value ?? defaultTargetProject;
                promoteToReady(task.id, projectId);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                t(
                  isDark,
                  "bg-slate-900 text-white hover:bg-slate-800",
                  "bg-indigo-600 text-white hover:bg-indigo-500",
                ),
              )}
            >
              <ArrowRight size={14} aria-hidden />
              Do Ready
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(task);
              }}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors",
                t(
                  isDark,
                  "border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
                  "border-slate-700 text-slate-500 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400",
                ),
              )}
              aria-label="Zmazať"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
