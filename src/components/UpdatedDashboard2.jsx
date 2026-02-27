import { useState, useRef, useEffect } from "react";
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
  Moon,
  Sun,

  PlayCircle,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

const UpdatedDashboard2 = ({ isDark, setIsDark, onShareOpen, onShareClose }) => {
  const [title, setTitle] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [open, setOpen] = useState(false);
  const timeoutId = useRef(null);
  const navigate = useNavigate();

  // ✅ Load currently selected note
  useEffect(() => {
    const storedNote = JSON.parse(localStorage.getItem("selectedNote"));
    if (storedNote) {
      setSelectedNote(storedNote);
      setTitle(storedNote.title || "");
    }
  }, []);

  // ✅ Handle title change + localStorage sync
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const storedNote = JSON.parse(localStorage.getItem("selectedNote"));

    if (storedNote) {
      const updatedNote = {
        ...storedNote,
        title: newTitle,
        lastModified: new Date().toISOString(),
      };

      const updatedNotes = storedNotes.map((n) =>
        n.id === updatedNote.id ? updatedNote : n
      );

      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      localStorage.setItem("selectedNote", JSON.stringify(updatedNote));
    }
  };

  // ✅ Handle file format selection
  const handleSelect = (format) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  // ✅ File downloads
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
              children: [
                new TextRun({
                  text: title || "Untitled",
                  bold: true,
                  size: 32,
                }),
              ],
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

  // ✅ Hover for Profile Dropdown
  const handleMouseEnter = () => {
    clearTimeout(timeoutId.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => setIsOpen(false), 200);
  };

  // ✅ Theming Colors
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-black";
  const buttonHoverBg = isDark ? "hover:bg-[#1a2428]" : "hover:bg-gray-200";
  const buttonHoverText = isDark ? "hover:text-[#23b5b5]" : "hover:text-black";

  return (
    <>
      {/* ---------- HEADER ---------- */}
      <header
        className={`fixed top-0 left-0 w-full z-[100] px-6 py-2 transition-colors duration-500 border-b border-gray-200 dark:border-gray-800 shadow-sm ${bgColor}`}
      >
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${textColor} ${buttonHoverText} ${buttonHoverBg}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Logo */}
            <img
              src="/Explified_logo.png" // <-- replace with your logo path
              alt="Logo"
              className="w-8 h-8 object-contain"
            />

            {/* Editable Title */}
            <div className="relative max-w-[270px]">
              {!showButton ? (
                <input
                  type="text"
                  className={`bg-transparent outline-none border-b transition-all w-full ${textColor} border-[#23b5b5]/50 focus:border-[#23b5b5]`}
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Enter your title..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && title.trim() !== "") {
                      e.preventDefault();
                      setShowButton(true);
                    }
                  }}
                />
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
            <button
              onClick={() => setIsDark(!isDark)}
              className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${isDark
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                setOpen(true);
                onShareOpen && onShareOpen(); // inform LexicalEditor to blur everything
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#23b5b5]text-white shadow-md hover:shadow-lg hover:scale-[1.05] 
             active:scale-[0.98] transition-all duration-300 ease-in-out"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium tracking-wide">Share</span>
            </button>

            {/* Overlay */}
            {open && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[100]">
                {/* Dialog Box */}
                <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90%] p-8 text-center animate-fadeIn">
                  <h2 className="text-xl font-semibold text-[#23b5b5] mb-2">
                    Live collaboration
                  </h2>
                  <p className="text-gray-600 mb-1">
                    Invite people to collaborate on your drawing.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Don’t worry, the session is end-to-end encrypted and fully private.
                  </p>

                  <button
                    onClick={() => alert("Starting session...")}
                    className="flex items-center justify-center gap-2 w-full bg-[#23b5b5]
                   text-white font-medium py-2.5 rounded-lg transition-all mb-6"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start session
                  </button>

                  <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span>Or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#23b5b5] mb-2">
                    Shareable link
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">Export as a read-only link.</p>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="flex items-center justify-center gap-2 w-full border border-[#23b5b5] 
                   text-white font-medium py-2.5 rounded-lg transition-all"
                  >
                    Export to Link
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => {
                      setOpen(false);
                      onShareClose && onShareClose(); // remove blur when closed
                    }}
                    className="mt-6 text-sm text-white transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}


            {/* Overlay */}
            {open && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                {/* Dialog Box */}
                <div className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[90%] p-8 text-center animate-fadeIn">
                  <h2 className="text-xl font-semibold text-[#23b5b5] mb-2">
                    Live collaboration
                  </h2>
                  <p className="text-gray-600 mb-1">
                    Invite people to collaborate on your drawing.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Don’t worry, the session is end-to-end encrypted and fully private.
                  </p>

                  {/* Start Session */}
                  <button
                    onClick={() => alert("Starting session...")}
                    className="flex items-center justify-center gap-2 w-full bg-[#23b5b5]
                         text-white font-medium py-2.5 rounded-lg transition-all mb-6"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start session
                  </button>

                  <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span>Or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* Shareable Link */}
                  <h3 className="text-lg font-semibold text-[#23b5b5] mb-2">
                    Shareable link
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Export as a read-only link.
                  </p>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }}
                    className="flex items-center justify-center gap-2 w-full border border-[#23b5b5] 
                         text-[#23b5b5] font-medium py-2.5 rounded-lg hover:bg-indigo-50 transition-all"
                  >
                    <Link className="w-4 h-4" />
                    Export to Link
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setOpen(false)}
                    className="mt-6 text-sm text-gray-400 hover:text-gray-600 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}


          </div>
        </div>
      </header>


    </>
  );
};

export default UpdatedDashboard2;
