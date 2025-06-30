import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";

function DeepSearch() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  function handleUrl(e) {
    const Url = e.target.value;
    const match = Url.match(/v=([^&]+)/);
    const id = match[1];
    setVideoUrl(e.target.value);
    setVideoId(id);
  }
  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl font-semibold text-center mb-8">
        💡 Deep Search
      </h1>
      <div>
        <button className="px-3 py-1 bg-gray-800 rounded-md capitalize">
          Resources
        </button>
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-20  right-0 bg-black z-10">
        <div className="max-w-4xl mx-auto w-full p-4 flex gap-4 items-center">
          <input
            type="text"
            value={videoUrl}
            onChange={handleUrl}
            placeholder="Enter YouTube URL"
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
          />

          <button
            className={`px-6 py-3  bg-[#23b5b5] rounded-lg font-semibold flex items-center gap-2 transition`}
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeepSearch;
