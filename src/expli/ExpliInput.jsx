import { useRef, useState } from "react";
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
}) {
  const [selectedFile, setSelectedFile] = useState(null); // ✅ store selected file
  const fileInputRef = useRef(null); // ✅ ref for hidden file input

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file);
    }
  };

  return (
    <div
      className={`fixed bottom-5 z-10 transition-all duration-500 ${
        isSidebarOpen ? "left-[245px] right-0" : "left-0 right-0"
      }`}
    >
      <div className="relative rounded-3xl max-w-2xl mx-auto border border-cyan-400/40 bg-gradient-to-br from-gray-900/90 via-gray-950/80 to-black/90 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.25),0_0_100px_rgba(6,182,212,0.15)] hover:shadow-[0_0_70px_rgba(6,182,212,0.35)] transition-all duration-500 group">
        {/* Animated Top Border Glow */}
        <div className="absolute -top-[2px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-400/60 rounded-tl-3xl"></div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-400/60 rounded-br-3xl"></div>

        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={handleInputChange}
                onKeyDown={handleSubmit}
                onPaste={handlePaste}
                placeholder="Type your message..."
                className="w-full bg-black/70 border border-gray-700/50 rounded-xl sm:px-4 sm:py-3 px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/30 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all duration-300"
                disabled={isTyping}
                maxLength={2000}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-cyan-400/60 font-medium">
                {prompt.length}/2000
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Voice Input */}
              <button
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
              </button>

              {/* File Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center hover:border-cyan-400/60 hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] group"
                title="Attach file"
              >
                <FiPaperclip className="text-lg sm:text-xl text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

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
