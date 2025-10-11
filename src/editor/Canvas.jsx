import React, { useRef, useState, useEffect, forwardRef } from "react";
import { useStore } from "../store";
import Shape from "./Shape";
import TextTool from "./TextTool";
import ImageTool from "./ImageTool";
import { createShape, updateShapeDimensions } from "./ShapeDrawer";
import { nanoid } from "nanoid";

const Canvas = forwardRef(({ bgColor = "black" }, ref) => {
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const selectedTool = useStore((s) => s.selectedTool);
  const shapeType = useStore((s) => s.shapeType);
  const freehandColor = useStore((s) => s.freehandColor);
  const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
  const freehandType = useStore((s) => s.freehandType);

  const svgRef = ref || useRef(null); // use forwarded ref
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
  const ERASER_SIZE = 20;
  const freehandStyles = { pencil: 1, pen: 1, brush: 0.6, marker: 0.3 };

  useEffect(() => {
    panRef.current = pan;
    zoomRef.current = zoom;
  }, [pan, zoom]);

  const toCanvasCoords = (x, y) => ({
    x: (x - panRef.current.x) / zoomRef.current,
    y: (y - panRef.current.y) / zoomRef.current,
  });

  const handlePointerDown = (e) => {
    const { offsetX, offsetY, button } = e.nativeEvent;
    if (selectedTool === "pan" || button === 1) {
      setIsPanning(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const { x, y } = toCanvasCoords(offsetX, offsetY);

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

    let newShape = null;
    if (selectedTool === "eraser") {
      newShape = {
        id: nanoid(),
        type: "freehand",
        points: [{ x, y }],
        color: "#ffffff",
        strokeWidth: ERASER_SIZE,
        opacity: 1,
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

  const handlePointerMove = (e) => {
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
      if (prev.type === "freehand") return { ...prev, points: [...prev.points, { x, y }] };
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

    if (imageShape) {
      setSelectedImageId(imageShape.id);
    } else {
      setSelectedImageId(null);
    }
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
    <div id="canvas-container" style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "100%", cursor: selectedTool === "pan" ? "grab" : "crosshair" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <rect x={-100000} y={-100000} width={200000} height={200000} fill={bgColor} />

          {shapes.filter((shape) => shape.type !== "image").map((shape) => (
            <Shape key={shape.id} {...shape} />
          ))}

          {selectedTool === "text" && <TextTool selectedTool={selectedTool} pan={pan} zoom={zoom} svgRef={svgRef} />}
          <ImageTool selectedTool={selectedTool} pan={pan} zoom={zoom} selectedImageId={selectedImageId} setSelectedImageId={setSelectedImageId} />
        </g>
      </svg>
    </div>
  );
});

export default Canvas;
