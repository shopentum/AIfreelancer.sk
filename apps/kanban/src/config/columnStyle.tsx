import type { ReactNode } from "react";
import {
  CheckCircle2,
  Circle,
  Eye,
  PlayCircle,
} from "lucide-react";
import { t } from "@/hooks/useTheme";
import type { TaskStatus } from "@/types/task";

interface ColumnTheme {
  titleClass: string;
  iconClass: string;
  lineClass: string;
  countClass: string;
  dropBgClass: string;
}

const COLUMN_THEMES: Record<
  TaskStatus,
  { light: ColumnTheme; dark: ColumnTheme }
> = {
  Ready: {
    light: {
      titleClass: "text-blue-600",
      iconClass: "text-blue-500",
      lineClass: "bg-blue-500",
      countClass: "border-blue-200 bg-blue-50 text-blue-600",
      dropBgClass: "bg-blue-50/80",
    },
    dark: {
      titleClass: "text-blue-400",
      iconClass: "text-blue-400",
      lineClass: "bg-blue-500",
      countClass: "border-blue-800 bg-blue-950/40 text-blue-400",
      dropBgClass: "bg-blue-500/10",
    },
  },
  InProgress: {
    light: {
      titleClass: "text-orange-600",
      iconClass: "text-orange-500",
      lineClass: "bg-orange-500",
      countClass: "border-orange-200 bg-orange-50 text-orange-600",
      dropBgClass: "bg-orange-50/80",
    },
    dark: {
      titleClass: "text-orange-400",
      iconClass: "text-orange-400",
      lineClass: "bg-orange-500",
      countClass: "border-orange-800 bg-orange-950/40 text-orange-400",
      dropBgClass: "bg-orange-500/10",
    },
  },
  ReadyToReview: {
    light: {
      titleClass: "text-violet-600",
      iconClass: "text-violet-500",
      lineClass: "bg-violet-500",
      countClass: "border-violet-200 bg-violet-50 text-violet-600",
      dropBgClass: "bg-violet-50/80",
    },
    dark: {
      titleClass: "text-violet-400",
      iconClass: "text-violet-400",
      lineClass: "bg-violet-500",
      countClass: "border-violet-800 bg-violet-950/40 text-violet-400",
      dropBgClass: "bg-violet-500/10",
    },
  },
  Done: {
    light: {
      titleClass: "text-emerald-600",
      iconClass: "text-emerald-500",
      lineClass: "bg-emerald-500",
      countClass: "border-emerald-200 bg-emerald-50 text-emerald-600",
      dropBgClass: "bg-emerald-50/80",
    },
    dark: {
      titleClass: "text-emerald-400",
      iconClass: "text-emerald-400",
      lineClass: "bg-emerald-500",
      countClass: "border-emerald-800 bg-emerald-950/40 text-emerald-400",
      dropBgClass: "bg-emerald-500/10",
    },
  },
};

export function getColumnTheme(status: TaskStatus, isDark: boolean): ColumnTheme {
  const pair = COLUMN_THEMES[status];
  return t(isDark, pair.light, pair.dark);
}

export function getColumnIcon(status: TaskStatus, size = 16): ReactNode {
  const props = { size, "aria-hidden": true as const };
  switch (status) {
    case "Ready":
      return <Circle {...props} />;
    case "InProgress":
      return <PlayCircle {...props} />;
    case "ReadyToReview":
      return <Eye {...props} />;
    case "Done":
      return <CheckCircle2 {...props} />;
  }
}
