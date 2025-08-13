import { Loader2 } from "lucide-react";

function SubtitleLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <Loader2 className="animate-spin text-4xl text-teal-400 w-12 h-12" />
        <div className="absolute inset-0 animate-ping">
          <Loader2 className="text-4xl text-teal-400/30 w-12 h-12" />
        </div>
      </div>
      <p className="text-gray-400 text-sm">Processing your video...</p>
    </div>
  );
}

export default SubtitleLoader;
