import type { KeyboardEvent, MouseEvent } from "react";
import { GripVertical, Pause, Play, Square } from "lucide-react";
import { getProjectLabel } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";
import { useLiveTrackedSeconds } from "@/hooks/useLiveTrackedSeconds";
import {
  formatDuration,
  formatDurationWithSeconds,
  getTaskCardLabel,
} from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
}

function stopPropagation(e: MouseEvent | KeyboardEvent) {
  e.stopPropagation();
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    setDraggingTaskId,
    draggingTaskId,
    openTaskDetail,
    startTimer,
    pauseTimer,
    stopTimer,
  } = useKanban();

  const seconds = useLiveTrackedSeconds(task);
  const timeLabel = task.isTimerRunning
    ? formatDurationWithSeconds(seconds)
    : formatDuration(seconds);

  return (
    <article
      className={cn(
        "kanban-card flex gap-2 p-2",
        draggingTaskId === task.id && "opacity-50 ring-1 ring-indigo-500/40",
      )}
    >
      <button
        type="button"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/task-id", task.id);
          e.dataTransfer.effectAllowed = "move";
          setDraggingTaskId(task.id);
        }}
        onDragEnd={() => setDraggingTaskId(null)}
        className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-1 text-slate-600 hover:bg-white/5 hover:text-slate-400 active:cursor-grabbing"
        aria-label="Presunúť kartu"
        onClick={stopPropagation}
      >
        <GripVertical className="h-4 w-4" aria-hidden />
      </button>

      <div
        role="button"
        tabIndex={0}
        className="min-w-0 flex-1 cursor-pointer rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        onClick={() => openTaskDetail(task.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openTaskDetail(task.id);
          }
        }}
      >
        <p className="text-sm font-semibold leading-snug text-white">
          {getTaskCardLabel(task)}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {getProjectLabel(task.project)}
          </span>
          <span
            className={cn(
              "tabular-nums text-xs font-medium",
              task.isTimerRunning
                ? "text-emerald-400"
                : task.status === "InProgress"
                  ? "text-orange-400"
                  : "text-slate-400",
            )}
          >
            {timeLabel}
          </span>
        </div>

        <div
          className="mt-2 flex items-center gap-1"
          onClick={stopPropagation}
          onKeyDown={stopPropagation}
        >
          {task.isTimerRunning ? (
            <button
              type="button"
              onClick={() => pauseTimer(task.id)}
              className="rounded-md border border-white/10 bg-white/5 p-1 text-amber-400 hover:bg-white/10"
              title="Pause"
              aria-label="Pause"
            >
              <Pause className="h-3 w-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => startTimer(task.id)}
              className="rounded-md border border-white/10 bg-white/5 p-1 text-emerald-400 hover:bg-white/10"
              title="Start"
              aria-label="Start"
            >
              <Play className="h-3 w-3 fill-current" />
            </button>
          )}
          {task.isTimerRunning && (
            <button
              type="button"
              onClick={() => stopTimer(task.id)}
              className="rounded-md border border-white/10 bg-white/5 p-1 text-slate-400 hover:bg-white/10"
              title="Stop"
              aria-label="Stop"
            >
              <Square className="h-3 w-3 fill-current" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
