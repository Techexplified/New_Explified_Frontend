import { Outlet } from "react-router-dom";
import Header from "../../../reusable_components/Header";
import Sidebar from "../../dashboard/Sidebar";
import { BsGrid } from "react-icons/bs";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { X } from "lucide-react";

const tools = [
  { id: 1, name: "Youtube Summarizer", icon: <FaYoutube /> },
  { id: 2, name: "Tool2", icon: <FaYoutube /> },
  { id: 3, name: "Tool3", icon: <FaYoutube /> },
  { id: 4, name: "Tool4", icon: <FaYoutube /> },
  { id: 5, name: "Tool5", icon: <FaYoutube /> },
  { id: 6, name: "Tool6", icon: <FaYoutube /> },
  { id: 7, name: "Tool7", icon: <FaYoutube /> },
  { id: 8, name: "Tool8", icon: <FaYoutube /> },
  { id: 9, name: "Tool9", icon: <FaYoutube /> },
];
const YoutubeSummarizer = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleToolClick = (tool) => {
    if (!selected.some((t) => t.id === tool.id)) {
      setSelected((prev) => [...prev, tool]);
    }
    setDropdownOpen(false);
  };

  const removeTool = (id) => {
    setSelected(selected.filter((t) => t.id !== id));
  };

  return (
    <>
      <Header index={0} />
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="grid grid-cols-[auto_1fr] pt-20 h-screen">
          {/* sidebar section */}
          <div className="w-20 md:w-40 bg-black p-2 border-r border-gray-700 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-[#1e1e1e] rounded-md text-center py-4 text-xs text-white border border-gray-500"
              >
                <div className="text-sm font-bold">Section</div>
                <div>Tool Name</div>
                <div>Description</div>
              </div>
            ))}

            {selected &&
              selected.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-[#23b5b5]  rounded-md px-3 py-2 flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    <span>{tool.icon}</span>
                    <span>{tool.name}</span>
                  </span>
                  <button onClick={() => removeTool(tool.id)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

            {/* Explore Tools Label */}
            <div onClick={toggleDropdown} className="flex items-center gap-2">
              <div className="bg-gray-900 p-2 rounded-md">
                <BsGrid />
              </div>
              <span>Explore Tools</span>
            </div>

            {dropdownOpen && (
              <div className="absolute bottom-0 left-40 bg-gray-900 border border-gray-700 rounded-lg p-4 grid grid-cols-3 gap-4 z-10">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className="w-16 h-16 bg-gray-800  hover:bg-gray-700 rounded-xl flex flex-col items-center justify-center text-white"
                  >
                    <div className="text-2xl">{tool.icon}</div>
                    <div className="text-[10px] truncate">{tool.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* main section */}
          <main className="flex-1 flex flex-col justify-between p-8 h-full">
            <h1 className="text-4xl font-semibold text-center mb-6">
              Youtube Video Name
            </h1>
            <hr className="border-gray-600 mb-10" />

            {[...Array(2)].map((_, i) => (
              <div key={i} className="mb-10">
                <div className="bg-white text-black rounded-3xl py-4 text-center text-2xl font-medium shadow-md">
                  Video Summary
                </div>
                <div className="mt-3 flex justify-end">
                  <span className="bg-red-500 text-white text-sm px-4 py-2 rounded-full">
                    Time Stamps: 1:10 sec
                  </span>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </>
  );
};

export default YoutubeSummarizer;
