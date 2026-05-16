import type { Project } from "@/types/project";

export const PROJECTS_STORAGE_KEY = "kanban_projects_v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function normalizeProject(raw: Record<string, unknown>): Project | null {
  if (typeof raw.id !== "string" || typeof raw.label !== "string") return null;
  return {
    id: raw.id,
    label: raw.label,
    active: raw.active !== false,
    createdAt:
      typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString(),
    archivedAt:
      typeof raw.archivedAt === "string"
        ? raw.archivedAt
        : raw.archivedAt === null
          ? null
          : undefined,
  };
}

export function loadProjectsFromStorage(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p): p is Record<string, unknown> => isRecord(p))
      .map(normalizeProject)
      .filter((p): p is Project => p !== null);
  } catch {
    return [];
  }
}

export function saveProjectsToStorage(projects: Project[]): void {
  localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
}
