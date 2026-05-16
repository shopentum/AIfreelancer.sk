import {
  BACKLOG_PROJECT_ID,
  LEGACY_INDEX_PROJECT_ID,
} from "@/config/defaultProjects";
import type { Task } from "@/types/task";

export function isBacklogProjectId(projectId: string): boolean {
  return (
    projectId === BACKLOG_PROJECT_ID || projectId === LEGACY_INDEX_PROJECT_ID
  );
}

export function normalizeProjectId(projectId: string): string {
  return projectId === LEGACY_INDEX_PROJECT_ID
    ? BACKLOG_PROJECT_ID
    : projectId;
}

export function isBacklogTask(task: Pick<Task, "project">): boolean {
  return isBacklogProjectId(task.project);
}

/** Tasks shown on the main kanban board (never backlog inbox). */
export function filterBoardTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => !isBacklogTask(t));
}

export function filterBacklogTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => isBacklogTask(t));
}
