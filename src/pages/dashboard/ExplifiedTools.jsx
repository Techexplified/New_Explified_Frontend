import { useNavigate } from "react-router-dom";
import { RiFileGifLine } from "react-icons/ri";
import { IoMdImages } from "react-icons/io";
import { FaPaperclip } from "react-icons/fa6";
import {
  MdElderlyWoman,
  MdFaceRetouchingNatural,
  MdOutlineSubtitles,
  MdOutlineVideocam,
} from "react-icons/md";
import {
  PiScribbleLoopBold,
  PiSelectionBackgroundBold,
  PiSlideshow,
} from "react-icons/pi";

const tools = [
  { name: "Clipper", path: "clipper", icon: <FaPaperclip size={25} /> },
  {
    name: "Subtitling",
    path: "subtitling",
    icon: <MdOutlineSubtitles size={30} />,
  },
  {
    name: "Scribble",
    path: "scribble",
    icon: <PiScribbleLoopBold size={30} />,
  },
  {
    name: "Background Remover",
    path: "remove-bg",
    icon: <PiSelectionBackgroundBold size={30} />,
  },
  {
    name: "Image Cartoonizer",
    path: "image-cartoonizer",
    icon: <FaPaperclip />,
  },
  { name: "Image To Video", path: "image-to-video", icon: <FaPaperclip /> },
  {
    name: "Text To Image",
    path: "text-to-image",
    icon: <IoMdImages size={30} />,
  },
  {
    name: "Text To Video",
    path: "text-to-video",
    icon: <MdOutlineVideocam size={30} />,
  },
  {
    name: "AI Image Styler",
    path: "ai-image-styler",
    icon: <MdFaceRetouchingNatural size={30} />,
  },
  {
    name: "Gif generator",
    path: "gif-generator",
    icon: <RiFileGifLine size={30} />,
  },
  {
    name: "Video Generator",
    path: "video-generator",
    icon: <MdOutlineVideocam size={30} />,
  },
  {
    name: "Slideshow Generator",
    path: "slideshow",
    icon: <PiSlideshow size={30} />,
  },
  { name: "Ageing Ai", path: "ageing_ai", icon: <MdElderlyWoman size={30} /> },
];

function ExplifiedTools() {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-2">
      {tools.map((tool, i) => (
        <div
          key={i}
          onClick={() => navigate(tool.path)}
          className=" flex flex-col gap-2 items-center text-center bg-gray-800 px-2 py-4 rounded w-28 cursor-pointer hover:bg-[#23b5b5]"
        >
          <span>{tool.icon}</span>
          <p className="font-semibold text-sm ">{tool.name}</p>
        </div>
      ))}
    </div>
  );
}

export default ExplifiedTools;
