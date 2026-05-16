import type { ReactNode } from "react";
import { KanbanHeader } from "@/components/KanbanHeader";
import { ProjectToolbar } from "@/components/ProjectToolbar";
import { ProjectSettingsModal } from "@/components/ProjectSettingsModal";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBrainDump?: boolean;
}

export function AppShell({
  children,
  title,
  subtitle = "Osobná execution vrstva",
  showBrainDump = false,
}: AppShellProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={cn(
        "min-h-screen font-sans transition-colors duration-500",
        t(isDark, "bg-[#F8FAFC] text-slate-900", "bg-slate-950 text-white"),
      )}
    >
      <KanbanHeader
        title={title}
        subtitle={subtitle}
        showBrainDump={showBrainDump}
      />
      <ProjectToolbar />
      <main className="mx-auto max-w-[1800px] px-4 pt-6 pb-8 md:px-8">
        {children}
      </main>
      <TaskDetailDrawer />
      <ProjectSettingsModal />
    </div>
  );
}
