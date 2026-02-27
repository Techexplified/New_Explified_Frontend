import { useEffect, useRef, useState } from "react";
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
import UpgradePopup from "./UpgradePopup";

const QUICK_ACTIONS = [
  { id: "diagram", icon: RiFlowChart, label: "Generate Diagram", color: "#23b5b5" },
  { id: "translate", icon: TbLanguage, label: "Translate", color: "#8b5cf6" },
  { id: "explain", icon: HiOutlineLightBulb, label: "Explain Simply", color: "#f59e0b" },
  { id: "summarize", icon: TbSparkles, label: "Summarize", color: "#ec4899" },
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
    const prefixes = {
      diagram: "Create a flowchart/diagram explaining: ",
      translate: "Translate the following to [language]: ",
      explain: "Explain in simple terms: ",
      summarize: "Provide a concise summary of: ",
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
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: showHero ? "center" : "flex-end",
        top: showHero ? 0 : "auto",
        padding: "20px 16px",
        pointerEvents: "none",
      }}
    >
      <div style={{ pointerEvents: "auto", width: "100%", maxWidth: "720px" }}>
        {showHero && (
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                marginBottom: "12px",
                background: "linear-gradient(135deg, #e0e0e0 0%, #23b5b5 60%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Expli
            </h1>
            <p style={{
              color: "#6b7280",
              fontSize: "15px",
              fontWeight: 300,
              margin: 0,
            }}>
              Transform complex information into clear explanations
            </p>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "8px",
              marginTop: "24px",
            }}>
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 16px",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "rgba(255,255,255,0.03)",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      color: "#9ca3af",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${action.color}12`;
                      e.currentTarget.style.borderColor = `${action.color}35`;
                      e.currentTarget.style.color = "#d1d5db";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                      e.currentTarget.style.color = "#9ca3af";
                    }}
                  >
                    <Icon size={14} style={{ color: action.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {selectedFile && (
          <div
            style={{
              marginBottom: "8px",
              padding: "10px 14px",
              borderRadius: "12px",
              background: "rgba(35, 181, 181, 0.06)",
              border: "1px solid rgba(35, 181, 181, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(35, 181, 181, 0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <FiPaperclip style={{ color: "#23b5b5" }} size={14} />
              </div>
              <span style={{ color: "#d1d5db", maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {selectedFile.name}
              </span>
              <span style={{ color: "#6b7280", fontSize: "12px" }}>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              onClick={handleRemoveFile}
              style={{ padding: "4px", color: "#6b7280", cursor: "pointer" }}
              title="Remove file"
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        <div
          style={{
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(24, 24, 30, 0.95)",
            boxShadow: prompt.trim()
              ? "0 0 0 1px rgba(35,181,181,0.12), 0 12px 48px rgba(0,0,0,0.5)"
              : "0 8px 32px rgba(0,0,0,0.4)",
            transition: "box-shadow 0.3s ease, border-color 0.3s ease",
            overflow: "hidden",
            backdropFilter: "blur(20px)",
          }}
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
            style={{
              width: "100%",
              background: "transparent",
              color: "#f3f4f6",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "15px",
              lineHeight: "1.6",
              padding: "18px 20px 8px 20px",
              minHeight: "28px",
              maxHeight: "150px",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px 10px 10px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
              <div
                style={{ position: "relative" }}
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
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginLeft: "4px",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  background: "rgba(239, 68, 68, 0.08)",
                }}>
                  <div style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }} />
                  <span style={{ fontSize: "11px", color: "#f87171", fontWeight: 500 }}>Listening</span>
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {prompt.length > 0 && (
                <span style={{ fontSize: "11px", color: "#4b5563", fontVariantNumeric: "tabular-nums" }}>
                  {prompt.length}/2000
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  if (prompt.trim()) handleSubmit({ key: "Enter" });
                }}
                disabled={!prompt.trim() || isTyping}
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: prompt.trim() && !isTyping ? "pointer" : "default",
                  background: prompt.trim() && !isTyping
                    ? "linear-gradient(135deg, #23b5b5, #1a9494)"
                    : "rgba(255,255,255,0.04)",
                  color: prompt.trim() && !isTyping ? "#fff" : "rgba(255,255,255,0.15)",
                  transition: "all 0.25s ease",
                  boxShadow: prompt.trim() && !isTyping
                    ? "0 4px 16px rgba(35,181,181,0.25)"
                    : "none",
                  flexShrink: 0,
                }}
                title="Send message"
              >
                {isTyping ? (
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.15)",
                    borderTopColor: "rgba(255,255,255,0.5)",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
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
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          marginTop: "10px",
          fontSize: "11px",
          color: "#4b5563",
        }}>
          <span>Enter to send</span>
          <span style={{ opacity: 0.3 }}>·</span>
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
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "8px",
        border: "none",
        background: active ? "rgba(239, 68, 68, 0.1)" : "transparent",
        color: active ? "#f87171" : "#6b7280",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "rgba(255,255,255,0.05)";
          e.currentTarget.style.color = "#d1d5db";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#6b7280";
        }
      }}
    >
      {children}
    </button>
  );
}

export default ExpliInput;
