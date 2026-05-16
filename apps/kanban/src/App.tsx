import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { KanbanProvider } from "@/hooks/useKanbanStore";
import { ThemeProvider } from "@/hooks/useTheme";
import { ArchivePage } from "@/pages/ArchivePage";
import { BoardPage } from "@/pages/BoardPage";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <KanbanProvider>
          <Routes>
            <Route path="/" element={<BoardPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </KanbanProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
