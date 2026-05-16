import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { getTaskCardLabel } from "@/lib/formatters";
import { PROJECTS, getProjectLabel } from "@/config/projects";
import { usePageTitle } from "@/hooks/usePageTitle";
import { formatDuration, formatSkDateTime, getDisplayTrackedSeconds } from "@/lib/formatters";
import {
  addCalendarDaysBratislava,
  firstDayOfMonthKeyFromToday,
  isoToBratislavaDateKey,
  todayBratislavaDateKey,
} from "@/lib/archiveDateFilter";
import { taskRepository } from "@/repositories";
import type { ArchivedTask, ArchivesByProject } from "@/types/task";

function flattenArchives(archives: ArchivesByProject): ArchivedTask[] {
  return Object.values(archives).flat();
}

type ProjectArchiveFilter = "all" | string;

export function ArchivePage() {
  usePageTitle("Archív");
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
    return allItems.filter((t) => {
      if (projectFilter !== "all" && t.project !== projectFilter) {
        return false;
      }
      const dayKey = isoToBratislavaDateKey(t.archivedAt);
      if (dateFrom && dayKey < dateFrom) return false;
      if (dateTo && dayKey > dateTo) return false;
      return true;
    });
  }, [allItems, projectFilter, dateFrom, dateTo]);

  const sumSeconds = useMemo(
    () =>
      filtered.reduce(
        (acc, t) => acc + getDisplayTrackedSeconds(t),
        0,
      ),
    [filtered],
  );

  const today = todayBratislavaDateKey();

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8">
      <PageHeader title="Archív" />

      <div className="kanban-panel mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
            onClick={() => {
              setDateFrom(today);
              setDateTo(today);
            }}
          >
            Dnes
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
            onClick={() => {
              setDateFrom(addCalendarDaysBratislava(today, -6));
              setDateTo(today);
            }}
          >
            7 dní
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
            onClick={() => {
              setDateFrom(firstDayOfMonthKeyFromToday(today));
              setDateTo(today);
            }}
          >
            Tento mesiac
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
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
            <label htmlFor="arch-project" className="kanban-label">
              Projekt
            </label>
            <select
              id="arch-project"
              value={projectFilter}
              onChange={(e) =>
                setProjectFilter(e.target.value as ProjectArchiveFilter)
              }
              className="kanban-select"
            >
              <option value="all">Všetky</option>
              {PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="arch-from" className="kanban-label">
              Archivované od
            </label>
            <input
              id="arch-from"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="kanban-input"
            />
          </div>
          <div>
            <label htmlFor="arch-to" className="kanban-label">
              Archivované do
            </label>
            <input
              id="arch-to"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="kanban-input"
            />
          </div>
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-300">
            Súčet vyfiltrovaného času
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
            {formatDuration(sumSeconds)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {filtered.length} položiek
            {filtered.length === 0 ? " · zobrazuje sa 0m" : ""}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-slate-500">
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
                  className="px-4 py-12 text-center text-slate-500"
                >
                  Žiadne položky podľa filtra.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="max-w-[200px] truncate px-4 py-3 font-medium text-white">
                    {getTaskCardLabel(t)}
                  </td>
                  <td className="max-w-[200px] truncate px-4 py-3 text-slate-400">
                    {t.title}
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {getProjectLabel(t.project)}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-300">
                    {formatDuration(getDisplayTrackedSeconds(t))}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-slate-400">
                    {formatSkDateTime(t.archivedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
