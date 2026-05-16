import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BACKLOG_PROJECT_ID } from "@/config/defaultProjects";
import {
  createProject,
  deactivateProject,
  getProjectLabel,
  purgeProjectFromArchives,
  reactivateProject,
  renameProject,
  seedProjects,
} from "@/domain/projectService";
import { runIndexToBacklogMigration } from "@/domain/migrateIndexToBacklog";
import {
  loadProjectsFromStorage,
  saveProjectsToStorage,
} from "@/repositories/localStorageProjectRepository";
import { taskRepository } from "@/repositories";
import type { Project } from "@/types/project";

interface ProjectsContextValue {
  projects: Project[];
  activeProjects: Project[];
  /** Active projects on the kanban board (excludes backlog inbox). */
  boardProjects: Project[];
  /** All projects for archive filter (active + inactive). */
  filterProjects: Project[];
  getLabel: (projectId: string) => string;
  /** Active only — brain dump & new assignments. */
  selectableProjects: Project[];
  /** Active + current task project if inactive. */
  projectsForTask: (currentProjectId: string) => Project[];
  addProject: (label: string) => void;
  renameProjectById: (projectId: string, label: string) => void;
  deactivateProjectById: (projectId: string) => void;
  reactivateProjectById: (projectId: string) => void;
  getProjectArchiveCount: (projectId: string) => number;
  purgeProjectArchive: (projectId: string) => number;
  settingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function sortProjects(a: Project, b: Project): number {
  if (a.active !== b.active) return a.active ? -1 : 1;
  return a.label.localeCompare(b.label, "sk");
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    runIndexToBacklogMigration();
    const stored = loadProjectsFromStorage();
    if (stored.length > 0) return stored;
    const seeded = seedProjects();
    saveProjectsToStorage(seeded);
    return seeded;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    saveProjectsToStorage(projects);
  }, [projects]);

  const activeProjects = useMemo(
    () => projects.filter((p) => p.active).sort(sortProjects),
    [projects],
  );

  const boardProjects = useMemo(
    () =>
      projects
        .filter((p) => p.active && p.id !== BACKLOG_PROJECT_ID)
        .sort(sortProjects),
    [projects],
  );

  const filterProjects = useMemo(
    () =>
      [...projects]
        .filter((p) => p.id !== BACKLOG_PROJECT_ID)
        .sort(sortProjects),
    [projects],
  );

  const getLabel = useCallback(
    (projectId: string) => getProjectLabel(projectId, projects),
    [projects],
  );

  const selectableProjects = boardProjects;

  const projectsForTask = useCallback(
    (currentProjectId: string) => {
      const current = projects.find((p) => p.id === currentProjectId);
      if (!current || current.active) return activeProjects;
      return [...activeProjects, current].sort(sortProjects);
    },
    [projects, activeProjects],
  );

  const addProject = useCallback((label: string) => {
    try {
      setProjects((prev) => {
        const created = createProject(label, prev);
        return [...prev, created].sort(sortProjects);
      });
    } catch {
      /* empty label */
    }
  }, []);

  const renameProjectById = useCallback((projectId: string, label: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? renameProject(p, label) : p)),
    );
  }, []);

  const deactivateProjectById = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? deactivateProject(p) : p)),
    );
  }, []);

  const reactivateProjectById = useCallback((projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? reactivateProject(p) : p)),
    );
  }, []);

  const getProjectArchiveCount = useCallback((projectId: string) => {
    const archives = taskRepository.loadArchives();
    return (archives[projectId] ?? []).length;
  }, []);

  const purgeProjectArchive = useCallback((projectId: string) => {
    const archives = taskRepository.loadArchives();
    const count = (archives[projectId] ?? []).length;
    if (count === 0) return 0;
    taskRepository.saveArchives(purgeProjectFromArchives(archives, projectId));
    return count;
  }, []);

  const value = useMemo(
    () => ({
      projects,
      activeProjects,
      boardProjects,
      filterProjects,
      getLabel,
      selectableProjects,
      projectsForTask,
      addProject,
      renameProjectById,
      deactivateProjectById,
      reactivateProjectById,
      getProjectArchiveCount,
      purgeProjectArchive,
      settingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
    }),
    [
      projects,
      activeProjects,
      boardProjects,
      filterProjects,
      getLabel,
      selectableProjects,
      projectsForTask,
      addProject,
      renameProjectById,
      deactivateProjectById,
      reactivateProjectById,
      getProjectArchiveCount,
      purgeProjectArchive,
      settingsOpen,
    ],
  );

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
