import React, { useRef, useState, useEffect, forwardRef } from "react";
import { useStore } from "../store";
import Shape from "./Shape";
import ImageTool from "./ImageTool";
import { createShape, updateShapeDimensions } from "./ShapeDrawer";
import { nanoid } from "nanoid";

const Canvas = forwardRef((_, ref) => {
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

  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);

  // Text tool states
  const [textContent, setTextContent] = useState("");
  const [textPos, setTextPos] = useState(null);
  const [caretVisible, setCaretVisible] = useState(true);

  // Sticky note support
  const selectedShape = useStore((s) => s.selectedShape);
  const setSelectedShape = useStore((s) => s.setSelectedShape);

  // Constants
  const bgColor = "#ffffff";
  const textStyle = useStore((s) => s.textStyle);

  const ERASER_SIZE = 20;
  const freehandStyles = { pencil: 1, pen: 1, brush: 0.6, marker: 0.3 };

  // keep refs synced
  useEffect(() => {
    panRef.current = pan;
    zoomRef.current = zoom;
  }, [pan, zoom]);

  // load shapes
  useEffect(() => {
    const saved = localStorage.getItem("canvasShapes");
    if (saved) setShapes(JSON.parse(saved));
  }, [setShapes]);

  // auto-save
  useEffect(() => {
    localStorage.setItem("canvasShapes", JSON.stringify(shapes));
  }, [shapes]);

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

  // handle typing
  const handleKeyDown = (e) => {
    if (selectedTool !== "text") return;
    e.preventDefault();

    setTextContent((prev) => {
      if (e.key === "Backspace") return prev.slice(0, -1);
      if (e.key === "Enter") return prev + "\n";
      if (e.key.length === 1) return prev + e.key;
      return prev;
    });
  };

  // handle clicks / drawing
  const handlePointerDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);

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
  const { freehandColor, freehandStrokeWidth, freehandOpacity } = useStore.getState();

  newShape = {
    id: nanoid(),
    type: "freehand",
    points: [{ x, y }],
    color: freehandColor,
    strokeWidth: freehandStrokeWidth,
    opacity: freehandOpacity,
  };
} 
else if (selectedTool === "shape") {
  const { shapeType, shapeColor, shapeFill, shapeStrokeWidth, shapeOpacity } =
    useStore.getState();

  newShape = createShape(shapeType, x, y, {
    stroke: shapeColor,
    fill: shapeFill,
    strokeWidth: shapeStrokeWidth,
    opacity: shapeOpacity,
  });
}
else  if (selectedTool === "sticky") {
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
      setCurrentShapeId(sticky.id);
      setIsDragging(true);
      lastPointer.current = { x, y };
    } else {
      // select existing sticky if clicked
      const clicked = shapes.find(
        (s) => s.type === "sticky" && x >= s.x && x <= s.x + s.width && y >= s.y && y <= s.y + s.height
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
  if (selectedTool === "text") return;

  const { offsetX, offsetY } = e.nativeEvent;
  const { x, y } = toCanvasCoords(offsetX, offsetY);

  // Panning the canvas
  if (isPanning) {
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    return;
  }

  const selectedImageId = useStore.getState().selectedImageId;

  // Dragging the selected image
  if (selectedTool === "image" && selectedImageId && currentShapeId === selectedImageId) {
    updateShape(selectedImageId, (prev) => ({
      ...prev,
      x: x - dragOffset.current.x,
      y: y - dragOffset.current.y,
    }));
    return;
  }

  

  // Drawing freehand or shapes
  if (!currentShapeId) return;
  updateShape(currentShapeId, (prev) => {
    if (prev.type === "freehand") return { ...prev, points: [...prev.points, { x, y }] };
    if (selectedTool === "shape") return updateShapeDimensions(prev, x, y);
    return prev;
  });
};


  const handlePointerUp = () => {
    setIsPanning(false);
    setCurrentShapeId(null);
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
      className="flex justify-center items-center w-full h-screen"
      style={{ backgroundColor: bgColor, overflow: "hidden" }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={(e) => e.currentTarget.focus()} // 👈 ensures typing focus
    >
      <svg
        ref={svgRef}
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: bgColor,
          cursor: selectedTool === "text" ? "text" : selectedTool === "pan" ? "grab" : "crosshair",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <rect x={0} y={0} width="100%" height="100%" fill={bgColor} />

        {/* ✏️ Live typing preview */}
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
                  textPos.x + (textContent.split("\n").at(-1)?.length || 0) * 9
                }
                y1={
                  textPos.y -
                  15 +
                  (textContent.split("\n").length - 1) * 24
                }
                x2={
                  textPos.x + (textContent.split("\n").at(-1)?.length || 0) * 9
                }
                y2={textPos.y + (textContent.split("\n").length - 1) * 24}
               stroke={textStyle.color}

                strokeWidth={1}
              />
            )}
          </>
        )}

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
          opacity={typeof shape.opacity === "number" ? shape.opacity : 1}
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

    return <Shape key={shape.id} {...shape} />;
  })}
  <ImageTool selectedTool={selectedTool} pan={pan} zoom={zoom} />
</g>


      </svg>
    </div>
  );
});

export default Canvas;
