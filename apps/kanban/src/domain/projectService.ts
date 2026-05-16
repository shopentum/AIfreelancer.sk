import { DEFAULT_SEED_PROJECTS } from "@/config/defaultProjects";
import type { Project } from "@/types/project";
import type { ArchivesByProject } from "@/types/task";

export function getProjectLabel(projectId: string, projects: Project[]): string {
  return projects.find((p) => p.id === projectId)?.label ?? projectId;
}

export function seedProjects(now = new Date().toISOString()): Project[] {
  return DEFAULT_SEED_PROJECTS.map((s) => ({
    id: s.id,
    label: s.label,
    active: true,
    createdAt: now,
    archivedAt: null,
  }));
}

function slugifyId(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "project";
}

export function createProjectId(label: string, existing: Project[]): string {
  const base = slugifyId(label);
  if (!existing.some((p) => p.id === base)) return base;
  let n = 2;
  while (existing.some((p) => p.id === `${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function createProject(label: string, existing: Project[]): Project {
  const trimmed = label.trim();
  if (!trimmed) throw new Error("Project label is required");
  const now = new Date().toISOString();
  return {
    id: createProjectId(trimmed, existing),
    label: trimmed,
    active: true,
    createdAt: now,
    archivedAt: null,
  };
}

export function renameProject(project: Project, label: string): Project {
  const trimmed = label.trim();
  if (!trimmed || trimmed === project.label) return project;
  return { ...project, label: trimmed };
}

export function deactivateProject(project: Project, now = new Date().toISOString()): Project {
  if (!project.active) return project;
  return {
    ...project,
    active: false,
    archivedAt: now,
  };
}

export function reactivateProject(project: Project): Project {
  if (project.active) return project;
  return {
    ...project,
    active: true,
    archivedAt: null,
  };
}

export function purgeProjectFromArchives(
  archives: ArchivesByProject,
  projectId: string,
): ArchivesByProject {
  if (!(projectId in archives)) return archives;
  const next = { ...archives };
  delete next[projectId];
  return next;
}
