import React from "react";
import { useNavigate } from "react-router-dom";

// React Icons
import { MdOutlineGifBox, MdElderlyWoman,  MdEdit, MdFaceRetouchingNatural, MdBusiness } from "react-icons/md";
import { SiGoogledrive, SiGooglecalendar, SiZoom, SiSlack, SiTrello, SiNotion, SiDropbox, SiWhatsapp, SiGoogleanalytics, SiGmail, SiGooglesheets } from "react-icons/si";
import { PiSubtitles } from "react-icons/pi";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { FaYoutube, FaFileAlt, FaVideo, FaProjectDiagram, FaImages, FaLaughSquint, FaPlug, FaBolt, FaPlay, FaImage, FaLink } from "react-icons/fa";
import { AiOutlineLink, AiOutlineFileImage } from "react-icons/ai";

// All Tools Array
const allTools = [
  {
    title: "Youtube Summarizer",
    description: "A YouTube Summarizer quickly turns long videos into short.",
    icon: <FaYoutube />,
    color: "from-teal-500 to-teal-700",
    route: "/youtube-summarizer",
  },
  {
    title: "AI Subtitler",
    description: "Centralized AI Subtitler for your videos",
    icon: <FaFileAlt />,
    color: "from-teal-500 to-teal-700",
    route: "/ai-subtitler",
  },
  {
    title: "Text To Video Generator",
    description: "Generate videos using prompts.",
    icon: <FaVideo />,
    route: "/text-to-video",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Slideshow Maker",
    description: "Create stunning slideshows.",
    icon: <FaProjectDiagram />,
    route: "/presentation",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Bg Remover",
    description: "Remove background from images.",
    icon: <AiOutlineFileImage />,
    route: "/bg-remover",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Image Styler",
    description: "Style your images.",
    icon: <FaImages />,
    route: "/image-styler",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Video Meme Generator AI",
    description: "Turn any clip into a share-worthy meme in seconds with AI.",
    icon: <FaLaughSquint />,
    route: "/video-meme-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Integrations",
    description: "Instantly share across your socials.",
    icon: <FaPlug />,
    route: "/integrations",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Socials",
    description: "One click, everywhere.",
    icon: <FaBolt />,
    route: "/socials",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI GIF Generator",
    description: "Viral GIFs, AI-powered in seconds.",
    icon: <MdOutlineGifBox />,
    route: "/ai-gif-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI Hugging Video Maker",
    description: "Bring warm hugs to life with AI-powered videos.",
    icon: <FaPlay />,
    route: "/ai-hugging-video-maker",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Ageing Video Maker AI",
    description: "See yourself age in seconds with AI-powered videos.",
    icon: <MdElderlyWoman />,
    route: "/ageing-video-maker-ai",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "AI Tattoo Art Generator",
    description: "Design unique tattoo art instantly with AI.",
    icon: <MdEdit />,
    route: "/ai-tattoo-art-generator",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Image To Video AI",
    description: "Transform any image into a stunning video with AI.",
    icon: <FaImage />,
    route: "/image-to-video-ai",
    color: "from-teal-500 to-teal-700",
  },
  {
    title: "Link To Video AI",
    description: "Turn any link into an engaging video with AI.",
    icon: <FaLink />,
    route: "/link-to-video-ai",
    color: "from-teal-500 to-teal-700",
  },
];

const AllApps = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-6">All Apps</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allTools.map((app) => (
          <div
            key={app.title}
            onClick={() => navigate(app.route)}
            className="bg-[#13161a] rounded-xl p-5 cursor-pointer hover:shadow-xl hover:border-[#23b5b5] border border-transparent transition-all flex flex-col"
          >
            <div className="flex items-center gap-3 mb-2">
              {app.icon && (
                <span
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-xl bg-gradient-to-br ${
                    app.color ?? "from-[#23b5b5] to-cyan-600"
                  }`}
                >
                  {app.icon}
                </span>
              )}
              <h3 className="font-semibold text-lg text-white">{app.title}</h3>
            </div>
            <p className="text-gray-400 text-sm flex-1">{app.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllApps;
