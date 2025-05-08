import React, { useState } from 'react'
import { IoArrowBack } from "react-icons/io5";
import * as images from '../../assets/index'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { GrChannel } from "react-icons/gr";
import { SlCalender } from "react-icons/sl";
import { MdFeedback } from "react-icons/md";
import { Link, Outlet } from 'react-router-dom';


const Publish = () => {

  const [open, setOpen] = useState(false);
  const Menus = [
    { title: "All Channels", icon: <GrChannel />, path: "/publish", selected: true },
    { title: "Connect Facebook", icon: <FaFacebook />, gap: true, path: "/publish/connect-to-facebook" },
    { title: "Connect Instagram", icon: <FaInstagram />, path: "/publish/connect-to-instagram" },
    { title: "Connect Twitter/X ", icon: <FaTwitter />, path: "/publish/connect-to-twitter" },
    // { title: "Show More Channels", icon: "Search" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);


  return (
    <>


      <div className="header bg-black w-full h-fit py-2 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center px-1 sticky top-0 z-50">

        <div className='w-full flex sm:justify-start justify-between gap-5 relative'>
          <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl text-xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'><IoArrowBack /></button>
          <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>Create</button>
          <button className='bg-[#23b5b5] text-white sm:py-2 sm:px-5 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>Publish</button>
          <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>Grow</button>
        </div>
        <div className='w-full flex sm:justify-end justify-center px-2'>
          <button className='bg-white text-black sm:py-2 sm:px-5 py-1 px-3 rounded-full transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>
            <div className="flex gap-1 items-center">
              <img className='w-[20px] h-[20px]' src={images.chromeIcon} alt="" />
              <p>Install Extension</p>
            </div>
          </button>
        </div>
      </div>

      {/* SIDEBAR  */}

      {/* <div className="flex ">
        <div
          className={` ${open ? "w-72" : "w-20 "
            } bg-white h-screen p-5  pt-8 relative transition-all duration-100 border-r-1 border-[#b3b3b3]`}
        >
          <p
            src="./src/assets/control.png"
            className={`text-2xl text-black text-semibold bg-white p-1 absolute cursor-pointer -right-4 top-9 border-[#757575]
           border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          > <IoArrowBack /></p>
          <div className="flex gap-x-2 justify-start items-center h-[50px]">
            <img
              src={images.ExplifiedLogo}
              className={`w-[50px] cursor-pointer transition-all duration-500 ${open && "rotate-[360deg]"
                }`}
            />
            <h1
              className={`text-black origin-left font-medium text-xl transition-all duration-100 ${!open && "scale-0"
                }`}
            >
              Explified
            </h1>
          </div>
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <Link to={Menu.path}
                key={index}
                className={`flex items-center justify-${open?'start':'center'} rounded-md p-2 cursor-pointer text-black border-1 border-[#b3b3b3] hover:bg-[#b3b3b3]
              ${Menu.gap ? "mt-9" : "mt-2"} ${selectedIndex===index?'bg-[#b3b3b3]':''} `} onClick={()=>{
                setSelectedIndex(index)
              }}
              >
                <div  className="flex gap-2 items-center justify-center">
                  {Menu.icon}
                  <span className={`${!open && "hidden"} origin-left transition-all duration-100`}>
                    {Menu.title}
                  </span>
                </div>
              </Link>
            ))}
          </ul>
        </div>

        {/* bg-[#b3b3b3] */}

      {/* <Outlet/> */}

      {/* </div>  */}

      <div className="flex bg-black">
        {/* Sidebar - Fixed */}
        <div
          className={`fixed top-12 left-0 z-20 h-screen bg-black p-5 pt-8 transition-all duration-100 border-r border-[#b3b3b3] ${open ? "w-72" : "w-20"
            } invisible sm:visible `}
        >
          <p
            className={`text-2xl text-black font-semibold bg-white p-1 absolute cursor-pointer -right-4 top-9 border-[#757575] border-2 rounded-full ${!open && "rotate-180"
              }`}
            onClick={() => setOpen(!open)}
          >
            <IoArrowBack />
          </p>
          <div className="flex gap-x-2 items-center h-[50px]">
            <img
              src={images.ExplifiedLogo}
              className={`w-[50px] cursor-pointer transition-all duration-500 ${open && "rotate-[360deg]"
                }`}
            />
            <h1
              className={`text-white origin-left font-medium text-xl transition-all duration-100 ${!open && "scale-0"
                }`}
            >
              Explified
            </h1>
          </div>

          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <Link
                to={Menu.path}
                key={index}
                className={`flex items-center ${open ? "justify-start" : "justify-center"
                  } rounded-md p-2 cursor-pointer border border-[#23b5b5] hover:bg-[#23b5b5]
          ${Menu.gap ? "mt-9" : "mt-2"} ${selectedIndex === index ? "bg-[#23b5b5]" : ""} text-white`}
                onClick={() => {
                  setSelectedIndex(index);
                  setOpen(false);
                }}
              >
                <div className="flex gap-2 items-center justify-center">
                  {Menu.icon}
                  <span
                    className={`${!open && "hidden"
                      } origin-left transition-all duration-100`}
                  >
                    {Menu.title}
                  </span>
                </div>
              </Link>
            ))}
          </ul>
        </div>

        {/* Main Content - Scrollable */}
        <div className="sm:w-20 w-0 bg-black"></div>
        <Outlet />

      </div>

      <div className="sm:hidden bg-black w-full h-fit py-2 flex items-center px-1 sticky bottom-0 z-50 visible border-0">

        <div className="w-full flex justify-around">
          {Menus.map((Menu, index) => (
            <Link
              to={Menu.path}
              key={index}
              className={`rounded-md p-2 cursor-pointer text-black border border-[#23b5b5] ${selectedIndex === index ? "bg-[#23b5b5]" : ""} text-white`}
              onClick={() => {
                setSelectedIndex(index);
                setOpen(false);
              }}
            >
              <div className="flex gap-2 items-center justify-center">
                {Menu.icon}
              </div>
            </Link>
          ))}

        </div>

      </div>

    </>
  );
}

export default Publish
