import { useState } from "react";
import { Plus } from "lucide-react";
import { t, useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface TaskManualTimeAddProps {
  onAdd: (minutes: number) => void;
  disabled?: boolean;
}

export function TaskManualTimeAdd({ onAdd, disabled }: TaskManualTimeAddProps) {
  const { isDark } = useTheme();
  const [minutesInput, setMinutesInput] = useState("");

  function submit() {
    const parsed = Number.parseInt(minutesInput, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) return;
    onAdd(parsed);
    setMinutesInput("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-wrap items-center gap-2 border-t pt-4"
      style={{
        borderColor: isDark ? "rgba(30,41,59,0.8)" : "rgba(241,245,249,1)",
      }}
    >
      <span
        className={cn(
          "text-[10px] font-bold uppercase tracking-widest",
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
        placeholder="min"
        disabled={disabled}
        className={cn(
          "w-20 rounded-xl border px-3 py-2 text-center font-mono text-sm tabular-nums outline-none transition-all",
          t(
            isDark,
            "border-slate-700 bg-slate-800 text-white placeholder-slate-600 focus:border-indigo-500",
            "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-slate-400",
          ),
        )}
        aria-label="Minúty na pridanie"
      />
      <span
        className={cn(
          "text-xs font-medium",
          t(isDark, "text-slate-500", "text-slate-400"),
        )}
      >
        min
      </span>
      <button
        type="submit"
        disabled={disabled || !minutesInput.trim()}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-40",
          t(
            isDark,
            "bg-slate-800 text-slate-200 hover:bg-slate-700",
            "bg-slate-900 text-white hover:bg-slate-800",
          ),
        )}
        aria-label="Pridať minúty"
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </form>
  );
}
