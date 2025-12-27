import React, { useEffect, useRef } from "react";
import { useStore } from "../store";
import { nanoid } from "nanoid";

export default function Shape(props) {
  const {
    type,
    color,
    fill = "transparent",
    points = [],
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    size = 0,
    radius = 0,
    rx = 0,
    ry = 0,
    text = "",
    fontFamily,
    fontSize,
    bold,
    italic,
    underline,
    strokeWidth = 2,
    opacity = 1,
    textAlign = "left",
  } = props;

  // ✅ Get store state
  const {
    textStyle,
    selectedTool,
    addShape,
    writePosition,
    notes,
    setWritePosition,
    setNotes,
  } = useStore();

  const prevToolRef = useRef(selectedTool);

  // ✅ Handle writing tool behavior
  useEffect(() => {
    if (prevToolRef.current === "write" && selectedTool !== "write" && writePosition) {
      const textShape = {
        id: nanoid(),
        type: "text",
        lines: notes,
        x: writePosition.x,
        y: writePosition.y,
        color,
        fontSize: 16,
        fontFamily: "monospace",
      };
      addShape(textShape);
      setWritePosition(null);
      setNotes([""]);
    }
    prevToolRef.current = selectedTool;
  }, [selectedTool, notes, addShape, writePosition, color, setWritePosition, setNotes]);


  // ✅ Render shapes dynamically
  switch (type) {
    case "freehand":
      return (
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
      );


      // ✅ NEW: Arrow shape support
    case "arrow": {
      if (!points || points.length < 2) return null;
      const [start, end] = points;

      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const angle = Math.atan2(dy, dx);
      const headLength = 10 + strokeWidth; // scales with thickness

      const x1 = end.x - headLength * Math.cos(angle - Math.PI / 6);
      const y1 = end.y - headLength * Math.sin(angle - Math.PI / 6);
      const x2 = end.x - headLength * Math.cos(angle + Math.PI / 6);
      const y2 = end.y - headLength * Math.sin(angle + Math.PI / 6);

      return (
        <g opacity={opacity}>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <polygon
            points={`${end.x},${end.y} ${x1},${y1} ${x2},${y2}`}
            fill={color}
          />
        </g>
      );
    }


    case "rect":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={fill}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

    case "square":
      return (
        <rect
          x={x}
          y={y}
          width={size}
          height={size}
          fill={fill}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

    case "circle":
      return (
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={fill}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

    case "ellipse":
      return (
        <ellipse
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          fill={fill}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

    case "line":
      return (
        <line
          x1={points[0]?.x}
          y1={points[0]?.y}
          x2={points[1]?.x}
          y2={points[1]?.y}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

    case "polygon":
    case "triangle":
    case "star":
      return (
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill={fill}
          stroke={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );

    case "text":
      return (
        <text
          x={x}
          y={y}
          fill={color}
          opacity={opacity}
          fontSize={fontSize}
          fontFamily={fontFamily}
          textAnchor={
            textAlign === "center"
              ? "middle"
              : textAlign === "right"
              ? "end"
              : "start"
          }
          style={{
            fontWeight: bold ? "bold" : "normal",
            fontStyle: italic ? "italic" : "normal",
            textDecoration: underline ? "underline" : "none",
            userSelect: "none",
          }}
        >
          {text}
        </text>
      );


      case "sticky":
  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ overflow: "visible" }}
    >
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: fill,
          borderRadius: "8px",
          padding: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          fontFamily: fontFamily || "Arial",
          fontSize: fontSize || 16,
          color: color || "#000",
          whiteSpace: "pre-wrap",
        }}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => {
          const updatedText = e.currentTarget.textContent;
          useStore.getState().updateShape(props.id, (prev) => ({
            ...prev,
            text: updatedText,
          }));
        }}
      >
        {text || "Your note here"}
      </div>
    </foreignObject>
  );

    default:
      return null;
  }
}
