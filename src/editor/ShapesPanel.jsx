import React from "react";
import { useStore } from "../store";
import { RectangleHorizontal, Circle, Minus } from "lucide-react";

export default function ShapesPanel() {
  const selectedTool = useStore((state) => state.selectedTool);
  const setTool = useStore((state) => state.setTool);

  const tools = [
    { id: "rectangle", label: "Rectangle" },
    { id: "circle", label: "Circle" },
    { id: "line", label: "Line" },
  ];

  return (
    <div
      className="flex flex-col gap-3 bg-gray-600 rounded-t-2xl rounded-b-2xl p-2"
      style={{
        position: "absolute",
        top: 100,
        left: 75,
        width: "60px",
        marginLeft: 12,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      {tools.map((t) => (
        <button
          key={t.id}
          onClick={() => setTool(t.id)}
          className={`flex justify-center items-center p-2 rounded-xl text-lg
            ${
              selectedTool === t.id
                ? "bg-blue-500 text-white"
                : "bg-teal-600 text-white"
            }`}
          style={{ fontSize: "1.1rem" }}
          title={t.label}
        >
          {t.label === "Rectangle" ? (
            <RectangleHorizontal />
          ) : t.label === "Circle" ? (
            <Circle />
          ) : t.label === "Line" ? (
            <Minus />
          ) : null}
        </button>
      ))}
    </div>
  );
}
