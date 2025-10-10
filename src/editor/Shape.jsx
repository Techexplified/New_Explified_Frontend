import React from "react";
import { useStore } from "../store";

export default function Shape(props) {
  const {
    type,
    color,
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
  } = props;

  // Get text style from global store (only for text type)
  const textStyle = useStore((s) => s.textStyle) || {};

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

    case "rect":
      return (
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );

    case "square":
      return (
        <rect
          x={x}
          y={y}
          width={size}
          height={size}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );

    case "circle":
      return (
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );

    case "ellipse":
      return (
        <ellipse
          cx={x}
          cy={y}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
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
        />
      );

    case "polygon":
    case "triangle":
    case "star":
      return (
        <polygon
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
        />
      );

    case "text":
      return (
        <text
          x={x}
          y={y}
          style={{
            fontFamily: fontFamily || textStyle.fontFamily || "Arial",
            fontSize: fontSize || textStyle.fontSize || 18,
            fontWeight:
              bold || textStyle.bold ? "bold" : "normal",
            fontStyle:
              italic || textStyle.italic ? "italic" : "normal",
            textDecoration:
              underline || textStyle.underline ? "underline" : "none",
            fill: textStyle.color || "#000000",
            textAnchor:
              textStyle.textAlign === "center"
                ? "middle"
                : textStyle.textAlign === "right"
                ? "end"
                : "start",
            lineHeight: textStyle.lineHeight || "normal",
            letterSpacing: textStyle.letterSpacing || "normal",
            userSelect: "none",
          }}
        >
          {text}
        </text>
      );

    default:
      return null;
  }
}
