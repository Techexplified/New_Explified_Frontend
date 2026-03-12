import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  GitBranch,
  Layout,
  PlaySquare,
  Workflow,
  Users,
  Trash2,
  Square,
  ArrowRight,
  Type,
  Folder,
  Undo2,
  Redo2,
  ZoomIn,
  Eye,
  Download,
  Share2,
  Sparkles,
  Settings2,
  Plus,
  GripHorizontal,
  Circle,
  Hexagon as Diamond,
  Eraser,
} from "lucide-react";

export default function DiagramBuilder() {
  // Canvas State
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState(null);
  const canvasRef = useRef(null);
  const [history, setHistory] = useState([]);

  // Save history point
  const saveToHistory = () => {
    setHistory((prev) =>
      [...prev, JSON.stringify({ nodes, connections })].slice(-50),
    );
  };

  // Undo functionality
  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = JSON.parse(history[history.length - 1]);
    setNodes(lastState.nodes);
    setConnections(lastState.connections);
    setHistory((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        // Don't delete if user is typing in an input or textarea
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
          handleDeleteSelected();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [history, nodes, connections, selectedNodeId, selectedConnectionId]);

  // Connection State
  const [isConnectingMode, setIsConnectingMode] = useState(false);
  const [connectingFromId, setConnectingFromId] = useState(null);
  const [isEraserMode, setIsEraserMode] = useState(false);

  // Pan State
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Drag State
  const [draggingNode, setDraggingNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Handle Dragging / Panning
  const handleCanvasMouseDown = (e) => {
    // Start panning if clicking exactly on canvas or svg background
    if (e.target === canvasRef.current || e.target.tagName === "svg") {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      });

      setSelectedNodeId(null);
      setSelectedConnectionId(null);
      setEditingNodeId(null);
      if (isConnectingMode) {
        setIsConnectingMode(false);
        setConnectingFromId(null);
      }
    }
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();

    if (isEraserMode) {
      setNodes(nodes.filter((n) => n.id !== node.id));
      setConnections(
        connections.filter((c) => c.from !== node.id && c.to !== node.id),
      );
      if (selectedNodeId === node.id) setSelectedNodeId(null);
      return;
    }

    if (isConnectingMode) {
      if (!connectingFromId) {
        setSelectedNodeId(node.id); // Select node when starting connection
        setConnectingFromId(node.id);
      } else if (connectingFromId !== node.id) {
        setConnections([
          ...connections,
          { id: `c-${Date.now()}`, from: connectingFromId, to: node.id },
        ]);
        setConnectingFromId(null);
        setIsConnectingMode(false);
        setSelectedNodeId(null); // Deselect after connection
      }
      return;
    }

    setSelectedNodeId(node.id);
    setSelectedConnectionId(null);
    const rect = e.currentTarget.getBoundingClientRect();
    // Calculate offset from top-left of the node
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDraggingNode(node.id);
  };

  const handleCanvasMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!draggingNode || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Calculate new position relative to canvas, adjusting for pan translation
    const newX = e.clientX - canvasRect.left - dragOffset.x - pan.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y - pan.y;

    setNodes(
      nodes.map((n) =>
        n.id === draggingNode ? { ...n, x: newX, y: Math.max(-5000, newY) } : n,
      ),
    );
  };

  const handleCanvasMouseUp = () => {
    setDraggingNode(null);
    setIsPanning(false);
  };

  const handleAddElement = (type) => {
    if (type === "Eraser") {
      setIsEraserMode((prev) => !prev);
      setIsConnectingMode(false);
      setConnectingFromId(null);
      setSelectedNodeId(null);
      return;
    }

    saveToHistory();

    if (type === "Connector") {
      setIsConnectingMode((prev) => !prev);
      setIsEraserMode(false);
      setConnectingFromId(null);
      setSelectedNodeId(null); // Deselect any node when entering/exiting connecting mode
      return;
    }

    setIsEraserMode(false);
    setIsConnectingMode(false);
    setConnectingFromId(null);

    const id = Date.now().toString();
    // Center offset so nodes spawn visibly
    const spawnX = 300 - pan.x + (Math.random() * 60 - 30);
    const spawnY = 200 - pan.y + (Math.random() * 60 - 30);

    const newNode = {
      id,
      title: `New ${type}`,
      desc: type === "Text Label" ? "" : "Double click to edit",
      x: spawnX,
      y: spawnY,
      color: "#16161f",
      fontFamily: "Inter",
      fontSize: "14px",
      isActive: false,
      shape: type.toLowerCase(), // 'rectangle', 'circle', 'diamond', 'text label'
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(id);
  };

  const handleChangeColor = (color) => {
    if (!selectedNodeId) return;
    setNodes(nodes.map((n) => (n.id === selectedNodeId ? { ...n, color } : n)));
  };

  const [editingNodeId, setEditingNodeId] = useState(null);

  const handleNodeDoubleClick = (e, node) => {
    e.stopPropagation();
    setEditingNodeId(node.id);
    setSelectedNodeId(node.id);
  };

  const handleNodeChange = (id, field, value) => {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, [field]: value } : n)));
  };

  const handleDeleteSelected = () => {
    if (!selectedNodeId && !selectedConnectionId) return;
    saveToHistory();
    if (selectedNodeId) {
      setNodes(nodes.filter((n) => n.id !== selectedNodeId));
      setConnections(
        connections.filter(
          (c) => c.from !== selectedNodeId && c.to !== selectedNodeId,
        ),
      );
      setSelectedNodeId(null);
    } else if (selectedConnectionId) {
      setConnections(connections.filter((c) => c.id !== selectedConnectionId));
      setSelectedConnectionId(null);
    }
  };

  const handleClearCanvas = () => {
    if (nodes.length === 0 && connections.length === 0) return;
    if (confirm("Are you sure you want to clear the entire canvas?")) {
      saveToHistory();
      setNodes([]);
      setConnections([]);
      setSelectedNodeId(null);
      setSelectedConnectionId(null);
    }
  };

  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const _callGemini = async (prompt) => {
    const apiKey =
      import.meta.env.VITE_TRONE_GEMINI_API_KEY ||
      import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are an expert AI creating visual flowcharts and architecture diagrams.
Goal: Convert the user's prompt into a clean, logical flowchart.
Output: You MUST respond with ONLY a raw JSON object containing two arrays: 'nodes' and 'connections'. No markdown formatting, no backticks.
Format: 
{
  "nodes": [
     { "id": "1", "title": "Start", "desc": "Begin the sequence", "x": 300, "y": 50, "color": "#16161f", "shape": "circle", "fontFamily": "Inter", "fontSize": "14px" },
     { "id": "2", "title": "Condition", "desc": "Is it valid?", "x": 300, "y": 200, "color": "#16161f", "shape": "diamond", "fontFamily": "Inter", "fontSize": "14px" }
  ],
  "connections": [
     { "id": "c1", "from": "1", "to": "2" }
  ]
}
Rules:
- Layout the nodes thoughtfully using reasonable 'x' and 'y' coordinates so they form a readable tree or sequence (e.g. increase 'y' by 150 for each sequential step, 'x' should be around 300 for center, 100 for left branches, 500 for right branches).
- Use "color" to highlight important steps (e.g. #22c55e for start, #16161f for normal nodes, #ef4444 for errors).
- 'shape' MUST be one of: "rectangle", "circle", "diamond", "text label". Use "circle" for start/end, "diamond" for decisions, "rectangle" for normal processes.
- Make sure 'connections' reference valid node 'id's.`;

    const payload = {
      contents: [
        { role: "user", parts: [{ text: systemPrompt + "\n\n" + prompt }] },
      ],
      generationConfig: { temperature: 0.7, topK: 40 },
    };

    const res = await axios.post(apiUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });
    let responseText = res.data.candidates[0].content.parts[0].text;
    responseText = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(responseText);
  };

  const handleAutoGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const diagramJson = await _callGemini(prompt);
      if (diagramJson && diagramJson.nodes && diagramJson.connections) {
        setNodes(diagramJson.nodes);
        setConnections(diagramJson.connections);
        setSelectedNodeId(null);
      }
    } catch (error) {
      console.error("Failed to generate diagram:", error);
      alert(
        "Failed to auto-generate diagram. Please check your API key or prompt formating.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Calculate dynamic SVG paths between nodes
  const calculatePath = (fromNode, toNode) => {
    if (!fromNode || !toNode) return "";
    // Simple center-to-center heuristic
    const getCenter = (n) => {
      const shape = n.shape || (n.isDiamond ? "diamond" : "rectangle");
      let cx = n.x + 80; // default 160 width
      let cy = n.y;
      if (shape === "diamond") cy += 80;
      else if (shape === "circle") {
        cx = n.x + 60;
        cy += 60;
      } // 120 width circle
      else cy += 40; // 80 minHeight rectangle
      return { cx: n.x + 80, cy };
    };

    const { cx: fX, cy: fY } = getCenter(fromNode);
    const { cx: tX, cy: tY } = getCenter(toNode);

    return `M ${fX} ${fY + 40} C ${fX} ${fY + 100}, ${tX} ${tY - 60}, ${tX} ${tY}`;
  };

  // Initialize with some default nodes just to verify it works
  useEffect(() => {
    if (nodes.length === 0) {
      setNodes([
        {
          id: "1",
          title: "Start",
          desc: "Begin process",
          x: 300,
          y: 50,
          color: "#23b5b5",
          isActive: false,
          shape: "circle",
        },
        {
          id: "2",
          title: "Process",
          desc: "Do something",
          x: 300,
          y: 200,
          color: "#16161f",
          isActive: true,
          shape: "rectangle",
        },
      ]);
      setConnections([{ id: "c1", from: "1", to: "2" }]);
    }
  }, [nodes.length]);

  // Export Logic
  const [exportBg, setExportBg] = useState("dark");

  const handleExport = async (format) => {
    if (!canvasRef.current || nodes.length === 0) return;

    const bgColor =
      exportBg === "light"
        ? "#f3f4f6"
        : exportBg === "blue"
          ? "#0f172a"
          : "#0A0A0B";

    try {
      // Find bounds of all nodes
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      nodes.forEach((n) => {
        const w = 160;
        const h = 100;
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + w);
        maxY = Math.max(maxY, n.y + h);
      });

      const padding = 60;
      const contentWidth = Math.max(800, maxX - minX + padding * 2);
      const contentHeight = Math.max(600, maxY - minY + padding * 2);

      const captureCanvas = await html2canvas(canvasRef.current, {
        backgroundColor: bgColor,
        scale: 2,
        useCORS: true,
        width: contentWidth,
        height: contentHeight,
        onclone: (clonedDoc) => {
          const clonedRoot = clonedDoc.getElementById("diagram-canvas-root");
          if (clonedRoot) {
            clonedRoot.style.width = `${contentWidth}px`;
            clonedRoot.style.height = `${contentHeight}px`;
            clonedRoot.style.background = bgColor;

            // Find the layer with all nodes and connections
            const contentLayer = clonedRoot.querySelector(
              ".absolute.inset-0.pointer-events-none",
            );
            if (contentLayer) {
              // Reset translate to fit our calculated bounds
              contentLayer.style.transform = `translate(${-minX + padding}px, ${-minY + padding}px)`;
            }

            // Hide grid and status bar
            const grid = clonedRoot.querySelector(
              ".absolute.-inset-\\[5000px\\]",
            );
            if (grid) grid.style.display = "none";
            const statusBar = clonedDoc.getElementById("diagram-status-bar");
            if (statusBar) statusBar.style.display = "none";
          }
        },
      });

      const imgData = captureCanvas.toDataURL("image/png");

      if (format === "pdf") {
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [contentWidth + 100, contentHeight + 150],
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Draw background
        pdf.setFillColor(bgColor);
        pdf.rect(0, 0, pdfWidth, pdfHeight, "F");

        // Header
        const textColor = exportBg === "light" ? "#000000" : "#ffffff";
        pdf.setTextColor(textColor);
        pdf.setFontSize(24);
        pdf.text("EXPLI | Custom Architecture Diagram", 50, 40);

        // Main Image
        const xPos = (pdfWidth - contentWidth) / 2;
        const yPos = 80;

        // Border/Frame
        if (exportBg !== "light") {
          pdf.setDrawColor(35, 181, 181);
          pdf.setLineWidth(2);
          pdf.roundedRect(
            xPos - 5,
            yPos - 5,
            contentWidth + 10,
            contentHeight + 10,
            10,
            10,
          );
        }

        pdf.addImage(imgData, "PNG", xPos, yPos, contentWidth, contentHeight);

        // Footer
        pdf.setFontSize(16);
        pdf.text("EXPLI | Diagrams", 50, pdfHeight - 30);
        pdf.text(
          new Date().toLocaleDateString(),
          pdfWidth - 50,
          pdfHeight - 30,
          { align: "right" },
        );

        pdf.save("explified_diagram.pdf");
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed.");
    }
  };

  return (
    <div className="expli-v3-plan flex-1 flex overflow-hidden relative z-10 bg-[#0A0A0B] text-white">
      {/* Background orbs from V3 */}
      <div className="expli-v3-main__bg">
        <div className="expli-v3-main__bg-orb-1" />
        <div className="expli-v3-main__bg-orb-2" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-[1]">
        {/* Header Section */}
        <div className="px-6 py-4 flex justify-between items-center border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <h1 className="text-[18px] font-semibold text-white">
              Diagram Tools
            </h1>
            <div className="flex items-center bg-white/5 rounded-lg p-1">
              <input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe diagram (e.g., login flow)"
                className="bg-transparent border-none text-white px-3 py-1.5 outline-none text-[13px] w-[550px]"
              />
              <button
                onClick={handleAutoGenerate}
                disabled={isGenerating || !prompt}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-semibold transition-all duration-200 ${
                  isGenerating
                    ? "bg-[#1f2937] text-[#9ca3af] cursor-not-allowed"
                    : "bg-[#23b5b5] text-black cursor-pointer"
                }`}
              >
                <Sparkles size={14} />{" "}
                {isGenerating ? "Generating..." : "Auto-generate"}
              </button>
            </div>
          </div>

          {/* Toolbar (Undo, Redo, Zoom, etc.) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setPan({ x: 0, y: 0 });
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[#e5e7eb] text-[12px] flex items-center gap-1.5 cursor-pointer"
            >
              Reset Pan
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#23b5b5] text-black text-[13px] font-semibold"
              >
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* 3-Column Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Tools & Templates */}
          <div className="w-[260px] border-r border-white-[0.06] flex flex-col bg-black/20">
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Elements */}
              <div className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-[0.5px] mb-4">
                Elements
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Rectangle", icon: Square },
                  { label: "Circle", icon: Circle },
                  { label: "Diamond", icon: Diamond },
                  { label: "Connector", icon: ArrowRight },
                  { label: "Text Label", icon: Type },
                  { label: "Eraser", icon: Eraser },
                ].map((elem) => {
                  const isActiveMode =
                    (elem.label === "Connector" && isConnectingMode) ||
                    (elem.label === "Eraser" && isEraserMode);
                  let activeColor = "#23b5b5";
                  if (elem.label === "Eraser") activeColor = "#ef4444";

                  return (
                    <div
                      key={elem.label}
                      onClick={() => handleAddElement(elem.label)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                        isActiveMode
                          ? `border border-[${activeColor}] bg-[${activeColor}]/10`
                          : "border border-white/5 bg-white-[0.02] text-[#a1a1aa]"
                      }`}
                    >
                      <elem.icon
                        size={16}
                        color={isActiveMode ? activeColor : "#a1a1aa"}
                      />
                      <span
                        className={`text-[13px] ${isActiveMode ? "text-white" : "text-[#a1a1aa]"}`}
                      >
                        {elem.label === "Connector"
                          ? isConnectingMode
                            ? "Click 2 Nodes to Connect"
                            : "Manual Connector"
                          : elem.label === "Eraser"
                            ? isEraserMode
                              ? "Click to Delete"
                              : "Eraser Mode"
                            : elem.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clear Canvas */}
            <div className="px-6 py-4 border-t border-white-[0.06]">
              <button
                onClick={handleClearCanvas}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-[#ef4444] text-[13px] bg-[#ef4444]/5 border border-[#ef4444]/20 transition-all duration-200"
              >
                <Trash2 size={14} /> Clear Canvas
              </button>
            </div>
          </div>

          {/* Center Panel: Diagram Canvas */}
          <div
            id="diagram-canvas-root"
            ref={canvasRef}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_rgba(35,181,181,0.03)_0%,_transparent_100%)]"
            style={{
              cursor: isEraserMode
                ? "crosshair"
                : isPanning
                  ? "grabbing"
                  : isConnectingMode
                    ? "crosshair"
                    : draggingNode
                      ? "grabbing"
                      : "grab",
            }}
          >
            {/* Grid background pattern with Pan Translation */}
            <div
              className="absolute -inset-[5000px] opacity-[0.15] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[length:24px_24px]"
              style={{
                transform: `translate(${pan.x % 24}px, ${pan.y % 24}px)`, // Seamless repeating grid while panning
              }}
            />

            {/* Pan Layer Wrapper for Elements */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
            >
              {/* Dynamic SVG Connectors */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] overflow-visible">
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#23b5b5" />
                  </marker>
                  <marker
                    id="arrow-dim"
                    viewBox="0 0 10 10"
                    refX="9"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#6b7280" />
                  </marker>
                </defs>

                {connections.map((conn) => {
                  const fromNode = nodes.find((n) => n.id === conn.from);
                  const toNode = nodes.find((n) => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  const isActive = fromNode.isActive && toNode.isActive;
                  // SVG path coordinates are in standard px space relative to Pan Layer so we offset + 5000 because SVG inset is -5000
                  // Wait, if SVG parent is translated by pan, and SVG is translated by -5000,
                  // then points plotted at (node.x, node.y) inside the SVG will need +5000.
                  // To simplify, let's keep SVG at inset 0 with overflow visible!
                  const isConnActive =
                    (fromNode.isActive && toNode.isActive) ||
                    selectedConnectionId === conn.id;

                  const handleConnClick = (e) => {
                    e.stopPropagation();
                    if (isEraserMode) {
                      saveToHistory();
                      setConnections(
                        connections.filter((c) => c.id !== conn.id),
                      );
                    } else {
                      setSelectedConnectionId(conn.id);
                      setSelectedNodeId(null);
                    }
                  };

                  return (
                    <g
                      key={conn.id}
                      onClick={handleConnClick}
                      className="group"
                      style={{
                        cursor: isEraserMode ? "crosshair" : "pointer",
                        pointerEvents: "auto",
                      }}
                    >
                      {/* Invisible thicker path for easier clicking/selection */}
                      <DiagnosticPath
                        isActive={false}
                        d={calculatePath(fromNode, toNode)}
                        strokeWidth="20"
                        transparent={true}
                      />
                      <DiagnosticPath
                        isActive={isConnActive}
                        d={calculatePath(fromNode, toNode)}
                        strokeWidth={
                          selectedConnectionId === conn.id ? "3" : "2"
                        }
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node)}
                  onDoubleClick={(e) => handleNodeDoubleClick(e, node)}
                  style={{
                    position: "absolute",
                    left: node.x,
                    top: node.y,
                    zIndex:
                      selectedNodeId === node.id || draggingNode === node.id
                        ? 10
                        : 2,
                    cursor:
                      draggingNode === node.id
                        ? "grabbing"
                        : isConnectingMode || isEraserMode
                          ? "crosshair"
                          : "grab",
                    pointerEvents: "auto",
                  }}
                >
                  <DiagramNode
                    node={node}
                    isActive={
                      node.isActive ||
                      selectedNodeId === node.id ||
                      connectingFromId === node.id ||
                      isConnectingMode
                    }
                    isEraserMode={isEraserMode}
                    isConnectingMode={isConnectingMode}
                    isEditing={editingNodeId === node.id}
                    onChange={handleNodeChange}
                  />
                </div>
              ))}
            </div>

            {/* Status bar */}
            <div
              id="diagram-status-bar"
              className="absolute bottom-5 left-6 text-[12px] text-[#6b7280] flex gap-4 z-[50]"
            >
              <span>{nodes.length} nodes</span>
              <span>{connections.length} connections</span>
              {isConnectingMode && (
                <span className="text-[#23b5b5] font-semibold">
                  [CONNECTING MODE: CLICK 2 NODES]
                </span>
              )}
            </div>
          </div>

          {/* Right Panel: Properties */}
          <div className="w-[300px] border-l border-white-[0.06] flex flex-col bg-black/20">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center gap-2 mb-6 text-[13px] font-semibold text-white">
                <Settings2 size={16} color="#23b5b5" /> Style & Export
              </div>

              {selectedNodeId ? (
                <>
                  {/* Fill Color */}
                  <div className="mb-8">
                    <div className="text-[12px] text-[#9ca3af] mb-3">
                      Fill Color
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "#16161f", // Black
                        "#ffffff", // White
                        "#ef4444", // Red
                        "#22c55e", // Green
                        "#3b82f6", // Blue
                        "#eab308", // Yellow
                      ].map((color) => (
                        <button
                          key={color}
                          onClick={() => handleChangeColor(color)}
                          className={`w-full aspect-square rounded cursor-pointer transition-all duration-100 ${
                            nodes.find((n) => n.id === selectedNodeId)
                              ?.color === color
                              ? "border-2 border-[#23b5b5]"
                              : "border border-white/10"
                          }`}
                          style={{ background: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div className="mb-8">
                    <div className="text-[12px] text-[#9ca3af] mb-3">
                      Typography
                    </div>
                    <select
                      value={
                        nodes.find((n) => n.id === selectedNodeId)
                          ?.fontFamily || "Inter"
                      }
                      onChange={(e) =>
                        handleNodeChange(
                          selectedNodeId,
                          "fontFamily",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#e5e7eb] text-[13px] outline-none mb-2 appearance-none"
                    >
                      <option value="Inter" className="bg-[#16161f]">
                        Inter
                      </option>
                      <option value="Roboto" className="bg-[#16161f]">
                        Roboto
                      </option>
                      <option value="Helvetica" className="bg-[#16161f]">
                        Helvetica
                      </option>
                      <option
                        value="'Times New Roman', serif"
                        className="bg-[#16161f]"
                      >
                        Times New Roman
                      </option>
                      <option value="Courier" className="bg-[#16161f]">
                        Courier
                      </option>
                    </select>

                    <div className="flex gap-2">
                      <select
                        value={
                          nodes.find((n) => n.id === selectedNodeId)
                            ?.fontSize || "14px"
                        }
                        onChange={(e) =>
                          handleNodeChange(
                            selectedNodeId,
                            "fontSize",
                            e.target.value,
                          )
                        }
                        className="grow px-3 py-2 bg-white/5 border border-white/10 rounded-md text-[#e5e7eb] text-[13px] outline-none appearance-none"
                      >
                        {[
                          "12px",
                          "14px",
                          "16px",
                          "18px",
                          "20px",
                          "24px",
                          "32px",
                        ].map((sz) => (
                          <option key={sz} value={sz} className="bg-[#16161f]">
                            {sz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-5 text-center border border-dashed border-white/10 rounded-lg text-[#6b7280] text-[13px] mb-8">
                  Select a node to edit styling.
                </div>
              )}

              <div className="w-full h-[1px] bg-white-[0.06] my-6" />

              {/* Export Panel Options */}
              <div className="text-[13px] font-semibold text-white mb-4">
                Export Options
              </div>
              <div className="mb-6">
                <div className="text-[12px] text-[#9ca3af] mb-3">
                  Background Theme
                </div>
                <div className="flex gap-2">
                  {["dark", "light", "blue"].map((thm) => (
                    <button
                      key={thm}
                      onClick={() => setExportBg(thm)}
                      className={`flex-1 p-1.5 rounded-md text-[12px] capitalize transition-all duration-200 ${
                        exportBg === thm
                          ? "bg-[#23b5b5]/10 border border-[#23b5b5] text-[#23b5b5]"
                          : "bg-transparent border border-white/10 text-[#a1a1aa]"
                      }`}
                    >
                      {thm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleExport("pdf")}
                  className="flex items-center gap-2 w-full p-2.5 rounded-lg bg-[#23b5b5]/10 text-[#23b5b5] text-[13px] border border-[#23b5b5]/20 transition-all duration-200"
                >
                  <span>Export as Document (PDF)</span>{" "}
                  <Download size={14} className="ml-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for drawing SVG paths safely
function DiagnosticPath({
  isActive,
  d,
  strokeWidth = "2",
  transparent = false,
}) {
  return (
    <path
      d={d}
      stroke={transparent ? "transparent" : isActive ? "#23b5b5" : "#6b7280"}
      strokeWidth={strokeWidth}
      fill="none"
      markerEnd={
        transparent ? "none" : isActive ? "url(#arrow)" : "url(#arrow-dim)"
      }
    />
  );
}

// Subcomponent for flowchart nodes
function DiagramNode({
  node,
  isActive,
  isEraserMode,
  isConnectingMode,
  isEditing,
  onChange,
}) {
  const {
    id,
    title,
    desc,
    shape,
    color,
    fontFamily = "Inter",
    fontSize = "14px",
  } = node;
  const bgColor = color || "#16161f";
  const actualShape = shape || "rectangle";

  // Determine hover outline glow state. Prioritize eraser mode logic.
  let outlineBorder = "border-white/20";
  let boxShadow = "";
  if (isEraserMode) {
    outlineBorder = "border-[#ef4444]/40";
  } else if (isActive) {
    outlineBorder = "border-2 border-[#23b5b5]";
    boxShadow = "shadow-[0_0_20px_rgba(35,181,181,0.2)]";
  }

  // Draw connection dots when connector mode is active
  const ConnectorDotes = () => {
    if (!isConnectingMode) return null;
    return (
      <>
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#23b5b5] rounded-full" />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#23b5b5] rounded-full" />
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#23b5b5] rounded-full" />
        <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#23b5b5] rounded-full" />
      </>
    );
  };

  const textClass = `bg-transparent ${bgColor === "#ffffff" ? "text-black" : "text-white"} outline-none text-center w-full border-none`;
  const textStyle = { fontFamily, fontSize };

  if (actualShape === "diamond") {
    return (
      <div
        className={`relative w-40 h-40 flex items-center justify-center ${isEraserMode ? "hover:opacity-50" : ""}`}
      >
        <ConnectorDotes />
        <div
          className={`absolute w-[120px] h-[120px] rotate-[45deg] rounded-lg border transition-all duration-200 ${outlineBorder} ${boxShadow}`}
          style={{ background: bgColor }}
        />
        <div className="relative z-[1] text-center p-4 flex flex-col items-center w-full">
          <GripHorizontal size={14} className="text-white/30 mb-1" />
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => onChange(id, "title", e.target.value)}
              className={`${textClass} border border-[#23b5b5] rounded`}
              style={textStyle}
              autoFocus
            />
          ) : (
            <div
              className={`${textClass} font-semibold ${isActive ? "text-[#23b5b5]" : bgColor === "#ffffff" ? "text-black" : "text-[#e5e7eb]"}`}
              style={textStyle}
            >
              {title}
            </div>
          )}
        </div>
      </div>
    );
  } else if (actualShape === "circle") {
    return (
      <div
        className={`relative w-[120px] h-[120px] flex items-center justify-center rounded-full border transition-all duration-200 ${outlineBorder} ${boxShadow} ${isEraserMode ? "hover:opacity-50" : ""}`}
        style={{ background: bgColor }}
      >
        <ConnectorDotes />
        <div className="relative z-[1] text-center p-4 flex flex-col items-center w-full">
          <GripHorizontal size={14} className="text-white/30 mb-1" />
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => onChange(id, "title", e.target.value)}
              className={`${textClass} border border-[#23b5b5] rounded`}
              style={textStyle}
              autoFocus
            />
          ) : (
            <div
              className={`${textClass} font-semibold ${isActive ? "text-[#23b5b5]" : bgColor === "#ffffff" ? "text-black" : "text-[#e5e7eb]"}`}
              style={textStyle}
            >
              {title}
            </div>
          )}
        </div>
      </div>
    );
  } else if (actualShape === "text label") {
    return (
      <div
        className={`min-w-[100px] min-h-[40px] px-3 py-2 relative flex flex-col text-left transition-all duration-100 ${isEraserMode ? "hover:opacity-50" : ""} ${
          outlineBorder === "border-white/20"
            ? "border border-dashed border-transparent"
            : isActive
              ? "border border-dashed border-[#23b5b5]"
              : `border ${outlineBorder}`
        }`}
      >
        <ConnectorDotes />
        <div
          className={`flex justify-center mb-1 cursor-inherit transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`}
        >
          <GripHorizontal size={14} className="text-white/30" />
        </div>
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => onChange(id, "title", e.target.value)}
            className={`${textClass} border border-[#23b5b5] text-left font-semibold ${bgColor === "#16161f" ? "text-[#e5e7eb]" : "text-[inherit]"}`}
            style={{
              ...textStyle,
              color: bgColor === "#16161f" ? "#e5e7eb" : bgColor,
            }}
            autoFocus
          />
        ) : (
          <div
            className={`${textClass} font-semibold text-left ${bgColor === "#16161f" ? "text-[#e5e7eb]" : "text-[inherit]"}`}
            style={{
              ...textStyle,
              color: bgColor === "#16161f" ? "#e5e7eb" : bgColor,
            }}
          >
            {title}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative w-40 min-h-[80px] px-4 pt-3 pb-4 rounded-lg flex flex-col text-left transition-all duration-100 ${outlineBorder} ${boxShadow} ${isEraserMode ? "hover:opacity-50" : ""}`}
      style={{ background: bgColor }}
    >
      <ConnectorDotes />
      <div className="flex justify-center mb-2 cursor-inherit">
        <GripHorizontal size={14} className="text-white/30" />
      </div>
      {isEditing ? (
        <>
          <input
            value={title}
            onChange={(e) => onChange(id, "title", e.target.value)}
            className={`${textClass} border-b border-[#23b5b5] font-semibold mb-1.5 text-left`}
            style={textStyle}
            autoFocus
          />
          <textarea
            value={desc}
            onChange={(e) => onChange(id, "desc", e.target.value)}
            className={`${textClass} text-[12px] border border-white/10 rounded p-1 resize-none h-10 ${bgColor === "#ffffff" ? "text-gray-600" : "text-[#a1a1aa]"}`}
            style={{ ...textStyle, fontSize: "12px" }}
          />
        </>
      ) : (
        <>
          <div
            className={`${textClass} font-semibold mb-1.5 text-left ${isActive ? "text-[#23b5b5]" : bgColor === "#ffffff" ? "text-black" : "text-[#e5e7eb]"}`}
            style={textStyle}
          >
            {title}
          </div>
          {desc && (
            <div
              className={`${textClass} text-left leading-relaxed ${bgColor === "#ffffff" ? "text-gray-600" : "text-[#a1a1aa]"}`}
              style={{
                ...textStyle,
                fontSize: Math.max(10, parseInt(fontSize) - 2) + "px",
              }}
            >
              {desc}
            </div>
          )}
        </>
      )}
    </div>
  );
}
