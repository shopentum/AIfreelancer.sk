import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDefinition } from "@/config/columns";
import { getColumnIcon, getColumnTheme } from "@/config/columnStyle";
import { TaskCard } from "@/components/TaskCard";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface KanbanColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { isDark } = useTheme();
  const theme = getColumnTheme(column.status, isDark);

  return (
    <section
      className="flex w-[86vw] max-w-[320px] shrink-0 flex-col gap-3 sm:w-auto sm:min-w-[300px] sm:max-w-none sm:flex-1"
      aria-label={column.title}
    >
      <div className="px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={theme.iconClass}>
              {getColumnIcon(column.status, 18)}
            </span>
            <h2
              className={cn(
                "text-sm font-medium uppercase tracking-widest",
                theme.titleClass,
              )}
            >
              {column.title}
            </h2>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                theme.countClass,
              )}
            >
              {tasks.length}
            </span>
          </div>
          <button
            type="button"
            className={cn(
              "transition-colors",
              isDark
                ? "text-slate-700 hover:text-slate-400"
                : "text-slate-300 hover:text-slate-600",
            )}
            aria-label={`Možnosti stĺpca ${column.title}`}
            tabIndex={-1}
          >
            <MoreHorizontal size={18} aria-hidden />
          </button>
        </div>
        <div className={cn("mt-2 h-0.5 w-full rounded-full", theme.lineClass)} />
      </div>

      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "scrollbar-kanban flex-1 space-y-4 overflow-y-auto rounded-2xl p-2 pr-2 transition-colors",
              isDark ? "bg-slate-900/55 ring-1 ring-slate-800/40" : "bg-slate-200/60",
              snapshot.isDraggingOver && theme.dropBgClass,
            )}
          >
            {tasks.length === 0 ? (
              <p
                className={cn(
                  "py-8 text-center text-xs",
                  isDark ? "text-slate-600" : "text-slate-400",
                )}
              >
                Prázdne
              </p>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  columnStatus={column.status}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
