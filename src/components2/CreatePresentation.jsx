import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export default function PresentationCustomizer() {
  return (
    <section className="min-h-screen w-full bg-black text-white font-sans px-6 py-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif tracking-wide mx-auto">
            TOPIC NAME
          </h1>
          <div className="text-sm flex items-center gap-1 border rounded-full px-4 py-2 hover:border-[#23b5b5] hover:text-[#23b5b5] transition-all duration-300">
            <span>10</span>
            <span className="text-yellow-400">🪙</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
          <div className="h-full w-1/3 bg-cyan-400 rounded-full"></div>
        </div>

        {/* Slide Count */}
        <div className="mt-8 flex items-center gap-4">
          <span className="text-2xl">Number of slides :</span>
          <div className="px-4 py-1 rounded-full border border-cyan-400 text-sm">
            8 – 10
          </div>
        </div>

        {/* Templates Section */}
        <div className="mt-6">
          <span className="text-2xl">Templates :</span>
          <div className="flex items-center gap-4 mt-2">
            <button className="px-2 py-6 bg-black border border-white text-white">
              <ChevronLeft size={16} />
            </button>
            <div className="w-48 h-32 border border-white" />
            <div className="w-48 h-32 border border-yellow-400" />
            <div className="w-48 h-32 border border-white" />
            <div className="w-48 h-32 border border-white" />

            <button className="px-2 py-6 bg-black border border-white text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Font and Visual Representation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">Font :</span>
            <button className="flex items-center gap-1 px-4 py-1 rounded-full border border-cyan-400 text-md">
              Caveat <ChevronDown size={12} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">Visual Representation</span>
            <button className="flex items-center gap-1 px-4 py-1 rounded-full border border-yellow-400 text-md">
              Graphs <ChevronDown size={12} />
            </button>
          </div>
        </div>

        {/* Animations Section */}
        <div className="mt-6">
          <span className="text-2xl">Animations :</span>
          <div className="flex items-center gap-4 mt-2">
            <button className="px-2 py-6 bg-black border border-white text-white">
              <ChevronLeft size={16} />
            </button>
            <div className="w-48 h-32 border border-white" />
            <div className="w-48 h-32 border border-yellow-400" />
            <div className="w-48 h-32 border border-white" />
            <div className="w-48 h-32 border border-white" />
            <button className="px-2 py-6 bg-black border border-white text-white">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Next Button */}
        <div className="mt-10 flex justify-center">
          <button className="px-8 py-2 rounded-full bg-black border border-[#23b5b5] text-white hover:text-black hover:bg-[#23b5b5] transition">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
