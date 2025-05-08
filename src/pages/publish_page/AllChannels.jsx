import React from 'react'
import { GrChannel } from "react-icons/gr";
import { SlCalender } from "react-icons/sl";
import { MdFeedback } from "react-icons/md";
import { CiShoppingTag } from "react-icons/ci";
import { FaGlobe } from "react-icons/fa";
import { FaFacebook, FaInstagram, FaTwitter ,FaYoutube,FaLinkedin} from "react-icons/fa";

const AllChannels = () => {
  return (
    <div className="min-h-screen w-full text-white bg-black px-5 py-2 flex flex-col"> 

          <div className="flex sm:flex-row flex-col justify-between w-full sm:gap-0 gap-5">

            <div className='flex gap-2 items-center justify-center text-xl font-semibold'>
              <GrChannel />
              <span className="origin-left transition-all duration-100">
                All Channels
              </span>
            </div>

            <div className='flex gap-3 sm:justify-end justify-center'>
              <div className='text-sm flex gap-2 justify-center items-center'>
                <MdFeedback/>
                <p>Share Feedback</p>
              </div>
              <button className='border-1 py-1 px-2 text-sm border-white bg-white text-black hover:bg-[#23b5b5] hover:text-white transition-all duration-300'><div className="flex gap-2 justify-center items-center"><SlCalender /> <p>Calender</p></div></button>
              <button className='border-1 py-1 px-2 text-sm border-white bg-white text-black hover:bg-[#23b5b5] hover:text-white   transition-all duration-300'> + New Post</button>
            </div>

          </div>


          <div className="flex flex-col sm:flex-row w-full mt-10">

            <div className='flex sm:justify-start justify-center items-center gap-5 text-sm w-full'>
              <button className='flex gap-2 justify-center items-center py-2 border-b-1 border-black transition-all duration-200 rounded-[2px] hover:border-[#23b5b5]'>
                <p>Queue</p>
                <span className='px-1 text-sm bg-white text-black rounded-full'>0</span>
              </button>
              <button className='flex gap-2 justify-center items-center py-2 border-b-1 border-black transition-all duration-200 rounded-[2px] hover:border-[#23b5b5]'>
                <p>Drafts</p>
                <span className='px-1 text-sm bg-white text-black rounded-full'>0</span>
              </button>
              <button className='flex gap-2 justify-center items-center py-2 border-b-1 border-black transition-all duration-200 rounded-[2px] hover:border-[#23b5b5]'>
                <p>Approvals</p>
                <span className='px-1 text-sm bg-white text-black rounded-full'>0</span>
              </button>
              <button className='flex gap-2 justify-center items-center py-2 border-b-1 border-black transition-all duration-200 rounded-[2px] hover:border-[#23b5b5]'>
                <p>Sent</p>
                <span className='px-1 text-sm bg-white text-black rounded-full'>0</span>
              </button>
            </div>

            <div className='flex sm:justify-end justify-center items-center gap-5 text-sm'>
              <div className='flex gap-2 justify-center items-center'>
                <p className='text-xl'><CiShoppingTag /></p>
                <p>Tags</p>
              </div>
              <div className='flex gap-2 justify-center items-center'>
                <p className='text-xl'><FaGlobe /></p>
                <p>Kolkata</p>
              </div>
            </div>

            
          </div>
         

          <div className="py-10 w-full flex justify-center">
              <div className='w-full sm:px-20'>

                <div className='border-0 w-full flex justify-between'>
                  <p className='text-2xl font-semibold'>Create Post</p>
                  <div className='bg-white py-1 px-2'>
                    <label className='text-black' htmlFor="">Add Tags</label>
                    <select className='bg-white text-black' name="" id="">
                      
                    </select>
                  </div>
                </div>

                <div className='flex gap-5 text-xl mt-5'>
                    <div className='border-1 p-1 rounded-full transition-all duration-200 cursor-pointer hover:text-[#23b5b5]'><FaFacebook/></div>
                    <div className='border-1 p-1 rounded-full  transition-all duration-200 cursor-pointer hover:text-[#23b5b5]'><FaInstagram/></div>
                    <div className='border-1 p-1 rounded-full hover:text-[#23b5b5] transition-all duration-200 cursor-pointer'><FaTwitter/></div>
                    <div className='border-1 p-1 rounded-full hover:text-[#23b5b5] transition-all duration-200 cursor-pointer'><FaYoutube/></div>
                    <div className='border-1 p-1 rounded-full hover:text-[#23b5b5] transition-all duration-200 cursor-pointer'><FaLinkedin/></div>
                </div>

                <div className='w-full mt-5'>
                  <textarea className='w-full rounded border-1 outline-none border-white p-2 bg-black text-white' name="" id="" rows={10} placeholder='Start Writing Or Use the AI Assistant...'></textarea>
                  <button className=' mt-2 bg-white px-4 py-1 rounded text-black mt-2 border-1 border-white hover:bg-[#23b5b5] hover:text-white transition-all duration-200 '>Connect</button>
                </div>

                <p className='mt-5 text-[#dcdcdc]'>Use AI Tools ....</p>
                <div className="w-full flex gap-5 mt-2 flex-wrap">
                  <button className='p-8 border-1 border-white rounded hover:bg-[#23b5b5] transition-all duration-200'>Gif Generator</button>
                  <button className='p-8 border-1 border-white rounded hover:bg-[#23b5b5] transition-all duration-200'>AI Subtitle Tool</button>
                  <button className='p-8 border-1 border-white rounded hover:bg-[#23b5b5] transition-all duration-200'>Video To Text</button>
                </div>

              </div>
          </div>


        </div>
  )
}

export default AllChannels
