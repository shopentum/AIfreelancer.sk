import { AppShell } from "@/components/AppShell";
import { BacklogList } from "@/components/BacklogList";
import { BACKLOG_PROJECT_ID } from "@/config/defaultProjects";
import { usePageTitle } from "@/hooks/usePageTitle";

export function BacklogPage() {
  usePageTitle("Backlog");

  return (
    <AppShell showBrainDump brainDumpProjectId={BACKLOG_PROJECT_ID}>
      <BacklogList />
    </AppShell>
  );
}
