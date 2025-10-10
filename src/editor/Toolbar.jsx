import React, { useState, useRef, useEffect } from "react";
import { useStore } from "../store";
import {
  PencilLine,
  Pen,
  Brush,
  Droplet,
  RectangleHorizontal,
  Circle,
  Minus,
  Triangle,
  Star,
  Pentagon,
  RemoveFormatting,
  Eraser,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { nanoid } from "nanoid";

export default function Toolbar() {
  const setTool = useStore((s) => s.setTool);
  const addShape = useStore((s) => s.addShape);
  const selectedTool = useStore((s) => s.selectedTool);

  const freehandType = useStore((s) => s.freehandType);
  const setFreehandType = useStore((s) => s.setFreehandType);
  const freehandColor = useStore((s) => s.freehandColor);
  const setFreehandColor = useStore((s) => s.setFreehandColor);
  const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
  const setFreehandStrokeWidth = useStore((s) => s.setFreehandStrokeWidth);

  const shapeType = useStore((s) => s.shapeType);
  const setShapeType = useStore((s) => s.setShapeType);

  const textStyle = useStore((s) => s.textStyle);
  const setTextStyle = useStore((s) => s.setTextStyle);

  const [showFreehandMenu, setShowFreehandMenu] = useState(false);
  const [showShapesMenu, setShowShapesMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);

  const freehandRef = useRef();
  const shapesRef = useRef();
  const textRef = useRef();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (freehandRef.current && !freehandRef.current.contains(e.target)) &&
        (shapesRef.current && !shapesRef.current.contains(e.target)) &&
        (textRef.current && !textRef.current.contains(e.target))
      ) {
        setShowFreehandMenu(false);
        setShowShapesMenu(false);
        setShowTextMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const freehandOptions = [
    { id: "pencil", label: "Pencil", icon: PencilLine },
    { id: "pen", label: "Pen", icon: Pen },
    { id: "brush", label: "Brush", icon: Brush },
    { id: "marker", label: "Marker", icon: Droplet },
  ];

  const shapeOptions = [
    { id: "rectangle", label: "Rectangle", icon: RectangleHorizontal },
    { id: "square", label: "Square", icon: RectangleHorizontal },
    { id: "circle", label: "Circle", icon: Circle },
    { id: "ellipse", label: "Ellipse", icon: Circle },
    { id: "triangle", label: "Triangle", icon: Triangle },
    { id: "star", label: "Star", icon: Star },
    { id: "polygon", label: "Polygon", icon: Pentagon },
    { id: "line", label: "Line", icon: Minus },
  ];

  const fonts = ["Arial", "Times New Roman", "Verdana", "Georgia", "Courier New", "Poppins", "Roboto", "Montserrat", "Lato", "Playfair Display"];

  const updateStyle = (key, value) => setTextStyle({ ...textStyle, [key]: value });

  return (
    <div className="fixed top-6 left-6 flex flex-col gap-3 bg-gray-700 p-3 rounded-2xl shadow-lg z-[1000]" style={{ width: 60 }}>

      {/* Freehand */}
      <div className="relative" ref={freehandRef}>
        <button
          title="Freehand"
          onClick={() => {
            setTool("freehand");
            setShowFreehandMenu((prev) => !prev);
            setShowShapesMenu(false);
            setShowTextMenu(false);
          }}
          className={`p-2 rounded-xl flex justify-center items-center relative ${selectedTool === "freehand" ? "bg-blue-500 text-white" : "bg-teal-600 text-white"}`}
        >
          <PencilLine size={22} />
          <ChevronDown size={14} className="absolute right-1 bottom-1 text-white opacity-70" />
        </button>

        {showFreehandMenu && (
          <div className="absolute left-16 top-0 flex flex-col bg-gray-700 border border-gray-600 rounded-xl p-2 w-36 z-50">
            {freehandOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setFreehandType(opt.id);
                    setTool("freehand");
                    setShowFreehandMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${freehandType === opt.id ? "bg-blue-500 text-white" : "hover:bg-gray-600 text-gray-200"}`}
                >
                  <Icon size={18} /> {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Shapes */}
      <div className="relative" ref={shapesRef}>
        <button
          title="Shapes"
          onClick={() => {
            setTool("shapes");
            setShowShapesMenu((prev) => !prev);
            setShowFreehandMenu(false);
            setShowTextMenu(false);
          }}
          className={`p-2 rounded-xl flex justify-center items-center relative ${selectedTool === "shapes" ? "bg-blue-500 text-white" : "bg-teal-600 text-white"}`}
        >
          <RectangleHorizontal size={22} />
          <ChevronDown size={14} className="absolute right-1 bottom-1 text-white opacity-70" />
        </button>

        {showShapesMenu && (
          <div className="absolute left-16 top-0 flex flex-col bg-gray-700 border border-gray-600 rounded-xl p-2 w-36 z-50">
            {shapeOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setShapeType(opt.id);
                    setTool("shapes");
                    setShowShapesMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${shapeType === opt.id ? "bg-blue-500 text-white" : "hover:bg-gray-600 text-gray-200"}`}
                >
                  <Icon size={18} /> {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="relative" ref={textRef}>
        <button
          title="Text"
          onClick={() => {
            setTool("text");
            setShowTextMenu((prev) => !prev);
            setShowFreehandMenu(false);
            setShowShapesMenu(false);
          }}
          className={`p-2 rounded-xl flex justify-center items-center relative ${selectedTool === "text" ? "bg-blue-500 text-white" : "bg-teal-600 text-white"}`}
        >
          <span className="font-bold text-lg select-none">T</span>
          <ChevronDown size={14} className="absolute right-1 bottom-1 text-white opacity-70" />
        </button>

        {showTextMenu && (
          <div className="absolute left-16 top-0 flex flex-col bg-gray-700 border border-gray-600 rounded-xl p-2 w-52 z-50 space-y-2">
            {/* Font Family */}
            <select
              value={textStyle.fontFamily || "Arial"}
              onChange={(e) => updateStyle("fontFamily", e.target.value)}
              className="bg-gray-700 rounded-md p-1 text-sm outline-none w-full"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>

            {/* Font Size */}
            <input
              type="range"
              min="8"
              max="80"
              value={textStyle.fontSize || 16}
              onChange={(e) => updateStyle("fontSize", Number(e.target.value))}
              className="w-full accent-blue-500"
            />

            {/* Font Color */}
            <input
              type="color"
              value={textStyle.color || "#ffffff"}
              onChange={(e) => updateStyle("color", e.target.value)}
              className="w-full h-6 cursor-pointer bg-transparent border-none"
            />

            {/* Alignment */}
            <div className="flex justify-between">
              {["left", "center", "right"].map((align) => (
                <button
                  key={align}
                  onClick={() => updateStyle("textAlign", align)}
                  className={`flex-1 py-1 mx-0.5 rounded-md text-sm ${textStyle.textAlign === align ? "bg-blue-500" : "bg-gray-700"}`}
                >
                  {align[0].toUpperCase()}
                </button>
              ))}
            </div>

            {/* Bold / Italic / Underline */}
            <div className="flex justify-between">
              <button
                onClick={() => updateStyle("bold", !textStyle.bold)}
                className={`flex-1 py-1 mx-0.5 rounded-md font-bold ${textStyle.bold ? "bg-blue-500" : "bg-gray-700"}`}
              >
                B
              </button>
              <button
                onClick={() => updateStyle("italic", !textStyle.italic)}
                className={`flex-1 py-1 mx-0.5 rounded-md italic ${textStyle.italic ? "bg-blue-500" : "bg-gray-700"}`}
              >
                I
              </button>
              <button
                onClick={() => updateStyle("underline", !textStyle.underline)}
                className={`flex-1 py-1 mx-0.5 rounded-md underline ${textStyle.underline ? "bg-blue-500" : "bg-gray-700"}`}
              >
                U
              </button>
            </div>

            {/* Line Height */}
            <input
              type="range"
              min="0.8"
              max="2"
              step="0.1"
              value={textStyle.lineHeight || 1.2}
              onChange={(e) => updateStyle("lineHeight", Number(e.target.value))}
              className="w-full accent-blue-500"
            />

            {/* Letter Spacing */}
            <input
              type="range"
              min="-2"
              max="10"
              step="0.1"
              value={textStyle.letterSpacing || 0}
              onChange={(e) => updateStyle("letterSpacing", Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        )}
      </div>

      {/* Eraser */}
      <button
        title="Eraser"
        onClick={() => setTool("eraser")}
        className={`p-2 rounded-xl flex justify-center items-center ${selectedTool === "eraser" ? "bg-blue-500 text-white" : "bg-teal-600 text-white"}`}
      >
        <Eraser size={22} />
      </button>

      {/* Color Picker */}
      <input
        type="color"
        value={freehandColor}
        onChange={(e) => setFreehandColor(e.target.value)}
        className="w-8 h-8 rounded-md cursor-pointer border-none"
        title="Color"
      />

      {/* Stroke Width */}
      <div className="flex flex-col items-center text-white text-xs">
        <SlidersHorizontal size={18} />
        <input
          type="range"
          min="1"
          max="20"
          value={freehandStrokeWidth}
          onChange={(e) => setFreehandStrokeWidth(Number(e.target.value))}
          className="w-10 mt-1 cursor-pointer"
          title="Stroke Width"
        />
      </div>

      {/* Image */}
      <button
        title="Image"
        onClick={() => {
          setTool("image");
          fileInputRef.current?.click();
        }}
        className={`p-2 rounded-xl flex justify-center items-center ${selectedTool === "image" ? "bg-blue-500 text-white" : "bg-teal-600 text-white"}`}
      >
        <span className="font-bold text-lg select-none">🖼️</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          addShape({ id: nanoid(), type: "image", src: url, x: 100, y: 100, width: 150, height: 150 });
          e.target.value = null;
        }}
      />

      {/* Clear Canvas */}
      <button
        title="Clear Canvas"
        onClick={() => window.location.reload()}
        className="p-2 rounded-xl bg-red-600 text-white flex justify-center items-center"
      >
        <RemoveFormatting size={22} />
      </button>
    </div>
  );
}
