import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { KanbanProvider } from "@/hooks/useKanbanStore";
import { ArchivePage } from "@/pages/ArchivePage";
import { BoardPage } from "@/pages/BoardPage";

export function App() {
  return (
    <BrowserRouter>
      <KanbanProvider>
        <div className="min-h-screen bg-slate-950">
          <Routes>
            <Route path="/" element={<BoardPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </KanbanProvider>
    </BrowserRouter>
  );
}
