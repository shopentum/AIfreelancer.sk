import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Braces, Check, X } from "lucide-react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useKanban, type ProjectFilter } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { t, useTheme } from "@/hooks/useTheme";
import {
  addCalendarDaysBratislava,
  firstDayOfMonthKeyFromToday,
  todayBratislavaDateKey,
} from "@/lib/archiveDateFilter";
import {
  buildReportKanbanContext,
  copyTextToClipboard,
  serializeKanbanContext,
  type KanbanReportParams,
} from "@/lib/kanbanContextExport";
import { taskRepository } from "@/repositories";
import { cn } from "@/lib/utils";

export function KanbanExportPopover() {
  const { isDark } = useTheme();
  const { pathname } = useLocation();
  const isArchive = pathname.startsWith("/archive");
  const [searchParams] = useSearchParams();
  const { tasks, projectFilter } = useKanban();
  const { getLabel } = useProjects();

  const archiveProjectFilter =
    (searchParams.get("project") || "all") as ProjectFilter;
  const activeFilter = isArchive ? archiveProjectFilter : projectFilter;
  const projectLabel =
    activeFilter === "all" ? "Všetky projekty" : getLabel(activeFilter);

  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [includeDone, setIncludeDone] = useState(true);
  const [includeArchive, setIncludeArchive] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const today = todayBratislavaDateKey();

  useEffect(() => {
    if (!open) return;
    setPeriodFrom(searchParams.get("from") ?? "");
    setPeriodTo(searchParams.get("to") ?? "");
    setIncludeDone(true);
    setIncludeArchive(isArchive || Boolean(searchParams.get("from")));
  }, [open, isArchive, searchParams]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleCopy = useCallback(async () => {
    const report: KanbanReportParams = {
      periodFrom: periodFrom || null,
      periodTo: periodTo || null,
      project: activeFilter,
      projectLabel,
      includeDone,
      includeArchive,
    };
    const payload = buildReportKanbanContext(
      tasks,
      taskRepository.loadArchives(),
      report,
      getLabel,
    );
    const ok = await copyTextToClipboard(serializeKanbanContext(payload));
    if (ok) {
      setFailed(false);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1200);
    } else {
      setCopied(false);
      setFailed(true);
      window.setTimeout(() => setFailed(false), 2500);
    }
  }, [
    periodFrom,
    periodTo,
    activeFilter,
    projectLabel,
    includeDone,
    includeArchive,
    tasks,
    getLabel,
  ]);

  const labelClass = cn(
    "mb-1 block text-[10px] font-bold uppercase tracking-widest",
    t(isDark, "text-slate-500", "text-slate-500"),
  );

  const inputClass = cn(
    "w-full rounded-xl border px-3 py-2 text-sm outline-none transition-all",
    t(
      isDark,
      "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-300",
      "border-slate-700 bg-slate-800 text-white focus:border-indigo-500",
    ),
  );

  const chipClass = cn(
    "rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest transition-colors",
    t(
      isDark,
      "border-slate-200 text-slate-600 hover:bg-slate-50",
      "border-slate-700 text-slate-400 hover:bg-slate-800",
    ),
  );

  const triggerLabel = open
    ? "Zavrieť export reportu"
    : copied
      ? "JSON skopírované"
      : failed
        ? "Kopírovanie zlyhalo"
        : "Otvoriť export reportu (nie kopírovať hneď)";

  const dialog =
    open &&
    createPortal(
      <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center">
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          aria-label="Zavrieť"
          onClick={() => setOpen(false)}
        />
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Export reportu JSON"
          className={cn(
            "relative z-[201] max-h-[min(90dvh,640px)] w-full max-w-md overflow-y-auto rounded-2xl border p-5 shadow-2xl",
            t(isDark, "border-slate-200 bg-white", "border-slate-700 bg-slate-900"),
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <p
                className={cn(
                  "text-sm font-bold uppercase tracking-widest",
                  t(isDark, "text-slate-900", "text-white"),
                )}
              >
                Export reportu
              </p>
              <p className={cn("mt-1 text-xs", t(isDark, "text-slate-500", "text-slate-400"))}>
                Nastav obdobie a checkboxy, potom Kopírovať JSON.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={cn(
                "rounded-lg p-1.5",
                t(isDark, "text-slate-400 hover:bg-slate-100", "text-slate-500 hover:bg-slate-800"),
              )}
              aria-label="Zavrieť"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mb-3">
            <span className={labelClass}>Projekt / klient</span>
            <p
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-medium",
                t(isDark, "border-slate-100 bg-slate-50 text-slate-800", "border-slate-800 bg-slate-800/50 text-slate-200"),
              )}
            >
              {projectLabel}
            </p>
          </div>

          <div className="mb-2 flex flex-wrap gap-1.5">
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setPeriodFrom(today);
                setPeriodTo(today);
              }}
            >
              Dnes
            </button>
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setPeriodFrom(addCalendarDaysBratislava(today, -6));
                setPeriodTo(today);
              }}
            >
              7 dní
            </button>
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setPeriodFrom(firstDayOfMonthKeyFromToday(today));
                setPeriodTo(today);
              }}
            >
              Mesiac
            </button>
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setPeriodFrom("");
                setPeriodTo("");
              }}
            >
              Bez obdobia
            </button>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="export-from" className={labelClass}>
                periodFrom
              </label>
              <input
                id="export-from"
                type="date"
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="export-to" className={labelClass}>
                periodTo
              </label>
              <input
                id="export-to"
                type="date"
                value={periodTo}
                onChange={(e) => setPeriodTo(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="mb-4 space-y-2 rounded-xl border p-3">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 text-sm",
                t(isDark, "text-slate-700", "text-slate-300"),
              )}
            >
              <input
                type="checkbox"
                checked={includeDone}
                onChange={(e) => setIncludeDone(e.target.checked)}
              />
              <span>includeDone — úlohy Done na boarde</span>
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2 text-sm",
                t(isDark, "text-slate-700", "text-slate-300"),
              )}
            >
              <input
                type="checkbox"
                checked={includeArchive}
                onChange={(e) => setIncludeArchive(e.target.checked)}
              />
              <span>includeArchive — položky z archívu</span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => void handleCopy()}
            className={cn(
              "w-full rounded-xl py-3 text-xs font-bold uppercase tracking-widest transition-all",
              t(
                isDark,
                "bg-slate-900 text-white hover:bg-slate-800",
                "bg-indigo-600 text-white hover:bg-indigo-500",
              ),
            )}
          >
            Kopírovať JSON
          </button>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={triggerLabel}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl border transition-all",
          open || copied
            ? t(
                isDark,
                "border-indigo-200 bg-indigo-50 text-indigo-600",
                "border-indigo-500/40 bg-indigo-500/15 text-indigo-300",
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
      {dialog}
    </>
  );
}
