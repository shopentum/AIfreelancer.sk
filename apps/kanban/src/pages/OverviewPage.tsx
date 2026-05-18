import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProjectDonutChart } from "@/components/overview/ProjectDonutChart";
import { ProjectsStackedBar } from "@/components/overview/ProjectsStackedBar";
import { getProjectIcon } from "@/config/projectStyle";
import {
  aggregateOverview,
  collectOverviewTasks,
  type OverviewFilterInput,
} from "@/domain/overviewAggregation";
import { useKanban, type ProjectFilter } from "@/hooks/useKanbanStore";
import { useProjects } from "@/hooks/useProjects";
import { usePageTitle } from "@/hooks/usePageTitle";
import { t, useTheme } from "@/hooks/useTheme";
import {
  addCalendarDaysBratislava,
  firstDayOfMonthKeyFromToday,
  todayBratislavaDateKey,
} from "@/lib/archiveDateFilter";
import { formatDuration } from "@/lib/formatters";
import { taskRepository } from "@/repositories";
import { cn } from "@/lib/utils";

export function OverviewPage() {
  usePageTitle("Prehľad");
  const { isDark } = useTheme();
  const { tasks } = useKanban();
  const { boardProjects, getLabel } = useProjects();

  const today = todayBratislavaDateKey();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [projectId, setProjectId] = useState<ProjectFilter>("all");
  const [includeActive, setIncludeActive] = useState(true);
  const [includeArchive, setIncludeArchive] = useState(true);

  const filters: OverviewFilterInput = useMemo(
    () => ({
      dateFrom,
      dateTo,
      projectId,
      includeActive,
      includeArchive,
    }),
    [dateFrom, dateTo, projectId, includeActive, includeArchive],
  );

  const { totals, projects } = useMemo(() => {
    const archives = taskRepository.loadArchives();
    const collected = collectOverviewTasks(tasks, archives, filters);
    const orderedIds = boardProjects.map((p) => p.id);
    return aggregateOverview(collected, orderedIds);
  }, [tasks, filters, boardProjects]);

  const chipClass = cn(
    "rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
    t(
      isDark,
      "border-slate-200 text-slate-600 hover:bg-slate-50",
      "border-slate-700 text-slate-300 hover:bg-slate-800",
    ),
  );

  const inputClass = cn(
    "w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition-all",
    t(
      isDark,
      "border-slate-200 bg-slate-50 text-slate-900 focus:border-slate-300",
      "border-slate-700 bg-slate-800 text-white focus:border-indigo-500",
    ),
  );

  const labelClass = cn(
    "mb-1.5 block text-[11px] font-bold uppercase tracking-widest",
    t(isDark, "text-slate-500", "text-slate-500"),
  );

  const cardClass = cn(
    "rounded-2xl border p-4 shadow-sm sm:p-5",
    t(isDark, "border-slate-200 bg-white", "border-slate-800 bg-slate-900/50"),
  );

  const kpiClass = cn(
    "rounded-2xl border p-4",
    t(isDark, "border-slate-100 bg-slate-50", "border-slate-800 bg-slate-800/40"),
  );

  return (
    <AppShell title="Prehľad">
      <div className="space-y-6">
        <p
          className={cn(
            "text-xs leading-relaxed",
            t(isDark, "text-slate-500", "text-slate-400"),
          )}
        >
          Čas je priradený k{" "}
          <strong className={t(isDark, "text-slate-700", "text-slate-300")}>
            aktuálnemu stavu
          </strong>{" "}
          úlohy (nie k histórii v stĺpcoch). Zobrazujú sa len úlohy s tracknutým
          časom &gt; 0.
        </p>

        <div className={cn(cardClass, "space-y-4")}>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setDateFrom(today);
                setDateTo(today);
              }}
            >
              Dnes
            </button>
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setDateFrom(addCalendarDaysBratislava(today, -6));
                setDateTo(today);
              }}
            >
              7 dní
            </button>
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setDateFrom(firstDayOfMonthKeyFromToday(today));
                setDateTo(today);
              }}
            >
              Tento mesiac
            </button>
            <button
              type="button"
              className={chipClass}
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
            >
              Celé obdobie
            </button>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
            <div className="min-w-[140px] flex-1">
              <label htmlFor="ov-from" className={labelClass}>
                Od
              </label>
              <input
                id="ov-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="min-w-[140px] flex-1">
              <label htmlFor="ov-to" className={labelClass}>
                Do
              </label>
              <input
                id="ov-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="min-w-[160px] flex-1">
              <label htmlFor="ov-project" className={labelClass}>
                Projekt
              </label>
              <select
                id="ov-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value as ProjectFilter)}
                className={inputClass}
              >
                <option value="all">Všetky projekty</option>
                {boardProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2",
                t(isDark, "text-slate-600", "text-slate-400"),
              )}
            >
              <input
                type="checkbox"
                checked={includeActive}
                onChange={(e) => setIncludeActive(e.target.checked)}
                className="rounded border-slate-300"
              />
              Doska (aktívne)
            </label>
            <label
              className={cn(
                "flex cursor-pointer items-center gap-2",
                t(isDark, "text-slate-600", "text-slate-400"),
              )}
            >
              <input
                type="checkbox"
                checked={includeArchive}
                onChange={(e) => setIncludeArchive(e.target.checked)}
                className="rounded border-slate-300"
              />
              Archív
            </label>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={kpiClass}>
            <p className={labelClass}>Celkový čas</p>
            <p
              className={cn(
                "text-2xl font-black tabular-nums",
                t(isDark, "text-slate-900", "text-white"),
              )}
            >
              {formatDuration(totals.totalSeconds)}
            </p>
          </div>
          <div className={kpiClass}>
            <p className={labelClass}>Úlohy s časom</p>
            <p
              className={cn(
                "text-2xl font-black tabular-nums",
                t(isDark, "text-slate-900", "text-white"),
              )}
            >
              {totals.taskCountWithTime}
            </p>
            <p className={cn("mt-1 text-xs", t(isDark, "text-slate-400", "text-slate-500"))}>
              z {totals.taskCountAll} vo filtri
            </p>
          </div>
          <div className={kpiClass}>
            <p className={labelClass}>Rozpracované</p>
            <p className="text-2xl font-black tabular-nums text-orange-500">
              {formatDuration(totals.inProgressSeconds + totals.reviewSeconds)}
            </p>
            <p className={cn("mt-1 text-xs", t(isDark, "text-slate-400", "text-slate-500"))}>
              {totals.wipCount} úloh · In Prog. + Review
            </p>
          </div>
          <div className={kpiClass}>
            <p className={labelClass}>Hotové</p>
            <p className="text-2xl font-black tabular-nums text-emerald-500">
              {formatDuration(totals.doneSeconds)}
            </p>
            <p className={cn("mt-1 text-xs", t(isDark, "text-slate-400", "text-slate-500"))}>
              {totals.doneCount} úloh
            </p>
          </div>
        </div>

        <div className={cardClass}>
          <h2
            className={cn(
              "mb-4 text-sm font-black uppercase tracking-widest",
              t(isDark, "text-slate-800", "text-slate-200"),
            )}
          >
            Porovnanie projektov
          </h2>
          <ProjectsStackedBar projects={projects} getLabel={getLabel} />
        </div>

        <div>
          <h2
            className={cn(
              "mb-4 text-sm font-black uppercase tracking-widest",
              t(isDark, "text-slate-800", "text-slate-200"),
            )}
          >
            Podľa projektu
          </h2>
          {projects.length === 0 ? (
            <p
              className={cn(
                "rounded-2xl border py-12 text-center text-sm",
                t(isDark, "border-slate-200 text-slate-400", "border-slate-800 text-slate-500"),
              )}
            >
              Žiadne dáta pre zvolené filtre.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((row) => (
                <article key={row.projectId} className={cardClass}>
                  <div className="mb-4 flex items-center gap-2">
                    <span className="opacity-70">
                      {getProjectIcon(row.projectId, 18)}
                    </span>
                    <h3
                      className={cn(
                        "text-sm font-black uppercase tracking-widest",
                        t(isDark, "text-slate-900", "text-white"),
                      )}
                    >
                      {getLabel(row.projectId)}
                    </h3>
                  </div>
                  <ProjectDonutChart
                    slices={row.byStatus}
                    totalSeconds={row.totalSeconds}
                    size={128}
                  />
                  <p
                    className={cn(
                      "mt-3 text-center text-[10px] font-medium",
                      t(isDark, "text-slate-400", "text-slate-500"),
                    )}
                  >
                    {row.taskCountWithTime} úloh s časom · priemer{" "}
                    {row.taskCountWithTime > 0
                      ? formatDuration(
                          Math.floor(row.totalSeconds / row.taskCountWithTime),
                        )
                      : "—"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
