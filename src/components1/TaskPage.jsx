import { useState, useEffect } from "react";
import { Plus, Edit3, Clock, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();
 const [selectedTask1, setSelectedTask] = useState(null);
  const genAI = new GoogleGenerativeAI("AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms");

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Load tasks and assign titles if missing
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

  // Gemini title generator
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

  const updateTaskTitle = (id, title) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === id ? { ...task, title } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updated));
      return updated;
    });
  };

  const updateTaskContent = (id, content) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, content, lastModified: new Date().toISOString() }
        : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  const filteredTasks = tasks.filter((task) =>
    (task.content || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    const diffDays = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
      diffDays,
      "day"
    );
  };

  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  return (
    <div className="flex h-screen bg-black pt-[40px]">
      {/* Hover zone to trigger sidebar */}
      <div
        className="fixed left-0 top-0 h-full w-2 z-50 "
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
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
        <button className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur-md shadow-lg transition-all duration-300">
  Try it now
</button>

      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 p-8 overflow-y-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto ">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Your Notes</h2>
            <p className="text-gray-400">Capture your thoughts and ideas</p>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-hidden">
            <button
              onClick={() => navigate("/notes")}
              className="bg-gradient-to-r from-[#23b5b5] to-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center gap-2 max-h-[90px]"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button>

            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 overflow-y-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <Edit3
                    className="w-4 h-4 text-[#23b5b5] mt-1 cursor-pointer"
                    onClick={() => setEditingTaskId(task.id)}
                  />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-sm"
                  >
                    ✕
                  </button>
                </div>

                {editingTaskId === task.id ? (
                  <textarea
                    value={task.content}
                    onChange={(e) => updateTaskContent(task.id, e.target.value)}
                    onBlur={() => setEditingTaskId(null)}
                    className="w-full bg-transparent text-white/90 resize-none focus:outline-none text-sm leading-relaxed min-h-[120px]"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-white/90 text-sm leading-relaxed cursor-pointer"
                    onClick={() => {
  setSelectedTaskId(task.id);
  setSelectedTask(true);
}}
                  >
                    {task.content}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Modified {formatDate(task.lastModified)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Focused selected note */}
          {selectedTask && selectedTask1 && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
    <div className="relative w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
      {/* Close icon */}
      <button
        onClick={() => setSelectedTask(null)}
        className="absolute top-3 right-3 text-white hover:text-gray-300"
      >
        ✕
      </button>

      {/* Task content */}
      <h3 className="text-xl font-bold text-white mb-4">
        {selectedTask.title || "Untitled"}
      </h3>
      <p className="text-gray-300">{selectedTask.content}</p>
    </div>
  </div>
)}

        </div>
      </main>
    </div>
  );
}
