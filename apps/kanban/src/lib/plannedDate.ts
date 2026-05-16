import type { Task } from "@/types/task";

const TZ = "Europe/Bratislava";
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export type PlannedDateBadgeVariant =
  | "today"
  | "tomorrow"
  | "overdue"
  | "future";

/** Calendar date in Europe/Bratislava as YYYY-MM-DD. */
export function toDateKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getTodayKey(): string {
  return toDateKey(new Date());
}

export function getTomorrowKey(): string {
  return addDaysToDateKey(getTodayKey(), 1);
}

export function addDaysToDateKey(key: string, days: number): string {
  const [y, mo, d] = key.split("-").map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d + days));
  const y2 = dt.getUTCFullYear();
  const m2 = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d2 = String(dt.getUTCDate()).padStart(2, "0");
  return `${y2}-${m2}-${d2}`;
}

export function isValidDateKey(value: string): boolean {
  if (!DATE_KEY_RE.test(value)) return false;
  const [y, mo, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, mo - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === mo - 1 &&
    dt.getUTCDate() === d
  );
}

/** Short label for cards: 15. 5. */
export function formatPlannedDateShort(dateKey: string): string {
  const [, mo, d] = dateKey.split("-").map(Number);
  return `${d}. ${mo}.`;
}

export function getPlannedDateBadge(plannedDate: string): {
  label: string;
  variant: PlannedDateBadgeVariant;
} {
  const today = getTodayKey();
  const tomorrow = getTomorrowKey();
  if (plannedDate === today) return { label: "Dnes", variant: "today" };
  if (plannedDate === tomorrow) return { label: "Zajtra", variant: "tomorrow" };
  if (plannedDate < today) {
    return {
      label: formatPlannedDateShort(plannedDate),
      variant: "overdue",
    };
  }
  return {
    label: formatPlannedDateShort(plannedDate),
    variant: "future",
  };
}

export function sortTasksForColumn(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aDate = a.plannedDate;
    const bDate = b.plannedDate;
    if (aDate && bDate) {
      const cmp = aDate.localeCompare(bDate);
      if (cmp !== 0) return cmp;
      return b.createdAt.localeCompare(a.createdAt);
    }
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function getPlannedBadgeClass(
  variant: PlannedDateBadgeVariant,
  isDark: boolean,
): string {
  switch (variant) {
    case "today":
      return isDark
        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "tomorrow":
      return isDark
        ? "border-sky-500/40 bg-sky-500/15 text-sky-400"
        : "border-sky-200 bg-sky-50 text-sky-700";
    case "overdue":
      return isDark
        ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
        : "border-amber-200 bg-amber-50 text-amber-800";
    default:
      return isDark
        ? "border-slate-600 bg-slate-800 text-slate-400"
        : "border-slate-200 bg-slate-50 text-slate-600";
  }
}
