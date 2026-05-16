import { LocalStorageTaskRepository } from "@/repositories/localStorageTaskRepository";
import { SupabaseTaskRepository } from "@/repositories/supabaseTaskRepository";
import type { TaskRepository } from "@/repositories/TaskRepository";

export type TaskStorageMode = "local" | "supabase";

export function getTaskStorageMode(): TaskStorageMode {
  const raw = import.meta.env.VITE_TASK_STORAGE;
  return raw === "supabase" ? "supabase" : "local";
}

export function createTaskRepository(): TaskRepository {
  if (getTaskStorageMode() === "supabase") {
    return new SupabaseTaskRepository();
  }
  return new LocalStorageTaskRepository();
}

export const taskRepository = createTaskRepository();
