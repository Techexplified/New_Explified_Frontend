import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store";
import {
  Lock,
  Hand,
  Square,
  Pencil,
  Type,
  Image as ImageIcon,
  Eraser,
  Trash2,
} from "lucide-react";

const tooltipStyles = {
  position: "absolute",
  left: "calc(100% + 12px)",
  top: "50%",
  transform: "translateY(-50%)",
  background: "var(--tooltip-bg)",
  color: "var(--tooltip-text)",
  padding: "6px 12px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: "500",
  whiteSpace: "nowrap",
  boxShadow: "var(--shadow)",
  zIndex: 100,
  pointerEvents: "none",
};

function ToolButton({ id, icon, label, isActive, onClick, showDivider }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      {showDivider && (
        <div
          style={{
            height: "1px",
            width: "28px",
            background: "var(--panel-border)",
            margin: "4px 0",
          }}
        />
      )}
      <div style={{ position: "relative" }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: isActive ? "var(--toolbar-active)" : "transparent",
            color: isActive ? "#ffffff" : "var(--text-secondary)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = "var(--toolbar-hover)";
              e.currentTarget.style.color = "var(--text-primary)";
            }
          }}
          onMouseOut={(e) => {
            if (!isActive) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }
          }}
        >
          {icon}
        </motion.button>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              transition={{ duration: 0.15 }}
              style={tooltipStyles}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default function Toolbar() {
  const setTool = useStore((s) => s.setTool);
  const selectedTool = useStore((s) => s.selectedTool);
  const setShapeType = useStore((s) => s.setShapeType);

  const tools = [
    { id: "lock", icon: <Lock size={18} />, label: "Lock Canvas" },
    { id: "hand", icon: <Hand size={18} />, label: "Pan Canvas", dividerBefore: true },
    { id: "square", icon: <Square size={18} />, label: "Add Shapes" },
    { id: "pencil", icon: <Pencil size={18} />, label: "Free Draw" },
    { id: "text", icon: <Type size={18} />, label: "Add Text" },
    { id: "image", icon: <ImageIcon size={18} />, label: "Upload Image" },
    { id: "eraser", icon: <Eraser size={18} />, label: "Eraser" },
  ];

  const handleToolSelect = (toolId) => {
    if (toolId === "hand") {
      setTool("pan");
      return;
    }

    if (["square", "diamond", "circle", "arrow", "line"].includes(toolId)) {
      setTool("shape");
      setShapeType(toolId);
      return;
    }

    if (toolId === "pencil") {
      setTool("freehand");
      return;
    }

    setTool(toolId);
  };

  const isToolActive = (toolId) => {
    if (toolId === "hand" && selectedTool === "pan") return true;
    if (toolId === "pencil" && selectedTool === "freehand") return true;
    if (toolId === "square" && selectedTool === "shape") return true;
    return selectedTool === toolId;
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "16px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{
          pointerEvents: "auto",
          background: "var(--toolbar-bg)",
          borderRadius: "16px",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--panel-border)",
        }}
      >
        {tools.map((tool) => (
          <ToolButton
            key={tool.id}
            id={tool.id}
            icon={tool.icon}
            label={tool.label}
            isActive={isToolActive(tool.id)}
            onClick={() => handleToolSelect(tool.id)}
            showDivider={tool.dividerBefore}
          />
        ))}

        <div
          style={{
            height: "1px",
            width: "28px",
            background: "var(--panel-border)",
            margin: "4px 0",
          }}
        />

        <ToolButton
          id="clear"
          icon={<Trash2 size={18} />}
          label="Clear Canvas"
          isActive={false}
          onClick={() => {
            useStore.setState({ shapes: [] });
            localStorage.removeItem("canvasShapes");
            localStorage.removeItem("canvasNotes");
          }}
        />
      </motion.div>
    </div>
  );
}
