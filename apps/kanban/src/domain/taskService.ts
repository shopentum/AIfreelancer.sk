import { DEFAULT_PROJECT_ID } from "@/config/defaultProjects";
import { isBacklogProjectId } from "@/lib/backlogProject";
import { appendActivity } from "@/domain/activityLog";
import { newId } from "@/lib/id";
import { isValidDateKey } from "@/lib/plannedDate";
import type { Task, TaskStatus } from "@/types/task";

const STATUS_LABELS: Record<TaskStatus, string> = {
  Ready: "Ready",
  InProgress: "In Progress",
  ReadyToReview: "Ready to Review",
  Done: "Done",
};

/** Merge current running segment into totalTrackedSeconds; clear running flags. */
export function mergeRunningSegmentIntoTotal(
  task: Task,
  nowMs = Date.now(),
): Pick<Task, "totalTrackedSeconds" | "timerStartedAt" | "isTimerRunning"> {
  if (!task.isTimerRunning || !task.timerStartedAt) {
    return {
      totalTrackedSeconds: task.totalTrackedSeconds,
      timerStartedAt: task.timerStartedAt,
      isTimerRunning: task.isTimerRunning,
    };
  }
  const started = new Date(task.timerStartedAt).getTime();
  if (Number.isNaN(started)) {
    return {
      totalTrackedSeconds: task.totalTrackedSeconds,
      timerStartedAt: null,
      isTimerRunning: false,
    };
  }
  const elapsed = Math.max(0, Math.floor((nowMs - started) / 1000));
  return {
    totalTrackedSeconds: task.totalTrackedSeconds + elapsed,
    timerStartedAt: null,
    isTimerRunning: false,
  };
}

export function createTask(
  title: string,
  project: string = DEFAULT_PROJECT_ID,
  summary = "",
): Task {
  const now = new Date().toISOString();
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Task title is required");
  }

  return {
    id: newId("task"),
    title: trimmed,
    summary: summary.trim(),
    project,
    status: "Ready",
    notes: "",
    aiSummary: "",
    plannedDate: null,
    createdAt: now,
    updatedAt: now,
    totalTrackedSeconds: 0,
    timerStartedAt: null,
    isTimerRunning: false,
    activityLog: appendActivity([], "created"),
  };
}

export function updateTaskStatus(task: Task, nextStatus: TaskStatus): Task {
  if (task.status === nextStatus) return task;

  const nowIso = new Date().toISOString();
  const nowMs = Date.now();

  let working: Task = task;
  if (nextStatus === "Done" && working.isTimerRunning) {
    const merged = mergeRunningSegmentIntoTotal(working, nowMs);
    working = {
      ...working,
      ...merged,
      updatedAt: nowIso,
      activityLog: appendActivity(working.activityLog, "timer_stopped"),
    };
  }

  let log = appendActivity(working.activityLog, "status_changed", {
    from: STATUS_LABELS[working.status],
    to: STATUS_LABELS[nextStatus],
  });

  if (nextStatus === "Done") {
    log = appendActivity(log, "marked_done");
  }

  return {
    ...working,
    status: nextStatus,
    updatedAt: nowIso,
    activityLog: log,
  };
}

export function applyTaskStatusUpdate(
  tasks: Task[],
  taskId: string,
  nextStatus: TaskStatus,
): Task[] {
  return tasks.map((t) =>
    t.id === taskId ? updateTaskStatus(t, nextStatus) : t,
  );
}

export function updateTaskTitle(task: Task, title: string): Task {
  const trimmed = title.trim();
  if (!trimmed || trimmed === task.title) return task;
  const now = new Date().toISOString();
  return { ...task, title: trimmed, updatedAt: now };
}

export function updateTaskSummary(task: Task, summary: string): Task {
  if (summary === task.summary) return task;
  const now = new Date().toISOString();
  return { ...task, summary, updatedAt: now };
}

/** Move inbox task onto the board: assign project + Ready column. */
export function promoteBacklogTask(
  task: Task,
  targetProjectId: string,
  fromLabel: string,
  toLabel: string,
): Task {
  let working = task;
  if (isBacklogProjectId(task.project)) {
    working = updateTaskProject(task, targetProjectId, fromLabel, toLabel);
  }
  return updateTaskStatus(working, "Ready");
}

export function updateTaskProject(
  task: Task,
  projectId: string,
  fromLabel: string,
  toLabel: string,
): Task {
  if (projectId === task.project) return task;
  const now = new Date().toISOString();
  const log = appendActivity(task.activityLog, "project_changed", {
    from: fromLabel,
    to: toLabel,
  });
  return {
    ...task,
    project: projectId,
    updatedAt: now,
    activityLog: log,
  };
}

export function updateTaskPlannedDate(
  task: Task,
  plannedDate: string | null,
): Task {
  const next =
    plannedDate === null || plannedDate === ""
      ? null
      : isValidDateKey(plannedDate)
        ? plannedDate
        : task.plannedDate;
  if (next === task.plannedDate) return task;

  const now = new Date().toISOString();
  const log = appendActivity(task.activityLog, "planned_date_changed", {
    from: task.plannedDate ?? "—",
    to: next ?? "—",
  });
  return {
    ...task,
    plannedDate: next,
    updatedAt: now,
    activityLog: log,
  };
}

export function updateTaskNotes(task: Task, notes: string): Task {
  if (notes === task.notes) return task;
  const now = new Date().toISOString();
  const log = appendActivity(task.activityLog, "notes_updated");
  return {
    ...task,
    notes,
    updatedAt: now,
    activityLog: log,
  };
}

export function updateTaskAiSummary(task: Task, aiSummary: string): Task {
  if (aiSummary === task.aiSummary) return task;
  const now = new Date().toISOString();
  const log = appendActivity(task.activityLog, "ai_summary_updated");
  return {
    ...task,
    aiSummary,
    updatedAt: now,
    activityLog: log,
  };
}

export function timerStart(task: Task): Task {
  if (task.isTimerRunning) return task;
  const now = new Date().toISOString();
  return {
    ...task,
    isTimerRunning: true,
    timerStartedAt: now,
    updatedAt: now,
    activityLog: appendActivity(task.activityLog, "timer_started"),
  };
}

export function timerPause(task: Task): Task {
  if (!task.isTimerRunning) return task;
  const nowMs = Date.now();
  const nowIso = new Date().toISOString();
  const merged = mergeRunningSegmentIntoTotal(task, nowMs);
  return {
    ...task,
    ...merged,
    updatedAt: nowIso,
    activityLog: appendActivity(task.activityLog, "timer_paused"),
  };
}

export function addTaskTrackedMinutes(task: Task, minutes: number): Task {
  const wholeMinutes = Math.floor(minutes);
  if (wholeMinutes <= 0 || !Number.isFinite(wholeMinutes)) return task;

  const nowIso = new Date().toISOString();
  let working: Task = task;
  if (task.isTimerRunning) {
    working = { ...task, ...mergeRunningSegmentIntoTotal(task) };
  }

  const log = appendActivity(working.activityLog, "time_added_manually", {
    minutes: String(wholeMinutes),
  });

  return {
    ...working,
    totalTrackedSeconds: working.totalTrackedSeconds + wholeMinutes * 60,
    updatedAt: nowIso,
    activityLog: log,
  };
}

export function timerStop(task: Task): Task {
  if (!task.isTimerRunning) return task;
  const nowMs = Date.now();
  const nowIso = new Date().toISOString();
  const merged = mergeRunningSegmentIntoTotal(task, nowMs);
  return {
    ...task,
    ...merged,
    updatedAt: nowIso,
    activityLog: appendActivity(task.activityLog, "timer_stopped"),
  };
}

export function deleteTaskFromList(tasks: Task[], taskId: string): Task[] {
  return tasks.filter((t) => t.id !== taskId);
}
