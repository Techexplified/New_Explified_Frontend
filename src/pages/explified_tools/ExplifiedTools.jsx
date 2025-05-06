import { Link, useNavigate } from "react-router-dom";
import { RiCompassDiscoverLine } from "react-icons/ri";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlineCreateNewFolder, MdOutlineSubtitles } from "react-icons/md";
import { ExplifiedLogo } from "../../assets";
import { FaPaperclip } from "react-icons/fa6";
import { PiScribbleLoopBold, PiSelectionBackgroundBold } from "react-icons/pi";

const tools = [
  { name: "Clipper", path: "/clipper", icon: <FaPaperclip size={25} /> },
  {
    name: "Subtitling",
    path: "/subtitling",
    icon: <MdOutlineSubtitles size={30} />,
  },
  {
    name: "Scribble",
    path: "/scribble",
    icon: <PiScribbleLoopBold size={30} />,
  },
  {
    name: "Background Remover",
    path: "/remove-bg",
    icon: <PiSelectionBackgroundBold size={30} />,
  },
  {
    name: "Image Cartoonizer",
    path: "/image-cartoonizer",
    icon: <FaPaperclip />,
  },
  { name: "Image To Video", path: "/image-to-video", icon: <FaPaperclip /> },
  { name: "Text To Image", path: "/text-to-image", icon: <FaPaperclip /> },
  { name: "Text To Video", path: "/text-to-video", icon: <FaPaperclip /> },
  { name: "AI Image Styler", path: "/ai-image-styler", icon: <FaPaperclip /> },
  { name: "Gif generator", path: "/gif-generator", icon: <FaPaperclip /> },
  { name: "Video Generator", path: "/video-generator", icon: <FaPaperclip /> },
  { name: "Slideshow Generator", path: "/slideshow", icon: <FaPaperclip /> },
  { name: "Ageing Ai", path: "/ageing_ai", icon: <FaPaperclip /> },
];

const ExplifiedTools = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex gap-6 fixed w-screen p-4 border-b border-gray-700">
        <Link to="/">
          <div class="flex items-center gap-3">
            <img class="h-10" alt="Logo" src={ExplifiedLogo} />
            <h1 class="text-2xl font-semibold text-white">Explified</h1>
          </div>
        </Link>
        <div className="flex gap-4 ml-52">
          <button className="bg-[#23b5b5] text-white px-6 py-1 rounded">
            Create
          </button>
          <button className="bg-white text-black px-6 py-1 rounded">
            Publish
          </button>
          <button className="bg-white text-black px-6 py-1 rounded">
            Grow
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[auto_1fr] pt-20 h-screen">
        <div className="flex h-full overflow-y-auto gap-4 text-white border-r border-gray-700 p-4 ">
          <div>
            <div className="flex flex-col items-center w-full space-y-8 text-sm font-semibold">
              <div className="flex flex-col items-center justify-center rounded-xl ">
                <IoCreateOutline size={30} />
                <span className="text-white text-xs text-center">Create</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl ">
                <MdOutlineCreateNewFolder size={30} />
                <span className="text-white text-xs text-center">
                  Your Creations
                </span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl ">
                <RiCompassDiscoverLine size={30} />
                <span className="text-white text-xs text-center">Discover</span>
              </div>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Search Tool....."
              className="w-full p-2 rounded bg-white text-black placeholder-gray-500"
            />
            <div className="mt-6 grid grid-cols-2 gap-2">
              {tools.map((tool, i) => (
                <div
                  key={i}
                  onClick={() => navigate(tool.path)}
                  className=" flex flex-col gap-2 items-center text-center bg-gray-800 px-2 py-4 rounded w-28 cursor-pointer hover:bg-[#23b5b5]"
                >
                  <span>{tool.icon}</span>
                  <p className="font-semibold text-sm ">{tool.name}</p>
                  {/* <p className="text-xs">Tool Description</p> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col justify-between p-8 h-full">
          <h2>Dashboard</h2>
          <div className="text-center my-12">
            <h1 className="text-3xl font-bold mb-2">
              What are you looking for ?
            </h1>
            <p>Some Tagline or Description</p>
          </div>

          <div className="space-y-4 ">
            <h1>Suggested Tool</h1>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <button
                  key={i}
                  className="bg-gray-800 p-3 rounded text-center text-sm"
                >
                  Any Tool Name/Topic Suggestions
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Write your prompt here..."
              className="w-full p-3 bg-gray-800 rounded text-white placeholder-gray-400"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExplifiedTools;
