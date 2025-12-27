import {
  Play,
  Rewind,
  FastForward,
  Download,
  Settings,
  RotateCcw,
  Pencil,
  Captions,
} from "lucide-react";

const TextToVideo = () => {
  return (
    <div className="mt-20 bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Title and Download Icon */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Text to video generator</h1>
        <Download className="w-5 h-5 cursor-pointer" />
      </div>

      {/* Video Placeholder */}
      <div className="w-full max-w-3xl aspect-video bg-gray-300 flex items-center justify-center">
        <p className="text-black text-lg font-bold">YOUR VIDEO</p>
      </div>

      {/* Control Bar */}
      <div className="w-full max-w-3xl bg-teal-800 flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Pencil className="w-5 h-5 cursor-pointer" />
          <Captions className="w-5 h-5 cursor-pointer" />
        </div>

        <div className="flex items-center gap-4">
          <Rewind className="w-5 h-5 cursor-pointer" />
          <Play className="w-6 h-6 cursor-pointer" />
          <FastForward className="w-5 h-5 cursor-pointer" />
        </div>

        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 cursor-pointer" />
          <RotateCcw className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-3xl mt-10">
        <div className="flex items-center bg-transparent border border-teal-500 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Any changes ?"
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-400"
          />
          <button className="ml-2">
            <Play className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextToVideo;
