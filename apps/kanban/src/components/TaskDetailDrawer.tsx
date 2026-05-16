import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Clock, Square, Trash2, X } from "lucide-react";
import { KANBAN_COLUMNS } from "@/config/columns";
import { getProjectBadgeClass } from "@/config/projectStyle";
import { PROJECTS, getProjectLabel } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";
import { useLiveTrackedSeconds } from "@/hooks/useLiveTrackedSeconds";
import { t, useTheme } from "@/hooks/useTheme";
import {
  formatDuration,
  formatDurationWithSeconds,
  formatSkDateTime,
} from "@/lib/formatters";
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
  const {
    updateTaskStatus,
    setTaskTitle,
    setTaskSummary,
    setTaskProject,
    setTaskNotes,
    startTimer,
    pauseTimer,
    stopTimer,
    deleteTask,
  } = useKanban();

  const [notesDraft, setNotesDraft] = useState(() => task.notes);
  const notesDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (notesDebounceRef.current) clearTimeout(notesDebounceRef.current);
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

  const fieldClass = cn(
    "w-full border-none bg-transparent p-0 outline-none transition-colors focus:ring-0",
    t(isDark, "text-slate-900 placeholder-slate-400", "text-white placeholder-slate-700"),
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
          "fixed top-0 right-0 z-50 flex h-full w-full max-w-[min(720px,90vw)] flex-col shadow-[-40px_0_80px_rgba(0,0,0,0.3)] transition-colors duration-500",
          t(isDark, "border-l border-slate-100 bg-white", "border-l border-slate-800 bg-slate-900"),
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
      >
        <div
          className={cn(
            "flex items-center justify-between border-b px-8 py-6 md:px-12 md:py-8",
            t(isDark, "border-slate-100", "border-slate-800"),
          )}
        >
          <div
            className={cn(
              "rounded-xl border px-4 py-2 text-xs font-black uppercase tracking-widest",
              getProjectBadgeClass(task.project, isDark),
            )}
          >
            {getProjectLabel(task.project)}
          </div>
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

        <div className="scrollbar-kanban flex-1 space-y-10 overflow-y-auto px-8 py-8 md:px-16 md:py-12">
          <h2 id="task-drawer-title" className="sr-only">
            Detail úlohy
          </h2>

          <div className="space-y-8">
            <div className="space-y-2">
              <p className={labelClass}>Názov</p>
              <textarea
                value={task.title}
                onChange={(e) => setTaskTitle(task.id, e.target.value)}
                rows={2}
                className={cn(fieldClass, "resize-none text-2xl font-black tracking-tight md:text-4xl")}
              />
            </div>
            <div className="space-y-2">
              <p className={labelClass}>Summary (kanban)</p>
              <input
                type="text"
                value={task.summary}
                onChange={(e) => setTaskSummary(task.id, e.target.value)}
                placeholder="Krátky text na karte…"
                className={cn(fieldClass, "text-lg font-bold")}
              />
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
                {PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
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

          <div className="space-y-6">
            <p className={labelClass}>Časovač</p>
            <div
              className={cn(
                "flex flex-col gap-6 rounded-[2.5rem] border p-6 sm:flex-row sm:items-center sm:justify-between md:p-8",
                t(isDark, "border-slate-100 bg-slate-50", "border-slate-800 bg-slate-800/50"),
              )}
            >
              <div className="space-y-1">
                <p
                  className={cn(
                    "font-mono text-3xl font-black tracking-tighter tabular-nums md:text-4xl",
                    t(isDark, "text-slate-900", "text-white"),
                  )}
                >
                  {task.isTimerRunning
                    ? formatDurationWithSeconds(displaySeconds)
                    : formatDuration(displaySeconds)}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest",
                      task.isTimerRunning
                        ? "text-emerald-500"
                        : t(isDark, "text-slate-400", "text-slate-500"),
                    )}
                  >
                    Stav:{" "}
                    {timerState === "running"
                      ? "beží"
                      : timerState === "paused"
                        ? "pozastavený"
                        : "zastavený"}
                  </span>
                  {task.isTimerRunning && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startTimer(task.id)}
                  disabled={task.isTimerRunning}
                  className={cn(
                    "rounded-xl px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-40",
                    t(isDark, "bg-slate-900 text-white hover:bg-slate-800", "bg-white text-slate-900 hover:bg-slate-100"),
                  )}
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => pauseTimer(task.id)}
                  disabled={!task.isTimerRunning}
                  className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-6 py-3 text-xs font-bold uppercase tracking-widest text-amber-500 transition-all active:scale-95 disabled:opacity-40"
                >
                  Pause
                </button>
                <button
                  type="button"
                  onClick={() => stopTimer(task.id)}
                  disabled={!task.isTimerRunning}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl border transition-all active:scale-95 disabled:opacity-40",
                    t(
                      isDark,
                      "border-slate-200 bg-white text-slate-300 hover:text-red-500",
                      "border-slate-700 bg-slate-800 text-slate-600 hover:text-red-400",
                    ),
                  )}
                  aria-label="Stop"
                >
                  <Square size={16} className="fill-current" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8 pb-8">
            <p className={labelClass}>História úlohy</p>
            <div className="relative space-y-8">
              <div
                className={cn(
                  "absolute top-2 bottom-2 left-5 w-px",
                  t(isDark, "bg-slate-100", "bg-slate-800"),
                )}
              />
              {sortedLog.map((log, i) => (
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
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "flex flex-wrap items-center justify-between gap-4 border-t px-8 py-6 md:px-12",
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
