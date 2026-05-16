import type { TaskRepository } from "@/repositories/TaskRepository";
import type { ArchivesByProject, Task } from "@/types/task";

/**
 * Skeleton pre budúcu Supabase integráciu.
 * Aktivuje sa cez VITE_TASK_STORAGE=supabase (a nakonfigurovaný Supabase klient).
 */
export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase TaskRepository nie je nakonfigurovaný. Nastav VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY, alebo použij VITE_TASK_STORAGE=local.",
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

export class SupabaseTaskRepository implements TaskRepository {
  private assertConfigured(): never {
    throw new SupabaseNotConfiguredError();
  }

  loadActiveTasks(): Task[] {
    this.assertConfigured();
  }

  saveActiveTasks(_tasks: Task[]): void {
    void _tasks;
    this.assertConfigured();
  }

  loadArchives(): ArchivesByProject {
    this.assertConfigured();
  }

  saveArchives(_archives: ArchivesByProject): void {
    void _archives;
    this.assertConfigured();
  }
}
