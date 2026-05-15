export interface ProjectDefinition {
  id: string;
  label: string;
}

export const PROJECTS: ProjectDefinition[] = [
  { id: "index", label: "Index" },
  { id: "shopentum", label: "Shopentum" },
  { id: "nmh", label: "NMH" },
  { id: "aiworks", label: "AIWORKS" },
  { id: "finance", label: "Finance" },
  { id: "personal", label: "Personal" },
];

export const DEFAULT_PROJECT_ID = "index";

export function getProjectLabel(projectId: string): string {
  return PROJECTS.find((p) => p.id === projectId)?.label ?? projectId;
}
