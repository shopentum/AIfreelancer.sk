import type { ActivityEntry, ActivityType } from "@/types/task";
import { newId } from "@/lib/id";

const MAX_LOG_ENTRIES = 200;

export function appendActivity(
  log: ActivityEntry[],
  type: ActivityType,
  payload?: Record<string, string>,
): ActivityEntry[] {
  const entry: ActivityEntry = {
    id: newId("act"),
    type,
    at: new Date().toISOString(),
    payload,
  };
  const next = [...log, entry];
  if (next.length <= MAX_LOG_ENTRIES) return next;
  return next.slice(next.length - MAX_LOG_ENTRIES);
}
