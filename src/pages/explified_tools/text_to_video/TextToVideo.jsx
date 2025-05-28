import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const TextToVideo = () => {
  const [text, setText] = useState("");
  const handleSubmit = () => {};
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-row justify-center items-center">
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
      <div className="w-1/2 flex flex-col gap-8">
        <h1 className="text-7xl text-center font-englebert font-bold">
          Generate Video From Text
        </h1>

        <form className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="text">Enter Text Below :</label>
            <textarea
              name="text"
              id="text"
              rows={5}
              placeholder="Enter text..."
              className="border border-gray-100 rounded-md px-4 py-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={handleSubmit}
            className="rounded-md w-full py-3 bg-purple-500"
          >
            Generate video
          </button>
        </form>

        <div className="grid grid-cols-3 gap-6">
          <div className="h-48">
            <img
              src="/images/brand_design.jpg"
              alt="image"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="h-48">
            <img
              src="/images/content_creator.png"
              alt="image"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="h-48">
            <img
              src="/images/ui_ux.png"
              alt="image"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToVideo;
