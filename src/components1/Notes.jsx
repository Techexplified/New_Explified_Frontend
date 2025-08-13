import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit3, Clock, Search } from "lucide-react";
import { X } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import X icon
export default function Notes() {
  const [newTask, setNewTask] = useState("");
  const [title, setTitle] = useState("Create New Note");
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const genAI = new GoogleGenerativeAI("AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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
        const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        const normalizedTasks = storedTasks.map((t, index) => {
          if (typeof t === "string") {
            return {
              id: Date.now() + index,
              title: "",
              content: t,
              lastModified: new Date().toISOString(),
            };
          }
          return {
            id: t.id || Date.now() + index,
            title: t.title || "",
            content: t.content || "",
            lastModified: t.lastModified || new Date().toISOString(),
          };
        });
        setTasks(normalizedTasks);
  
        // Generate missing titles
        normalizedTasks.forEach(async (task) => {
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
      const updated = prev.map((task) =>
        task.id === id ? { ...task, title } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };
  const addTask = () => {
    if (!newTask.trim()) return;

    // Current session tasks
    let existingTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = [...existingTasks, newTask.trim()];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Persistent all-time tasks
    let allTasks = JSON.parse(localStorage.getItem("alltask")) || [];
    const updatedAllTasks = [...allTasks, newTask.trim()];
    localStorage.setItem("alltask", JSON.stringify(updatedAllTasks));

    setNewTask("");
    navigate("/Tasks");
  };
  const generateTitle = async (content) => {
    try {
      const prompt = `From the following note, pick one short significant word or a concise 2-3 word phrase as its title. Avoid quotes or punctuation. Note: "${content}"`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return text || "Untitled";
    } catch (error) {
      console.error("Gemini error:", error);
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

  const filteredTasks = tasks.filter((task) =>
    (task.content || "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div
  className={`p-8 pt-[50px] bg-black min-h-screen text-white transition-all duration-300 ${
    isSidebarOpen ? "w-[calc(100%-250px)] ml-[260px]" : "w-full"
  }`}
>
      <div
        className="fixed left-0 top-0 h-full w-2 z-50"
        onMouseEnter={() => setIsSidebarOpen(true)}
      />
       {/* Sidebar */}
      <aside
  className={`fixed left-0 top-[0px] h-screen bg-black/30 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col transform transition-transform duration-300 overflow-x-hidden ${
    isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full w-72"
  }`}
  onMouseLeave={() => setIsSidebarOpen(false)}
>


        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#23b5b5] to-cyan-400 bg-clip-text text-transparent">
            Notes
          </h1>
          <p className="text-sm text-gray-400 mt-1">{tasks.length} notes total</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
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
          <div className="space-y-2 ">
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
        <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300">
  Try it now
</button>

      </aside>
  {/* Header Row */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {/* Editable icon */}
      <div
        className="w-10 h-10 bg-gradient-to-r from-[#23b5b5] to-cyan-500 rounded-full flex items-center justify-center cursor-pointer"
        onClick={handleEditClick}
      >
        <Edit3 className="w-5 h-5 text-white" />
      </div>

      {/* Title editing */}
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

    {/* Cross icon to go back */}
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