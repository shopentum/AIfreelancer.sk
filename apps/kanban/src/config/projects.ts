export interface ProjectDefinition {
  id: string;
  label: string;
}

export const PROJECTS: ProjectDefinition[] = [
  { id: "index", label: "Index" },
  { id: "shopentum", label: "Shopentum" },
  { id: "nmh", label: "NMH" },
  { id: "aiworks", label: "IZY VAPE" },
  { id: "finance", label: "PRUSA FINANCE" },
  { id: "personal", label: "Personal" },
];

export const DEFAULT_PROJECT_ID = "index";

export function getProjectLabel(projectId: string): string {
  return PROJECTS.find((p) => p.id === projectId)?.label ?? projectId;
}
