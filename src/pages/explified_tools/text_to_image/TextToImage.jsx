import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { MdArrowBack, MdOutlineFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../network/axiosInstance";

function TextToImage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        "api/textToImage",
        { prompt },
        {
          withCredentials: true,
        }
      );
      console.log(res.data.data);
      setImage(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-row justify-center items-center">
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
      <div className="w-1/2 flex flex-col gap-8">
        <h1 className="text-7xl text-center font-englebert font-bold">
          Generate Image From Text
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
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="rounded-md w-full py-3 bg-purple-500"
          >
            Generate Image
          </button>
        </form>

        {image && (
          <>
            <div className="w-[50%]">
              <img
                src={image}
                alt="image"
                className="h-full w-full object-cover"
              />
            </div>
            <a href={image} download={`image.png`}>
              <button className="rounded-md py-3 px-6 bg-purple-500 flex gap-2 items-center">
                <MdOutlineFileDownload className="size-6" />
                Download
              </button>
            </a>
          </>
        )}

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
}

export default TextToImage;
