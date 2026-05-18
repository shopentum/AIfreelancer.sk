import { mergeRunningSegmentIntoTotal } from "@/domain/taskService";
import type {
  ArchivedTask,
  ArchivesByProject,
  Task,
} from "@/types/task";

export const KANBAN_ARCHIVES_CHANGED = "kanban-archives-changed";

export function notifyArchivesChanged(): void {
  window.dispatchEvent(new CustomEvent(KANBAN_ARCHIVES_CHANGED));
}

/** Move one task from the board into per-project archive storage. */
export function archiveTaskToArchives(
  task: Task,
  archives: ArchivesByProject,
): ArchivesByProject {
  const finalized = task.isTimerRunning
    ? { ...task, ...mergeRunningSegmentIntoTotal(task) }
    : task;
  const entry: ArchivedTask = {
    ...finalized,
    archivedAt: new Date().toISOString(),
  };
  const next: ArchivesByProject = { ...archives };
  const prev = next[task.project] ?? [];
  next[task.project] = [...prev, entry];
  return next;
}

export function findArchivedTask(
  archives: ArchivesByProject,
  taskId: string,
): ArchivedTask | null {
  for (const items of Object.values(archives)) {
    const hit = items.find((t) => t.id === taskId);
    if (hit) return hit;
  }
  return null;
}

/** Update one archived task (moves bucket when project changes). */
export function updateArchivedTask(
  archives: ArchivesByProject,
  taskId: string,
  updater: (task: ArchivedTask) => ArchivedTask,
): ArchivesByProject | null {
  const current = findArchivedTask(archives, taskId);
  if (!current) return null;
  const updated = updater(current);
  const without = deleteArchivedTask(archives, taskId);
  const bucket = updated.project;
  return {
    ...without,
    [bucket]: [...(without[bucket] ?? []), updated],
  };
}

/** Remove one archived task by id (searches all project buckets). */
export function deleteArchivedTask(
  archives: ArchivesByProject,
  taskId: string,
): ArchivesByProject {
  const next: ArchivesByProject = {};
  for (const [projectId, items] of Object.entries(archives)) {
    const filtered = items.filter((t) => t.id !== taskId);
    if (filtered.length > 0) {
      next[projectId] = filtered;
    }
  }
  return next;
}
