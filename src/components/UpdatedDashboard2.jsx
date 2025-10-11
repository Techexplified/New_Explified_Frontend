import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  CircleUserRound,
  Share2,
  ArrowLeft,
  Download,
  FileText,
  FileJson,
  File,
  FileType,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

const UpdatedDashboard2 = ({ isDark, setIsDark }) => {
  const [title, setTitle] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const timeoutId = useRef(null);
  const navigate = useNavigate();
  const h1Ref = useRef(null);

  // File format selection
  const handleSelect = (format) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  // File download handler
  const handleDownload = () => {
    if (selectedFormats.length === 0) {
      alert("Please select at least one file format to download!");
      return;
    }

    selectedFormats.forEach((format) => {
      switch (format) {
        case "PDF":
          downloadAsPDF();
          break;
        case "WORD":
          downloadAsWord();
          break;
        case "TXT":
          downloadAsTxt();
          break;
        case "JSON":
          downloadAsJson();
          break;
        default:
          break;
      }
    });
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title || "Untitled", 20, 20);
    doc.save(`${title || "note"}.pdf`);
  };

  const downloadAsWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text: title || "Untitled", bold: true, size: 32 })],
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadAsTxt = () => {
    const blob = new Blob([`${title || "Untitled"}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsJson = () => {
    const blob = new Blob([JSON.stringify({ title }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header
      className="fixed  px-6 py-2 
                 z-50 top-0 left-0 w-full bg-black"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl 
                       text-white hover:text-[#23b5b5] hover:bg-[#1a2428] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative max-w-[270px] input-container">
            {!showButton ? (
              <>
                <input
                  ref={h1Ref}
                  type="text"
                  className="bg-transparent text-white outline-none border-b border-[#23b5b5]/50 focus:border-[#23b5b5] transition-all w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your title..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && title.trim() !== "") {
                      e.preventDefault();
                      setShowButton(true);
                    }
                  }}
                />
              </>
            ) : (
              <h1
                className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent cursor-pointer"
                onClick={() => setShowButton(false)}
              >
                {title}
              </h1>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <div
            className={`relative w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
              isDark ? "bg-gray-700" : "bg-yellow-300"
            }`}
            onClick={() => setIsDark(!isDark)}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                isDark ? "translate-x-0" : "translate-x-7"
              } flex items-center justify-center`}
            >
              {isDark ? (
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
              ) : (
                <div className="w-2.5 h-2.5 bg-yellow-600 rounded-full" />
              )}
            </div>
          </div>

          {/* Download Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => {
              clearTimeout(timeoutId.current);
              setIsDownloadOpen(true);
            }}
            onMouseLeave={() => {
              timeoutId.current = setTimeout(() => setIsDownloadOpen(false), 800);
            }}
          >
            <button className="flex items-center justify-center w-10 h-10 rounded-xl text-white hover:text-[#23b5b5] hover:bg-[#1a2428] transition-all">
              <Download className="w-5 h-5" />
            </button>

            {isDownloadOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 
                           bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg 
                           shadow-md p-4 w-48 flex flex-col gap-3 z-50"
              >
                {["PDF", "WORD", "TXT", "JSON"].map((format, idx) => {
                  const icons = {
                    PDF: FileText,
                    WORD: FileType,
                    TXT: File,
                    JSON: FileJson,
                  };
                  const Icon = icons[format];
                  return (
                    <label
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#23b5b5]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFormats.includes(format)}
                        onChange={() => handleSelect(format)}
                        className="hidden"
                      />
                      <span className="w-4 h-4 rounded-full border border-[#23b5b5] flex items-center justify-center">
                        {selectedFormats.includes(format) && (
                          <span className="w-2 h-2 bg-[#23b5b5] rounded-full"></span>
                        )}
                      </span>
                      <Icon className="w-5 h-5" />
                      <span>{format}</span>
                    </label>
                  );
                })}

                <button
                  onClick={handleDownload}
                  className="bg-[#23b5b5] hover:bg-[#1ea4a4] text-white font-medium rounded-lg py-1.5 mt-2 transition-all"
                >
                  Download
                </button>
              </div>
            )}
          </div>

          {/* Share */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: document.title, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white hover:text-[#23b5b5] hover:bg-[#1a2428] transition-all"
          >
            <Share2 className="w-5 h-5" />
          </button>

         

         
        </div>
      </div>
    </header>
  );
};

export default UpdatedDashboard2;
