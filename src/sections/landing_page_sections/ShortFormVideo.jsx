import React from "react";

const ShortFormVideo = () => {
  return (
    <div className="flex flex-col h-screen w-full my-40 px-10 gap-16 items-center">
      <div className="w-[50%] flex flex-col justify-center items-center gap-5 text-center">
        <div className="text-7xl font-breakbrush">
          Short Form <span className="text-[#f20e1d]">Video</span>
        </div>
        <div className="text-medium font-maven text-gray-400">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
          suscipit labore incidunt nisi, perspiciatis ipsa cumque laborum
          aliquid nostrum ex quo porro minus eos, iste, ad exercitationem! Rem,
          voluptate veniam.
        </div>
      </div>

      <div className="flex flex-row gap-5 h-full w-full justify-center items-center pointer-events-none">
        <div className="w-full h-[85%] border-2 border-gray-400/30 rounded-3xl overflow-hidden">
          <iframe
            loading="lazy"
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/53L2RCd5JR8?controls=0&autoplay=1&mute=1&loop=1&playlist=53L2RCd5JR8`}
          />
        </div>
        <div className="w-full h-[95%] flex flex-col justify-center items-center gap-5">
          <div className="w-full h-[65%] border-2 border-gray-400/30 rounded-3xl overflow-hidden">
            <iframe
              loading="lazy"
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/epAv0DAVv1k?controls=0&autoplay=1&mute=1&loop=1&playlist=epAv0DAVv1k`}
            />
          </div>
          <div className="w-full h-full border-2 border-gray-400/30 rounded-3xl overflow-hidden">
            <iframe
              loading="lazy"
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/gB5ve_Bqf0M?controls=0&autoplay=1&mute=1&loop=1&playlist=gB5ve_Bqf0M`}
            />
          </div>
        </div>
        <div className="w-full h-full border-2 border-gray-400/30 rounded-3xl overflow-hidden flex">
          <iframe
            loading="lazy"
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/Fb1tnTzQWfc?controls=0&autoplay=1&mute=1&loop=1&playlist=Fb1tnTzQWfc`}
          />
        </div>
        <div className="w-full h-[95%] flex flex-col justify-center items-center gap-5">
          <div className="w-full h-full border-2 border-gray-400/30 rounded-3xl overflow-hidden">
            <iframe
              loading="lazy"
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/HBh1bhaQEAQ?controls=0&autoplay=1&mute=1&loop=1&playlist=HBh1bhaQEAQ`}
            />
          </div>
          <div className="w-full h-[65%] border-2 border-gray-400/30 rounded-3xl overflow-hidden">
            <iframe
              loading="lazy"
              className="w-full h-full object-cover"
              src={`https://www.youtube.com/embed/1OwMvPYIgJg?controls=0&autoplay=1&mute=1&loop=1&playlist=1OwMvPYIgJg`}
            />
          </div>
        </div>
        <div className="w-full h-[85%] border-2 border-gray-400/30 rounded-3xl overflow-hidden">
          <iframe
            loading="lazy"
            className="w-full h-full object-cover"
            src={`https://www.youtube.com/embed/FrY0c4_ZdoU?controls=0&autoplay=1&mute=1&loop=1&playlist=FrY0c4_ZdoU`}
          />
        </div>
      </div>
    </div>
  );
};

export default ShortFormVideo;
