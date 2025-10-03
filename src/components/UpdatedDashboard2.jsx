// UpdatedDashboard.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Workflow,
  Zap,
  PencilRuler,
  CircleUserRound,
  Plus,
  FileText,
  Search,
  ArrowLeft,
  Share2,
  Download,
} from "lucide-react";
import { create } from "zustand";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun } from "docx";

// ---------------- ZUSTAND STORE ----------------
const useStore = create((set) => ({
  shapes: [],
  selectedTool: "freehand",
  setTool: (tool) => set({ selectedTool: tool }),
  setShapes: (shapesFromPreviousNote) => set({ shapes: shapesFromPreviousNote }),
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, updater) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? { ...s, ...(typeof updater === "function" ? updater(s) : updater) } : s
      ),
    })),
  removeShape: (id) => set((state) => ({ shapes: state.shapes.filter((s) => s.id !== id) })),
  selectedShapeId: null,
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
  textStyle: { fontFamily: "Arial", fontSize: 20, bold: false, italic: false, color: "#23b5b5" },
  setTextStyle: (partial) => set((state) => ({ textStyle: { ...state.textStyle, ...partial } })),
  freehandType: "pencil",
  setFreehandType: (fType) => set({ freehandType: fType }),
}));

// ---------------- NAV ITEMS ----------------
const navItems = [
  { name: "Search", icon: Search, active: true },
  { name: "Recent", icon: null, active: false },
  { name: "Start", icon: null, active: false },
  { name: "All Apps", icon: null, active: false },
  { name: "Workflows", icon: null, active: false },
  { name: "Integrations", icon: null, active: false },
];

const UpdatedDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [title, setTitle] = useState("Title");
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const h1Ref = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutId = useRef(null);

  const setShapes = useStore((state) => state.setShapes);
  const shapes = useStore((state) => state.shapes);

  // ---------------- NAVBAR HANDLERS ----------------
  const PlusClick = () => navigate("/expli");
  const handleNavBarClick = (navName) => {
    setSelectedTool(navName);
    if (["Start", "Search", "Recent", "All Apps"].includes(navName)) navigate("/");
    else if (navName === "Workflows") navigate("/workflows");
    else if (navName === "Integrations") navigate("/integrations");
  };

  // ---------------- PROFILE DROPDOWN ----------------
  const handleMouseEnter = () => {
    clearTimeout(timeoutId.current);
    setIsOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutId.current = setTimeout(() => setIsOpen(false), 200);
  };

  // ---------------- MOUSE EFFECTS ----------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY <= 450) setShowNavbar(true);
      else setShowNavbar(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ---------------- LOAD SELECTED NOTE ----------------
  useEffect(() => {
    const selectedNote = localStorage.getItem("selectedNote");
    if (selectedNote) {
      try {
        const noteObj = JSON.parse(selectedNote);
        setTitle(noteObj.title || "Title");
        setShapes(noteObj.shapes || []);
      } catch (e) {
        console.error("Failed to parse selectedNote:", e);
      }
    }
  }, [setShapes]);

  // ---------------- EDITABLE TITLE ----------------
  useEffect(() => {
    if (h1Ref.current) {
      h1Ref.current.textContent = typeof title === "string" ? title : "";
      const el = h1Ref.current;
      if (document.activeElement === el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [title]);

  // ---------------- AUTO-SAVE TITLE + SHAPES ----------------
  useEffect(() => {
    const debounce = setTimeout(() => {
      const notes = JSON.parse(localStorage.getItem("notes") || "[]");
      const selectedNote = localStorage.getItem("selectedNote");
      let noteId = selectedNote ? JSON.parse(selectedNote).id : Date.now().toString();

      const noteToSave = { id: noteId, title, shapes, updatedAt: new Date().toISOString() };

      const noteExists = notes.find((n) => n.id === noteId);
      if (noteExists) {
        const updatedNotes = notes.map((n) => (n.id === noteId ? noteToSave : n));
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
      } else {
        notes.push(noteToSave);
        localStorage.setItem("notes", JSON.stringify(notes));
      }
      localStorage.setItem("selectedNote", JSON.stringify(noteToSave));
    }, 800); // 0.8s debounce

    return () => clearTimeout(debounce);
  }, [title, shapes]);

  // ---------------- ROUTE PATH MAPPING ----------------
  useEffect(() => {
    const pathname = location.pathname;
    const pathMap = {
      "/": "Dashboard",
      "/workflows": "Workflows",
      "/socials": "Socials",
      "/favorites": "Favorites",
      "/search": "Search",
      "/recent": "Recent",
      "/start": "Start",
      "/all-apps": "All Apps",
      "/integrations": "Integrations",
    };
    setSelectedTool(pathMap[pathname] || "");
  }, [location.pathname]);

  // ---------------- DOWNLOAD FUNCTIONS ----------------
  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    doc.text(JSON.stringify(shapes, null, 2), 20, 40);
    doc.save(`${title || "note"}.pdf`);
  };

  const downloadAsWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] }),
            new Paragraph(""),
            new Paragraph(JSON.stringify(shapes, null, 2)),
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
    const blob = new Blob([`${title}\n\n${JSON.stringify(shapes, null, 2)}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAsJson = () => {
    const blob = new Blob([JSON.stringify({ title, shapes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "note"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ---------------- JSX ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 flex flex-col overflow-hidden">
      {/* Header / Navbar */}
      <header
        className={`fixed border-minimal-border/50 px-6 transition-transform duration-300 z-50 top-0 left-0 w-full ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ minHeight: "56px", background: "transparent" }}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left Section - Back Button + Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div
              className="h-auto w-auto border rounded-md flex flex-col justify-center"
              style={{ border: "2px solid #23b5b5", minWidth: "120px" }}
            >
              <h1
                ref={h1Ref}
                contentEditable
                suppressContentEditableWarning={true}
                spellCheck={false}
                onInput={(e) => setTitle(e.currentTarget.textContent)}
                style={{
                  cursor: "text",
                  textAlign: "center",
                  fontSize: "1.3rem",
                  fontWeight: 400,
                  fontFamily: "sans-serif",
                  color: "#23b5b5",
                  padding: "0 16px",
                  border: "none",
                  outline: "none",
                  userSelect: "text",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                aria-label="Notes Title"
              />
            </div>
          </div>

          {/* Right Section - Share, Dashboard, Plus, Profile, Download */}
          <div className="flex items-center gap-2 pt-1">
            {/* Download Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDownloadOpen(true)}
              onMouseLeave={() => setIsDownloadOpen(false)}
            >
              <button className="flex items-center justify-center w-10 h-10 rounded-xl text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover transition-all duration-200">
                <Download className="w-5 h-5" />
              </button>
              {isDownloadOpen && (
                <div className="absolute right-0 mt-2 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg shadow-md p-2 flex flex-col gap-2">
                  <button onClick={downloadAsPDF} className="text-white hover:text-[#23b5b5]">
                    📄 PDF
                  </button>
                  <button onClick={downloadAsWord} className="text-white hover:text-[#23b5b5]">
                    📝 Word
                  </button>
                  <button onClick={downloadAsTxt} className="text-white hover:text-[#23b5b5]">
                    📃 TXT
                  </button>
                  <button onClick={downloadAsJson} className="text-white hover:text-[#23b5b5]">
                    🗂 JSON
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
              className="flex items-center justify-center w-10 h-10 rounded-xl text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover transition-all duration-200"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* Dashboard */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover transition-all duration-200"
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>

            {/* Plus */}
            <div
              className="relative"
              onMouseEnter={() => setIsPlusOpen(true)}
              onMouseLeave={() => setIsPlusOpen(false)}
            >
              <button
                onClick={PlusClick}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Profile */}
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative inline-block"
            >
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center justify-center w-10 h-10 rounded-xl text-minimal-white hover:text-[#23b5b5] hover:bg-minimal-cardHover transition-all duration-200"
              >
                <CircleUserRound className="w-5 h-5" />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-12 min-w-[220px] bg-gradient-to-br from-[#0d1418] to-[#111c20] backdrop-blur-xl border border-[#23b5b5]/40 rounded-xl shadow-lg p-4 flex flex-col items-center z-50">
                  <Link
                    className="w-full h-9 mb-3 rounded-lg border border-[#23b5b5]/40 text-sm font-medium text-white bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-md hover:shadow-cyan-500/20 transition-all duration-200 flex items-center justify-center"
                    to="https://explified.com/explified-labs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    For Enterprises
                  </Link>

                  <div className="flex gap-2 w-full mb-3">
                    {[{ icon: Plus, to: "/expli" }, { icon: FileText, to: "/tasks" }].map(
                      ({ icon: Icon, to }, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            navigate(to);
                            setIsOpen(false);
                          }}
                          className="flex-1 h-9 flex items-center justify-center rounded-lg border border-[#23b5b5]/40 bg-transparent hover:bg-[#23b5b5]/15 hover:border-[#23b5b5] hover:shadow-sm hover:shadow-cyan-500/20 text-white transition-all duration-200"
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className={`${sidebarOpen ? "ml-80" : "ml-0"} w-full transition-all duration-300`}>
        {/* Place your Canvas or Editor component here */}
      </div>
    </div>
  );
};

export default UpdatedDashboard;
