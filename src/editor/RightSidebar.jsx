import {useState} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Code,
  PenTool,
  ArrowDown,
  ArrowUp,
  ArrowUpFromLine,
  ArrowDownToLine,
} from "lucide-react";
 // ✅ Ensure this points to your Zustand or context store
const strokeColors = [
  "#ffffff", // white
  "#ef4444", // red
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // orange
  "#000000", // black
];

export default function RightSidebar() {
 // ✅ Zustand store values
  const { selectedTool, textStyle, setTextStyle, // ✅ Freehand states
    freehandColor,
    setFreehandColor,
    freehandStrokeWidth,
    setFreehandStrokeWidth,
    freehandOpacity,
    setFreehandOpacity,
  shapeColor, setShapeColor, shapeFill, setShapeFill ,shapeStrokeWidth,
  setShapeStrokeWidth, shapeOpacity,          
  setShapeOpacity, } = useStore();

  // ✅ Local opacity state (linked to textStyle.opacity)
  const [opacity, setOpacity] = useState(textStyle.opacity * 100);

  // ✅ Update opacity both locally and in store
  const handleOpacityChange = (value) => {
    setOpacity(value);
    setTextStyle({ opacity: value / 100 }); // store expects 0–1
  };


  return (
    <AnimatePresence>
      {selectedTool && (
    <motion.div
  initial={{ x: 50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 50, opacity: 0 }}
  transition={{ duration: 0.25 }}
  className="fixed right-6 top-3/2 -translate-y-1/2 w-[240px] max-h-[90vh] overflow-auto bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)] border border-[#E5E5E5] rounded-xl p-4 font-inter text-[13px] text-gray-800 z-50"
>



{(selectedTool === "freehand" || selectedTool === "pencil") && (
  <motion.div
    initial={{ x: 80, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 80, opacity: 0 }}
    transition={{ duration: 0.3, ease: "easeInOut" }}
    className="fixed right-6 top-3/2 -translate-y-1/2 w-[260px] bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col gap-5 z-50"
  >
    {/* === Stroke === */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke</h3>
      <div className="flex items-center gap-3">
        {strokeColors.map((color) => (
          <div
            key={color}
            onClick={() => setFreehandColor(color)}
            className={`w-6 h-6 rounded-md border ${
              color === "#ffffff" ? "border-gray-300" : "border-transparent"
            } cursor-pointer hover:ring-2 hover:ring-indigo-400 ${
              freehandColor === color ? "ring-2 ring-indigo-500" : ""
            }`}
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>

    {/* === Stroke Width === */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke Width</h3>
      <div className="flex items-center gap-3">
        {[1, 3, 5, 8].map((w) => (
          <button
            key={w}
            onClick={() => setFreehandStrokeWidth(w)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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

    {/* === Opacity === */}
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

    {/* === Layers (non-functional yet) === */}
    <div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">Layers</h3>
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
          <ArrowDownToLine size={18} />
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
          <ArrowDown size={18} />
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
          <ArrowUp size={18} />
        </button>
        <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200">
          <ArrowUpFromLine size={18} />
        </button>
      </div>
    </div>
  </motion.div>
)}



         {selectedTool === "text" && (
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 80, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed right-6 top-3/2 -translate-y-1/2 w-[260px] bg-white border border-gray-200 rounded-2xl shadow-md p-5 flex flex-col gap-5 z-50"
        >
          {/* === Font Color === */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Color</h3>
            <div className="flex gap-3">
              {strokeColors.map((c) => (
                <div
                  key={c}
                  className={`w-6 h-6 rounded-md cursor-pointer border ${
                    textStyle.color === c ? "ring-2 ring-indigo-500" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setTextStyle({ color: c })}
                />
              ))}
            </div>
          </div>

          {/* === Font Family === */}
         <div className="space-y-1">
  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
    Font Family
  </h3>
  <div className="relative">
    <select
      className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 pr-8 
                 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                 hover:border-gray-300 transition-all duration-200"
      value={textStyle.fontFamily}
      onChange={(e) => setTextStyle({ fontFamily: e.target.value })}
    >
      <option className="font-sans">Arial</option>
      <option className="font-serif">Times New Roman</option>
      <option className="font-mono">Courier New</option>
      <option className="font-mono">Monospace</option>
      <option className="font-sans">Verdana</option>
    </select>

    {/* Dropdown icon */}
    <svg
      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>


          {/* === Font Size === */}
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Font Size</h3>
            <input
              type="range"
              min="10"
              max="80"
              value={textStyle.fontSize}
              onChange={(e) =>
                setTextStyle({ fontSize: parseInt(e.target.value) })
              }
              className="w-full accent-indigo-400"
            />
            <p className="text-xs text-gray-600 mt-1">{textStyle.fontSize}px</p>
          </div>

          {/* === Text Alignment === */}
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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

          {/* === Opacity === */}
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

        {/* === SHAPES SIDEBAR === */}
          {["rect", "square", "circle", "ellipse", "line", "polygon", "triangle"].includes(selectedTool) && (
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-5"
            >
              {/* === Stroke Color === */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke Color</h3>
                <div className="flex items-center gap-3">
                  {strokeColors.map((c) => (
                    <div
                      key={c}
                      onClick={() => setShapeColor(c)}
                      className={`w-6 h-6 rounded-md border cursor-pointer ${
                        c === "#ffffff" ? "border-gray-300" : "border-transparent"
                      } hover:ring-2 hover:ring-indigo-400 ${
                        shapeColor === c ? "ring-2 ring-indigo-500" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* === Fill Toggle === */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Fill</h3>
                <button
                  onClick={() =>
  setShapeFill(shapeFill === "transparent" ? shapeColor : "transparent")
}

                  className={`w-full py-2 rounded-lg font-medium transition ${
                    shapeFill
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {shapeFill ? "Filled" : "No Fill"}
                </button>
              </div>

              {/* === Stroke Width === */}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stroke Width</h3>
                <div className="flex gap-3">
                  {[1, 3, 5, 8].map((w) => (
                    <button
                      key={w}
                      onClick={() => setShapeStrokeWidth(w)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
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

              {/* === Opacity === */}
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

         
        </motion.div>
      )}
    </AnimatePresence>
  );
}
