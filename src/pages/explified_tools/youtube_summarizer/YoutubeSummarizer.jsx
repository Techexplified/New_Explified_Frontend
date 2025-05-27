import { Link, Outlet } from "react-router-dom";
import Header from "../../../reusable_components/Header";
import Sidebar from "../../dashboard/Sidebar";
import { BsGrid } from "react-icons/bs";
import { useState } from "react";
import { FaYoutube } from "react-icons/fa6";
import { X } from "lucide-react";
import axiosInstance from "../../../network/axiosInstance";
import { ExplifiedLogo } from "../../../assets";

const tools = [
  { id: 1, name: "Youtube", icon: <FaYoutube /> },
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
  const [selected, setSelected] = useState([
    { id: 1, name: "Youtube", icon: <FaYoutube /> },
  ]);

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumelit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumelit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumQuod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsumLorem ipsum dolor sit amet consectetur adipisicing elit. Quod quidem debitis rem, voluptate eos aperiam veritatis possimus error ullam sunt eum tempora at in aliquam ab inventore sit laudantium ipsum"
  );

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

  const getTranscript = async () => {
    if (!videoUrl) return;

    setLoading(true);
    setSummary("");

    try {
      const response = await axiosInstance.post("api/ytSummarize/summary", {
        videoUrl,
      });
      console.log(response);
      let content = response.data?.content;
      content = content.replaceAll("&amp;#39;", "'");

      setSummary(content || "No summary found.");
      setVideoUrl("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Header index={0} /> */}
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="grid grid-cols-[auto_1fr] h-screen">
          {/* sidebar section */}
          <div className="w-20 md:w-44 h-screen fixed z-20 bg-black p-2 px-4 border-r border-gray-700 space-y-4">
            <Link to="/">
              <div className="flex items-center gap-3">
                <img className="h-8" alt="Logo" src={ExplifiedLogo} />
                <h1 className="text-xl font-semibold text-white">Explified</h1>
              </div>
            </Link>
            {selected &&
              selected.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-[#23b5b5] rounded-md px-3 py-2 flex justify-between items-center"
                >
                  <span className="flex items-center gap-2">
                    <span>{tool.icon}</span>
                    <span>{tool.name}</span>
                  </span>
                  <button onClick={() => removeTool(tool.id)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}{" "}
            {/* Explore Tools Label */}
            <div
              onClick={toggleDropdown}
              className="flex items-center pt-4 gap-2"
            >
              <div className="bg-gray-900 p-2 rounded-md">
                <BsGrid />
              </div>
              <span>Explore</span>
            </div>
            {dropdownOpen && (
              <div className="absolute left-44 w-[300px] bg-gray-900 border border-gray-700 rounded-lg p-4 grid grid-cols-3 gap-4 z-10">
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
          <div className="w-20 md:w-40"></div>
          {/* main section */}
          <main className="flex-1 flex flex-col p-8 pt-12 relative">
            <h1 className="text-4xl font-semibold text-center mb-6">
              Summarize YouTube Videos
            </h1>

            {/* Scrollable summary section */}
            <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
              {summary}
            </div>

            {/* Fixed input at bottom */}
            <div className="fixed bottom-0 left-20 md:left-44 right-0 bg-black z-10">
              <div className="max-w-4xl mx-auto w-full p-4 flex gap-4 items-center">
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Enter YouTube URL"
                  className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
                />
                <button
                  onClick={getTranscript}
                  disabled={loading}
                  className="px-6 py-3 bg-[#23b5b5] rounded-lg font-semibold flex items-center gap-2 transition"
                >
                  {loading ? "Summarizing" : "Summarize"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default YoutubeSummarizer;
