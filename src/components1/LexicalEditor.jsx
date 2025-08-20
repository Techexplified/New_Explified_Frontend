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
import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  Type,
  Pencil,
  Sparkle,
} from "lucide-react";

// Theme configuration as before
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
import SidebarOnHover2 from "../reusable_components/SidebarOnHover2";
/**
 * Helper function to apply inline styles to selected text nodes.
 * Updates each affected text node with new style properties.
 */
function applyStyleToSelection(editor, styleObj) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const nodes = selection.getNodes();
      nodes.forEach((node) => {
        if ($isTextNode(node)) {
          const oldStyle = node.getStyle() || {};
          const newStyle = { ...oldStyle, ...styleObj };
          node.setStyle(newStyle);
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

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontSize, setFontSize] = useState("16");
  const [fontColor, setFontColor] = useState("#FFFFFF");
  const [activeBar, setActiveBar] = useState(null);

  const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  const formatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
  const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

  return (
    <>
      {activeBar === "text" && (
        <TextOptionsBar
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontColor={fontColor}
          setFontColor={setFontColor}
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
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${activeBar === "text" ? "bg-gray-800" : ""}`}
          title="Text options"
        >
          <Type size={24} />
        </button>
        <button
          onClick={() => setActiveBar(activeBar === "style" ? null : "style")}
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${activeBar === "style" ? "bg-gray-800" : ""}`}
          title="Style"
          disabled
          style={{ opacity: 0.3, cursor: "not-allowed" }}
        >
          <Pencil size={24} />
        </button>
        <button
          onClick={() => setActiveBar(activeBar === "effect" ? null : "effect")}
          className={`flex flex-col items-center px-4 py-2 rounded transition-all ${activeBar === "effect" ? "bg-gray-800" : ""}`}
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

/**
 * Background pattern with subtle small shapes behind editor
 */
function BackgroundPattern() {
  const svgPattern = encodeURIComponent(`
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="2" cy="2" r="2" fill="#333333" fill-opacity="0.25"/>
      <rect x="8" y="8" width="4" height="4" fill="#444444" fill-opacity="0.3" rx="1"/>
      <polygon points="16,0 20,4 16,8 12,4" fill="#555555" fill-opacity="0.2"/>
    </svg>
  `);

  const bgStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    backgroundImage: `url("data:image/svg+xml,${svgPattern}")`,
    backgroundRepeat: "repeat",
    backgroundSize: "40px 40px",
    zIndex: 0,
  };
  return <div style={bgStyle} />;
}

function LexicalEditor() {
  const [editorState, setEditorState] = useState("");

  const onChange = (editorState) => {
    editorState.read(() => {
      setEditorState(JSON.stringify(editorState.toJSON(), null, 2));
    });
  };

  return (
    <div className="w-screen h-screen bg-black relative flex flex-col justify-center items-center overflow-hidden">
      <BackgroundPattern />
      <SidebarOnHover2/>
      <div className="w-full max-w-2xl pt-16 relative z-10">
        <h2 className="ml-10 text-white text-2xl font-medium mb-8 pt-4">Let's Start</h2>
        <div className="bg-black border-none rounded-lg shadow-lg relative px-10">
          <LexicalComposer initialConfig={initialConfig}>
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className="min-h-[350px] text-white text-xl font-normal outline-none resize-none px-1"
                    style={{ caretColor: "white" }}
                  />
                }
                placeholder={<div className="absolute top-6 left-4 text-gray-500 pointer-events-none text-lg" />}
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <OnChangePlugin onChange={onChange} />
            </div>
            <div className="mt-300">
  <ToolbarPlugin />
</div>

          </LexicalComposer>
        </div>
      </div>
    </div>
  );
}

export default LexicalEditor;
