import React, { useState } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import UpdatedDashboard2 from "../components/UpdatedDashboard2";

export default function LexicalEditor() {
  const [isDark, setIsDark] = useState(true); // true = dark, false = light

  return (
    <div className="relative min-h-screen">
      {/* Header with toggle inside */}
      <UpdatedDashboard2 isDark={isDark} setIsDark={setIsDark} />

      {/* Toolbar */}
      <Toolbar />

      {/* Canvas with dynamic background */}
      <Canvas bgColor={isDark ? "black" : "white"} />
    </div>
  );
}
