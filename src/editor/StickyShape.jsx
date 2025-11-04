import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store";

export default function StickyShape({ shape, isSelected }) {
  const updateShape = useStore((s) => s.updateShape);
  const setSelectedShape = useStore((s) => s.setSelectedShape);

  const [isEditing, setIsEditing] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (isEditing && textRef.current) {
      textRef.current.focus();
    }
  }, [isEditing]);

  // ✅ Enable drag
  const handleMouseDown = (e) => {
    if (isEditing) return;
    e.stopPropagation();
    setSelectedShape(shape);
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      updateShape(shape.id, {
        x: shape.x + dx,
        y: shape.y + dy,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  const handleClick = (e) => {
  e.stopPropagation(); // prevent Canvas click from firing
  useStore.getState().setSelectedShape(shape); // select this sticky
  useStore.getState().setTool("sticky");       // show sticky sidebar
};


  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <foreignObject
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
      onMouseDown={handleMouseDown}
      onClick={handleClick} 
      onDoubleClick={handleDoubleClick}
      data-shape-id={shape.id}
      style={{
        cursor: "move",
        outline: isSelected ? "2px solid #2563eb" : "none",
      }}
    >
      <div
        className="w-full h-full rounded-lg shadow-lg p-2"
        style={{
          backgroundColor: shape.fill || "#fae316",
          color: shape.color || "#000",
          fontSize: shape.fontSize || 16,
          fontFamily: shape.fontFamily || "Arial",
          overflow: "auto",
        }}
      >
        {isEditing ? (
          <textarea
            ref={textRef}
            defaultValue={shape.text}
            onBlur={(e) => {
              updateShape(shape.id, { text: e.target.value });
              handleBlur();
            }}
            className="w-full h-full bg-transparent border-none outline-none resize-none"
          />
        ) : (
          <div>{shape.text}</div>
        )}
      </div>
    </foreignObject>
  );
}
