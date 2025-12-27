// client/src/components/Toolbar.jsx
import React from "react";

export default function Toolbar({ onExport, onGenerate, loading, status }) {
  return (
    <div className="toolbar">
      <button onClick={onGenerate} className="small" disabled={loading}>{loading ? "Generating..." : "Generate"}</button>
      <button onClick={onExport} style={{ background: "#059669" }}>Export PPTX</button>
      <div className="small-muted">{status}</div>
    </div>
  );
}
