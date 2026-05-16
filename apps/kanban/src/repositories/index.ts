export type { TaskRepository } from "@/repositories/TaskRepository";
export {
  createTaskRepository,
  getTaskStorageMode,
  taskRepository,
  type TaskStorageMode,
} from "@/repositories/createTaskRepository";
export { LocalStorageTaskRepository } from "@/repositories/localStorageTaskRepository";
export {
  SupabaseNotConfiguredError,
  SupabaseTaskRepository,
} from "@/repositories/supabaseTaskRepository";
