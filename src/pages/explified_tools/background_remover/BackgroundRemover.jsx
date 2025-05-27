import { Tooltip } from "@heroui/react";
import { useState } from "react";
import {
  MdArrowBack,
  MdOutlineFileDownload,
  MdOutlineFileUpload,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../network/axiosInstance";

const RemoveBackground = () => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [imageBg, setImageBg] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1]; // Remove the data:image/...;base64, part
        setImage(base64String);
        setPreviewImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleBgRemoval = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "api/bgRemover/",
        { image },
        {
          withCredentials: true,
        }
      );

      console.log(res.data);
      setImageBg(res?.data?.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };


  
  console.log(imageBg);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-5 mt-10">
      {/* <div className="w-full h-10 absolute top-0 p-4 "> */}
        {/* <Tooltip content="Back">
          <button
            className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            <MdArrowBack />
          </button>
        </Tooltip> */}
      {/* </div> */}
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

      {previewImage && (
        <div className="h-full w-[50%] mx-auto">
          <img
            src={previewImage}
            alt="image"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <button
        disabled={loading}
        className="w-[60%] rounded-md py-3 bg-purple-500"
        onClick={handleBgRemoval}
      >
        Remove Background
      </button>

      {imageBg && (
        <>
          <div className="h-full w-[50%] mx-auto">
            <img
              src={`data:image/png;base64,${imageBg}`}
              alt="image"
              className="h-full w-full object-cover"
            />
          </div>

          <a
            href={`data:image/png;base64,${imageBg}`}
            download="bgremoded-image.png"
          >
            <button className="rounded-md py-3 px-6 bg-purple-500 flex gap-2 items-center">
              <MdOutlineFileDownload className="size-6" />
              Download
            </button>
          </a>
        </>
      )}
    </div>
  );
};

export default RemoveBackground;
