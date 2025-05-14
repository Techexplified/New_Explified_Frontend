import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { MdArrowBack, MdOutlineFileDownload } from "react-icons/md";
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
          Convert Image To Video AI
        </h1>

        <form className="flex gap-2">
          <input
            type="file"
            required
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          />
          <button className="rounded-md py-3 px-10 bg-[#23b5b5]">
            Generate
          </button>
        </form>
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
            What once was a frozen frame now breathes, moves, and tells a story.
            With image-to-video AI, a single photo transforms into flowing
            motion— expressing mood, narrative, and emotion beyond the static.
            It's not just a picture anymore. It’s a moment unfolding.
          </p>
        </div>
        <div className="col-span-2 p-8">
          <div className="p-2 bg-white rounded-md">
            <video src="/aivideo.mp4" autoPlay={true} muted={true} loop></video>
          </div>
        </div>
        <div className="col-span-2 p-8 order-2 md:order-[0]">
          <div className="p-2 bg-white rounded-md">
            <video
              src="/image-to-video-1.mp4"
              autoPlay={true}
              muted={true}
              loop
            ></video>
          </div>
        </div>
        <div className="col-span-3 p-8 flex items-center justify-center">
          <p className="text-xl leading-relaxed">
            Watch your vision evolve from a quiet image to a dynamic scene.
            Whether it’s a portrait, landscape, or abstract art—Image-to-Video
            AI transforms imagination into cinematic motion. Because every image
            deserves to move like it means something.
          </p>
        </div>
      </div>
    </div>
    // <div className="w-full h-screen flex flex-row items-center justify-center">
    //   <div className="w-full h-10 absolute top-0 p-4 ">
    //     <Tooltip content="Back">
    //       <button
    //         className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
    //         onClick={() => navigate(-1)}
    //       >
    //         <MdArrowBack />
    //       </button>
    //     </Tooltip>
    //   </div>
    //   <div className="w-1/2 flex flex-col gap-8">
    //     <h1 className="text-8xl text-center font-englebert font-bold">
    //       Image to Video AI
    //     </h1>

    //     <div className="grid grid-cols-2 justify-center items-center gap-10 ">
    //       <div className="h-48">
    //         <img
    //           src="/aiimage.jpg"
    //           alt="image"
    //           className="h-full w-full object-cover rounded-md"
    //         />
    //       </div>
    //       <div>
    //         <video src="/aivideo.mp4" autoPlay={true} muted={true} loop></video>
    //       </div>
    //     </div>

    //     <form className="space-y-2">
    //       <input
    //         type="file"
    //         required
    //         accept="image/*"
    //         onChange={handleImageChange}
    //         className="p-2 border border-gray-300 rounded-md w-full"
    //       />

    //       <button className="rounded-md w-full py-3 bg-purple-500">
    //         Generate Video
    //       </button>
    //     </form>

    //     <div className="grid grid-cols-3 gap-10">
    //       <video
    //         src="/image-to-video-1.mp4"
    //         autoPlay={true}
    //         muted={true}
    //         loop
    //       ></video>

    //       <video
    //         src="/image-to-video-3.mp4"
    //         autoPlay={true}
    //         muted={true}
    //         loop
    //       ></video>

    //       <video
    //         src="/image-to-video-2.mp4"
    //         autoPlay={true}
    //         muted={true}
    //         loop
    //       ></video>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ImageToVideoConvertor;
