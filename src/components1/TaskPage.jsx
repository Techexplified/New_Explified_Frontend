import { useState, useEffect } from "react";
import { Plus, Edit3, Clock, Search, Pin, PinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Sidebar from "../reusable_components/SidebarOnHover2";

export default function TaskManager() {
  const [notes, setNotes] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which note's dropdown is open

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigate = useNavigate();
  const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const handleNewNote = () => {
    localStorage.removeItem("selectedNote");
    navigate("/notes");
  };

  useEffect(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      const normalizedNotes = storedNotes.map((t, index) => ({
        id: t.id || Date.now() + index,
        title: t.title || "",
        content: t.content || "",
        shapes: t.shapes || "",
        lastModified: t.lastModified || new Date().toISOString(),
        pinned: t.pinned || false,
      }));
      setNotes(normalizedNotes);
    } catch {
      setNotes([]);
    }
    if (localStorage.getItem("selectedNote"))
      localStorage.removeItem("selectedNote");
  }, []);

  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const togglePin = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const filteredNotes = notes.filter((note) => {
    const search = searchTerm.toLowerCase();
    return (
      (note.title || "").toLowerCase().includes(search) ||
      (note.content || "").toLowerCase().includes(search)
    );
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.pinned === b.pinned)
      return new Date(b.lastModified) - new Date(a.lastModified);
    return a.pinned ? -1 : 1;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const diffDays = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      diffDays,
      "day"
    );
  };

  const handleNotesView = (note) => {
    localStorage.setItem("selectedNote", JSON.stringify(note));
    navigate("/notes");
  };

  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Ocean Abyss Background with Top Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6, 182, 212, 0.25), transparent 70%), #000000",
        }}
      />

      {/* Main App Content */}
      <div className="relative z-10 flex h-screen opacity-80">
        {/* Sidebar */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarPinned={isSidebarPinned}
          setIsSidebarPinned={setIsSidebarPinned}
          tasks={filteredNotes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedTaskId={setSelectedTaskId}
          formatDate={formatDate}
        />

        {/* Main Content */}
        <main
          className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
            isSidebarOpen || isSidebarPinned ? "ml-72" : "ml-0"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Your Notes</h2>
            </div>

            {/* New Note + Search Bar */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-3 w-full max-w-[600px]">
                <button
                  onClick={handleNewNote}
                  className="h-12 px-6 bg-gradient-to-r from-teal-600 to-teal-400 text-white 
                             rounded-xl font-medium transition-all shadow-lg flex items-center 
                             gap-2 hover:from-teal-700 hover:to-teal-500"
                >
                  <Plus className="w-5 h-5" />
                  New Note
                </button>

                <div
                  className="flex items-center h-12 bg-slate-800/50 border border-teal-600/20 
                                rounded-xl px-4 shadow-sm flex-1
                                hover:bg-slate-800/60 hover:border-teal-400/40 transition-all duration-300"
                >
                  <Search className="w-5 h-5 text-teal-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-teal-100 placeholder-teal-400 focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-hidden">
              {sortedNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNotesView(note)}
                  className="group relative bg-slate-800/40 border border-teal-600/20 rounded-2xl p-5 
                             hover:border-teal-400/40 hover:bg-slate-800/60 transition-all 
                             duration-300 overflow-hidden backdrop-blur-sm cursor-pointer"
                >
                  {/* Header Row */}
                  <div className="relative flex items-start justify-between mb-3 group">
                    <h3 className="text-white font-semibold text-sm truncate max-w-[70%]">
                      {note.title || "Untitled"}
                    </h3>

                    <div className="flex items-center gap-2">
                      {/* Pen remains as-is */}
                      <Edit3
                        className="w-4 h-4 text-teal-400 mt-1 cursor-pointer hover:text-teal-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNotesView(note);
                        }}
                      />

                      {/* 3-dots dropdown (isolated hover only on button OR dropdown) */}
                      <div className="relative">
                        <div className="peer text-teal-400 hover:text-teal-300 flex items-center justify-center w-4 h-4 cursor-pointer">
                          ⋮
                        </div>

                        {/* Dropdown appears when hovering button OR dropdown */}
                        <div
                          className="absolute right-0 mt-2 w-24 bg-slate-900/90 border border-teal-700/30 
               rounded-lg shadow-md flex flex-col backdrop-blur-sm overflow-hidden z-20
               opacity-0 invisible 
               peer-hover:opacity-100 peer-hover:visible
               hover:opacity-100 hover:visible
               transition-all duration-200"
                        >
                          <button
                            className="text-teal-100 hover:bg-teal-600/10 px-3 py-1 text-left text-sm transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePin(note.id);
                            }}
                          >
                            {note.pinned ? "Unpin" : "Pin"}
                          </button>
                          <button
                            className="text-red-400 hover:bg-red-600/10 px-3 py-1 text-left text-sm transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Pin Icon in top-left, tilted right, only if pinned */}
                    {note.pinned && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className="absolute top-0 left-0 text-teal-400 hover:text-teal-300 transform -translate-y-1/2 -translate-x-1/2 rotate-12"
                      >
                        <PinOff className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className="text-xs text-teal-200 opacity-0 group-hover:opacity-100 
                               max-h-0 group-hover:max-h-40 overflow-hidden transition-all duration-300"
                  >
                    {note.content || "No content available"}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 pt-3 border-t border-teal-600/20">
                    <p className="text-xs text-teal-300 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Modified {formatDate(note.lastModified)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
