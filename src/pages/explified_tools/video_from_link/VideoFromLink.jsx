import { Button, Input, Textarea, Tooltip } from "@heroui/react";
import React from "react";
import { MdArrowBack } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const VideoFromLink = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="w-full h-10 absolute top-0 p-4 ">
        <Tooltip content="Back">
          <button
            className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack />
          </button>
        </Tooltip>
      </div>
      <div className="text-8xl font-englebert font-bold mb-12">
        Generate Video
      </div>
      <div className="relative p-4 w-[50rem]">
        <Textarea
          isClearable
          placeholder="Type your prompt or paste an link to generate a beautiful video"
          minRows={8}
          classNames={{
            base: "w-full",
          }}
        />
        <div className="absolute bottom-6 right-6">
          <Button
            size="sm"
            color="secondary"
            className="rounded-md text-sm flex items-center justify-center font-light font-pacifico"
          >
            <RiAiGenerate className="mr-1" /> <span>Generate Video</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoFromLink;
