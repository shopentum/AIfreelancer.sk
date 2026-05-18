import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, RotateCcw, X } from "lucide-react";
import { BACKLOG_PROJECT_ID } from "@/config/defaultProjects";
import { useKanban } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { t, useTheme } from "@/hooks/useTheme";
import { formatSkDateTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";

function ProjectRow({ project }: { project: import("@/types/project").Project }) {
  const { isDark } = useTheme();
  const { projectFilter, setProjectFilter } = useKanban();
  const {
    renameProjectById,
    deactivateProjectById,
    reactivateProjectById,
    getProjectArchiveCount,
    purgeProjectArchive,
  } = useProjects();
  const [labelDraft, setLabelDraft] = useState(project.label);

  function commitRename() {
    renameProjectById(project.id, labelDraft);
  }

  function handleDeactivate() {
    if (project.id === BACKLOG_PROJECT_ID) {
      window.alert("Projekt Backlog nie je možné deaktivovať — slúži na inbox mimo boardu.");
      return;
    }
    if (
      !window.confirm(
        `Deaktivovať projekt „${project.label}"? Nebude v rýchlom zápise ani vo filtri boardu. Úlohy na doske ostávajú.`,
      )
    ) {
      return;
    }
    deactivateProjectById(project.id);
    if (projectFilter === project.id) setProjectFilter("all");
  }

  function handleReactivate() {
    reactivateProjectById(project.id);
  }

  function handlePurgeArchive() {
    const count = getProjectArchiveCount(project.id);
    if (count === 0) {
      window.alert("V archíve nie sú žiadne položky pre tento projekt.");
      return;
    }
    if (
      !window.confirm(
        `Natrvalo zmazať ${count} archivovaných položiek projektu „${project.label}"?`,
      )
    ) {
      return;
    }
    purgeProjectArchive(project.id);
  }

  const inputClass = cn(
    "w-full rounded-xl border px-3 py-2 text-sm font-bold outline-none transition-all",
    t(
      isDark,
      "border-slate-200 bg-white text-slate-900 focus:border-slate-300",
      "border-slate-700 bg-slate-800 text-white focus:border-indigo-500",
    ),
  );

  return (
    <li
      className={cn(
        "rounded-2xl border p-4",
        t(
          isDark,
          project.active ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-slate-100/80 opacity-90",
          project.active ? "border-slate-800 bg-slate-800/40" : "border-slate-800 bg-slate-900/60 opacity-80",
        ),
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            value={labelDraft}
            onChange={(e) => setLabelDraft(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitRename();
                (e.target as HTMLInputElement).blur();
              }
            }}
            className={inputClass}
            aria-label={`Názov projektu ${project.id}`}
          />
          <p className={cn("text-[10px] font-mono", t(isDark, "text-slate-400", "text-slate-500"))}>
            id: {project.id}
            {!project.active && project.archivedAt && (
              <span className="ml-2">
                · archivovaný {formatSkDateTime(project.archivedAt)}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.active && project.id !== BACKLOG_PROJECT_ID ? (
            <button
              type="button"
              onClick={handleDeactivate}
              className={cn(
                "rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                t(
                  isDark,
                  "border border-slate-200 text-slate-600 hover:bg-white",
                  "border-slate-700 text-slate-400 hover:bg-slate-800",
                ),
              )}
            >
              Deaktivovať
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleReactivate}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-500"
              >
                <RotateCcw size={12} />
                Obnoviť
              </button>
              <button
                type="button"
                onClick={handlePurgeArchive}
                className={cn(
                  "flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-colors",
                  t(
                    isDark,
                    "text-red-500 hover:bg-red-50",
                    "text-red-400 hover:bg-red-400/10",
                  ),
                )}
              >
                <Archive size={12} />
                Vymazať archív
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

export function ProjectSettingsModal() {
  const { isDark } = useTheme();
  const {
    projects,
    settingsOpen,
    closeSettings,
    addProject,
  } = useProjects();
  const [newLabel, setNewLabel] = useState("");

  function handleAdd(e: FormEvent) {
    e.preventDefault();
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    addProject(trimmed);
    setNewLabel("");
  }

  const sorted = [...projects].sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return a.label.localeCompare(b.label, "sk");
  });

  return (
    <AnimatePresence>
      {settingsOpen && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSettings}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
            aria-label="Zavrieť nastavenia"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-settings-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={cn(
              "fixed top-1/2 left-1/2 z-50 flex max-h-[min(640px,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border shadow-2xl",
              t(isDark, "border-slate-200 bg-white", "border-slate-800 bg-slate-900"),
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between border-b px-6 py-4",
                t(isDark, "border-slate-100", "border-slate-800"),
              )}
            >
              <h2 id="project-settings-title" className="text-lg font-bold tracking-tight">
                Projekty
              </h2>
              <button
                type="button"
                onClick={closeSettings}
                className={cn(
                  "rounded-xl p-2 transition-colors",
                  t(isDark, "text-slate-400 hover:bg-slate-100", "text-slate-400 hover:bg-slate-800"),
                )}
                aria-label="Zavrieť"
              >
                <X size={20} />
              </button>
            </div>

            <div className="scrollbar-kanban flex-1 overflow-y-auto px-6 py-4">
              <form onSubmit={handleAdd} className="mb-6 flex gap-2">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Nový projekt…"
                  className={cn(
                    "min-w-0 flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none",
                    t(
                      isDark,
                      "border-slate-200 bg-slate-50 focus:border-slate-300",
                      "border-slate-700 bg-slate-800 focus:border-indigo-500",
                    ),
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    "shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white",
                    t(isDark, "bg-slate-900 hover:bg-slate-800", "bg-indigo-600 hover:bg-indigo-500"),
                  )}
                >
                  Pridať
                </button>
              </form>

              <ul className="space-y-3">
                {sorted.map((p) => (
                  <ProjectRow key={`${p.id}-${p.label}`} project={p} />
                ))}
              </ul>

              <p className={cn("mt-6 text-xs leading-relaxed", t(isDark, "text-slate-500", "text-slate-500"))}>
                ID projektu sa po vytvorení nemení. Premenovanie mení len názov. Deaktivovaný
                projekt zmizne z board filtra a rýchleho zápisu; úlohy na doske ostávajú.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
