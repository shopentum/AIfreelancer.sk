import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Sparkles } from "lucide-react";
import { t } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface TaskDetailAiSummaryProps {
  aiSummaryOpen: boolean;
  setAiSummaryOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  aiSummaryDraft: string;
  setAiSummaryDraft: (value: string) => void;
  aiSummaryPreview: string;
  scheduleAiSummarySave: (value: string) => void;
  flushAiSummarySave: () => void;
  labelClass: string;
  isDark: boolean;
}

export function TaskDetailAiSummary({
  aiSummaryOpen,
  setAiSummaryOpen,
  aiSummaryDraft,
  setAiSummaryDraft,
  aiSummaryPreview,
  scheduleAiSummarySave,
  flushAiSummarySave,
  labelClass,
  isDark,
}: TaskDetailAiSummaryProps) {
  return (
    <div className="pb-2">
      <button
        type="button"
        onClick={() => setAiSummaryOpen((o) => !o)}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
          t(
            isDark,
            "border-indigo-200/80 bg-indigo-50/60 hover:bg-indigo-50",
            "border-indigo-500/25 bg-indigo-500/10 hover:bg-indigo-500/15",
          ),
        )}
        aria-expanded={aiSummaryOpen}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Sparkles
            size={16}
            className={t(isDark, "text-indigo-600", "text-indigo-400")}
            aria-hidden
          />
          <span className={labelClass}>AI summary</span>
        </span>
        <span className="flex min-w-0 shrink-0 items-center gap-2">
          {!aiSummaryOpen && aiSummaryPreview && (
            <span
              className={cn(
                "max-w-[12rem] truncate text-[11px] font-medium normal-case tracking-normal",
                t(isDark, "text-indigo-700/80", "text-indigo-300/90"),
              )}
            >
              {aiSummaryPreview}
            </span>
          )}
          <ChevronDown
            size={18}
            className={cn(
              "shrink-0 transition-transform",
              aiSummaryOpen && "rotate-180",
              t(isDark, "text-indigo-500", "text-indigo-400"),
            )}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {aiSummaryOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <textarea
                value={aiSummaryDraft}
                onChange={(e) => {
                  const v = e.target.value;
                  setAiSummaryDraft(v);
                  scheduleAiSummarySave(v);
                }}
                onBlur={flushAiSummarySave}
                rows={6}
                placeholder="Kontext pre decision layer: cieľ, blokátory, ďalší krok…"
                className={cn(
                  "w-full min-h-[140px] rounded-2xl border p-4 text-sm leading-relaxed outline-none transition-all",
                  t(
                    isDark,
                    "border-indigo-200/60 bg-white text-slate-700 placeholder-slate-400 focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200",
                    "border-indigo-500/30 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:border-indigo-500/50",
                  ),
                )}
              />
              <p
                className={cn(
                  "mt-2 text-[10px] leading-relaxed",
                  t(isDark, "text-slate-400", "text-slate-500"),
                )}
              >
                Zatiaľ ručný zápis; neskôr doplníme generovanie z poznámok a aktivity.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
