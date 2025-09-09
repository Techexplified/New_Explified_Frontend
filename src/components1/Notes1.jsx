import React, { useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from "lexical";
import { Undo, Redo, Type, Pencil, Sparkle } from "lucide-react";

// Theme configuration
const theme = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
  },
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  list: {
    nested: {
      listitem: "ml-4",
    },
    ol: "list-decimal ml-6",
    ul: "list-disc ml-6",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic bg-gray-50 py-2",
  code: "bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto",
  link: "text-blue-600 underline hover:text-blue-800",
};

/**
 * Helper function to apply inline styles to selected text nodes.
 */
function applyStyleToSelection(editor, styleObj) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const nodes = selection.getNodes();
      nodes.forEach((node) => {
        if ($isTextNode(node)) {
          // Merge styles as a CSS string
          const existingStyle = node.getStyle() || "";
          const styleMap = Object.fromEntries(
            existingStyle
              .split(";")
              .filter(Boolean)
              .map((s) => s.split(":").map((x) => x.trim()))
          );

          const newStyleMap = { ...styleMap, ...styleObj };
          const newStyleString = Object.entries(newStyleMap)
            .map(([k, v]) => `${k}:${v}`)
            .join("; ");

          node.setStyle(newStyleString);
        }
      });
    }
  });
}

function TextOptionsBar({
  fontFamily,
  setFontFamily,
  fontSize,
  setFontSize,
  fontColor,
  setFontColor,
  formatBold,
  formatItalic,
  formatUnderline,
  undo,
  redo,
  editor,
}) {
  const onChangeFont = (e) => {
    const value = e.target.value;
    setFontFamily(value);
    applyStyleToSelection(editor, { "font-family": value });
  };
  const onChangeFontSize = (e) => {
    const value = e.target.value;
    setFontSize(value);
    applyStyleToSelection(editor, { "font-size": `${value}px` });
  };
  const onChangeFontColor = (e) => {
    const value = e.target.value;
    setFontColor(value);
    applyStyleToSelection(editor, { color: value });
  };

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 rounded-xl border absolute bottom-[-160px] left-1/2 transform -translate-x-1/2 z-50 shadow-2xl"
      style={{
        minWidth: 520,
        backgroundColor: "rgba(12, 46, 50, 0.9)",
        borderColor: "#20e3d7",
      }}
    >
      <div
        className="flex items-center gap-2 rounded-lg px-2 py-1"
        style={{
          backgroundColor: "rgba(4, 49, 56, 0.7)",
          border: "1px solid #20e3d7",
        }}
      >
        <select
          value={fontFamily}
          onChange={onChangeFont}
          className="bg-transparent border-none rounded px-2 py-1 focus:outline-none"
          title="Font family"
          style={{
            color: "#a5f1ea",
          }}
        >
          {[
            "Arial",
            "Georgia",
            "Times New Roman",
            "Courier New",
            "Monospace",
            "sans-serif",
            "serif",
          ].map((font) => (
            <option key={font} className="bg-[#043138]" value={font}>
              {font}
            </option>
          ))}
        </select>
        <div style={{ width: 1, height: 24, backgroundColor: "#20e3d7" }} />

        <select
          value={fontSize}
          onChange={onChangeFontSize}
          className="bg-transparent border-none rounded px-2 py-1 focus:outline-none"
          title="Font size"
          style={{
            color: "#a5f1ea",
          }}
        >
          {[12, 14, 16, 18, 20, 24, 28, 32].map((size) => (
            <option key={size} className="bg-[#043138]" value={size}>
              {size}
            </option>
          ))}
        </select>
        <div style={{ width: 1, height: 24, backgroundColor: "#20e3d7" }} />

        <input
          type="color"
          title="Font color"
          value={fontColor}
          onChange={onChangeFontColor}
          aria-label="Font color picker"
          className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
          style={{
            border: "1px solid #20e3d7",
            cursor: "pointer",
          }}
        />
      </div>

      <div style={{ width: 1, height: 32, backgroundColor: "#20e3d7" }} />

      <div
        className="flex items-center gap-1 rounded-lg p-1"
        style={{
          backgroundColor: "rgba(4, 49, 56, 0.7)",
          border: "1px solid #20e3d7",
        }}
      >
        <button
          onClick={undo}
          className="p-2 rounded-lg text-white"
          title="Undo"
          style={{ backgroundColor: "transparent", color: "#a5f1ea" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0ff9cc33")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          className="p-2 rounded-lg text-white"
          title="Redo"
          style={{ backgroundColor: "transparent", color: "#a5f1ea" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0ff9cc33")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Redo size={18} />
        </button>
      </div>

      <div style={{ width: 1, height: 32, backgroundColor: "#20e3d7" }} />

      <div
        className="flex items-center gap-1 rounded-lg p-1"
        style={{
          backgroundColor: "rgba(4, 49, 56, 0.7)",
          border: "1px solid #20e3d7",
        }}
      >
        <button
          onClick={formatBold}
          className="px-3 py-2 rounded-lg font-semibold text-white"
          title="Bold"
          style={{
            backgroundColor: "transparent",
            color: "#a5f1ea",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0ff9cc33")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          B
        </button>
        <button
          onClick={formatItalic}
          className="px-3 py-2 rounded-lg italic text-white"
          title="Italic"
          style={{
            backgroundColor: "transparent",
            color: "#a5f1ea",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0ff9cc33")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          I
        </button>
        <button
          onClick={formatUnderline}
          className="px-3 py-2 rounded-lg underline text-white"
          title="Underline"
          style={{
            backgroundColor: "transparent",
            color: "#a5f1ea",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0ff9cc33")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          U
        </button>
      </div>
    </div>
  );
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16");
  const [fontColor, setFontColor] = useState("#FFFFFF");
  const [activeBar, setActiveBar] = useState(null);

  // formatting commands for bold/italic/underline
  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  const formatItalic = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  const formatUnderline = () =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  // Apply inline styles for font-family, font-size, color
  const onFontFamilyChange = (value) => {
    setFontFamily(value);
    applyStyleToSelection(editor, { "font-family": value });
  };
  const onFontSizeChange = (value) => {
    setFontSize(value);
    applyStyleToSelection(editor, { "font-size": `${value}px` });
  };
  const onFontColorChange = (value) => {
    setFontColor(value);
    applyStyleToSelection(editor, { color: value });
  };

  // On button click:
  const handleToolbarClick = (type) => {
    setActiveBar((prev) => {
      return prev === type ? null : type;
    });
  };

  return (
    <>
      {/* Text Options Bar */}
      {activeBar === "text" && (
        <TextOptionsBar
          fontFamily={fontFamily}
          setFontFamily={onFontFamilyChange}
          fontSize={fontSize}
          setFontSize={onFontSizeChange}
          fontColor={fontColor}
          setFontColor={onFontColorChange}
          formatBold={formatBold}
          formatItalic={formatItalic}
          formatUnderline={formatUnderline}
          undo={undo}
          redo={redo}
          editor={editor}
        />
      )}

      <div
        className="flex justify-center items-center gap-4 px-4 py-2 rounded-2xl fixed"
        style={{
          minWidth: 160,
          backgroundColor: "rgba(12, 46, 50, 0.85)",
          border: "1px solid #20e3d7",
          bottom: "18px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 100,
        }}
      >
        {/* Text Options Button */}
        <button
          onClick={() => handleToolbarClick("text")}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-[1.16] hover:shadow-[0_0_4px_#0ff9cc55]"
          style={{
            fontSize: 18,
            backgroundColor: activeBar === "text" ? "#0ff9cc" : "transparent",
            color: activeBar === "text" ? "#003534" : "#a5f1ea",
            boxShadow: activeBar === "text" ? "0 0 8px #0ff9ccaa" : "none",
          }}
          title="Text options"
        >
          <Type size={22} />
        </button>

        {/* Pen Tool Button */}
        <button
          onClick={() => handleToolbarClick("pen")}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-[1.16] hover:shadow-[0_0_4px_#0ff9cc55]"
          style={{
            fontSize: 18,
            backgroundColor: activeBar === "pen" ? "#0ff9cc" : "transparent",
            color: activeBar === "pen" ? "#003534" : "#a5f1ea",
            boxShadow: activeBar === "pen" ? "0 0 8px #0ff9ccaa" : "none",
          }}
          title="Pen Tool"
        >
          <Pencil size={22} />
        </button>

        {/* Effects Button */}
        <button
          onClick={() => handleToolbarClick("effect")}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 hover:scale-[1.16] hover:shadow-[0_0_4px_#0ff9cc55]"
          style={{
            fontSize: 18,
            backgroundColor: activeBar === "effect" ? "#0ff9cc" : "transparent",
            color: activeBar === "effect" ? "#003534" : "#a5f1ea",
            boxShadow: activeBar === "effect" ? "0 0 4px #0ff9cc88" : "none",
          }}
        >
          <Sparkle size={22} />
        </button>
      </div>
    </>
  );
}

// Simple initial config
const initialConfig = {
  namespace: "SimpleNotesEditor",
  theme,
  onError: (error) => {
    console.error("Lexical error:", error);
  },
};

const Notes1 = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Simple Notes</h1>

      <div className="border border-gray-300 rounded-lg min-h-[400px] overflow-hidden">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[350px] p-4 text-gray-700 focus:outline-none"
                  placeholder="Start typing your notes here..."
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <ToolbarPlugin />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
};

export default Notes1;
