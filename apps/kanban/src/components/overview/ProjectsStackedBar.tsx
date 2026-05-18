import {
  OVERVIEW_CHART_STATUSES,
  OVERVIEW_STATUS_LABELS,
  slicePercent,
  type ProjectOverviewRow,
} from "@/domain/overviewAggregation";
import { OVERVIEW_CHART_COLORS } from "@/config/overviewChartColors";
import { formatDuration } from "@/lib/formatters";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ProjectsStackedBarProps {
  projects: ProjectOverviewRow[];
  getLabel: (projectId: string) => string;
}

export function ProjectsStackedBar({ projects, getLabel }: ProjectsStackedBarProps) {
  const { isDark } = useTheme();
  const withTime = projects.filter((p) => p.totalSeconds > 0);

  if (withTime.length === 0) {
    return (
      <p className={cn("py-6 text-center text-sm", t(isDark, "text-slate-400", "text-slate-500"))}>
        Žiadne tracknuté hodiny pre zobrazené projekty.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {withTime.map((row) => (
          <li key={row.projectId} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span
                className={cn(
                  "font-bold uppercase tracking-widest",
                  t(isDark, "text-slate-700", "text-slate-300"),
                )}
              >
                {getLabel(row.projectId)}
              </span>
              <span
                className={cn(
                  "font-mono font-semibold tabular-nums",
                  t(isDark, "text-slate-500", "text-slate-400"),
                )}
              >
                {formatDuration(row.totalSeconds)}
              </span>
            </div>
            <div
              className={cn(
                "flex h-8 w-full overflow-hidden rounded-xl",
                t(isDark, "bg-slate-100", "bg-slate-800/80"),
              )}
              title={OVERVIEW_CHART_STATUSES.map((status) => {
                const slice = row.byStatus.find((s) => s.status === status);
                if (!slice?.seconds) return "";
                return `${OVERVIEW_STATUS_LABELS[status]}: ${formatDuration(slice.seconds)}`;
              })
                .filter(Boolean)
                .join(" · ")}
            >
              {OVERVIEW_CHART_STATUSES.map((status) => {
                const slice = row.byStatus.find((s) => s.status === status);
                const seconds = slice?.seconds ?? 0;
                if (seconds <= 0) return null;
                return (
                  <div
                    key={status}
                    className="h-full min-w-0"
                    style={{
                      width: `${slicePercent(seconds, row.totalSeconds)}%`,
                      backgroundColor: OVERVIEW_CHART_COLORS[status],
                    }}
                  />
                );
              })}
            </div>
          </li>
        ))}
      </ul>
      <ul
        className={cn(
          "flex flex-wrap justify-center gap-x-4 gap-y-1 border-t pt-3 text-[10px] font-semibold",
          t(isDark, "border-slate-100 text-slate-500", "border-slate-800 text-slate-400"),
        )}
      >
        {OVERVIEW_CHART_STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: OVERVIEW_CHART_COLORS[status] }}
            />
            {OVERVIEW_STATUS_LABELS[status]}
          </li>
        ))}
      </ul>
    </div>
  );
}
