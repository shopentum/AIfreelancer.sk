import { BrainDump } from "@/components/BrainDump";
import { KanbanBoard } from "@/components/KanbanBoard";
import { PageHeader } from "@/components/PageHeader";
import { ProjectFilter } from "@/components/ProjectFilter";
import { TaskDetailModal } from "@/components/TaskDetailModal";
import { usePageTitle } from "@/hooks/usePageTitle";

export function BoardPage() {
  usePageTitle("Kanban Dashboard");

  return (
    <>
      <div className="mx-auto max-w-[1600px] px-4 py-8 md:px-8">
        <PageHeader title="Kanban Dashboard" />

        <div className="mb-6 space-y-4">
          <ProjectFilter />
          <BrainDump />
        </div>

        <KanbanBoard />
      </div>
      <TaskDetailModal />
    </>
  );
}
