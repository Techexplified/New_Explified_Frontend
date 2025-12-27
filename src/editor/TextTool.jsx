import React, { useState, useEffect, useRef, useMemo } from "react";
import { nanoid } from "nanoid";
import { useStore } from "../store";

export default function TextTool({ selectedTool, pan, zoom, svgRef }) {
  const addShape = useStore((s) => s.addShape);
  const updateShape = useStore((s) => s.updateShape);
  const removeShape = useStore((s) => s.removeShape);
  const textStyle = useStore((s) => s.textStyle) || {};
  const allShapes = useStore((s) => s.shapes) || [];

  const shapes = useMemo(() => allShapes.filter((s) => s?.type === "text"), [allShapes]);

  const [editingShape, setEditingShape] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const inputRef = useRef(null);

  const currentShape = shapes.find((s) => s?.id === editingShape?.id) || null;

  // ---------------- Create new text shape ----------------
  const handleCanvasClick = (e) => {
    if (selectedTool !== "text") return;
    if (["text", "TEXTAREA"].includes(e.target.tagName)) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;

    const id = nanoid();
    addShape({
      id,
      type: "text",
      x,
      y,
      text: "",
      fontFamily: textStyle.fontFamily || "Arial",
      fontSize: textStyle.fontSize || 16,
      bold: textStyle.bold || false,
      italic: textStyle.italic || false,
      underline: textStyle.underline || false,
      color: textStyle.color || "#000000",
    });

    setEditingShape({ id, x, y });
    setInputValue("");
  };

  // ---------------- Save text ----------------
  const saveText = () => {
    if (!editingShape) return;
    const { id } = editingShape;

    if (!inputValue || !inputValue.trim()) {
      removeShape(id);
    } else {
      updateShape(id, { text: inputValue });
    }

    setEditingShape(null);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveText();
    }
  };

  // ---------------- Dragging ----------------
  const handleMouseDown = (e, shape) => {
    if (editingShape?.id === shape?.id) return;

    setDraggingId(shape?.id);
    const rect = svgRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - pan.x - (shape?.x || 0) * zoom,
      y: e.clientY - rect.top - pan.y - (shape?.y || 0) * zoom,
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x - dragOffset.x) / zoom;
    const y = (e.clientY - rect.top - pan.y - dragOffset.y) / zoom;

    updateShape(draggingId, { x, y });
  };

  const handleMouseUp = () => setDraggingId(null);

  // ---------------- Click outside ----------------
  const handleClickOutside = (e) => {
    if (editingShape && inputRef.current && !inputRef.current.contains(e.target)) {
      saveText();
    }
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.addEventListener("click", handleCanvasClick);
    svg.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      if (!svg) return;
      svg.removeEventListener("click", handleCanvasClick);
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedTool, pan, zoom, draggingId, dragOffset, editingShape]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [editingShape]);

  const updateEditingStyle = (key, value) => {
    if (!currentShape) return;
    updateShape(currentShape.id, { [key]: value });
  };

  // ---------------- Render ----------------
  return (
    <>
      {shapes.map((shape) => {
        if (!shape) return null;
        return (
          <g
            key={shape.id}
            onDoubleClick={() => {
              setEditingShape({ id: shape.id, x: shape.x, y: shape.y });
              setInputValue(shape.text || "");
            }}
            onMouseDown={(e) => handleMouseDown(e, shape)}
            style={{ cursor: editingShape?.id === shape.id ? "text" : "move" }}
          >
            {editingShape?.id !== shape.id && (
              <text
                x={(shape.x || 0) * zoom + pan.x}
                y={(shape.y || 0) * zoom + pan.y}
                fontFamily={shape.fontFamily || "Arial"}
                fontSize={(shape.fontSize || 16) * zoom}
                fontWeight={shape.bold ? "bold" : "normal"}
                fontStyle={shape.italic ? "italic" : "normal"}
                textDecoration={shape.underline ? "underline" : "none"}
                fill={shape.color || "#000000"}
              >
                {shape.text || ""}
              </text>
            )}
          </g>
        );
      })}

      {currentShape && (
        <foreignObject
          x={(currentShape.x || 0) * zoom + pan.x}
          y={(currentShape.y || 0) * zoom + pan.y - (currentShape.fontSize || 16) / 2}
          width={300}
          height={50}
          style={{ overflow: "visible" }}
        >
          <textarea
            ref={inputRef}
            value={inputValue || ""}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveText}
            style={{
              fontSize: `${currentShape.fontSize || 16}px`,
              fontFamily: currentShape.fontFamily || "Arial",
              fontWeight: currentShape.bold ? "bold" : "normal",
              fontStyle: currentShape.italic ? "italic" : "normal",
              textDecoration: currentShape.underline ? "underline" : "none",
              color: currentShape.color || "#000000",
              border: "1px solid #ccc",
              outline: "none",
              background: "transparent",
              caretColor: currentShape.color || "#000000",
              resize: "none",
              overflow: "hidden",
              width: "100%",
              height: "100%",
            }}
          />
        </foreignObject>
      )}
    </>
  );
}
