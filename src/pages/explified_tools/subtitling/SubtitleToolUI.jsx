export default function SubtitleToolUI() {
  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1"></div>
        <h1 className="text-2xl font-normal">AI Subtitler Tool</h1>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-lg">5</span>
          <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-80 space-y-4">
          {/* Feature Cards */}
          <div className="border border-gray-600 rounded-lg p-6 text-center">
            <h3 className="text-lg font-normal leading-tight">
              AI
              <br />
              Subtitle
              <br />
              Generations
            </h3>
          </div>

          <div className="border border-gray-600 rounded-lg p-6 text-center">
            <h3 className="text-lg font-normal leading-tight">
              Personalised
              <br />
              Subtitle
              <br />
              Editing
            </h3>
          </div>

          <div className="border border-gray-600 rounded-lg p-6 text-center">
            <h3 className="text-lg font-normal leading-tight">
              Language
              <br />
              Based
              <br />
              Subtitles
            </h3>
          </div>

          {/* Get Subtitles Button */}
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 rounded-lg text-lg font-normal flex items-center justify-center gap-2 transition-colors">
            Get Subtitle's
            <div className="flex items-center gap-1">
              <span>5</span>
              <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Section */}
          <div
            className="bg-gray-200 rounded-lg mb-6 flex items-center justify-center"
            style={{ height: "300px" }}
          >
            <span className="text-black text-lg font-medium">PREVIEW</span>
          </div>

          {/* Timeline Section */}
          <div className="flex-1">
            {/* Timeline ruler */}
            <div className="border-t border-gray-600 mb-2 relative">
              <div className="flex">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="flex-1 relative">
                    <div className="absolute top-0 left-0 w-px h-4 bg-gray-600"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtitle blocks */}
            <div className="grid grid-cols-6 gap-1 mt-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="bg-gray-400 h-16 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
