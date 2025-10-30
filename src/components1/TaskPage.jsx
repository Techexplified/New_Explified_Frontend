import { useState, useEffect } from "react";
import { Plus, Edit3, Clock, Search, Pin, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import CanvasPreview from "../editor/CanvasPreview";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskManager() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const navigate = useNavigate();

  // ✅ Fixed sharedWith placement
  function handleSaveNote(title, content) {
    const shapes = useStore.getState().shapes;
    const newNote = {
      id: Date.now(),
      title,
      content,
      shapes,
      pinned: false,
      lastModified: new Date().toISOString(),

      // 👇 Sample shared contributors
    sharedWith: [
  { name: "Kashish", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Kashish&backgroundColor=b6e3f4,c0aede,d1d4f9" },
  { name: "Aisha", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aisha&backgroundColor=b6e3f4,c0aede,d1d4f9" },
  { name: "Riya", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Riya&backgroundColor=b6e3f4,c0aede,d1d4f9" },
  { name: "Mohit", avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohit&backgroundColor=b6e3f4,c0aede,d1d4f9" },
],


    };

    const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = [newNote, ...existingNotes];
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  }

  const handleNewNote = () => {
    handleSaveNote("Untitled Note", "New note created.");
    navigate("/notes");
  };

  useEffect(() => {
    try {
      const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
      setNotes(storedNotes);
    } catch {
      setNotes([]);
    }
  }, []);

  const handleNotesView = (note) => {
    localStorage.setItem("selectedNote", JSON.stringify(note));
    navigate("/notes");
  };

  const filtered = notes.filter((note) => {
    const s = searchTerm.toLowerCase();
    return (
      note.title.toLowerCase().includes(s) ||
      note.content.toLowerCase().includes(s)
    );
  });

  const handlePin = (id) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, pinned: !note.pinned } : note
    );
    updatedNotes.sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (!confirmed) return;
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const displayedNotes =
    activeTab === "recent"
      ? filtered
      : activeTab === "sharedFiles"
      ? filtered.slice(0, 2)
      : filtered.filter((n) => n.title.includes("Project"));

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.08,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const slideLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const slideRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="min-h-screen w-full relative bg-[#0b0f10] text-white overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Animated glowing background */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(34,211,238,0.15), transparent 70%)",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 50%", "0% 0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 20,
          ease: "linear",
        }}
      />

      <div className="relative z-10 flex flex-col h-screen p-10 overflow-y-auto custom-scrollbar">
        {/* Title */}
        <motion.h1
          className="text-2xl md:text-3xl font-semibold text-center mb-8 text-slate-300 tracking-wide"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Your Creative Workspace
        </motion.h1>

        {/* Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-5 mb-10">
          {/* Tabs */}
          <motion.div
            className="flex flex-wrap gap-5 border-b border-slate-800 pb-2"
            variants={slideLeft}
            initial="hidden"
            animate="visible"
          >
            {[
              { id: "recent", label: "Recently Viewed" },
              { id: "sharedFiles", label: "Shared Files" },
            ].map((tab) => (
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ color: "#22d3ee" }}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 text-sm font-medium relative transition-all duration-300 
                ${
                  activeTab === tab.id
                    ? "text-cyan-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-cyan-400"
                    : "text-slate-400 hover:text-cyan-300"
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>

          {/* Search + Buttons */}
          <motion.div
            className="flex items-center gap-3"
            variants={slideRight}
            initial="hidden"
            animate="visible"
          >
            <div
              className="flex items-center h-11 bg-slate-900/60 border border-slate-700 
              rounded-lg px-4 w-[240px] md:w-[300px]
              shadow-[0_0_10px_rgba(34,211,238,0.1)]
              focus-within:border-cyan-400 transition-all duration-300"
            >
              <Search className="w-4 h-4 text-cyan-400 mr-2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm text-slate-200 placeholder-slate-400 focus:outline-none w-full"
              />
            </div>

            {["New Note", "Canvas"].map((label, i) => (
              <motion.button
                key={i}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(34,211,238,0.3)",
                  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNewNote}
                className="h-12 px-6 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 
                border border-slate-700 text-cyan-300 rounded-xl font-semibold flex items-center justify-center gap-2
                transition-all duration-300 shadow-[0_0_10px_rgba(0,0,0,0.6)] hover:border-cyan-400"
              >
                <Plus className="w-5 h-5 text-cyan-400" /> {label}
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Notes Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7 pb-8"
          >
            <AnimatePresence>
              {displayedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleNotesView(note)}
                  className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 
                    ${
                      activeTab === "sharedFiles"
                        ? "bg-gradient-to-br from-slate-700/40 via-slate-800/40 to-slate-900/40 border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-500/10"
                        : "bg-slate-900/60 border-slate-800/60 hover:border-cyan-400/50"
                    }`}
                >
                  {/* Hover Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePin(note.id);
                      }}
                      className={`p-1.5 rounded-lg transition ${
                        note.pinned
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "bg-slate-800/80 hover:bg-slate-700"
                      }`}
                    >
                      <Pin className="w-4 h-4 text-white" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(note.id);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Canvas Preview */}
                  <CanvasPreview shapes={note.shapes} />

                  {/* Info Section */}
                  <div
                    className={`px-5 py-4 border-t transition-all ${
                      activeTab === "sharedFiles"
                        ? "bg-slate-900/40 border-cyan-500/30"
                        : "bg-slate-800/50 border-slate-700/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white truncate max-w-[70%]">
                          {note.title || "Untitled"}
                        </h3>
                        {activeTab === "sharedFiles" && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Shared
                          </span>
                        )}
                      </div>
                      <Edit3
                        className={`w-4 h-4 transition-all ${
                          activeTab === "sharedFiles"
                            ? "text-cyan-300 group-hover:scale-110"
                            : "text-cyan-400 opacity-0 group-hover:opacity-100"
                        }`}
                      />
                    </div>

                    <p
                      className={`text-xs flex items-center ${
                        activeTab === "sharedFiles"
                          ? "text-cyan-200"
                          : "text-slate-400"
                      }`}
                    >
                      <Clock
                        className={`w-3 h-3 mr-1 ${
                          activeTab === "sharedFiles"
                            ? "text-cyan-300"
                            : "text-cyan-300"
                        }`}
                      />
                      {new Date(note.lastModified).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

           {/* 👇 Shared Avatars Section */}
{activeTab === "sharedFiles" && note.sharedWith?.length > 0 && (
  <div className="mt-3">
    <h4 className="text-xs font-medium text-cyan-300 mb-2 tracking-wide">
      Shared To
    </h4>

    <div className="flex items-center -space-x-3">
      {note.sharedWith.slice(0, 3).map((user, idx) => (
        <div
          key={idx}
          className="relative w-9 h-9 rounded-full border-2 border-slate-900
                     bg-slate-800 overflow-hidden hover:scale-110
                     transition-transform shadow-[0_0_10px_rgba(34,211,238,0.3)]"
        >
          <img
            src={
              user.avatar ||
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`
            }
            alt={user.name}
            className="w-full h-full object-cover rounded-full"
          />
          {/* Soft cyan glow overlay */}
          <div className="absolute inset-0 rounded-full bg-cyan-400/10 opacity-0 hover:opacity-100 transition-opacity" />
        </div>
      ))}

      {note.sharedWith.length > 3 && (
        <div className="w-9 h-9 flex items-center justify-center rounded-full
                        bg-slate-700 text-[11px] text-cyan-300 font-semibold
                        border-2 border-slate-900 hover:scale-105 transition-transform
                        shadow-[0_0_6px_rgba(34,211,238,0.4)]">
          +{note.sharedWith.length - 3}
        </div>
      )}
    </div>
  </div>
)}

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
