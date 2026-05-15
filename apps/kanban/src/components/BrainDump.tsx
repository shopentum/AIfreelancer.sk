import { FormEvent, useState } from "react";
import { DEFAULT_PROJECT_ID, PROJECTS } from "@/config/projects";
import { useKanban } from "@/hooks/useKanbanStore";

export function BrainDump() {
  const { addTask } = useKanban();
  const [title, setTitle] = useState("");
  const [project, setProject] = useState(DEFAULT_PROJECT_ID);

  function submit(e?: FormEvent) {
    e?.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    addTask(trimmed, project || DEFAULT_PROJECT_ID);
    setTitle("");
  }

  return (
    <form
      onSubmit={submit}
      className="kanban-panel flex flex-col gap-3 sm:flex-row sm:items-center"
    >
      <div className="flex-1">
        <label htmlFor="brain-dump" className="kanban-label">
          Brain dump
        </label>
        <input
          id="brain-dump"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nová úloha… Enter = uložiť"
          className="kanban-input"
          autoComplete="off"
        />
      </div>
      <div className="sm:w-44">
        <label htmlFor="brain-project" className="kanban-label">
          Projekt
        </label>
        <select
          id="brain-project"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="kanban-input"
        >
          {PROJECTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="kanban-btn-primary sm:self-end">
        Pridať
      </button>
    </form>
  );
}
