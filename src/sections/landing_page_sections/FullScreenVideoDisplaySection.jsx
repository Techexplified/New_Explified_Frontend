import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ExplifiedLogo } from "../../assets";

const FullScreenVideoDisplaySection = () => {
  const youtubeVideos = [
    {
      id: "OwKey4lH-PE",
      title: "Wild Animals",
      comments: [
        {
          name: "John Doe",
          text: "Awesome video! Loved it!",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          name: "Jane Smith",
          text: "This is so informative, thanks!",
          avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        },
        {
          name: "Chris Johnson",
          text: "Great quality, keep it up!",
          avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        },
      ],
    },
    {
      id: "QjhHdBJbm9M",
      title: "Journey inside the black hole",
      comments: [
        {
          name: "Alice Williams",
          text: "Really helpful, appreciate it!",
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          name: "Mark Brown",
          text: "Fantastic content, so clear!",
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        {
          name: "Emily Davis",
          text: "Loved the explanation, well done!",
          avatar: "https://randomuser.me/api/portraits/women/3.jpg",
        },
      ],
    },
    {
      id: "xZLK1l-2-CA",
      title: "How does GPT work ?",
      comments: [
        {
          name: "Michael Lee",
          text: "This is amazing, thanks for sharing!",
          avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        },
        {
          name: "Samantha King",
          text: "Great tips, I will use these!",
          avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        },
        {
          name: "David Scott",
          text: "Incredible! Helped me a lot.",
          avatar: "https://randomuser.me/api/portraits/men/5.jpg",
        },
      ],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < youtubeVideos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(youtubeVideos.length - 1);
    }
  };

  const { id, title, comments } = youtubeVideos[currentIndex];

  return (
    <div>
      <div className="text-5xl lg:text-7xl xl:text-7xl font-extrabold text-center mt-20">
        Our Work Portfolio
      </div>
      <div className="w-full h-screen flex flex-row justify-around items-center relative">
        <IoIosArrowBack
          className="w-14 h-14 cursor-pointer"
          onClick={handlePrev}
        />
        <div className="relative w-[90%] h-[85%] bg-black rounded-3xl overflow-hidden border-5 border-gray-600">
          <div className="absolute flex flex-row items-center gap-3 m-10">
            <img
              loading="lazy"
              src={ExplifiedLogo}
              className="h-12"
              alt="Explified Logo"
            />
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Explified
            </h1>
          </div>
          <div className="absolute m-10 text-3xl font-bold z-10 bottom-0">
            {title}
          </div>
          <iframe
            loading="lazy"
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}?controls=0`}
          />
        </div>
        <IoIosArrowForward
          className="w-14 h-14 cursor-pointer"
          onClick={handleNext}
        />
        <div className="hidden absolute bottom-20 right-24 w-[25%] h-[50%] z-10 overflow-hidden lg:flex xl:flex flex-col gap-5 items-end justify-end">
          {comments.map((comment, index) => (
            <div
              key={index}
              className="rounded-xl bg-slate-700 h-fit w-fit flex flex-row py-2 px-5"
            >
              <div className="w-fit h-full py-1 px-1">
                <img
                  src={comment.avatar}
                  alt={comment.name}
                  className="w-[2.75rem] h-[2.75rem] rounded-full border-1"
                />
              </div>
              <div className="flex flex-col mx-1">
                <div className="text-lg font-bold">{comment.name}</div>
                <div className="text-xs font-normal">{comment.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullScreenVideoDisplaySection;
