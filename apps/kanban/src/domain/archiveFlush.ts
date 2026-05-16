import { mergeRunningSegmentIntoTotal } from "@/domain/taskService";
import type { ArchivedTask, ArchivesByProject, Task } from "@/types/task";

/**
 * Presun úloh so statusom Done z aktívneho poľa do archívu (per project).
 * Volá sa pri bootstrap aplikácie (napr. po reload).
 */
export function flushDoneToArchive(
  activeTasks: Task[],
  archives: ArchivesByProject,
): { active: Task[]; archives: ArchivesByProject } {
  const doneTasks = activeTasks.filter((t) => t.status === "Done");
  if (doneTasks.length === 0) {
    return { active: activeTasks, archives };
  }

  const archivedAt = new Date().toISOString();
  const nextArchives: ArchivesByProject = { ...archives };

  for (const t of doneTasks) {
    const finalized = t.isTimerRunning
      ? { ...t, ...mergeRunningSegmentIntoTotal(t) }
      : t;
    const entry: ArchivedTask = {
      ...finalized,
      archivedAt,
    };
    const prev = nextArchives[t.project] ?? [];
    nextArchives[t.project] = [...prev, entry];
  }

  const active = activeTasks.filter((t) => t.status !== "Done");
  return { active, archives: nextArchives };
}
