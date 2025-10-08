import { useRef, useState } from "react";
import { create } from "zustand";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import { SketchPicker } from "react-color";
import React from "react";
import eraserCursor from "../assets/images/eraser-icon-vector.png";
import UpdatedDashboard2 from "../components/UpdatedDashboard2";
import {
  Circle,
  Minus,
  RectangleHorizontal,
  PencilLine,
  RemoveFormatting,
  Eraser,
  Image,
  Pen,
  Pencil,
  Brush,
  Droplet,
  SlidersHorizontal,
} from "lucide-react";
// ---- STORE ----
const useStore = create((set, get) => ({
  shapes: [],
  selectedTool: "freehand", // default tool
  setTool: (tool) => set({ selectedTool: tool }),
  setShapes: (shapesFromPreviousNote) =>
    set({ shapes: shapesFromPreviousNote }),
  addShape: (shape) => {
    set((state) => ({ shapes: [...state.shapes, shape] }));
  },

  freehandStrokeWidth: 2, // default
  setFreehandStrokeWidth: (width) => set({ freehandStrokeWidth: width }),

  updateShape: (id, updater) => {
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id
          ? { ...s, ...(typeof updater === "function" ? updater(s) : updater) }
          : s
      ),
    }));
  },
  removeShape: (id) =>
    set((state) => ({
      shapes: state.shapes.filter((s) => s.id !== id),
    })),
  selectedShapeId: null,
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
  textStyle: {
    fontFamily: "Arial",
    fontSize: 20,
    bold: false,
    italic: false,
    color: "#23b5b5",
  },
  setTextStyle: (partial) =>
    set((state) => ({ textStyle: { ...state.textStyle, ...partial } })),
  freehandType: "pencil",
  setFreehandType: (fType) => set({ freehandType: fType }),
   freehandColor: "#23b5b5",
  setFreehandColor: (color) => set({ freehandColor: color }),
}));

function ShapesPanel() {
  const selectedTool = useStore((state) => state.selectedTool);
  const setTool = useStore((state) => state.setTool);

  const tools = [
    { id: "rectangle", label: "Rectangle" },
    { id: "circle", label: "Circle" },
    { id: "line", label: "Line" },
  ];

  return (
    <div
      className="flex flex-col gap-3 rounded-t-2xl rounded-b-2xl p-2 bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-lg shadow-2xl"
      style={{
        position: "absolute",
        top: 100,
        left: 75,
        width: "60px",
        marginLeft: 12,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          className={`flex justify-center items-center p-2 rounded-xl text-lg transform hover:scale-105 border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 text-minimal-primary hover:bg-blue-600
            ${selectedTool === t.id ? "bg-blue-500 text-white" : ""}`}
          style={{ fontSize: "1.1rem" }}
          title={t.label}
        >
          {t.label === "Rectangle" ? (
            <RectangleHorizontal />
          ) : t.label === "Circle" ? (
            <Circle />
          ) : t.label === "Line" ? (
            <Minus />
          ) : null}
        </button>
      ))}
    </div>
  );
}

// ---- SHAPE RENDERER ----
function Shape({
  id,
  type,
  points,
  x,
  y,
  width,
  height,
  text,
  fontFamily,
  fontSize,
  bold,
  italic,
  color,
  strokeWidth,
  x1,
  y1,
  x2,
  y2,
  r,
  cx,
  cy,
  src,
  strokeW,
  opacity,
}) {
  if (type === "freehand") {
    if (!points || points.length < 2) return null;
    const pathData = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return (
      <path
        d={pathData}
        stroke={color}
        strokeWidth={strokeWidth ?? 2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={opacity ?? 1}
      />
    );
  }
  // Render image shape
  if (type === "image") {
    return (
      <image
        key={id}
        href={arguments.src || src}
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ pointerEvents: "all" }}
      />
    );
  }
  if (type === "rect") {
    return (
      <rect
        key={id}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke={color}
        fill="transparent"
      />
    );
  } else if (type === "circle") {
    return (
      <circle
        key={id}
        cx={cx}
        cy={cy}
        r={r}
        stroke={color}
        fill="transparent"
      />
    );
  } else if (type === "line") {
    return <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} />;
  }
  if (type === "text") {
    const boxW = Math.max(40, width || 160);
    const boxH = Math.max(24, height || (fontSize ? fontSize * 1.6 : 28));
    const clipId = `clip-${id}`;
    const lines = (text || "").split("\n");
    const lineHeight = (fontSize || 16) * 1.2;
    return (
      <g key={id}>
        <defs>
          <clipPath id={clipId}>
            <rect x={x} y={y} width={boxW} height={boxH} />
          </clipPath>
        </defs>
        
      </g>
    );
  }
  return null;
}

// ---- CANVAS ----
function Canvas() {
  // Get chosenColor from store
  const chosenColor = useStore((s) => s.chosenColor || "#23b5b5");
  const shapes = useStore((s) => s.shapes);
  const setShapes = useStore((s) => s.setShapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const removeShape = useStore((s) => s.removeShape);
  const freehandColor = useStore((s) => s.freehandColor);
  const setFreehandStrokeWidth = useStore((s) => s.setFreehandStrokeWidth);
  // Undo/redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);


  useEffect(() => {
    const handleScroll = (e) => {
      setFreehandStrokeWidth((prev) =>
        Math.max(1, prev + (e.deltaY > 0 ? 1 : -1))
      );
    };
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [setFreehandStrokeWidth]);


  // Update shapes when historyIndex changes
  useEffect(() => {
    if (history[historyIndex]) {
      setShapes(history[historyIndex]);
    }
  }, [historyIndex]);

  // Undo
  const handleUndo = () => {
    setHistoryIndex((prev) => Math.max(prev - 1, 0));
  };

  // Redo
  const handleRedo = () => {
    setHistoryIndex((prev) => Math.min(prev + 1, history.length - 1));
  };

  function getSVGCoords(svg, clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }
  let clickTimeout;
  const [textareaValue, setTextareaValue] = useState("");
  const selectedTool = useStore((s) => s.selectedTool);
  const textStyle = useStore((s) => s.textStyle);
  const selectedShapeId = useStore((s) => s.selectedShapeId);
  const setSelectedShapeId = useStore((s) => s.setSelectedShapeId);
  const [currentShapeId, setCurrentShapeId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  // const [caretIndex, setCaretIndex] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null); // 'tl' | 'tr' | 'bl' | 'br'
  const [isCreatingTextBox, setIsCreatingTextBox] = useState(false);
  const freehandType = useStore((s) => s.freehandType);
  const containerRef = useRef(null);
  const measureCanvasRef = useRef(null);
  const svgRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingId && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
        textareaRef.current.value.length;
    }
  }, [editingId]);
  // Expose undo/redo handlers for Toolbar
  Canvas.handleUndo = handleUndo;
  Canvas.handleRedo = handleRedo;
  
  const measureTextWidth = (text, fontSize, fontFamily, bold, italic) => {
    let canvas = measureCanvasRef.current;
    if (!canvas) {
      canvas = document.createElement("canvas");
      measureCanvasRef.current = canvas;
    }
    const ctx = canvas.getContext("2d");
    const weight = bold ? "700" : "400";
    const style = italic ? "italic" : "normal";
    ctx.font = `${style} ${weight} ${fontSize || 16}px ${
      fontFamily || "Arial"
    }`;
    return ctx.measureText(text || "").width;
  };
  const wrapTextToWidth = (
    text,
    maxWidth,
    fontSize,
    fontFamily,
    bold,
    italic
  ) => {
    const paragraphs = (text || "").split("\n");
    const lines = [];
    for (const para of paragraphs) {
      const words = para.split(/(\s+)/); // keep spaces
      let line = "";
      for (const token of words) {
        const candidate = line + token;
        const w = measureTextWidth(
          candidate,
          fontSize,
          fontFamily,
          bold,
          italic
        );
        if (w <= maxWidth || line === "") {
          line = candidate;
        } else {
          lines.push(line);
          line = token.trimStart();
        }
      }
      lines.push(line);
    }
    return lines;
  };

  const getLineHeight = (fontSize) => (fontSize || 16) * 1.2;

  // Reflow text across multiple columns (additional sibling shapes)
  const reflowColumns = (sourceId) => {
    const state = useStore.getState();
    const all = state.shapes;
    const src = all.find((s) => s.id === sourceId);
    if (!src || src.type !== "text") return;
    const rootId = src.parentId || src.id;
    const root = all.find((s) => s.id === rootId);
    if (!root) return;

    const gap = 16;
    const padding = 12;
    const maxTextWidth = Math.max(0, (root.width || 0) - padding);
    const lineHeight = getLineHeight(root.fontSize);
    const lines = wrapTextToWidth(
      root.text || "",
      maxTextWidth,
      root.fontSize,
      root.fontFamily,
      root.bold,
      root.italic
    );
    const newHeight = lines.length * lineHeight + padding;
    updateShape(root.id, { height: newHeight, text: root.text });
  };

  // Auto-grow text box height while typing to fit wrapped content
  useEffect(() => {
    if (!editingId) return;
    const shape = shapes.find((s) => s.id === editingId);
    if (!shape) return;
    const minH = 24;
    const maxTextWidth = Math.max(0, (shape.width || 0) - 12);
    const lines = wrapTextToWidth(
      shape.text || "",
      maxTextWidth,
      shape.fontSize,
      shape.fontFamily,
      shape.bold,
      shape.italic
    );
    const lineHeight = (shape.fontSize || 16) * 1.2;
    const neededH = Math.max(
      minH,
      lines.length > 0 ? lineHeight * lines.length + 12 : minH
    );
    if (!shape.height || neededH > shape.height) {
      updateShape(editingId, { height: neededH });
    }
  }, [editingId, shapes, updateShape]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;
    // coords inside svg in pixels (approx)
    if (selectedTool === "text") {
      // If we're already editing a text box, first commit it or remove if empty
      if (editingId) {
        const current = shapes.find((s) => s.id === editingId);
        const trimmed = (current?.text || "").replace(/\n+$/, "").trim();
        if (!trimmed) {
          removeShape(editingId);
        } else {
          updateShape(editingId, {
            fontFamily: textStyle.fontFamily,
            fontSize: textStyle.fontSize,
            bold: textStyle.bold,
            italic: textStyle.italic,
            color: textStyle.color,
          });
        }
        // setEditingId(null);
        // setCaretIndex(0);
      }
      // create a new empty text shape and drag to set width/height
      const id = nanoid();
      addShape({
        id,
        type: "text",
        x: offsetX,
        y: offsetY,
        text: "",
        width: 0,
        height: Math.max(24, (textStyle.fontSize || 16) * 1.6),
        fontFamily: textStyle.fontFamily,
        fontSize: textStyle.fontSize,
        bold: textStyle.bold,
        italic: textStyle.italic,
        color: textStyle.color,
      });
      setSelectedShapeId(id);
      setEditingId(id);
      setCurrentShapeId(id);
      setIsCreatingTextBox(true);
      e.stopPropagation();
    }
    if (selectedTool === "eraser") {
      setIsErasing(true);
      eraseAt(offsetX, offsetY);
      e.stopPropagation();
      return;
    }
   if (selectedTool === "freehand") {
  const strokeW = useStore.getState().freehandStrokeWidth; // use store value directly
  let opacity = 1;
  if (freehandType === "brush") {
    opacity = 0.7;
  }
  const newShape = {
    id: nanoid(),
    type: "freehand",
    points: [{ x: offsetX, y: offsetY }],
    color: freehandColor,
    strokeWidth: strokeW,
    opacity: opacity,
  };
  addShape(newShape);
  setCurrentShapeId(newShape.id);
}

    if (selectedTool === "rectangle") {
      const newShape = {
        id: nanoid(),
        type: "rect",
        x: offsetX,
        y: offsetY,
        width: 0,
        height: 0,
        color: "#23b5b5",
        strokeWidth: 2,
      };
      addShape(newShape);
      setCurrentShapeId(newShape.id);
    }
    if (selectedTool === "line") {
      const newShape = {
        id: nanoid(),
        type: "line",
        x1: offsetX,
        y1: offsetY,
        x2: offsetX,
        y2: offsetY,
        color: "#23b5b5",
        strokeWidth: 2,
      };
      addShape(newShape);
      setCurrentShapeId(newShape.id);
    }
    if (selectedTool === "circle") {
      const newShape = {
        id: nanoid(),
        type: "circle",
        cx: offsetX,
        cy: offsetY,
        r: 0,
        width: 0,
        height: 0,
        color: "#23b5b5",
        strokeWidth: 2,
      };
      addShape(newShape);
      setCurrentShapeId(newShape.id);
    }
  };

  const handleMouseMove = (e) => {
  const { offsetX, offsetY } = e.nativeEvent;

  // Creating new text box by drag
  if (isCreatingTextBox && currentShapeId) {
    updateShape(currentShapeId, (prev) => {
      const newW = Math.max(40, offsetX - prev.x);
      const maxTextWidth = Math.max(0, newW - 12);
      const lines = wrapTextToWidth(
        prev.text || "",
        maxTextWidth,
        prev.fontSize,
        prev.fontFamily,
        prev.bold,
        prev.italic
      );
      const lineHeight = (prev.fontSize || 16) * 1.2;
      const newH = Math.max(
        prev.height || 24,
        lines.length > 0 ? lineHeight * lines.length + 12 : prev.height
      );
      return { width: newW, height: newH };
    });
    reflowColumns(currentShapeId);
    return;
  }

  if (isResizing && selectedShapeId) {
    updateShape(selectedShapeId, (prev) => {
      let nx = prev.x;
      let ny = prev.y;
      let nw = prev.width || 0;
      let nh = prev.height || 24;
      const minW = 40;
      const minH = 24;

      if (resizeCorner === "br") {
        nw = Math.max(minW, offsetX - prev.x);
        nh = Math.max(minH, offsetY - prev.y);
      } else if (resizeCorner === "tr") {
        nw = Math.max(minW, offsetX - prev.x);
        nh = Math.max(minH, prev.y + (prev.height || 0) - offsetY);
        ny = Math.min(prev.y + (prev.height || 0) - minH, offsetY);
      } else if (resizeCorner === "bl") {
        nw = Math.max(minW, prev.x + (prev.width || 0) - offsetX);
        nx = Math.min(prev.x + (prev.width || 0) - minW, offsetX);
        nh = Math.max(minH, offsetY - prev.y);
      } else if (resizeCorner === "tl") {
        nw = Math.max(minW, prev.x + (prev.width || 0) - offsetX);
        nx = Math.min(prev.x + (prev.width || 0) - minW, offsetX);
        nh = Math.max(minH, prev.y + (prev.height || 0) - offsetY);
        ny = Math.min(prev.y + (prev.height || 0) - minH, offsetY);
      }

      // Auto height grow to fit current text
      const maxTextWidth = Math.max(0, nw - 12);
      const lines = wrapTextToWidth(
        prev.text || "",
        maxTextWidth,
        prev.fontSize,
        prev.fontFamily,
        prev.bold,
        prev.italic
      );
      const lineHeight = (prev.fontSize || 16) * 1.2;
      const neededH = Math.max(
        minH,
        lines.length > 0 ? lineHeight * lines.length + 12 : minH
      );
      nh = Math.max(nh, neededH);

      return { x: nx, y: ny, width: nw, height: nh };
    });
    reflowColumns(selectedShapeId);
    return;
  }

  if (selectedTool === "eraser" && isErasing) {
    eraseAt(offsetX, offsetY);
    return;
  }

  if (isDragging && selectedShapeId) {
    updateShape(selectedShapeId, (prev) => ({
      x: offsetX - dragOffset.dx,
      y: offsetY - dragOffset.dy,
    }));
    return;
  }

  if (!currentShapeId) return;

  updateShape(currentShapeId, (prev) => {
    if (prev.type === "freehand") {
      return {
        points: [...prev.points, { x: offsetX, y: offsetY }],
        color: prev.color || freehandColor, // ✅ ensure stroke uses selected color
      };
    }
    if (prev.type === "rect") {
      return { width: offsetX - prev.x, height: offsetY - prev.y };
    }
    if (prev.type === "circle") {
      const dx = offsetX - prev.cx;
      const dy = offsetY - prev.cy;
      const radius = Math.sqrt(dx * dx + dy * dy);
      return { r: radius };
    }
    if (prev.type === "line") {
      return { x2: offsetX, y2: offsetY };
    }
    return {};
  });
};


  const handleMouseUp = () => {
    setCurrentShapeId(null);
    setIsDragging(false);
    setIsResizing(false);
    if (selectedTool === "eraser") {
      setIsErasing(false);
      return;
    }
    if (isCreatingTextBox) {
      setIsCreatingTextBox(false);
      // start editing the newly created box
      if (selectedShapeId) {
        setEditingId(selectedShapeId);
        // setCaretIndex(0); // Commented out as setCaretIndex is not defined
      }
    }
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), shapes]); // clear redo history
    setHistoryIndex((prev) => prev + 1);
  };
  const commitText = () => {
    if (!editingId) return;
    const shape = shapes.find((s) => s.id === editingId);
    const trimmed = (shape?.text || "").replace(/\n+$/, "").trim();
    if (!trimmed) removeShape(editingId);
    setEditingId(null);
  };

  const cancelText = () => {
    if (!editingId) return;
    removeShape(editingId);
    setEditingId(null);
  };

  const onTextareaKeyDown = () => {};
  function eraseAt(x, y) {
    shapes.forEach((shape) => {
      if (isShapeIntersecting(shape, x, y, 20)) {
        removeShape(shape.id);
      }
    });
  }
  function isShapeIntersecting(shape, x, y, size) {
    const radius = size / 2;
    if (shape.type === "rect") {
      return (
        x + radius > shape.x &&
        x - radius < shape.x + shape.width &&
        y + radius > shape.y &&
        y - radius < shape.y + shape.height
      );
    }
    if (shape.type === "circle") {
      const dist = Math.sqrt((x - shape.cx) ** 2 + (y - shape.cy) ** 2);
      return dist < shape.r + radius;
    }
    if (shape.type === "line") {
      // Check if eraser circle intersects line segment (approximate)
      // ...implement line-circle intersection...
    }
    if (shape.type === "freehand" && shape.points) {
      return shape.points.some(
        (pt) => Math.sqrt((x - pt.x) ** 2 + (y - pt.y) ** 2) < radius
      );
    }
    // For text, use bounding box
    if (shape.type === "text") {
      return (
        x + radius > shape.x &&
        x - radius < shape.x + (shape.width || 160) &&
        y + radius > shape.y &&
        y - radius < shape.y + (shape.height || 28)
      );
    }
    return false;
  }
  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        border: "1px solid #ddd",
      }}
    >
    <svg
  ref={svgRef}
  className="w-[100%] h-[100%] border"
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
style={{
  cursor:
    selectedTool === "eraser"
      ? 'url("/images/eraser.jpg") 16 16, auto'
      : "crosshair",
}}


>


        {shapes.map((shape) => (
          <g key={shape.id}>
            {/* EDIT MODE */}
            <Shape {...shape} />
            {editingId === shape.id && shape.type === "text" ? (
              <foreignObject
                x={shape.x || 0}
                y={shape.y || 0}
                width={Math.max(40, shape.width || 200)}
                height={Math.max(24, shape.height || 32)}
              >
                <textarea
                  ref={textareaRef}
                  value={textareaValue}
                  style={{
                    width: "100%",
                    height: "100%",
                    fontSize: "16px",
                    border: "1px solid #1e90ff",
                    resize: "none",
                    background: "transparent",
                    color: "white",
                    zIndex: 100,
                  }}
                  onChange={(e) => {
                    setTextareaValue(e.target.value);
                  }}
                  onBlur={() => {
                    updateShape(shape.id, { text: textareaValue });
                    setEditingId(null); // exit edit mode
                  }}
                />
              </foreignObject>
            ) : (
              <>
                {/* VIEW MODE */}
                <text x={shape.x || 0} y={shape.y || 0}>
                  {shape.text}
                </text>
                {/* TL handle */}
                <rect
                  x={(shape.x || 0) - 8}
                  y={(shape.y || 0) - 8}
                  width={8}
                  height={8}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("tl");
                    e.stopPropagation();
                  }}
                />
                {/* TR handle */}
                <rect
                  x={(shape.x || 0) + Math.max(40, shape.width || 200) - 8}
                  y={(shape.y || 0) - 8}
                  width={8}
                  height={8}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("tr");
                    e.stopPropagation();
                  }}
                />
                {/* BL handle */}
                <rect
                  x={(shape.x || 0) - 8}
                  y={(shape.y || 0) + Math.max(24, shape.height || 32) - 8}
                  width={8}
                  height={8}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("bl");
                    e.stopPropagation();
                  }}
                />
                {/* BR handle */}
                <rect
                  x={(shape.x || 0) + Math.max(40, shape.width || 200) - 8}
                  y={(shape.y || 0) + Math.max(24, shape.height || 32) - 8}
                  width={8}
                  height={8}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("br");
                    e.stopPropagation();
                  }}
                />
              </>
            )}
          </g>
        ))}
      </svg>
      {/* no textarea overlay in pure-SVG editor */}
    </div>
  );
}



function SharePlugin({
  title,
  // saveTrigger,
  // isLoggedIn,
  // displayModal,
  // shareId,
}) {
  try {
    
    return (
      <div
        style={{
          display: "flex",
          gap: "12px",
          borderRadius: 12,
          padding: 8,
          position: "absolute",
          top: 5,
          right: 170,
          alignItems: "center",
          zIndex: 1000,
        }}
      >
       

        <SaveButton
          // saveTrigger={saveTrigger}
          title={title}
          // isLoggedIn={isLoggedIn}
          // displayModal={displayModal}
          // shareId={shareId}
        />
        {/* <ShareButton getTextContent={getTextContent} noteTitle={title} /> */}
      </div>
    );
  } catch (e) {
    console.log(e);
  }
}
// ---- TOOLBAR ----
function Toolbar() {
  const setShapes = useStore((s) => s.setShapes);
  const freehandType = useStore((s) => s.freehandType);

  const setFreehandColor = useStore((s) => s.setFreehandColor);
  const selectedTool = useStore((s) => s.selectedTool);
  const freehandColor = useStore((s) => s.freehandColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  // Image upload state
  const fileInputRef = useRef();

  // Add image to canvas
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new window.FileReader();
    reader.onload = function(ev) {
      addShape({
        id: nanoid(),
        type: "image",
        src: ev.target.result,
        x: 200,
        y: 200,
        width: 180,
        height: 120
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }
  const setShapes = useStore((s) => s.setShapes);
  const freehandType = useStore((s) => s.freehandType);
  // Image upload state
  const fileInputRef = useRef();

  // Color palette state
  const [showColorPanel, setShowColorPanel] = useState(false);
  const chosenColor = useStore((s) => s.chosenColor);
  const setChosenColor = useStore((s) => s.setChosenColor);
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const removeShape = useStore((s) => s.removeShape);
  const [showThicknessSlider, setShowThicknessSlider] = useState(false);
const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
const setFreehandStrokeWidth = useStore((s) => s.setFreehandStrokeWidth);
  const textStyle = useStore((s) => s.textStyle);
  const setTextStyle = useStore((s) => s.setTextStyle);
  const setFreehandType = useStore((s) => s.setFreehandType);
  const setTool = useStore((s) => s.setTool);
  // Eraser stroke size state
  const [eraserSize, setEraserSize] = useState(20);
  const [showThicknessPanel, setShowThicknessPanel] = useState(false);
  const freehandThickness = useStore((s) => s.freehandThickness);
  const setFreehandThickness = useStore((s) => s.setFreehandThickness);
  const freehandTools = [
    { id: "pen", icon: <Pen />, title: "Pen" },
    { id: "pencil", icon: <Pencil />, title: "Pencil" },
    { id: "brush", icon: <Brush />, title: "Brush" },
    {
      id: "color",
      icon: <Droplet />,
      title: "Color",
      onClick: () => setShowColorPicker(!showColorPicker),
    },
   {
    id: "thickness",
    icon: <SlidersHorizontal />,
    title: "Thickness",
    onClick: () => setShowThicknessSlider(!showThicknessSlider),
  },
  ];
 return (
  <div
    className="flex flex-col gap-1 bg-gray-400 absolute rounded-t-2xl
     rounded-b-2xl border-2 border-cyan-500/20 bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-lg shadow-2xl z-50 p-2 border-none
     w-25"
    style={{ top: "20vh", left: "40px" }}
  >
    {/* Main Toolbar Buttons */}
    <button
      onClick={() => setTool("freehand")}
      className="p-5 rounded-xl flex items-center justify-center border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 text-minimal-primary"
      title="Freehand"
    >
      <PencilLine />
    </button>
    <button
      onClick={() => setTool("rect")}
      className="text-minimal-primary rounded-xl flex items-center justify-center p-5 drop-shadow-sm border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20"
      title="Shapes"
    >
      <RectangleHorizontal />
    </button>
    <button
      onClick={() => setTool("text")}
      className="text-minimal-primary p-5 drop-shadow-sm border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl"
      title="Text"
    >
      <RemoveFormatting />
    </button>

    {/* Add Image Button */}
    <button
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
      className="text-minimal-primary p-5 drop-shadow-sm border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl"
      title="Add Image"
    >
      <Image />
    </button>
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={handleImageUpload}
    />

    <button
      onClick={() => setTool("eraser")}
      className="text-minimal-primary p-5 drop-shadow-sm border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl"
      title="Eraser"
    >
      <Eraser />
    </button>
    <button
      onClick={() => Canvas.handleUndo && Canvas.handleUndo()}
      className="text-minimal-primary p-5 drop-shadow-sm border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl"
      title="Undo"
    >
      ↶
    </button>
    <button
      onClick={() => Canvas.handleRedo && Canvas.handleRedo()}
      className="text-minimal-primary p-5 drop-shadow-sm border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 rounded-xl"
      title="Redo"
    >
      ↷
    </button>

  {/* Freehand Tools + Color Picker */}
{selectedTool === "freehand" && (
  <div
    className="flex flex-col gap-2 bg-gray-600 rounded-t-2xl rounded-b-2xl p-2"
    style={{ position: "absolute", left: "90px", top: 0, width: "80px", zIndex: 100 }}
    id="freehandDiv"
  >
    {freehandTools.map((t) => {
      if (t.id === "color") {
        return (
          <div
            key={t.id}
            onMouseEnter={() => setShowColorPicker(true)}
            onMouseLeave={() => setShowColorPicker(false)}
            style={{ position: "relative" }}
          >
            <button
              className={`flex justify-center items-center p-2 rounded-xl text-lg ${
                showColorPicker ? "bg-blue-500 text-white" : "bg-teal-600 text-white"
              }`}
              title={t.title}
              style={{ width: "100%", height: "40px" }} // ensures same size as others
            >
              {t.icon}
            </button>
            {showColorPicker && (
              <div
                style={{
                  position: "absolute",
                  top: "45px", // slightly below the button
                  left: 0,
                  zIndex: 9999,
                }}
              >
                <SketchPicker
                  color={freehandColor}
                  onChangeComplete={(color) => setFreehandColor(color.hex)}
                />
              </div>
            )}
          </div>
        );
      } else if (t.id === "thickness") {
    return (
      <div key={t.id} style={{ position: "relative" }}>
        <button
          onClick={t.onClick}
          className={`flex justify-center items-center p-2 rounded-xl text-lg ${
            showThicknessSlider ? "bg-blue-500 text-white" : "bg-teal-600 text-white"
          }`}
          style={{ width: "100%", height: "40px" }}
          title={t.title}
        >
          {t.icon}
        </button>
        {showThicknessSlider && (
          <div
            style={{
              position: "absolute",
              top: "45px",
              left: 0,
              zIndex: 9999,
              background: "#333",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <input
              type="range"
              min="1"
              max="20"
              value={freehandStrokeWidth}
              onChange={(e) => setFreehandStrokeWidth(Number(e.target.value))}
            />
            <div style={{ color: "white", fontSize: "12px", textAlign: "center" }}>
              {freehandStrokeWidth}px
            </div>
          </div>
        )}
      </div>
    );
  } else {
        return (
          <button
            key={t.id}
            onClick={() => setFreehandType(t.id)}
            className={`flex justify-center items-center p-2 rounded-xl text-lg ${
              freehandType === t.id ? "bg-blue-500 text-white" : "bg-teal-600 text-white"
            }`}
            style={{ width: "100%", height: "40px" }} // same as color button
            title={t.title}
          >
            {t.icon}
          </button>
        );
      }
    })}
  </div>
)}



    {/* Text Tool Panel */}
    {selectedTool === "text" && <TextPanel textStyle={textStyle} setTextStyle={setTextStyle} />}

    {/* Shapes Panel */}
    {selectedTool === "rect" && <ShapesPanel />}
  </div>
);

}
// ---- APP ----
function LexicalEditor() {
  const [title, setTitle] = useState("Title");
  const h1Ref = useRef(null);
  const shapes = useStore((s) => s.shapes);
  const setShapes = useStore((s) => s.setShapes);
  const selectedNote = localStorage.getItem("selectedNote");
  const handleInput = (e) => {
    setTitle(e.currentTarget.textContent);
  };
  useEffect(() => {
    useStore.getState().setShapes([]);
    // Step 1: Get the selectedNote from localStorage
    if (selectedNote) {
      try {
        if (selectedNote) {
          // Step 2: Convert string to JS object
          const noteObj = JSON.parse(selectedNote);
          setTitle(noteObj.title);
          // Step 3: Extract shapes
          const savedShapes = noteObj.shapes || [];

          // Step 4: Set to your canvas state
          setShapes(savedShapes);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);
  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.textContent = typeof title === "string" ? title : "";
      // Move caret to end of contentEditable after updating text
      const el = h1Ref.current;
      if (document.activeElement === el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // move to end
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [title]);
  return (
    <div className="relative">
      <div
        className="flex flex-col items-center relative border-black
      border border-cyan-900/60 bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200"
      >
  <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent"></div>
  <div className="absolute inset-0 opacity-40 pointer-events-none bg-gradient-to-br from-black to-black"></div>
        <UpdatedDashboard2 />
        
        <SharePlugin title={title} />
        <Toolbar />
        <Canvas />
      </div>
    </div>
  );
}

export default LexicalEditor;