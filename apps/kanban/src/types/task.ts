export const TASK_STATUSES = [
  "Ready",
  "InProgress",
  "ReadyToReview",
  "Done",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];

export type ActivityType =
  | "created"
  | "status_changed"
  | "timer_started"
  | "timer_paused"
  | "timer_stopped"
  | "notes_updated"
  | "project_changed"
  | "planned_date_changed"
  | "ai_summary_updated"
  | "time_added_manually"
  | "marked_done";

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  at: string;
  payload?: Record<string, string>;
}

export interface Task {
  id: string;
  title: string;
  /** Short label shown on kanban cards. */
  summary: string;
  project: string;
  status: TaskStatus;
  notes: string;
  /** AI / decision-layer context; edited manually until generation exists. */
  aiSummary: string;
  /** Calendar day YYYY-MM-DD (Europe/Bratislava), or null. */
  plannedDate: string | null;
  createdAt: string;
  updatedAt: string;
  totalTrackedSeconds: number;
  timerStartedAt: string | null;
  isTimerRunning: boolean;
  activityLog: ActivityEntry[];
}

export interface ArchivedTask extends Task {
  archivedAt: string;
}

export type ArchivesByProject = Record<string, ArchivedTask[]>;
