import { useEffect, useRef, useState } from "react";
import { FiGlobe, FiMic, FiPaperclip, FiSearch, FiSend } from "react-icons/fi";
import UpgradePopup from "./UpgradePopup";

function ExpliInput({
  prompt,
  handleInputChange,
  handleSubmit,
  handlePaste,
  isTyping,
  onlyExpliOpen,
  chatNotPresent,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const [showGlobePopup, setShowGlobePopup] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
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
          : "bottom-4"
      } left-0 right-0 z-30 transition-all duration-500 px-3 md:px-0`}
    >
      {onlyExpliOpen && chatNotPresent && (
        <div className="text-center mb-6 text-4xl md:text-5xl">Expli</div>
      )}

      <div className="max-w-3xl mx-auto py-2 bg-[#111] border border-gray-800 rounded-2xl shadow-lg">
        {/* Input Row */}
        <div className="w-full px-4 py-2 flex items-center gap-2 md:gap-3">
          <button className="text-gray-500 hover:text-gray-300 transition hidden md:block">
            <FiSearch size={18} />
          </button>

          <input
            type="text"
            ref={inputRef}
            value={prompt}
            onChange={handleInputChange}
            onKeyDown={handleSubmit}
            onPaste={handlePaste}
            placeholder="Ask anything."
            className="flex-1 bg-transparent text-gray-100 placeholder-gray-600 focus:outline-none text-base"
            disabled={isTyping}
          />
        </div>

        {/* Icons */}
        <div className="flex justify-end gap-3 mt-2 pr-4 md:pr-8 pb-2 text-sm md:text-base">
          <div
            className="relative flex items-center"
            onMouseEnter={() => setShowGlobePopup(true)}
            onMouseLeave={() => setShowGlobePopup(false)}
          >
            <button className="text-gray-500 hover:text-gray-300 transition">
              <FiGlobe size={18} />
            </button>
            {showGlobePopup && <UpgradePopup />}
          </div>

          <button
            className="text-gray-500 hover:text-gray-300 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <FiPaperclip size={18} />
          </button>

          {/* <button className="text-gray-500 hover:text-gray-300 transition hidden xs:flex">
            <FiMic size={18} />
          </button> */}

          <button
            type="button"
            onClick={() => {
              if (prompt.trim()) {
                handleSubmit({ key: "Enter" });
              }
            }}
            disabled={!prompt.trim()}
            className="bg-[#23b5b5] hover:bg-[#21a5a5] text-white rounded-md px-3 py-1.5 md:py-2 transition disabled:opacity-60"
          >
            <FiSend size={18} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* File Preview */}
        {selectedFile && (
          <div className="mt-2 mx-3 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 flex items-center gap-2 text-xs md:text-sm">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-300 truncate">{selectedFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpliInput;
