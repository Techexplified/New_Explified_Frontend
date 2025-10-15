import React, { useRef, useState, useEffect, forwardRef } from "react";
import { useStore } from "../store";
import Shape from "./Shape";
import TextTool from "./TextTool";
import ImageTool from "./ImageTool";
import { createShape, updateShapeDimensions } from "./ShapeDrawer";
import { nanoid } from "nanoid";

const Canvas = forwardRef(({ isDark }, ref) => {
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const selectedTool = useStore((s) => s.selectedTool);
  const shapeType = useStore((s) => s.shapeType);
  const freehandColor = useStore((s) => s.freehandColor);
  const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
  const freehandType = useStore((s) => s.freehandType);

  const svgRef = ref || useRef(null);
  const [currentShapeId, setCurrentShapeId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);
  const [isPanning, setIsPanning] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const [selectedImageId, setSelectedImageId] = useState(null);

  // Write mode states
  const [notes, setNotes] = useState([""]);
  const [caretVisible, setCaretVisible] = useState(true);

  const bgColor = isDark ? "#1e1e1e" : "#f3f3f3";
  const ERASER_SIZE = 20;
  const freehandStyles = { pencil: 1, pen: 1, brush: 0.6, marker: 0.3 };

  useEffect(() => {
    panRef.current = pan;
    zoomRef.current = zoom;
  }, [pan, zoom]);

  // Blinking cursor for write tool
  useEffect(() => {
    if (selectedTool === "write") {
      const interval = setInterval(() => setCaretVisible((v) => !v), 500);
      return () => clearInterval(interval);
    }
  }, [selectedTool]);

  // Typing logic for write tool
  const handleKeyDown = (e) => {
    if (selectedTool !== "write") return;
    e.preventDefault();

    setNotes((prev) => {
      const newLines = [...prev];
      const lastLine = newLines[newLines.length - 1];

      if (e.key === "Backspace") {
        newLines[newLines.length - 1] = lastLine.slice(0, -1);
      } else if (e.key === "Enter") {
        newLines.push("");
      } else if (e.key.length === 1) {
        newLines[newLines.length - 1] += e.key;
      }
      return newLines;
    });
  };

  const toCanvasCoords = (x, y) => ({
    x: (x - panRef.current.x) / zoomRef.current,
    y: (y - panRef.current.y) / zoomRef.current,
  });

  // Pointer Down
  const handlePointerDown = (e) => {
    if (selectedTool === "write") return; // disable drawing in write mode

    const { offsetX, offsetY, button } = e.nativeEvent;
    if (selectedTool === "pan" || button === 1) {
      setIsPanning(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const { x, y } = toCanvasCoords(offsetX, offsetY);

    // Selection
    if (selectedTool === "select") {
      const shape = [...shapes].reverse().find((s) => {
        if (s.points) {
          const xs = s.points.map((p) => p.x);
          const ys = s.points.map((p) => p.y);
          return (
            x >= Math.min(...xs) &&
            x <= Math.max(...xs) &&
            y >= Math.min(...ys) &&
            y <= Math.max(...ys)
          );
        } else {
          return (
            x >= s.x &&
            x <= (s.x + (s.width || s.size || 0)) &&
            y >= s.y &&
            y <= (s.y + (s.height || s.size || 0))
          );
        }
      });
      if (shape) {
        setDraggingId(shape.id);
        setDragOffset({ x: x - shape.x, y: y - shape.y });
        return;
      }
    }

    // New shape
    let newShape = null;
    if (selectedTool === "eraser") {
      newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x, y }],
        color: bgColor, // ✅ adaptive eraser color
        strokeWidth: ERASER_SIZE,
        opacity: 1,
        isEraser: true, // ✅ mark as eraser stroke
      };
    } else if (selectedTool === "freehand") {
      newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x, y }],
        color: freehandColor,
        strokeWidth: freehandStrokeWidth,
        opacity: freehandStyles[freehandType] || 1,
      };
    } else if (selectedTool === "shapes") {
      newShape = createShape("shapes", shapeType, x, y, freehandColor);
    }

    if (newShape) {
      addShape(newShape);
      setCurrentShapeId(newShape.id);
    }
  };

  // Pointer Move
  const handlePointerMove = (e) => {
    if (selectedTool === "write") return;

    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);

    if (isPanning) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    if (draggingId) {
      updateShape(draggingId, (prev) => {
        const dx = x - dragOffset.x - prev.x;
        const dy = y - dragOffset.y - prev.y;
        if (prev.points) {
          return {
            ...prev,
            x: x - dragOffset.x,
            y: y - dragOffset.y,
            points: prev.points.map((p) => ({ x: p.x + dx, y: p.y + dy })),
          };
        }
        return { ...prev, x: x - dragOffset.x, y: y - dragOffset.y };
      });
      return;
    }

    if (!currentShapeId) return;
    updateShape(currentShapeId, (prev) => {
      if (prev.type === "freehand")
        return { ...prev, points: [...prev.points, { x, y }] };
      if (selectedTool === "shapes") return updateShapeDimensions(prev, x, y);
      return prev;
    });
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setCurrentShapeId(null);
    setDraggingId(null);
  };

  const handleDoubleClick = (e) => {
    if (selectedTool === "write") return;
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);
    const imageShape = [...shapes].reverse().find(
      (s) =>
        s.type === "image" &&
        x >= s.x &&
        x <= s.x + (s.width || 0) &&
        y >= s.y &&
        y <= s.y + (s.height || 0)
    );
    if (imageShape) setSelectedImageId(imageShape.id);
    else setSelectedImageId(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = -e.deltaY * 0.001;
    const newZoom = Math.min(Math.max(zoomRef.current * (1 + scaleFactor), 0.1), 10);
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setPan({
      x: mouseX - ((mouseX - panRef.current.x) / zoomRef.current) * newZoom,
      y: mouseY - ((mouseY - panRef.current.y) / zoomRef.current) * newZoom,
    });
    setZoom(newZoom);
  };

  return (
    <div
      id="canvas-container"
      className="flex  justify-center items-center w-full "
      style={{
        backgroundColor: bgColor,
         height: "75vh",
         
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <svg
        ref={svgRef}
        style={{
          width: "800px",
          height: "600px",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          backgroundColor: bgColor,
          cursor: selectedTool === "write" ? "text" : "crosshair",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <rect x={0} y={0} width={800} height={600} fill={bgColor} />

        {/* Write tool text + cursor */}
        {selectedTool === "write" &&
          notes.map((line, idx) => (
            <text
               key={idx}
      x={20}
      y={40 + idx * 24}
      
              fill={isDark ? "#ffffff" : "#000000"}
              fontSize={16}
            >
              {line}
            </text>
          ))}

        {selectedTool === "write" && caretVisible && (
          <line
            x1={20 + (notes[notes.length - 1]?.length || 0) * 8}
            y1={14 + notes.length * 20}
            x2={20 + (notes[notes.length - 1]?.length || 0) * 8}
            y2={32 + notes.length * 20}
            stroke={isDark ? "#ffffff" : "#000000"}
            strokeWidth={1}
          />
        )}

        {/* Shapes & images */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {shapes
            .filter((shape) => shape.type !== "image")
            .map((shape) => (
              <Shape key={shape.id} {...shape} />
            ))}

          {selectedTool === "text" && (
            <TextTool selectedTool={selectedTool} pan={pan} zoom={zoom} svgRef={svgRef} />
          )}

          <ImageTool
            selectedTool={selectedTool}
            pan={pan}
            zoom={zoom}
            selectedImageId={selectedImageId}
            setSelectedImageId={setSelectedImageId}
          />
        </g>
      </svg>
    </div>
  );
});

export default Canvas;
