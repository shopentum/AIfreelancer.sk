import {
  buildConicGradient,
  OVERVIEW_STATUS_LABELS,
  type StatusTimeSlice,
} from "@/domain/overviewAggregation";
import { OVERVIEW_CHART_COLORS } from "@/config/overviewChartColors";
import { formatDuration } from "@/lib/formatters";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface ProjectDonutChartProps {
  slices: StatusTimeSlice[];
  totalSeconds: number;
  size?: number;
}

export function ProjectDonutChart({
  slices,
  totalSeconds,
  size = 120,
}: ProjectDonutChartProps) {
  const { isDark } = useTheme();
  const gradient = buildConicGradient(slices, OVERVIEW_CHART_COLORS);
  const active = slices.filter((s) => s.seconds > 0);
  const hole = Math.round(size * 0.58);

  if (!gradient || totalSeconds <= 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full border-2 border-dashed",
          t(isDark, "border-slate-200 text-slate-400", "border-slate-700 text-slate-500"),
        )}
        style={{ width: size, height: size }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Bez času
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div
          className="h-full w-full rounded-full"
          style={{ background: gradient }}
          role="img"
          aria-label={`Rozdelenie času: ${active
            .map((s) => `${OVERVIEW_STATUS_LABELS[s.status]} ${formatDuration(s.seconds)}`)
            .join(", ")}`}
        />
        <div
          className={cn(
            "absolute inset-0 m-auto flex flex-col items-center justify-center rounded-full",
            t(isDark, "bg-white", "bg-slate-900"),
          )}
          style={{ width: hole, height: hole }}
        >
          <span
            className={cn(
              "font-mono text-sm font-black tabular-nums",
              t(isDark, "text-slate-900", "text-white"),
            )}
          >
            {formatDuration(totalSeconds)}
          </span>
        </div>
      </div>
      <ul className="flex w-full flex-wrap justify-center gap-x-3 gap-y-1">
        {active.map((slice) => (
          <li
            key={slice.status}
            className={cn(
              "flex items-center gap-1.5 text-[10px] font-semibold",
              t(isDark, "text-slate-600", "text-slate-400"),
            )}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: OVERVIEW_CHART_COLORS[slice.status] }}
            />
            <span>{OVERVIEW_STATUS_LABELS[slice.status]}</span>
            <span className="font-mono tabular-nums opacity-80">
              {formatDuration(slice.seconds)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
