import { useState } from "react";
import { Plus, Edit3, Clock, Search } from "lucide-react";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    const taskObj = { 
      id: Date.now(), 
      content: newTask,
      createdAt: new Date(),
      lastModified: new Date()
    };
    setTasks((prev) => [taskObj, ...prev]);
    setNewTask("");
    setShowModal(false);
  };

  const updateTaskContent = (id, content) => {
    setTasks((prev) =>
      prev.map((task) => 
        task.id === id 
          ? { ...task, content, lastModified: new Date() } 
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task =>
    task.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)), 'day'
    );
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-72 bg-black/30 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col">
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
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/50 focus:border-[#23b5b5]/50 transition-all"
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
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="text-sm text-white/90 line-clamp-2 mb-2">
                  {task.content.split("\n")[0] || "Untitled Note"}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(task.lastModified)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Your Notes</h2>
              <p className="text-gray-400">Capture your thoughts and ideas</p>
            </div>
            
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-[#23b5b5] to-cyan-500 hover:from-[#1da1a1] hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-[#23b5b5]/25 hover:scale-105 flex items-center gap-2 max-h-[90px]"
            >
              <Plus className="w-5 h-5" />
              New Note
            </button> 
            
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#23b5b5]/10 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <Edit3 className="w-4 h-4 text-[#23b5b5] mt-1" />
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all duration-200 text-sm"
                  >
                    ✕
                  </button>
                </div>
                
                <textarea
                  value={task.content}
                  onChange={(e) => updateTaskContent(task.id, e.target.value)}
                  className="w-full bg-transparent text-white/90 resize-none focus:outline-none text-sm leading-relaxed min-h-[120px] placeholder-gray-500"
                  placeholder="Start writing your note..."
                />
                
                <div className="mt-4 pt-3 border-t border-white/10">
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Modified {formatDate(task.lastModified)}
                  </p>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredTasks.length === 0 && tasks.length > 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                <Search className="w-12 h-12 mb-4 opacity-50" />
                <p className="text-lg mb-2">No notes found</p>
                <p className="text-sm">Try adjusting your search term</p>
              </div>
            )}

            {/* {tasks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="bg-white/5 rounded-full p-6 mb-6">
                  <Edit3 className="w-12 h-12 text-[#23b5b5]" />
                </div>
                <h3 className="text-xl font-semibold text-white/80 mb-2">Start taking notes</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Create your first note to capture ideas, thoughts, and important information.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-6 bg-gradient-to-r from-[#23b5b5] to-cyan-500 hover:from-[#1da1a1] hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Note
                </button>
              </div>
            )} */}
          </div>
        </div>
      </main>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl shadow-2xl transform transition-all duration-300 scale-100">
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-[#23b5b5] to-cyan-500 rounded-full flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Note</h2>
                  <p className="text-gray-400 text-sm">Capture your thoughts and ideas</p>
                </div>
              </div>

              <textarea
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/50 focus:border-[#23b5b5]/50 text-white resize-none h-40 transition-all duration-200"
                placeholder="Start writing your note..."
                autoFocus
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={addTask}
                  disabled={!newTask.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#23b5b5] to-cyan-500 hover:from-[#1da1a1] hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 rounded-xl transition-all duration-200 text-white font-medium shadow-lg hover:shadow-[#23b5b5]/25 disabled:cursor-not-allowed"
                >
                  Create Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}