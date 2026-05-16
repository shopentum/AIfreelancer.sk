import { AppShell } from "@/components/AppShell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { PlannedDateStrip } from "@/components/PlannedDateStrip";
import { usePageTitle } from "@/hooks/usePageTitle";

export function BoardPage() {
  usePageTitle("Kanban Dashboard");

  return (
    <AppShell showBrainDump>
      <div className="flex min-h-0 flex-1 flex-col">
        <PlannedDateStrip />
        <KanbanBoard />
      </div>
    </AppShell>
  );
}
