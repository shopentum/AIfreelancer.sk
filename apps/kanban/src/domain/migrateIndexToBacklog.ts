import {
  BACKLOG_PROJECT_ID,
  LEGACY_INDEX_PROJECT_ID,
} from "@/config/defaultProjects";
import { normalizeProjectId } from "@/lib/backlogProject";
import { loadProjectsFromStorage, saveProjectsToStorage } from "@/repositories/localStorageProjectRepository";
import { taskRepository } from "@/repositories";
import type { ArchivesByProject, Task } from "@/types/task";
import type { Project } from "@/types/project";

const MIGRATION_KEY = "kanban_migrated_index_to_backlog_v1";

function migrateProjects(projects: Project[]): {
  projects: Project[];
  changed: boolean;
} {
  let changed = false;
  let list = [...projects];
  const hasBacklog = list.some((p) => p.id === BACKLOG_PROJECT_ID);
  const indexIdx = list.findIndex((p) => p.id === LEGACY_INDEX_PROJECT_ID);

  if (indexIdx >= 0) {
    if (hasBacklog) {
      list = list.filter((_, i) => i !== indexIdx);
    } else {
      list = list.map((p, i) =>
        i === indexIdx
          ? {
              ...p,
              id: BACKLOG_PROJECT_ID,
              label: p.label === "Index" ? "Backlog" : p.label,
            }
          : p,
      );
    }
    changed = true;
  }

  if (!list.some((p) => p.id === BACKLOG_PROJECT_ID)) {
    list = [
      {
        id: BACKLOG_PROJECT_ID,
        label: "Backlog",
        active: true,
        createdAt: new Date().toISOString(),
        archivedAt: null,
      },
      ...list,
    ];
    changed = true;
  }

  const backlogIdx = list.findIndex((p) => p.id === BACKLOG_PROJECT_ID);
  if (backlogIdx >= 0 && !list[backlogIdx].active) {
    list = list.map((p, i) =>
      i === backlogIdx ? { ...p, active: true, archivedAt: null } : p,
    );
    changed = true;
  }

  return { projects: list, changed };
}

function migrateTaskList(tasks: Task[]): { tasks: Task[]; changed: boolean } {
  let changed = false;
  const next = tasks.map((t) => {
    if (t.project !== LEGACY_INDEX_PROJECT_ID) return t;
    changed = true;
    return { ...t, project: BACKLOG_PROJECT_ID };
  });
  return { tasks: next, changed };
}

function migrateArchives(archives: ArchivesByProject): {
  archives: ArchivesByProject;
  changed: boolean;
} {
  if (!(LEGACY_INDEX_PROJECT_ID in archives)) {
    return { archives, changed: false };
  }
  const next: ArchivesByProject = { ...archives };
  const legacy = next[LEGACY_INDEX_PROJECT_ID] ?? [];
  delete next[LEGACY_INDEX_PROJECT_ID];
  const existing = next[BACKLOG_PROJECT_ID] ?? [];
  next[BACKLOG_PROJECT_ID] = [...legacy, ...existing].map((t) => ({
    ...t,
    project: BACKLOG_PROJECT_ID,
  }));
  return { archives: next, changed: true };
}

/** One-time localStorage migration index → backlog. */
export function runIndexToBacklogMigration(): void {
  try {
    if (localStorage.getItem(MIGRATION_KEY) === "1") return;
  } catch {
    return;
  }

  let anyChange = false;

  const projects = loadProjectsFromStorage();
  if (projects.length > 0) {
    const { projects: migrated, changed } = migrateProjects(projects);
    if (changed) {
      saveProjectsToStorage(migrated);
      anyChange = true;
    }
  }

  const active = taskRepository.loadActiveTasks();
  const { tasks: nextActive, changed: tasksChanged } = migrateTaskList(active);
  if (tasksChanged) {
    taskRepository.saveActiveTasks(nextActive);
    anyChange = true;
  }

  const archives = taskRepository.loadArchives();
  const { archives: nextArchives, changed: archChanged } =
    migrateArchives(archives);
  if (archChanged) {
    taskRepository.saveArchives(nextArchives);
    anyChange = true;
  }

  if (anyChange || projects.length > 0) {
    try {
      localStorage.setItem(MIGRATION_KEY, "1");
    } catch {
      /* ignore */
    }
  }
}

/** Ensures backlog project exists and stays active (idempotent on each load). */
export function normalizeProjectsOnLoad(projects: Project[]): {
  projects: Project[];
  changed: boolean;
} {
  return migrateProjects(projects);
}

export function normalizeTasksOnLoad(tasks: Task[]): Task[] {
  return tasks.map((t) =>
    t.project === LEGACY_INDEX_PROJECT_ID
      ? { ...t, project: BACKLOG_PROJECT_ID }
      : t,
  );
}

export { normalizeProjectId };
