import { isBacklogTask } from "@/lib/backlogProject";
import { isoToBratislavaDateKey } from "@/lib/archiveDateFilter";
import type { ArchivesByProject, Task, TaskStatus } from "@/types/task";

/** Status buckets shown on overview charts (pipeline + optional Ready). */
export const OVERVIEW_CHART_STATUSES: TaskStatus[] = [
  "InProgress",
  "ReadyToReview",
  "Done",
  "Ready",
];

export const OVERVIEW_STATUS_LABELS: Record<TaskStatus, string> = {
  Ready: "Ready",
  InProgress: "In Progress",
  ReadyToReview: "Review",
  Done: "Done",
};

export interface OverviewFilterInput {
  dateFrom: string;
  dateTo: string;
  projectId: string | "all";
  includeActive: boolean;
  includeArchive: boolean;
}

export interface StatusTimeSlice {
  status: TaskStatus;
  seconds: number;
  taskCount: number;
}

export interface ProjectOverviewRow {
  projectId: string;
  totalSeconds: number;
  taskCountWithTime: number;
  taskCountAll: number;
  byStatus: StatusTimeSlice[];
}

export interface OverviewTotals {
  totalSeconds: number;
  taskCountWithTime: number;
  taskCountAll: number;
  inProgressSeconds: number;
  reviewSeconds: number;
  doneSeconds: number;
  readySeconds: number;
  wipCount: number;
  doneCount: number;
}

function inDateRange(dayKey: string, from: string, to: string): boolean {
  if (!dayKey) return false;
  if (from && dayKey < from) return false;
  if (to && dayKey > to) return false;
  return true;
}

function passesDateFilter(
  task: Task & { archivedAt?: string },
  filters: OverviewFilterInput,
  source: "active" | "archive",
): boolean {
  if (!filters.dateFrom && !filters.dateTo) return true;
  const dayKey =
    source === "archive" && task.archivedAt
      ? isoToBratislavaDateKey(task.archivedAt)
      : isoToBratislavaDateKey(task.updatedAt);
  return inDateRange(dayKey, filters.dateFrom, filters.dateTo);
}

export function collectOverviewTasks(
  activeTasks: Task[],
  archives: ArchivesByProject,
  filters: OverviewFilterInput,
): Task[] {
  const out: Task[] = [];

  if (filters.includeActive) {
    for (const task of activeTasks) {
      if (isBacklogTask(task)) continue;
      if (filters.projectId !== "all" && task.project !== filters.projectId) {
        continue;
      }
      if (!passesDateFilter(task, filters, "active")) continue;
      out.push(task);
    }
  }

  if (filters.includeArchive) {
    for (const items of Object.values(archives)) {
      for (const task of items) {
        if (isBacklogTask(task)) continue;
        if (filters.projectId !== "all" && task.project !== filters.projectId) {
          continue;
        }
        if (!passesDateFilter(task, filters, "archive")) continue;
        out.push(task);
      }
    }
  }

  return out;
}

function emptySlices(): StatusTimeSlice[] {
  return OVERVIEW_CHART_STATUSES.map((status) => ({
    status,
    seconds: 0,
    taskCount: 0,
  }));
}

function buildSlicesForTasks(tasks: Task[]): StatusTimeSlice[] {
  const map = new Map<TaskStatus, { seconds: number; taskCount: number }>();
  for (const status of OVERVIEW_CHART_STATUSES) {
    map.set(status, { seconds: 0, taskCount: 0 });
  }

  for (const task of tasks) {
    const seconds = Math.max(0, task.totalTrackedSeconds);
    if (seconds <= 0) continue;
    const bucket = map.get(task.status);
    if (!bucket) continue;
    bucket.seconds += seconds;
    bucket.taskCount += 1;
  }

  return OVERVIEW_CHART_STATUSES.map((status) => {
    const bucket = map.get(status)!;
    return { status, ...bucket };
  }).filter((s) => s.seconds > 0 || s.taskCount > 0);
}

export function aggregateOverview(
  tasks: Task[],
  orderedProjectIds: string[],
): { totals: OverviewTotals; projects: ProjectOverviewRow[] } {
  const tasksWithTime = tasks.filter((t) => t.totalTrackedSeconds > 0);

  const totals: OverviewTotals = {
    totalSeconds: 0,
    taskCountWithTime: tasksWithTime.length,
    taskCountAll: tasks.length,
    inProgressSeconds: 0,
    reviewSeconds: 0,
    doneSeconds: 0,
    readySeconds: 0,
    wipCount: 0,
    doneCount: 0,
  };

  for (const task of tasksWithTime) {
    const s = task.totalTrackedSeconds;
    totals.totalSeconds += s;
    switch (task.status) {
      case "InProgress":
        totals.inProgressSeconds += s;
        totals.wipCount += 1;
        break;
      case "ReadyToReview":
        totals.reviewSeconds += s;
        totals.wipCount += 1;
        break;
      case "Done":
        totals.doneSeconds += s;
        totals.doneCount += 1;
        break;
      case "Ready":
        totals.readySeconds += s;
        break;
      default:
        break;
    }
  }

  const projectIdsInData = new Set(tasks.map((t) => t.project));
  const seen = new Set<string>();
  const projects: ProjectOverviewRow[] = [];

  for (const projectId of orderedProjectIds) {
    if (!projectIdsInData.has(projectId)) continue;
    seen.add(projectId);
    const projectTasks = tasks.filter((t) => t.project === projectId);
    const withTime = projectTasks.filter((t) => t.totalTrackedSeconds > 0);
    const byStatus = buildSlicesForTasks(projectTasks);
    projects.push({
      projectId,
      totalSeconds: withTime.reduce((a, t) => a + t.totalTrackedSeconds, 0),
      taskCountWithTime: withTime.length,
      taskCountAll: projectTasks.length,
      byStatus: byStatus.length > 0 ? byStatus : emptySlices(),
    });
  }

  for (const projectId of projectIdsInData) {
    if (seen.has(projectId) || isBacklogTask({ project: projectId })) continue;
    const projectTasks = tasks.filter((t) => t.project === projectId);
    const withTime = projectTasks.filter((t) => t.totalTrackedSeconds > 0);
    const byStatus = buildSlicesForTasks(projectTasks);
    projects.push({
      projectId,
      totalSeconds: withTime.reduce((a, t) => a + t.totalTrackedSeconds, 0),
      taskCountWithTime: withTime.length,
      taskCountAll: projectTasks.length,
      byStatus: byStatus.length > 0 ? byStatus : emptySlices(),
    });
  }

  projects.sort((a, b) => b.totalSeconds - a.totalSeconds);

  return { totals, projects };
}

export function slicePercent(seconds: number, total: number): number {
  if (total <= 0 || seconds <= 0) return 0;
  return (seconds / total) * 100;
}

/** CSS conic-gradient stops for a donut (only slices with seconds > 0). */
export function buildConicGradient(
  slices: StatusTimeSlice[],
  colors: Record<TaskStatus, string>,
): string | null {
  const active = slices.filter((s) => s.seconds > 0);
  const total = active.reduce((a, s) => a + s.seconds, 0);
  if (total <= 0) return null;

  let cursor = 0;
  const parts: string[] = [];
  for (const slice of active) {
    const pct = (slice.seconds / total) * 100;
    const next = cursor + pct;
    parts.push(`${colors[slice.status]} ${cursor}% ${next}%`);
    cursor = next;
  }
  return `conic-gradient(${parts.join(", ")})`;
}
