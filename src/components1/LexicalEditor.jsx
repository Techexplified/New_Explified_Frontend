import { useRef, useState } from "react";
import { create } from "zustand";
import { nanoid } from "nanoid";
import { useEffect } from "react";
import React from "react";
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
    color: "#000000",
  },
  setTextStyle: (partial) =>
    set((state) => ({ textStyle: { ...state.textStyle, ...partial } })),
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
      className="p-2 bg-white rounded-md flex flex-col gap-2 w-60"
      style={{
        position: "absolute",
        left: "-500px",
        top: 100,
        marginLeft: 12,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          className={`appearance-none px-3 py-1 rounded w-full text-left border-2 border-black ${
            selectedTool === t.id
              ? "bg-blue-500 text-white"
              : "bg-white text-black"
          }`}
        >
          {t.label}
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
        stroke="black"
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
        stroke="black"
        fill="transparent"
      />
    );
  } else if (type === "line") {
    return <line key={id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" />;
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
        {(text && (
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
          null}
      </g>
    );
  }
  return null;
}

// ---- CANVAS ----
function Canvas() {
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const removeShape = useStore((s) => s.removeShape);
  const selectedTool = useStore((s) => s.selectedTool);
  const textStyle = useStore((s) => s.textStyle);
  const selectedShapeId = useStore((s) => s.selectedShapeId);
  const setSelectedShapeId = useStore((s) => s.setSelectedShapeId);
  const [currentShapeId, setCurrentShapeId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [caretIndex, setCaretIndex] = useState(0);
  const [showCaret, setShowCaret] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null); // 'tl' | 'tr' | 'bl' | 'br'
  const [isCreatingTextBox, setIsCreatingTextBox] = useState(false);
  const containerRef = useRef(null);
  const measureCanvasRef = useRef(null);
  const svgRef = useRef(null);
  // caret blink
  useEffect(() => {
    const t = setInterval(() => setShowCaret((v) => !v), 600);
    return () => clearInterval(t);
  }, []);
  // global key handling when editing
  useEffect(() => {
    const handler = (e) => {
      if (!editingId) return;
      const shape = shapes.find((s) => s.id === editingId);
      if (!shape) return;
      let text = shape.text || "";
      const insertChar = (ch) => {
        const before = text.slice(0, caretIndex);
        const after = text.slice(caretIndex);
        text = before + ch + after;
        setCaretIndex(caretIndex + ch.length);
      };
      if (e.key === "Backspace") {
        e.preventDefault();
        if (caretIndex > 0) {
          const before = text.slice(0, caretIndex - 1);
          const after = text.slice(caretIndex);
          text = before + after;
          setCaretIndex(caretIndex - 1);
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        const before = text.slice(0, caretIndex);
        const after = text.slice(caretIndex + 1);
        text = before + after;
      } else if (e.key === "Enter") {
        e.preventDefault();
        insertChar("\n");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (caretIndex > 0) setCaretIndex(caretIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        if (caretIndex < text.length) setCaretIndex(caretIndex + 1);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        insertChar(e.key);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setEditingId(null);
        return;
      } else {
        return;
      }
      updateShape(editingId, { text });
      // reflow columns after each edit step
      reflowColumns(editingId);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editingId, caretIndex, shapes, updateShape]);
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
    const capacity = Math.max(
      1,
      Math.floor(Math.max(24, root.height || 24) - padding) / lineHeight
    );

    // compute columns needed
    const columns = [];
    let idx = 0;
    while (idx < lines.length) {
      columns.push(lines.slice(idx, idx + capacity));
      idx += capacity;
    }
    if (columns.length === 0) columns.push([""]);

    // gather existing children for this root
    const children = all.filter(
      (s) => s.parentId === rootId && s.type === "text"
    );

    // update/create columns
    columns.forEach((colLines, colIndex) => {
      const text = colLines.join("\n");
      const y = root.y + colIndex * ((root.height || 0) + gap);
      const x = root.x;
      if (colIndex === 0) {
        updateShape(root.id, { text });
      } else {
        const existing = children.find((c) => c.columnIndex === colIndex);
        if (existing) {
          updateShape(existing.id, {
            x,
            y,
            width: root.width,
            height: root.height,
            text,
          });
        } else {
          addShape({
            id: nanoid(),
            type: "text",
            parentId: rootId,
            columnIndex: colIndex,
            x,
            y,
            width: root.width,
            height: root.height,
            text,
            fontFamily: root.fontFamily,
            fontSize: root.fontSize,
            bold: root.bold,
            italic: root.italic,
            color: root.color,
          });
        }
      }
    });

    // remove extra children beyond needed
    children.forEach((c) => {
      if (c.columnIndex >= columns.length) removeShape(c.id);
    });
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
        setEditingId(null);
        setCaretIndex(0);
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
      setCurrentShapeId(id);
      setIsCreatingTextBox(true);
      e.stopPropagation();
    }
    if (selectedTool === "freehand") {
      const newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x: offsetX, y: offsetY }],
        color: "black",
        strokeWidth: 2,
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
        color: "black",
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
        color: "black",
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
        color: "black",
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
    if (isCreatingTextBox) {
      setIsCreatingTextBox(false);
      // start editing the newly created box
      if (selectedShapeId) {
        setEditingId(selectedShapeId);
        setCaretIndex(0);
      }
    }
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
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100%",
        border: "1px solid #ddd",
      }}
    >
      <svg
        ref={svgRef}
        className="w-[100%] h-[100%] bg-white border"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {shapes.map((shape) => (
          <g
            key={shape.id}
            onMouseDown={(e) => {
              if (shape.type === "text") {
                const { offsetX, offsetY } = e.nativeEvent;
                setIsDragging(true);
                setSelectedShapeId(shape.id);
                setDragOffset({
                  dx: offsetX - (shape.x || 0),
                  dy: offsetY - (shape.y || 0),
                });
                e.stopPropagation();
              }
            }}
            onDoubleClick={(e) => {
              if (shape.type === "text") {
                setSelectedShapeId(shape.id);
                setEditingId(shape.id);
                const containerRect =
                  containerRef.current.getBoundingClientRect();
                const svgRect = svgRef.current.getBoundingClientRect();
                const left = svgRect.left - containerRect.left + (shape.x || 0);
                const top = svgRect.top - containerRect.top + (shape.y || 0);
                setTextareaPos({ left, top });
                setTextareaValue(shape.text || "");
                e.stopPropagation();
              }
            }}
          >
            <Shape {...shape} />
            {selectedShapeId === shape.id && shape.type === "text" && (
              <>
                {/* four corner resize handles */}
                <rect
                  x={(shape.x || 0) - 8}
                  y={(shape.y || 0) - 8}
                  width={16}
                  height={16}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("tl");
                    e.stopPropagation();
                  }}
                />
                <rect
                  x={(shape.x || 0) + Math.max(40, shape.width || 200) - 8}
                  y={(shape.y || 0) - 8}
                  width={16}
                  height={16}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("tr");
                    e.stopPropagation();
                  }}
                />
                <rect
                  x={(shape.x || 0) - 8}
                  y={(shape.y || 0) + Math.max(24, shape.height || 32) - 8}
                  width={16}
                  height={16}
                  fill="#1e90ff"
                  stroke="#0b5cb7"
                  onMouseDown={(e) => {
                    setSelectedShapeId(shape.id);
                    setIsResizing(true);
                    setResizeCorner("bl");
                    e.stopPropagation();
                  }}
                />
                <rect
                  x={(shape.x || 0) + Math.max(40, shape.width || 200) - 8}
                  y={(shape.y || 0) + Math.max(24, shape.height || 32) - 8}
                  width={16}
                  height={16}
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
            {editingId === shape.id &&
              showCaret &&
              (() => {
                const text = shape.text || "";
                const lines = text.split("\n");
                const maxWidth = Math.max(40, shape.width || 160) - 12; // padding 6+6
                const fontPx = shape.fontSize || 16;
                const lineHeight = fontPx * 1.2;
                // compute caret position by walking characters
                let remaining = caretIndex;
                let caretLine = 0;
                let caretX = shape.x + 6;
                let caretY = shape.y + 6;
                for (let i = 0; i < lines.length; i++) {
                  const line = lines[i];
                  const chars = line.split("");
                  let x = 0;
                  for (let j = 0; j <= chars.length; j++) {
                    if (remaining === 0) {
                      caretLine = i;
                      caretX = shape.x + 6 + x;
                      caretY =
                        shape.y + (fontPx || 16) + 6 + i * lineHeight - fontPx; // top of line box
                      break;
                    }
                    const ch = chars[j] || "";
                    const w = measureTextWidth(
                      ch,
                      fontPx,
                      shape.fontFamily,
                      shape.bold,
                      shape.italic
                    );
                    x += w;
                    remaining--;
                  }
                  if (remaining === 0) break;
                }
                const caretHeight = fontPx;
                return (
                  <rect
                    x={caretX}
                    y={caretY}
                    width={1}
                    height={caretHeight}
                    fill={shape.color || "#000"}
                    opacity={0.9}
                  />
                );
              })()}
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
  // // const getTextContent = () => {
  //   let text = "";
  //   editor.getEditorState().read(() => {
  //     text = $getRoot().getTextContent();
  //   });
  //   return text;
  // };
  // const isNewNote = !localStorage.getItem("selectedTaskId") && !shareId;
  // const handleEditNote = () => {
  //   const selectedTaskId = localStorage.getItem("selectedTaskId");
  //   const content = getTextContent();
  //   const text = content;
  //   let tasks = [];
  //   try {
  //     const stored = localStorage.getItem("tasks");
  //     if (stored) tasks = JSON.parse(stored);
  //   } catch (e) {
  //     tasks = [];
  //   }
  //   const selectedTask = tasks.filter(
  //     (t) => t.id === Number(selectedTaskId)
  //   )[0];
  //   const otherTasks = tasks.filter((t) => t.id !== Number(selectedTaskId));
  //   otherTasks.push({
  //     ...selectedTask,
  //     title: title,
  //     content: text,
  //     lastModified: new Date().toISOString(),
  //   });
  //   localStorage.setItem("tasks", JSON.stringify(otherTasks));
  //   setIsSaved(true);
  //   setTimeout(() => setIsSaved(false), 1000);

  //   React.useEffect(() => {
  //     setIsSaved(false);
  //   }, [saveTrigger, title]);
  // };
  //const handleSaveNewNote = () => {
  // const content = getTextContent();
  // const text = content;
  // const newTask = {
  //   id: Date.now(),
  //   title: title || "Untitled",
  //   content: text,
  //   lastModified: new Date().toISOString(),
  // };
  // let tasks = [];
  // try {
  //   const stored = localStorage.getItem("tasks");
  //   if (stored) tasks = JSON.parse(stored);
  // } catch (e) {
  //   tasks = [];
  // }
  // tasks.push(newTask);
  // localStorage.setItem("tasks", JSON.stringify(tasks));
  // setIsSaved(true);
  // setTimeout(() => setIsSaved(false), 1000);
  // setIsSaved(true);
  // React.useEffect(() => {
  //   setIsSaved(false);
  // }, [title]);
  //};
  // onClick={
  //   handleSaveNewNote
  // }
  return (
    <button
      onClick={selectedNote ? editNote : handleSaveNewNote}
      style={{
        position: "absolute",
        top: "0px",
        right: "30px",
        height: 40,
        minWidth: 80,
        padding: "25px 18px",
        fontWeight: 500,
        color: isSaved ? "blue" : "black",
        background: "transparent",
        border: `2px solid ${isSaved ? "blue" : "black"}`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isSaved ? "default" : "pointer",
        transition: "color 0.3s ease, border-color 0.3s ease",
        zIndex: 100,
      }}
      onMouseEnter={(e) => !isSaved && (e.currentTarget.style.color = "blue")}
      onMouseLeave={(e) => !isSaved && (e.currentTarget.style.color = "black")}
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
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const removeShape = useStore((s) => s.removeShape);
  const selectedTool = useStore((s) => s.selectedTool);
  const textStyle = useStore((s) => s.textStyle);
  const setTextStyle = useStore((s) => s.setTextStyle);
  const setTool = useStore((s) => s.setTool);
  return (
    <div className="w-[33vw] flex justify-center gap-2 p-2 bg-gray-200 absolute top-2 z-50">
      <button
        onClick={() => setTool("freehand")}
        className="text-black p-2 drop-shadow-sm"
      >
        ✏️ Freehand
      </button>
      <button
        onClick={() => setTool("rect")}
        className="text-black p-2 drop-shadow-sm"
      >
        ▭ Shapes
      </button>
      <button
        onClick={() => setTool("text")}
        className="text-black p-2 drop-shadow-sm"
      >
        🔤 Text
      </button>
      {selectedTool === "text" && (
        <div
          style={{
            position: "absolute",
            left: "-500px",
            top: 100,
            display: "flex",
            flexDirection: "column", // 👈 stack vertically
            gap: 12,
            padding: 12,
            zIndex: 100,
            borderRadius: 6,
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            minWidth: 180,
          }}
        >
          <div className="flex flex-col gap-1 text-black">
            <label className="text-sm font-medium text-black">Font</label>
            <select
              value={textStyle.fontFamily}
              onChange={(e) => setTextStyle({ fontFamily: e.target.value })}
              className="border border-gray-400 rounded px-2 py-1 bg-white text-black"
            >
              <option>Arial</option>
              <option>Times New Roman</option>
              <option>Georgia</option>
              <option>Courier New</option>
            </select>
          </div>

          {/* Font Size  + Color*/}
          <div className="flex flex-row gap-4 text-black">
            {/* Font Size */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Size</label>
              <input
                type="number"
                value={textStyle.fontSize}
                min={8}
                max={200}
                onChange={(e) =>
                  setTextStyle({ fontSize: Number(e.target.value) })
                }
                className="w-20 border border-gray-400 rounded px-2 py-1 bg-white"
              />
            </div>

            {/* Text Color */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Color</label>
              <input
                type="color"
                value={textStyle.color}
                onChange={(e) => setTextStyle({ color: e.target.value })}
                className="w-12 h-9 p-0 border border-gray-400 rounded bg-white"
                title="Text color"
              />
            </div>
          </div>

          {/* Bold */}
          <div className="flex flex-col gap-1 text-black">
            <label className="text-sm font-medium">Bold</label>
            <button
              onClick={() => setTextStyle({ bold: !textStyle.bold })}
              className={`border border-gray-400 rounded px-2 py-1 font-bold ${
                textStyle.bold ? "bg-gray-300" : ""
              }`}
            >
              B
            </button>
          </div>

          {/* Italic */}
          <div className="flex flex-col gap-1 text-black">
            <label className="text-sm font-medium">Italic</label>
            <button
              onClick={() => setTextStyle({ italic: !textStyle.italic })}
              className={`border border-gray-400 rounded px-2 py-1 italic ${
                textStyle.italic ? "bg-gray-300" : ""
              }`}
            >
              I
            </button>
          </div>
        </div>
      )}
      {selectedTool == "rect" && <ShapesPanel />}
      {/* {selectedTool == "freehand" &&  } */}
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
    <div className="bg-white relative">
      <div className="h-[95vh] flex flex-col items-center relative bg-white top-[5vh] border-black">
        <div
          className="h-auto w-auto border rounded-md pt-2 absolute top-[5px] left-[40px] z-10 flex flex-col"
          style={{
            border: "2px solid black",
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
              color: "black",
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
