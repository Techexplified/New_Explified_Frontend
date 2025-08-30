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
import SimpleChatbot from "../reusable_components/SimpleChatbot";
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
function ShareButton({ getTextContent, noteTitle }) {
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [exportPdf, setExportPdf] = useState(false);
  const [exportJpg, setExportJpg] = useState(false);
  const [shareLink, setShareLink] = useState("");

  // Generate sharable link only once when menu opens
  const generateLink = () => {
    const content = getTextContent();
    saveNoteToTasks(content);
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
      console.log(localStorage.getItem("tasks"));
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
  function saveNoteToTasks(content) {
    // Assume first line = title, rest = text
    const lines = content.split("\n");
    const title = lines[0] || "Untitled";
    const text = lines.slice(1).join("\n") || lines[0];

    // Build task object
    const newTask = {
      id: Date.now(), // or uuidv4()
      title: noteTitle,
      content: text,
      lastModified: new Date().toISOString(),
      tag: "General",
      favorite: false,
    };

    // Load existing tasks
    let tasks = [];
    try {
      const stored = localStorage.getItem("tasks");
      if (stored) {
        tasks = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to parse tasks:", e);
    }

    // Push and save back
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

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
    <div className="relative display:flex">
      <div
        style={{
          display: "flex",
          gap: "12px",
          borderRadius: 12,
          border: `2px solid #20e3d7`,
          background: "#0c2e32",
          padding: 8,
          position: "fixed",
          top: 80,
          right: 200,
          zIndex: 1000,
          alignItems: "center",
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
            color: "#a5f1ea",
            background: "transparent",
            border: "2px solid #20e3d7",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#00fff7")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#a5f1ea")}
        >
          Share
          <ArrowUpRight size={20} style={{ marginLeft: 8, color: "#63e3db" }} />
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: 46,
              left: 0,
              minWidth: 250,
              background: "#0c2e32",
              border: `2px solid #20e3d7`,
              borderRadius: 15,
              color: "#e0f7f6",
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
                background: "#043138",
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
                  color: "#c5f9ee",
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
                  color: "#63e3db",
                  padding: 0,
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#00fff7")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#63e3db")}
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

            <div style={{ fontSize: 14, marginBottom: 7, color: "#a5f1ea" }}>
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
                border: `2px solid #20e3d7`,
                color: "#c5f9ee",
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
                backgroundColor: "transparent",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "rgba(15, 249, 204, 0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              Download <Download size={19} />
            </button>
          </div>
        )}
      </div>
      <SaveButton />
    </div>
  );
}

function SaveButton() {
  const [editor] = useLexicalComposerContext();
  const [isSaved, setIsSaved] = useState(false);

  const getTextContent = () => {
    let text = "";
    editor.getEditorState().read(() => {
      text = $getRoot().getTextContent();
    });
    return text;
  };

  const handleSave = () => {
    const content = getTextContent();
    localStorage.setItem("saved_note", content);
    setIsSaved(true);
  };

  useEffect(() => {
    setIsSaved(false);
  }, [getTextContent()]);

  return (
    <button
      onClick={handleSave}
      disabled={isSaved}
      style={{
        height: 40,
        minWidth: 80,
        padding: "0 18px",
        fontWeight: 500,
        color: isSaved ? "#22ee99" : "#a5f1ea",
        background: "transparent",
        border: `2px solid ${isSaved ? "#22ee99" : "#20e3d7"}`,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: isSaved ? "default" : "pointer",
        transition: "color 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) =>
        !isSaved && (e.currentTarget.style.color = "#00fff7")
      }
      onMouseLeave={(e) =>
        !isSaved && (e.currentTarget.style.color = "#a5f1ea")
      }
    >
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
function SharePlugin({ title }) {
  const [editor] = useLexicalComposerContext();
  const [isSaved, setIsSaved] = useState(false);

  const getTextContent = () => {
    let text = "";
    editor.getEditorState().read(() => {
      text = $getRoot().getTextContent();
    });
    return text;
  };

  const handleSave = () => {
    const content = getTextContent();
    localStorage.setItem("saved_note", content);
    setIsSaved(true);
  };

  useEffect(() => {
    setIsSaved(false);
  }, [getTextContent()]);

  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        borderRadius: 12,
        border: `2px solid #20e3d7`,
        background: "#0c2e32",
        padding: 8,
        position: "fixed",
        top: 80,
        right: 200,
        zIndex: 1000,
        alignItems: "center",
      }}
    >
      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaved}
        style={{
          height: 40,
          padding: "0 16px",
          fontWeight: 500,
          color: "#a5f1ea",
          background: "transparent",
          border: `2px solid #20e3d7`,
          borderRadius: 12,
          cursor: isSaved ? "default" : "pointer",
          transition: "all 0.3s",
        }}
      >
        {isSaved ? "Saved" : "Save"}
      </button>

      {/* Share Button */}
      <ShareButton getTextContent={getTextContent} noteTitle={title} />
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
      className="flex items-center gap-3 px-4 py-2 rounded-xl border absolute bottom-[-85px] left-1/2 transform -translate-x-1/2 z-50 shadow-2xl"
      style={{
        minWidth: 520,
        backgroundColor: "rgba(12, 46, 50, 0.9)", // dark teal translucent background
        borderColor: "#20e3d7", // bright cyan border
        // subtle cyan glow shadow
      }}
    >
      <div
        className="flex items-center gap-2 rounded-lg px-2 py-1"
        style={{
          backgroundColor: "rgba(4, 49, 56, 0.7)", // slightly lighter dark teal bg
          border: "1px solid #20e3d7", // bright cyan border
        }}
      >
        <select
          value={fontFamily}
          onChange={onChangeFont}
          className="bg-transparent border-none rounded px-2 py-1 focus:outline-none"
          title="Font family"
          style={{
            color: "#a5f1ea", // light cyan text
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
        className=""
        style={{
          position: "absolute",
          left: "130px",
          bottom: "-85px",
          background: "rgba(12, 46, 50, 0.95)", // deep dark teal bg
          padding: "10px 12px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          border: "1px solid #20e3d7", // bright cyan border
          // cyan glow shadow
          zIndex: 6000,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            background: "#043138", // darker teal for button group bg
            padding: "6px",
            borderRadius: 10,
          }}
        >
          {["pen", "highlighter", "eraser"].map((toolType) => {
            const iconMap = {
              pen: <Brush size={18} color="#a5f1ea" />,
              highlighter: <Highlighter size={18} color="#a5f1ea" />,
              eraser: <Eraser size={18} color="#a5f1ea" />,
            };
            const isActive = tool === toolType;
            return (
              <button
                key={toolType}
                onClick={() => setTool(toolType)}
                title={toolType[0].toUpperCase() + toolType.slice(1)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: isActive ? "#0ff9cc" : "transparent",
                  border: isActive
                    ? "1px solid #0cc8b0"
                    : "1px solid transparent",
                  color: "#e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "background-color 0.3s, border-color 0.3s",
                  cursor: "pointer",
                }}
              >
                {iconMap[toolType]}
              </button>
            );
          })}
        </div>

        <div style={{ width: 1, height: 28, background: "#20e3d7" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Droplet size={16} color="#20e3d7" />
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
              cursor: tool === "eraser" ? "not-allowed" : "pointer",
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
          <span style={{ color: "#20e3d7", fontSize: 12, width: 50 }}>
            Size {thickness}
          </span>
          <input
            type="range"
            min="1"
            max="30"
            value={thickness}
            onChange={(e) => setThickness(e.target.value)}
            title="Brush size"
            style={{
              cursor: "pointer",
              accentColor: "#0ff9cc",
            }}
          />
        </div>

        <div style={{ width: 1, height: 28, background: "#20e3d7" }} />

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={undo}
            title="Undo"
            style={{
              padding: 8,
              borderRadius: 8,
              color: "#a5f1ea",
              background: "#043138",
              border: "1px solid #0cc8b0",
              cursor: "pointer",
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
              color: "#a5f1ea",
              background: "#043138",
              border: "1px solid #0cc8b0",
              cursor: "pointer",
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
              background: "#2a1b1b",
              border: "1px solid #7f1d1d",
              cursor: "pointer",
            }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Canvas main */}
      <canvas
        className="absolute max-w-4xl bottom-[-10px] left-[-40px] h-[400px] w-[900px]"
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

function ToolbarPlugin({ openChatbot, closeChatbot }) {
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

  // On button click:
  const handleToolbarClick = (type) => {
    setActiveBar((prev) => {
      if (type === "effect") {
        if (prev === "effect") {
          if (closeChatbot) closeChatbot();
          return null;
        } else {
          if (openChatbot) openChatbot();
          return "effect";
        }
      } else {
        if (prev === "effect" && closeChatbot) closeChatbot();
        return prev === type ? null : type;
      }
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

      {/* Pen Tool Options */}
      {activeBar === "pen" && <PenTool />}

      <div
        className="flex justify-center items-center gap-1 px-2 py-1 rounded-2xl fixed "
        style={{
          minWidth: 120,
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
          className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-[1.16] hover:shadow-[0_0_4px_#0ff9cc55]"
          style={{
            fontSize: 16,
            backgroundColor: activeBar === "text" ? "#0ff9cc" : "transparent",
            color: activeBar === "text" ? "#003534" : "#a5f1ea",
            boxShadow: activeBar === "text" ? "0 0 4px #0ff9cc88" : "none",
          }}
          title="Text options"
        >
          <Type size={20} />
        </button>

        {/* Pen Tool Button */}
        <button
          onClick={() => handleToolbarClick("pen")}
          className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-[1.16] hover:shadow-[0_0_4px_#0ff9cc55]"
          style={{
            fontSize: 16,
            backgroundColor: activeBar === "pen" ? "#0ff9cc" : "transparent",
            color: activeBar === "pen" ? "#003534" : "#a5f1ea",
            boxShadow: activeBar === "pen" ? "0 0 4px #0ff9cc88" : "none",
          }}
          title="Pen Tool"
        >
          <Pencil size={20} />
        </button>

        {/* Effects Button */}
        <button
          onClick={() => handleToolbarClick("effect")}
          className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 hover:scale-[1.16] hover:shadow-[0_0_4px_#0ff9cc55]"
          style={{
            fontSize: 16,
            backgroundColor: activeBar === "effect" ? "#0ff9cc" : "transparent",
            color: activeBar === "effect" ? "#003534" : "#a5f1ea",
            boxShadow: activeBar === "effect" ? "0 0 4px #0ff9cc88" : "none",
          }}
          title="Effects"
        >
          <Sparkle size={20} />
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
  const [showChatbot, setShowChatbot] = useState(false);
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
    <div className="bg-black text-white flex flex-col min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 rounded-xl opacity-30 pointer-events-none bg-gradient-to-br from-transparent via-cyan-500 to-transparent"></div>
      {/* Main editor wrapper */}
      <div
        className="w-screen h-screen relative flex flex-col justify-center items-center overflow-hidden"
        style={{
          background: "rgba(6, 26, 36, 0.4)",
          boxShadow: "0 0 60px 0 rgba(15, 249, 204, 0.25)", // semi-transparent bright cyan glow
        }}
      >
        <SidebarOnHover2 />
        <div className="absolute gap-10 top-20 left-10 flex items-center">
          <a
            href="/tasks"
            className="font-medium transition-colors"
            style={{ color: "#22d2c6" }} // Teal cyan
            onMouseEnter={(e) => (e.currentTarget.style.color = "#16b0a6")} // Darker teal on hover
            onMouseLeave={(e) => (e.currentTarget.style.color = "#22d2c6")}
          >
            <ArrowLeft size={18} />
          </a>
          <p
            className="font-medium drop-shadow-md"
            style={{ color: "#15f1cf" }} // Light cyan
          >
            {title}
          </p>
        </div>

        <div
          className="h-[400px] w-[900px] border rounded-md pt-6 relative z-10 flex flex-col"
          style={{
            background: "rgba(6, 26, 36, 0.4)",
            border: "2px solid #20e3d7",
          }}
        >
          {/* Editable <h1> inside the box */}
          <h1
            className="editable-title mb-4 px-10"
            ref={h1Ref}
            contentEditable
            suppressContentEditableWarning={true}
            spellCheck={false}
            onInput={handleInput}
            style={{
              cursor: "text",
              fontSize: "1.5rem",
              fontWeight: 600,
              fontFamily: "sans-serif",
              color: "#0ff9cc",
              backgroundColor: "rgba(6, 26, 36, 0.4)", // 👈 same as box bg
              paddingTop: "8px",
              paddingBottom: "8px",
              borderRadius: "0px", // 👈 no rounded corners
              border: "none", // 👈 removed border
              outline: "none",
              userSelect: "text",
              width: "400px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            aria-label="Notes Title"
          />

          {ispenactive && (
            <div
              className="rounded-lg shadow-lg relative px-10"
              style={{ border: "none" }}
            >
              <LexicalComposer initialConfig={editorInitialConfig}>
                <div className="relative">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="h-[300px] text-xl font-normal outline-none resize-none px-1"
                        style={{ color: "#e4ffff" }}
                      />
                    }
                    placeholder={
                      <span className="absolute top-0 left-4 pointer-events-none text-lg font-poppins text-cyan-200">
                        <span className="smooth-typing">Let's Start</span>
                      </span>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <SaveToLocalStoragePlugin />
                  <HistoryPlugin />
                  <AutoFocusPlugin />
                  <OnChangePlugin onChange={onChange} />
                  <ToolbarPlugin
                    openChatbot={() => setShowChatbot(true)}
                    closeChatbot={() => setShowChatbot(false)}
                  />
                </div>
                <SharePlugin title={title} />
              </LexicalComposer>
            </div>
          )}
        </div>
      </div>

      {/* Only render PenTool if state is true */}
      <div>{showPenTool && <PenTool />}</div>
      <SimpleChatbot open={showChatbot} onClose={() => setShowChatbot(false)} />
    </div>
  );
}

export default LexicalEditor;
