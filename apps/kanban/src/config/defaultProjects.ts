/** Inbox / capture — only on /backlog, hidden from board "Všetky projekty". */
export const BACKLOG_PROJECT_ID = "backlog";

/** @deprecated Migrated to backlog on load. */
export const LEGACY_INDEX_PROJECT_ID = "index";

export const DEFAULT_PROJECT_ID = BACKLOG_PROJECT_ID;

export const DEFAULT_SEED_PROJECTS: { id: string; label: string }[] = [
  { id: BACKLOG_PROJECT_ID, label: "Backlog" },
  { id: "shopentum", label: "Shopentum" },
  { id: "nmh", label: "NMH" },
  { id: "aiworks", label: "IZY VAPE" },
  { id: "finance", label: "PRUSA FINANCE" },
  { id: "personal", label: "Personal" },
];
