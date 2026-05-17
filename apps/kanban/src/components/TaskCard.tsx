import type { MouseEvent } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Clock, Pause, Play, Square, X } from "lucide-react";
import { getColumnTheme } from "@/config/columnStyle";
import { getProjectBadgeClass } from "@/config/projectStyle";
import { useProjects } from "@/hooks/useProjects";
import { useKanban } from "@/hooks/useKanbanStore";
import { useLiveTrackedSeconds } from "@/hooks/useLiveTrackedSeconds";
import { t, useTheme } from "@/hooks/useTheme";
import {
  formatDuration,
  formatDurationWithSeconds,
  formatSkShortDate,
  getTaskCardLabel,
} from "@/lib/formatters";
import {
  getPlannedBadgeClass,
  getPlannedDateBadge,
} from "@/lib/plannedDate";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";

interface TaskCardProps {
  task: Task;
  index: number;
  columnStatus: TaskStatus;
}

function stopPropagation(e: MouseEvent) {
  e.stopPropagation();
}

export function TaskCard({ task, index, columnStatus }: TaskCardProps) {
  const { isDark } = useTheme();
  const columnTheme = getColumnTheme(columnStatus, isDark);
  const { openTaskDetail, startTimer, pauseTimer, stopTimer, archiveTask } =
    useKanban();
  const isDone = columnStatus === "Done";
  const { getLabel } = useProjects();

  const seconds = useLiveTrackedSeconds(task);
  const timeLabel = task.isTimerRunning
    ? formatDurationWithSeconds(seconds)
    : formatDuration(seconds);

  const plannedBadge = task.plannedDate
    ? getPlannedDateBadge(task.plannedDate)
    : null;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => openTaskDetail(task.id)}
          className={cn(
            "group relative cursor-grab select-none overflow-hidden rounded-[1.5rem] border p-4 shadow-sm transition-all active:cursor-grabbing",
            t(
              isDark,
              "border-slate-200 bg-white text-slate-900 shadow-slate-200/50 hover:-translate-y-0.5 hover:shadow-xl",
              "border-slate-800 bg-slate-900 text-slate-100 shadow-slate-950/20 hover:border-slate-700 hover:bg-slate-800/80",
            ),
            snapshot.isDragging &&
              t(
                isDark,
                "scale-[1.02] border-slate-900 bg-white/95 shadow-2xl",
                "scale-[1.02] border-indigo-500/50 bg-slate-800/90 shadow-2xl",
              ),
          )}
        >
          {isDone ? (
            <button
              type="button"
              onClick={(e) => {
                stopPropagation(e);
                const label = getTaskCardLabel(task);
                if (
                  !window.confirm(
                    `Archivovať „${label}"? Úloha zmizne z dosky a presunie sa do archívu.`,
                  )
                ) {
                  return;
                }
                archiveTask(task.id);
              }}
              className={cn(
                "absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-lg border opacity-80 transition-all hover:opacity-100 active:scale-95",
                t(
                  isDark,
                  "border-slate-200 bg-slate-50 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600",
                  "border-slate-700 bg-slate-800 text-slate-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400",
                ),
              )}
              title="Archivovať"
              aria-label="Archivovať úlohu"
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          ) : (
            <div
              className={cn(
                "absolute top-4 right-4 h-2 w-2 rounded-full",
                columnTheme.dotClass,
              )}
              aria-hidden
            />
          )}

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-1.5 pr-6">
              <div
                className={cn(
                  "rounded-lg border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] w-fit max-w-[85%]",
                  getProjectBadgeClass(task.project, isDark),
                )}
              >
                {getLabel(task.project)}
              </div>
              {plannedBadge && (
                <span
                  className={cn(
                    "rounded-lg border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em]",
                    getPlannedBadgeClass(plannedBadge.variant, isDark),
                  )}
                >
                  {plannedBadge.label}
                </span>
              )}
            </div>

            <div className="min-h-[2.375rem] space-y-0.5 pr-4">
              <h3
                className={cn(
                  "truncate text-sm font-bold leading-5",
                  t(isDark, "text-slate-800", "text-slate-100"),
                )}
                title={getTaskCardLabel(task)}
              >
                {getTaskCardLabel(task)}
              </h3>
              {task.summary.trim() && (
                <p
                  className={cn(
                    "truncate text-[11px] leading-snug",
                    t(isDark, "text-slate-500", "text-slate-500"),
                  )}
                  title={task.summary.trim()}
                >
                  {task.summary.trim()}
                </p>
              )}
            </div>

            <div
              className={cn(
                "flex items-center justify-between gap-3 border-t pt-1.5 transition-colors",
                t(isDark, "border-slate-50", "border-slate-800"),
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-2 text-[10px] font-medium italic",
                  t(isDark, "text-slate-400", "text-slate-500"),
                )}
              >
                <Clock size={12} aria-hidden />
                <span>{formatSkShortDate(task.createdAt)}</span>
              </div>

              <div
                className="flex items-center gap-2"
                onClick={stopPropagation}
                onKeyDown={stopPropagation}
                role="presentation"
              >
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold tabular-nums",
                    task.isTimerRunning
                      ? "text-emerald-500"
                      : t(isDark, "text-slate-500", "text-slate-400"),
                  )}
                >
                  {timeLabel}
                </span>
                {!isDone &&
                  (task.isTimerRunning ? (
                    <>
                      <button
                        type="button"
                        onClick={() => pauseTimer(task.id)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                          t(
                            isDark,
                            "bg-amber-100 text-amber-600 hover:bg-amber-200",
                            "bg-amber-600/20 text-amber-500 hover:bg-amber-600/30",
                          ),
                        )}
                        title="Pause"
                        aria-label="Pause"
                      >
                        <Pause size={14} fill="currentColor" />
                      </button>
                      <button
                        type="button"
                        onClick={() => stopTimer(task.id)}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                          t(
                            isDark,
                            "bg-slate-100 text-slate-500 hover:bg-slate-200",
                            "bg-slate-800 text-slate-400 hover:bg-slate-700",
                          ),
                        )}
                        title="Stop"
                        aria-label="Stop"
                      >
                        <Square size={14} fill="currentColor" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startTimer(task.id)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                        t(
                          isDark,
                          "bg-slate-100 text-slate-600 hover:bg-slate-200",
                          "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200",
                        ),
                      )}
                      title="Start"
                      aria-label="Start"
                    >
                      <Play size={14} fill="currentColor" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </article>
      )}
    </Draggable>
  );
}
