import React, { useState } from "react";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  $createTextNode,
} from "lexical";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
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
import { $patchStyleText } from "@lexical/selection";
import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";

// Theme configuration
const theme = {
  // Text formatting
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    code: "bg-gray-100 px-1 py-0.5 rounded text-sm font-mono",
  },
  // Headings
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  // Lists
  list: {
    nested: {
      listitem: "ml-4",
    },
    ol: "list-decimal ml-6",
    ul: "list-disc ml-6",
  },
  // Other elements
  quote: "border-l-4 border-gray-300 pl-4 italic bg-gray-50 py-2",
  code: "bg-gray-900 text-white p-4 rounded-lg font-mono text-sm overflow-x-auto",
  link: "text-blue-600 underline hover:text-blue-800",
};

// Toolbar component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState("16");

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const formatCode = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-gray-900">
      <select
        value={fontFamily}
        onChange={(e) => {
          const value = e.target.value;
          setFontFamily(value);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { "font-family": value });
            }
          });
        }}
        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 focus:outline-none"
        title="Font family"
      >
        <option value="Inter">Inter</option>
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
        onChange={(e) => {
          const value = e.target.value;
          setFontSize(value);
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $patchStyleText(selection, { "font-size": `${value}px` });
            }
          });
        }}
        className="bg-gray-800 text-white border border-gray-700 rounded px-2 py-1 focus:outline-none"
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

      <div className="w-px h-6 bg-gray-700 mx-1" />
      <button
        onClick={undo}
        className="p-2 hover:bg-gray-800 rounded transition-colors"
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={redo}
        className="p-2 hover:bg-gray-800 rounded transition-colors"
        title="Redo"
      >
        <Redo size={18} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1" />

      <button
        onClick={formatBold}
        className={`p-2 hover:bg-gray-800 rounded transition-colors ${
          isBold ? "bg-blue-100" : ""
        }`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={formatItalic}
        className={`p-2 hover:bg-gray-800 rounded transition-colors ${
          isItalic ? "bg-blue-100" : ""
        }`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={formatUnderline}
        className={`p-2 hover:bg-gray-800 rounded transition-colors ${
          isUnderline ? "bg-blue-100" : ""
        }`}
        title="Underline"
      >
        <Underline size={18} />
      </button>
    </div>
  );
}

// Auto-focus plugin
function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  React.useEffect(() => {
    editor.focus();
  }, [editor]);

  return null;
}

// Initial editor state
const initialConfig = {
  namespace: "MyEditor",
  theme,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, CodeNode, LinkNode],
  onError: (error) => {
    console.error("Lexical error:", error);
  },
};

// Main editor component
function LexicalEditor() {
  const [editorState, setEditorState] = useState("");
  const [showJson, setShowJson] = useState(false);

  const onChange = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      setEditorState(JSON.stringify(editorState.toJSON(), null, 2));
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-20">
      <div className="border rounded-lg overflow-hidden shadow-lg mb-6">
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[300px] p-4 outline-none resize-none text-white"
                  style={{ caretColor: "rgb(5, 5, 5)" }}
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                  Start typing your content here...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin onChange={onChange} />
          </div>
        </LexicalComposer>
      </div>

      {/* <div className="space-y-4">
        <button
          onClick={() => setShowJson(!showJson)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showJson ? "Hide" : "Show"} Editor State JSON
        </button>

        {showJson && (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {editorState || "Editor state will appear here..."}
            </pre>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default LexicalEditor;
