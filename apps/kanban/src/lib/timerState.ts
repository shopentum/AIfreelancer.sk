import type { Task } from "@/types/task";

export type TimerUiState = "running" | "paused" | "stopped";

export function getTimerUiState(task: Task): TimerUiState {
  if (task.isTimerRunning) return "running";
  if (!task.isTimerRunning && task.totalTrackedSeconds > 0) return "paused";
  return "stopped";
}
