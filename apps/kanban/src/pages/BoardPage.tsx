import { AppShell } from "@/components/AppShell";
import { KanbanBoard } from "@/components/KanbanBoard";
import { PlannedDateStrip } from "@/components/PlannedDateStrip";
import { usePageTitle } from "@/hooks/usePageTitle";

export function BoardPage() {
  usePageTitle("Kanban Dashboard");

  return (
    <AppShell showBrainDump>
      <PlannedDateStrip />
      <KanbanBoard />
    </AppShell>
  );
}
