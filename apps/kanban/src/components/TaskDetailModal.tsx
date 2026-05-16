import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { KANBAN_COLUMNS } from "@/config/columns";
import { PROJECTS } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";
import { useLiveTrackedSeconds } from "@/hooks/useLiveTrackedSeconds";
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

function ActivityTimeline({ task }: { task: Task }) {
  const sorted = useMemo(
    () => [...task.activityLog].sort((a, b) => a.at.localeCompare(b.at)),
    [task.activityLog],
  );

  return (
    <div>
      <h3 className="kanban-label mb-3">História</h3>
      <ul className="max-h-48 space-y-2 overflow-y-auto pr-1 text-sm scrollbar-kanban">
        {sorted.map((entry) => (
          <li
            key={entry.id}
            className="border-l-2 border-white/10 pl-3 text-slate-400"
          >
            <time className="block text-xs text-slate-500 tabular-nums">
              {formatSkDateTime(entry.at)}
            </time>
            <span className="text-slate-300">{activityLabel(entry)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TaskDetailModalBodyProps {
  task: Task;
  onClose: () => void;
}

function TaskDetailModalBody({ task, onClose }: TaskDetailModalBodyProps) {
  const {
    updateTaskStatus,
    setTaskTitle,
    setTaskSummary,
    setTaskProject,
    setTaskNotes,
    startTimer,
    pauseTimer,
    stopTimer,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Zavrieť detail"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-detail-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/50"
      >
        <div className="flex items-start justify-between border-b border-white/10 px-5 py-4">
          <h2 id="task-detail-title" className="sr-only">
            Detail úlohy
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Zavrieť"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto px-5 py-4 scrollbar-kanban">
          <div>
            <label htmlFor="detail-summary" className="kanban-label">
              Summary (kanban)
            </label>
            <input
              id="detail-summary"
              type="text"
              value={task.summary}
              onChange={(e) => setTaskSummary(task.id, e.target.value)}
              className="kanban-input"
              placeholder="Krátky text na karte"
            />
          </div>

          <div>
            <label htmlFor="detail-title" className="kanban-label">
              Názov
            </label>
            <input
              id="detail-title"
              type="text"
              value={task.title}
              onChange={(e) => setTaskTitle(task.id, e.target.value)}
              className="kanban-input"
            />
          </div>

          <div>
            <label htmlFor="detail-project" className="kanban-label">
              Projekt
            </label>
            <select
              id="detail-project"
              value={task.project}
              onChange={(e) => setTaskProject(task.id, e.target.value)}
              className="kanban-select"
            >
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="detail-status" className="kanban-label">
              Stav
            </label>
            <select
              id="detail-status"
              value={task.status}
              onChange={(e) =>
                updateTaskStatus(task.id, e.target.value as TaskStatus)
              }
              className="kanban-select"
            >
              {KANBAN_COLUMNS.map((col) => (
                <option key={col.status} value={col.status}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="detail-notes" className="kanban-label">
              Poznámky
            </label>
            <textarea
              id="detail-notes"
              value={notesDraft}
              onChange={(e) => {
                const v = e.target.value;
                setNotesDraft(v);
                scheduleNotesSave(v);
              }}
              onBlur={flushNotesSave}
              rows={5}
              className="kanban-input resize-y font-mono text-xs leading-relaxed"
              placeholder="Markdown text…"
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="kanban-label mb-2">Časovač</h3>
            <p className="mb-3 text-2xl font-semibold tabular-nums text-white">
              {task.isTimerRunning
                ? formatDurationWithSeconds(displaySeconds)
                : formatDuration(displaySeconds)}
            </p>
            <p className="mb-3 text-xs text-slate-500">
              Stav:{" "}
              <span className="text-slate-300">
                {timerState === "running"
                  ? "beží"
                  : timerState === "paused"
                    ? "pozastavený"
                    : "zastavený"}
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => startTimer(task.id)}
                disabled={task.isTimerRunning}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider",
                  task.isTimerRunning
                    ? "cursor-not-allowed border border-white/5 bg-white/5 text-slate-600"
                    : "bg-emerald-600 text-white hover:bg-emerald-500",
                )}
              >
                Start
              </button>
              <button
                type="button"
                onClick={() => pauseTimer(task.id)}
                disabled={!task.isTimerRunning}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider",
                  !task.isTimerRunning
                    ? "cursor-not-allowed border border-white/5 bg-white/5 text-slate-600"
                    : "bg-amber-600 text-white hover:bg-amber-500",
                )}
              >
                Pause
              </button>
              <button
                type="button"
                onClick={() => stopTimer(task.id)}
                disabled={!task.isTimerRunning}
                className={cn(
                  "rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider",
                  !task.isTimerRunning
                    ? "cursor-not-allowed border border-white/5 bg-white/5 text-slate-600"
                    : "bg-slate-600 text-white hover:bg-slate-500",
                )}
              >
                Stop
              </button>
            </div>
          </div>

          <ActivityTimeline task={task} />
        </div>
      </div>
    </div>
  );
}

export function TaskDetailModal() {
  const { tasks, detailTaskId, closeTaskDetail } = useKanban();

  const task = useMemo(
    () => tasks.find((t) => t.id === detailTaskId) ?? null,
    [tasks, detailTaskId],
  );

  if (!task || !detailTaskId) return null;

  return (
    <TaskDetailModalBody key={task.id} task={task} onClose={closeTaskDetail} />
  );
}
