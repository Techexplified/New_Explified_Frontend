import React, { useRef, useState, useEffect, forwardRef } from "react";
import { useStore } from "../store";
import Shape from "./Shape";
import ImageTool from "./ImageTool";
// import StickyNotesCanvas from "./StickyNotesCanvas";
import StickyShape from "./StickyShape";
//this is testing
import { createShape, updateShapeDimensions } from "./ShapeDrawer";
import { nanoid } from "nanoid";

const Canvas = forwardRef((_, ref) => {
  const [selectionBox, setSelectionBox] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const selectedShapes = useStore((s) => s.selectedShapes);
  const setSelectedShapes = useStore((s) => s.setSelectedShapes);
  const clearSelection = useStore((s) => s.clearSelection);
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const setShapes = useStore((s) => s.setShapes);
  const selectedTool = useStore((s) => s.selectedTool);
  const shapeType = useStore((s) => s.shapeType);
  const freehandColor = useStore((s) => s.freehandColor);
  const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
  const freehandType = useStore((s) => s.freehandType);
  const setTool = useStore((s) => s.setTool);
  const setSelectedImageId = useStore((s) => s.setSelectedImageId);
  const svgRef = ref || useRef(null);
  const [currentShapeId, setCurrentShapeId] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const lastPointer = useRef({ x: 0, y: 0 });
  const [isEraserDragging, setIsEraserDragging] = useState(false);

  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);

  // Text tool states
  const [textContent, setTextContent] = useState("");
  const [textPos, setTextPos] = useState(null);
  const [caretVisible, setCaretVisible] = useState(true);

  // Sticky note support
  const selectedShape = useStore((s) => s.selectedShape);
  const setSelectedShape = useStore((s) => s.setSelectedShape);

  // Constants - use theme-aware background
  const theme = useStore((s) => s.theme);
  const bgColor = theme === 'dark' ? '#1a1a1a' : '#ffffff';
  const textStyle = useStore((s) => s.textStyle);

  const ERASER_SIZE = 20;
  const freehandStyles = { pencil: 1, pen: 1, brush: 0.6, marker: 0.3 };

  const currentNoteId = useStore((s) => s.currentNoteId);

  // keep refs synced
  useEffect(() => {
    panRef.current = pan;
    zoomRef.current = zoom;
  }, [pan, zoom]);

  // load shapes for specific note
  useEffect(() => {
    if (!currentNoteId) return;

    const storageKey = `canvasShapes_${currentNoteId}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setShapes(JSON.parse(saved));
    } else {
      setShapes([]); // Clear canvas for new notes!
    }
  }, [currentNoteId, setShapes]);

  // auto-save for specific note
  useEffect(() => {
    if (!currentNoteId) return;
    const storageKey = `canvasShapes_${currentNoteId}`;
    localStorage.setItem(storageKey, JSON.stringify(shapes));
  }, [shapes, currentNoteId]);

  // caret blinking
  useEffect(() => {
    if (selectedTool === "text") {
      const blink = setInterval(() => setCaretVisible((v) => !v), 500);
      return () => clearInterval(blink);
    }
  }, [selectedTool]);

  // save text when switching tool
  const prevToolRef = useRef(selectedTool);

  // convert to canvas coords
  const toCanvasCoords = (x, y) => ({
    x: (x - panRef.current.x) / zoomRef.current,
    y: (y - panRef.current.y) / zoomRef.current,
  });

  // --- Utility: check shape bounds ---
  const getShapeBounds = (shape) => {
    if (shape.type === "rect" || shape.type === "square")
      return { x: shape.x, y: shape.y, w: shape.width, h: shape.height };
    if (shape.type === "circle" || shape.type === "ellipse")
      return { x: shape.x - shape.rx, y: shape.y - shape.ry, w: shape.rx * 2, h: shape.ry * 2 };
    if (shape.type === "line" || shape.type === "arrow") {
      const xs = shape.points.map((p) => p.x);
      const ys = shape.points.map((p) => p.y);
      return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
    if (shape.type === "sticky" || shape.type === "image")
      return { x: shape.x, y: shape.y, w: shape.width, h: shape.height };
    if (shape.type === "text") {
      // Approx text bounds
      const lines = shape.lines || [shape.text || ""];
      const fontSize = shape.fontSize || 18;
      const lineHeight = fontSize * 1.5;
      const maxWidth = Math.max(...lines.map(l => l.length)) * (fontSize * 0.6); // approx char width
      const totalHeight = lines.length * lineHeight;
      return { x: shape.x, y: shape.y - fontSize, w: maxWidth, h: totalHeight }; // y-fontSize because text anchor is usually bottom-left or similar, checking render... text y is baseline? No, usually top-left for SVG text unless specified. lines 599 y=shape.y + idx*lineHeight. So y is top.
    }
    if (shape.type === "freehand") {
      if (!shape.points || shape.points.length === 0) return { x: shape.x, y: shape.y, w: 0, h: 0 };
      const xs = shape.points.map((p) => p.x);
      const ys = shape.points.map((p) => p.y);
      return { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
    return { x: shape.x, y: shape.y, w: 0, h: 0 };
  };

  // --- Detect intersection with selection box ---
  const intersects = (a, b) =>
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;

  // handle typing
  const handleKeyDown = (e) => {
    // Handle Delete key for removing selected image
    if (e.key === "Delete" || e.key === "Backspace") {
      const currentSelectedShape = useStore.getState().selectedShape;
      if (currentSelectedShape?.type === "image") {
        e.preventDefault();
        useStore.getState().removeShape(currentSelectedShape.id);
        useStore.getState().setSelectedShape(null);
        return;
      }
    }

    if (selectedTool !== "text") return;
    e.preventDefault();

    setTextContent((prev) => {
      if (e.key === "Backspace") return prev.slice(0, -1);
      if (e.key === "Enter") return prev + "\n";
      if (e.key.length === 1) return prev + e.key;
      return prev;
    });
  };

  const handleCanvasClick = (e) => {
    const { selectedTool, addShape, setSelectedShape, shapes } =
      useStore.getState();

    // check if clicked on an existing shape
    const clickedShape = shapes.find((s) =>
      e.target.closest(`[data-shape-id="${s.id}"]`)
    );

    if (clickedShape) {
      // ✅ Select existing sticky note for editing
      setSelectedShape(clickedShape);
      return;
    }

    // ✅ Create new sticky note only if clicked on empty space
    if (selectedTool === "sticky") {
      const newNote = {
        id: crypto.randomUUID(),
        type: "sticky",
        x: e.clientX,
        y: e.clientY,
        width: 200,
        height: 150,
        text: "Write something...",
        fill: "#fae316",
      };
      addShape(newNote);
      setSelectedShape(newNote);
    }
  };

  // handle clicks / drawing
  const handlePointerDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);

    // 🖼️ Check if clicked on an image (works from ANY tool)
    const clickedImage = shapes.find(
      (s) =>
        s.type === "image" &&
        x >= s.x &&
        x <= s.x + s.width &&
        y >= s.y &&
        y <= s.y + s.height
    );

    if (clickedImage) {
      // Select the image and switch to image tool
      setSelectedShape(clickedImage);
      setTool("image");
      return;
    }

    // If clicked on empty space and an image was selected, deselect it
    if (selectedShape?.type === "image") {
      setSelectedShape(null);
    }

    // ✏️ Text Tool
    if (selectedTool === "text") {
      // Save existing text if present
      if (textContent.trim().length > 0 && textPos) {
        const style = useStore.getState().textStyle;
        const textShape = {
          id: nanoid(),
          type: "text",
          lines: textContent.split("\n"),
          x: textPos.x,
          y: textPos.y,
          color: style.color,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          textAlign: style.textAlign,
          opacity: style.opacity,
        };

        addShape(textShape);
      }

      // Start new text position
      setTextPos({ x, y });
      setTextContent("");
      return;
    }

    if (selectedTool === "select" || selectedTool === "mousepointer") {
      const clicked = shapes.find((s) => {
        const b = getShapeBounds(s);
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });

      if (clicked) {
        // Shift+Click → multi-select toggle
        if (e.shiftKey) {
          setSelectedShapes((prev) =>
            prev.includes(clicked.id)
              ? prev.filter((id) => id !== clicked.id)
              : [...prev, clicked.id]
          );
        } else {
          setSelectedShapes([clicked.id]);
        }
        // Start dragging the selection
        setDragStart({ x, y });
        setIsDraggingSelection(true);
      } else {
        // Start new selection box
        clearSelection();
        setSelectionBox({ x, y, w: 0, h: 0 });
      }
      return;
    }

    // Pointer down
    if (selectedTool === "pan" || e.nativeEvent.button === 1) {
      setIsPanning(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Pointer move
    if (isPanning) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    // Pointer up
    const handlePointerUp = () => {
      setIsPanning(false);
      setCurrentShapeId(null);
    };

    // 🖊️ Drawing Tools
    let newShape = null;

    if (selectedTool === "eraser") {
      // ✅ Object Eraser (Click and drag to erase)
      if (useStore.getState().eraserMode === "object") {
        const clicked = shapes.find((s) => {
          const b = getShapeBounds(s);
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
        if (clicked) {
          useStore.getState().removeShape(clicked.id);
        }
        // Set eraser dragging state to enable drag-to-delete
        setIsEraserDragging(true);
        return;
      }

      newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x, y }],
        color: bgColor,
        strokeWidth: ERASER_SIZE,
        opacity: 1,
        isEraser: true,
      };
    } else if (selectedTool === "freehand" || selectedTool === "pencil") {
      const { freehandColor, freehandStrokeWidth, freehandOpacity } =
        useStore.getState();

      newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x, y }],
        color: freehandColor,
        strokeWidth: freehandStrokeWidth,
        opacity: freehandOpacity,
      };
    } else if (selectedTool === "shape") {
      const {
        shapeType,
        shapeColor,
        shapeFill,
        shapeStrokeWidth,
        shapeOpacity,
      } = useStore.getState();

      newShape = createShape(shapeType, x, y, {
        color: shapeColor,
        fill: shapeFill,
        strokeWidth: shapeStrokeWidth,
        opacity: shapeOpacity,
      });
    } else if (selectedTool === "sticky") {
      // ✅ Check if clicked on existing sticky
      const clickedSticky = shapes.find(
        (s) =>
          s.type === "sticky" &&
          x >= s.x &&
          x <= s.x + s.width &&
          y >= s.y &&
          y <= s.y + s.height
      );

      if (clickedSticky) {
        setSelectedShape(clickedSticky);
        return; // Stop further processing
      }

      // ✅ Create new sticky
      const sticky = {
        id: nanoid(),
        type: "sticky",
        x,
        y,
        width: 150,
        height: 150,
        fill: "#fae316",
        color: "#000000",
        fontSize: 16,
        fontFamily: "Arial",
        text: "Your note here",
        opacity: 1,
      };

      addShape(sticky);
      setSelectedShape(sticky);

      // ✅ Switch back to hand tool
      requestAnimationFrame(() => setTool("hand"));
      return;
    } else {
      // select existing sticky if clicked
      const clicked = shapes.find(
        (s) =>
          s.type === "sticky" &&
          x >= s.x &&
          x <= s.x + s.width &&
          y >= s.y &&
          y <= s.y + s.height
      );
      if (clicked) {
        setSelectedShape(clicked);
        setCurrentShapeId(clicked.id);
        setIsDragging(true);
        lastPointer.current = { x, y };
      }
    }

    if (newShape) {
      addShape(newShape);
      setCurrentShapeId(newShape.id);
    }
  };

  // handle pointer move
  const handlePointerMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);

    // --- TEXT TOOL ---
    if (selectedTool === "text") return;

    // --- PAN TOOL ---
    if (isPanning) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    // --- SELECT TOOL (drag-select / move shapes) ---
    if (selectedTool === "select" || selectedTool === "mousepointer") {
      if (selectionBox) {
        // Resize selection rectangle
        setSelectionBox((prev) => ({ ...prev, w: x - prev.x, h: y - prev.y }));
        return;
      }

      if (isDraggingSelection && dragStart) {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;
        setDragStart({ x, y });

        selectedShapes.forEach((id) => {
          useStore.getState().updateShape(id, (s) => ({
            ...s,
            x: s.x + dx,
            y: s.y + dy,
            points: s.points
              ? s.points.map((p) => ({ x: p.x + dx, y: p.y + dy }))
              : s.points,
          }));
        });
        return;
      }
    }

    // --- IMAGE DRAGGING ---
    const selectedImageId = useStore.getState().selectedImageId;
    if (
      selectedTool === "image" &&
      selectedImageId &&
      currentShapeId === selectedImageId
    ) {
      updateShape(selectedImageId, (prev) => ({
        ...prev,
        x: x - dragOffset.current.x,
        y: y - dragOffset.current.y,
      }));
      return;
    }

    // Object Eraser Logic (Drag to erase) - only when eraser is being dragged
    if (selectedTool === "eraser" && useStore.getState().eraserMode === "object" && isEraserDragging) {
      const clicked = shapes.find((s) => {
        const b = getShapeBounds(s);
        return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
      });
      if (clicked) {
        useStore.getState().removeShape(clicked.id);
      }
      return;
    }

    // --- DRAWING TOOLS (freehand or shape) ---
    if (!currentShapeId) return;

    updateShape(currentShapeId, (prev) => {
      if (prev.type === "freehand")
        return { ...prev, points: [...prev.points, { x, y }] };
      if (selectedTool === "shape") {
        const isPerfect = useStore.getState().isPerfectShape;
        return updateShapeDimensions(prev, x, y, isPerfect);
      }
      return prev;
    });
  };

  const handlePointerUp = () => {
    setIsPanning(false);
    setCurrentShapeId(null);
    setIsEraserDragging(false);
    if (selectionBox) {
      const rect = {
        x: Math.min(selectionBox.x, selectionBox.x + selectionBox.w),
        y: Math.min(selectionBox.y, selectionBox.y + selectionBox.h),
        w: Math.abs(selectionBox.w),
        h: Math.abs(selectionBox.h),
      };
      const selected = shapes
        .filter((s) => intersects(getShapeBounds(s), rect))
        .map((s) => s.id);
      setSelectedShapes(selected);
      setSelectionBox(null);
    }
    setIsDraggingSelection(false);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      // Zooming
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
    } else {
      // Panning
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  const handleDoubleClick = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedImage = shapes.find(
      (s) =>
        s.type === "image" &&
        x >= s.x &&
        x <= s.x + s.width &&
        y >= s.y &&
        y <= s.y + s.height
    );

    if (clickedImage) {
      useStore.getState().setSelectedImageId(clickedImage.id);
      setTool("image");
    }
  };

  return (
    <div
      id="canvas-container"
      className="w-full h-full outline-none"
      style={{ backgroundColor: bgColor, overflow: "hidden" }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.currentTarget.focus()} // 👈 ensures typing focus
    >
      <svg
        ref={svgRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: bgColor,
          touchAction: "none", // 👈 Prevents browser scroll on touch devices
          cursor:
            selectedTool === "text"
              ? "text"
              : selectedTool === "pan"
                ? "grab"
                : "crosshair",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <rect x={0} y={0} width="100%" height="100%" fill={bgColor} />



        {/* 🎨 Saved shapes */}
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {shapes.map((shape) => {
            if (shape.type === "image") return null;

            if (shape.type === "text") {
              const lines = shape.lines || [shape.text || ""];
              const fontSize = shape.fontSize ?? 18;
              const lineHeight = fontSize * 1.5;

              return lines.map((line, idx) => (
                <text
                  key={shape.id + idx}
                  x={shape.x}
                  y={shape.y + idx * lineHeight}
                  fill={shape.color}
                  fontSize={fontSize}
                  fontFamily={shape.fontFamily}
                  opacity={
                    typeof shape.opacity === "number" ? shape.opacity : 1
                  }
                  textAnchor={
                    shape.textAlign === "center"
                      ? "middle"
                      : shape.textAlign === "right"
                        ? "end"
                        : "start"
                  }
                >
                  {line}
                </text>
              ));
            }
            if (shape.type === "sticky") {
              return (
                <StickyShape
                  key={shape.id}
                  shape={shape}
                  isSelected={
                    shape.id === useStore.getState().selectedShape?.id
                  }
                />
              );
            }

            return <Shape key={shape.id} {...shape} />;
          })}
          <ImageTool selectedTool={selectedTool} pan={pan} zoom={zoom} />

          {/* ✏️ Live typing preview (Inside transform to match pan/zoom) */}
          {selectedTool === "text" && textPos && (
            <>
              {textContent.split("\n").map((line, i) => (
                <text
                  key={i}
                  x={textPos.x}
                  y={textPos.y + i * textStyle.fontSize * 1.5}
                  fill={textStyle.color}
                  fontSize={textStyle.fontSize}
                  fontFamily={textStyle.fontFamily}
                  opacity={textStyle.opacity ?? 1}
                  textAnchor={
                    textStyle.textAlign === "center"
                      ? "middle"
                      : textStyle.textAlign === "right"
                        ? "end"
                        : "start"
                  }
                >
                  {line}
                </text>
              ))}
              {caretVisible && (
                <line
                  x1={
                    textPos.x + (textContent.split("\n").at(-1)?.length || 0) * (textStyle.fontSize * 0.6)
                  }
                  y1={textPos.y - 15 + (textContent.split("\n").length - 1) * 24}
                  x2={
                    textPos.x + (textContent.split("\n").at(-1)?.length || 0) * (textStyle.fontSize * 0.6)
                  }
                  y2={textPos.y + (textContent.split("\n").length - 1) * 24}
                  stroke={textStyle.color}
                  strokeWidth={2}
                />
              )}
            </>
          )}
        </g>
      </svg>
    </div>
  );
});

export default Canvas;
