const SK_LOCALE = "sk-SK";
const TZ = "Europe/Bratislava";

/** SK absolute datetime: 15.5.2026 22:20 */
export function formatSkDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const parts = new Intl.DateTimeFormat(SK_LOCALE, {
    timeZone: TZ,
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const day = get("day");
  const month = get("month");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");

  return `${day}.${month}.${year} ${hour}:${minute}`;
}

/** Human duration: 1h 23m, 45m, 0m */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  if (s === 0) return "0m";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function getDisplayTrackedSeconds(
  task: {
    totalTrackedSeconds: number;
    isTimerRunning: boolean;
    timerStartedAt: string | null;
  },
  nowMs = Date.now(),
): number {
  if (!task.isTimerRunning || !task.timerStartedAt) {
    return task.totalTrackedSeconds;
  }
  const started = new Date(task.timerStartedAt).getTime();
  if (Number.isNaN(started)) return task.totalTrackedSeconds;
  const elapsed = Math.max(0, Math.floor((nowMs - started) / 1000));
  return task.totalTrackedSeconds + elapsed;
}
