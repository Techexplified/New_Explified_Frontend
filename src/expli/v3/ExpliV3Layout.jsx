import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import ExpliV3Sidebar from "./ExpliV3Sidebar";

export default function ExpliV3Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="expli-v3">
      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 60,
          display: "none", // hide on desktop
          background: "var(--expli-surface-2)",
          border: "1px solid var(--expli-border)",
          color: "var(--expli-text)",
          width: 36,
          height: 36,
          borderRadius: 10,
          fontSize: 18,
          cursor: "pointer",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="expli-v3-mobile-menu"
      >
        ☰
      </button>

      <ExpliV3Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <Outlet />

      {/* Extra style for mobile */}
      <style>{`
        @media (max-width: 768px) {
          .expli-v3-mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}
