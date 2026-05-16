export interface Project {
  id: string;
  label: string;
  active: boolean;
  createdAt: string;
  archivedAt?: string | null;
}
