import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { KanbanProvider } from "@/hooks/useKanbanStore";
import { ProjectsProvider } from "@/hooks/useProjects";
import { ThemeProvider } from "@/hooks/useTheme";
import { ArchivePage } from "@/pages/ArchivePage";
import { BoardPage } from "@/pages/BoardPage";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ProjectsProvider>
          <KanbanProvider>
            <Routes>
              <Route path="/" element={<BoardPage />} />
              <Route path="/archive" element={<ArchivePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </KanbanProvider>
        </ProjectsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
