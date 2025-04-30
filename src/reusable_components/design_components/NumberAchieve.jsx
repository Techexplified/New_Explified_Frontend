import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";

const NumberAcheive = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const count1 = useMotionValue(0);
  const count2 = useMotionValue(0);
  const count3 = useMotionValue(0);
  const rounded1 = useTransform(count1, Math.round);
  const rounded2 = useTransform(count2, Math.round);
  const rounded3 = useTransform(count3, Math.round);

  useEffect(() => {
    if (isInView) {
      animate(count1, 33700, { duration: 3.5 });
      animate(count2, 2000, { duration: 2 });
      animate(count3, 6500000, { duration: 5 });
    }
  }, [isInView]);

  const NumberItems = ({ number, text }) => {
    return (
      <div className="flex flex-col w-full items-center justify-center gap-4 my-10">
        <div className="flex flex-row text-6xl font-maven font-semibold">
          <motion.h1>{number}</motion.h1>+
        </div>
        <span className="text-lg font-bungee font-extrabold">{text}</span>
      </div>
    );
  };

  return (
    <div ref={ref} className="w-full flex flex-col lg:flex-row xl:flex-row items-center gap-10 justify-around px-20 mb-32">
      <NumberItems number={rounded1} text={"Subscribers"} />
      <NumberItems number={rounded2} text={"Videos"} />
      <NumberItems number={rounded3} text={"Total Views"} />
    </div>
  );
};

export default NumberAcheive;
