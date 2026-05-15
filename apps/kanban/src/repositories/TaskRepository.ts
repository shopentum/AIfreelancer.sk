import type { ArchivesByProject, Task } from "@/types/task";

export interface TaskRepository {
  loadActiveTasks(): Task[];
  saveActiveTasks(tasks: Task[]): void;
  loadArchives(): ArchivesByProject;
  saveArchives(archives: ArchivesByProject): void;
}
