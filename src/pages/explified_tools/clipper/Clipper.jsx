import { Button, Input, Tooltip } from "@heroui/react";
import { ArrowBigLeftIcon } from "lucide-react";
import React, { useState } from "react";
import { MdArrowBack, MdOutlineFileUpload } from "react-icons/md";
import { RiAiGenerate } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Clipper = () => {
  const [videoLink, setVideoLink] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVideoLink(e.target.value);
  };

  const handleVideoUpload = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const options = ["Sad", "Shock", "Wow", "Happy"];

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
      <div className="w-[45%] flex flex-col justify-center items-center gap-4">
        {/* Video Link & Upload Section */}
        <div className="w-full flex flex-row items-end gap-4">
          <Input
            name="videoLink"
            isClearable
            type="text"
            label="Video Link"
            value={videoLink}
            onChange={handleChange}
            labelPlacement="outside"
            size="lg"
            placeholder="Enter YouTube Video URL e.g., (https://youtube.com/abcd/)"
            className="flex-1"
          />

          <label className="flex flex-row items-center justify-center gap-2 bg-blue-500 text-white p-3 rounded-lg cursor-pointer">
            <MdOutlineFileUpload className="size-6" />
            Upload Video
            <input
              type="file"
              accept="video/mp4"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Input Fields Section */}
        <div className="w-full flex flex-col gap-4">
          {[
            {
              label: "Target Audience",
              name: "audience",
              placeholder: "Enter target audience",
            },
            {
              label: "Vision",
              name: "vision",
              placeholder: "Enter the aim of the video",
            },
            {
              label: "Competitors",
              name: "competitors",
              placeholder: "Enter competitor names",
            },
            {
              label: "Additional Instructions",
              name: "instructions",
              placeholder: "Enter instructions for the video",
            },
          ].map(({ label, name, placeholder }) => (
            <div key={name} className="w-full flex flex-row items-center gap-4">
              <span className="text-white text-md w-40">{label}</span>
              <Input
                name={name}
                isClearable
                type="text"
                size="lg"
                placeholder={placeholder}
                className="flex-1 rounded-md"
              />
            </div>
          ))}

          {/* Select Emotion Field */}
          <div className="w-full flex flex-row items-center gap-4">
            <span className="text-white text-md w-40">Select Emotion</span>
            <div className="relative flex-1">
              <button
                className="w-full bg-zinc-800 text-zinc-400 p-3 rounded-md flex justify-between items-center"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedOption}
                <span className="ml-2">&#9662;</span> {/* Down Arrow */}
              </button>
              {isDropdownOpen && (
                <ul className="absolute left-0 w-full bg-zinc-900 shadow-md rounded-md mt-1 max-h-40 overflow-y-auto z-20">
                  {options.map((option, index) => (
                    <li
                      key={index}
                      className="p-3 cursor-pointer hover:bg-zinc-500"
                      onClick={() => {
                        setSelectedOption(option);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <Button size="lg" color="secondary" className="w-full rounded-md">
          <RiAiGenerate size={18} />
          <span>Generate Shorts</span>
        </Button>
      </div>
    </div>
  );
};

export default Clipper;
