import { KANBAN_COLUMNS } from "@/config/columns";
import { KanbanColumn } from "@/components/KanbanColumn";
import { useKanban } from "@/hooks/useKanbanStore";
import type { TaskStatus } from "@/types/task";

export function KanbanBoard() {
  const { visibleTasks } = useKanban();

  const byStatus = KANBAN_COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = visibleTasks.filter((t) => t.status === col.status);
      return acc;
    },
    {} as Record<TaskStatus, typeof visibleTasks>,
  );

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-kanban">
      {KANBAN_COLUMNS.map((col) => (
        <KanbanColumn key={col.status} column={col} tasks={byStatus[col.status]} />
      ))}
    </div>
  );
}
