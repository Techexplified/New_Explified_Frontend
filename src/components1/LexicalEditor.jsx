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
  ArrowLeft,
  Redo,
  Type,
  Pencil,
  Sparkle,
  ArrowUpRight,
  Link2,
  Download,
  Brush,
  Highlighter,
  Eraser,
  Droplet,
  Trash2,
} from "lucide-react";
import SidebarOnHover2 from "../reusable_components/SidebarOnHover2";
import { v4 as uuidv4 } from "uuid";
import { $getRoot } from "lexical";
import { $createParagraphNode, $createTextNode } from "lexical";

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
  const [shareLink, setShareLink] = useState("");

  // Generate sharable link only once when menu opens
  const generateLink = () => {
    const content = getTextContent();
    const id = uuidv4();

    // Try to capture current pen drawing (if any) by querying tagged canvas
    let penDataUrl = "";
    try {
      const canvases = document.querySelectorAll("[data-pen-canvas='true']");
      if (canvases && canvases.length > 0) {
        const targetCanvas = canvases[canvases.length - 1]; // prefer the last/most recent
        if (targetCanvas && typeof targetCanvas.toDataURL === "function") {
          penDataUrl = targetCanvas.toDataURL("image/png");
        }
      }
    } catch (err) {
      console.warn("Unable to capture pen canvas:", err);
    }

    // Build combined payload for cross-field sharing
    const payload = { text: content, penDataUrl };

    // Save note to localStorage (new combined key)
    try {
      localStorage.setItem(`shared_note_${id}`, JSON.stringify(payload));
    } catch (e) {
      console.warn(
        "Failed to save combined share payload, falling back to text-only."
      );
    }

    // Back-compat: also store text-only for existing consumers
    localStorage.setItem(`shared_content_${id}`, content);

    // Construct link
    const link = `${window.location.origin}${window.location.pathname}?shareId=${id}`;
    setShareLink(link);
  };

  // Check if shared link is opened
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("shareId");

    if (shareId) {
      // Prefer combined payload if available
      const combined = localStorage.getItem(`shared_note_${shareId}`);
      if (combined) {
        try {
          const parsed = JSON.parse(combined);
          if (parsed && parsed.penDataUrl) {
            // Render passive overlay canvas with the shared drawing
            const overlay = document.createElement("img");
            overlay.src = parsed.penDataUrl;
            overlay.alt = "shared-pen-overlay";
            overlay.style.position = "fixed";
            overlay.style.top = "150px";
            overlay.style.left = "290px";
            overlay.style.width = "50vw";
            overlay.style.height = "50vh";
            overlay.style.pointerEvents = "none";
            overlay.style.zIndex = "59"; // just below live pen canvas (60)
            document.body.appendChild(overlay);
          }
        } catch (e) {
          console.warn("Failed to parse shared payload:", e);
        }
      }
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    let filename = "notes.txt";
    let blob = new Blob([getTextContent()], { type: "text/plain" });

    if (exportPdf) {
      filename = "notes.pdf";
      // TODO: Use jsPDF to properly generate a PDF
    } else if (exportJpg) {
      filename = "notes.jpg";
      // TODO: Use html-to-image or dom-to-image to generate JPG
    }

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
        }}
      >
        <button
          onClick={() => {
            setShowMenu((v) => !v);
            if (!showMenu) generateLink();
          }}
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
          }}
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
                value={shareLink}
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
                }}
              >
                <Link2 size={20} />
              </button>
            </div>
            {copied && (
              <div
                style={{
                  color: "#22ee99",
                  textAlign: "right",
                  fontSize: 14,
                  marginBottom: 4,
                }}
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
function SharePlugin() {
  const [editor] = useLexicalComposerContext();

  const getTextContent = () => {
    let text = "";
    editor.getEditorState().read(() => {
      text = $getRoot().getTextContent();
    });
    return text;
  };

  return <ShareButton getTextContent={getTextContent} />;
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
      className="flex items-center gap-3 px-4 py-2 bg-black/90 rounded-xl border border-gray-700 absolute bottom-[-75px] left-1/2 transform -translate-x-1/2 z-50 shadow-2xl"
      style={{ minWidth: 520 }}
    >
      <div className="flex items-center gap-2 bg-gray-900/70 border border-gray-700 rounded-lg px-2 py-1">
        <select
          value={fontFamily}
          onChange={onChangeFont}
          className="bg-transparent text-white border-none rounded px-2 py-1 focus:outline-none"
          title="Font family"
        >
          <option className="bg-gray-900" value="Arial">
            Arial
          </option>
          <option className="bg-gray-900" value="Georgia">
            Georgia
          </option>
          <option className="bg-gray-900" value="Times New Roman">
            Times New Roman
          </option>
          <option className="bg-gray-900" value="Courier New">
            Courier New
          </option>
          <option className="bg-gray-900" value="Monospace">
            Monospace
          </option>
          <option className="bg-gray-900" value="sans-serif">
            Sans Serif
          </option>
          <option className="bg-gray-900" value="serif">
            Serif
          </option>
        </select>
        <div className="w-px h-6 bg-gray-700" />
        <select
          value={fontSize}
          onChange={onChangeFontSize}
          className="bg-transparent text-white border-none rounded px-2 py-1 focus:outline-none"
          title="Font size"
        >
          <option className="bg-gray-900" value="12">
            12
          </option>
          <option className="bg-gray-900" value="14">
            14
          </option>
          <option className="bg-gray-900" value="16">
            16
          </option>
          <option className="bg-gray-900" value="18">
            18
          </option>
          <option className="bg-gray-900" value="20">
            20
          </option>
          <option className="bg-gray-900" value="24">
            24
          </option>
          <option className="bg-gray-900" value="28">
            28
          </option>
          <option className="bg-gray-900" value="32">
            32
          </option>
        </select>
        <div className="w-px h-6 bg-gray-700" />
        <input
          type="color"
          title="Font color"
          value={fontColor}
          onChange={onChangeFontColor}
          className="w-8 h-8 p-0 border-none rounded cursor-pointer bg-transparent"
          aria-label="Font color picker"
        />
      </div>

      <div className="w-px h-8 bg-gray-700" />

      <div className="flex items-center gap-1 bg-gray-900/70 border border-gray-700 rounded-lg p-1">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-800 rounded-lg text-white"
          title="Undo"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-800 rounded-lg text-white"
          title="Redo"
        >
          <Redo size={18} />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-700" />

      <div className="flex items-center gap-1 bg-gray-900/70 border border-gray-700 rounded-lg p-1">
        <button
          onClick={formatBold}
          className="px-3 py-2 hover:bg-gray-800 rounded-lg text-white font-semibold"
          title="Bold"
        >
          B
        </button>
        <button
          onClick={formatItalic}
          className="px-3 py-2 hover:bg-gray-800 rounded-lg text-white italic"
          title="Italic"
        >
          I
        </button>
        <button
          onClick={formatUnderline}
          className="px-3 py-2 hover:bg-gray-800 rounded-lg text-white underline"
          title="Underline"
        >
          U
        </button>
      </div>
    </div>
  );
}
function PenTool() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // pen | eraser | highlighter
  const [color, setColor] = useState("#ffffff");
  const [thickness, setThickness] = useState(3);

  const [history, setHistory] = useState([]); // undo/redo stack
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ✅ Match canvas resolution to CSS size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    const data = canvas.toDataURL();
    setHistory((prev) => [...prev, data]);
    setRedoStack([]); // clear redo when new draw happens
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const last = history[history.length - 1];

    setRedoStack((prev) => [...prev, canvas.toDataURL()]);
    setHistory((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio
      );
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const last = redoStack[redoStack.length - 1];

    setHistory((prev) => [...prev, last]);
    setRedoStack((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        canvas.width / window.devicePixelRatio,
        canvas.height / window.devicePixelRatio
      );
    };
  };

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
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    ctx.closePath();
    setIsDrawing(false);
    saveState(); // ✅ save snapshot after finishing stroke
  };

  // Cursor style per tool
  const cursorStyle =
    tool === "pen"
      ? "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><text y=%2215%22 font-size=%2216%22>✏️</text></svg>') 0 16, auto"
      : tool === "highlighter"
      ? "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><text y=%2215%22 font-size=%2216%22>🖍</text></svg>') 0 16, auto"
      : "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2224%22 height=%2224%22><text y=%2215%22 font-size=%2216%22>🧽</text></svg>') 0 16, auto";

  return (
    <div className="">
      {/* Controls */}
      <div
        className="absolute left-[130px] bottom-[-80px] w-fit"
        style={{
          background: "#0b0b0b",
          padding: "10px 12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid #2a2a2a",
          boxShadow: "0 6px 22px rgba(0,0,0,0.5)",
          zIndex: 6000,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "#121212",
            padding: "6px",
            borderRadius: 10,
          }}
        >
          <button
            onClick={() => setTool("pen")}
            title="Pen"
            style={{
              padding: 8,
              borderRadius: 8,
              background: tool === "pen" ? "#1f2937" : "transparent",
              border: `1px solid ${tool === "pen" ? "#374151" : "transparent"}`,
              color: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Brush size={18} />
          </button>
          <button
            onClick={() => setTool("highlighter")}
            title="Highlighter"
            style={{
              padding: 8,
              borderRadius: 8,
              background: tool === "highlighter" ? "#1f2937" : "transparent",
              border: `1px solid ${
                tool === "highlighter" ? "#374151" : "transparent"
              }`,
              color: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Highlighter size={18} />
          </button>
          <button
            onClick={() => setTool("eraser")}
            title="Eraser"
            style={{
              padding: 8,
              borderRadius: 8,
              background: tool === "eraser" ? "#1f2937" : "transparent",
              border: `1px solid ${
                tool === "eraser" ? "#374151" : "transparent"
              }`,
              color: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Eraser size={18} />
          </button>
        </div>

        <div style={{ width: 1, height: 28, background: "#2a2a2a" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Droplet size={16} color="#9ca3af" />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={tool === "eraser"}
            style={{
              width: 28,
              height: 28,
              border: "none",
              background: "transparent",
            }}
            title="Color"
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 160,
          }}
        >
          <span style={{ color: "#9ca3af", fontSize: 12, width: 50 }}>
            Size {thickness}
          </span>
          <input
            type="range"
            min="1"
            max="30"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            title="Brush size"
          />
        </div>

        <div style={{ width: 1, height: 28, background: "#2a2a2a" }} />

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={undo}
            title="Undo"
            style={{
              padding: 8,
              borderRadius: 8,
              color: "#e5e7eb",
              background: "#121212",
              border: "1px solid #2a2a2a",
            }}
          >
            ↩️
          </button>
          <button
            onClick={redo}
            title="Redo"
            style={{
              padding: 8,
              borderRadius: 8,
              color: "#e5e7eb",
              background: "#121212",
              border: "1px solid #2a2a2a",
            }}
          >
            ↪️
          </button>
          <button
            title="Clear canvas"
            onClick={() => {
              const canvas = canvasRef.current;
              const ctx = ctxRef.current;
              if (!canvas || !ctx) return;
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              setHistory([]);
              setRedoStack([]);
            }}
            style={{
              padding: 8,
              borderRadius: 8,
              color: "#fca5a5",
              background: "#121212",
              border: "1px solid #7f1d1d",
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Canvas main */}
      <canvas
        className=" absolute max-w-4xl bottom-[-10px] left-[-40px] h-[400px] w-[900px]"
        ref={canvasRef}
        style={{
          cursor: cursorStyle,
          zIndex: 60,
          background: "transparent",
        }}
        data-pen-canvas="true"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

function ToolbarPlugin({ onTogglePenTool }) {
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

      {/* Pen Tool Options */}
      {activeBar === "pen" && <PenTool />}

      <div
        className="flex justify-center items-center gap-2 px-1 py-1 bg-black/90 rounded-lg border border-gray-600 fixed bottom-16 left-1/2 transform -translate-x-1/2 z-50 shadow-xl"
        style={{ minWidth: 240 }}
      >
        {/* Text Options Button */}
        <button
          onClick={() => setActiveBar(activeBar === "text" ? null : "text")}
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${
            activeBar === "text" ? "bg-gray-800" : ""
          }`}
          title="Text options"
        >
          <Type size={24} />
        </button>

        {/* Pen Tool Button */}
        <button
          onClick={() => setActiveBar(activeBar === "pen" ? null : "pen")}
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${
            activeBar === "pen" ? "bg-gray-800" : ""
          }`}
          title="Pen Tool"
        >
          <Pencil size={24} />
        </button>

        {/* Effects Button (Disabled) */}
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

function SaveToLocalStoragePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // Correct: use $getRoot() inside read()
        const plainText = $getRoot().getTextContent();

        // Save to localStorage
        localStorage.setItem("editorContent", plainText);
      });
    });
  }, [editor]);

  return null;
}

function LexicalEditor() {
  const [editor, setEditorState] = useState("");
  const [title, setTitle] = useState("Title");
  const [ispenactive, setpenactive] = useState(true);

  // ✅ new state for PenTool visibility
  const [showPenTool, setShowPenTool] = useState(false);

  const onChange = (editorState) => {
    editorState.read(() => {
      setEditorState(JSON.stringify(editorState.toJSON(), null, 2));
    });
  };

  const h1Ref = useRef(null);

  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.textContent = title;
    }
  }, []);

  const handleInput = (e) => {
    setTitle(e.currentTarget.textContent);
  };
  const params = new URLSearchParams(window.location.search);
  const shareId = params.get("shareId");

  const initialText = React.useMemo(() => {
    if (shareId) {
      const combined = localStorage.getItem(`shared_note_${shareId}`);
      if (combined) {
        try {
          const parsed = JSON.parse(combined);
          if (parsed && typeof parsed.text === "string") {
            return parsed.text;
          }
        } catch {}
      }
      const textOnly = localStorage.getItem(`shared_content_${shareId}`);
      if (typeof textOnly === "string") {
        return textOnly;
      }
    }
    const saved = localStorage.getItem("editorContent");
    return typeof saved === "string" ? saved : "";
  }, [shareId]);

  const editorInitialConfig = React.useMemo(
    () => ({
      ...initialConfig,
      editorState: (editorInstance) => {
        editorInstance.update(() => {
          const root = $getRoot();
          root.clear();
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(initialText);
          paragraph.append(textNode);
          root.append(paragraph);
        });
      },
    }),
    [initialText]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get("shareId");

    if (shareId) {
      const storedContent = localStorage.getItem(`shared_content_${shareId}`);
      if (storedContent) {
        // Instead of auto-download, you can render this content in a viewer page
        console.log("Shared Note:", storedContent);
      }
    }
  }, []);

  return (
    <div className="flex">
      {/* Main editor wrapper */}
      <div className="w-screen h-screen bg-black relative flex flex-col justify-center items-center overflow-hidden">
        <SidebarOnHover2 />
        <div className="absolute gap-2 top-20 left-10 flex items-center">
          <a href="/tasks" className="    text-white font-medium">
            <ArrowLeft size={18} />
          </a>

          <p className=" text-white font-medium">{title}</p>
        </div>
        {/* Editable <h1> */}
        <h1
          className="editable-title"
          ref={h1Ref}
          contentEditable
          suppressContentEditableWarning={true}
          spellCheck={false}
          onInput={handleInput}
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

        <div className=" h-[400px] w-[900px]  border border-cyan-900 rounded-md  pt-10 relative z-10">
          {ispenactive && (
            <div className="bg-black border-none rounded-lg shadow-lg relative px-10">
              <LexicalComposer initialConfig={editorInitialConfig}>
                <div className="relative">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="min-h-[350px] text-xl font-normal outline-none resize-none px-1"
                        style={{ color: "white", caretColor: "white" }}
                      />
                    }
                    placeholder={
                      <h2 className="absolute top-0 left-4 text-white pointer-events-none text-lg">
                        {"Let's Start"}
                      </h2>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <SaveToLocalStoragePlugin />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <OnChangePlugin onChange={onChange} />

                  {/* ✅ Pass toggle down to ToolbarPlugin */}
                  <ToolbarPlugin
                    onTogglePenTool={() => setShowPenTool((prev) => !prev)}
                  />
                </div>
                <SharePlugin />
              </LexicalComposer>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Only render PenTool if state is true */}
      <div>{showPenTool && <PenTool />}</div>
    </div>
  );
}

export default LexicalEditor;
