import React, { useState } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import UpdatedDashboard2 from "../components/UpdatedDashboard2";
import { useStore } from "../store";

export default function LexicalEditor() {
  const [isDark, setIsDark] = useState(true); // true = dark, false = light
  const shapes = useStore((s) => s.shapes);
  const updateShape = useStore((s) => s.updateShape);

  // 🌗 Theme toggle
  const handleToggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    // Update only eraser strokes
    shapes.forEach((shape) => {
      if (shape.isEraser) {
        updateShape(shape.id, { color: newDark ? "#000000" : "#ffffff" });
      }
    });
  };

  return (
    <div
      className={`relative min-h-screen flex flex-col ${
        isDark ? "bg-black" : "bg-white"
      }`}
    >
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-50">
        <UpdatedDashboard2 isDark={isDark} setIsDark={handleToggleTheme} />
      </div>

      {/* Main Content Area — push down below header */}
      <div className="pt-[80px] flex-1 flex flex-col items-center">
        {/* Toolbar */}
        <div className="mb-4">
          <Toolbar />
        </div>

        {/* Canvas */}
        <div
          className={`shadow-lg rounded-md ${
            isDark ? "bg-black" : "bg-white"
          }`}
          style={{
            width: "800px",
            height: "600px",
          }}
        >
          <Canvas isDark={isDark} bgColor={isDark ? "#1a1a1a" : "#ffffff"} />
        </div>
      </div>
    </div>
  );
}
