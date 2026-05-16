import {
  formatDuration,
  getDisplayTrackedSeconds,
} from "@/lib/formatters";
import { isoToBratislavaDateKey } from "@/lib/archiveDateFilter";
import { filterBoardTasks } from "@/lib/backlogProject";
import type { ArchivedTask, ArchivesByProject, Task } from "@/types/task";

export type KanbanContextView = "board" | "archive" | "report" | "task";

/** Report scope — echoed in JSON for weekly/monthly client summaries. */
export interface KanbanReportParams {
  periodFrom: string | null;
  periodTo: string | null;
  project: string;
  projectLabel: string;
  includeDone: boolean;
  includeArchive: boolean;
}

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
  view: "board" | "archive";
  filter: KanbanContextFilter;
  taskCount: number;
  tasks: KanbanContextTaskExport[];
}

export interface KanbanReportPayload {
  source: "kanban.aifreelancer.sk";
  exportedAt: string;
  view: "report";
  report: KanbanReportParams;
  taskCount: number;
  boardTasks: KanbanContextTaskExport[];
  archiveTasks: KanbanContextTaskExport[];
  /** board + archive merged (convenience for chat prompts). */
  tasks: KanbanContextTaskExport[];
}

export interface KanbanSingleTaskPayload {
  source: "kanban.aifreelancer.sk";
  exportedAt: string;
  view: "task";
  task: KanbanContextTaskExport;
}

export type KanbanExportPayload =
  | KanbanContextPayload
  | KanbanReportPayload
  | KanbanSingleTaskPayload;

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

function inPeriod(
  dayKey: string,
  periodFrom: string | null,
  periodTo: string | null,
): boolean {
  if (!dayKey) return false;
  if (periodFrom && dayKey < periodFrom) return false;
  if (periodTo && dayKey > periodTo) return false;
  return true;
}

function filterBoardForReport(
  tasks: Task[],
  report: KanbanReportParams,
): Task[] {
  let items = filterByProject(tasks, report.project);
  if (!report.includeDone) {
    items = items.filter((t) => t.status !== "Done");
  }
  if (report.periodFrom || report.periodTo) {
    items = items.filter((t) =>
      inPeriod(isoToBratislavaDateKey(t.updatedAt), report.periodFrom, report.periodTo),
    );
  }
  return items;
}

function filterArchiveForReport(
  archives: ArchivesByProject,
  report: KanbanReportParams,
): ArchivedTask[] {
  const flat = Object.values(archives).flat();
  return flat
    .filter((item) => {
      if (report.project !== "all" && item.project !== report.project) {
        return false;
      }
      return inPeriod(
        isoToBratislavaDateKey(item.archivedAt),
        report.periodFrom,
        report.periodTo,
      );
    })
    .sort((a, b) => b.archivedAt.localeCompare(a.archivedAt));
}

function buildPayload(
  view: "board" | "archive",
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
  const report: KanbanReportParams = {
    periodFrom: dateFrom || null,
    periodTo: dateTo || null,
    project: projectFilter,
    projectLabel,
    includeDone: true,
    includeArchive: true,
  };
  const filtered = filterArchiveForReport(archives, report);
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

export function buildReportKanbanContext(
  activeTasks: Task[],
  archives: ArchivesByProject,
  report: KanbanReportParams,
  getLabel: (projectId: string) => string,
): KanbanReportPayload {
  const boardExported = filterBoardForReport(
    filterBoardTasks(activeTasks),
    report,
  ).map((t) => mapTaskExport(t, getLabel));

  const archiveExported = report.includeArchive
    ? filterArchiveForReport(archives, report).map((t) =>
        mapTaskExport(t, getLabel, t.archivedAt),
      )
    : [];

  const tasks = [...boardExported, ...archiveExported];

  return {
    source: "kanban.aifreelancer.sk",
    exportedAt: new Date().toISOString(),
    view: "report",
    report,
    taskCount: tasks.length,
    boardTasks: boardExported,
    archiveTasks: archiveExported,
    tasks,
  };
}

export function buildSingleTaskKanbanContext(
  task: Task,
  getLabel: (projectId: string) => string,
): KanbanSingleTaskPayload {
  return {
    source: "kanban.aifreelancer.sk",
    exportedAt: new Date().toISOString(),
    view: "task",
    task: mapTaskExport(task, getLabel),
  };
}

export function serializeKanbanContext(payload: KanbanExportPayload): string {
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
