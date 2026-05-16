import { useCallback, useState } from "react";
import { Braces, Check } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { t, useTheme } from "@/hooks/useTheme";
import {
  buildSingleTaskKanbanContext,
  copyTextToClipboard,
  serializeKanbanContext,
} from "@/lib/kanbanContextExport";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/task";

interface CopyTaskContextButtonProps {
  task: Task;
  className?: string;
}

export function CopyTaskContextButton({
  task,
  className,
}: CopyTaskContextButtonProps) {
  const { isDark } = useTheme();
  const { getLabel } = useProjects();
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleCopy = useCallback(async () => {
    const json = serializeKanbanContext(
      buildSingleTaskKanbanContext(task, getLabel),
    );
    const ok = await copyTextToClipboard(json);
    if (ok) {
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      setCopied(false);
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2500);
    }
  }, [task, getLabel]);

  const label = copied
    ? "Kontext úlohy skopírovaný"
    : failed
      ? "Kopírovanie zlyhalo"
      : "Kopírovať JSON kontext tejto úlohy";

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-2xl border transition-all",
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
                "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900",
                "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
              ),
        className,
      )}
    >
      {copied ? (
        <Check size={22} strokeWidth={2.5} aria-hidden />
      ) : (
        <Braces size={22} strokeWidth={2} aria-hidden />
      )}
    </button>
  );
}
