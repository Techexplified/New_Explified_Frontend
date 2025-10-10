import React from "react";
import { useStore } from "../store";
import { motion } from "framer-motion";

export default function TextPanel() {
  const textStyle = useStore((s) => s.textStyle);
  const setTextStyle = useStore((s) => s.setTextStyle);

  const updateStyle = (key, value) => {
    setTextStyle({ ...textStyle, [key]: value });
  };

  const fonts = [
    "Arial",
    "Times New Roman",
    "Verdana",
    "Georgia",
    "Courier New",
    "Poppins",
    "Roboto",
    "Montserrat",
    "Lato",
    "Playfair Display",
  ];

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="fixed top-0 right-0 h-full w-64 bg-[#1f1f1f] border-l border-gray-700 text-white p-4 flex flex-col z-[9999] overflow-y-auto"
    >
      <h2 className="text-lg font-semibold mb-4 text-center border-b border-gray-600 pb-2">
        Text Settings
      </h2>

      {/* Font Family */}
      <label className="text-sm mb-1">Font Family</label>
      <select
        value={textStyle.fontFamily || "Arial"}
        onChange={(e) => updateStyle("fontFamily", e.target.value)}
        className="bg-gray-700 rounded-md p-2 text-sm mb-3 outline-none w-full"
      >
        {fonts.map((font) => (
          <option
            key={font}
            value={font}
            style={{
              fontFamily: font,
            }}
          >
            {font}
          </option>
        ))}
      </select>

      {/* Font Size */}
      <label className="text-sm mb-1">Font Size</label>
      <input
        type="range"
        min="8"
        max="80"
        value={textStyle.fontSize || 16}
        onChange={(e) => updateStyle("fontSize", Number(e.target.value))}
        className="w-full accent-blue-500 mb-1"
      />
      <span className="text-xs text-gray-400 mb-3 text-right">
        {textStyle.fontSize || 16}px
      </span>

      {/* Font Color */}
      <label className="text-sm mb-1">Font Color</label>
      <input
        type="color"
        value={textStyle.color || "#ffffff"}
        onChange={(e) => updateStyle("color", e.target.value)}
        className="w-full h-8 mb-3 cursor-pointer bg-transparent border-none"
      />

      {/* Alignment */}
      <label className="text-sm mb-1">Text Align</label>
      <div className="flex justify-between mb-3">
        {["left", "center", "right"].map((align) => (
          <button
            key={align}
            onClick={() => updateStyle("textAlign", align)}
            className={`flex-1 py-2 mx-1 rounded-md text-sm ${
              textStyle.textAlign === align ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            {align[0].toUpperCase() + align.slice(1)}
          </button>
        ))}
      </div>

      {/* Font Styles */}
      <div className="flex justify-between mb-3">
        <button
          onClick={() => updateStyle("bold", !textStyle.bold)}
          className={`flex-1 py-2 mx-1 rounded-md font-bold ${
            textStyle.bold ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          B
        </button>
        <button
          onClick={() => updateStyle("italic", !textStyle.italic)}
          className={`flex-1 py-2 mx-1 rounded-md italic ${
            textStyle.italic ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          I
        </button>
        <button
          onClick={() => updateStyle("underline", !textStyle.underline)}
          className={`flex-1 py-2 mx-1 rounded-md underline ${
            textStyle.underline ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          U
        </button>
      </div>

      {/* Line Height */}
      <label className="text-sm mb-1">Line Height</label>
      <input
        type="range"
        min="0.8"
        max="2"
        step="0.1"
        value={textStyle.lineHeight || 1.2}
        onChange={(e) => updateStyle("lineHeight", Number(e.target.value))}
        className="w-full accent-blue-500 mb-1"
      />
      <span className="text-xs text-gray-400 mb-3 text-right">
        {textStyle.lineHeight || 1.2}
      </span>

      {/* Letter Spacing */}
      <label className="text-sm mb-1">Letter Spacing</label>
      <input
        type="range"
        min="-2"
        max="10"
        step="0.1"
        value={textStyle.letterSpacing || 0}
        onChange={(e) => updateStyle("letterSpacing", Number(e.target.value))}
        className="w-full accent-blue-500 mb-1"
      />
      <span className="text-xs text-gray-400 mb-3 text-right">
        {textStyle.letterSpacing || 0}px
      </span>
    </motion.div>
  );
}
