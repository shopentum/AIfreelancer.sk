import type { ActivityEntry, ArchivedTask, Task, TaskStatus } from "@/types/task";

/** Plánovaný tvar riadku v Supabase (migrácia ešte nie je súčasť MVP). */
export interface TaskRow {
  id: string;
  title: string;
  summary: string;
  project: string;
  status: TaskStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  total_tracked_seconds: number;
  timer_started_at: string | null;
  is_timer_running: boolean;
  activity_log: ActivityEntry[];
  archived_at: string | null;
  user_id: string | null;
}

export function taskFromRow(row: TaskRow): Task | ArchivedTask {
  const base = {
    id: row.id,
    title: row.title,
    summary: row.summary ?? "",
    project: row.project,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    totalTrackedSeconds: row.total_tracked_seconds,
    timerStartedAt: row.timer_started_at,
    isTimerRunning: row.is_timer_running,
    activityLog: row.activity_log ?? [],
  };
  if (row.archived_at) {
    return { ...base, archivedAt: row.archived_at };
  }
  return base;
}

export function taskToRow(task: Task | ArchivedTask, userId?: string): TaskRow {
  return {
    id: task.id,
    title: task.title,
    summary: task.summary,
    project: task.project,
    status: task.status,
    notes: task.notes,
    created_at: task.createdAt,
    updated_at: task.updatedAt,
    total_tracked_seconds: task.totalTrackedSeconds,
    timer_started_at: task.timerStartedAt,
    is_timer_running: task.isTimerRunning,
    activity_log: task.activityLog,
    archived_at: "archivedAt" in task ? task.archivedAt : null,
    user_id: userId ?? null,
  };
}
