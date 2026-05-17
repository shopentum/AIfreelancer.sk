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
import {
  archiveTaskToArchives,
  notifyArchivesChanged,
} from "@/domain/archiveService";
import { runIndexToBacklogMigration, normalizeTasksOnLoad } from "@/domain/migrateIndexToBacklog";
import {
  addTaskTrackedMinutes,
  applyTaskStatusUpdate,
  createTask,
  deleteTaskFromList,
  promoteBacklogTask,
  timerPause,
  timerStart,
  timerStop,
  updateTaskNotes,
  updateTaskAiSummary,
  updateTaskPlannedDate,
  updateTaskProject,
  updateTaskSummary,
  updateTaskTitle,
} from "@/domain/taskService";
import { filterBacklogTasks, filterBoardTasks } from "@/lib/backlogProject";
import { taskRepository } from "@/repositories";
import type { Task, TaskStatus } from "@/types/task";

export type ProjectFilter = "all" | string;

interface KanbanContextValue {
  tasks: Task[];
  projectFilter: ProjectFilter;
  setProjectFilter: (filter: ProjectFilter) => void;
  visibleTasks: Task[];
  backlogTasks: Task[];
  addTask: (title: string, project?: string) => void;
  promoteToReady: (taskId: string, targetProjectId: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  archiveTask: (taskId: string) => void;
  detailTaskId: string | null;
  openTaskDetail: (taskId: string) => void;
  closeTaskDetail: () => void;
  setTaskTitle: (taskId: string, title: string) => void;
  setTaskSummary: (taskId: string, summary: string) => void;
  setTaskProject: (taskId: string, projectId: string) => void;
  setTaskNotes: (taskId: string, notes: string) => void;
  setTaskAiSummary: (taskId: string, aiSummary: string) => void;
  setTaskPlannedDate: (taskId: string, plannedDate: string | null) => void;
  startTimer: (taskId: string) => void;
  pauseTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  addTaskTrackedMinutes: (taskId: string, minutes: number) => void;
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
    runIndexToBacklogMigration();
    return normalizeTasksOnLoad(taskRepository.loadActiveTasks());
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
    const board = filterBoardTasks(tasks);
    if (projectFilter === "all") return board;
    return board.filter((t) => t.project === projectFilter);
  }, [tasks, projectFilter]);

  const backlogTasks = useMemo(
    () =>
      filterBacklogTasks(tasks).sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt),
      ),
    [tasks],
  );

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

  const archiveTask = useCallback((taskId: string) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task || task.status !== "Done") return prev;
      const archives = taskRepository.loadArchives();
      const nextArchives = archiveTaskToArchives(task, archives);
      taskRepository.saveArchives(nextArchives);
      notifyArchivesChanged();
      return deleteTaskFromList(prev, taskId);
    });
    setDetailTaskId((id) => (id === taskId ? null : id));
  }, []);

  const promoteToReady = useCallback(
    (taskId: string, targetProjectId: string) => {
      setTasks((prev) =>
        mapTask(prev, taskId, (t) =>
          promoteBacklogTask(
            t,
            targetProjectId,
            getLabel(t.project),
            getLabel(targetProjectId),
          ),
        ),
      );
    },
    [getLabel],
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

  const setTaskAiSummary = useCallback((taskId: string, aiSummary: string) => {
    setTasks((prev) =>
      mapTask(prev, taskId, (t) => updateTaskAiSummary(t, aiSummary)),
    );
  }, []);

  const setTaskPlannedDate = useCallback(
    (taskId: string, plannedDate: string | null) => {
      setTasks((prev) =>
        mapTask(prev, taskId, (t) => updateTaskPlannedDate(t, plannedDate)),
      );
    },
    [],
  );

  const startTimer = useCallback((taskId: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => timerStart(t)));
  }, []);

  const pauseTimer = useCallback((taskId: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => timerPause(t)));
  }, []);

  const stopTimer = useCallback((taskId: string) => {
    setTasks((prev) => mapTask(prev, taskId, (t) => timerStop(t)));
  }, []);

  const addTaskTrackedMinutesHandler = useCallback(
    (taskId: string, minutes: number) => {
      setTasks((prev) =>
        mapTask(prev, taskId, (t) => addTaskTrackedMinutes(t, minutes)),
      );
    },
    [],
  );

  const value = useMemo(
    () => ({
      tasks,
      projectFilter,
      setProjectFilter,
      visibleTasks,
      backlogTasks,
      addTask,
      promoteToReady,
      updateTaskStatus,
      deleteTask,
      archiveTask,
      detailTaskId,
      openTaskDetail,
      closeTaskDetail,
      setTaskTitle,
      setTaskSummary,
      setTaskProject,
      setTaskNotes,
      setTaskAiSummary,
      setTaskPlannedDate,
      startTimer,
      pauseTimer,
      stopTimer,
      addTaskTrackedMinutes: addTaskTrackedMinutesHandler,
    }),
    [
      tasks,
      projectFilter,
      visibleTasks,
      backlogTasks,
      addTask,
      promoteToReady,
      updateTaskStatus,
      deleteTask,
      archiveTask,
      detailTaskId,
      openTaskDetail,
      closeTaskDetail,
      setTaskTitle,
      setTaskSummary,
      setTaskProject,
      setTaskNotes,
      setTaskAiSummary,
      setTaskPlannedDate,
      startTimer,
      pauseTimer,
      stopTimer,
      addTaskTrackedMinutesHandler,
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
