import { useRef, useState } from "react";
import { create } from "zustand";
import { nanoid } from "nanoid";
import { useEffect } from "react";
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
  freehandThickness: 2,
  setFreehandThickness: (thick) => set({ freehandThickness: thick }),
  chosenColor: "#23b5b5",
  setChosenColor: (color) => set({ chosenColor: color }),
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
        strokeWidth={strokeW ?? 2}
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
        {/* {(text && (
          <>
            <rect
              x={x}
              y={y}
              width={boxW}
              height={boxH}
              fill="none"
              stroke="rgba(0,0,0,0.25)"
              strokeDasharray="4 4"
            />
            <g clipPath={`url(#${clipId})`}>
              <text
                x={x + 6}
                y={y + (fontSize || 16) + 6}
                fill={color || "#000"}
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={bold ? "700" : "400"}
                fontStyle={italic ? "italic" : "normal"}
              >
                {lines.map((line, idx) => (
                  <tspan key={idx} x={x + 6} dy={idx === 0 ? 0 : lineHeight}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          </>
        )) ||
          null} */}
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
  // Undo/redo history
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);

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
  // global key handling when editing
  // useEffect(() => {
  //   const handler = (e) => {
  //     if (!editingId) return;
  //     const shape = shapes.find((s) => s.id === editingId);
  //     if (!shape) return;
  //     let text = shape.text || "";
  //     const insertChar = (ch) => {
  //       const before = text.slice(0, caretIndex);
  //       const after = text.slice(caretIndex);
  //       text = before + ch + after;
  //       // If inserting a newline, move caret to start of next line
  //       if (ch === "\n") {
  //         setCaretIndex(caretIndex + 1);
  //       } else {
  //         setCaretIndex(caretIndex + ch.length);
  //       }
  //     };
  //     if (e.key === "Backspace") {
  //       e.preventDefault();
  //       if (caretIndex > 0) {
  //         const before = text.slice(0, caretIndex - 1);
  //         const after = text.slice(caretIndex);
  //         text = before + after;
  //         setCaretIndex(caretIndex - 1);
  //       }
  //     } else if (e.key === "Delete") {
  //       e.preventDefault();
  //       const before = text.slice(0, caretIndex);
  //       const after = text.slice(caretIndex + 1);
  //       text = before + after;
  //     } else if (e.key === "Enter") {
  //       e.preventDefault();
  //       const before = text.slice(0, caretIndex);
  //       const after = text.slice(caretIndex);
  //       text = before + "\n" + after;
  //       const lines = before.split("\n");
  //       const currentLine = lines[lines.length - 1]; // text before caret in current line

  //       let caretXOffset = 0;
  //       for (let ch of currentLine) {
  //         caretXOffset += measureTextWidth(
  //           ch,
  //           shape.fontSize,
  //           shape.fontFamily,
  //           shape.bold,
  //           shape.italic
  //         );
  //       }
  //       // Now decide where to place caret in the new line
  //       const newLine = after.split("\n")[0]; // text immediately after caret, before next \n
  //       let newCaretIndexInLine = 0;
  //       let x = 0;
  //       for (let i = 0; i < newLine.length; i++) {
  //         const w = measureTextWidth(
  //           newLine[i],
  //           shape.fontSize,
  //           shape.fontFamily,
  //           shape.bold,
  //           shape.italic
  //         );
  //         if (x + w / 2 >= caretXOffset) {
  //           break; // found closest spot
  //         }
  //         x += w;
  //         newCaretIndexInLine++;
  //       }
  //       const newCaretIndex = before.length + 1 + newCaretIndexInLine;
  //       setCaretIndex(newCaretIndex);
  //     } else if (e.key === "ArrowLeft") {
  //       e.preventDefault();
  //       if (caretIndex > 0) setCaretIndex(caretIndex - 1);
  //     } else if (e.key === "ArrowRight") {
  //       e.preventDefault();
  //       if (caretIndex < text.length) setCaretIndex(caretIndex + 1);
  //     } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
  //       e.preventDefault();
  //       insertChar(e.key);
  //     } else if (e.key === "Escape") {
  //       e.preventDefault();
  //       setEditingId(null);
  //       return;
  //     } else {
  //       return;
  //     }
  //     updateShape(editingId, { text });
  //     // reflow columns after each edit step
  //     reflowColumns(editingId);
  //   };
  //   window.addEventListener("keydown", handler);
  //   return () => window.removeEventListener("keydown", handler);
  // }, [editingId, caretIndex, shapes, updateShape]);

  // Hide caret when clicking outside the SVG/textbox
  // useEffect(() => {
  //   const handleClick = (e) => {
  //     // Only hide caret if editing and click is outside SVG
  //     // if (editingId && svgRef.current && !svgRef.current.contains(e.target)) {
  //     //   setEditingId(null);
  //     // }
  //   };
  //   document.addEventListener("mousedown", handleClick);
  //   return () => document.removeEventListener("mousedown", handleClick);
  // }, [editingId]);
  // text measurement helper
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
      const freehandThickness = useStore.getState().freehandThickness;
      let strokeW = freehandThickness || 2;
      let opacity = 1;
      
      // Different tools can have different opacity effects
      if (freehandType === "brush") {
        opacity = 0.7; // semi-transparent for brush effect
      } else if (freehandType === "highlighter") {
        opacity = 0.4;
      } else if (freehandType === "marker") {
        opacity = 0.6;
      }
      
      const newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x: offsetX, y: offsetY }],
        color: chosenColor,
        strokeW: strokeW,
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
        return { points: [...prev.points, { x: offsetX, y: offsetY }] };
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
              ? `url(${eraserCursor}), auto`
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
function SaveButton({ title }) {
  // const [editor] = useLexicalComposerContext();
  const [isSaved, setIsSaved] = useState(false);
  const shapes = useStore((s) => s.shapes);
  const selectedNote = localStorage.getItem("selectedNote");
  const handleSaveNewNote = (e) => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];

    const newNote = {
      id: Date.now().toString(), // unique id
      title,
      lastModified: new Date().toISOString(),
      shapes, // <-- your canvas state
    };

    // Add new note to notes array
    notes.push(newNote);

    // Save back to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));

    alert("Note saved successfully!");
  };
  const editNote = (e) => {
    console.log(title);
    const notes = localStorage.getItem("notes");
    const notesArray = JSON.parse(notes);
    const selectedNoteObj = JSON.parse(selectedNote);
    const updatedNotes = notesArray.map((note) => {
      if (note.id == selectedNoteObj.id) {
        return { ...selectedNoteObj, title, shapes };
      }
      return note;
    });
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    alert("Done!");
  };
  return (
    <button
      onClick={selectedNote ? editNote : handleSaveNewNote}
      style={{
        position: "absolute",
        top: "15px",
        right: "30px",
        height: 40,
        minWidth: 80,
        padding: "25px 18px",
        fontWeight: 500,
        color: "white",
        background: "teal",
        // border: `2px solid ${isSaved ? "blue" : "black"}`,
        border: "none",
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isSaved ? "default" : "pointer",
        transition: "color 0.3s ease, border-color 0.3s ease",
        zIndex: 100,
      }}
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
// Share Button component
function ShareButton({ getTextContent, noteTitle }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [exportJpg, setExportJpg] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [disableShare, setDisableShare] = useState(false);
  // Generate sharable link only once when menu opens
  const generateLink = () => {
    const content = getTextContent();
    saveNoteToTasks(content);
    const id = uuidv4();

    // Try to capture current pen drawing (if any) by querying tagged canvas
    let penDataUrl = "";
    try {
      const canvases = document.querySelectorAll("[data-pen-canvas='true']");
      if (canvases && canvases.length > 0) {
        const targetCanvas = canvases[canvases.length - 1]; // prefer the last/most recent
        if (targetCanvas && typeof targetCanvas.toDataURL === "function") {
          penDataUrl = targetCanvas.toDataURL("image/png");
        }
      }
    } catch (err) {
      console.warn("Unable to capture pen canvas:", err);
    }

    // Build combined payload for cross-field sharing
    const payload = { title: noteTitle, text: content, penDataUrl };

    // Save note to localStorage (new combined key)
    try {
      localStorage.setItem(`shared_note_${id}`, JSON.stringify(payload));
    } catch (e) {
      console.warn(
        "Failed to save combined share payload, falling back to text-only."
      );
    }

    // Back-compat: also store text-only for existing consumers
    localStorage.setItem(`shared_content_${id}`, content);

    // Construct link
    const link = `${window.location.origin}${window.location.pathname}?shareId=${id}`;
    setShareLink(link);
  };

  // Check if shared link is opened
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("shareId");

    if (shareId) {
      // Prefer combined payload if available
      const combined = localStorage.getItem(`shared_note_${shareId}`);
      if (combined) {
        try {
          const parsed = JSON.parse(combined);

          if (parsed && parsed.penDataUrl) {
            // Render passive overlay canvas with the shared drawing
            const overlay = document.createElement("img");
            overlay.src = parsed.penDataUrl;
            overlay.alt = "shared-pen-overlay";
            overlay.style.position = "fixed";
            overlay.style.top = "150px";
            overlay.style.left = "290px";
            overlay.style.width = "50vw";
            overlay.style.height = "50vh";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "59"; // just below live pen canvas (60)
            document.body.appendChild(overlay);
          }
        } catch (e) {
          console.warn("Failed to parse shared payload:", e);
        }
        setDisableShare(true);
      }
    }
  }, []);
  function saveNoteToTasks(content) {
    // Assume first line = title, rest = text
    const lines = content.split("\n");
    const title = String(content.split("\n")[0] || "Untitled");
    const text = lines.slice(1).join("\n") || lines[0];

    // Build task object
    const newTask = {
      id: Date.now(), // or uuidv4()
      title: noteTitle,
      content: text,
      lastModified: new Date().toISOString(),
      tag: "General",
      favorite: false,
    };

    // Load existing tasks
    let tasks = [];
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        tasks = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to parse tasks:", e);
    }

    // Push and save back
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = async () => {
    const filename = "notes.txt";
    const blob = new Blob([getTextContent()], { type: "text/plain" });

    if (exportPdf) {
      const doc = new jsPDF();
      doc.text(getTextContent(), 10, 10);
      doc.save("notes.pdf");
      return;
    }

    if (exportJpg) {
      const node = document.getElementById("notes-container");
      const dataUrl = await toJpeg(node);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "notes.jpg";
      a.click();
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          setShowMenu((v) => !v);
          if (!showMenu) generateLink();
        }}
        style={{
          height: 40,
          minWidth: 80,
          padding: "0 18px",
          fontWeight: 500,
          color: "#a5f1ea",
          background: "transparent",
          border: "2px solid #20e3d7",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#00fff7")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#a5f1ea")}
        disabled={disableShare}
      >
        Share
        <ArrowUpRight size={20} style={{ marginLeft: 8, color: "#63e3db" }} />
      </button>

      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: 46,
            left: 0,
            minWidth: 250,
            background: "#0c2e32",
            border: `2px solid #20e3d7`,
            borderRadius: 15,
            color: "#e0f7f6",
            padding: "16px 18px 12px 18px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              fontWeight: 500,
              fontSize: 18,
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Share
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#043138",
              borderRadius: 8,
              padding: "4px 6px",
              marginBottom: 14,
            }}
          >
            <input
              type="text"
              readOnly
              value={shareLink}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                color: "#c5f9ee",
                padding: "6px 3px",
                fontSize: 15,
                outline: "none",
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#63e3db",
                padding: 0,
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00fff7")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#63e3db")}
            >
              <Link2 size={20} />
            </button>
          </div>

          {copied && (
            <div
              style={{
                color: "#22ee99",
                textAlign: "right",
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              Copied!
            </div>
          )}

          <div style={{ fontSize: 14, marginBottom: 7, color: "#a5f1ea" }}>
            Export as : &nbsp;
            <label style={{ marginRight: 10 }}>
              Pdf
              <input
                type="checkbox"
                checked={exportPdf}
                onChange={() => {
                  setExportPdf(!exportPdf);
                  if (!exportPdf) setExportJpg(false);
                }}
                style={{ marginLeft: 4 }}
              />
            </label>
            <label>
              Jpg
              <input
                type="checkbox"
                checked={exportJpg}
                onChange={() => {
                  setExportJpg(!exportJpg);
                  if (!exportJpg) setExportPdf(false);
                }}
                style={{ marginLeft: 4 }}
              />
            </label>
          </div>

          <button
            onClick={handleDownload}
            style={{
              width: "100%",
              border: `2px solid #20e3d7`,
              color: "#c5f9ee",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 16,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              marginTop: 8,
              cursor: "pointer",
              backgroundColor: "transparent",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "rgba(15, 249, 204, 0.15)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            Download <Download size={19} />
          </button>
        </div>
      )}
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
    // const [editor] = useLexicalComposerContext();
    // const getTextContent = () => {
    //   let text = "";
    //   editor.getEditorState().read(() => {
    //     text = $getRoot().getTextContent();
    //   });
    //   return text;
    // };
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
  // Add image to canvas (must be before hooks and JSX)
  function handleImageUpload(e) {
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
  const selectedTool = useStore((s) => s.selectedTool);
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
    { id: "thickness", icon: <SlidersHorizontal />, title: "Thickness" },
  ];
  return (
    <div
      className="flex flex-col gap-1 bg-gray-400 absolute rounded-t-2xl rounded-b-2xl border-2 border-cyan-500/20 bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-lg shadow-2xl z-50 p-2 border-none w-25"
      style={{ top: "20vh", left: "40px" }}
    >
      <button
        onClick={() => setTool("freehand")}
  className="p-5 rounded-xl flex items-center justify-center border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary text-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        title="Freehand"
      >
        <PencilLine />
      </button>
      <button
        onClick={() => setTool("rect")}
  className="text-minimal-primary rounded-xl flex items-center justify-center p-5 drop-shadow-sm border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        title="Shapes"
      >
        <RectangleHorizontal />
      </button>
      <button
        onClick={() => setTool("text")}
  className="text-minimal-primary p-5 drop-shadow-sm border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 rounded-xl"
        title="Text"
      >
        <RemoveFormatting />
      </button>

      {/* Add Image button */}
      <button
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className="p-5 rounded-xl flex items-center justify-center border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary text-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
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
        className="p-5 rounded-xl flex items-center justify-center border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary text-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        title="Eraser"
      >
        <Eraser />
      </button>

      {/* Color palette button (last box) */}
      <div className="relative">
        <button
          onClick={() => setShowColorPanel((v) => !v)}
          className="p-5 rounded-xl flex items-center justify-center border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary text-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 relative"
          title="Choose Color"
        >
          <Droplet />
          <span
            style={{
              position: "absolute",
              bottom: "4px",
              right: "4px",
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: chosenColor,
              border: "1px solid #fff",
              boxShadow: "0 0 2px #0002",
            }}
          />
        </button>
        {/* Color picker panel */}
        {showColorPanel && (
          <div
            style={{
              position: "absolute",
              top: 55,
              left: 0,
              background: "#222",
              border: "2px solid #23b5b5",
              borderRadius: 10,
              padding: 10,
              zIndex: 100,
              minWidth: 90,
              boxShadow: "0 2px 8px #0005",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="color"
              value={chosenColor}
              onChange={(e) => {
                setChosenColor(e.target.value);
                setTextStyle((prev) => ({ ...prev, color: e.target.value }));
              }}
              style={{ width: 40, height: 40, border: "none", borderRadius: 8, cursor: "pointer" }}
            />
            <button
              onClick={() => setShowColorPanel(false)}
              style={{
                marginTop: 4,
                padding: "2px 10px",
                borderRadius: 6,
                background: "#23b5b5",
                color: "#fff",
                border: "none",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </div>
      {/* Undo/Redo buttons */}
      <button
        onClick={() => Canvas.handleUndo && Canvas.handleUndo()}
        className="p-5 rounded-xl flex items-center justify-center border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary text-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        title="Undo"
      >
        ↶
      </button>
      <button
        onClick={() => Canvas.handleRedo && Canvas.handleRedo()}
        className="p-5 rounded-xl flex items-center justify-center border transition-all duration-200 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary text-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 hover:ring-2 hover:ring-cyan-200 hover:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        title="Redo"
      >
        ↷
      </button>
      {selectedTool === "freehand" && (
        <div
          className="flex flex-col gap-3 rounded-t-2xl rounded-b-2xl p-2 bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-lg shadow-2xl"
          style={{ position: "absolute", left: "90px", width: "60px" }}
          id="freehandDiv"
        >
          {freehandTools.map((t) => (
            t.id === "thickness" ? (
              <div key={t.id} style={{ position: "relative" }}>
                <button
                  onClick={() => setShowThicknessPanel((v) => !v)}
                  className={`flex justify-center items-center p-2 rounded-xl text-lg transform hover:scale-105 border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 text-minimal-primary hover:bg-blue-600
                    ${showThicknessPanel ? "bg-blue-500 text-white" : ""}`}
                  title={t.title}
                >
                  {t.icon}
                </button>
                {showThicknessPanel && (
                  <div style={{
                    position: "absolute",
                    left: "110%",
                    top: 0,
                    background: "#222",
                    border: "2px solid #23b5b5",
                    borderRadius: 10,
                    padding: 14,
                    zIndex: 100,
                    minWidth: 120,
                    boxShadow: "0 2px 8px #0005",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}>
                    <label style={{ color: '#a5f1ea', marginBottom: 6 }}>Thickness</label>
                    <input
                      type="range"
                      min={1}
                      max={16}
                      value={freehandThickness}
                      onChange={e => setFreehandThickness(Number(e.target.value))}
                      style={{ width: 80, accentColor: '#23b5b5' }}
                    />
                    <div style={{ color: '#fff', fontSize: 13, marginTop: 2 }}>{freehandThickness}px</div>
                  </div>
                )}
              </div>
            ) : (
              <button
                key={t.id}
                onClick={() => {
                  setFreehandType(t.id);
                }}
                className={`flex justify-center items-center p-2 rounded-xl text-lg transform hover:scale-105 border transition-all duration-300 group bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-minimal-primary hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20 text-minimal-primary hover:bg-blue-600
            ${freehandType === t.id ? "bg-blue-500 text-white" : ""}`}
                title={t.title}
              >
                {t.icon}
              </button>
            )
          ))}
        </div>
      )}
      {selectedTool === "text" && (
        <div
          style={{
            position: "absolute",
            left: "90px",
            top: 100,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            padding: 14,
            zIndex: 100,
            minWidth: 240,
            background: "#0c2e32",
            border: "2px solid #20e3d7",
            borderRadius: 12,
            boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
            color: "#e0f7f6",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              fontSize: 16,
              textAlign: "left",
              color: "#a5f1ea",
              marginBottom: 4,
            }}
          >
            Text Style
          </div>

          {/* Font Family */}
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: "#a5f1ea" }}>
              Font
            </label>
            <select
              value={textStyle.fontFamily}
              onChange={(e) =>
                setTextStyle((prev) => ({
                  ...prev,
                  fontFamily: e.target.value,
                }))
              }
              style={{
                background: "#043138",
                color: "#c5f9ee",
                border: "1px solid #20e3d7",
                borderRadius: 8,
                padding: "8px 10px",
                outline: "none",
              }}
            >
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Georgia</option>
              <option>Courier New</option>
            </select>
          </div>

          {/* Font Size + Color */}
          <div className="flex flex-row gap-4">
            {/* Font Size */}
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: "#a5f1ea" }}>
                Size
              </label>
              <input
                type="number"
                value={textStyle.fontSize}
                min={8}
                max={200}
                onChange={(e) =>
                  setTextStyle((prev) => ({
                    ...prev,
                    fontSize: Number(e.target.value),
                  }))
                }
                style={{
                  width: 90,
                  background: "#043138",
                  color: "#c5f9ee",
                  border: "1px solid #20e3d7",
                  borderRadius: 8,
                  padding: "8px 10px",
                  outline: "none",
                }}
              />
            </div>

            {/* Text Color */}
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: "#a5f1ea" }}>
                Color
              </label>
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) =>
                  setTextStyle((prev) => ({ ...prev, color: e.target.value }))
                }
                style={{
                  width: 48,
                  height: 36,
                  background: "#043138",
                  border: "1px solid #20e3d7",
                  borderRadius: 8,
                  padding: 0,
                  cursor: "pointer",
                }}
                title="Text color"
              />
            </div>
          </div>

          {/* Bold + Italic */}
          <div className="flex flex-row gap-3">
            {/* Bold */}
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: "#a5f1ea" }}>
                Bold
              </label>
              <button
                onClick={() =>
                  setTextStyle((prev) => ({ ...prev, bold: !prev.bold }))
                }
                style={{
                  border: `2px solid ${textStyle.bold ? "#00fff7" : "#20e3d7"}`,
                  background: textStyle.bold
                    ? "rgba(15, 249, 204, 0.15)"
                    : "transparent",
                  color: "#c5f9ee",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontWeight: 800,
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(15, 249, 204, 0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = textStyle.bold
                    ? "rgba(15, 249, 204, 0.15)"
                    : "transparent")
                }
              >
                B
              </button>
            </div>

            {/* Italic */}
            <div className="flex flex-col gap-1">
              <label className="text-sm" style={{ color: "#a5f1ea" }}>
                Italic
              </label>
              <button
                onClick={() =>
                  setTextStyle((prev) => ({ ...prev, italic: !prev.italic }))
                }
                style={{
                  border: `2px solid ${
                    textStyle.italic ? "#00fff7" : "#20e3d7"
                  }`,
                  background: textStyle.italic
                    ? "rgba(15, 249, 204, 0.15)"
                    : "transparent",
                  color: "#c5f9ee",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontStyle: "italic",
                  transition:
                    "background-color 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "rgba(15, 249, 204, 0.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = textStyle.italic
                    ? "rgba(15, 249, 204, 0.15)"
                    : "transparent")
                }
              >
                I
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedTool == "rect" && <ShapesPanel />}
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
        <div
          className="h-auto w-auto border rounded-md pt-2 absolute top-[15px] left-[40px] z-50 flex flex-col"
          style={{
            border: "2px solid #23b5b5",
            marginBottom: "20px",
            minWidth: "100px",
          }}
        >
          <h1
            className="editable-title mb-2"
            ref={h1Ref}
            contentEditable
            suppressContentEditableWarning={true}
            spellCheck={false}
            onKeyDown={(e) => handleInput(e)}
            style={{
              cursor: "text",
              textAlign: "center",
              fontSize: "1.3rem",
              fontWeight: 400,
              fontFamily: "sans-serif",
              color: "#23b5b5",
              padding: "0 16px",
              borderRadius: "0px", // 👈 no rounded corners
              border: "none", // 👈 removed border
              outline: "none",
              userSelect: "text",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            aria-label="Notes Title"
          />
        </div>
        <SharePlugin title={title} />
        <Toolbar />
        <Canvas />
      </div>
    </div>
  );
}

export default LexicalEditor;