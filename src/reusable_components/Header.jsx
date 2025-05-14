import React from 'react'
// import { IoArrowBack } from "react-icons/io5";
import * as images from '../assets/index'
import { Link } from 'react-router-dom';
import { ExplifiedLogo } from "../assets";

import { useEffect, useRef, useState } from "react";
import { MdApps } from "react-icons/md";

const Header = (props) => {
    const { index } = props;
    const [showApps, setShowApps] = useState(false);
    const dropdownRef = useRef(null);

    const nav_menu = [
        {
            title: "Create",
            path: "/"
        },
        {
            title: "Publish",
            path: "/publish"
        },
        {
            title: "Grow",
            path: "/grow"
        }
    ]

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowApps(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="header bg-black w-full h-fit py-2 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center px-1 fixed">

            <div className='w-full flex sm:justify-start justify-between gap-5 relative'>
                {/* <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl text-xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'> </button> */}
                <Link to="/">
                    <div className="flex items-center gap-3">
                        <img className="h-10" alt="Logo" src={ExplifiedLogo} />
                        <h1 className="text-2xl font-semibold text-white">Explified</h1>
                    </div>
                </Link>
                {
                    nav_menu.map((e, i) => (<Link to={e.path} className={` ${i == index ? 'bg-[#23b5b5] text-white' : 'bg-white text-black'} sm:py-2 sm:px-5 py-2 px-3  rounded transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white`}>{e.title}</Link>))
                }

            </div>
            <div className='w-full flex sm:justify-end justify-center px-2 items-center gap-3'>


                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowApps(!showApps)}
                        className="text-white text-2xl"
                    >
                        <MdApps />
                    </button>

                    <div
                        className={`absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-600 rounded-lg p-4 grid grid-cols-3 gap-4 z-50 transition-all duration-300 transform origin-top ${showApps
                                ? "opacity-100 scale-100 pointer-events-auto"
                                : "opacity-0 scale-95 pointer-events-none"
                            }`}
                    >
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool1
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool2
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool3
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool4
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool5
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool6
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool7
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool8
                        </div>
                        <div className="bg-gray-700 text-white text-sm flex items-center justify-center py-4 px-4 rounded hover:bg-gray-600">
                            Tool9
                        </div>
                    </div>
                </div>


                <button className='bg-white text-black sm:py-2 sm:px-5 py-1 px-3 rounded-full transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white' onClick={() => {
                    console.log("clicked")
                }}>
                    <div className="flex gap-1 items-center">
                        <img className='w-[20px] h-[20px]' src={images.chromeIcon} alt="" />
                        <p>Install Extension</p>
                    </div>
                </button>

            </div>
        </div>
    )
}

export default Header
