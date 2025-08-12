import React, { useEffect, useState } from "react";
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
  Sparkles,
} from "lucide-react";
import { useParams } from "react-router-dom";

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
  const [hoveredBoxId, setHoveredBoxId] = useState(null);
  const [isAIChatbotOpen, setIsAIChatbotOpen] = useState(false);

  // Flatten all tools for search
  const allTools = Object.values(categorizedTools).flat();

  const handleToolClick = (toolId) => {
    setSelectedTool(toolId);
    if (toolId === "ai-stars") {
      setIsAIChatbotOpen(!isAIChatbotOpen);
    } else if (toolId === "square" && boxes.length === 0) {
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

  const handleCreateBoxFromSide = (parentBoxId, side) => {
    const parentBox = boxes.find((box) => box.id === parentBoxId);
    if (!parentBox) return;

    let newBoxPosition = { left: 0, top: 0 };
    const spacing = 80; // Distance between boxes

    switch (side) {
      case "top":
        newBoxPosition = {
          left: parentBox.left,
          top: parentBox.top - 100 - spacing,
        };
        break;
      case "bottom":
        newBoxPosition = {
          left: parentBox.left,
          top: parentBox.top + 100 + spacing,
        };
        break;
      case "left":
        newBoxPosition = {
          left: parentBox.left - 120 - spacing,
          top: parentBox.top,
        };
        break;
      case "right":
        newBoxPosition = {
          left: parentBox.left + 120 + spacing,
          top: parentBox.top,
        };
        break;
    }

    const newBox = {
      id: Date.now(),
      left: newBoxPosition.left,
      top: newBoxPosition.top,
      icon: null,
    };

    setBoxes((prev) => [...prev, newBox]);

    // Create arrow connecting the boxes
    const startBox = parentBox;
    const endBox = newBox;
    const startCenter = getBoxCenter(startBox);
    const endCenter = getBoxCenter(endBox);
    const endPoint = getArrowEndPoint(startBox, endBox);

    const newArrow = {
      id: Date.now() + 1,
      startX: startCenter.x,
      startY: startCenter.y,
      endX: endPoint.x,
      endY: endPoint.y,
      startBoxId: parentBoxId,
      endBoxId: newBox.id,
    };

    setArrows((prev) => [...prev, newArrow]);
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

  // Helper function to calculate arrow end point at box border
  const getArrowEndPoint = (startBox, endBox) => {
    const startCenter = getBoxCenter(startBox);
    const endCenter = getBoxCenter(endBox);

    // Calculate direction vector
    const dx = endCenter.x - startCenter.x;
    const dy = endCenter.y - startCenter.y;

    // Normalize the direction
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return endCenter;

    const unitX = dx / length;
    const unitY = dy / length;

    // Box dimensions
    const boxWidth = 120;
    const boxHeight = 100;
    const halfWidth = boxWidth / 2;
    const halfHeight = boxHeight / 2;

    // Calculate intersection with box border
    let intersectionX, intersectionY;

    // Check which side of the box the arrow will hit
    const slope = Math.abs(dy / dx);
    const boxSlope = boxHeight / boxWidth;

    if (slope <= boxSlope) {
      // Arrow hits left or right side
      if (unitX > 0) {
        // Hits right side
        intersectionX = endBox.left;
        intersectionY = endCenter.y - (halfWidth * unitY) / unitX;
      } else {
        // Hits left side
        intersectionX = endBox.left + boxWidth;
        intersectionY = endCenter.y + (halfWidth * unitY) / unitX;
      }
    } else {
      // Arrow hits top or bottom side
      if (unitY > 0) {
        // Hits bottom side
        intersectionY = endBox.top;
        intersectionX = endCenter.x - (halfHeight * unitX) / unitY;
      } else {
        // Hits top side
        intersectionY = endBox.top + boxHeight;
        intersectionX = endCenter.x + (halfHeight * unitX) / unitY;
      }
    }

    return { x: intersectionX, y: intersectionY };
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
        // Calculate arrow end point at box border instead of center
        const startBox = boxes.find((b) => b.id === arrowStartBoxId);
        const endPoint = getArrowEndPoint(startBox, hoveredBox);
        setCurrentMousePos(endPoint);
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
        const startBox = boxes.find((b) => b.id === arrowStartBoxId);
        const endPoint = getArrowEndPoint(startBox, targetBox);

        const newArrow = {
          id: Date.now(),
          startX: arrowStart.x,
          startY: arrowStart.y,
          endX: endPoint.x,
          endY: endPoint.y,
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
      {/* Empty Canvas Placeholder */}
      {boxes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center ml-10  z-30">
          <div
            className="w-[120px] h-[100px] border-2 border-dashed border-minimal-primary rounded-md flex items-center justify-center cursor-pointer hover:border-minimal-primary/80 hover:bg-minimal-dark-100/20 transition-all duration-200"
            onClick={() => {
              setBoxes([
                {
                  id: Date.now(),
                  left: window.innerWidth / 2 - 60,
                  top: window.innerHeight / 2 - 50,
                  icon: null,
                },
              ]);
            }}
          >
            <Plus size={48} className="text-minimal-primary" />
          </div>
        </div>
      )}

      {/* Render Boxes */}
      {boxes.map((box, index) => (
        <div
          key={box.id}
          className="absolute"
          style={{
            left: `${box.left - 32}px`,
            top: `${(box.top || 160) - 32}px`,
            width: "184px", // 120px + 64px (32px on each side)
            height: "164px", // 100px + 64px (32px on each side)
          }}
          onMouseEnter={() => setHoveredBoxId(box.id)}
          onMouseLeave={() => setHoveredBoxId(null)}
        >
          <div
            data-box-id={box.id}
            className={`absolute w-[120px] h-[100px] bg-gradient-to-r from-minimal-dark-100 to-minimal-dark-200 border-2 border-minimal-primary rounded-md z-40 ${
              selectedTool === "arrow"
                ? "cursor-crosshair"
                : draggedBoxId === box.id
                ? "cursor-grabbing"
                : "cursor-grab"
            }`}
            style={{
              left: "32px",
              top: "32px",
            }}
            onMouseDown={(e) => handleBoxMouseDown(e, box.id)}
            onClick={(e) => handleBoxClick(e, box.id)}
          >
            <div className="w-full h-full flex items-center justify-center text-4xl text-minimal-white">
              {box.icon || <Square size={48} />}
            </div>
          </div>

          {/* Side Dots - Only show when hovering */}
          {hoveredBoxId === box.id && (
            <>
              {/* Top dot */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "top");
                }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />

              {/* Bottom dot */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "bottom");
                }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />

              {/* Left dot */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "left");
                }}
                className="absolute top-1/2 -translate-y-1/2 left-0 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />

              {/* Right dot */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateBoxFromSide(box.id, "right");
                }}
                className="absolute top-1/2 -translate-y-1/2 right-0 w-4 h-4 bg-minimal-gray-300 opacity-15 rounded-full hover:bg-minimal-primary transition-colors duration-200 z-50"
              />
            </>
          )}
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
                fill="#23B5B5"
                stroke="#23B5B5"
              />
            </marker>
          </defs>
          <line
            x1={arrow.startX}
            y1={arrow.startY}
            x2={arrow.endX}
            y2={arrow.endY}
            stroke="#23B5B5"
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
                fill="#23B5B5"
                stroke="#23B5B5"
              />
            </marker>
          </defs>
          <line
            x1={arrowStart.x}
            y1={arrowStart.y}
            x2={currentMousePos.x}
            y2={currentMousePos.y}
            stroke="#23B5B5"
            strokeWidth="3"
            markerEnd="url(#temp-arrowhead)"
            strokeDasharray="5,5"
          />
        </svg>
      )}

      {/* Search Sidebar */}
      {activeBoxId === boxes.find((box) => box.id === activeBoxId)?.id && (
        <div
          className="absolute left-full top-0 ml-4 w-64 max-h-[300px] p-3 bg-minimal-dark-100/90 backdrop-blur-sm rounded-xl shadow-xl border border-minimal-primary z-50"
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
            className="w-full mb-3 px-3 py-2 text-sm border border-minimal-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-minimal-primary transition-all"
            style={{
              backgroundColor: "rgba(26, 26, 26, 0.8)",
              color: "#e2e8f0",
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
                  className="flex items-center gap-2 p-2 w-full rounded-md hover:bg-minimal-cardHover/50 text-minimal-white text-sm border border-minimal-border"
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
        <div className="bg-minimal-card/80 backdrop-blur-xl border border-minimal-primary/50 rounded-2xl p-2 flex items-center gap-2 shadow-2xl shadow-minimal-primary/20 relative">
          {["square", "arrow", "ai-stars"].map((tool) => (
            <button
              key={tool}
              onClick={() => handleToolClick(tool)}
              className={`
                relative rounded-xl font-medium text-sm transition-all duration-300 ease-out w-12 h-12
                flex items-center justify-center gap-2 group overflow-hidden
                ${
                  selectedTool === tool
                    ? "bg-gradient-to-r from-minimal-primary to-minimal-gray-600 text-minimal-white shadow-lg shadow-minimal-primary/25 scale-105"
                    : "text-minimal-muted hover:text-minimal-white hover:bg-minimal-cardHover/50"
                }
              `}
            >
              <span className="text-4xl relative z-10 p-1">
                {tool === "square" ? (
                  <Square />
                ) : tool === "arrow" ? (
                  <MoveUpRight />
                ) : (
                  <Sparkles />
                )}
              </span>

              {selectedTool === tool && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-minimal-primary to-minimal-gray-600 opacity-20 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/10 to-minimal-gray-600/10 rounded-2xl blur-3xl -z-30 animate-pulse" />
      </div>

      {/* AI Chatbot Sidebar */}
      <div
        className={`fixed top-30 right-0 min-h-[600px] w-80 bg-minimal-dark-100 border-y border-l rounded-l-lg border-minimal-primary/50 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isAIChatbotOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-minimal-primary/30">
          <div className="flex items-center gap-2">
            <Sparkles className="text-minimal-primary" size={20} />
            <span className="text-minimal-white font-medium">AI Assistant</span>
          </div>
          <button
            onClick={() => setIsAIChatbotOpen(false)}
            className="text-minimal-muted hover:text-minimal-white transition-colors"
          >
            <MoveUpRight size={20} />
          </button>
        </div>

        {/* Chat Content */}
        <div className="p-4 min-h-[600px] flex flex-col">
          <div className="flex-1">
            <div className="mb-6">
              <div className="text-minimal-white text-lg mb-2">Hi User 👋</div>
              <div className="text-minimal-white/80 text-sm leading-relaxed">
                I can answer most questions about building workflows in n8n.
              </div>
              <div className="text-minimal-white/80 text-sm leading-relaxed mt-2">
                For specific tasks, you'll see the{" "}
                <button className="inline-flex items-center gap-1 px-3 py-1 bg-minimal-dark-200 border border-minimal-primary rounded-md text-minimal-white text-sm hover:bg-minimal-dark-300 transition-colors">
                  <Sparkles size={14} />
                  Ask Assistant
                </button>{" "}
                button in the UI.
              </div>
            </div>

            <div className="text-minimal-white text-lg font-medium">
              How can I help?
            </div>
          </div>

          {/* Input Area */}
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-2 p-3 bg-minimal-dark-200 rounded-lg border border-minimal-primary/30">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-minimal-white placeholder-minimal-muted outline-none"
              />
              <button className="text-minimal-primary hover:text-minimal-white transition-colors">
                <MoveUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
