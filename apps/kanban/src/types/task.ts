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
  project: string;
  status: TaskStatus;
  notes: string;
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
