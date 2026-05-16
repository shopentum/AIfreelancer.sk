import { useCallback, useState } from "react";
import { Braces, Check } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useKanban } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { t, useTheme } from "@/hooks/useTheme";
import {
  buildArchiveKanbanContext,
  buildBoardKanbanContext,
  copyTextToClipboard,
  serializeKanbanContext,
} from "@/lib/kanbanContextExport";
import { taskRepository } from "@/repositories";
import { cn } from "@/lib/utils";
import type { ProjectFilter } from "@/hooks/useKanbanStore";

export function CopyKanbanContextButton() {
  const { isDark } = useTheme();
  const { pathname } = useLocation();
  const isArchive = pathname.startsWith("/archive");
  const [searchParams] = useSearchParams();
  const { tasks, projectFilter } = useKanban();
  const { getLabel } = useProjects();
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const archiveProjectFilter =
    (searchParams.get("project") || "all") as ProjectFilter;
  const activeFilter = isArchive ? archiveProjectFilter : projectFilter;

  const handleCopy = useCallback(async () => {
    const payload = isArchive
      ? buildArchiveKanbanContext(
          taskRepository.loadArchives(),
          activeFilter,
          getLabel,
          searchParams.get("from") ?? "",
          searchParams.get("to") ?? "",
        )
      : buildBoardKanbanContext(tasks, activeFilter, getLabel);

    const ok = await copyTextToClipboard(serializeKanbanContext(payload));
    if (ok) {
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      setCopied(false);
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2500);
    }
  }, [isArchive, tasks, activeFilter, getLabel, searchParams]);

  const label = copied
    ? "JSON skopírované"
    : failed
      ? "Kopírovanie zlyhalo"
      : "Kopírovať JSON kontext pre chat";

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
        copied
          ? t(
              isDark,
              "border-emerald-200 bg-emerald-50 text-emerald-600",
              "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
            )
          : failed
            ? t(
                isDark,
                "border-red-200 bg-red-50 text-red-600",
                "border-red-500/30 bg-red-500/10 text-red-400",
              )
            : t(
                isDark,
                "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
              ),
      )}
    >
      {copied ? (
        <Check size={20} strokeWidth={2.5} aria-hidden />
      ) : (
        <Braces size={20} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
