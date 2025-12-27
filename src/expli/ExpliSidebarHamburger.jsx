import { MessageSquare, Trash2, ExternalLink, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import WorkFlowButtonSidebar from "../reusable_components/WorkFlowButtonSidebar";

function ExpliSidebar({
  link,
  id,
  chatHistory = [],
  chatHistoryOpenAI = [],
  chatHistoryGemini = [],
  setChatHistory,
  setChatHistoryOpenAI,
  setChatHistoryGemini,
  setCurrentMessages,
  setCurrentMessagesGemini,
  setCurrentMessagesOpenAI,
  onAddClick,
  tools = [],
  setCurrentTool = () => {},
}) {
  const [selectedProvider, setSelectedProvider] = useState("expli");
  const [isOpen, setIsOpen] = useState(false);

  console.log(isOpen);

  return (
    <div
      className={`h-screen ${
        isOpen ? "w-72" : "w-16"
      } px-3 relative z-50 overflow-y-scroll sidebar-scroll bg-gradient-to-b from-gray-900/50 to-black/95 backdrop-blur-2xl 
        border-r border-minimal-primary/30 shadow-2xl shadow-minimal-primary/10
        flex flex-col justify-between transition-all duration-500 ease-in-out`}
    >
      {/* Top section */}
      <div className="mt-4 space-y-4">
        {/* Header with Hamburger */}
        <div className="border-b border-minimal-primary/30 pb-2">
          <div className="flex items-center justify-between gap-3 mb-2">
            {isOpen && (
              <h1 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white via-minimal-primary to-cyan-400 bg-clip-text text-transparent">
                Expli
              </h1>
            )}
            {/* Hamburger */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Only render content when open */}
        {isOpen && (
          <div className="space-y-2">
            {/* New Chat Button */}
            <button
              onClick={onAddClick}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800/80 to-gray-700/80 
                hover:from-minimal-primary/20 hover:to-cyan-500/20 border border-gray-600/50 hover:border-minimal-primary/50
                text-white font-medium py-1.5 px-2 rounded-xl transition-all duration-300 hover:scale-105 
                hover:shadow-lg hover:shadow-minimal-primary/10"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-minimal-primary/0 to-minimal-primary/10 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative text-sm flex items-center justify-center gap-3">
                <MessageSquare size={14} />
                <span>New Chat</span>
              </div>
            </button>

            {/* Chat History Section */}
            <div className="bg-gray-900/30 rounded-xl p-1 border border-gray-700/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare size={16} className="text-minimal-primary" />
                  <h3 className="text-sm font-medium text-gray-300">
                    Chat History
                  </h3>
                </div>

                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  className="bg-gray-800/80 text-white text-xs rounded-lg px-3 py-1.5 border border-gray-600/50 
                    focus:border-minimal-primary/50 focus:outline-none transition-colors duration-200"
                >
                  <option value="gemini">Gemini</option>
                  <option value="openai">OpenAI</option>
                  <option value="expli">Expli</option>
                </select>
              </div>

              <div className="h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {(() => {
                  let history;
                  let setMessages;
                  let setHistory;

                  if (selectedProvider === "expli") {
                    history = chatHistory;
                    setHistory = setChatHistory;
                    setMessages = setCurrentMessages;
                  }
                  if (selectedProvider === "openai") {
                    history = chatHistoryOpenAI;
                    setHistory = setChatHistoryOpenAI;
                    setMessages = setCurrentMessagesOpenAI;
                  }
                  if (selectedProvider === "gemini") {
                    history = chatHistoryGemini;
                    setHistory = setChatHistoryGemini;
                    setMessages = setCurrentMessagesGemini;
                  }

                  return history && history.length > 0 ? (
                    <div className="space-y-2">
                      {history.map((item, index) => (
                        <div
                          key={index}
                          className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/30 
                              hover:border-minimal-primary/30 rounded-lg p-3 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p
                              onClick={() => setMessages(item.messages)}
                              className="cursor-pointer text-sm text-gray-300 group-hover:text-white 
                                  line-clamp-2 flex-1 transition-colors duration-200 leading-relaxed"
                            >
                              {item.messages[0]?.text}
                            </p>
                            <button
                              onClick={() => {
                                const updatedHistory = history.filter(
                                  (_, i) => i !== index
                                );
                                setHistory(updatedHistory);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 
                                  p-1 rounded transition-all duration-200 hover:bg-red-500/10"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <div className="text-center">
                        <MessageSquare
                          size={24}
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p className="text-sm">No chat history yet</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Available Models Section */}
            <div className="bg-transparent p-4 ">
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                Available Keys
              </h3>
              <div className="space-y-2 max-h-64 ">
                {Object.entries(tools).length > 0 ? (
                  Object.entries(tools).map(([name], index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTool(name)}
                      className="w-full group bg-[#148686] text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="capitalize">{name}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <div className="w-8 h-8 border-2 border-gray-600 rounded-full mx-auto mb-2" />
                    <p className="text-sm">No tools available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section - visible only when expanded */}
      {isOpen && (
        <div className="mb-8 space-y-4">
          <WorkFlowButtonSidebar id={id} />
          <Link to={link}>
            <button
              className="w-full group relative overflow-hidden bg-gradient-to-r from-minimal-primary to-cyan-500 
            hover:from-minimal-primary/90 hover:to-cyan-500/90 text-white font-semibold py-3 px-6 rounded-xl 
            transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-minimal-primary/30
            border border-minimal-primary/20"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 
              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="relative flex items-center justify-center gap-2">
                <span>Learn More</span>
                <ExternalLink
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </div>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ExpliSidebar;
