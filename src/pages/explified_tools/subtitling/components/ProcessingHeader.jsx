import { Bot } from "lucide-react";

function ProcessingHeader() {
  return (
    <div className="text-center px-2">
      <div className="flex items-center gap-3 bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 px-6 py-3 rounded-full">
        <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
          <Bot className="text-white w-4 h-4" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
          Subtitle
        </h2>
      </div>
    </div>
  );
}

export default ProcessingHeader;
