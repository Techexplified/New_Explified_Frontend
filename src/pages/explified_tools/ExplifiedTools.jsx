import { Tooltip } from "@heroui/react";
import React, { useState } from "react";
import axiosInstance from "../../network/axiosInstance";
import { removeUser } from "../../utils/auth_slice/UserSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOutIcon } from "lucide-react";

const ExplifiedTools = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Optional: Call your API to handle server-side logout
      // await axiosInstance.get("/api/users/logout");

      // Clear local data
      localStorage.removeItem("explified");
      dispatch(removeUser());

      // Redirect to external site
      window.location.href = "https://explified.com";
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tools = [
    { name: "Clipper", path: "/clipper" },
    { name: "Subtitling", path: "/subtitling" },
    { name: "Scribble", path: "/scribble" },
    { name: "Background Remover", path: "/remove-bg" },
    { name: "Image Cartoonizer", path: "/image-cartoonizer" },
    { name: "Image To Video", path: "/image-to-video" },
    { name: "Text To Video", path: "/text-to-video" },
    { name: "AI Image Styler", path: "/ai-image-styler" },
    { name: "Gif generator", path: "/gif-generator" },
    { name: "Video Generator", path: "/video-generator" },
    { name: "Slideshow Generator", path: "/slideshow" },
    { name: "Ageing Ai", path: "/ageing_ai" },
  ];

  return (
    <div>
      <Tooltip content="Logout">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="absolute right-0 p-2 m-3 rounded-full border-none hover:bg-gray-400/20"
        >
          <LogOutIcon />
        </button>
      </Tooltip>
      <div className="w-full flex flex-col items-center justify-center gap-5 py-20">
        <div className="text-8xl font-teko">Explore our Tools</div>
        <div className="grid grid-cols-3 gap-2 w-1/2 text-xl font-pacifico">
          {tools.map(({ name, path }) => (
            <div
              key={name}
              className="w-full h-full aspect-square flex items-center justify-center bg-zinc-700/30 hover:text-primary rounded-lg hover:scale-95 transition-all duration-150 cursor-pointer"
              onClick={() => navigate(path)}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplifiedTools;
