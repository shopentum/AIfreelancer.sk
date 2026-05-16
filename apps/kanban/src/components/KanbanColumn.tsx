import { Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDefinition } from "@/config/columns";
import { TaskCard } from "@/components/TaskCard";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface KanbanColumnProps {
  column: ColumnDefinition;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { isDark } = useTheme();

  return (
    <section
      className="flex min-w-[320px] flex-1 flex-col gap-4"
      aria-label={column.title}
    >
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h2
            className={cn(
              "text-sm font-black uppercase tracking-widest",
              t(isDark, "text-slate-400", "text-slate-600"),
            )}
          >
            {column.title}
          </h2>
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-black transition-colors",
              t(
                isDark,
                "border-slate-200 bg-slate-100 text-slate-500",
                "border-slate-800 bg-slate-900 text-slate-500",
              ),
            )}
          >
            {tasks.length}
          </span>
        </div>
        <button
          type="button"
          className={cn(
            "transition-colors",
            t(
              isDark,
              "text-slate-300 hover:text-slate-600",
              "text-slate-700 hover:text-slate-400",
            ),
          )}
          aria-label={`Možnosti stĺpca ${column.title}`}
          tabIndex={-1}
        >
          <MoreHorizontal size={18} aria-hidden />
        </button>
      </div>

      <Droppable droppableId={column.status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "scrollbar-kanban flex-1 space-y-4 overflow-y-auto rounded-2xl p-2 pr-2 transition-colors",
              snapshot.isDraggingOver &&
                t(isDark, "bg-slate-100", "bg-white/5"),
            )}
          >
            {tasks.length === 0 ? (
              <p
                className={cn(
                  "py-8 text-center text-xs",
                  t(isDark, "text-slate-400", "text-slate-600"),
                )}
              >
                Prázdne
              </p>
            ) : (
              tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {column.status === "Done" && (
        <p
          className={cn(
            "px-2 text-[10px] leading-snug",
            t(isDark, "text-slate-400", "text-slate-600"),
          )}
        >
          Pri obnovení stránky presun do archívu.
        </p>
      )}
    </section>
  );
}
