import {
  formatDuration,
  getDisplayTrackedSeconds,
} from "@/lib/formatters";
import { isoToBratislavaDateKey } from "@/lib/archiveDateFilter";
import type { ArchivedTask, ArchivesByProject, Task } from "@/types/task";

export type KanbanContextView = "board" | "archive";

export interface KanbanContextFilter {
  project: string;
  projectLabel: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface KanbanContextTaskExport {
  id: string;
  title: string;
  summary: string;
  project: string;
  projectLabel: string;
  status: string;
  plannedDate: string | null;
  trackedSeconds: number;
  trackedTime: string;
  timerRunning: boolean;
  notes: string;
  aiSummary: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

export interface KanbanContextPayload {
  source: "kanban.aifreelancer.sk";
  exportedAt: string;
  view: KanbanContextView;
  filter: KanbanContextFilter;
  taskCount: number;
  tasks: KanbanContextTaskExport[];
}

function mapTaskExport(
  task: Task,
  getLabel: (projectId: string) => string,
  archivedAt?: string,
): KanbanContextTaskExport {
  const trackedSeconds = getDisplayTrackedSeconds(task);
  return {
    id: task.id,
    title: task.title.trim() || "Bez názvu",
    summary: task.summary.trim(),
    project: task.project,
    projectLabel: getLabel(task.project),
    status: task.status,
    plannedDate: task.plannedDate,
    trackedSeconds,
    trackedTime: formatDuration(trackedSeconds),
    timerRunning: task.isTimerRunning,
    notes: task.notes.trim(),
    aiSummary: task.aiSummary.trim(),
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    ...(archivedAt ? { archivedAt } : {}),
  };
}

function filterByProject<T extends { project: string }>(
  items: T[],
  projectFilter: string,
): T[] {
  if (projectFilter === "all") return items;
  return items.filter((t) => t.project === projectFilter);
}

function filterArchived(
  items: ArchivedTask[],
  projectFilter: string,
  dateFrom: string,
  dateTo: string,
): ArchivedTask[] {
  return items.filter((item) => {
    if (projectFilter !== "all" && item.project !== projectFilter) {
      return false;
    }
    const dayKey = isoToBratislavaDateKey(item.archivedAt);
    if (dateFrom && dayKey < dateFrom) return false;
    if (dateTo && dayKey > dateTo) return false;
    return true;
  });
}

function buildPayload(
  view: KanbanContextView,
  filter: KanbanContextFilter,
  tasks: KanbanContextTaskExport[],
): KanbanContextPayload {
  return {
    source: "kanban.aifreelancer.sk",
    exportedAt: new Date().toISOString(),
    view,
    filter,
    taskCount: tasks.length,
    tasks,
  };
}

export function buildBoardKanbanContext(
  tasks: Task[],
  projectFilter: string,
  getLabel: (projectId: string) => string,
): KanbanContextPayload {
  const projectLabel =
    projectFilter === "all" ? "Všetky projekty" : getLabel(projectFilter);
  const filtered = filterByProject(tasks, projectFilter);
  const exported = filtered.map((t) => mapTaskExport(t, getLabel));
  return buildPayload("board", { project: projectFilter, projectLabel }, exported);
}

export function buildArchiveKanbanContext(
  archives: ArchivesByProject,
  projectFilter: string,
  getLabel: (projectId: string) => string,
  dateFrom: string,
  dateTo: string,
): KanbanContextPayload {
  const projectLabel =
    projectFilter === "all" ? "Všetky projekty" : getLabel(projectFilter);
  const flat = Object.values(archives).flat();
  const filtered = filterArchived(flat, projectFilter, dateFrom, dateTo).sort(
    (a, b) => b.archivedAt.localeCompare(a.archivedAt),
  );
  const exported = filtered.map((t) =>
    mapTaskExport(t, getLabel, t.archivedAt),
  );
  const filter: KanbanContextFilter = {
    project: projectFilter,
    projectLabel,
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
  };
  return buildPayload("archive", filter, exported);
}

export function serializeKanbanContext(payload: KanbanContextPayload): string {
  return JSON.stringify(payload, null, 2);
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}
