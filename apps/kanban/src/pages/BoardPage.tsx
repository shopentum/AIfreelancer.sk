import { AppShell } from "@/components/AppShell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { usePageTitle } from "@/hooks/usePageTitle";

export function BoardPage() {
  usePageTitle("Kanban Dashboard");

  return (
    <AppShell title="Kanban Dashboard" showBrainDump>
      <KanbanBoard />
    </AppShell>
  );
}
