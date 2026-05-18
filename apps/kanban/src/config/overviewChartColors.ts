import type { TaskStatus } from "@/types/task";

/** Chart colors aligned with kanban column accents. */
export const OVERVIEW_CHART_COLORS: Record<TaskStatus, string> = {
  Ready: "#3b82f6",
  InProgress: "#f97316",
  ReadyToReview: "#8b5cf6",
  Done: "#10b981",
};
