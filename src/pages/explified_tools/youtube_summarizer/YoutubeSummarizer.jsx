import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../network/axiosInstance";
import { useSelector } from "react-redux";

const YoutubeSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [searchParams] = useSearchParams();
  const videoIdYt = searchParams.get("videoId");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!videoIdYt) return;
    getTranscript(videoIdYt);
  }, [videoIdYt]);

  function handleUrl(e) {
    const Url = e.target.value;
    const match = Url.match(/v=([^&]+)/);
    const id = match[1];
    setVideoUrl(e.target.value);
    setVideoId(id);
  }

  const getTranscript = async (videoId) => {
    if (!videoId) return;

    setLoading(true);
    setSummary("");

    try {
      const response = await axiosInstance.post("api/ytSummarize/summary", {
        videoId,
      });
      console.log(response);
      let content = response.data?.content;
      content = content.replaceAll("&amp;#39;", "'");

      setSummary(content || "No summary found.");
      setVideoUrl("");
      setVideoId("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative">
      <div className="bg-white absolute  right-8 rounded-full px-4 py-2 text-black flex gap-2 items-center">
        <div className="h-4 w-4">
          <img
            src="/chrome.png"
            alt="user"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        Install Extension
      </div>

      <h1 className="text-4xl font-semibold text-center mb-6">
        Summarize YouTube Videos
      </h1>

      {/* Scrollable summary section */}

      <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
        {summary}
      </div>
      {loading && (
        <h1 className="max-w-4xl mx-auto w-full text-center flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
          Generating summary...
        </h1>
      )}

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-20 md:left-44 right-0 bg-black z-10">
        <div className="max-w-4xl mx-auto w-full p-4 flex gap-4 items-center">
          <input
            type="text"
            value={videoUrl}
            onChange={handleUrl}
            placeholder="Enter YouTube URL"
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
          />
          <button
            onClick={() => getTranscript(videoId)}
            disabled={loading}
            className={`px-6 py-3 bg-[#23b5b5] rounded-lg font-semibold flex items-center gap-2 transition ${
              loading ? "opacity-35" : null
            }`}
          >
            Summarize
          </button>
        </div>
      </div>
    </div>
  );
};

export default YoutubeSummarizer;
