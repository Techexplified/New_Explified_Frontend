import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const AIImageStyler = () => {
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
      <div className="w-[50%] flex flex-col gap-8">
        <h1 className="text-7xl text-center font-englebert font-bold">
          AI Image Styler
        </h1>

        <div className="h-80 relative">
          <img
            src="/image-styler.jpg"
            alt="image"
            className="h-full w-full object-cover"
          />

          <div className="absolute top-0 bottom-0 right-0 bg-amber-500 z-10 w-[50%] opacity-50"></div>
        </div>

        <form className=" space-y-4">
          <input
            type="file"
            required
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border border-gray-300 rounded-md w-full"
          />

          {image && (
            <div>
              <img
                src={image}
                alt="image"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <button className="rounded-md w-full py-3 bg-purple-500">
            Style Your Image
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIImageStyler;
