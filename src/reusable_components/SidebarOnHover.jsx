import { CirclePlus, Pin, PinOff } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import WorkFlowButton from "./WorkFlowButton";
import WorkFlowButtonSidebar from "./WorkFlowButtonSidebar";

function SidebarOnHover({
  link,
  toolName,
  id,
  chatHistory = [],
  setCurrentMessages,
  onOpenChange,
  onAddClick,
  tools = [],
  setCurrentTool= ()=>{}
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
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
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-minimal-primary/20 
  flex flex-col justify-between transition-all duration-300 z-50
  ${sidebarOpen ? "w-64 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => !sidebarPinned && setSidebarOpen(true)}
        onMouseLeave={() => !sidebarPinned && setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          <div className="border-b border-minimal-primary/20">
            <div className="flex items-center justify-between gap-3 mb-2">
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
          {toolName === "Expli" && (
            <>
              <button
                onClick={onAddClick}
                className=" w-full bg-gray-800 p-2 rounded-md mt-2"
              >
                New Chat
              </button>
              <div className="border-b border-minimal-primary/20 mt-2" />
              <div className="h-full">
                {/* chat history */}
                <div className=" h-[250px] ">
                  <p className="text-gray-500 text-sm mt-2">Chat History</p>
                  {chatHistory && (
                    <div className="  pt-2 flex flex-col gap-2">
                      {chatHistory.map((item, index) => (
                        <p
                          onClick={() => setCurrentMessages(item.messages)}
                          className=" cursor-pointer w-[200px] line-clamp-2 bg-gray-900 text-gray-400 p-2 rounded-md "
                          key={index}
                        >
                          {item.messages[0].text}
                        </p>
                      ))}
                    </div>
                  )}
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
                    {Object.entries(tools).map(([name, key], index) => (
                      <button
                        key={index}
                        onClick={()=> setCurrentTool(name)}
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
