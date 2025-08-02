import React, { useState } from "react";
import {
  Square,
  MoveUpRight,
  Plus,
  CircleX,
  // Icons for tools
} from "lucide-react";

import {
  FaWhatsapp,
  FaDiscord,
  FaTelegram,
  FaSlack,
  FaRobot,
  FaGem,
  FaSearch,
  FaBrain,
  FaFeatherAlt,
  FaMicrosoft,
  FaFacebook,
  FaTwitter,
  FaGithub,
  FaGoogle,
  FaComments,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaChrome,
} from "react-icons/fa";

const categorizedTools = {
  Messaging: [
    { name: "WhatsApp by Twilio", icon: <FaWhatsapp /> },
    { name: "Discord", icon: <FaDiscord /> },
    { name: "Telegram", icon: <FaTelegram /> },
    { name: "Dealbot for Slack", icon: <FaSlack /> },
  ],
  "AI Tools": [
    { name: "ChatGPT", icon: <FaRobot /> },
    { name: "Gemini", icon: <FaGem /> },
    { name: "DeepSeek", icon: <FaSearch /> },
    { name: "Perplexity AI", icon: <FaBrain /> },
    { name: "Notion AI", icon: <FaFeatherAlt /> },
    { name: "Slack GPT", icon: <FaSlack /> },
    { name: "Bing AI", icon: <FaMicrosoft /> },
    { name: "Facebook AI", icon: <FaFacebook /> },
    { name: "Twitter AI", icon: <FaTwitter /> },
    { name: "GitHub Copilot", icon: <FaGithub /> },
  ],
  "Video Conferencing": [
    { name: "Google Meet", icon: <FaGoogle /> },
    { name: "Microsoft Teams", icon: <FaMicrosoft /> },
    { name: "Zoom Meetings", icon: <FaComments /> },
  ],
  "Social Media": [
    { name: "Instagram", icon: <FaInstagram /> },
    { name: "LinkedIn Tools", icon: <FaLinkedin /> },
    { name: "YouTube AI", icon: <FaYoutube /> },
  ],
  Automation: [{ name: "Zapier", icon: <FaFeatherAlt /> }],
  "Browser Extensions": [{ name: "Chrome Extensions", icon: <FaChrome /> }],
};

const Toolbar = () => {
  const [selectedTool, setSelectedTool] = useState("square");
  const [boxes, setBoxes] = useState([]);
  const [activeBoxId, setActiveBoxId] = useState(null); // for showing sidebar
  const [draggedBoxId, setDraggedBoxId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [arrows, setArrows] = useState([]);
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState({ x: 0, y: 0 });
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const [startSide, setStartSide] = useState(null);
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
    setActiveBoxId(null); // close navbar
  };

  const handleMouseDown = (e, boxId) => {
    // Don't allow box dragging when arrow tool is selected
    if (selectedTool === "arrow") {
      return;
    }

    const box = boxes.find((box) => box.id === boxId);
    if (box) {
      setDraggedBoxId(boxId);
      setHasDragged(false);
      setDragOffset({
        x: e.clientX - box.left,
        y: e.clientY - (box.top || 160),
      });
    }
  };

  const handleMouseMove = (e) => {
    if (draggedBoxId) {
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
  };

  const handleMouseUp = () => {
    setDraggedBoxId(null);
  };

  const handleCanvasMouseDown = (e) => {
    if (selectedTool === "arrow") {
      // Check if clicking on a box using position
      const clickedBox = findBoxAtPosition(e.clientX, e.clientY);

      if (clickedBox) {
        const side = findClosestSide(e.clientX, e.clientY, clickedBox);
        const connectionPoint = getConnectionPoint(clickedBox, side);

        setIsDrawingArrow(true);
        setStartSide(side);
        setArrowStart(connectionPoint);
      }
    }
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

  // Helper function to find which side of a box the mouse is closest to
  const findClosestSide = (clientX, clientY, box) => {
    const centerX = box.left + 60;
    const centerY = box.top + 50;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    // Determine which side is closest
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal side (left or right)
      return dx > 0 ? "right" : "left";
    } else {
      // Vertical side (top or bottom)
      return dy > 0 ? "bottom" : "top";
    }
  };

  // Helper function to get connection point on a box side
  const getConnectionPoint = (box, side) => {
    switch (side) {
      case "left":
        return { x: box.left, y: box.top + 50 };
      case "right":
        return { x: box.left + 120, y: box.top + 50 };
      case "top":
        return { x: box.left + 60, y: box.top };
      case "bottom":
        return { x: box.left + 60, y: box.top + 100 };
      default:
        return { x: box.left + 60, y: box.top + 50 };
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (isDrawingArrow) {
      // Check if hovering over a box using position
      const hoveredBox = findBoxAtPosition(e.clientX, e.clientY);

      if (hoveredBox) {
        // Find the closest side of the hovered box
        const side = findClosestSide(e.clientX, e.clientY, hoveredBox);
        const connectionPoint = getConnectionPoint(hoveredBox, side);

        // Update current mouse position to the connection point
        setCurrentMousePos(connectionPoint);
      } else {
        // If not hovering over a box, follow mouse cursor
        setCurrentMousePos({ x: e.clientX, y: e.clientY });
      }
    } else {
      setCurrentMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCanvasMouseUp = (e) => {
    if (isDrawingArrow && selectedTool === "arrow") {
      // Check if releasing on a box using position
      const targetBox = findBoxAtPosition(e.clientX, e.clientY);

      if (targetBox) {
        // Find the closest side of the target box
        const endSide = findClosestSide(e.clientX, e.clientY, targetBox);
        const endPoint = getConnectionPoint(targetBox, endSide);

        const newArrow = {
          id: Date.now(),
          startX: arrowStart.x,
          startY: arrowStart.y,
          endX: endPoint.x,
          endY: endPoint.y,
        };
        setArrows((prev) => [...prev, newArrow]);
      }
      setIsDrawingArrow(false);
      setStartSide(null);
    }
  };

  return (
    <div
      className={`relative w-full h-screen ${
        selectedTool === "arrow" ? "cursor-crosshair" : ""
      }`}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleCanvasMouseMove(e);
      }}
      onMouseUp={(e) => {
        handleMouseUp();
        handleCanvasMouseUp(e);
      }}
      onMouseDown={handleCanvasMouseDown}
    >
      {/* Render Boxes */}
      {boxes.map((box, index) => (
        <div
          key={box.id}
          data-box-id={box.id}
          className={`absolute w-[120px] h-[100px] bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-cyan-500 rounded-md z-40 cursor-pointer ${
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
          onMouseDown={(e) => {
            // If arrow tool is selected, prevent box dragging and let canvas handle it
            if (selectedTool === "arrow") {
              e.preventDefault();
              e.stopPropagation();
              return;
            }
            handleMouseDown(e, box.id);
          }}
          onClick={(e) => {
            if (!hasDragged && selectedTool !== "arrow") {
              setActiveBoxId(box.id);
            }
          }}
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
