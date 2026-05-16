import type { ArchivesByProject } from "@/types/task";

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
