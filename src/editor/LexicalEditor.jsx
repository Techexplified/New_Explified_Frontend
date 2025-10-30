import React, { useState } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import UpdatedDashboard2 from "../components/UpdatedDashboard2";
import { useStore } from "../store";
import RightSidebar from "./RightSidebar";

export default function LexicalEditor() {
  const shapes = useStore((s) => s.shapes);
  const updateShape = useStore((s) => s.updateShape);

  // 👇 new state to track share overlay visibility
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      {/* Header (UpdatedDashboard2) */}
      <UpdatedDashboard2
        onShareOpen={() => setIsShareOpen(true)}
        onShareClose={() => setIsShareOpen(false)}
      />

      {/* Blur everything below header when share is open */}
      <div
        className={`pt-[100px] flex-1 flex flex-col items-center transition-all duration-300 ${
          isShareOpen ? "blur-md pointer-events-none" : ""
        }`}
      >
        {/* Toolbar */}
        <div className="mb-4">
          <Toolbar />
        </div>

        {/* Canvas */}
        <div className="shadow-lg rounded-md bg-white">
          <Canvas bgColor="#ffffff" />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
