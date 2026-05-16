import { useMemo } from "react";
import { useKanban } from "@/hooks/useKanbanStore";
import { t, useTheme } from "@/hooks/useTheme";
import { getTaskCardLabel } from "@/lib/formatters";
import { getTodayKey, getTomorrowKey } from "@/lib/plannedDate";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

function groupByDay(tasks: Task[], dayKey: string): Task[] {
  return tasks.filter((t) => t.plannedDate === dayKey);
}

function TaskLinks({
  tasks,
  onOpen,
  isDark,
}: {
  tasks: Task[];
  onOpen: (id: string) => void;
  isDark: boolean;
}) {
  return (
    <>
      {tasks.map((task, i) => (
        <span key={task.id} className="inline-flex items-center">
          {i > 0 && (
            <span
              className={cn(
                "mx-1.5",
                t(isDark, "text-slate-300", "text-slate-600"),
              )}
              aria-hidden
            >
              ·
            </span>
          )}
          <button
            type="button"
            onClick={() => onOpen(task.id)}
            className={cn(
              "max-w-[min(100%,12rem)] truncate text-left underline-offset-2 transition-colors hover:underline sm:max-w-[14rem]",
              t(isDark, "text-slate-700 hover:text-slate-900", "text-slate-300 hover:text-white"),
            )}
            title={getTaskCardLabel(task)}
          >
            {getTaskCardLabel(task)}
          </button>
        </span>
      ))}
    </>
  );
}

export function PlannedDateStrip() {
  const { isDark } = useTheme();
  const { visibleTasks, openTaskDetail } = useKanban();

  const { todayTasks, tomorrowTasks } = useMemo(() => {
    const todayKey = getTodayKey();
    const tomorrowKey = getTomorrowKey();
    const active = visibleTasks.filter((t) => t.status !== "Done");
    return {
      todayTasks: groupByDay(active, todayKey),
      tomorrowTasks: groupByDay(active, tomorrowKey),
    };
  }, [visibleTasks]);

  if (todayTasks.length === 0 && tomorrowTasks.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "mb-3 flex flex-col gap-2 rounded-2xl border px-3 py-2.5 text-xs sm:mb-4 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-6 sm:gap-y-1 sm:px-4",
        t(
          isDark,
          "border-slate-200 bg-white/80 text-slate-600",
          "border-slate-800 bg-slate-900/60 text-slate-400",
        ),
      )}
    >
      {todayTasks.length > 0 && (
        <p className="flex min-w-0 flex-wrap items-baseline gap-1.5">
          <span
            className={cn(
              "shrink-0 font-semibold uppercase tracking-wider",
              t(isDark, "text-emerald-700", "text-emerald-400"),
            )}
          >
            Dnes
          </span>
          <span className={t(isDark, "text-slate-300", "text-slate-600")}>:</span>
          <TaskLinks tasks={todayTasks} onOpen={openTaskDetail} isDark={isDark} />
        </p>
      )}
      {tomorrowTasks.length > 0 && (
        <p className="flex min-w-0 flex-wrap items-baseline gap-1.5">
          <span
            className={cn(
              "shrink-0 font-semibold uppercase tracking-wider",
              t(isDark, "text-sky-700", "text-sky-400"),
            )}
          >
            Zajtra
          </span>
          <span className={t(isDark, "text-slate-300", "text-slate-600")}>:</span>
          <TaskLinks
            tasks={tomorrowTasks}
            onOpen={openTaskDetail}
            isDark={isDark}
          />
        </p>
      )}
    </div>
  );
}
