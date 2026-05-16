import type { ReactNode } from "react";
import {
  Brain,
  Briefcase,
  Inbox,
  Layout,
  User,
  Wallet,
} from "lucide-react";
import { t } from "@/hooks/useTheme";

export function getProjectIcon(projectId: string, size = 14): ReactNode {
  const props = { size, "aria-hidden": true as const };
  switch (projectId) {
    case "index":
      return <Inbox {...props} />;
    case "shopentum":
      return <Layout {...props} />;
    case "nmh":
      return <Briefcase {...props} />;
    case "aiworks":
      return <Brain {...props} />;
    case "finance":
      return <Wallet {...props} />;
    case "personal":
      return <User {...props} />;
    default:
      return <Inbox {...props} />;
  }
}

/** Badge on task cards (light + dark variants). */
export function getProjectBadgeClass(
  projectId: string,
  isDark: boolean,
): string {
  const map: Record<string, [string, string]> = {
    index: [
      "bg-slate-100 text-slate-600 border-slate-200",
      "bg-slate-800 text-slate-400 border-slate-700",
    ],
    shopentum: [
      "bg-indigo-50 text-indigo-600 border-indigo-200",
      "bg-indigo-950/50 text-indigo-400 border-indigo-800",
    ],
    nmh: [
      "bg-blue-50 text-blue-600 border-blue-200",
      "bg-blue-950/50 text-blue-400 border-blue-800",
    ],
    aiworks: [
      "bg-purple-50 text-purple-600 border-purple-200",
      "bg-purple-950/50 text-purple-400 border-purple-800",
    ],
    finance: [
      "bg-emerald-50 text-emerald-600 border-emerald-200",
      "bg-emerald-950/50 text-emerald-400 border-emerald-800",
    ],
    personal: [
      "bg-amber-50 text-amber-600 border-amber-200",
      "bg-amber-950/50 text-amber-400 border-amber-800",
    ],
  };
  const pair = map[projectId] ?? map.index;
  return t(isDark, pair[0], pair[1]);
}

/** Left accent stripe on task cards. */
export function getProjectStripeClass(
  projectId: string,
  isDark: boolean,
): string {
  const map: Record<string, [string, string]> = {
    index: ["bg-slate-400", "bg-slate-500"],
    shopentum: ["bg-indigo-500", "bg-indigo-500"],
    nmh: ["bg-blue-500", "bg-blue-500"],
    aiworks: ["bg-purple-500", "bg-purple-500"],
    finance: ["bg-emerald-500", "bg-emerald-500"],
    personal: ["bg-amber-500", "bg-amber-500"],
  };
  const pair = map[projectId] ?? map.index;
  return t(isDark, pair[0], pair[1]);
}
