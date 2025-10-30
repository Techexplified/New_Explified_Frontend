import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useStore } from "../store";
import {
  Lock,
  Hand,
  MousePointer,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Image as ImageIcon,
  Eraser,
  Shapes,
  StickyNote,
  Pen,
  Brush,
  Paintbrush,
  SprayCan,
  Droplet,
  Star,
  Pentagon,
  SlidersHorizontal,
} from "lucide-react";

export default function Toolbar() {
  const setTool = useStore((s) => s.setTool);
  const addShape = useStore((s) => s.addShape);
  const selectedTool = useStore((s) => s.selectedTool);
  const setShapeType = useStore((s) => s.setShapeType);
  const freehandType = useStore((s) => s.freehandType);
  const setFreehandType = useStore((s) => s.setFreehandType);
  const freehandColor = useStore((s) => s.freehandColor);
  const setFreehandColor = useStore((s) => s.setFreehandColor);
  const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
  const setFreehandStrokeWidth = useStore((s) => s.setFreehandStrokeWidth);
  const freehandTexture = useStore((s) => s.freehandTexture);
  const setFreehandTexture = useStore((s) => s.setFreehandTexture);

  const [openMenu, setOpenMenu] = useState(null);
  const fileInputRef = useRef(null);

  // freehand texture preview
  const textureOptions = [
    { id: "solid", label: "Smooth", preview: "linear-gradient(#23b5b5,#23b5b5)" },
    { id: "rough", label: "Rough", preview: "repeating-linear-gradient(45deg,#23b5b5 0 2px,#0d1418 2px 4px)" },
    { id: "chalk", label: "Chalk", preview: "radial-gradient(circle,#23b5b5 20%,transparent 20%)" },
    { id: "spray", label: "Spray", preview: "radial-gradient(circle,#23b5b5 1px,transparent 1px)" },
  ];

  const tools = [
    { id: "lock", icon: <Lock size={18} /> },
    { id: "hand", icon: <Hand size={18} /> },
    { id: "select", icon: <MousePointer size={18} />, key: "1" },
    { id: "square", icon: <Square size={18} />, key: "2" },
    // { id: "diamond", icon: <Diamond size={18} />, key: "3" },
    // { id: "circle", icon: <Circle size={18} />, key: "4" },
    { id: "arrow", icon: <ArrowRight size={18} />, key: "5" },
    { id: "line", icon: <Minus size={18} />, key: "6" },
    { id: "pencil", icon: <Pencil size={18} />, key: "7" },
    { id: "text", icon: <Type size={18} />, key: "8" },
    { id: "image", icon: <ImageIcon size={18} />, key: "9" },
    { id: "eraser", icon: <Eraser size={18} />, key: "0" },
    { id: "sticky", icon: <StickyNote size={18} /> },
  ];

  const handleToolSelect = (toolId) => {
    setOpenMenu(null);
    setTool(toolId);

    // shape mapping logic
    if (["square", "diamond", "circle", "arrow", "line"].includes(toolId)) {
      setShapeType(toolId);
    }

    // open special menus
    if (toolId === "pencil") {
      setOpenMenu("freehand");
      setTool("freehand");
    } else if (toolId === "sticky") {
      setOpenMenu("sticky");
    } else if (toolId === "shapes") {
      setOpenMenu("shapes");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center pointer-events-none z-50">
      <motion.div
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="pointer-events-auto bg-white border border-gray-200 rounded-xl px-[6px] py-3 flex flex-col items-center space-y-1 select-none ml-3"
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}
      >
        {tools.map((tool, index) => (
          <React.Fragment key={tool.id}>
            {index === 1 || index === 2 || index === 8 || index === 11 ? (
              <div className="h-px w-6 bg-gray-200 my-[3px]" />
            ) : null}

            <div className="relative">
              <button
                onClick={() => handleToolSelect(tool.id)}
                className={`relative flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150 ${
  selectedTool === tool.id || (selectedTool === "freehand" && tool.id === "pencil")
    ? "bg-[#23b5b5] text-white shadow-inner"
    : "text-gray-700 hover:bg-gray-100"
}`}

              >
                {tool.icon}
                {tool.key && (
                  <span className="absolute text-[9px] bottom-[2px] right-[3px] text-gray-400">
                    {tool.key}
                  </span>
                )}
              </button>

              {/* ===== Sticky Notes ===== */}
              {openMenu === "sticky" && tool.id === "sticky" && (
                <div className="absolute left-[55px] top-0 flex flex-col gap-2 bg-white border border-gray-200 rounded-lg p-2 shadow-md">
                  {["#fae316", "#054098", "#b62005", "#069714", "#ffd180", "#cb0bec"].map(
                    (color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-md cursor-pointer border border-gray-200"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          addShape({
                            id: nanoid(),
                            type: "sticky",
                            text: "Write here...",
                            x: 150,
                            y: 150,
                            width: 200,
                            height: 150,
                            color,
                          });
                          setOpenMenu(null);
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}

        {/* ===== CLEAR BUTTON ===== */}
        <button
          title="Clear Canvas"
          onClick={() => {
            useStore.setState({ shapes: [] });
            localStorage.removeItem("canvasShapes");
            localStorage.removeItem("canvasNotes");
          }}
          className="mt-2 w-8 h-8 rounded-md bg-red-500 text-white hover:bg-red-400 flex items-center justify-center"
        >
          X
        </button>
      </motion.div>
    </div>
  );
}
