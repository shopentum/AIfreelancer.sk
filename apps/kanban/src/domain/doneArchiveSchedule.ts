import { flushDoneToArchive } from "@/domain/archiveFlush";
import { todayBratislavaDateKey } from "@/lib/archiveDateFilter";
import type { ArchivesByProject, Task } from "@/types/task";

const LAST_FLUSH_KEY = "kanban_last_done_flush_day_v1";
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

function getLastDoneFlushDay(): string | null {
  try {
    const raw = localStorage.getItem(LAST_FLUSH_KEY);
    if (!raw || !DATE_KEY_RE.test(raw)) return null;
    return raw;
  } catch {
    return null;
  }
}

function setLastDoneFlushDay(dayKey: string): void {
  localStorage.setItem(LAST_FLUSH_KEY, dayKey);
}

/**
 * Done stays on the board for the rest of the calendar day (Europe/Bratislava).
 * Moves to archive on the first app load after midnight (new day vs last flush day).
 */
export function bootstrapActiveTasksWithDoneFlush(
  activeTasks: Task[],
  archives: ArchivesByProject,
): { active: Task[]; archives: ArchivesByProject; didFlush: boolean } {
  const today = todayBratislavaDateKey();
  const lastFlushDay = getLastDoneFlushDay();

  if (lastFlushDay === null) {
    setLastDoneFlushDay(today);
    return { active: activeTasks, archives, didFlush: false };
  }

  if (lastFlushDay < today) {
    const result = flushDoneToArchive(activeTasks, archives);
    setLastDoneFlushDay(today);
    const didFlush = result.active.length !== activeTasks.length;
    return { ...result, didFlush };
  }

  return { active: activeTasks, archives, didFlush: false };
}
