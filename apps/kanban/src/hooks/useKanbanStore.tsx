import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_PROJECT_ID } from "@/config/projects";
import {
  applyTaskStatusUpdate,
  createTask,
} from "@/domain/taskService";
import { taskRepository } from "@/repositories/localStorageTaskRepository";
import type { Task, TaskStatus } from "@/types/task";

export type ProjectFilter = "all" | string;

interface KanbanContextValue {
  tasks: Task[];
  projectFilter: ProjectFilter;
  setProjectFilter: (filter: ProjectFilter) => void;
  visibleTasks: Task[];
  addTask: (title: string, project?: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  draggingTaskId: string | null;
  setDraggingTaskId: (id: string | null) => void;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

export function KanbanProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() =>
    taskRepository.loadActiveTasks(),
  );
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  useEffect(() => {
    taskRepository.saveActiveTasks(tasks);
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    if (projectFilter === "all") return tasks;
    return tasks.filter((t) => t.project === projectFilter);
  }, [tasks, projectFilter]);

  const addTask = useCallback((title: string, project = DEFAULT_PROJECT_ID) => {
    try {
      const task = createTask(title, project);
      setTasks((prev) => [task, ...prev]);
    } catch {
      /* empty title */
    }
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) => applyTaskStatusUpdate(prev, taskId, status));
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      projectFilter,
      setProjectFilter,
      visibleTasks,
      addTask,
      updateTaskStatus,
      draggingTaskId,
      setDraggingTaskId,
    }),
    [
      tasks,
      projectFilter,
      visibleTasks,
      addTask,
      updateTaskStatus,
      draggingTaskId,
    ],
  );

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
}

export function useKanban(): KanbanContextValue {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error("useKanban must be used within KanbanProvider");
  return ctx;
}
