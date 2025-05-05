import { Tooltip } from "@heroui/react";
import { useState } from "react";
import { MdArrowBack, MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const RemoveBackground = () => {
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
    <div className="w-full h-screen flex flex-col justify-center items-center gap-5">
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
      <form className="w-[60%] flex gap-4 justify-between">
        <input
          type="file"
          required
          accept="image/*"
          onChange={handleImageChange}
          className="p-2 border border-gray-300 rounded-md flex-1"
        />
        <button className="flex items-center justify-center gap-2 bg-blue-500 rounded-md px-6 py-3">
          <MdOutlineFileUpload className="size-6" />
          Upload Image
        </button>
      </form>

      {image && (
        <div>
          <img src={image} alt="image" className="h-full w-full object-cover" />
        </div>
      )}

      <button className="w-[60%] rounded-md py-3 bg-purple-500">
        Remove Background
      </button>
    </div>
  );
};

export default RemoveBackground;
