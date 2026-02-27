import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store";
import { nanoid } from "nanoid";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowDown,
  ArrowUp,
  ArrowUpFromLine,
  ArrowDownToLine,
  Image as ImageIcon,
  Eraser,
  MousePointer2,
  Square,
  CheckSquare,
} from "lucide-react";

const strokeColors = [
  "#ffffff",
  "#ef4444",
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#000000",
];

export default function RightSidebar() {
  // ✅ Zustand store bindings
  const {
    selectedTool,
    textStyle,
    setTextStyle,
    freehandColor,
    setFreehandColor,
    freehandStrokeWidth,
    setFreehandStrokeWidth,
    freehandOpacity,
    setFreehandOpacity,
    shapeType,
    shapeColor,
    setShapeColor,
    shapeFill,
    setShapeFill,
    shapeStrokeWidth,
    setShapeStrokeWidth,
    shapeOpacity,
    setShapeOpacity,
    setShapeType,
    eraserMode,
    setEraserMode,
    isPerfectShape,
    setIsPerfectShape,
  } = useStore();

  const [opacity, setOpacity] = useState(textStyle.opacity * 100);
  const selectedShape = useStore((s) => s.selectedShape);
  const updateShape = useStore((s) => s.updateShape);
  const [shapeSize, setShapeSize] = useState(selectedShape?.width || 200);
  const handleOpacityChange = (value) => {
    setOpacity(value);
    setTextStyle({ opacity: value / 100 });
  };

  // Sync local state when selectedShape changes
  useEffect(() => {
    if (selectedShape) setShapeSize(selectedShape.width);
  }, [selectedShape]);
  const hiddenTools = ["pan", "lock", "select", "hand"];
  const shouldShowSidebar =
    selectedTool && !hiddenTools.includes(selectedTool);

  return (
    <AnimatePresence>
      {shouldShowSidebar && (
        <motion.div
          key={selectedTool}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed right-6 top-24 w-[240px] max-h-[80vh] overflow-auto 
                     bg-[var(--bg-secondary)] shadow-xl border border-[var(--panel-border)] 
                     rounded-xl p-4 font-inter text-[13px] text-[var(--text-primary)] z-40 custom-scrollbar"
        >
          {/* ========== ERASER TOOL ========== */}
          {selectedTool === "eraser" && (
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-5"
            >
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Eraser Mode</h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setEraserMode("object")}
                    className={`w-full py-3 px-4 rounded-lg flex items-center gap-3 font-medium transition-all
                      ${eraserMode === "object"
                        ? "bg-[var(--accent)] text-white shadow-md"
                        : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                      }`}
                  >
                    <MousePointer2 size={18} />
                    <div className="text-left">
                      <div className="text-sm">Stroke Eraser</div>
                      <div className="text-xs opacity-70">Remove entire shapes</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setEraserMode("paint")}
                    className={`w-full py-3 px-4 rounded-lg flex items-center gap-3 font-medium transition-all
                      ${eraserMode === "paint"
                        ? "bg-[var(--accent)] text-white shadow-md"
                        : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                      }`}
                  >
                    <Eraser size={18} />
                    <div className="text-left">
                      <div className="text-sm">Partial Eraser</div>
                      <div className="text-xs opacity-70">Erase parts of strokes</div>
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== FREEHAND TOOL ========== */}
          {(selectedTool === "freehand" || selectedTool === "pencil") && (
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-5"
            >
              {/* Stroke Color */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Stroke</h3>
                <div className="flex items-center gap-3">
                  {strokeColors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setFreehandColor(color)}
                      className={`w-6 h-6 rounded-md border cursor-pointer 
                        ${color === "#ffffff" ? "border-[var(--panel-border)]" : "border-transparent"} 
                        hover:ring-2 hover:ring-[var(--accent)] 
                        ${freehandColor === color ? "ring-2 ring-[var(--accent)]" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Stroke Width</h3>
                <div className="flex items-center gap-3">
                  {[1, 3, 5, 8].map((w) => (
                    <button
                      key={w}
                      onClick={() => setFreehandStrokeWidth(w)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        ${freehandStrokeWidth === w
                          ? "bg-[var(--accent-light)] text-[var(--accent)]"
                          : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                        }`}
                    >
                      <div
                        className="bg-[var(--text-primary)] rounded-full"
                        style={{ width: "18px", height: `${w}px` }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Opacity</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={freehandOpacity * 100}
                    onChange={(e) => setFreehandOpacity(e.target.value / 100)}
                    className="flex-1 cursor-pointer"
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <span className="text-xs text-[var(--text-secondary)] w-6">
                    {Math.round(freehandOpacity * 100)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
          {/* ========== TEXT TOOL ========== */}
          {selectedTool === "text" && (
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {/* Font Color */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Color</h3>
                <div className="flex gap-3">
                  {strokeColors.map((c) => (
                    <div
                      key={c}
                      className={`w-6 h-6 rounded-md cursor-pointer border 
                        ${c === "#ffffff" ? "border-[var(--panel-border)]" : "border-transparent"}
                        hover:ring-2 hover:ring-[var(--accent)]
                        ${textStyle.color === c ? "ring-2 ring-[var(--accent)]" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setTextStyle({ color: c })}
                    />
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                  Font Family
                </h3>
                <div className="relative">
                  <select
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--panel-border)] text-[var(--text-primary)] text-sm rounded-lg px-3 py-2 pr-8 
                               focus:outline-none focus:ring-2 focus:ring-[var(--accent)] hover:border-[var(--accent)] transition"
                    value={textStyle.fontFamily}
                    onChange={(e) => setTextStyle({ fontFamily: e.target.value })}
                  >
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Courier New</option>
                    <option>Monospace</option>
                    <option>Verdana</option>
                  </select>
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Font Size</h3>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={textStyle.fontSize}
                  onChange={(e) => setTextStyle({ fontSize: parseInt(e.target.value) })}
                  className="w-full"
                  style={{ accentColor: "var(--accent)" }}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">{textStyle.fontSize}px</p>
              </div>

              {/* Alignment */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Align</h3>
                <div className="flex gap-3">
                  {[
                    { icon: <AlignLeft size={18} />, value: "left" },
                    { icon: <AlignCenter size={18} />, value: "center" },
                    { icon: <AlignRight size={18} />, value: "right" },
                  ].map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setTextStyle({ textAlign: a.value })}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        ${textStyle.textAlign === a.value
                          ? "bg-[var(--accent-light)] text-[var(--accent)]"
                          : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                        }`}
                    >
                      {a.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Opacity</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) => handleOpacityChange(e.target.value)}
                    className="flex-1 cursor-pointer"
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <span className="text-xs text-[var(--text-secondary)] w-6">{opacity}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== SHAPE TOOL ========== */}
          {selectedTool === "shape" && (
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {/* Shape Type */}
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">Shapes</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "rect", label: "▭" },
                    { id: "square", label: "▢" },
                    { id: "circle", label: "◯" },
                    { id: "ellipse", label: "⬭" },
                    { id: "triangle", label: "△" },
                    { id: "polygon", label: "⬡" },
                    { id: "line", label: "／" },
                    { id: "arrow", label: "➜" },
                    { id: "diamond", label: "◇" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShapeType(s.id)}
                      className={`w-12 h-12 border rounded-lg flex items-center justify-center text-lg font-bold transition 
                        ${shapeType === s.id
                          ? "bg-[var(--accent-light)] text-[var(--accent)] border-[var(--accent)]"
                          : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)] border-transparent"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Perfect Shape Toggle */}
              <div>
                <label
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-[var(--toolbar-hover)] hover:bg-[var(--panel-border)] transition-all"
                  onClick={() => setIsPerfectShape(!isPerfectShape)}
                >
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${isPerfectShape
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "bg-transparent border-[var(--text-secondary)]"}`}
                  >
                    {isPerfectShape && <CheckSquare size={14} className="text-white" />}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">Perfect Shape (1:1)</div>
                    <div className="text-xs text-[var(--text-secondary)]">Draw perfect squares & circles</div>
                  </div>
                </label>
              </div>

              {/* Stroke Color */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Stroke Color</h3>
                <div className="flex items-center gap-3">
                  {strokeColors.map((c) => (
                    <div
                      key={c}
                      onClick={() => setShapeColor(c)}
                      className={`w-6 h-6 rounded-md border cursor-pointer 
                        ${c === "#ffffff" ? "border-[var(--panel-border)]" : "border-transparent"} 
                        hover:ring-2 hover:ring-[var(--accent)] 
                        ${shapeColor === c ? "ring-2 ring-[var(--accent)]" : ""}`}
                      style={{ backgroundColor: c }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Fill */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Fill</h3>
                <button
                  onClick={() =>
                    setShapeFill(
                      shapeFill === "transparent" ? shapeColor : "transparent"
                    )
                  }
                  className={`w-full py-2 rounded-lg font-medium transition 
                    ${shapeFill !== "transparent"
                      ? "bg-[var(--accent-light)] text-[var(--accent)]"
                      : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                    }`}
                >
                  {shapeFill !== "transparent" ? "Filled" : "No Fill"}
                </button>
              </div>

              {/* Stroke Width */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Stroke Width</h3>
                <div className="flex gap-3">
                  {[1, 3, 5, 8].map((w) => (
                    <button
                      key={w}
                      onClick={() => setShapeStrokeWidth(w)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        ${shapeStrokeWidth === w
                          ? "bg-[var(--accent-light)] text-[var(--accent)]"
                          : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                        }`}
                    >
                      <div
                        className="bg-[var(--text-primary)] rounded-full"
                        style={{ width: "18px", height: `${w}px` }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Opacity</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shapeOpacity * 100}
                    onChange={(e) => setShapeOpacity(e.target.value / 100)}
                    className="flex-1 cursor-pointer"
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <span className="text-xs text-[var(--text-secondary)] w-6">
                    {Math.round(shapeOpacity * 100)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}


          {/* ========== IMAGE TOOL ========== */}
          {selectedTool === "image" && (
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {/* Upload */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Upload Image
                </h3>
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[var(--panel-border)] rounded-lg p-4 text-[var(--text-secondary)] cursor-pointer hover:border-[var(--accent)] transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const src = event.target.result;
                          useStore.getState().addShape({
                            id: nanoid(),
                            type: "image",
                            src,
                            x: 150,
                            y: 150,
                            width: 200,
                            height: 200,
                            rotation: 0,
                            opacity: 1,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <ImageIcon size={22} className="text-[var(--accent)] mb-1" />
                  <span className="text-xs">Click to upload</span>
                </label>
              </div>

              {/* Sliders */}
              <ImageControls />
            </motion.div>
          )}



        </motion.div>
      )}
    </AnimatePresence>
  );
}
/* ========== IMAGE CONTROLS COMPONENT ========== */
const ImageControls = () => {
  const selectedShape = useStore((s) => s.selectedShape);
  const updateSelectedShape = useStore((s) => s.updateSelectedShape);
  const removeShape = useStore((s) => s.removeShape);
  const setSelectedShape = useStore((s) => s.setSelectedShape);

  if (!selectedShape || selectedShape.type !== "image") {
    return (
      <p className="text-xs text-[var(--text-secondary)] italic text-center">
        Select an image to edit
      </p>
    );
  }

  const currentFilter = selectedShape.filter || "none";
  const isFlippedH = selectedShape.flipH || false;
  const isFlippedV = selectedShape.flipV || false;

  const filters = [
    { id: "none", label: "None", icon: "○" },
    { id: "grayscale", label: "Grayscale", icon: "◐" },
    { id: "sepia", label: "Sepia", icon: "◑" },
    { id: "blur", label: "Blur", icon: "◌" },
    { id: "brightness", label: "Bright", icon: "☀" },
    { id: "contrast", label: "Contrast", icon: "◧" },
    { id: "saturate", label: "Saturate", icon: "◉" },
    { id: "invert", label: "Invert", icon: "◈" },
  ];

  const handleOpacityChange = (e) => {
    const newOpacity = Number(e.target.value) / 100;
    updateSelectedShape({ opacity: newOpacity });
  };

  const handleFlipH = () => {
    updateSelectedShape({ flipH: !isFlippedH });
  };

  const handleFlipV = () => {
    updateSelectedShape({ flipV: !isFlippedV });
  };

  const handleFilterChange = (filterId) => {
    updateSelectedShape({ filter: filterId });
  };

  const handleReset = () => {
    updateSelectedShape({
      opacity: 1,
      filter: "none",
      flipH: false,
      flipV: false,
      rotation: 0,
    });
  };

  return (
    <>
      {/* Opacity */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Opacity</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round((selectedShape.opacity ?? 1) * 100)}
            onChange={handleOpacityChange}
            className="flex-1 cursor-pointer"
            style={{ accentColor: "var(--accent)" }}
          />
          <span className="text-xs text-[var(--text-secondary)] w-8 text-right">
            {Math.round((selectedShape.opacity ?? 1) * 100)}%
          </span>
        </div>
      </div>

      {/* Filters */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Filters</h3>
        <div className="grid grid-cols-4 gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => handleFilterChange(f.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs transition-all
                ${currentFilter === f.id
                  ? "bg-[var(--accent)] text-white shadow-md"
                  : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
                }`}
              title={f.label}
            >
              <span className="text-lg mb-0.5">{f.icon}</span>
              <span className="text-[10px] truncate w-full text-center">{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Flip Controls */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Transform</h3>
        <div className="flex gap-2">
          <button
            onClick={handleFlipH}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all
              ${isFlippedH
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
              }`}
          >
            <span style={{ transform: "scaleX(-1)", display: "inline-block" }}>↔</span>
            Flip H
          </button>
          <button
            onClick={handleFlipV}
            className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all
              ${isFlippedV
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)]"
              }`}
          >
            <span style={{ transform: "scaleY(-1)", display: "inline-block" }}>↕</span>
            Flip V
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Quick Actions</h3>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleReset}
            className="w-full py-2 px-3 rounded-lg bg-[var(--toolbar-hover)] text-[var(--text-secondary)] hover:bg-[var(--panel-border)] text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>↺</span>
            Reset All Effects
          </button>
          <button
            onClick={() => {
              removeShape(selectedShape.id);
              setSelectedShape(null);
            }}
            className="w-full py-2 px-3 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 text-sm font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>🗑</span>
            Delete Image
          </button>
        </div>
      </div>
    </>
  );
};
