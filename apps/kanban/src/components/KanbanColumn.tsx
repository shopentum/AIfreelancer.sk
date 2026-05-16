import type { DragEvent } from "react";
import type { ColumnDefinition } from "@/config/columns";
import { TaskCard } from "@/components/TaskCard";
import { useKanban } from "@/hooks/useKanbanStore";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface KanbanColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { updateTaskStatus, draggingTaskId } = useKanban();

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/task-id");
    if (!taskId) return;
    updateTaskStatus(taskId, column.status);
  }

  return (
    <section
      className="flex min-h-[420px] min-w-[260px] flex-1 flex-col rounded-2xl border border-white/10 bg-white/[0.02]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label={column.title}
    >
      <header
        className={cn(
          "border-b px-4 py-3",
          column.headerBorderClass,
        )}
      >
        <h2 className={cn("text-sm font-bold tracking-wide", column.accentClass)}>
          {column.title}
        </h2>
        <p className="mt-0.5 text-[11px] text-slate-500">{tasks.length} úloh</p>
        {column.status === "Done" && (
          <p className="mt-1 text-[10px] leading-snug text-slate-600">
            Pri obnovení stránky presun do archívu.
          </p>
        )}
      </header>
      <div
        className={cn(
          "flex flex-1 flex-col gap-2 p-3 transition-colors",
          draggingTaskId && "bg-white/[0.02]",
        )}
      >
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-xs text-slate-600">Prázdne</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        )}
      </div>
    </section>
  );
}
