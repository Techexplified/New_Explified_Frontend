import React, { useState } from "react";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import UpdatedDashboard2 from "../components/UpdatedDashboard2";

export default function LexicalEditor() {
  const [isDark, setIsDark] = useState(true); // true = dark, false = light

  return (
    <div className="relative min-h-screen">
      {/* Theme Toggle Switch */}
      
      <div
        className={`absolute top-4 right-4 w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isDark ? "bg-gray-700" : "bg-yellow-300"
        }`}
        onClick={() => setIsDark(!isDark)}
      >
        {/* Sun/Moon circle */}
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
            isDark ? "translate-x-0" : "translate-x-8"
          } flex items-center justify-center`}
        >
          {isDark ? (
            // Moon
            <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          ) : (
            // Sun
            <div className="w-3 h-3 bg-yellow-600 rounded-full" />
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Canvas with dynamic background */}
      <Canvas bgColor={isDark ? "black" : "white"} />
    </div>
  );
}
