import { useState, useEffect } from "react";
import { Plus, Edit3, Clock, Search, Pin, PinOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Sidebar from "../reusable_components/SidebarOnHover2"; // your Sidebar.jsx

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const navigate = useNavigate();
  const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY); // <-- put your key here
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      const normalizedTasks = storedTasks.map((t, index) => ({
        id: t.id || Date.now() + index,
        title: t.title || "",
        content: t.content || "",
        lastModified: t.lastModified || new Date().toISOString(),
      }));

      setTasks(normalizedTasks);

      // Generate titles for missing ones
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
      const prompt = `From the following note, pick one short significant word or concise 2-3 word phrase as its title. Avoid punctuation. Note: "${content}"`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      return text || "Untitled";
    } catch {
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
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarPinned={isSidebarPinned}
        setIsSidebarPinned={setIsSidebarPinned}
        tasks={filteredTasks}
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
                    onClick={() => setSelectedTaskId(task.id)}
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

          {/* Selected Note Modal */}
          {selectedTask && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="relative w-full max-w-md p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
                <button
                  onClick={() => setSelectedTaskId(null)}
                  className="absolute top-3 right-3 text-white hover:text-gray-300"
                >
                  ✕
                </button>
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
