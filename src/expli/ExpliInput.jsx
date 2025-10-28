import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FiMic, FiPaperclip, FiSend } from "react-icons/fi";

function ExpliInput({
  prompt,
  handleInputChange,
  handleSubmit,
  handlePaste,
  isTyping,
  handleMicClick,
  isRecording,
  isSidebarOpen,
  onlyExpliOpen,
  chatNotPresent,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (!isTyping && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTyping]);

  return (
    <div
      className={`fixed ${
        onlyExpliOpen && chatNotPresent
          ? "top-1/2 -translate-y-1/2"
          : "bottom-5"
      } z-10 transition-all duration-500 ${
        isSidebarOpen ? "left-[2px] right-0" : "left-0 right-0"
      }`}
    >
      <div className="relative rounded-xl max-w-3xl mx-auto bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 shadow-lg">
        <div className="p-4 sm:p-4">
          {/* Main Input Container */}
          <div className="flex items-center gap-3">
            {/* Plus Button */}
            {/* <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all duration-300"
              title="Attach file"
            >
              <Plus size={20} />
            </button> */}

            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                ref={inputRef}
                value={prompt}
                onChange={handleInputChange}
                onKeyDown={handleSubmit}
                onPaste={handlePaste}
                placeholder="Ask me anything..."
                className="w-full bg-transparent text-gray-100 placeholder-gray-500 border-none focus:outline-none text-base py-2"
                disabled={isTyping}
              />
            </div>

            {/* Right Action Buttons */}
            <div className="flex gap-2 items-center">
              {/* Voice Button */}
              {/* <button
                type="button"
                onClick={!isTyping ? handleMicClick : undefined}
                className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isRecording
                    ? "bg-red-500/20 border border-red-500/50 text-red-400"
                    : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-gray-400 hover:text-gray-300"
                }`}
                style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
                title="Voice input"
                disabled={isTyping}
              >
                <FiMic size={18} />
              </button> */}

              {/* Decorative Separator */}
              <div className="w-px h-5 bg-gray-700/30"></div>

              {/* Settings/Sparkle Button */}
              {/* <button
                type="button"
                className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 flex items-center justify-center text-gray-400 hover:text-gray-300 transition-all duration-300"
                title="Settings"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <path d="M12 1v6m0 6v6"></path>
                  <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24"></path>
                  <path d="M1 12h6m6 0h6"></path>
                  <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
                </svg>
              </button> */}

              {/* Send Button */}
              <button
                type="button"
                onClick={() => {
                  if (prompt.trim()) {
                    handleSubmit({ key: "Enter" });
                  }
                }}
                className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#23b5b5] hover:bg-[#23b5b5] flex items-center justify-center text-white transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105"
                title="Send"
                disabled={!prompt.trim()}
              >
                <FiSend size={18} />
              </button>
            </div>
          </div>

          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Selected File Preview */}
          {selectedFile && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-xs text-gray-500">Selected:</span>
              <span className="text-xs text-gray-300 font-medium truncate">
                {selectedFile.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpliInput;
