import {
  APP_STATE_VERSION,
  createDefaultAppState,
} from "@/cashflow/state/defaultState";
import type { AppState } from "@/cashflow/types/finance";

const STORAGE_KEY = "omega-cashflow-v1";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parseState(raw: string): AppState | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!isRecord(data)) return null;
    if (data.version !== APP_STATE_VERSION) return null;
    return data as unknown as AppState;
  } catch {
    return null;
  }
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    return createDefaultAppState();
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultAppState();
  return parseState(raw) ?? createDefaultAppState();
}

export function saveAppState(state: AppState): void {
  if (typeof window === "undefined") return;
  const next: AppState = {...state, version: APP_STATE_VERSION};
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function exportAppStateJson(state: AppState): string {
  return JSON.stringify({...state, version: APP_STATE_VERSION}, null, 2);
}

export function importAppStateJson(raw: string): AppState | null {
  return parseState(raw);
}
