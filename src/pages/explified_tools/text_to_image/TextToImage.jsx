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
    <div className="p-10 space-y-10">
      {/* Tooltip */}
      <div className="h-10 absolute top-4">
        <Tooltip content="Back">
          <button
            className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack />
          </button>
        </Tooltip>
      </div>

      {/* form div */}
      <div className="max-w-3xl mx-auto flex flex-col justify-center gap-8">
        <h1 className="text-4xl text-center font-bold">
          Imagine AI Art Generator
        </h1>

        <form className="flex gap-2">
          <textarea
            name="text"
            rows={1}
            placeholder="Enter text..."
            className="border border-gray-100 w-full rounded-md px-4 py-2"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-md py-3 px-10 bg-[#23b5b5]"
            >
              Create
            </button>
          </div>
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
      </div>

      {/* collage image */}
      <div className="grid grid-cols-4 gap-2 p-2">
        <div>
          <img
            src="/images/aitiger.jpg"
            alt="ai"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <img
            src="/images/aigirl.jpg"
            alt="ai"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="row-span-2">
          <img
            src="/images/ai-robot.avif"
            alt="ai"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="row-span-2">
          <img
            src="/images/reading.jpg"
            alt="ai"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <img
            src="/images/aitree.jpg"
            alt="ai"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <img
            src="/images/aihorse.jpg"
            alt="ai"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* grid box */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
        <div className="col-span-3 p-8 flex items-center justify-center">
          <p className="text-xl leading-relaxed">
            With the power of immersive VR, your hands are no longer bound by
            reality. Interact with art, emotion, and energy like never before.
            Whether you're creating, exploring, or expressing—this is where your
            digital presence feels human.
          </p>
        </div>
        <div className="col-span-2 p-8">
          <div className="p-2 bg-white rounded-md">
            <img
              src="/images/aiperson.jpg"
              alt="image"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        <div className="col-span-2 p-8 order-2 md:order-[0]">
          <div className="p-2 bg-white rounded-md">
            <img
              src="/images/airobot.jpg"
              alt="image"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        </div>
        <div className="col-span-3 p-8 flex items-center justify-center">
          <p className="text-xl leading-relaxed">
            A surreal fusion of identity and virtuality. With a VR headset,
            become more than human—experience a dimension where fantasy,
            creativity, and consciousness collide. This is not just tech. It's a
            portal to your mind’s most abstract realms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default TextToImage;
