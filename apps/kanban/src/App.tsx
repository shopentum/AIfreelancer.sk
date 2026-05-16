import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { KanbanProvider } from "@/hooks/useKanbanStore";
import { ProjectsProvider } from "@/hooks/useProjects";
import { ThemeProvider } from "@/hooks/useTheme";
import { ArchivePage } from "@/pages/ArchivePage";
import { BacklogPage } from "@/pages/BacklogPage";
import { BoardPage } from "@/pages/BoardPage";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProjectsProvider>
          <KanbanProvider>
            <Routes>
              <Route path="/" element={<BoardPage />} />
              <Route path="/backlog" element={<BacklogPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </KanbanProvider>
        </ProjectsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
