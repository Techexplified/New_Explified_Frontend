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
  const [selectedFile, setSelectedFile] = useState(null); // ✅ store selected file
  const fileInputRef = useRef(null); // ✅ ref for hidden file input
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
      }  z-10 transition-all duration-500 ${
        isSidebarOpen ? "left-[245px] right-0" : "left-0 right-0"
      }`}
    >
      <div className="relative rounded-2xl max-w-2xl mx-auto border border-cyan-500/60 bg-[#002a2d] shadow-[0_0_25px_rgba(0,255,255,0.1)] hover:shadow-[0_0_35px_rgba(0,255,255,0.2)] transition-all duration-500">
        <div className="p-3 sm:p-2">
          <div className="flex items-center gap-3">
            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                ref={inputRef}
                value={prompt}
                onChange={handleInputChange}
                onKeyDown={handleSubmit}
                onPaste={handlePaste}
                placeholder="Type your message..."
                className="w-full bg-[#003436] text-gray-100 placeholder-gray-400 border border-cyan-500/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400/50 transition-all duration-300"
                disabled={isTyping}
                // maxLength={2000}
              />
              {/* <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-cyan-400/60 font-medium">
                {prompt.length}/2000
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Voice Input */}
              {/* <button
                type="button"
                onClick={!isTyping ? handleMicClick : undefined}
                className={`relative w-8 h-8 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border transition-all duration-300 group hover:scale-110 ${
                  isRecording
                    ? "border-red-500/60 bg-gradient-to-br from-red-500/30 to-red-600/20 shadow-[0_0_25px_rgba(239,68,68,0.5)] animate-pulse"
                    : "bg-gradient-to-br from-cyan-500/25 to-blue-600/20 border-cyan-400/40 hover:border-cyan-400/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                }`}
                style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
                title="Voice input"
                disabled={isTyping}
              >
                <FiMic
                  className={`text-lg sm:text-xl ${
                    isRecording ? "text-white" : "text-cyan-400"
                  } drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]`}
                />
                {!isRecording && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </button> */}

              {/* File Upload */}
              {/* <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center hover:border-cyan-400/60 hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] group"
                title="Attach file"
              >
                <FiPaperclip className="text-lg sm:text-xl text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button> */}

              {/* <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              /> */}

              {/* Send Button */}
              <button
                type="button"
                onClick={() => {
                  if (prompt.trim()) {
                    handleSubmit({ key: "Enter" });
                  }
                }}
                className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-600/25 border border-cyan-400/50 flex items-center justify-center hover:border-cyan-400/70 hover:scale-110 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] group disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send"
                disabled={!prompt.trim()}
              >
                <FiSend className="text-lg sm:text-xl text-cyan-300 drop-shadow-[0_0_10px_rgba(6,182,212,1)]" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Pulse effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-cyan-400/20 opacity-0 group-hover:animate-ping"></div>
              </button>
            </div>
          </div>

          {/* ✅ Show selected file preview */}
          {selectedFile && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.6)]"></div>
              <span className="text-xs text-gray-400">Selected:</span>
              <span className="text-xs text-cyan-300 font-medium">
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
