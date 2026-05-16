import { useRef } from "react";
import { Circle, Pause, Play } from "lucide-react";
import { getProjectLabel } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";
import { formatDuration, getDisplayTrackedSeconds } from "@/lib/formatters";
import { getTimerUiState } from "@/lib/timerState";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
}

function TimerIcon({ state }: { state: ReturnType<typeof getTimerUiState> }) {
  if (state === "running") {
    return <Play className="h-3 w-3 fill-current text-emerald-400" aria-hidden />;
  }
  if (state === "paused") {
    return <Pause className="h-3 w-3 text-amber-400" aria-hidden />;
  }
  return <Circle className="h-3 w-3 text-slate-600" aria-hidden />;
}

export function TaskCard({ task }: TaskCardProps) {
  const { setDraggingTaskId, draggingTaskId, openTaskDetail } = useKanban();
  const skipClickRef = useRef(false);
  const timerState = getTimerUiState(task);
  const seconds = getDisplayTrackedSeconds(task);

  return (
    <article
      draggable
      onDragStart={(e) => {
        skipClickRef.current = true;
        e.dataTransfer.setData("text/task-id", task.id);
        e.dataTransfer.effectAllowed = "move";
        setDraggingTaskId(task.id);
      }}
      onDragEnd={() => {
        setDraggingTaskId(null);
        window.setTimeout(() => {
          skipClickRef.current = false;
        }, 0);
      }}
      onClick={() => {
        if (skipClickRef.current) return;
        openTaskDetail(task.id);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openTaskDetail(task.id);
        }
      }}
      role="button"
      tabIndex={0}
      className={cn(
        "kanban-card cursor-grab active:cursor-grabbing select-none outline-none hover:ring-1 hover:ring-white/10 focus-visible:ring-2 focus-visible:ring-indigo-500/50",
        draggingTaskId === task.id && "cursor-grabbing opacity-50 ring-1 ring-indigo-500/40",
      )}
    >
      <h3 className="text-sm font-semibold leading-snug text-white">{task.title}</h3>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-300">
          {getProjectLabel(task.project)}
        </span>
        <span className="flex items-center gap-1 text-xs tabular-nums text-slate-400">
          <TimerIcon state={timerState} />
          {formatDuration(seconds)}
        </span>
        <span className="sr-only">Timer: {timerState}</span>
      </div>
    </article>
  );
}
