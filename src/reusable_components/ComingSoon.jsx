import React from "react";
import { Sparkles } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className=" flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[#23b5b5] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#23b5b5] rounded-full mix-blend-multiply filter blur-xl opacity-10"></div>
      </div>

      {/* Floating sparkles */}
      <div className="absolute inset-0">
        <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-[#23b5b5] opacity-40" />
        <Sparkles className="absolute top-1/3 right-1/3 w-4 h-4 text-[#23b5b5] opacity-30" />
        <Sparkles className="absolute bottom-1/4 left-1/2 w-5 h-5 text-[#23b5b5] opacity-35" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Coming Soon
        </h1>

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-[#23b5b5]/20 rounded-full border border-[#23b5b5]/30">
            <Sparkles className="w-12 h-12 text-[#23b5b5]" />
          </div>
        </div>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
