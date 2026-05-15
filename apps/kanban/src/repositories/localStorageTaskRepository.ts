import type { TaskRepository } from "@/repositories/TaskRepository";
import type { ArchivesByProject, Task } from "@/types/task";

const ACTIVE_KEY = "kanban_active_tasks_v1";
const ARCHIVES_KEY = "kanban_archives_v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((t): t is Task => isRecord(t) && typeof t.id === "string");
}

function parseArchives(raw: unknown): ArchivesByProject {
  if (!isRecord(raw)) return {};
  const out: ArchivesByProject = {};
  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      out[key] = value.filter(
        (t): t is ArchivesByProject[string][number] =>
          isRecord(t) && typeof t.id === "string",
      );
    }
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

export const taskRepository = new LocalStorageTaskRepository();
