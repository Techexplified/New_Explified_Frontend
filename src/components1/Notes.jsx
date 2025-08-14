import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Clock, Search, X, Pin, PinOff } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Notes() {
  const [newTask, setNewTask] = useState("");
  const [title, setTitle] = useState("Create New Note");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigate = useNavigate();
  const genAI = new GoogleGenerativeAI("AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // --- Persist pinned state (optional but recommended) ---
  useEffect(() => {
    const savedPinned = localStorage.getItem("notes_sidebar_pinned");
    if (savedPinned === "true") {
      setIsSidebarPinned(true);
      setIsSidebarOpen(true); // open on load if pinned
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("notes_sidebar_pinned", String(isSidebarPinned));
  }, [isSidebarPinned]);

  const handleEditClick = () => {
    setTempTitle(title);
    setIsEditing(true);
  };
  const handleSave = () => {
    setTitle(tempTitle.trim() || "Untitled Note");
    setIsEditing(false);
  };

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
      const normalized = stored.map((t, i) =>
        typeof t === "string"
          ? {
              id: Date.now() + i,
              title: "",
              content: t,
              lastModified: new Date().toISOString(),
            }
          : {
              id: t.id || Date.now() + i,
              title: t.title || "",
              content: t.content || "",
              lastModified: t.lastModified || new Date().toISOString(),
            }
      );
      setTasks(normalized);
      normalized.forEach(async (task) => {
        if (!task.title && task.content) {
          const title = await generateTitle(task.content);
          updateTaskTitle(task.id, title);
        }
      });
    } catch {
      setTasks([]);
    }
  }, []);

  const updateTaskTitle = (id, title) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, title } : t));
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    const existing = JSON.parse(localStorage.getItem("tasks") || "[]");
    const updated = [...existing, newTask.trim()];
    localStorage.setItem("tasks", JSON.stringify(updated));

    const all = JSON.parse(localStorage.getItem("alltask") || "[]");
    localStorage.setItem("alltask", JSON.stringify([...all, newTask.trim()]));

    setNewTask("");
    navigate("/Tasks");
  };

  const generateTitle = async (content) => {
    try {
      const prompt = `From the following note, pick one short significant word or a concise 2-3 word phrase as its title. Avoid quotes or punctuation. Note: "${content}"`;
      const res = await model.generateContent(prompt);
      const text = res.response.text().trim();
      return text || "Untitled";
    } catch {
      return "Untitled";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const diffDays = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      diffDays,
      "day"
    );
  };

  const filteredTasks = tasks.filter((t) =>
    (t.content || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sidebar width used for layout shift
  const SIDEBAR_W = 288; // 72 * 4

  return (
    <div
      className={`p-8 pt-[50px] bg-black min-h-screen text-white transition-all duration-300 ${
        isSidebarPinned || isSidebarOpen
          ? `ml-[${SIDEBAR_W}px] w-[calc(100%-${SIDEBAR_W}px)]`
          : "ml-0 w-full"
      }`}
    >
      {/* Hover area ONLY when not pinned */}
      {!isSidebarPinned && (
        <div
          className="fixed left-0 top-0 h-full w-2 z-50"
          onMouseEnter={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-black/30 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col transform transition-all duration-300 ease-in-out overflow-x-hidden
          ${isSidebarPinned || isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"}
        `}
        // Disable hover handlers when pinned
        onMouseEnter={
          isSidebarPinned ? undefined : () => setIsSidebarOpen(true)
        }
        onMouseLeave={
          isSidebarPinned ? undefined : () => setIsSidebarOpen(false)
        }
      >
        {/* Pin Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => {
              setIsSidebarPinned((prev) => !prev);
              // When pinning, keep it open; when unpinning, leave current open state as-is.
              if (!isSidebarPinned) setIsSidebarOpen(true);
            }}
            className={`p-2 rounded-full transition-all transform hover:scale-110 ${
              isSidebarPinned
                ? "bg-cyan-500 text-white rotate-0"
                : "bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white rotate-12"
            }`}
            title={isSidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
          >
            {isSidebarPinned ? (
              <Pin className="w-4 h-4" />
            ) : (
              <PinOff className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Header */}
        <div className="mb-8 mt-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#23b5b5] to-cyan-400 bg-clip-text text-transparent">
            Notes
          </h1>
          <p className="text-sm text-gray-400 mt-1">{tasks.length} notes total</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/50"
          />
        </div>

        {/* Recent Notes */}
        <div className="flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Recent Notes
          </h3>
          <div className="space-y-2">
            {filteredTasks.slice(0, 10).map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="text-sm text-white/90 mb-2">
                  {task.title || "Untitled"}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(task.lastModified)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-[10px]">
  <a
    href="https://explified.com/notes/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300">
      Learn more
    </button>
  </a>
</div>
      </aside>

      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 bg-gradient-to-r from-[#23b5b5] to-cyan-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleEditClick}
          >
            <Edit3 className="w-5 h-5 text-white" />
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-cyan-500 rounded text-white"
              >
                Save
              </button>
            </div>
          ) : (
            <h2 className="text-2xl font-bold">{title}</h2>
          )}
        </div>

        <X
          className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer"
          onClick={() => navigate("/Tasks")}
        />
      </div>

      <textarea
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white resize-none h-40"
        placeholder="Start writing your note..."
        autoFocus
      />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={addTask}
          disabled={!newTask.trim()}
          className="px-6 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-500 text-white rounded-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed"
        >
          Create Note
        </button>
      </div>
    </div>
  );
}
