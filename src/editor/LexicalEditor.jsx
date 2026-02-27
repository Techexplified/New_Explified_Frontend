import React, { useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import UpdatedDashboard2 from "../components/UpdatedDashboard2";
import { useStore } from "../store";
import RightSidebar from "./RightSidebar";


export default function LexicalEditor() {
  const shapes = useStore((s) => s.shapes);
  const updateShape = useStore((s) => s.updateShape);
  const theme = useStore((s) => s.theme);

  const [isShareOpen, setIsShareOpen] = useState(false);

  // Load active note ID from localStorage on mount
  const setCurrentNoteId = useStore((s) => s.setCurrentNoteId);
  useEffect(() => {
    const activeNote = JSON.parse(localStorage.getItem("selectedNote"));
    if (activeNote && activeNote.id) {
      setCurrentNoteId(activeNote.id);
    } else {
      // Generate a temporary ID if none exists to prevent collision
      setCurrentNoteId("temp_session_" + Date.now());
    }
  }, [setCurrentNoteId]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div
      className={`relative h-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#0f0f0f]' : 'bg-white'}`}
    >
      <UpdatedDashboard2
        isDark={theme === 'dark'}
        setIsDark={(isDark) => useStore.getState().setTheme(isDark ? 'dark' : 'light')}
        onShareOpen={() => setIsShareOpen(true)}
        onShareClose={() => setIsShareOpen(false)}
      />

      <div
        className={`flex-1 relative w-full h-full overflow-hidden transition-all duration-300 ${isShareOpen ? "blur-md pointer-events-none" : ""}`}
      >
        <Toolbar />
        <Canvas bgColor={theme === 'dark' ? '#1a1a1a' : '#ffffff'} />
        <RightSidebar />
      </div>
    </div>
  );
}
