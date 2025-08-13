import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Play,
  Clock,
  User,
  History,
  Globe,
  ChevronDown,
  Sparkles,
  FileText,
  Video,
} from "lucide-react";
import axiosInstance from "../../../network/axiosInstance";
// import axios from "axios";
import { useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import TranscriptCard from "./TranscriptCard";
import SummaryCard from "./SummaryCard";
import HistoryCard from "./HistoryCard";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";

const YoutubeSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex flex-col relative min-h-screen bg-black ">
      <div
        className="absolute left-0 top-0 h-full w-6 z-30"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-[#23b5b5]/20 
        flex flex-col justify-between transition-all duration-300 z-50
        ${sidebarOpen ? "w-56 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
              Youtube Summarizer
            </h2>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mb-8">
          <Link to="https://explified.com/youtube-summariser/">
            <button className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#23b5b5]/25">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      <WorkFlowButton id={"ytsummarizer"} />

      <Link to="https://chromewebstore.google.com/detail/vidsum-copilot-for-youtub/jmdecmahfbajaffljohfdlbdmkbngggj">
        <button className="fixed z-[100] top-24 right-4 px-4 py-2 rounded-full bg-white text-black">
          Add Extension
        </button>
      </Link>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#23b5b5]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-[#23b5b5] to-white bg-clip-text text-transparent mb-4">
            YouTube Video Summarizer
          </h1>
          <p className="text-gray-400 text-lg">
            Transform videos into insights with AI-powered summaries
          </p>
        </div>

        {/* History Button */}
        <div className="flex justify-center mb-6">
          <button
            className="group flex items-center gap-2 px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm rounded-xl border border-gray-600/30 hover:border-[#23b5b5]/50 transition-all duration-300 hover:transform hover:scale-105"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="w-4 h-4 text-gray-400 group-hover:text-[#23b5b5] transition-colors" />
            <span className="capitalize text-gray-300 group-hover:text-white transition-colors">
              history
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 group-hover:text-[#23b5b5] transition-all duration-300 ${
                historyOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* History Section Modal */}
      {historyVideos.length !== 0 && historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[#1a1a1a] rounded-lg shadow-lg max-w-4xl w-full mx-4 p-6 overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setHistoryOpen(false)}
              className="absolute top-3 right-3 text-gray-300 hover:text-white"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-[#23b5b5]" />
              Recent Videos
            </h2>

            {/* Video List */}
            <div className="space-y-3">
              {historyVideos.map((item, index) => (
                <HistoryCard
                  key={index}
                  item={item}
                  setVideoId={setVideoId}
                  setVideoUrl={setVideoUrl}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Info Card */}
      {videoData && !historyOpen && (
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 mb-8">
          <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm rounded-2xl border border-gray-600/30 p-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={videoData?.thumbnails?.default?.url}
                  alt="thumbnail"
                  className="rounded-xl border border-gray-600/30 group-hover:border-[#23b5b5]/50 transition-colors"
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-white mb-3 leading-tight">
                  {videoData?.title}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={imageData}
                      alt="channel"
                      className="h-10 w-10 object-cover rounded-full border-2 border-gray-600/30"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#23b5b5] rounded-full border-2 border-black"></div>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">
                      {videoData?.channelTitle}
                    </p>
                    <p className="text-gray-500 text-sm">Content Creator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Controls */}
      {(transcript.length !== 0 || summary.length !== 0 || videoData) && (
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 mb-8">
          <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-600/30">
            <div className="flex bg-gray-900/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("transcript")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "transcript"
                    ? "bg-[#23b5b5] text-white shadow-lg shadow-[#23b5b5]/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Transcript
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "summary"
                    ? "bg-[#23b5b5] text-white shadow-lg shadow-[#23b5b5]/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Summary
              </button>
            </div>

            <div className="relative">
              <select
                value={lang}
                onChange={handleLanguageChange}
                className="appearance-none bg-gray-700/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-gray-600/30 focus:border-[#23b5b5] focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/25 transition-all cursor-pointer min-w-[120px]"
              >
                <option value="">Select Language</option>
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi</option>
              </select>
              <Globe className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      {!(
        transcript.length !== 0 ||
        summary.length !== 0 ||
        videoData ||
        historyOpen
      ) && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              What would you like to do?
            </h2>
            <p className="text-gray-400 text-lg">
              Choose how you want to process your YouTube video
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
            <button
              onClick={() => setActiveTab("transcript")}
              className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 hover:border-[#23b5b5]/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#23b5b5]/10 ${
                activeTab === "transcript"
                  ? "border-[#23b5b5] shadow-lg shadow-[#23b5b5]/25"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#23b5b5]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[#23b5b5]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#23b5b5]/30 transition-colors">
                  <FileText className="w-8 h-8 text-[#23b5b5]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#23b5b5] transition-colors">
                  Full Transcript
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Get the complete text transcript with timestamps
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("summary")}
              className={`group relative overflow-hidden bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-600/30 hover:border-[#23b5b5]/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-[#23b5b5]/10 ${
                activeTab === "summary"
                  ? "border-[#23b5b5] shadow-lg shadow-[#23b5b5]/25"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  AI Summary
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Generate intelligent key points and insights
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Content Areas */}
      {summary.length !== 0 && activeTab === "summary" && (
        <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 px-4 pb-32">
          <div className="space-y-6">
            {summary?.map((item, index) => (
              <SummaryCard key={index} item={item} />
            ))}
          </div>
        </div>
      )}

      {transcript.length !== 0 && activeTab === "transcript" && (
        <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 px-4 pb-32">
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#23b5b5]/50 via-[#23b5b5]/20 to-transparent"></div>
            <div className="space-y-8">
              {transcript?.map((item, index) => (
                <TranscriptCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="relative z-10 flex-1 flex items-center justify-center pb-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-600 border-t-[#23b5b5] rounded-full animate-spin mb-4 mx-auto"></div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Processing Video
            </h2>
            <p className="text-gray-400">Generating your summary...</p>
          </div>
        </div>
      )}

      {/* Fixed Input Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-sm z-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto w-full p-6">
          <div className="flex gap-4 items-center bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/30 shadow-2xl">
            <div className="flex-1 relative">
              <input
                type="text"
                value={videoUrl}
                onChange={handleUrl}
                placeholder="Paste your YouTube URL here..."
                className="w-full p-4 pr-12 rounded-xl bg-gray-900/80 backdrop-blur-sm text-white placeholder-gray-500 border border-gray-600/30 focus:border-[#23b5b5] focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/25 transition-all"
              />
              <Video className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            <button
              onClick={() => getTranscript(videoId)}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                activeTab === "transcript"
                  ? "bg-[#23b5b5] border-[#23b5b5] text-white shadow-lg shadow-[#23b5b5]/25"
                  : "border-[#23b5b5] text-[#23b5b5] hover:bg-[#23b5b5]/10"
              } ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:transform hover:scale-105"
              } disabled:hover:transform-none disabled:hover:scale-100`}
            >
              <FileText className="w-4 h-4" />
              Transcript
            </button>

            <button
              onClick={() => getSummary(videoId)}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                activeTab === "summary"
                  ? "bg-[#23b5b5] border-[#23b5b5] text-white shadow-lg shadow-[#23b5b5]/25"
                  : "border-[#23b5b5] text-[#23b5b5] hover:bg-[#23b5b5]/10"
              } ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:transform hover:scale-105"
              } disabled:hover:transform-none disabled:hover:scale-100`}
            >
              <Sparkles className="w-4 h-4" />
              Summarize
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeSummarizer;
