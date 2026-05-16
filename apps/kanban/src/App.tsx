import { BrainDump } from "@/components/BrainDump";
import { KanbanBoard } from "@/components/KanbanBoard";
import { ProjectFilter } from "@/components/ProjectFilter";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { KanbanProvider } from "@/hooks/useKanbanStore";

export function App() {
  return (
    <KanbanProvider>
      <div className="min-h-screen bg-slate-950">
        <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">
          <header className="mb-8">
            <p className="kanban-eyebrow">Personal execution</p>
            <h1 className="kanban-h1">Kanban Dashboard</h1>
            <p className="kanban-muted mt-2 max-w-2xl">
              Rýchly capture a stavová práca naprieč projektmi. Jira ostáva zdroj
              pravdy - tento board je tvoja denná exekúcia.
            </p>
          </header>

          <div className="mb-6 space-y-4">
            <ProjectFilter />
            <BrainDump />
          </div>

          <KanbanBoard />
        </div>
      </div>
      <TaskDetailModal />
    </KanbanProvider>
  );
}
