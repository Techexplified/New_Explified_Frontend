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
} from "lucide-react";

const strokeColors = [
  "#ffffff", // white
  "#ef4444", // red
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // orange
  "#000000", // black
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
  } = useStore();

  // ✅ Local opacity state for text tool
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
   const hiddenTools = ["pan", "lock", "select", "eraser"];
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
          className="fixed right-6 top-3/2 -translate-y-1/2 w-[240px] max-h-[90vh] overflow-auto 
                     bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#E5E5E5] 
                     rounded-xl p-4 font-inter text-[13px] text-gray-800 z-50"
        >
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke</h3>
                <div className="flex items-center gap-3">
                  {strokeColors.map((color) => (
                    <div
                      key={color}
                      onClick={() => setFreehandColor(color)}
                      className={`w-6 h-6 rounded-md border cursor-pointer 
                        ${color === "#ffffff" ? "border-gray-300" : "border-transparent"} 
                        hover:ring-2 hover:ring-indigo-400 
                        ${freehandColor === color ? "ring-2 ring-indigo-500" : ""}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke Width</h3>
                <div className="flex items-center gap-3">
                  {[1, 3, 5, 8].map((w) => (
                    <button
                      key={w}
                      onClick={() => setFreehandStrokeWidth(w)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        ${
                          freehandStrokeWidth === w
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <div
                        className="bg-gray-700 rounded-full"
                        style={{ width: "18px", height: `${w}px` }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Opacity</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={freehandOpacity * 100}
                    onChange={(e) => setFreehandOpacity(e.target.value / 100)}
                    className="flex-1 accent-indigo-400 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 w-6">
                    {Math.round(freehandOpacity * 100)}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

        


          {/* ========== STICKY NOTE TOOL ========== */}
{selectedTool === "sticky" && (
  <motion.div
    initial={{ x: 80, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 80, opacity: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col gap-5"
  >
    {/* Sticky Note Color */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Color</h3>
      <div className="flex items-center gap-3">
        {["#fae316", "#054098", "#b62005", "#069714", "#ffd180", "#cb0bec"].map(
          (color) => {
            const currentColor = useStore.getState().selectedShape?.fill || "#fae316";
            return (
              <div
                key={color}
                onClick={() => {
                  const selectedShape = useStore.getState().selectedShape;
                  if (selectedShape) {
                    // Update existing sticky
                    useStore.getState().updateShape(selectedShape.id, { fill: color });
                    useStore.getState().setSelectedShape({ ...selectedShape, fill: color });
                  } else {
                    // Set default color for new stickies
                    useStore.getState().setStickyColor(color);
                  }
                }}
                className={`w-6 h-6 rounded-md border cursor-pointer 
                  border-transparent
                  hover:ring-2 hover:ring-indigo-400 
                  ${currentColor === color ? "ring-2 ring-indigo-500" : ""}`}
                style={{ backgroundColor: color }}
              />
            );
          }
        )}
      </div>
    </div>

    {/* Sticky Note Size */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Size</h3>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            const selectedShape = useStore.getState().selectedShape;
            if (selectedShape) {
              useStore.getState().updateShape(selectedShape.id, {
                width: selectedShape.width + 20,
                height: selectedShape.height + 20,
              });
            }
          }}
          className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center"
        >
          +
        </button>
        <button
          onClick={() => {
            const selectedShape = useStore.getState().selectedShape;
            if (selectedShape) {
              useStore.getState().updateShape(selectedShape.id, {
                width: Math.max(50, selectedShape.width - 20),
                height: Math.max(50, selectedShape.height - 20),
              });
            }
          }}
          className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center"
        >
          -
        </button>
      </div>
    </div>

    {/* Sticky Note Opacity */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Opacity</h3>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={(useStore.getState().selectedShape?.opacity || 1) * 100}
          onChange={(e) => {
            const selectedShape = useStore.getState().selectedShape;
            if (selectedShape) {
              useStore.getState().updateShape(selectedShape.id, {
                opacity: e.target.value / 100,
              });
            }
          }}
          className="flex-1 accent-indigo-400 cursor-pointer"
        />
        <span className="text-xs text-gray-600 w-6">
          {Math.round((useStore.getState().selectedShape?.opacity || 1) * 100)}
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">Color</h3>
                <div className="flex gap-3">
                  {strokeColors.map((c) => (
                    <div
                      key={c}
                      className={`w-6 h-6 rounded-md cursor-pointer border 
                        ${textStyle.color === c ? "ring-2 ring-indigo-500" : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setTextStyle({ color: c })}
                    />
                  ))}
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Font Family
                </h3>
                <div className="relative">
                  <select
                    className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 pr-8 
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-gray-300 transition"
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">Font Size</h3>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={textStyle.fontSize}
                  onChange={(e) => setTextStyle({ fontSize: parseInt(e.target.value) })}
                  className="w-full accent-indigo-400"
                />
                <p className="text-xs text-gray-600 mt-1">{textStyle.fontSize}px</p>
              </div>

              {/* Alignment */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Align</h3>
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
                        ${
                          textStyle.textAlign === a.value
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      {a.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Opacity</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity}
                    onChange={(e) => handleOpacityChange(e.target.value)}
                    className="flex-1 accent-indigo-400 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 w-6">{opacity}</span>
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
              className="flex flex-col gap-5"
            >
             
 {/* Shape Type */}
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Shapes</h3>
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
                    
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setShapeType(s.id)}
                      className={`w-12 h-12 border rounded-lg flex items-center justify-center text-lg font-bold transition 
                        ${
                          shapeType === s.id
                            ? "bg-indigo-100 text-indigo-600 border-indigo-400"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Stroke Color */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke Color</h3>
                <div className="flex items-center gap-3">
                  {strokeColors.map((c) => (
                    <div
                      key={c}
                      onClick={() => setShapeColor(c)}
                      className={`w-6 h-6 rounded-md border cursor-pointer 
                        ${c === "#ffffff" ? "border-gray-300" : "border-transparent"} 
                        hover:ring-2 hover:ring-indigo-400 
                        ${shapeColor === c ? "ring-2 ring-indigo-500" : ""}`}
                      style={{ backgroundColor: c }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Fill */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Fill</h3>
                <button
                  onClick={() =>
                    setShapeFill(
                      shapeFill === "transparent" ? shapeColor : "transparent"
                    )
                  }
                  className={`w-full py-2 rounded-lg font-medium transition 
                    ${
                      shapeFill !== "transparent"
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {shapeFill !== "transparent" ? "Filled" : "No Fill"}
                </button>
              </div>

              {/* Stroke Width */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke Width</h3>
                <div className="flex gap-3">
                  {[1, 3, 5, 8].map((w) => (
                    <button
                      key={w}
                      onClick={() => setShapeStrokeWidth(w)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center 
                        ${
                          shapeStrokeWidth === w
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      <div
                        className="bg-gray-700 rounded-full"
                        style={{ width: "18px", height: `${w}px` }}
                      ></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Opacity */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Opacity</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={shapeOpacity * 100}
                    onChange={(e) => setShapeOpacity(e.target.value / 100)}
                    className="flex-1 accent-indigo-400 cursor-pointer"
                  />
                  <span className="text-xs text-gray-600 w-6">
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
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Upload Image
                </h3>
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 cursor-pointer hover:border-indigo-400 transition">
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
                  <ImageIcon size={22} className="text-indigo-400 mb-1" />
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
  const updateShape = useStore((s) => s.updateShape);

  if (!selectedShape || selectedShape.type !== "image") {
    return (
      <p className="text-xs text-gray-400 italic text-center">
        Select an image to edit
      </p>
    );
  }

  return (
    <>
      {/* Opacity */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Opacity</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="100"
            value={(selectedShape.opacity ?? 1) * 100}
            onChange={(e) =>
              updateShape(selectedShape.id, {
                opacity: e.target.value / 100,
              })
            }
            className="flex-1 accent-indigo-400 cursor-pointer"
          />
          <span className="text-xs text-gray-600 w-6">
            {Math.round((selectedShape.opacity ?? 1) * 100)}
          </span>
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Size</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="50"
            max="600"
            step="5"
            value={selectedShape.width || 200}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              updateShape(selectedShape.id, {
                width: newSize,
                height: newSize,
              });
            }}
            className="flex-1 accent-indigo-400 cursor-pointer"
          />
          <span className="text-xs text-gray-600 w-12 text-right">
            {selectedShape.width}px
          </span>
        </div>
      </div>

      {/* Rotation */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">Rotation</h3>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="360"
            value={selectedShape.rotation || 0}
            onChange={(e) =>
              updateShape(selectedShape.id, {
                rotation: parseInt(e.target.value),
              })
            }
            className="flex-1 accent-indigo-400 cursor-pointer"
          />
          <span className="text-xs text-gray-600 w-10 text-right">
            {selectedShape.rotation || 0}°
          </span>
        </div>
      </div>
    </>
  );
};
