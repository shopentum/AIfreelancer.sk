import { FormEvent, useState } from "react";
import { DEFAULT_PROJECT_ID, PROJECTS } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";

export function BrainDump() {
  const { addTask } = useKanban();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [project, setProject] = useState(DEFAULT_PROJECT_ID);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    addTask(trimmedTitle, project || DEFAULT_PROJECT_ID, summary.trim());
    setTitle("");
    setSummary("");
  }

  return (
    <form
      onSubmit={submit}
      className="kanban-panel flex flex-col gap-3 lg:flex-row lg:items-end"
    >
      <div className="flex-1 min-w-[140px]">
        <label htmlFor="brain-summary" className="kanban-label">
          Summary (na karte)
        </label>
        <input
          id="brain-summary"
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Krátky text na kanbane…"
          className="kanban-input"
          autoComplete="off"
        />
      </div>
      <div className="flex-[1.5] min-w-[160px]">
        <label htmlFor="brain-dump" className="kanban-label">
          Názov úlohy
        </label>
        <input
          id="brain-dump"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter = uložiť"
          className="kanban-input"
          autoComplete="off"
        />
      </div>
      <div className="w-full sm:w-44">
        <label htmlFor="brain-project" className="kanban-label">
          Projekt
        </label>
        <select
          id="brain-project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="kanban-select"
        >
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="kanban-btn-primary lg:shrink-0">
        Pridať
      </button>
    </form>
  );
}
