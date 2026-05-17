import { archiveTaskToArchives } from "@/domain/archiveService";
import type { ArchivesByProject, Task } from "@/types/task";

/** Bulk archive (e.g. migration); normal flow uses per-task HITL on Done cards. */
export function flushDoneToArchive(
  activeTasks: Task[],
  archives: ArchivesByProject,
): { active: Task[]; archives: ArchivesByProject } {
  const doneTasks = activeTasks.filter((t) => t.status === "Done");
  if (doneTasks.length === 0) {
    return { active: activeTasks, archives };
  }

  let nextArchives = archives;
  for (const t of doneTasks) {
    nextArchives = archiveTaskToArchives(t, nextArchives);
  }

  const active = activeTasks.filter((t) => t.status !== "Done");
  return { active, archives: nextArchives };
}
