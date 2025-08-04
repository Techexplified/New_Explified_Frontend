import React, { useState } from "react";
import {
  Square,
  MoveUpRight,
  Plus,
  MessageCircle,
  Bot,
  Search,
  Brain,
  Edit,
  Video,
  Users,
  Zap,
  Chrome,
  Github,
  Mail,
} from "lucide-react";

const categorizedTools = {
  Messaging: [
    { name: "WhatsApp", icon: <MessageCircle /> },
    { name: "Discord", icon: <MessageCircle /> },
    { name: "Telegram", icon: <MessageCircle /> },
    { name: "Slack", icon: <MessageCircle /> },
  ],
  "AI Tools": [
    { name: "ChatGPT", icon: <Bot /> },
    { name: "Gemini", icon: <Bot /> },
    { name: "DeepSeek", icon: <Search /> },
    { name: "Perplexity AI", icon: <Brain /> },
    { name: "Notion AI", icon: <Edit /> },
    { name: "Slack GPT", icon: <Bot /> },
    { name: "Bing AI", icon: <Search /> },
    { name: "GitHub Copilot", icon: <Github /> },
  ],
  "Video Conferencing": [
    { name: "Google Meet", icon: <Video /> },
    { name: "Microsoft Teams", icon: <Video /> },
    { name: "Zoom Meetings", icon: <Video /> },
  ],
  "Social Media": [
    { name: "Instagram", icon: <Users /> },
    { name: "LinkedIn", icon: <Users /> },
    { name: "YouTube", icon: <Video /> },
  ],
  Automation: [{ name: "Zapier", icon: <Zap /> }],
  "Browser Extensions": [{ name: "Chrome Extensions", icon: <Chrome /> }],
};

const Toolbar = () => {
  const [selectedTool, setSelectedTool] = useState("square");
  const [boxes, setBoxes] = useState([]);
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [draggedBoxId, setDraggedBoxId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [arrows, setArrows] = useState([]);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState({ x: 0, y: 0 });
  const [arrowStartBoxId, setArrowStartBoxId] = useState(null);
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  // Flatten all tools for search
  const allTools = Object.values(categorizedTools).flat();

  const handleToolClick = (toolId) => {
    setSelectedTool(toolId);
    if (toolId === "square" && boxes.length === 0) {
      setBoxes([
        {
          id: Date.now(),
          left: window.innerWidth / 2 - 100,
          top: 160,
          icon: null,
        },
      ]);
    }
  };

  const handleAddBox = () => {
    setBoxes((prev) => [
      ...prev,
      {
        id: Date.now(),
        left: prev[prev.length - 1].left + 220,
        top: 160,
        icon: null,
      },
    ]);
  };

  const handleSelectToolIcon = (boxId, icon) => {
    setBoxes((prev) =>
      prev.map((box) => (box.id === boxId ? { ...box, icon } : box))
    );
    setActiveBoxId(null);
  };

  // Helper function to find box at mouse position
  const findBoxAtPosition = (clientX, clientY) => {
    return boxes.find((box) => {
      return (
        clientX >= box.left &&
        clientX <= box.left + 120 &&
        clientY >= box.top &&
        clientY <= box.top + 100
      );
    });
  };

  // Helper function to get center point of a box
  const getBoxCenter = (box) => {
    return {
      x: box.left + 60, // 120px width / 2
      y: box.top + 50, // 100px height / 2
    };
  };

  const handleBoxMouseDown = (e, boxId) => {
    e.preventDefault();
    e.stopPropagation();

    if (selectedTool === "arrow") {
      // Start drawing arrow from center of clicked box
      const box = boxes.find((b) => b.id === boxId);
      if (box) {
        const center = getBoxCenter(box);
        setIsDrawingArrow(true);
        setArrowStart(center);
        setArrowStartBoxId(boxId);
        setCurrentMousePos(center);
      }
    } else {
      // Regular box dragging for square tool
      const box = boxes.find((box) => box.id === boxId);
      if (box) {
        setDraggedBoxId(boxId);
        setHasDragged(false);
        setDragOffset({
          x: e.clientX - box.left,
          y: e.clientY - (box.top || 160),
        });
      }
    }
  };

  const handleMouseMove = (e) => {
    // Handle box dragging (only for square tool)
    if (draggedBoxId && selectedTool !== "arrow") {
      setHasDragged(true);
      setBoxes((prev) =>
        prev.map((box) =>
          box.id === draggedBoxId
            ? {
                ...box,
                left: e.clientX - dragOffset.x,
                top: e.clientY - dragOffset.y,
              }
            : box
        )
      );
    }

    // Handle arrow drawing
    if (isDrawingArrow) {
      const hoveredBox = findBoxAtPosition(e.clientX, e.clientY);

      if (hoveredBox && hoveredBox.id !== arrowStartBoxId) {
        // Snap to center of hovered box
        const center = getBoxCenter(hoveredBox);
        setCurrentMousePos(center);
      } else {
        // Follow mouse cursor
        setCurrentMousePos({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = (e) => {
    // Handle arrow completion
    if (isDrawingArrow && selectedTool === "arrow") {
      const targetBox = findBoxAtPosition(e.clientX, e.clientY);

      if (targetBox && targetBox.id !== arrowStartBoxId) {
        const endCenter = getBoxCenter(targetBox);

        const newArrow = {
          id: Date.now(),
          startX: arrowStart.x,
          startY: arrowStart.y,
          endX: endCenter.x,
          endY: endCenter.y,
          startBoxId: arrowStartBoxId,
          endBoxId: targetBox.id,
        };
        setArrows((prev) => [...prev, newArrow]);
      }

      setIsDrawingArrow(false);
      setArrowStartBoxId(null);
    }

    // Handle box dragging cleanup
    setDraggedBoxId(null);
  };

  const handleBoxClick = (e, boxId) => {
    if (!hasDragged && selectedTool !== "arrow") {
      setActiveBoxId(boxId);
    }
  };

  return (
    <div
      className={`relative w-full h-screen ${
        selectedTool === "arrow" ? "cursor-crosshair" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Render Boxes */}
      {boxes.map((box, index) => (
        <div
          key={box.id}
          data-box-id={box.id}
          className={`absolute w-[120px] h-[100px] bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-cyan-500 rounded-md z-40 ${
            selectedTool === "arrow"
              ? "cursor-crosshair"
              : draggedBoxId === box.id
              ? "cursor-grabbing"
              : "cursor-grab"
          }`}
          style={{
            left: `${box.left}px`,
            top: `${box.top || 160}px`,
          }}
          onMouseDown={(e) => handleBoxMouseDown(e, box.id)}
          onClick={(e) => handleBoxClick(e, box.id)}
        >
          <div className="w-full h-full flex items-center justify-center text-4xl text-white">
            {box.icon || <Square size={48} />}
          </div>

          {/* Plus Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddBox();
            }}
            className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-green-400 text-white rounded-full flex items-center justify-center shadow-md hover:bg-cyan-700"
          >
            <Plus size={18} />
          </button>
        </div>
      ))}

      {/* Render Arrows */}
      {arrows.map((arrow) => (
        <svg
          key={arrow.id}
          className="absolute inset-0 pointer-events-none z-30"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <marker
              id={`arrowhead-${arrow.id}`}
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3b82f6"
                stroke="#3b82f6"
              />
            </marker>
          </defs>
          <line
            x1={arrow.startX}
            y1={arrow.startY}
            x2={arrow.endX}
            y2={arrow.endY}
            stroke="#3b82f6"
            strokeWidth="3"
            markerEnd={`url(#arrowhead-${arrow.id})`}
          />
        </svg>
      ))}

      {/* Temporary arrow while drawing */}
      {isDrawingArrow && (
        <svg
          className="absolute inset-0 pointer-events-none z-30"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <marker
              id="temp-arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3b82f6"
                stroke="#3b82f6"
              />
            </marker>
          </defs>
          <line
            x1={arrowStart.x}
            y1={arrowStart.y}
            x2={currentMousePos.x}
            y2={currentMousePos.y}
            stroke="#3b82f6"
            strokeWidth="3"
            markerEnd="url(#temp-arrowhead)"
            strokeDasharray="5,5"
          />
        </svg>
      )}

      {/* Search Sidebar */}
      {activeBoxId === boxes.find((box) => box.id === activeBoxId)?.id && (
        <div
          className="absolute left-full top-0 ml-4 w-64 max-h-[300px] p-3 bg-cyan-200 rounded-xl shadow-xl border border-cyan-300 z-50"
          style={{
            left: `${
              boxes.find((box) => box.id === activeBoxId)?.left + 120
            }px`,
            top: `${boxes.find((box) => box.id === activeBoxId)?.top || 160}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="text"
            placeholder="🔍 Search tools..."
            className="w-full mb-3 px-3 py-2 text-sm border border-cyan-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
            style={{
              backgroundColor: "#e0f7fa",
              color: "#036c73",
              fontWeight: "500",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="max-h-48 overflow-y-auto space-y-2 stylish-scrollbar">
            {allTools
              .filter((tool) =>
                tool.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSelectToolIcon(activeBoxId, tool.icon)}
                  className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-cyan-100 text-gray-800 text-sm border border-gray-200"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span>{tool.name}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/5 z-50">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-cyan-400/50 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-cyan-500/20 relative">
          {["square", "arrow"].map((tool) => (
            <button
              key={tool}
              onClick={() => handleToolClick(tool)}
              className={`
                relative rounded-xl font-medium text-sm transition-all duration-300 ease-out w-12 h-12
                flex items-center justify-center gap-2 group overflow-hidden
                ${
                  selectedTool === tool
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                }
              `}
            >
              <span className="text-4xl relative z-10 p-1">
                {tool === "square" ? <Square /> : <MoveUpRight />}
              </span>

              {selectedTool === tool && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-20 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl blur-3xl -z-30 animate-pulse" />
      </div>
    </div>
  );
};

export default Toolbar;
