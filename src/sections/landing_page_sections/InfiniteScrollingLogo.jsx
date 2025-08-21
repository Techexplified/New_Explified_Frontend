import React from "react";
import { Logo1, Logo2, Logo3, Logo4, Logo5 } from "../../assets/index";

const logos = [
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
  Logo1,
  Logo2,
  Logo3,
  Logo4,
  Logo5,
];

const InfiniteScrollingLogo = () => {
  return (
    <div className="w-full overflow-hidden h-[5rem] md:h-[5rem] lg:h-[6rem] xl:h-[7rem] bg-gradient-to-r from-blue-500/30 to-violet-700/30">
      <div className="relative flex w-full">
        <div className="flex min-w-max animate-scroll space-x-10">
          {[...logos, ...logos].map((logo, index) => (
            <img
              key={index}
              src={logo}
              className="object-cover h-28 -translate-y-4 md:h-32 lg:h-40 xl:h-40 xl:-translate-y-5"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollingLogo;
