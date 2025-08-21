import React, { useState } from "react";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $isTextNode,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { useRef } from "react";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  Type,
  Pencil,
  Sparkle,
  ArrowUpRight,
  Link2,
  Download,
} from "lucide-react";
import SidebarOnHover2 from "../reusable_components/SidebarOnHover2";

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


// Share Button component
function ShareButton({ getTextContent }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [exportJpg, setExportJpg] = useState(false);

  // Generate shareable link (encoded content)
  const getShareLink = () => {
    const content = encodeURIComponent(getTextContent());
    return `${window.location.origin}${window.location.pathname}?content=${content}`;
  };

  // Handle copy link
  const handleCopy = () => {
    navigator.clipboard.writeText(getShareLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Handle download in chosen format (mock)
  const handleDownload = () => {
    let filename = "notes.txt";
    if (exportPdf) filename = "notes.pdf";
    else if (exportJpg) filename = "notes.jpg";

    const contentType = exportPdf
      ? "application/pdf"
      : exportJpg
      ? "image/jpeg"
      : "text/plain";

    const blob = new Blob([getTextContent()], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div style={{ position: "fixed", top: 80, right: 200, zIndex: 1000 }}>
      <div
        style={{
          borderRadius: 12,
          border: `2px solid #188184`,
          display: "inline-block",
          background: "#232323",
          overflow: "visible",
        }}
      >
        <button
          onClick={() => setShowMenu((v) => !v)}
          style={{
            height: 40,
            minWidth: 80,
            padding: "0 18px",
            fontWeight: 500,
            color: "white",
            background: "none",
            border: "none",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            outline: "none",
          }}
          title="Share notes"
        >
          Share
          <ArrowUpRight size={20} style={{ marginLeft: 8, color: "#aaa" }} />
        </button>
        {showMenu && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 46,
              minWidth: 250,
              background: "#232323",
              border: `2px solid #188184`,
              borderRadius: 15,
              color: "#eee",
              boxShadow: "0px 2px 12px 0 #000c",
              padding: "16px 18px 12px 18px",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                fontWeight: 500,
                fontSize: 18,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Share
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#181919",
                borderRadius: 8,
                padding: "4px 6px",
                marginBottom: 14,
              }}
            >
              <input
                type="text"
                readOnly
                value={getShareLink()}
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: "#eee",
                  padding: "6px 3px",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <button
                onClick={handleCopy}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#cecece",
                  padding: 0,
                  outline: "none",
                }}
                title="Copy link"
              >
                <Link2 size={20} />
              </button>
            </div>
            {copied && (
              <div
                style={{ color: "#22ee99", textAlign: "right", fontSize: 14, marginBottom: 4 }}
              >
                Copied!
              </div>
            )}

            <div style={{ fontSize: 14, marginBottom: 7 }}>
              Export as : &nbsp;
              <label style={{ marginRight: 10 }}>
                Pdf
                <input
                  type="checkbox"
                  checked={exportPdf}
                  onChange={() => {
                    setExportPdf(!exportPdf);
                    if (!exportPdf) setExportJpg(false);
                  }}
                  style={{ marginLeft: 4 }}
                />
              </label>
              <label>
                Jpg
                <input
                  type="checkbox"
                  checked={exportJpg}
                  onChange={() => {
                    setExportJpg(!exportJpg);
                    if (!exportJpg) setExportPdf(false);
                  }}
                  style={{ marginLeft: 4 }}
                />
              </label>
            </div>

            <button
              onClick={handleDownload}
              style={{
                width: "100%",
                background: "#232323",
                border: `2px solid #188184`,
                color: "#eee",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 16,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                marginTop: 8,
                cursor: "pointer",
              }}
            >
              Download <Download size={19} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
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
      className="flex items-center gap-2 px-4 py-2 bg-black/80 rounded-lg border border-gray-700 absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 shadow-xl"
      style={{ minWidth: 460 }}
    >
      <select
        value={fontFamily}
        onChange={onChangeFont}
        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
        title="Font family"
      >
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Monospace">Monospace</option>
        <option value="sans-serif">Sans Serif</option>
        <option value="serif">Serif</option>
      </select>
      <select
        value={fontSize}
        onChange={onChangeFontSize}
        className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
        title="Font size"
      >
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="20">20</option>
        <option value="24">24</option>
        <option value="28">28</option>
        <option value="32">32</option>
      </select>

      <input
        type="color"
        title="Font color"
        value={fontColor}
        onChange={onChangeFontColor}
        className="w-8 h-8 p-0 border-none rounded cursor-pointer"
        aria-label="Font color picker"
      />

      <button onClick={undo} className="p-2 hover:bg-gray-700 rounded" title="Undo">
        <Undo size={18} />
      </button>
      <button onClick={redo} className="p-2 hover:bg-gray-700 rounded" title="Redo">
        <Redo size={18} />
      </button>
      <button onClick={formatBold} className="p-2 hover:bg-gray-700 rounded" title="Bold">
        <Bold size={18} />
      </button>
      <button onClick={formatItalic} className="p-2 hover:bg-gray-700 rounded" title="Italic">
        <Italic size={18} />
      </button>
      <button onClick={formatUnderline} className="p-2 hover:bg-gray-700 rounded" title="Underline">
        <Underline size={18} />
      </button>
    </div>
  );
}
function PenTool() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // pen | eraser | highlighter
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    const ctx = ctxRef.current;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;

    if (tool === "pen") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.globalAlpha = 1.0;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "multiply";
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.3;
    } else if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.globalAlpha = 1.0;
    }

    ctx.lineWidth = thickness;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = ctxRef.current;
    ctx.closePath();
    setIsDrawing(false);
  };

  return (
    <div>
      {/* Controls */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: "10px",
          background: "rgba(255,255,255,0.9)",
          padding: "8px",
          borderRadius: "8px",
          display: "flex",
          gap: "8px",
          zIndex: 100,
        }}
      >
        <button onClick={() => setTool("pen")}>✏️ Pen</button>
        <button onClick={() => setTool("highlighter")}>🖍 Highlighter</button>
        <button onClick={() => setTool("eraser")}>🧽 Eraser</button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          disabled={tool === "eraser"}
        />
        <input
          type="range"
          min="1"
          max="30"
          value={thickness}
          onChange={(e) => setThickness(e.target.value)}
        />
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          cursor: tool === "eraser" ? "crosshair" : "pointer",
          zIndex: 50,
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

function ToolbarPlugin() {

  const [editor] = useLexicalComposerContext();
  const getTextContent = () => {
  let text = "";
  editor.getEditorState().read(() => {
    // Instead of toJSON traversal, use lexical root API:
    const root = editor._editor.getRoot(); // or $getRoot() inside .read if you have access
    if (root) {
      text = root.getTextContent();
    }
  });
  return text;
};

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
  const [showPenOptions, setShowPenOptions] = useState(false);

  return (
    <>
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
        className="flex justify-center items-center gap-2 px-1 py-1 bg-black/90 rounded-lg border border-gray-600 fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 shadow-xl"
        style={{ minWidth: 240 }}
      >
        <button
          onClick={() => setActiveBar(activeBar === "text" ? null : "text")}
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${
            activeBar === "text" ? "bg-gray-800" : ""
          }`}
          title="Text options"
        >
          <Type size={24} />
        </button>
         <button
        onClick={() => setShowPenOptions((prev) => !prev)}
        className={`flex flex-col items-center px-4 py-2 rounded transition-all ${
          showPenOptions ? "bg-gray-800" : ""
        }`}
        title="Style"
        style={{ opacity: 1, cursor: "pointer" }}
      >
        <Pencil size={24} />
      </button>

      {/* Pen Options Menu */}
      {showPenOptions && (
        <div className="absolute top-5 left-0 bg-gray-900 text-white rounded-lg shadow-lg p-3 flex flex-row gap-2 w-40">
          <button className="px-3 py-2 rounded hover:bg-gray-700">✏️ Pen</button>
          <button className="px-3 py-2 rounded hover:bg-gray-700">🖌️ Highlighter</button>
          <button className="px-3 py-2 rounded hover:bg-gray-700">🩸 Color Picker</button>
          <button className="px-3 py-2 rounded hover:bg-gray-700">📏 Thickness</button>
          <button className="px-3 py-2 rounded hover:bg-gray-700">🧽 Eraser</button>
        </div>
      )}
        <button
          onClick={() => setActiveBar(activeBar === "effect" ? null : "effect")}
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${
            activeBar === "effect" ? "bg-gray-800" : ""
          }`}
          title="Effects"
          disabled
          style={{ opacity: 0.3, cursor: "not-allowed" }}
        >
          <Sparkle size={24} />
        </button>
      </div>
    </>
  );
}


function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    editor.focus();
  }, [editor]);
  return null;
}

const initialConfig = {
  namespace: "MyEditor",
  theme,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, LinkNode],
  onError: (error) => {
    console.error("Lexical error:", error);
  },
};

function LexicalEditor() {
  const [editorState, setEditorState] = useState("");
  const [title, setTitle] = useState("Title");
  const onChange = (editorState) => {
    editorState.read(() => {
      setEditorState(JSON.stringify(editorState.toJSON(), null, 2));
    });
  };
  const h1Ref = useRef(null);

  // Sync initial state with DOM only once
  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.textContent = title;
    }
  }, []);

  const handleInput = (e) => {
    setTitle(e.currentTarget.textContent);
  };

  return (
    <div className="w-screen h-screen bg-black relative flex flex-col justify-center items-center overflow-hidden">
      <SidebarOnHover2 />
      <p className="fixed top-8 left-20 text-white font-medium">{title}</p>


      {/* Editable <h1> */}
      <h1
        ref={h1Ref}
        contentEditable
        suppressContentEditableWarning={true}
        spellCheck={false}
        onInput={handleInput} // update state but don’t overwrite DOM
        style={{
          position: "fixed",
          top: "80px",
          left: "310px",
          zIndex: 50,
          cursor: "text",
          fontSize: "1.5rem",
          fontWeight: "600",
          fontFamily: "sans-serif",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "8px 16px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          outline: "none",
          userSelect: "text",
        }}
        aria-label="Notes Title"
      />


      <div className="w-full max-w-2xl pt-16 relative z-10">
        
        <h2 className="ml-10 text-white text-2xl font-medium mb-8 pt-4">Let's Start</h2>
        <div className="bg-black border-none rounded-lg shadow-lg relative px-10">
          <LexicalComposer initialConfig={initialConfig}>
            <div className="relative">
              
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
  className="min-h-[350px] text-xl font-normal outline-none resize-none px-1"
  style={{ color: "white", caretColor: "white" }}
/>

                }
                placeholder={<div className="absolute top-6 left-4 text-gray-500 pointer-events-none text-lg" />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <OnChangePlugin onChange={onChange} />
            </div>

            <ToolbarPlugin />
          </LexicalComposer>
        </div>
      </div>
      <ShareButton getTextContent={() => {
  let text = "";
  return text;
}} />
    </div>
  );
}

export default LexicalEditor;
