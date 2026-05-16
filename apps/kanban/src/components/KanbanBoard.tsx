import {
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";
import { KANBAN_COLUMNS } from "@/config/columns";
import { KanbanColumn } from "@/components/KanbanColumn";
import { useKanban } from "@/hooks/useKanbanStore";
import { sortTasksForColumn } from "@/lib/plannedDate";
import type { TaskStatus } from "@/types/task";

export function KanbanBoard() {
  const { visibleTasks, updateTaskStatus } = useKanban();

  const byStatus = KANBAN_COLUMNS.reduce(
    (acc, col) => {
      acc[col.status] = sortTasksForColumn(
        visibleTasks.filter((t) => t.status === col.status),
      );
      return acc;
    },
    {} as Record<TaskStatus, typeof visibleTasks>,
  );

  function onDragEnd(result: DropResult) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const nextStatus = destination.droppableId as TaskStatus;
    if (nextStatus !== source.droppableId) {
      updateTaskStatus(draggableId, nextStatus);
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="scrollbar-kanban flex h-[calc(100vh-200px)] min-h-[480px] gap-8 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            column={col}
            tasks={byStatus[col.status]}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
