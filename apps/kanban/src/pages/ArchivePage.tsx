import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { getTaskCardLabel } from "@/lib/formatters";
import { useProjects } from "@/hooks/useProjects";
import { usePageTitle } from "@/hooks/usePageTitle";
import { t, useTheme } from "@/hooks/useTheme";
import {
  formatDuration,
  formatSkDateTime,
  getDisplayTrackedSeconds,
} from "@/lib/formatters";
import {
  addCalendarDaysBratislava,
  firstDayOfMonthKeyFromToday,
  isoToBratislavaDateKey,
  todayBratislavaDateKey,
} from "@/lib/archiveDateFilter";
import { taskRepository } from "@/repositories";
import { cn } from "@/lib/utils";
import type { ArchivedTask, ArchivesByProject } from "@/types/task";

function flattenArchives(archives: ArchivesByProject): ArchivedTask[] {
  return Object.values(archives).flat();
}

type ProjectArchiveFilter = "all" | string;

export function ArchivePage() {
  usePageTitle("Archív");
  const { isDark } = useTheme();
  const { filterProjects, getLabel } = useProjects();
  const [searchParams, setSearchParams] = useSearchParams();

  const [archives] = useState<ArchivesByProject>(() =>
    taskRepository.loadArchives(),
  );
  const [projectFilter, setProjectFilter] = useState<ProjectArchiveFilter>(
    () => searchParams.get("project") || "all",
  );
  const [dateFrom, setDateFrom] = useState(
    () => searchParams.get("from") ?? "",
  );
  const [dateTo, setDateTo] = useState(() => searchParams.get("to") ?? "");

  useEffect(() => {
    const next = new URLSearchParams();
    if (projectFilter !== "all") next.set("project", projectFilter);
    if (dateFrom) next.set("from", dateFrom);
    if (dateTo) next.set("to", dateTo);
    setSearchParams(next, { replace: true });
  }, [projectFilter, dateFrom, dateTo, setSearchParams]);

  const allItems = useMemo(
    () =>
      flattenArchives(archives).sort((a, b) =>
        b.archivedAt.localeCompare(a.archivedAt),
      ),
    [archives],
  );

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      if (projectFilter !== "all" && item.project !== projectFilter) {
        return false;
      }
      const dayKey = isoToBratislavaDateKey(item.archivedAt);
      if (dateFrom && dayKey < dateFrom) return false;
      if (dateTo && dayKey > dateTo) return false;
      return true;
    });
  }, [allItems, projectFilter, dateFrom, dateTo]);

  const sumSeconds = useMemo(
    () =>
      filtered.reduce((acc, item) => acc + getDisplayTrackedSeconds(item), 0),
    [filtered],
  );

  const today = todayBratislavaDateKey();

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

  return (
    <AppShell title="Archív" subtitle="Dokončené úlohy" showBrainDump={false}>
      <div
        className={cn(
          "mb-6 space-y-4 rounded-2xl border p-5 shadow-sm",
          t(isDark, "border-slate-200 bg-white", "border-slate-800 bg-slate-900/50"),
        )}
      >
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
            Vymazať dátum
          </button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
          <div className="min-w-[160px] flex-1">
            <label htmlFor="arch-project" className={labelClass}>
              Projekt
            </label>
            <select
              id="arch-project"
              value={projectFilter}
              onChange={(e) =>
                setProjectFilter(e.target.value as ProjectArchiveFilter)
              }
              className={inputClass}
            >
              <option value="all">Všetky</option>
              {filterProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                  {!p.active ? " (neaktívny)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="arch-from" className={labelClass}>
              Archivované od
            </label>
            <input
              id="arch-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="arch-to" className={labelClass}>
              Archivované do
            </label>
            <input
              id="arch-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div
          className={cn(
            "rounded-2xl border px-4 py-3",
            t(
              isDark,
              "border-indigo-200 bg-indigo-50",
              "border-indigo-500/30 bg-indigo-500/10",
            ),
          )}
        >
          <p
            className={cn(
              "text-[11px] font-bold uppercase tracking-widest",
              t(isDark, "text-indigo-600", "text-indigo-300"),
            )}
          >
            Súčet vyfiltrovaného času
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-semibold tabular-nums",
              t(isDark, "text-slate-900", "text-white"),
            )}
          >
            {formatDuration(sumSeconds)}
          </p>
          <p className={cn("mt-1 text-xs", t(isDark, "text-slate-500", "text-slate-500"))}>
            {filtered.length} položiek
          </p>
        </div>
      </div>

      <div
        className={cn(
          "overflow-x-auto rounded-2xl border",
          t(isDark, "border-slate-200", "border-slate-800"),
        )}
      >
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead
            className={cn(
              "border-b text-[11px] font-bold uppercase tracking-wider",
              t(
                isDark,
                "border-slate-200 bg-slate-50 text-slate-500",
                "border-slate-800 bg-slate-900/50 text-slate-500",
              ),
            )}
          >
            <tr>
              <th className="px-4 py-3">Summary</th>
              <th className="px-4 py-3">Názov</th>
              <th className="px-4 py-3">Projekt</th>
              <th className="px-4 py-3">Čas</th>
              <th className="px-4 py-3">Archivované</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={cn(
                    "px-4 py-12 text-center",
                    t(isDark, "text-slate-400", "text-slate-500"),
                  )}
                >
                  Žiadne položky podľa filtra.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b last:border-0",
                    t(
                      isDark,
                      "border-slate-100 hover:bg-slate-50",
                      "border-slate-800/50 hover:bg-white/[0.02]",
                    ),
                  )}
                >
                  <td
                    className={cn(
                      "max-w-[200px] truncate px-4 py-3 font-medium",
                      t(isDark, "text-slate-900", "text-white"),
                    )}
                  >
                    {getTaskCardLabel(item)}
                  </td>
                  <td
                    className={cn(
                      "max-w-[200px] truncate px-4 py-3",
                      t(isDark, "text-slate-500", "text-slate-400"),
                    )}
                  >
                    {item.title}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3",
                      t(isDark, "text-slate-500", "text-slate-400"),
                    )}
                  >
                    {getLabel(item.project)}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 tabular-nums",
                      t(isDark, "text-slate-700", "text-slate-300"),
                    )}
                  >
                    {formatDuration(getDisplayTrackedSeconds(item))}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-3 tabular-nums",
                      t(isDark, "text-slate-500", "text-slate-400"),
                    )}
                  >
                    {formatSkDateTime(item.archivedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
