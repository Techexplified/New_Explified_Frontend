import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ImageToVideoConvertor = () => {
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center">
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
        <h1 className="text-8xl text-center font-englebert font-bold">
          Image to Video AI
        </h1>

        <div className="grid grid-cols-2 justify-center items-center gap-10 ">
          <div className="h-48">
            <img
              src="/aiimage.jpg"
              alt="image"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div>
            <video src="/aivideo.mp4" autoPlay={true} muted={true} loop></video>
          </div>
        </div>

        <form className="space-y-2">
          <input
            type="file"
            required
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          />

          <button className="rounded-md w-full py-3 bg-purple-500">
            Generate Video
          </button>
        </form>

        <div className="grid grid-cols-3 gap-10">
          <video
            src="/image-to-video-1.mp4"
            autoPlay={true}
            muted={true}
            loop
          ></video>

          <video
            src="/image-to-video-3.mp4"
            autoPlay={true}
            muted={true}
            loop
          ></video>

          <video
            src="/image-to-video-2.mp4"
            autoPlay={true}
            muted={true}
            loop
          ></video>
        </div>
      </div>
    </div>
  );
};

export default ImageToVideoConvertor;
