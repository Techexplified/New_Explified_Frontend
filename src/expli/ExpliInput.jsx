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
    <div className="w-full z-10">
      <div className="rounded-2xl max-w-2xl mx-auto border-2 border-cyan-500/20 bg-gradient-to-r from-gray-900/90 to-gray-800/80 backdrop-blur-lg shadow-2xl">
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Input Field */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={prompt}
                onChange={handleInputChange}
                onKeyDown={handleSubmit}
                onPaste={handlePaste}
                placeholder="Type your message here..."
                className="w-full bg-black/50 border border-gray-700/50 rounded-xl px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                disabled={isTyping}
                maxLength={2000}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                {prompt.length}/2000
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Voice Input */}
              <button
                type="button"
                onClick={!isTyping ? handleMicClick : undefined}
                className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 group ${
                  isRecording
                    ? "border-red-500/40 bg-red-500/10"
                    : "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:from-cyan-500/30 hover:to-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/20"
                }`}
                style={{ cursor: isTyping ? "not-allowed" : "pointer" }}
                title="Voice input"
                disabled={isTyping}
              >
                <FiMic
                  className={`text-lg ${
                    isRecording ? "text-white" : "text-minimal-primary"
                  }`}
                />
              </button>

              {/* File Upload */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()} // ✅ trigger file input
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 flex items-center justify-center hover:from-cyan-500/30 hover:to-cyan-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group"
                title="Attach file"
              >
                <FiPaperclip className="text-lg text-minimal-primary" />
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
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10  border border-cyan-500/30 flex items-center justify-center hover:from-cyan-500/30 hover:to-cyan-600/20 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group"
                title="Send"
              >
                <FiSend className="text-lg text-minimal-primary" />
              </button>
            </div>
          </div>

          {/* ✅ Show selected file preview */}
          {selectedFile && (
            <div className="mt-2 text-xs text-gray-400">
              Selected file:{" "}
              <span className="text-white">{selectedFile.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpliInput;
