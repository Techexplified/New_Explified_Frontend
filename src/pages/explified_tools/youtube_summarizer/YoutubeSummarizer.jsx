import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Play,
  Clock,
  User,
  History,
  KeyRound,
  Sparkles,
  FileText,
  Video,
  ArrowRight,
  PanelLeftCloseIcon,
} from "lucide-react";
import axiosInstance from "../../../network/axiosInstance";
import { useSelector } from "react-redux";
import axios from "axios";
import TranscriptCard from "./TranscriptCard";
import SummaryCard from "./SummaryCard";
import HistoryCard from "./HistoryCard";

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
  const [recentHistoryOpen, setRecentHistoryOpen] = useState(false);

  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [rapidApiKeyInput, setRapidApiKeyInput] = useState(
    localStorage.getItem("ytSummarizerRapidApiKey") || ""
  );
  const [geminiApiKeyInput, setGeminiApiKeyInput] = useState(
    localStorage.getItem("ytSummarizerGeminiApiKey") || ""
  );
  const [showRapidApiKey, setShowRapidApiKey] = useState(false);
  const [showGeminiApiKey, setShowGeminiApiKey] = useState(false);

  const videoTranscript = searchParams.get("videoTranscript");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);
  const accessToken = user.accessToken;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/youtube/v3/playlistItems",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              part: "snippet",
              maxResults: 10,
              playlistId: "WL",
            },
          }
        );
        console.log(res);

        const watchHistory = res.data.items;
        console.log(watchHistory);
        setHistoryVideos(watchHistory);
      } catch (error) {
        console.log(error);
      }
    }
    fetchHistory();
  }, [accessToken]);

  useEffect(() => {
    if (!videoIdYt) return;
    getSummary(videoIdYt);
  }, [videoIdYt]);

  function handleUrl(e) {
    const Url = e.target.value.trim();
    setVideoUrl(Url);

    let videoId = "";

    const fullMatch = Url.match(/v=([^&]+)/);
    const shortMatch = Url.match(/youtu\.be\/([^?&]+)/);

    if (fullMatch) {
      videoId = fullMatch[1];
    } else if (shortMatch) {
      videoId = shortMatch[1];
    }

    setVideoId(videoId);
  }

  // Calculate dynamic window size based on video duration
  const calculateDynamicWindowSize = (videoDurationSeconds) => {
    if (videoDurationSeconds <= 300) {
      // 5 minutes or less: 30 second intervals
      return 30;
    } else if (videoDurationSeconds <= 600) {
      // 5-10 minutes: 45 second intervals
      return 45;
    } else if (videoDurationSeconds <= 1200) {
      // 10-20 minutes: 60 second intervals
      return 60;
    } else if (videoDurationSeconds <= 1800) {
      // 20-30 minutes: 90 second intervals
      return 90;
    } else {
      // 30+ minutes: 120 second (2 minute) intervals
      return 120;
    }
  };

  const groupTranscriptByTime = (items, windowSize = 30) => {
    const grouped = [];
    let currentGroup = null;

    for (const item of items) {
      const time = Number(item.start || item.timestamp || 0);
      const text =
        item.subtitle || item.text || item.content || item.transcript || "";

      if (!text.trim()) continue;

      if (!currentGroup || time - currentGroup.startTime >= windowSize) {
        if (currentGroup) {
          grouped.push({
            text: currentGroup.text.trim(),
            timestamp: currentGroup.startTime,
          });
        }

        currentGroup = {
          startTime: time,
          text: text + " ",
        };
      } else {
        currentGroup.text += text + " ";
      }
    }

    if (currentGroup) {
      grouped.push({
        text: currentGroup.text.trim(),
        timestamp: currentGroup.startTime,
      });
    }

    return grouped;
  };

  // Format time helper for summary display
  const formatTimeForSummary = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Generate AI summary from transcript
  const getSummary = async (videoId) => {
    if (!videoId) return;
    setLoading(true);
    setSummary([]);

    const rapidApiKey = localStorage.getItem("ytSummarizerRapidApiKey");
    const geminiApiKey = localStorage.getItem("ytSummarizerGeminiApiKey");

    if (!rapidApiKey) {
      setLoading(false);
      setApiModalOpen(true);
      alert("Please enter your RapidAPI key to generate the summary.");
      return;
    }

    if (!geminiApiKey) {
      setLoading(false);
      setApiModalOpen(true);
      alert("Please enter your Gemini API key to generate the summary.");
      return;
    }

    try {
      // Step 1: Get the transcript first
      const transcriptUrl = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}&lang=en`;
      const transcriptOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "youtube-transcriptor.p.rapidapi.com",
        },
      };

      const transcriptResponse = await fetch(transcriptUrl, transcriptOptions);
      const transcriptResult = await transcriptResponse.text();

      let transcriptData;
      try {
        transcriptData = JSON.parse(transcriptResult);
      } catch (parseError) {
        console.error("Failed to parse transcript response:", parseError);
        throw new Error("Invalid transcript response format");
      }

      if (transcriptData.error || transcriptData.message) {
        console.error("RapidAPI Error:", transcriptData);
        throw new Error(
          transcriptData.message ||
            transcriptData.error ||
            "Failed to get transcript"
        );
      }

      let rawSegments = [];
      if (
        Array.isArray(transcriptData) &&
        transcriptData.length > 0 &&
        Array.isArray(transcriptData[0].transcription)
      ) {
        rawSegments = transcriptData[0].transcription;
      } else if (Array.isArray(transcriptData?.transcription)) {
        rawSegments = transcriptData.transcription;
      }

      // Calculate video duration and dynamic window
      const lastSegment = rawSegments[rawSegments.length - 1];
      const videoDuration = lastSegment
        ? Number(lastSegment.start || lastSegment.timestamp || 0) +
          Number(lastSegment.dur || 0)
        : 0;
      const dynamicWindowSize = calculateDynamicWindowSize(videoDuration);

      // Group transcript by time
      const groupedTranscript = groupTranscriptByTime(
        rawSegments,
        dynamicWindowSize
      );

      // Step 2: Generate summaries for each chunk using Gemini
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const summaries = [];

      // Process in chunks of ~5 transcript segments for better summaries
      const chunkSize = 5;
      for (let i = 0; i < groupedTranscript.length; i += chunkSize) {
        const chunk = groupedTranscript.slice(i, i + chunkSize);
        const startTime = formatTimeForSummary(chunk[0]?.timestamp || 0);
        const endTime = formatTimeForSummary(
          chunk[chunk.length - 1]?.timestamp || 0
        );
        const combinedText = chunk.map((item) => item.text).join(" ");

        const prompt = `You're an AI assistant. Summarize the following content spoken between timestamps ${startTime} and ${endTime}.
        TEXT:
        ${combinedText}
        Return a short and clear summary in 2-3 sentences.`;

        try {
          const response = await model.generateContent(prompt);
          const summaryText = response.response.text();
          summaries.push({
            timestamp: chunk[0]?.timestamp || 0,
            text: summaryText,
            timeRange: `${startTime} - ${endTime}`,
          });
        } catch (geminiError) {
          console.error("Gemini API Error:", geminiError);
          summaries.push({
            timestamp: chunk[0]?.timestamp || 0,
            text: "Summary generation failed for this segment.",
            timeRange: `${startTime} - ${endTime}`,
          });
        }
      }

      // Store video metadata in history
      const youtubeApiKey = import.meta.env.VITE_YT_THUMBNAIL_API_KEY;
      if (!youtubeApiKey) {
        console.warn("YouTube API key not found, skipping video metadata");
        const newData = {
          videoId,
          profile: null,
          thumbnail: null,
          chanelId: "",
          channelTitle: "Unknown Channel",
          title: `Video ${videoId}`,
        };

        let storedArray =
          JSON.parse(localStorage.getItem("summarize-history")) || [];
        storedArray.push(newData);
        localStorage.setItem("summarize-history", JSON.stringify(storedArray));

        setHistoryVideos((prev) => [...prev, newData]);
        setVideoData({
          title: `Video ${videoId}`,
          channelTitle: "Unknown Channel",
          thumbnails: { default: { url: null } },
        });
        setImageData(null);
      } else {
        // Get full video metadata
        const response2 = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
        );
        const chanelId = response2?.data?.items[0]?.snippet.channelId;
        const response3 = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${chanelId}&key=${youtubeApiKey}`
        );

        const newData = {
          videoId,
          profile: response3?.data?.items[0]?.snippet?.thumbnails?.default?.url,
          thumbnail:
            response2?.data?.items[0]?.snippet.thumbnails?.default?.url,
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
      }

      setSummary(summaries);
      setActiveTab("summary");
      setVideoUrl("");
      setVideoId("");
      setHistoryOpen(false);
    } catch (err) {
      console.error("Summary Error:", err);
      alert(
        "Failed to generate summary. Please check your API keys and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getTranscript = async (videoId) => {
    if (!videoId) return;
    setLoading(true);
    setTranscript([]);

    const rapidApiKey = localStorage.getItem("ytSummarizerRapidApiKey");

    if (!rapidApiKey) {
      setLoading(false);
      setApiModalOpen(true);
      alert("Please enter your RapidAPI key to get the transcript.");
      return;
    }

    try {
      const url = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}&lang=en`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": rapidApiKey,
          "x-rapidapi-host": "youtube-transcriptor.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const result = await response.text();

      let transcriptData;
      try {
        transcriptData = JSON.parse(result);
      } catch (parseError) {
        console.error("Failed to parse transcript response:", parseError);
        throw new Error("Invalid transcript response format");
      }

      if (transcriptData.error || transcriptData.message) {
        console.error("RapidAPI Error:", transcriptData);
        throw new Error(
          transcriptData.message ||
            transcriptData.error ||
            "Failed to get transcript"
        );
      }

      const youtubeApiKey = import.meta.env.VITE_YT_THUMBNAIL_API_KEY;
      if (!youtubeApiKey) {
        console.warn("YouTube API key not found, skipping video metadata");
        const newData = {
          videoId,
          profile: null,
          thumbnail: null,
          chanelId: "",
          channelTitle: "Unknown Channel",
          title: `Video ${videoId}`,
        };

        let storedArray =
          JSON.parse(localStorage.getItem("summarize-history")) || [];
        storedArray.push(newData);
        localStorage.setItem("summarize-history", JSON.stringify(storedArray));

        setHistoryVideos((prev) => [...prev, newData]);
        setVideoData({
          title: `Video ${videoId}`,
          channelTitle: "Unknown Channel",
          thumbnails: { default: { url: null } },
        });
        setImageData(null);
      } else {
        // Get full video metadata
        const response2 = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`
        );
        const chanelId = response2?.data?.items[0]?.snippet.channelId;
        const response3 = await axios.get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${chanelId}&key=${youtubeApiKey}`
        );

        const newData = {
          videoId,
          profile: response3?.data?.items[0]?.snippet?.thumbnails?.default?.url,
          thumbnail:
            response2?.data?.items[0]?.snippet.thumbnails?.default?.url,
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
      }

      let rawSegments = [];

      if (
        Array.isArray(transcriptData) &&
        transcriptData.length > 0 &&
        Array.isArray(transcriptData[0].transcription)
      ) {
        rawSegments = transcriptData[0].transcription;
      } else if (Array.isArray(transcriptData?.transcription)) {
        rawSegments = transcriptData.transcription;
      }

      // Calculate video duration from last transcript segment
      const lastSegment = rawSegments[rawSegments.length - 1];
      const videoDuration = lastSegment
        ? Number(lastSegment.start || lastSegment.timestamp || 0) +
          Number(lastSegment.dur || 0)
        : 0;
      const dynamicWindowSize = calculateDynamicWindowSize(videoDuration);

      const groupedTranscript = groupTranscriptByTime(
        rawSegments,
        dynamicWindowSize
      );

      setTranscript(groupedTranscript);
      setActiveTab("transcript");
      setVideoUrl("");
      setVideoId("");
      setHistoryOpen(false);
    } catch (err) {
      console.error("Transcript Error:", err);
      alert(
        "Failed to get transcript. Please check your API key and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  function handleGenerate() {
    if (!activeTab) return;

    activeTab === "transcript" ? getTranscript(videoId) : getSummary(videoId);
  }

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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-minimal-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-minimal-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-30 pt-8 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-minimal-primary to-white bg-clip-text text-transparent mb-4">
            YouTube Video Summarizer
          </h1>
          <p className="text-minimal-muted text-lg">
            Transform videos into insights with AI-powered summaries
          </p>
        </div>

        <div className="absolute top-44 left-20 z-40">
          <button
            onClick={() => setRecentHistoryOpen(!recentHistoryOpen)}
            className={`p-3 rounded-xl border backdrop-blur-md transition-all duration-300 shadow-lg ${
              recentHistoryOpen
                ? "bg-minimal-primary border-minimal-primary text-white scale-110"
                : "bg-minimal-dark-100/80 border-minimal-border text-minimal-muted hover:border-minimal-primary/50 hover:text-white"
            }`}
            title="Recent History"
          >
            <History className="w-4 h-4" />
          </button>

          {recentHistoryOpen && (
            <div className="absolute top-0 left-16 w-80 bg-minimal-dark-100/90 backdrop-blur-xl rounded-2xl border border-minimal-border p-5 shadow-2xl animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-minimal-muted uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-minimal-primary" />
                  Recent Activity
                </h3>
                <button
                  onClick={() => setRecentHistoryOpen(false)}
                  className="text-minimal-muted hover:text-white p-1 hover:bg-minimal-dark-100 hover:rounded-full transition-all duration-300"
                  title="Close"
                >
                  <PanelLeftCloseIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {[...historyVideos]
                  .slice(-3)
                  .reverse()
                  .map((video, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setVideoId(video.videoId);
                        setVideoUrl(
                          `https://www.youtube.com/watch?v=${video.videoId}`
                        );
                        setRecentHistoryOpen(false);
                      }}
                      className="flex gap-4 cursor-pointer hover:bg-white/5 p-2.5 rounded-xl transition-all group"
                    >
                      <div className="relative w-20 h-12 shrink-0 overflow-hidden rounded-lg border border-minimal-border/50">
                        <img
                          src={
                            video.thumbnail ||
                            "https://via.placeholder.com/320x180"
                          }
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-minimal-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <p className="text-[13px] text-minimal-gray-300 line-clamp-2 font-medium leading-tight group-hover:text-white transition-colors">
                          {video.title}
                        </p>
                      </div>
                    </div>
                  ))}

                {historyVideos.length === 0 && (
                  <div className="text-center py-6">
                    <History className="w-8 h-8 text-minimal-muted mx-auto mb-2 opacity-20" />
                    <p className="text-xs text-minimal-muted">
                      Your search history is empty
                    </p>
                  </div>
                )}
              </div>

              {historyVideos.length > 0 && (
                <button
                  onClick={() => {
                    setHistoryOpen(true);
                    setRecentHistoryOpen(false);
                  }}
                  className="w-full mt-5 flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-minimal-primary/10 hover:bg-minimal-primary rounded-xl border border-minimal-primary/20 hover:border-minimal-primary transition-all active:scale-[0.98]"
                >
                  View Full History
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* History Section Modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="relative bg-minimal-dark-100 border border-minimal-border rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-minimal-border bg-minimal-dark-200/50">
              <h2 className="text-xl font-semibold text-white flex items-center gap-3">
                <History className="w-6 h-6 text-minimal-primary" />
                Recent Summaries
              </h2>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-minimal-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {historyVideos.length > 0 ? (
                historyVideos.map((item, index) => (
                  <HistoryCard
                    key={index}
                    item={item}
                    setVideoId={setVideoId}
                    setVideoUrl={setVideoUrl}
                    onClose={() => setHistoryOpen(false)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <History className="w-12 h-12 text-minimal-muted mx-auto mb-4 opacity-20" />
                  <p className="text-minimal-muted">No history found yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {apiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-minimal-card rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <button
              onClick={() => setApiModalOpen(false)}
              className="absolute top-3 right-3 text-minimal-gray-300 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold text-minimal-white mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-minimal-primary" /> Enter API
              Keys
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showRapidApiKey ? "text" : "password"}
                  value={rapidApiKeyInput}
                  onChange={(e) => setRapidApiKeyInput(e.target.value)}
                  placeholder="Paste your Rapid API key"
                  className="w-full p-4 pr-24 rounded-xl bg-minimal-dark-200/80 backdrop-blur-sm text-white placeholder-minimal-muted border border-minimal-border focus:border-minimal-primary focus:outline-none focus:ring-2 focus:ring-minimal-primary/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRapidApiKey((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-minimal-muted hover:text-white text-sm px-3 py-1 rounded-lg border border-minimal-border hover:border-minimal-primary/50"
                >
                  {showRapidApiKey ? "Hide" : "Show"}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showGeminiApiKey ? "text" : "password"}
                  value={geminiApiKeyInput}
                  onChange={(e) => setGeminiApiKeyInput(e.target.value)}
                  placeholder="Paste your Gemini API key"
                  className="w-full p-4 pr-24 rounded-xl bg-minimal-dark-200/80 backdrop-blur-sm text-white placeholder-minimal-muted border border-minimal-border focus:border-minimal-primary focus:outline-none focus:ring-2 focus:ring-minimal-primary/25 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiApiKey((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-minimal-muted hover:text-white text-sm px-3 py-1 rounded-lg border border-minimal-border hover:border-minimal-primary/50"
                >
                  {showGeminiApiKey ? "Hide" : "Show"}
                </button>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setApiModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-minimal-dark-100/80 text-minimal-gray-300 border border-minimal-border hover:text-white hover:border-minimal-primary/50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const rapidTrimmed = rapidApiKeyInput.trim();
                    const geminiTrimmed = geminiApiKeyInput.trim();
                    if (rapidTrimmed) {
                      localStorage.setItem(
                        "ytSummarizerRapidApiKey",
                        rapidTrimmed
                      );
                    } else {
                      localStorage.removeItem("ytSummarizerRapidApiKey");
                    }
                    if (geminiTrimmed) {
                      localStorage.setItem(
                        "ytSummarizerGeminiApiKey",
                        geminiTrimmed
                      );
                    } else {
                      localStorage.removeItem("ytSummarizerGeminiApiKey");
                    }
                    setApiModalOpen(false);
                  }}
                  disabled={
                    !rapidApiKeyInput.trim() && !geminiApiKeyInput.trim()
                  }
                  className={`px-4 py-2 rounded-lg border-2 ${
                    rapidApiKeyInput.trim() || geminiApiKeyInput.trim()
                      ? "bg-minimal-primary border-minimal-primary text-white"
                      : "border-minimal-primary text-minimal-primary opacity-50 cursor-not-allowed"
                  }`}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Info Card */}
      {videoData && !historyOpen && (
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 mb-8">
          <div className="bg-gradient-to-r from-minimal-dark-100/80 to-minimal-dark-100 backdrop-blur-sm rounded-2xl border border-minimal-border p-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className="relative group">
                {videoData?.thumbnails?.default?.url ? (
                  <img
                    src={videoData.thumbnails.default.url}
                    alt="thumbnail"
                    className="rounded-xl border border-minimal-border group-hover:border-minimal-primary/50 transition-colors"
                  />
                ) : (
                  <div className="w-full h-24 bg-minimal-dark-200 rounded-xl border border-minimal-border flex items-center justify-center">
                    <Video className="w-8 h-8 text-minimal-muted" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-minimal-white mb-3 leading-tight">
                  {videoData?.title}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {imageData ? (
                      <img
                        src={imageData}
                        alt="channel"
                        className="h-10 w-10 object-cover rounded-full border-2 border-minimal-border"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-minimal-dark-200 rounded-full border-2 border-minimal-border flex items-center justify-center">
                        <User className="w-5 h-5 text-minimal-muted" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-minimal-primary rounded-full border-2 border-black"></div>
                  </div>
                  <div>
                    <p className="text-minimal-gray-300 font-medium">
                      {videoData?.channelTitle}
                    </p>
                    <p className="text-minimal-muted text-sm">
                      Content Creator
                    </p>
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
          <div className="flex items-center justify-between bg-minimal-dark-100/50 backdrop-blur-sm rounded-2xl p-2 border border-minimal-border">
            <div className="flex bg-minimal-dark-200/50 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("transcript")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "transcript"
                    ? "bg-minimal-primary text-white shadow-lg shadow-minimal-primary/25"
                    : "text-minimal-muted hover:text-white hover:bg-minimal-dark-100/50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Transcript
              </button>
              <button
                onClick={() => setActiveTab("summary")}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === "summary"
                    ? "bg-minimal-primary text-white shadow-lg shadow-minimal-primary/25"
                    : "text-minimal-muted hover:text-white hover:bg-minimal-dark-100/50"
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
                className="appearance-none bg-minimal-dark-100/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-minimal-border focus:border-minimal-primary focus:outline-none focus:ring-2 focus:ring-minimal-primary/25 transition-all cursor-pointer min-w-[120px]"
              >
                <option value="">Select Language</option>
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 Hindi</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="relative z-10 flex-1 flex items-center justify-center pb-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-minimal-gray-600 border-t-minimal-primary rounded-full animate-spin mb-4 mx-auto"></div>
            <h2 className="text-xl font-semibold text-minimal-white mb-2">
              Processing Video
            </h2>
            <p className="text-minimal-muted">Generating your summary...</p>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      {!(
        transcript.length !== 0 ||
        summary.length !== 0 ||
        videoData ||
        historyOpen ||
        loading
      ) && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-32">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold text-minimal-white mb-4">
              What would you like to do?
            </h2>
            <p className="text-minimal-muted text-lg">
              Choose how you want to process your YouTube video
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
            <button
              onClick={() => setActiveTab("transcript")}
              className={`group relative overflow-hidden bg-minimal-dark-100 backdrop-blur-sm border border-minimal-border hover:border-minimal-primary/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-minimal-primary/10 ${
                activeTab === "transcript"
                  ? "border-minimal-primary shadow-lg shadow-minimal-primary/25"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-start gap-5">
                <div className="shrink-0 w-16 h-16 bg-minimal-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-minimal-primary/30 transition-colors">
                  <FileText className="w-8 h-8 text-minimal-primary" />
                </div>

                <div className="flex flex-col text-left">
                  <h3 className="text-xl font-semibold text-minimal-white mb-1 group-hover:text-minimal-primary transition-colors">
                    Full Transcript
                  </h3>
                  <p className="text-minimal-muted group-hover:text-minimal-gray-300 transition-colors">
                    Get the complete text transcript with timestamps
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("summary")}
              className={`group relative overflow-hidden bg-minimal-dark-100 backdrop-blur-sm border border-minimal-border hover:border-minimal-primary/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-minimal-primary/10 ${
                activeTab === "summary"
                  ? "border-minimal-primary shadow-lg shadow-minimal-primary/25"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 flex items-start gap-5">
                <div className="shrink-0 w-16 h-16 bg-minimal-primary/20 rounded-2xl flex items-center justify-center group-hover:bg-minimal-primary/30 transition-colors">
                  <Sparkles className="w-8 h-8 text-minimal-primary" />
                </div>

                <div className="flex flex-col text-left">
                  <h3 className="text-xl font-semibold text-minimal-white mb-1 group-hover:text-minimal-primary transition-colors">
                    AI Summary
                  </h3>
                  <p className="text-minimal-muted group-hover:text-minimal-gray-300 transition-colors">
                    Generate intelligent key points and insights
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Content Areas */}
      {summary.length !== 0 && activeTab === "summary" && (
        <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 px-4 pb-32">
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-minimal-primary/50 via-minimal-primary/20 to-transparent"></div>
            <div className="space-y-8">
              {summary?.map((item, index) => (
                <SummaryCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {transcript.length !== 0 && activeTab === "transcript" && (
        <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 px-4 pb-32">
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-minimal-primary/50 via-minimal-primary/20 to-transparent"></div>
            <div className="space-y-8">
              {transcript?.map((item, index) => (
                <TranscriptCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-sm z-20 border-t border-minimal-border/50">
        <div className="max-w-4xl mx-auto w-full p-6">
          <div className="flex gap-4 items-center bg-minimal-dark-100 backdrop-blur-sm rounded-2xl p-4 border border-minimal-border shadow-2xl">
            <div className="flex-1 relative">
              <input
                type="text"
                value={videoUrl}
                onChange={handleUrl}
                placeholder="Paste your YouTube URL here..."
                className="w-full p-4 pr-12 rounded-xl bg-minimal-dark-200/80 backdrop-blur-sm text-white placeholder-minimal-muted border border-minimal-border focus:border-minimal-primary focus:outline-none focus:ring-2 focus:ring-minimal-primary/25 transition-all"
              />
            </div>
            <button
              onClick={() => setApiModalOpen(true)}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-minimal-primary text-minimal-primary hover:bg-minimal-primary/10
               ${
                 loading
                   ? "opacity-50 cursor-not-allowed"
                   : "hover:transform hover:scale-105"
               } disabled:hover:transform-none disabled:hover:scale-100`}
            >
              <KeyRound className="w-4 h-4" />
              API
            </button>

            <button
              onClick={handleGenerate}
              disabled={loading || !videoId}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                activeTab
                  ? "bg-minimal-primary border-minimal-primary text-white shadow-lg shadow-minimal-primary/25"
                  : "border-minimal-primary text-minimal-primary hover:bg-minimal-primary/10"
              } ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:transform hover:scale-105"
              } disabled:hover:transform-none disabled:hover:scale-100`}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeSummarizer;
