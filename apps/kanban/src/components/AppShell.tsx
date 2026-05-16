import type { ReactNode } from "react";
import { KanbanHeader } from "@/components/KanbanHeader";
import { ProjectToolbar } from "@/components/ProjectToolbar";
import { ProjectSettingsModal } from "@/components/ProjectSettingsModal";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBrainDump?: boolean;
  /** Locks brain-dump to this project (e.g. backlog inbox). */
  brainDumpProjectId?: string;
}

export function AppShell({
  children,
  title,
  showBrainDump = false,
  brainDumpProjectId,
}: AppShellProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={cn(
        "flex min-h-dvh flex-col font-sans transition-colors duration-500",
        t(isDark, "bg-[#F8FAFC] text-slate-900", "bg-slate-950 text-white"),
      )}
    >
      <KanbanHeader
        title={title}
        showBrainDump={showBrainDump}
        fixedProjectId={brainDumpProjectId}
      />
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col transition-colors duration-500",
          t(isDark, "bg-slate-100", "bg-slate-900/35"),
        )}
      >
        <ProjectToolbar />
        <main className="mx-auto flex min-h-0 w-full max-w-[1800px] flex-1 flex-col px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-8 md:pt-6">
          {children}
        </main>
      </div>
      <TaskDetailDrawer />
      <ProjectSettingsModal />
    </div>
  );
}
