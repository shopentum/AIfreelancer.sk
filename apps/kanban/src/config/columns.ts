import type { TaskStatus } from "@/types/task";

export interface ColumnDefinition {
  status: TaskStatus;
  title: string;
  accentClass: string;
  headerBorderClass: string;
}

export const KANBAN_COLUMNS: ColumnDefinition[] = [
  {
    status: "Ready",
    title: "Ready",
    accentClass: "text-blue-400",
    headerBorderClass: "border-blue-500/50",
  },
  {
    status: "InProgress",
    title: "In Progress",
    accentClass: "text-orange-400",
    headerBorderClass: "border-orange-500/50",
  },
  {
    status: "ReadyToReview",
    title: "Ready to Review",
    accentClass: "text-violet-400",
    headerBorderClass: "border-violet-500/50",
  },
  {
    status: "Done",
    title: "Done",
    accentClass: "text-emerald-400",
    headerBorderClass: "border-emerald-500/50",
  },
];
