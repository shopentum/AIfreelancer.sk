import type { TaskRepository } from "@/repositories/TaskRepository";
import type { ArchivesByProject, Task } from "@/types/task";

export const STORAGE_KEYS = {
  active: "kanban_active_tasks_v1",
  archives: "kanban_archives_v1",
} as const;

const ACTIVE_KEY = STORAGE_KEYS.active;
const ARCHIVES_KEY = STORAGE_KEYS.archives;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeTask(raw: Record<string, unknown>): Task | null {
  if (typeof raw.id !== "string" || typeof raw.title !== "string") {
    return null;
  }
  return {
    id: raw.id,
    title: raw.title,
    summary: typeof raw.summary === "string" ? raw.summary : "",
    project: typeof raw.project === "string" ? raw.project : "index",
    status: (raw.status as Task["status"]) ?? "Ready",
    notes: typeof raw.notes === "string" ? raw.notes : "",
    aiSummary: typeof raw.aiSummary === "string" ? raw.aiSummary : "",
    plannedDate:
      typeof raw.plannedDate === "string" ? raw.plannedDate : null,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
    totalTrackedSeconds:
      typeof raw.totalTrackedSeconds === "number" ? raw.totalTrackedSeconds : 0,
    timerStartedAt:
      typeof raw.timerStartedAt === "string" ? raw.timerStartedAt : null,
    isTimerRunning: Boolean(raw.isTimerRunning),
    activityLog: Array.isArray(raw.activityLog) ? (raw.activityLog as Task["activityLog"]) : [],
  };
}

function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is Record<string, unknown> => isRecord(t))
    .map(normalizeTask)
    .filter((t): t is Task => t !== null);
}

function parseArchives(raw: unknown): ArchivesByProject {
  if (!isRecord(raw)) return {};
  const out: ArchivesByProject = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!Array.isArray(value)) continue;
    out[key] = value
      .filter((t): t is Record<string, unknown> => isRecord(t))
      .map((t) => {
        const base = normalizeTask(t);
        if (!base) return null;
        const archivedAt =
          typeof t.archivedAt === "string" ? t.archivedAt : new Date().toISOString();
        return { ...base, archivedAt };
      })
      .filter((t): t is ArchivesByProject[string][number] => t !== null);
  }
  return out;
}

export class LocalStorageTaskRepository implements TaskRepository {
  loadActiveTasks(): Task[] {
    try {
      const raw = localStorage.getItem(ACTIVE_KEY);
      if (!raw) return [];
      return parseTasks(JSON.parse(raw) as unknown);
    } catch {
      return [];
    }
  }

  saveActiveTasks(tasks: Task[]): void {
    localStorage.setItem(ACTIVE_KEY, JSON.stringify(tasks));
  }

  loadArchives(): ArchivesByProject {
    try {
      const raw = localStorage.getItem(ARCHIVES_KEY);
      if (!raw) return {};
      return parseArchives(JSON.parse(raw) as unknown);
    } catch {
      return {};
    }
  }

  saveArchives(archives: ArchivesByProject): void {
    localStorage.setItem(ARCHIVES_KEY, JSON.stringify(archives));
  }
}
