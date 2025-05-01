import { Tooltip } from "@heroui/react";
import { useState } from "react";
import {
  MdArrowBack,
  MdOutlineFileDownload,
  MdOutlineFileUpload,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../network/axiosInstance";

const styles = [
  "jpcartoon",
  "anime",
  "claborate",
  "hongkong",
  "comic",
  "animation3d",
  "handdrawn",
  "sketch",
  "full",
  "artstyle",
  "classic_cartoon",
  "hkcartoon",
];

function ImageCartoonizer() {
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [cartoonImage, setCartoonImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(file);
      setPreviewImage(imageUrl);
    }
  };

  // const handleCartoonizer = async (e) => {
  //   e.preventDefault();
  //   if (!image) return;

  //   try {
  //     const data = new FormData();
  //     data.append("image", image);
  //     data.append("type", type);

  //     const options = {
  //       origin: "https://explified-home.web.app",
  //       method: "POST",
  //       url: "https://cartoon-yourself.p.rapidapi.com/facebody/api/portrait-animation/portrait-animation",
  //       headers: {
  //         "x-rapidapi-key":
  //           "7897065645msh7a9041d1c39bd72p10e7f3jsnd545f5b9822b",
  //         "x-rapidapi-host": "cartoon-yourself.p.rapidapi.com",
  //       },
  //       data: data,
  //     };

  //     const response = await axios.request(options);
  //     console.log(response.data);
  //     console.log(response.data.data.image_url);
  //     setCartoonImage(response.data.data.image_url);
  //   } catch (err) {
  //     console.error(err);
  //     setLoading(false);
  //   }
  // };

  const handleCartoonizer = async (e) => {
    e.preventDefault();
    if (!image) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("type", type);

      const res = await axiosInstance.post("api/imageCartoonizer", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      console.log(res.data);
      setCartoonImage(res?.data?.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(cartoonImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "cartoon-image.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image", error);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 mt-10">
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
      <div className="w-[50%] flex flex-col justify-center items-center gap-16 mb-10">
        <h1 className="text-7xl text-center font-pacifico">
          Image Cartoonizer
        </h1>

        <div className="w-full flex flex-row gap-12 justify-between items-center">
          <div className="h-56 w-full">
            <img
              src="/images/cartoon1.webp"
              alt="image"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="h-56 w-full">
            <img
              src="/images/cartoon3.webp"
              alt="image"
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        </div>
      </div>

      <form className="w-[50%] space-y-4">
        <div className="w-full flex gap-4">
          <input
            type="file"
            id="userimage"
            required
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="userimage"
            className="flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-md w-full"
          >
            Upload Image <MdOutlineFileUpload className="size-6" />
          </label>
          <select
            name="type"
            id="type"
            required
            className="border border-gray-300 rounded-md px-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Style</option>
            {styles.map((style) => (
              <option key={style} value={style} className="capitalize">
                {style}
              </option>
            ))}
          </select>
        </div>

        {previewImage && (
          <>
            <div className="w-full">
              <img
                src={previewImage}
                alt="image"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="submit"
              onClick={handleCartoonizer}
              className="rounded-md w-full py-3 bg-purple-500"
            >
              {loading ? "Processing..." : "Cartoonify"}
            </button>
          </>
        )}
      </form>

      {cartoonImage && (
        <>
          <div className="w-[50%]">
            <img
              src={cartoonImage}
              alt="image"
              className="h-full w-full object-cover"
            />
          </div>
          <button
            onClick={downloadImage}
            className="rounded-md py-3 px-6 bg-purple-500 flex gap-2 items-center"
          >
            <MdOutlineFileDownload className="size-6" />
            Download
          </button>
        </>
      )}
    </div>
  );
}

export default ImageCartoonizer;
