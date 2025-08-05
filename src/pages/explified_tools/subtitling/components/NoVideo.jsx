import { Play } from "lucide-react";

function NoVideo() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto">
          <Play className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Video Selected
          </h3>
          <p className="text-gray-500">
            Upload a video to start generating subtitles
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoVideo;
