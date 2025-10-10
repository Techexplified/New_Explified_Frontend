import React, { useState } from "react";
import { useStore } from "../store";

export default function ImageTool({ selectedTool, pan, zoom }) {
  const shapes = useStore((s) => s.shapes);
  const updateShape = useStore((s) => s.updateShape);

  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const toCanvasCoords = (x, y) => ({
    x: (x - pan.x) / zoom,
    y: (y - pan.y) / zoom,
  });

  const handlePointerDown = (e) => {
    if (selectedTool !== "image") return;
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);

    const shape = shapes.find(
      (s) =>
        s.type === "image" &&
        x >= s.x &&
        x <= s.x + s.width &&
        y >= s.y &&
        y <= s.y + s.height
    );

    if (shape) {
      setDraggingId(shape.id);
      setDragOffset({ x: x - shape.x, y: y - shape.y });
    }
  };

  const handlePointerMove = (e) => {
    if (!draggingId) return;
    const { offsetX, offsetY } = e.nativeEvent;
    const { x, y } = toCanvasCoords(offsetX, offsetY);

    updateShape(draggingId, (prev) => ({
      ...prev,
      x: x - dragOffset.x,
      y: y - dragOffset.y,
    }));
  };

  const handlePointerUp = () => setDraggingId(null);

  return (
    <g
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {shapes
        .filter((s) => s.type === "image")
        .map((img) => (
          <image
            key={img.id}
            href={img.src}
            x={img.x}
            y={img.y}
            width={img.width}
            height={img.height}
            style={{ cursor: selectedTool === "image" ? "move" : "default" }}
          />
        ))}
    </g>
  );
}
