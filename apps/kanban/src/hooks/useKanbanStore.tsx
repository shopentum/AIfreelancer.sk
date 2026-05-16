import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_PROJECT_ID } from "@/config/defaultProjects";
import { useProjects } from "@/hooks/useProjects";
import { flushDoneToArchive } from "@/domain/archiveFlush";
import {
  applyTaskStatusUpdate,
  createTask,
  deleteTaskFromList,
  timerPause,
  timerStart,
  timerStop,
  updateTaskNotes,
  updateTaskProject,
  updateTaskSummary,
  updateTaskTitle,
} from "@/domain/taskService";
import { taskRepository } from "@/repositories";
import type { Task, TaskStatus } from "@/types/task";

export type ProjectFilter = "all" | string;

interface KanbanContextValue {
  tasks: Task[];
  projectFilter: ProjectFilter;
  setProjectFilter: (filter: ProjectFilter) => void;
  visibleTasks: Task[];
  addTask: (title: string, project?: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  detailTaskId: string | null;
  openTaskDetail: (taskId: string) => void;
  closeTaskDetail: () => void;
  setTaskTitle: (taskId: string, title: string) => void;
  setTaskSummary: (taskId: string, summary: string) => void;
  setTaskProject: (taskId: string, projectId: string) => void;
  setTaskNotes: (taskId: string, notes: string) => void;
  startTimer: (taskId: string) => void;
  pauseTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
}

const KanbanContext = createContext<KanbanContextValue | null>(null);

function mapTask(
  tasks: Task[],
  taskId: string,
  fn: (t: Task) => Task,
): Task[] {
  return tasks.map((t) => (t.id === taskId ? fn(t) : t));
}

export function KanbanProvider({ children }: { children: ReactNode }) {
  const { getLabel } = useProjects();

  const [tasks, setTasks] = useState<Task[]>(() => {
    const rawActive = taskRepository.loadActiveTasks();
    const archives = taskRepository.loadArchives();
    const { active, archives: nextArchives } = flushDoneToArchive(
      rawActive,
      archives,
    );
    if (active.length !== rawActive.length) {
      taskRepository.saveActiveTasks(active);
      taskRepository.saveArchives(nextArchives);
    }
    return active;
  });
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [, setTimerTick] = useState(0);

  const hasRunningTimer = useMemo(
    () => tasks.some((t) => t.isTimerRunning),
    [tasks],
  );

  useEffect(() => {
    if (!hasRunningTimer) return;
    const id = window.setInterval(() => {
      setTimerTick((n) => n + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [hasRunningTimer]);

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
    },
    [],
  );

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) => applyTaskStatusUpdate(prev, taskId, status));
  }, []);

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => deleteTaskFromList(prev, taskId));
      setDetailTaskId((id) => (id === taskId ? null : id));
    },
    [],
  );

  const openTaskDetail = useCallback((taskId: string) => {
    setDetailTaskId(taskId);
  }, []);

  const closeTaskDetail = useCallback(() => {
    setDetailTaskId(null);
  }, []);

  const setTaskTitle = useCallback((taskId: string, title: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => updateTaskTitle(t, title)));
  }, []);

  const setTaskSummary = useCallback((taskId: string, summary: string) => {
    setTasks((prev) =>
      mapTask(prev, taskId, (t) => updateTaskSummary(t, summary)),
    );
  }, []);

  const setTaskProject = useCallback(
    (taskId: string, projectId: string) => {
      setTasks((prev) =>
        mapTask(prev, taskId, (t) =>
          updateTaskProject(t, projectId, getLabel(t.project), getLabel(projectId)),
        ),
      );
    },
    [getLabel],
  );

  const setTaskNotes = useCallback((taskId: string, notes: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => updateTaskNotes(t, notes)));
  }, []);

  const startTimer = useCallback((taskId: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => timerStart(t)));
  }, []);

  const pauseTimer = useCallback((taskId: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => timerPause(t)));
  }, []);

  const stopTimer = useCallback((taskId: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => timerStop(t)));
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      projectFilter,
      setProjectFilter,
      visibleTasks,
      addTask,
      updateTaskStatus,
      deleteTask,
      detailTaskId,
      openTaskDetail,
      closeTaskDetail,
      setTaskTitle,
      setTaskSummary,
      setTaskProject,
      setTaskNotes,
      startTimer,
      pauseTimer,
      stopTimer,
    }),
    [
      tasks,
      projectFilter,
      visibleTasks,
      addTask,
      updateTaskStatus,
      deleteTask,
      detailTaskId,
      openTaskDetail,
      closeTaskDetail,
      setTaskTitle,
      setTaskSummary,
      setTaskProject,
      setTaskNotes,
      startTimer,
      pauseTimer,
      stopTimer,
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
