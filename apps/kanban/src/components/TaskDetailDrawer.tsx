import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Clock, Trash2, X } from "lucide-react";
import { TaskDetailAiSummary } from "@/components/TaskDetailAiSummary";
import { CopyTaskContextButton } from "@/components/CopyTaskContextButton";
import { TaskManualTimeAdd } from "@/components/TaskManualTimeAdd";
import { KANBAN_COLUMNS } from "@/config/columns";
import { getProjectBadgeClass } from "@/config/projectStyle";
import { useKanban } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { useLiveTrackedSeconds } from "@/hooks/useLiveTrackedSeconds";
import { t, useTheme } from "@/hooks/useTheme";
import {
  formatDuration,
  formatDurationWithSeconds,
  formatSkDate,
  formatSkDateTime,
} from "@/lib/formatters";
import {
  getTodayKey,
  getTomorrowKey,
} from "@/lib/plannedDate";
import { getTimerUiState } from "@/lib/timerState";
import { cn } from "@/lib/utils";
import type { ActivityEntry, Task, TaskStatus } from "@/types/task";

function activityLabel(entry: ActivityEntry): string {
  const p = entry.payload ?? {};
  switch (entry.type) {
    case "created":
      return "Úloha vytvorená";
    case "status_changed":
      return `Stav: ${p.from ?? "?"} → ${p.to ?? "?"}`;
    case "timer_started":
      return "Časovač spustený";
    case "timer_paused":
      return "Časovač pozastavený";
    case "timer_stopped":
      return "Časovač zastavený";
    case "notes_updated":
      return "Poznámky upravené";
    case "project_changed":
      return `Projekt: ${p.from ?? "?"} → ${p.to ?? "?"}`;
    case "planned_date_changed":
      return `Termín: ${p.from ?? "?"} → ${p.to ?? "?"}`;
    case "ai_summary_updated":
      return "AI summary upravené";
    case "time_added_manually": {
      const m = p.minutes ?? "?";
      if (m.startsWith("-")) return `${m} min ručne`;
      return `+${m} min ručne`;
    }
    case "marked_done":
      return "Označené ako hotové";
    default:
      return entry.type;
  }
}

interface DrawerBodyProps {
  task: Task;
  onClose: () => void;
}

function DrawerBody({ task, onClose }: DrawerBodyProps) {
  const { isDark } = useTheme();
  const { getLabel, projectsForTask } = useProjects();
  const assignableProjects = projectsForTask(task.project);
  const {
    updateTaskStatus,
    setTaskTitle,
    setTaskSummary,
    setTaskProject,
    setTaskNotes,
    setTaskAiSummary,
    setTaskPlannedDate,
    startTimer,
    pauseTimer,
    stopTimer,
    addTaskTrackedMinutes,
    deleteTask,
  } = useKanban();

  const [notesDraft, setNotesDraft] = useState(() => task.notes);
  const [aiSummaryDraft, setAiSummaryDraft] = useState(() => task.aiSummary);
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const aiSummaryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
      if (aiSummaryDebounceRef.current) clearTimeout(aiSummaryDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const timerState = getTimerUiState(task);
  const displaySeconds = useLiveTrackedSeconds(task);

  const sortedLog = useMemo(
    () => [...task.activityLog].sort((a, b) => b.at.localeCompare(a.at)),
    [task.activityLog],
  );

  function scheduleNotesSave(value: string) {
    if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
    notesDebounceRef.current = setTimeout(() => {
      notesDebounceRef.current = null;
      setTaskNotes(task.id, value);
    }, 500);
  }

  function flushNotesSave() {
    if (notesDebounceRef.current) {
      clearTimeout(notesDebounceRef.current);
      notesDebounceRef.current = null;
    }
    if (notesDraft !== task.notes) setTaskNotes(task.id, notesDraft);
  }

  function scheduleAiSummarySave(value: string) {
    if (aiSummaryDebounceRef.current) clearTimeout(aiSummaryDebounceRef.current);
    aiSummaryDebounceRef.current = setTimeout(() => {
      aiSummaryDebounceRef.current = null;
      setTaskAiSummary(task.id, value);
    }, 500);
  }

  function flushAiSummarySave() {
    if (aiSummaryDebounceRef.current) {
      clearTimeout(aiSummaryDebounceRef.current);
      aiSummaryDebounceRef.current = null;
    }
    if (aiSummaryDraft !== task.aiSummary) {
      setTaskAiSummary(task.id, aiSummaryDraft);
    }
  }

  const aiSummaryPreview = useMemo(() => {
    const line = task.aiSummary.trim().replace(/\s+/g, " ");
    if (!line) return "";
    return line.length > 56 ? `${line.slice(0, 56)}…` : line;
  }, [task.aiSummary]);

  function handleDelete() {
    if (
      !window.confirm(
        "Naozaj zmazať túto úlohu? Túto akciu nie je možné vrátiť.",
      )
    ) {
      return;
    }
    deleteTask(task.id);
    onClose();
  }

  const labelClass = cn(
    "text-[10px] font-black uppercase tracking-[0.3em]",
    t(isDark, "text-slate-400", "text-slate-600"),
  );

  const inputClass = cn(
    "w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all",
    t(
      isDark,
      "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-slate-300 focus:bg-white",
      "border-slate-700 bg-slate-800 text-white placeholder-slate-600 focus:border-indigo-500",
    ),
  );

  const selectClass = cn(
    "w-full appearance-none rounded-2xl border p-4 text-sm font-bold outline-none transition-all",
    t(
      isDark,
      "border-slate-100 bg-slate-50 text-slate-900 focus:border-slate-300",
      "border-slate-700 bg-slate-800 text-white focus:border-indigo-500",
    ),
  );

  return (
    <>
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
        aria-label="Zavrieť detail"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-full flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.3)] transition-colors duration-500 sm:max-w-[min(720px,90vw)]",
          t(isDark, "border-l border-slate-100 bg-white", "border-l border-slate-800 bg-slate-900"),
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
      >
        <div
          className={cn(
            "flex items-center justify-between border-b px-5 py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:py-6 md:px-12 md:py-8",
            t(isDark, "border-slate-100", "border-slate-800"),
          )}
        >
          <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <div
              className={cn(
                "w-fit rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-widest",
                getProjectBadgeClass(task.project, isDark),
              )}
            >
              {getLabel(task.project)}
            </div>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest tabular-nums",
                t(isDark, "text-slate-400", "text-slate-500"),
              )}
            >
              Vytvorené {formatSkDate(task.createdAt)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <CopyTaskContextButton task={task} />
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
                t(
                  isDark,
                  "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900",
                  "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
                ),
              )}
              aria-label="Zavrieť"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="scrollbar-kanban flex-1 space-y-8 overflow-y-auto px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:space-y-10 sm:px-8 sm:py-8 md:px-16 md:py-12">
          <h2 id="task-drawer-title" className="sr-only">
            Detail úlohy
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className={labelClass}>Názov</p>
              <input
                type="text"
                value={task.title}
                onChange={(e) => setTaskTitle(task.id, e.target.value)}
                className={cn(
                  inputClass,
                  "text-xl font-bold tracking-tight md:text-2xl",
                )}
              />
            </div>
            <div className="space-y-2">
              <p className={labelClass}>Kde som skončil</p>
              <input
                type="text"
                value={task.summary}
                onChange={(e) => setTaskSummary(task.id, e.target.value)}
                placeholder="Posledný vyriešený bod, krátko…"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className={labelClass}>Plánovaný deň</p>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={task.plannedDate ?? ""}
                onChange={(e) =>
                  setTaskPlannedDate(
                    task.id,
                    e.target.value ? e.target.value : null,
                  )
                }
                className={cn(inputClass, "w-auto max-w-full")}
              />
              <button
                type="button"
                onClick={() => setTaskPlannedDate(task.id, getTodayKey())}
                className={cn(
                  "rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  t(
                    isDark,
                    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20",
                  ),
                )}
              >
                Dnes
              </button>
              <button
                type="button"
                onClick={() => setTaskPlannedDate(task.id, getTomorrowKey())}
                className={cn(
                  "rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                  t(
                    isDark,
                    "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100",
                    "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20",
                  ),
                )}
              >
                Zajtra
              </button>
              {task.plannedDate && (
                <button
                  type="button"
                  onClick={() => setTaskPlannedDate(task.id, null)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors",
                    t(
                      isDark,
                      "border-slate-200 text-slate-500 hover:bg-slate-50",
                      "border-slate-700 text-slate-500 hover:bg-slate-800",
                    ),
                  )}
                >
                  Odstrániť
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <p className={labelClass}>Projekt</p>
              <select
                value={task.project}
                onChange={(e) => setTaskProject(task.id, e.target.value)}
                className={selectClass}
              >
                {assignableProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                    {!p.active ? " (neaktívny)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <p className={labelClass}>Stav</p>
              <select
                value={task.status}
                onChange={(e) =>
                  updateTaskStatus(task.id, e.target.value as TaskStatus)
                }
                className={selectClass}
              >
                {KANBAN_COLUMNS.map((col) => (
                  <option key={col.status} value={col.status}>
                    {col.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <p className={labelClass}>Poznámky</p>
            <textarea
              value={notesDraft}
              onChange={(e) => {
                const v = e.target.value;
                setNotesDraft(v);
                scheduleNotesSave(v);
              }}
              onBlur={flushNotesSave}
              rows={8}
              placeholder="Poznámky, odkazy, kontext…"
              className={cn(
                "w-full min-h-[200px] rounded-[2rem] border p-6 text-sm leading-relaxed outline-none transition-all",
                t(
                  isDark,
                  "border-slate-100 bg-slate-50 text-slate-600 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-200",
                  "border-slate-800 bg-slate-800/30 text-slate-300 placeholder-slate-700 focus:border-indigo-500/30 focus:bg-slate-800/50",
                ),
              )}
            />
          </div>

          <TaskDetailAiSummary
            aiSummaryOpen={aiSummaryOpen}
            setAiSummaryOpen={setAiSummaryOpen}
            aiSummaryDraft={aiSummaryDraft}
            setAiSummaryDraft={setAiSummaryDraft}
            aiSummaryPreview={aiSummaryPreview}
            scheduleAiSummarySave={scheduleAiSummarySave}
            flushAiSummarySave={flushAiSummarySave}
            labelClass={labelClass}
            isDark={isDark}
          />

          <div className="space-y-3">
            <p className={labelClass}>Časovač</p>
            <div
              className={cn(
                "grid grid-cols-1 gap-5 rounded-[2rem] border p-5 sm:grid-cols-2 sm:gap-6 md:p-6",
                t(isDark, "border-slate-100 bg-slate-50", "border-slate-800 bg-slate-800/50"),
              )}
            >
              <div className="flex flex-col gap-3">
                <p
                  className={cn(
                    "flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-lg font-black tracking-tight tabular-nums sm:text-xl",
                    t(isDark, "text-slate-900", "text-white"),
                  )}
                >
                  <span>
                    {task.isTimerRunning
                      ? formatDurationWithSeconds(displaySeconds)
                      : formatDuration(displaySeconds)}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      task.isTimerRunning
                        ? "text-emerald-500"
                        : t(isDark, "text-slate-500", "text-slate-400"),
                    )}
                  >
                    · Stav:{" "}
                    {timerState === "running"
                      ? "beží"
                      : timerState === "paused"
                        ? "pozastavený"
                        : "zastavený"}
                    {task.isTimerRunning && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 align-middle" />
                    )}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startTimer(task.id)}
                  disabled={task.isTimerRunning}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40",
                    t(
                      isDark,
                      "bg-slate-900 text-white hover:bg-slate-800",
                      "bg-white text-slate-900 hover:bg-slate-100",
                    ),
                  )}
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => pauseTimer(task.id)}
                  disabled={!task.isTimerRunning}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-amber-500 transition-all active:scale-95 disabled:opacity-40"
                >
                  Pause
                </button>
                <button
                  type="button"
                  onClick={() => stopTimer(task.id)}
                  disabled={!task.isTimerRunning}
                  className={cn(
                    "rounded-xl border px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40",
                    t(
                      isDark,
                      "border-slate-700 bg-slate-800 text-slate-400 hover:text-red-400",
                      "border-slate-200 bg-white text-slate-500 hover:text-red-500",
                    ),
                  )}
                >
                  Stop
                </button>
                </div>
              </div>
              <TaskManualTimeAdd
                onAdjust={(minutes) => addTaskTrackedMinutes(task.id, minutes)}
              />
            </div>
          </div>

          <div className="pb-8">
            <button
              type="button"
              onClick={() => setHistoryOpen((o) => !o)}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors",
                t(
                  isDark,
                  "border-slate-200 bg-slate-50 hover:bg-slate-100",
                  "border-slate-800 bg-slate-800/40 hover:bg-slate-800/70",
                ),
              )}
              aria-expanded={historyOpen}
            >
              <span className={labelClass}>História úlohy</span>
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-bold tabular-nums",
                    t(isDark, "text-slate-500", "text-slate-400"),
                  )}
                >
                  {sortedLog.length}
                </span>
                <ChevronDown
                  size={18}
                  className={cn(
                    "transition-transform",
                    historyOpen && "rotate-180",
                    t(isDark, "text-slate-400", "text-slate-500"),
                  )}
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {historyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="relative mt-4 space-y-8 px-1">
              <div
                className={cn(
                  "absolute top-2 bottom-2 left-5 w-px",
                  t(isDark, "bg-slate-100", "bg-slate-800"),
                )}
              />
                    {sortedLog.length === 0 ? (
                      <p
                        className={cn(
                          "py-4 text-center text-sm",
                          t(isDark, "text-slate-400", "text-slate-500"),
                        )}
                      >
                        Žiadne záznamy.
                      </p>
                    ) : (
                      sortedLog.map((log, i) => (
                <div key={log.id} className="relative pl-14">
                  <div
                    className={cn(
                      "absolute top-1.5 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm",
                      i === 0
                        ? t(
                            isDark,
                            "border-slate-900 bg-slate-900 text-white",
                            "border-indigo-500 bg-indigo-600 text-white",
                          )
                        : t(
                            isDark,
                            "border-slate-100 bg-white",
                            "border-slate-800 bg-slate-900",
                          ),
                    )}
                  >
                    <Clock size={14} aria-hidden />
                  </div>
                  <div className="space-y-1">
                    <p className={labelClass}>{formatSkDateTime(log.at)}</p>
                    <p
                      className={cn(
                        "text-sm font-bold tracking-tight",
                        t(isDark, "text-slate-800", "text-slate-200"),
                      )}
                    >
                      {activityLabel(log)}
                    </p>
                  </div>
                </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-4 border-t px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-6 md:px-12",
            t(isDark, "border-slate-100 bg-slate-50/50", "border-slate-800 bg-slate-950/40"),
          )}
        >
          <button
            type="button"
            onClick={handleDelete}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors",
              t(
                isDark,
                "text-red-500 hover:bg-red-50 hover:text-red-600",
                "text-red-400/80 hover:bg-red-400/10 hover:text-red-400",
              ),
            )}
          >
            <Trash2 size={14} />
            <span>Zmazať úlohu</span>
          </button>
          <span
            className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              t(isDark, "text-slate-300", "text-slate-700"),
            )}
          >
            ID: {task.id}
          </span>
        </div>
      </motion.aside>
    </>
  );
}

export function TaskDetailDrawer() {
  const { tasks, detailTaskId, closeTaskDetail } = useKanban();

  const task = useMemo(
    () => tasks.find((t) => t.id === detailTaskId) ?? null,
    [tasks, detailTaskId],
  );

  return (
    <AnimatePresence>
      {task && detailTaskId ? (
        <DrawerBody key={task.id} task={task} onClose={closeTaskDetail} />
      ) : null}
    </AnimatePresence>
  );
}
