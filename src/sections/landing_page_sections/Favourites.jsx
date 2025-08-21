import React from "react";

const logos = [
  "/images/videos_thumbnail/video1.jpg",
  "/images/videos_thumbnail/video2.png",
  "/images/videos_thumbnail/video3.png",
  "/images/videos_thumbnail/video4.png",
  "/images/videos_thumbnail/video5.png",
  "/images/videos_thumbnail/video6.png",
  "/images/videos_thumbnail/video7.png",
  "/images/videos_thumbnail/video8.png",
  "/images/videos_thumbnail/video9.png",
  "/images/videos_thumbnail/video10.png",
  "/images/videos_thumbnail/video11.png",
  "/images/videos_thumbnail/video12.png",
  "/images/videos_thumbnail/video13.png",
];

const Favourites = () => {
  return (
    <div className="flex flex-col justify-center items-center text-center">
      <div className="w-full lg:w-[75%] xl:w-[75%] text-6xl lg:text-7xl xl:text-7xl px-7 md:px-40 xl:px-40 mb-10 font-breakbrush">
        Our <span className="text-[#eabf1d]">Favorite</span>
      </div>
      <div className="w-full overflow-hidden h-[5rem] md:h-[5rem] lg:h-[6rem] xl:h-[15rem]">
        <div className="relative flex w-full">
          <div className="flex min-w-max animate-scroll space-x-10">
            {[...logos, ...logos].map((logo, index) => (
              <img
                loading="lazy"
                key={index}
                src={logo}
                className="object-cover h-28 rounded-2xl border-3 border-gray-500 -translate-y-4 md:h-32 lg:h-40 xl:h-52 xl:translate-y-4"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden h-[5rem] md:h-[5rem] lg:h-[6rem] xl:h-[20rem]">
        <div className="relative flex w-full">
          <div className="flex min-w-max animate-reverse_scroll space-x-10">
            {[...logos, ...logos].map((logo, index) => (
              <img
                loading="lazy"
                key={index}
                src={logo}
                className="object-cover h-28 rounded-2xl border-3 border-gray-500 -translate-y-4 md:h-32 lg:h-40 xl:h-72 xl:translate-y-4"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favourites;
