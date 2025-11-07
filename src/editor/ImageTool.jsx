import React, { useState } from "react";
import { useStore } from "../store";
import { nanoid } from "nanoid";

export default function ImageTool({ selectedTool, pan, zoom }) {
  const shapes = useStore((s) => s.shapes);
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const selectedShape = useStore((s) => s.selectedShape);
  const setSelectedShape = useStore((s) => s.setSelectedShape);

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

    // Check if clicked on existing image
    const shape = shapes.find(
      (s) =>
        s.type === "image" &&
        x >= s.x &&
        x <= s.x + s.width &&
        y >= s.y &&
        y <= s.y + s.height
    );

    if (shape) {
      setSelectedShape(shape);
      setDraggingId(shape.id);
      setDragOffset({ x: x - shape.x, y: y - shape.y });
    } else {
      // Upload new image
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (ev) => {
        const file = ev.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target.result;
          const newShape = {
            id: nanoid(),
            type: "image",
            src,
            x,
            y,
            width: 200,
            height: 200,
            opacity: 1,
            rotation: 0,
          };
          addShape(newShape);
          setSelectedShape(newShape);
        };
        reader.readAsDataURL(file);
      };
      input.click();
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
            opacity={img.opacity ?? 1}
            transform={`rotate(${img.rotation || 0}, ${img.x + img.width / 2}, ${
              img.y + img.height / 2
            })`}
            onClick={() => setSelectedShape(img)}
            style={{
              cursor: selectedTool === "image" ? "move" : "default",
              outline:
                selectedShape?.id === img.id
                  ? "2px solid #6366f1"
                  : "none",
            }}
          />
        ))}
    </g>
  );
}
