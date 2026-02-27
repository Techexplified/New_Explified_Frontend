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

  const getFilterStyle = (filter) => {
    switch (filter) {
      case "grayscale": return "grayscale(100%)";
      case "sepia": return "sepia(100%)";
      case "blur": return "blur(3px)";
      case "brightness": return "brightness(1.3)";
      case "contrast": return "contrast(1.5)";
      case "saturate": return "saturate(2)";
      case "invert": return "invert(100%)";
      default: return "none";
    }
  };

  return (
    <g
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {shapes
        .filter((s) => s.type === "image")
        .map((img) => {
          const cx = img.x + img.width / 2;
          const cy = img.y + img.height / 2;
          const rotation = img.rotation || 0;
          const scaleX = img.flipH ? -1 : 1;
          const scaleY = img.flipV ? -1 : 1;
          const transform = `rotate(${rotation}, ${cx}, ${cy}) translate(${cx}, ${cy}) scale(${scaleX}, ${scaleY}) translate(${-cx}, ${-cy})`;

          return (
            <g key={img.id}>
              <image
                href={img.src}
                x={img.x}
                y={img.y}
                width={img.width}
                height={img.height}
                opacity={img.opacity ?? 1}
                transform={transform}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedShape(img);
                }}
                style={{
                  cursor: selectedTool === "image" ? "move" : "default",
                  outline: selectedShape?.id === img.id ? "2px solid #6366f1" : "none",
                  filter: getFilterStyle(img.filter),
                }}
              />

              {selectedShape?.id === img.id && selectedTool === "image" && (
                <ResizeHandles
                  img={img}
                  zoom={zoom}
                  pan={pan}
                  onResize={(newAttrs) => {
                    useStore.getState().updateSelectedShape(newAttrs);
                  }}
                />
              )}
            </g>
          );
        })}
    </g>
  );
}

function ResizeHandles({ img, zoom, pan, onResize }) {
  const [dragHandle, setDragHandle] = useState(null);
  const startPos = React.useRef({ x: 0, y: 0 });
  const startDims = React.useRef({ x: 0, y: 0, w: 0, h: 0 });
  const startRotation = React.useRef(0);

  const handleDown = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    setDragHandle(handle);
    startPos.current = { x: e.clientX, y: e.clientY };
    startDims.current = { x: img.x, y: img.y, w: img.width, h: img.height };
    startRotation.current = img.rotation || 0;
    e.target.setPointerCapture(e.pointerId);
  };

  const handleMove = (e) => {
    if (!dragHandle) return;
    e.stopPropagation();

    if (dragHandle === "rotate") {
      const cx = img.x + img.width / 2;
      const cy = img.y + img.height / 2;

      const rect = e.target.ownerSVGElement.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;

      const angle = Math.atan2(mouseY - cy, mouseX - cx) * (180 / Math.PI) + 90;

      onResize({ rotation: Math.round(angle) });
      return;
    }

    const dx = (e.clientX - startPos.current.x) / zoom;
    const dy = (e.clientY - startPos.current.y) / zoom;

    let { x, y, w, h } = startDims.current;

    switch (dragHandle) {
      case "se":
        w += dx;
        h += dy;
        break;
      case "sw":
        x += dx;
        w -= dx;
        h += dy;
        break;
      case "ne":
        y += dy;
        w += dx;
        h -= dy;
        break;
      case "nw":
        x += dx;
        y += dy;
        w -= dx;
        h -= dy;
        break;
    }

    if (w < 20) w = 20;
    if (h < 20) h = 20;

    onResize({
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(w),
      height: Math.round(h)
    });
  };

  const handleUp = (e) => {
    setDragHandle(null);
    e.target.releasePointerCapture(e.pointerId);
  };

  const cx = img.x + img.width / 2;
  const cy = img.y + img.height / 2;
  const transform = `rotate(${img.rotation || 0}, ${cx}, ${cy})`;

  const HANDLE_SIZE = 10 / zoom;
  const ROTATION_HANDLE_OFFSET = 30 / zoom;
  const ROTATION_HANDLE_SIZE = 12 / zoom;

  return (
    <g transform={transform}>
      <line
        x1={cx}
        y1={img.y}
        x2={cx}
        y2={img.y - ROTATION_HANDLE_OFFSET}
        stroke="#6366f1"
        strokeWidth={2 / zoom}
        strokeDasharray={`${4 / zoom} ${2 / zoom}`}
      />
      <circle
        cx={cx}
        cy={img.y - ROTATION_HANDLE_OFFSET}
        r={ROTATION_HANDLE_SIZE / 2}
        fill="#6366f1"
        stroke="white"
        strokeWidth={2 / zoom}
        cursor="grab"
        style={{ cursor: dragHandle === "rotate" ? "grabbing" : "grab" }}
        onPointerDown={(e) => handleDown(e, "rotate")}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      />
      <rect
        x={img.x - HANDLE_SIZE / 2}
        y={img.y - HANDLE_SIZE / 2}
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        fill="white"
        stroke="#6366f1"
        strokeWidth={1.5}
        cursor="nwse-resize"
        onPointerDown={(e) => handleDown(e, "nw")}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      />
      <rect
        x={img.x + img.width - HANDLE_SIZE / 2}
        y={img.y - HANDLE_SIZE / 2}
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        fill="white"
        stroke="#6366f1"
        strokeWidth={1.5}
        cursor="nesw-resize"
        onPointerDown={(e) => handleDown(e, "ne")}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      />
      <rect
        x={img.x - HANDLE_SIZE / 2}
        y={img.y + img.height - HANDLE_SIZE / 2}
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        fill="white"
        stroke="#6366f1"
        strokeWidth={1.5}
        cursor="nesw-resize"
        onPointerDown={(e) => handleDown(e, "sw")}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      />
      <rect
        x={img.x + img.width - HANDLE_SIZE / 2}
        y={img.y + img.height - HANDLE_SIZE / 2}
        width={HANDLE_SIZE}
        height={HANDLE_SIZE}
        fill="white"
        stroke="#6366f1"
        strokeWidth={1.5}
        cursor="nwse-resize"
        onPointerDown={(e) => handleDown(e, "se")}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
      />
    </g>
  );
}
