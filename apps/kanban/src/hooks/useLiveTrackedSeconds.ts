import { useEffect, useState } from "react";
import { getDisplayTrackedSeconds } from "@/lib/formatters";
import type { Task } from "@/types/task";

/** Re-render every second while timer runs (live kanban clock). */
export function useLiveTrackedSeconds(task: Task): number {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!task.isTimerRunning) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [task.isTimerRunning, task.timerStartedAt]);

  return getDisplayTrackedSeconds(task, nowMs);
}
