import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../network/axiosInstance";
// import axios from "axios";
import { useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import TranscriptCard from "./TranscriptCard";
import SummaryCard from "./SummaryCard";
import HistoryCard from "./HistoryCard";
// import axios from "axios";
const API_URL = "https://api.supadata.ai/v1/youtube/transcript";

const YoutubeSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [videoData, setVideoData] = useState();
  const [imageData, setImageData] = useState();
  const [searchParams] = useSearchParams();
  const videoIdYt = searchParams.get("videoId");
  const [activeTab, setActiveTab] = useState("");
  const [lang, setLang] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyVideos, setHistoryVideos] = useState(
    JSON.parse(localStorage.getItem("summarize-history")) || []
  );

  // const videoTranscript = searchParams.get("videoTranscript");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  // console.log("user", user);
  // const accessToken = user.accessToken;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // useEffect(() => {
  //   async function fetchHistory() {
  //     try {
  //       const res = await axios.get(
  //         "https://www.googleapis.com/youtube/v3/playlistItems",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //           params: {
  //             part: "snippet",
  //             maxResults: 10,
  //             playlistId: "WL",
  //           },
  //         }
  //       );
  //       console.log(res);

  //       const watchHistory = res.data.items;
  //       console.log(watchHistory);
  //       setHistoryVideos(watchHistory);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchHistory();
  // }, [accessToken]);

  useEffect(() => {
    if (!videoIdYt) return;
    getSummary(videoIdYt);
  }, [videoIdYt]);

  function handleUrl(e) {
    const Url = e.target.value;
    const match = Url.match(/v=([^&]+)/);
    const id = match[1];
    setVideoUrl(e.target.value);
    setVideoId(id);
  }

  const getSummary = async (videoId) => {
    if (!videoId) return;
    setLoading(true);
    setSummary("");
    try {
      const response = await axiosInstance.post("api/ytSummarize/summary", {
        videoId,
      });
      const response2 = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${
          import.meta.env.VITE_YT_THUMBNAIL_API_KEY
        }`
      );
      const chanelId = response2?.data?.items[0]?.snippet.channelId;
      const response3 = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${chanelId}&key=${
          import.meta.env.VITE_YT_THUMBNAIL_API_KEY
        }`
      );
      const newData = {
        videoId,
        profile: response3?.data?.items[0]?.snippet?.thumbnails?.default?.url,
        thumbnail: response2?.data?.items[0]?.snippet.thumbnails?.default?.url,
        chanelId: response2?.data?.items[0]?.snippet.channelId,
        channelTitle: response2?.data?.items[0]?.snippet.channelTitle,
        title: response2?.data?.items[0]?.snippet.title,
      };

      let storedArray =
        JSON.parse(localStorage.getItem("summarize-history")) || [];
      storedArray.push(newData);
      localStorage.setItem("summarize-history", JSON.stringify(storedArray));

      setHistoryVideos((prev) => [...prev, newData]);
      setVideoData(response2?.data?.items[0]?.snippet);
      setImageData(
        response3?.data?.items[0]?.snippet?.thumbnails?.default?.url
      );
      let content = response.data?.content;
      setSummary(content);
      setActiveTab("summary");
      setVideoUrl("");
      setVideoId("");
      setHistoryOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getTranscript = async (videoId) => {
    if (!videoId) return;
    setLoading(true);
    setTranscript([]);
    try {
      const response = await axiosInstance.post("api/ytSummarize/transcript", {
        videoId,
      });
      const response2 = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${
          import.meta.env.VITE_YT_THUMBNAIL_API_KEY
        }`
      );
      const chanelId = response2?.data?.items[0]?.snippet.channelId;
      const response3 = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${chanelId}&key=${
          import.meta.env.VITE_YT_THUMBNAIL_API_KEY
        }`
      );

      const newData = {
        videoId,
        profile: response3?.data?.items[0]?.snippet?.thumbnails?.default?.url,
        thumbnail: response2?.data?.items[0]?.snippet.thumbnails?.default?.url,
        chanelId: response2?.data?.items[0]?.snippet.channelId,
        channelTitle: response2?.data?.items[0]?.snippet.channelTitle,
        title: response2?.data?.items[0]?.snippet.title,
      };

      let storedArray =
        JSON.parse(localStorage.getItem("summarize-history")) || [];
      storedArray.push(newData);
      localStorage.setItem("summarize-history", JSON.stringify(storedArray));

      setHistoryVideos((prev) => [...prev, newData]);
      setVideoData(response2?.data?.items[0]?.snippet);
      setImageData(
        response3?.data?.items[0]?.snippet?.thumbnails?.default?.url
      );
      let content = response.data?.content;
      setTranscript(content);
      setActiveTab("transcript");
      setVideoUrl("");
      setVideoId("");
      setHistoryOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const language = e.target.value;
    setLang(language);
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        "api/ytSummarize/translate-transcript",
        { transcript, language }
      );
      console.log(response.data.translatedTranscript);
      setTranscript(response?.data?.translatedTranscript);
    } catch (err) {
      console.error("Translation Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl font-semibold text-center mb-8">
        Summarize YouTube Videos
      </h1>
      <div>
        <button
          className="px-3 py-1 bg-gray-800 rounded-md capitalize"
          onClick={() => setHistoryOpen((p) => !p)}
        >
          history
        </button>
      </div>
      {historyVideos.length !== 0 && historyOpen ? (
        <div>
          {historyVideos.map((item, index) => (
            <HistoryCard
              key={index}
              item={item}
              setVideoId={setVideoId}
              setVideoUrl={setVideoUrl}
            />
          ))}
        </div>
      ) : null}
      {videoData && !historyOpen && (
        <div className="flex items-center gap-6  max-w-3xl mx-auto">
          <div>
            <img src={videoData?.thumbnails?.default?.url} alt="title" />
          </div>
          <div>
            <p className="text-xl mb-2">{videoData?.title}</p>
            <div className="flex gap-2 items-center">
              <div className="h-8 w-8 rounded-full">
                <img
                  src={imageData}
                  alt="profile"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
              <div>{videoData?.channelTitle}</div>
            </div>
          </div>
        </div>
      )}
      {transcript.length !== 0 || summary.length !== 0 || videoData ? (
        <>
          <div className="text-right relative">
            <div className="flex-row-reverse">
              <select
                value={lang}
                onChange={handleLanguageChange}
                className="outline-none bg-black mr-8 text-white cursor-pointer !px-4 !py-1 rounded border-1 border-[#23b5b5] "
                name="language"
                id="language"
              >
                <option value="">Select</option>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
              </select>
              <button
                onClick={() => setActiveTab("transcript")}
                className={` border border-[#23b5b5] text-center px-2 py-1  text-white text-md transition-all duration-300 ${
                  activeTab === "transcript"
                    ? "bg-[#23b5b5] text-white"
                    : "bg-transparent"
                }`}
              >
                Transcript
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={` border border-[#23b5b5] text-center  px-2 py-1  text-white text-md transition-all duration-300 ${
                  activeTab === "summary"
                    ? "bg-[#23b5b5] text-white"
                    : "bg-transparent"
                }`}
              >
                Summarize
              </button>
            </div>
          </div>
        </>
      ) : null}

      {transcript.length !== 0 ||
      summary.length !== 0 ||
      videoData ||
      historyOpen ? null : (
        <>
          <h1 className="text-2xl font-semibold text-center mb-6">
            What can I do?
          </h1>

          <div className="flex gap-16 text-2xl justify-center  mt-16">
            <button
              onClick={() => setActiveTab("transcript")}
              className={` border border-[#23b5b5] text-center px-12 py-8 rounded-md text-white text-md transition-all duration-300 ${
                activeTab === "transcript"
                  ? "bg-gray-700 text-white"
                  : "bg-transparent"
              }`}
            >
              Transcript
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={` border border-[#23b5b5] text-center  px-12 py-8 rounded-md text-white text-md transition-all duration-300 ${
                activeTab === "summary"
                  ? "bg-gray-700 text-white"
                  : "bg-transparent"
              }`}
            >
              Summarize
            </button>
          </div>
        </>
      )}

      {summary.length !== 0 && activeTab === "summary" ? (
        <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto p-4 pb-20 rounded-md space-y-6">
          {summary?.map((item, index) => (
            <SummaryCard key={index} item={item} />
          ))}
        </div>
      ) : null}
      {transcript.length !== 0 && activeTab === "transcript" ? (
        <div className="max-w-6xl mx-auto w-full flex-1 overflow-y-auto p-6">
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-[0.5px] bg-white"></div>

            <div className="space-y-8">
              {transcript?.map((item, index) => (
                <TranscriptCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {loading && (
        <h1 className="max-w-4xl mx-auto w-full text-center flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
          Generating summary...
        </h1>
      )}

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-64  right-0 bg-black z-10">
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
            className={`px-6 py-3 border border-[#23b5b5] ${
              activeTab === "transcript" ? "bg-[#23b5b5]" : null
            } rounded-lg font-semibold flex items-center gap-2 transition ${
              loading ? "opacity-35" : null
            }`}
          >
            Transcript
          </button>

          <button
            onClick={() => getSummary(videoId)}
            disabled={loading}
            className={`px-6 py-3 border border-[#23b5b5] ${
              activeTab === "summary" ? "bg-[#23b5b5]" : null
            } rounded-lg font-semibold flex items-center gap-2 transition ${
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
