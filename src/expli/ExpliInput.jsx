import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiGlobe,
  FiPaperclip,
  FiSend,
  FiX,
  FiMic,
  FiImage,
  FiArrowUp,
} from "react-icons/fi";
import {
  TbLanguage,
  TbSparkles,
} from "react-icons/tb";
import { RiFlowChart } from "react-icons/ri";
import { HiOutlineLightBulb } from "react-icons/hi";
import { MdOutlineQuestionAnswer } from "react-icons/md";
import { BsListCheck } from "react-icons/bs";
import { Sparkles, Map } from "lucide-react";
import UpgradePopup from "./UpgradePopup";

const QUICK_ACTIONS = [
  { id: "diagram", icon: RiFlowChart, label: "Generate Diagram", color: "#3b82f6", navigate: "/expli/diagrams" },
  { id: "ask", icon: Sparkles, label: "Focus Mode", color: "#8b5cf6", navigate: "/expli/ask" },
  { id: "plan", icon: Map, label: "Build Plan", color: "#f59e0b", navigate: "/expli/plans" },
  { id: "flash", icon: BsListCheck, label: "Generate Flashcards", color: "#10b981", navigate: "/expli/flashcards" },
];

function ExpliInput({
  prompt,
  handleInputChange,
  handleSubmit,
  handlePaste,
  isTyping,
  handleMicClick,
  isRecording,
  onlyExpliOpen,
  chatNotPresent,
}) {
  const nav = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const [showGlobePopup, setShowGlobePopup] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleQuickAction = (action) => {
    if (action.disabled) return;
    if (action.navigate) {
      nav(action.navigate);
      return;
    }
    const prefixes = {
      translate: "Translate the following to [language]: ",
    };
    handleInputChange({ target: { value: prefixes[action.id] || "" } });
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!isTyping && inputRef.current) inputRef.current.focus();
  }, [isTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + "px";
    }
  }, [prompt]);

  const showHero = onlyExpliOpen && chatNotPresent;

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center px-4 py-5 pointer-events-none ${showHero ? "justify-center top-0" : "justify-end top-auto"}`}
    >
      <div className="pointer-events-auto w-full max-w-[720px]">
        {showHero && (
          <div className="text-center mb-10">
            <h1
              className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight leading-[1.1] mb-3 text-transparent bg-clip-text bg-[linear-gradient(135deg,#e0e0e0_0%,#23b5b5_60%,#8b5cf6_100%)]"
            >
              Expli
            </h1>
            <p className="text-gray-500 text-[15px] font-light m-0">
              Transform complex information into clear explanations
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 transition-all duration-200 text-gray-400 ${action.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:bg-white/10 hover:border-white/10 hover:text-gray-300"}`}
                    style={!action.disabled ? { '--hover-bg': `${action.color}12`, '--hover-border': `${action.color}35` } : {}}
                    onMouseEnter={(e) => {
                      if (action.disabled) return;
                      e.currentTarget.style.background = e.currentTarget.style.getPropertyValue('--hover-bg');
                      e.currentTarget.style.borderColor = e.currentTarget.style.getPropertyValue('--hover-border');
                      e.currentTarget.style.color = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                      if (action.disabled) return;
                      e.currentTarget.style.background = "";
                      e.currentTarget.style.borderColor = "";
                      e.currentTarget.style.color = "";
                    }}
                    title={action.disabled ? "Coming in V4" : action.label}
                  >
                    <Icon size={14} style={{ color: action.color }} className="shrink-0" />
                    <span className="text-[13px] whitespace-nowrap">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedFile && (
          <div className="flex items-center justify-between mb-2 px-3.5 py-2.5 rounded-xl bg-[#23b5b5]/5 border border-[#23b5b5]/10 text-[13px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#23b5b5]/10 flex items-center justify-center">
                <FiPaperclip className="text-[#23b5b5]" size={14} />
              </div>
              <span className="text-gray-300 max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedFile.name}
              </span>
              <span className="text-gray-500 text-xs">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 text-gray-500 cursor-pointer hover:text-gray-300 transition-colors"
              title="Remove file"
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        <div
          className={`rounded-[20px] border transition-all duration-300 overflow-hidden backdrop-blur-xl bg-[#18181e]/95 ${prompt.trim()
            ? "border-[#23b5b5]/10 shadow-[0_0_0_1px_rgba(35,181,181,0.12),0_12px_48px_rgba(0,0,0,0.5)]"
            : "border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            }`}
        >
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onPaste={handlePaste}
            placeholder="Ask anything..."
            disabled={isTyping}
            rows={1}
            className="w-full bg-transparent text-gray-100 border-none outline-none resize-none text-[15px] leading-relaxed px-5 pt-[18px] pb-2 min-h-[28px] max-h-[150px] font-inherit box-border placeholder:text-gray-500"
          />

          <div className="flex items-center justify-between px-2.5 pb-2.5 pt-1.5">
            <div className="flex items-center gap-0.5">
              <div
                className="relative"
                onMouseEnter={() => setShowGlobePopup(true)}
                onMouseLeave={() => setShowGlobePopup(false)}
              >
                <IconBtn title="Research">
                  <FiGlobe size={17} />
                </IconBtn>
                {showGlobePopup && <UpgradePopup />}
              </div>

              <IconBtn title="Attach file" onClick={() => fileInputRef.current?.click()}>
                <FiPaperclip size={17} />
              </IconBtn>

              <IconBtn title="Add image">
                <FiImage size={17} />
              </IconBtn>

              <IconBtn
                title={isRecording ? "Stop recording" : "Voice input"}
                onClick={handleMicClick}
                active={isRecording}
              >
                <FiMic size={17} />
              </IconBtn>

              {isRecording && (
                <div className="flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-full bg-red-500/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
                  <span className="text-[11px] text-red-400 font-medium">Listening</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {prompt.length > 0 && (
                <span className="text-[11px] text-gray-600 tabular-nums">
                  {prompt.length}/2000
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (prompt.trim()) handleSubmit({ key: "Enter" });
                }}
                disabled={!prompt.trim() || isTyping}
                className={`w-[34px] h-[34px] rounded-[10px] border-none flex items-center justify-center shrink-0 transition-all duration-250 ${prompt.trim() && !isTyping
                  ? "cursor-pointer bg-[linear-gradient(135deg,#23b5b5,#1a9494)] text-white shadow-[0_4px_16px_rgba(35,181,181,0.25)]"
                  : "cursor-default bg-white/5 text-white/15 shadow-none"
                  }`}
                title="Send message"
              >
                {isTyping ? (
                  <div className="w-4 h-4 border-2 border-white/15 border-t-white/50 rounded-full animate-spin" />
                ) : (
                  <FiArrowUp size={17} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex items-center justify-center gap-3 mt-2.5 text-[11px] text-gray-600">
          <span>Enter to send</span>
          <span className="opacity-30">·</span>
          <span>Shift+Enter for new line</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

function IconBtn({ children, onClick, title, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-[34px] h-[34px] rounded-lg border-none flex items-center justify-center cursor-pointer transition-all duration-150 shrink-0 ${active
          ? "bg-red-500/10 text-red-400"
          : "bg-transparent text-gray-500 hover:bg-white/5 hover:text-gray-300"
        }`}
    >
      {children}
    </button>
  );
}

export default ExpliInput;
