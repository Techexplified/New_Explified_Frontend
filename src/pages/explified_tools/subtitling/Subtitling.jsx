import { Button, Input, Tooltip } from "@heroui/react";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdArrowBack, MdOutlineFileUpload } from "react-icons/md";
import { LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeUser } from "../../../utils/auth_slice/UserSlice";

const Subtitling = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      // Optional: Call your API to handle server-side logout
      // await axiosInstance.get("/api/users/logout");

      // Clear local data
      localStorage.removeItem("explified");
      dispatch(removeUser());

      // Redirect to external site
      window.location.href = "https://explified.com";
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-5">
      {/* <div className="w-full h-10 absolute top-0 p-4 ">
        <Tooltip content="Back">
          <button
            className="rounded-full p-[10px] border-2 border-white hover:bg-gray-200/20 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <MdArrowBack />
          </button>
        </Tooltip>

        <Tooltip content="Logout">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="absolute right-0 p-2 m-3 rounded-full border-none hover:bg-gray-400/20"
          >
            <LogOutIcon />
          </button>
        </Tooltip>
      </div> */}
      <div className="w-[45%] flex flex-row">
        <Input
          name="videoLink"
          isClearable
          type="text"
          label="Add subtitle to short videos."
          //   value={videoLink}
          //   onChange={handleChange}
          labelPlacement="outside-left"
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
            // onChange={handleVideoUpload}
            className="hidden"
          />
        </label>
      </div>
      <Button size="lg" color="secondary" className="w-[45%] rounded-md">
        <FaCheckCircle size={18} />
        <span>Submit</span>
      </Button>
    </div>
  );
};

export default Subtitling;
