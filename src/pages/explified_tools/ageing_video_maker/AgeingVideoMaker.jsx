import { Button, Input, Slider, Tooltip } from "@heroui/react";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdArrowBack, MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AgeingVideoMaker = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-5">
      {/* <div className="w-full h-10 absolute top-0 p-4 ">
        <Tooltip content="Back">
          <button
            className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack />
          </button>
        </Tooltip>
      </div> */}
      <div className="text-8xl font-englebert font-bold mb-12">
        Change your Age
      </div>
      <div className="w-[45%] flex flex-row items-end gap-2">
        <Input
          name="videoLink"
          isClearable
          type="text"
          label="Video/Image Url"
          //   value={videoLink}
          //   onChange={handleChange}
          labelPlacement="outside"
          size="lg"
          placeholder="e.g. https://youtube.com/abcd/"
          className="flex-1"
        />
        <label className="h-[62%] flex flex-row items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-xl cursor-pointer">
          <MdOutlineFileUpload className="size-6" />
          Upload Image/Video
          <input
            type="file"
            accept="video/mp4"
            // onChange={handleVideoUpload}
            className="hidden"
          />
        </label>
      </div>
      <Slider
        className="w-[45%]"
        radius="md"
        label="Select the age to convert into"
        size="sm"
      />
      <Button size="lg" color="secondary" className="w-[45%] rounded-md">
        <FaCheckCircle size={18} />
        <span>Generate</span>
      </Button>
    </div>
  );
};

export default AgeingVideoMaker;
