import React from "react";
import { IoArrowBack } from "react-icons/io5";
import * as images from "../assets/index";
import { Link } from "react-router-dom";
import { ExplifiedLogo } from "../assets";

const Header = (props) => {
  const { index } = props;

  const nav_menu = [
    {
      title: "Create",
      path: "/",
    },
    {
      title: "Publish",
      path: "/publish",
    },
    {
      title: "Grow",
      path: "/grow",
    },
  ];

  return (
    <div className="header bg-black w-full h-fit py-2 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center px-1 fixed">
      <div className="w-full flex sm:justify-start justify-between gap-5 relative">
        {/* <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl text-xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'> </button> */}
        <Link to="/">
          <div className="flex items-center gap-3">
            <img className="h-10" alt="Logo" src={ExplifiedLogo} />
            <h1 className="text-2xl font-semibold text-white">Explified</h1>
          </div>
        </Link>
        {nav_menu.map((e, i) => (
          <Link
            to={e.path}
            className={` ${
              i == index ? "bg-[#23b5b5] text-white" : "bg-white text-black"
            } sm:py-2 sm:px-5 py-2 px-3  rounded transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white`}
          >
            {e.title}
          </Link>
        ))}
      </div>
      <div className="w-full flex sm:justify-end justify-center px-2">
        <button
          className="bg-white text-black sm:py-2 sm:px-5 py-1 px-3 rounded-full transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white"
          onClick={() => {
            console.log("clicked");
          }}
        >
          <div className="flex gap-1 items-center">
            <img className="w-[20px] h-[20px]" src={images.chromeIcon} alt="" />
            <p>Install Extension</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
