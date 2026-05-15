import { DEFAULT_PROJECT_ID } from "@/config/projects";
import { appendActivity } from "@/domain/activityLog";
import { newId } from "@/lib/id";
import type { Task, TaskStatus } from "@/types/task";

const STATUS_LABELS: Record<TaskStatus, string> = {
  Ready: "Ready",
  InProgress: "In Progress",
  ReadyToReview: "Ready to Review",
  Done: "Done",
};

export function createTask(title: string, project: string = DEFAULT_PROJECT_ID): Task {
  const now = new Date().toISOString();
  const trimmed = title.trim();
  if (!trimmed) {
    throw new Error("Task title is required");
  }

  return {
    id: newId("task"),
    title: trimmed,
    project,
    status: "Ready",
    notes: "",
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

  const now = new Date().toISOString();
  let log = appendActivity(task.activityLog, "status_changed", {
    from: STATUS_LABELS[task.status],
    to: STATUS_LABELS[nextStatus],
  });

  if (nextStatus === "Done") {
    log = appendActivity(log, "marked_done");
  }

  return {
    ...task,
    status: nextStatus,
    updatedAt: now,
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
