import React from 'react'
import { IoArrowBack } from "react-icons/io5";
import * as images from '../assets/index'

const Header = () => {
    return (
        <div className="header bg-black w-full h-fit py-2 flex flex-col sm:flex-row gap-4 sm:gap-0 items-center px-1 sticky top-0 z-50">

            <div className='w-full flex sm:justify-start justify-between gap-5 relative'>
                <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl text-xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'><IoArrowBack /></button>
                <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>Create</button>
                <button className='bg-white text-black sm:py-2 sm:px-5 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>Publish</button>
                <button className='bg-[#23b5b5] text-white sm:py-2 sm:px-5 py-2 px-3  rounded-2xl transition-all duration-200 border-1 border-white hover:bg-[#23b5b5] hover:text-white'>Grow</button>
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
    )
}

export default Header
