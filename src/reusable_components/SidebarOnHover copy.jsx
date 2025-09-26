import { CirclePlus, MessageSquare, Pin, PinOff, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkFlowButton from "./WorkFlowButton";
import WorkFlowButtonSidebar from "./WorkFlowButtonSidebar";

function SidebarOnHover({
  link,
  toolName,
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
  onOpenChange,
  onAddClick,
  tools = [],
  setCurrentTool = () => {},
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState("expli");
  console.log("chatHistory from sidebar:", chatHistory);

  useEffect(() => {
    if (typeof onOpenChange === "function") {
      onOpenChange(sidebarOpen || sidebarPinned);
    }
  }, [sidebarOpen, sidebarPinned, onOpenChange]);

  return (
    <>
      {" "}
      <div
        className="absolute left-0 top-0 h-full w-6 z-30"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      />
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black backdrop-blur-xl border-r border-minimal-primary/20 
  flex flex-col justify-between transition-all duration-300 z-50
  ${sidebarOpen ? "w-64 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          <div className="border-b border-minimal-primary/20">
            <div className="flex items-center justify-between gap-3 mb-4">
              <p className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-minimal-primary bg-clip-text text-transparent">
                {toolName}
              </p>

              <button
                onClick={() => {
                  setSidebarPinned(!sidebarPinned);
                  setSidebarOpen(true); // Ensure open when pinned
                }}
              >
                {sidebarPinned ? <PinOff size={20} /> : <Pin size={20} />}
              </button>
            </div>

            {id === "ytsummarizer" && (
              <Link to="https://chromewebstore.google.com/detail/vidsum-copilot-for-youtub/jmdecmahfbajaffljohfdlbdmkbngggj">
                <button className="w-full  flex items-center justify-between mb-4 bg-black border-2 border-minimal-primary hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 ">
                  <CirclePlus />
                  View Extension
                </button>
              </Link>
            )}
          </div>
          {/* new chat button */}
          {toolName === "Expli(+)" && (
            <>
              <button
                onClick={onAddClick}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-gray-800/80 to-gray-700/80 
                hover:from-minimal-primary/20 hover:to-cyan-500/20 border border-gray-600/50 hover:border-minimal-primary/50
                text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105 
                hover:shadow-lg hover:shadow-minimal-primary/10"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-r from-minimal-primary/0 to-minimal-primary/10 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="relative flex items-center justify-center gap-3">
                  <MessageSquare size={18} />
                  <span>New Chat</span>
                </div>
              </button>

              <div className="border-b border-minimal-primary/20 mt-2" />
              <div className="h-full">
                {/* chat history */}
                <div className=" h-[250px] ">
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare
                        size={16}
                        className="text-minimal-primary"
                      />
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

                    return (
                      history &&
                      history.length > 0 && (
                        <div className="pt-2 flex flex-col gap-2 overflow-y-auto">
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
                                  className=" text-gray-400 hover:text-red-400 
                                  p-1 rounded transition-all duration-200 hover:bg-red-500/10"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    );
                  })()}
                </div>
                {/* available models */}
                <div className="h-[250px] border-t border-minimal-primary/20 pt-2 overflow-y-auto">
                  <h1 className="text-sm text-gray-500">Available Keys</h1>
                  <div className="flex flex-col gap-2 mt-2">
                    {/* <button className="w-full bg-[#23b5b5] text-gray-300 p-2 rounded-md hover:bg-[#23b5b5]/80 transition-colors text-sm">
                      OpenAI
                    </button>
                    <button className="w-full bg-[#23b5b5] text-gray-300 p-2 rounded-md hover:bg-[#23b5b5]/80 transition-colors text-sm">
                      Gemini
                    </button>
                    <button className="w-full bg-[#23b5b5]   text-gray-300 p-2 rounded-md hover:bg-[#23b5b5]/80 transition-colors text-sm">
                      Grok
                    </button> */}
                    {Object.entries(tools).map(([name], index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTool(name)}
                        className="w-full bg-[#23b5b5] text-gray-300 p-2 rounded-md hover:bg-[#23b5b5]/80 transition-colors text-sm"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom section */}
        <div className="mb-8">
          <WorkFlowButtonSidebar id={id} />
          <Link to={link}>
            <button className="w-full bg-gradient-to-r from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-minimal-primary/25">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default SidebarOnHover;
