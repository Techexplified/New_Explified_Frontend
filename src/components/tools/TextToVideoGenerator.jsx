import { Film, Sparkles, Wand2, Clock, Loader2, Zap } from "lucide-react";

const TextToVideoGenerator = () => {
  const defaultPrompts = [
    "A serene lake at sunset with gentle ripples reflecting golden light",
    "Futuristic cityscape with neon lights and flying cars at night",
    "A magical forest with glowing fireflies dancing around ancient trees",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Film className="w-12 h-12 text-cyan-400 animate-pulse" />
              <div className="absolute -inset-1 bg-cyan-400 opacity-20 blur-lg rounded-full"></div>
            </div>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning videos with the power of
            artificial intelligence
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Main Input Section */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-3xl border border-cyan-500/20 p-8 mb-8 shadow-2xl">
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className=" text-sm font-medium text-cyan-400 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Describe your video
                </label>
                <div className="relative">
                  <textarea
                    // value={prompt}
                    // onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the video you want to create..."
                    className="w-full h-32 bg-slate-900/80 border border-slate-600 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                    // disabled={isGenerating}
                  />
                  <div className="absolute bottom-4 right-4">
                    <Wand2 className="w-5 h-5 text-cyan-400 opacity-60" />
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                // onClick={handleGenerate}
                // disabled={!prompt.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
              >
                <>
                  <Zap className="w-5 h-5" />
                  Generate Video
                </>
                {/* {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Generate Video
                  </>
                )} */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToVideoGenerator;
