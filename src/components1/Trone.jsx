import { FiPlus, FiMic, FiSliders, FiX } from "react-icons/fi";
import { BsSoundwave } from "react-icons/bs";
import { useState } from "react";

function Trone() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // controls sidebar visibility

  return (
    <div className="bg-black text-white flex" style={{ minHeight: 'calc(100vh - 70px)' }}>
      {/* Overlay for mobile */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
          style={{ top: '70px' }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 w-60 bg-stone-900 text-white p-4 space-y-6 transition-transform duration-300 z-40 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ 
          top: '70px', 
          height: 'calc(100vh - 70px)' 
        }}
      >
        {/* Close button */}
        <button
          className="flex items-center gap-2 text-gray-300 hover:text-white"
          onClick={() => setIsDrawerOpen(false)}
        >
          <FiX className="text-xl" />
          Close
        </button>

        {/* Home Section */}
        <div>
          <h2 className="font-bold mb-4">Recent</h2>
          <div className="space-y-3 text-gray-300"></div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600"></div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-start py-4 px-4 mt-[-50px]">
          {!isDrawerOpen && (
            <FiPlus
              className="text-2xl cursor-pointer hover:text-cyan-400"
              onClick={() => setIsDrawerOpen(true)}
            />
          )}
        </div>

        {/* Centered content */}
        <div className="flex flex-col items-center justify-center flex-grow px-4">
          <h1 className="text-3xl md:text-4xl font-semibold mb-6 text-center">
            Ready when you are.
          </h1>

          {/* Input + Icons */}
          <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-2xl shadow-md px-4 py-2">
            <input
              type="text"
              placeholder="Ask anything"
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400 text-sm px-2 py-3"
            />

            <div className="flex items-center justify-between mt-2 text-gray-400">
              {/* Left icons */}
              <div className="flex items-center gap-2">
                <FiSliders className="text-lg" />
                <span className="text-sm">Tools</span>
              </div>

              {/* Right icons */}
              <div className="flex items-center gap-4">
                <FiMic className="text-lg" />
                <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                  <BsSoundwave className="text-base" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trone;