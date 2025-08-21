import {
    Area,
    AreaChart,
    CartesianGrid,
    Line,
    ResponsiveContainer,
    Tooltip,
  } from "recharts";
  import React from "react";
  import NumberAcheive from "../../reusable_components/design_components/NumberAchieve";
  
  const data = [
    { xValue: 1, line: 10, img: "images/videos_thumbnail/video12.png" },
    { xValue: 2, line: 9, img: "images/videos_thumbnail/video10.png" },
    { xValue: 3, line: 7, img: "images/videos_thumbnail/video11.png" },
    { xValue: 4, line: 9, img: "images/videos_thumbnail/video2.png" },
    { xValue: 5, line: 10, img: "images/videos_thumbnail/video3.png" },
    { xValue: 6, line: 9, img: "images/videos_thumbnail/video4.png" },
    { xValue: 7, line: 10, img: "images/videos_thumbnail/video5.png" },
  ];
  
  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-500/20 pb-5 px-1 pt-1 rounded-md shadow-md flex flex-col gap-3 text-gray-400 font-mono text-sm">
          <img
            src={payload[0].payload.img}
            alt="tooltip-img"
            className="w-48 h-32 object-cover rounded-md"
          />
          <div className="px-2">+{payload[0].payload.line * 8}k Views</div>
        </div>
      );
    }
    return null;
  };
  
  const IncreasingViews = () => {
    return (
      <div className="flex flex-col w-full pt-40 pb-10 lg:px-10 xl:px-10 gap-16 items-center bg-black">
        <div className="w-[80%] lg:w-[50%] xl:w-[50%] flex flex-col justify-center items-center gap-5 text-center">
          <div className="text-6xl lg:text-7xl xl:text-7xl font-breakbrush">
            Increase Your <span className="text-[#f20e1d]">Views</span>
          </div>
          <div className="text-medium font-maven text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero
            suscipit labore incidunt nisi, perspiciatis ipsa cumque laborum
            aliquid nostrum ex quo porro minus eos, iste, ad exercitationem! Rem,
            voluptate veniam.
          </div>
        </div>
        <div className="w-[90%] md:w-[80%]">
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="lineGradient1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f20e1d" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#eabf1d" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#f20e1d" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="lineGradient2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f20e1d" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#f20e1d" stopOpacity={0} />
                </linearGradient>
              </defs>
  
              <CartesianGrid
                strokeDasharray=""
                vertical={false}
                stroke="rgba(66,66,66,0.35)"
              />
  
              <Area
                type="monotone"
                dataKey="line"
                stroke="url(#lineGradient1)"
                fill="url(#lineGradient2)"
              />
  
              <Line
                type="monotone"
                dataKey="line"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={false}
              />
  
              {/* Custom Tooltip */}
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <NumberAcheive />
      </div>
    );
  };
  
  export default IncreasingViews;
  