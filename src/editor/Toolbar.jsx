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
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  SlidersHorizontal,
  Image as ImageIcon,
  PenTool,
} from "lucide-react";
import { nanoid } from "nanoid";

export default function Toolbar() {
  const setTool = useStore((s) => s.setTool);
  const addShape = useStore((s) => s.addShape);
  const selectedTool = useStore((s) => s.selectedTool);
  const selectedShapeId = useStore((s) => s.selectedShapeId);
  const shapes = useStore((s) => s.shapes);
  const updateShape = useStore((s) => s.updateShape);

  const freehandType = useStore((s) => s.freehandType);
  const setFreehandType = useStore((s) => s.setFreehandType);
  const freehandColor = useStore((s) => s.freehandColor);
  const setFreehandColor = useStore((s) => s.setFreehandColor);
  const freehandStrokeWidth = useStore((s) => s.freehandStrokeWidth);
  const setFreehandStrokeWidth = useStore((s) => s.setFreehandStrokeWidth);

  const textStyle = useStore((s) => s.textStyle);
  const setTextStyle = useStore((s) => s.setTextStyle);

  const shapeType = useStore((s) => s.shapeType);
  const setShapeType = useStore((s) => s.setShapeType);

  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const toolbarRef = useRef();
  const fileInputRef = useRef(null);

  const fonts = [
    "Arial",
    "Poppins",
    "Roboto",
    "Times New Roman",
    "Verdana",
    "Montserrat",
    "Lato",
    "Playfair Display",
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target)) {
        setOpenMenu(null);
        setOpenSubMenu(null);
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update text style
  const updateStyle = (key, value) => {
    setTextStyle({ ...textStyle, [key]: value });
    if (selectedShapeId) {
      updateShape(selectedShapeId, { style: { ...textStyle, [key]: value } });
    }
  };

  return (
    <div
      ref={toolbarRef}
      className="fixed left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 bg-[#0d1418]/90 border border-[#23b5b5]/40 p-2 rounded-2xl shadow-xl z-[1000]"
      style={{ width: "56px" }}
    >
      {/* ===== WRITE TOOL (NEW) ===== */}
      <button
        title="Write"
        onClick={() => setTool("write")}
        className={`p-2 rounded-xl flex justify-center items-center ${
          selectedTool === "write" ? "bg-[#23b5b5]" : "bg-[#1a2428]"
        } text-white hover:bg-[#23b5b5]/50`}
      >
        <PenTool size={20} />
      </button>

      {/* ===== FREEHAND ===== */}
      <div className="relative group">
        <button
          title="Freehand"
          onClick={() => {
            setTool("freehand");
            setOpenMenu(openMenu === "freehand" ? null : "freehand");
            setOpenSubMenu(null);
          }}
          className={`p-2 rounded-xl flex justify-center items-center ${
            selectedTool === "freehand" ? "bg-[#23b5b5]" : "bg-[#1a2428]"
          } text-white hover:bg-[#23b5b5]/50`}
        >
          <PencilLine size={20} />
        </button>

        {openMenu === "freehand" && (
          <div className="absolute left-[70px] top-0 flex flex-col bg-[#0d1418] border border-[#23b5b5]/40 rounded-xl p-2 w-12 gap-2">
            {[Pen, Brush, Droplet, PencilLine].map((Icon, i) => {
              const type = ["pen", "brush", "color", "pencil"][i];
              return (
                <div key={i} className="relative">
                  <button
                    onClick={() => {
                      if (type === "color") {
                        setShowColorPicker(!showColorPicker);
                      } else {
                        setFreehandType(type);
                        setTool("freehand");
                        setShowColorPicker(false);
                        setOpenMenu(null);
                      }
                    }}
                    className={`p-2 rounded-lg hover:bg-[#23b5b5]/40 ${
                      freehandType === type ? "bg-[#23b5b5]" : ""
                    }`}
                  >
                    <Icon size={18} className="text-white" />
                  </button>

                  {/* Color picker inside Droplet */}
                  {type === "color" && showColorPicker && (
                    <div className="absolute left-[60px] top-0 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg p-2 flex justify-center">
                      <input
                        type="color"
                        value={freehandColor}
                        onChange={(e) => setFreehandColor(e.target.value)}
                        className="w-8 h-8 cursor-pointer border-none rounded-md"
                        title="Freehand Color"
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Stroke Width Slider */}
            <div className="flex flex-col items-center text-white mt-1">
              <SlidersHorizontal size={16} />
              <input
                type="range"
                min="1"
                max="20"
                value={freehandStrokeWidth}
                onChange={(e) =>
                  setFreehandStrokeWidth(Number(e.target.value))
                }
                className="w-10 mt-1 cursor-pointer accent-[#23b5b5]"
                title="Stroke Width"
              />
            </div>
          </div>
        )}
      </div>

      {/* ===== SHAPES ===== */}
      <div className="relative group">
        <button
          title="Shapes"
          onClick={() => {
            setTool("shapes");
            setOpenMenu(openMenu === "shapes" ? null : "shapes");
            setOpenSubMenu(null);
          }}
          className={`p-2 rounded-xl flex justify-center items-center ${
            selectedTool === "shapes" ? "bg-[#23b5b5]" : "bg-[#1a2428]"
          } text-white hover:bg-[#23b5b5]/50`}
        >
          <RectangleHorizontal size={20} />
        </button>
        {openMenu === "shapes" && (
          <div className="absolute left-[70px] top-0 flex flex-col bg-[#0d1418] border border-[#23b5b5]/40 rounded-xl p-2 w-12 gap-2">
            {[RectangleHorizontal, Circle, Triangle, Star, Pentagon, Minus].map(
              (Icon, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const ids = [
                      "rectangle",
                      "circle",
                      "triangle",
                      "star",
                      "polygon",
                      "line",
                    ];
                    setShapeType(ids[i]);
                    setTool("shapes");
                    setOpenMenu(null);
                  }}
                  className={`p-2 rounded-lg hover:bg-[#23b5b5]/40 ${
                    shapeType ===
                    ["rectangle", "circle", "triangle", "star", "polygon", "line"][i]
                      ? "bg-[#23b5b5]"
                      : ""
                  }`}
                >
                  <Icon size={18} className="text-white" />
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* ===== ERASER ===== */}
      <button
        title="Eraser"
        onClick={() => setTool("eraser")}
        className={`p-2 rounded-xl flex justify-center items-center ${
          selectedTool === "eraser" ? "bg-[#23b5b5]" : "bg-[#1a2428]"
        } text-white hover:bg-[#23b5b5]/50`}
      >
        <Eraser size={20} />
      </button>

      {/* ===== TEXT ===== */}
      <div className="relative group">
        <button
          title="Text"
          onClick={() => {
            setTool("text");
            setOpenMenu(openMenu === "text" ? null : "text");
            setOpenSubMenu(null);
          }}
          className={`p-2 rounded-xl flex justify-center items-center ${
            selectedTool === "text" ? "bg-[#23b5b5]" : "bg-[#1a2428]"
          } text-white hover:bg-[#23b5b5]/50`}
        >
          <Type size={20} />
        </button>
        {openMenu === "text" && (
          <div className="absolute left-[70px] top-0 flex flex-col bg-[#0d1418] border border-[#23b5b5]/40 rounded-xl p-2 w-12 gap-2">
            {/* Font Family */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenSubMenu(openSubMenu === "font" ? null : "font")
                }
                className="p-2 rounded-lg hover:bg-[#23b5b5]/40 text-white"
                title="Font"
              >
                <Type size={18} />
              </button>
              {openSubMenu === "font" && (
                <div className="absolute left-[60px] top-0 flex flex-col bg-[#0d1418] border border-[#23b5b5]/40 rounded-xl p-2 w-36">
                  {fonts.map((f) => (
                    <button
                      key={f}
                      onClick={() => updateStyle("fontFamily", f)}
                      className="text-left text-sm hover:text-[#23b5b5] text-white"
                      style={{ fontFamily: f }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenSubMenu(openSubMenu === "color" ? null : "color")
                }
                className="p-2 rounded-lg hover:bg-[#23b5b5]/40 text-white"
                title="Color"
              >
                <Palette size={18} />
              </button>
              {openSubMenu === "color" && (
                <div className="absolute left-[60px] top-0 bg-[#0d1418] border border-[#23b5b5]/40 rounded-xl p-2">
                  <input
                    type="color"
                    value={textStyle.color || "#ffffff"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="w-8 h-8 cursor-pointer border-none bg-transparent"
                  />
                </div>
              )}
            </div>

            {/* Alignment */}
            <div className="relative">
              <button
                onClick={() =>
                  setOpenSubMenu(openSubMenu === "align" ? null : "align")
                }
                className="p-2 rounded-lg hover:bg-[#23b5b5]/40 text-white"
                title="Align"
              >
                <AlignLeft size={18} />
              </button>
              {openSubMenu === "align" && (
                <div className="absolute left-[60px] top-0 flex flex-col bg-[#0d1418] border border-[#23b5b5]/40 rounded-xl p-2">
                  {[{ key: "left", icon: AlignLeft },
                    { key: "center", icon: AlignCenter },
                    { key: "right", icon: AlignRight }].map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => updateStyle("textAlign", key)}
                      className={`p-2 rounded-lg hover:bg-[#23b5b5]/40 ${
                        textStyle.textAlign === key ? "bg-[#23b5b5]" : ""
                      }`}
                    >
                      <Icon size={18} className="text-white" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bold / Italic / Underline */}
            {[{ id: "bold", Icon: Bold },
              { id: "italic", Icon: Italic },
              { id: "underline", Icon: Underline }].map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => updateStyle(id, !textStyle[id])}
                className={`p-2 rounded-lg hover:bg-[#23b5b5]/40 text-white ${
                  textStyle[id] ? "bg-[#23b5b5]" : ""
                }`}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== IMAGE ===== */}
      <button
        title="Image"
        onClick={() => {
          setTool("image");
          fileInputRef.current?.click();
        }}
        className={`p-2 rounded-xl flex justify-center items-center ${
          selectedTool === "image" ? "bg-[#23b5b5]" : "bg-[#1a2428]"
        } text-white hover:bg-[#23b5b5]/50`}
      >
        <ImageIcon size={20} />
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
          addShape({
            id: nanoid(),
            type: "image",
            src: url,
            x: 100,
            y: 100,
            width: 150,
            height: 150,
          });
          e.target.value = null;
        }}
      />

      {/* ===== CLEAR CANVAS ===== */}
      <button
        title="Clear Canvas"
        onClick={() => window.location.reload()}
        className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-500 flex justify-center items-center"
      >
        X
      </button>
    </div>
  );
}
