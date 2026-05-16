/** Kalendárny deň archivedAt v Europe/Bratislava ako YYYY-MM-DD (pre porovnanie s input type=date). */
export function isoToBratislavaDateKey(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Bratislava",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function todayBratislavaDateKey(): string {
  return isoToBratislavaDateKey(new Date().toISOString());
}

/** Posun kalendárneho dňa v zmysle Europe/Bratislava (kotva cez poludnie UTC). */
export function addCalendarDaysBratislava(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  if (!y || !m || !d) return dateKey;
  const ms = Date.UTC(y, m - 1, d, 12, 0, 0) + delta * 86400000;
  return isoToBratislavaDateKey(new Date(ms).toISOString());
}

export function firstDayOfMonthKeyFromToday(todayKey: string): string {
  const [y, m] = todayKey.split("-");
  if (!y || !m) return todayKey;
  return `${y}-${m}-01`;
}
