import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface TaskManualTimeAddProps {
  onAdjust: (minutes: number) => void;
  disabled?: boolean;
}

export function TaskManualTimeAdd({ onAdjust, disabled }: TaskManualTimeAddProps) {
  const { isDark } = useTheme();
  const [minutesInput, setMinutesInput] = useState("");

  function parsedMinutes(): number | null {
    const parsed = Number.parseInt(minutesInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return null;
    return parsed;
  }

  function apply(deltaSign: 1 | -1) {
    const minutes = parsedMinutes();
    if (minutes === null) return;
    onAdjust(deltaSign * minutes);
    setMinutesInput("");
  }

  const canSubmit = !disabled && parsedMinutes() !== null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "shrink-0 text-[10px] font-bold uppercase tracking-widest",
            t(isDark, "text-slate-500", "text-slate-400"),
          )}
        >
          Pridať
        </span>
        <input
          type="number"
          min={1}
          max={9999}
          step={1}
          value={minutesInput}
          onChange={(e) => setMinutesInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              apply(1);
            }
          }}
          placeholder="min"
          disabled={disabled}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center font-mono text-sm tabular-nums text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400"
          aria-label="Minúty"
        />
        <span
          className={cn(
            "shrink-0 text-xs font-medium",
            t(isDark, "text-slate-500", "text-slate-400"),
          )}
        >
          min
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => apply(1)}
          className={cn(
            "flex h-10 flex-1 items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-40",
            t(
              isDark,
              "bg-slate-800 text-slate-200 hover:bg-slate-700",
              "bg-slate-900 text-white hover:bg-slate-800",
            ),
          )}
          aria-label="Pridať minúty"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => apply(-1)}
          className={cn(
            "flex h-10 flex-1 items-center justify-center rounded-xl border transition-all active:scale-95 disabled:opacity-40",
            t(
              isDark,
              "border-slate-600 bg-slate-800/80 text-slate-300 hover:bg-slate-700",
              "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ),
          )}
          aria-label="Odobrať minúty"
        >
          <Minus size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
