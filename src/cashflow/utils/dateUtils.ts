export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseISODate(s: string): Date {
  const [y, m, day] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, day));
}

export function addDays(isoDate: string, days: number): string {
  const d = parseISODate(isoDate);
  d.setUTCDate(d.getUTCDate() + days);
  return toISODate(d);
}

export function startOfMonth(isoDate: string): string {
  const d = parseISODate(isoDate);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export function compareISODate(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
