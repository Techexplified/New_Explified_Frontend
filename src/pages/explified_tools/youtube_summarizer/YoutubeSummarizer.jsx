import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Play,
  Clock,
  User,
  History,
  KeyRound,
  Globe,
  ChevronDown,
  Sparkles,
  FileText,
  Video,
  ArrowBigDown,
  ArrowRight,
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
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";

const YoutubeSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [transcript, setTranscript] = useState([]);
  const [rawTranscriptData, setRawTranscriptData] = useState(null);
  const [videoData, setVideoData] = useState();
  const [imageData, setImageData] = useState();
  const [searchParams] = useSearchParams();
  const videoIdYt = searchParams.get("videoId");
  const [activeTab, setActiveTab] = useState("");
  const [lang, setLang] = useState("en");
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyVideos, setHistoryVideos] = useState(
    JSON.parse(localStorage.getItem("summarize-history")) || []
  );

  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [rapidApiKeyInput, setRapidApiKeyInput] = useState(
    localStorage.getItem("ytSummarizerRapidApiKey") || ""
  );
  const [summarizerApiKeyInput, setSummarizerApiKeyInput] = useState(
    localStorage.getItem("ytSummarizerApiKey") || ""
  );
  const [showRapidApiKey, setShowRapidApiKey] = useState(false);
  const [showSummarizerApiKey, setShowSummarizerApiKey] = useState(false);

  // const videoTranscript = searchParams.get("videoTranscript");
  const navigate = useNavigate();

  const user = useSelector((state) => state.user);

  // Helper function to get video summary using RapidAPI
  const getVideoSummaryFromRapidAPI = async (videoId) => {
    try {
      // Get the user-provided summarizer API key from localStorage
      const userSummarizerApiKey = localStorage.getItem("ytSummarizerApiKey");
      const summarizerApiKey =
        userSummarizerApiKey ||
        "d24ee5d821msh84ace82205c9be4p13042ejsn6a9b367a3649";

      const url = `https://youtube-video-summarizer-gpt-ai.p.rapidapi.com/api/v1/get-transcript-v2?video_id=${videoId}&platform=youtube`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube-video-summarizer-gpt-ai.p.rapidapi.com",
          "x-rapidapi-key": summarizerApiKey,
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();

      console.log("RapidAPI Summary Response:", result);

      if (result && result.summary) {
        // Format the summary response to match the expected structure
        return {
          content: result.summary,
          type: "summary",
        };
      } else if (result && result.transcript) {
        // If we get transcript instead of summary, we can still use it
        return {
          content: result.transcript,
          type: "transcript",
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching video summary from RapidAPI:", error);
      return null;
    }
  };

  // Helper function to fetch video information using RapidAPI
  const fetchVideoInfoFromRapidAPI = async (videoId) => {
    try {
      // Get the user-provided RapidAPI key from localStorage
      const userRapidApiKey = localStorage.getItem("ytSummarizerRapidApiKey");
      const rapidApiKey =
        userRapidApiKey || "cb3f919c25mshe7e6383f6f24ab8p12fd16jsn654b897e1185";

      const url = `https://youtube-video-information1.p.rapidapi.com/api/youtube?video_id=${videoId}`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube-video-information1.p.rapidapi.com",
          "x-rapidapi-key": rapidApiKey,
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();

      console.log("RapidAPI Video Info Response:", result);

      if (result) {
        // Handle the new response structure
        return {
          title: result.title || `Video ${videoId}`,
          channelTitle: result.channel_title || "Unknown Channel",
          thumbnails: {
            default: {
              url: result.thumbnail || null,
            },
          },
          channelId: result.channel_id || "",
          description: result.description || "",
          duration: result.duration || "0",
          viewCount: result.view_count || "0",
          likeCount: result.like_count || "0",
          publishedAt: result.published_at || "",
          categoryId: result.category_id || "",
        };
      }

      return null;
    } catch (error) {
      console.error("Error fetching video info from RapidAPI:", error);
      return null;
    }
  };
  // console.log("user", user);
  // const accessToken = user.accessToken;

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!videoIdYt) return;
    getSummary(videoIdYt);
  }, [videoIdYt]);

  function handleUrl(e) {
    const Url = e.target.value.trim();
    setVideoUrl(Url);

    let videoId = "";

    // Case 1: Full YouTube URL (with ?v=)
    const fullMatch = Url.match(/v=([^&]+)/);

    // Case 2: Short youtu.be URL
    const shortMatch = Url.match(/youtu\.be\/([^?&]+)/);

    if (fullMatch) {
      videoId = fullMatch[1];
    } else if (shortMatch) {
      videoId = shortMatch[1];
    }

    setVideoId(videoId); // either the ID or ""
  }

  const getSummary = async (videoId) => {
    if (!videoId) return;
    setLoading(true);
    setSummary("");
    try {
      // Try RapidAPI summarizer first
      const rapidApiSummary = await getVideoSummaryFromRapidAPI(videoId);

      if (rapidApiSummary && rapidApiSummary.content) {
        // Use RapidAPI summary
        let content = rapidApiSummary.content;

        // If it's a string, convert to array format for consistency
        if (typeof content === "string") {
          content = [{ content: content, type: "summary" }];
        }

        setSummary(content);
        setActiveTab("summary");
        setVideoUrl("");
        setVideoId("");
        setHistoryOpen(false);

        // Get video metadata
        const rapidApiVideoInfo = await fetchVideoInfoFromRapidAPI(videoId);
        if (rapidApiVideoInfo) {
          const newData = {
            videoId,
            profile: null,
            thumbnail: rapidApiVideoInfo.thumbnails.default.url,
            chanelId: rapidApiVideoInfo.channelId,
            channelTitle: rapidApiVideoInfo.channelTitle,
            title: rapidApiVideoInfo.title,
            viewCount: rapidApiVideoInfo.viewCount,
            likeCount: rapidApiVideoInfo.likeCount,
            duration: rapidApiVideoInfo.duration,
            publishedAt: rapidApiVideoInfo.publishedAt,
          };

          let storedArray =
            JSON.parse(localStorage.getItem("summarize-history")) || [];
          storedArray.push(newData);
          localStorage.setItem(
            "summarize-history",
            JSON.stringify(storedArray)
          );
          setHistoryVideos((prev) => [...prev, newData]);
          setVideoData(rapidApiVideoInfo);
          setImageData(null);
        }

        setLoading(false);
        return;
      }

      // Fallback to original API if RapidAPI fails
      const response = await axiosInstance.post("api/ytSummarize/summary", {
        videoId,
      });

      // Get video metadata from YouTube API - handle missing API key
      const youtubeApiKey = import.meta.env.VITE_YT_THUMBNAIL_API_KEY;
      if (!youtubeApiKey) {
        console.warn(
          "YouTube API key not found, trying RapidAPI for video metadata"
        );

        // Try to get video info from RapidAPI
        const rapidApiVideoInfo = await fetchVideoInfoFromRapidAPI(videoId);

        if (rapidApiVideoInfo) {
          // Use RapidAPI data
          const newData = {
            videoId,
            profile: null, // RapidAPI doesn't provide channel profile image
            thumbnail: rapidApiVideoInfo.thumbnails.default.url,
            chanelId: rapidApiVideoInfo.channelId,
            channelTitle: rapidApiVideoInfo.channelTitle,
            title: rapidApiVideoInfo.title,
            viewCount: rapidApiVideoInfo.viewCount,
            likeCount: rapidApiVideoInfo.likeCount,
            duration: rapidApiVideoInfo.duration,
            publishedAt: rapidApiVideoInfo.publishedAt,
          };

          let storedArray =
            JSON.parse(localStorage.getItem("summarize-history")) || [];
          storedArray.push(newData);
          localStorage.setItem(
            "summarize-history",
            JSON.stringify(storedArray)
          );

          setHistoryVideos((prev) => [...prev, newData]);
          setVideoData(rapidApiVideoInfo);
          setImageData(null); // No channel profile image from RapidAPI
        } else {
          // Fallback to basic data if RapidAPI also fails
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
          localStorage.setItem(
            "summarize-history",
            JSON.stringify(storedArray)
          );

          setHistoryVideos((prev) => [...prev, newData]);
          setVideoData({
            title: `Video ${videoId}`,
            channelTitle: "Unknown Channel",
            thumbnails: { default: { url: null } },
          });
          setImageData(null);
        }
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
      // Call RapidAPI YouTube captions/transcript service
      const url = `https://youtube-captions-transcript-subtitles-video-combiner.p.rapidapi.com/download-all/${videoId}?format_subtitle=srt&format_answer=json`;
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key":
            "cb3f919c25mshe7e6383f6f24ab8p12fd16jsn654b897e1185",
          "x-rapidapi-host":
            "youtube-captions-transcript-subtitles-video-combiner.p.rapidapi.com",
        },
      };

      const response = await fetch(url, options);
      const result = await response.json();

      // Parse the transcript result
      let transcriptData = result;
      console.log("Raw RapidAPI response:", transcriptData);

      // Check if the response indicates an error
      if (transcriptData.error || transcriptData.message) {
        console.error("RapidAPI Error:", transcriptData);
        throw new Error(
          transcriptData.message ||
            transcriptData.error ||
            "Failed to get transcript"
        );
      }

      // Get video metadata from YouTube API - handle missing API key
      const youtubeApiKey = import.meta.env.VITE_YT_THUMBNAIL_API_KEY;
      if (!youtubeApiKey) {
        console.warn(
          "YouTube API key not found, trying RapidAPI for video metadata"
        );

        // Try to get video info from RapidAPI
        const rapidApiVideoInfo = await fetchVideoInfoFromRapidAPI(videoId);

        if (rapidApiVideoInfo) {
          // Use RapidAPI data
          const newData = {
            videoId,
            profile: null, // RapidAPI doesn't provide channel profile image
            thumbnail: rapidApiVideoInfo.thumbnails.default.url,
            chanelId: rapidApiVideoInfo.channelId,
            channelTitle: rapidApiVideoInfo.channelTitle,
            title: rapidApiVideoInfo.title,
            viewCount: rapidApiVideoInfo.viewCount,
            likeCount: rapidApiVideoInfo.likeCount,
            duration: rapidApiVideoInfo.duration,
            publishedAt: rapidApiVideoInfo.publishedAt,
          };

          let storedArray =
            JSON.parse(localStorage.getItem("summarize-history")) || [];
          storedArray.push(newData);
          localStorage.setItem(
            "summarize-history",
            JSON.stringify(storedArray)
          );

          setHistoryVideos((prev) => [...prev, newData]);
          setVideoData(rapidApiVideoInfo);
          setImageData(null); // No channel profile image from RapidAPI
        } else {
          // Fallback to basic data if RapidAPI also fails
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
          localStorage.setItem(
            "summarize-history",
            JSON.stringify(storedArray)
          );

          setHistoryVideos((prev) => [...prev, newData]);
          setVideoData({
            title: `Video ${videoId}`,
            channelTitle: "Unknown Channel",
            thumbnails: { default: { url: null } },
          });
          setImageData(null);
        }
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

      // Set transcript data - convert RapidAPI response to expected format
      let formattedTranscript = [];

      // Helper function to convert SRT timestamp to seconds
      const srtTimeToSeconds = (srtTime) => {
        const [time, ms] = srtTime.split(",");
        const [hours, minutes, seconds] = time.split(":").map(Number);
        return hours * 3600 + minutes * 60 + seconds + ms / 1000;
      };

      // Helper function to parse SRT format subtitle text
      const parseSrtSubtitle = (srtText) => {
        const entries = [];
        const lines = srtText.split("\n");
        let currentEntry = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Check if line is a number (entry index)
          if (/^\d+$/.test(line)) {
            if (currentEntry) {
              entries.push(currentEntry);
            }
            currentEntry = { index: parseInt(line), text: "", timestamp: 0 };
          }
          // Check if line contains timestamp (format: 00:00:07,180 --> 00:00:13,980)
          else if (line.includes("-->")) {
            if (currentEntry) {
              const [startTime] = line.split(" --> ");
              currentEntry.timestamp = srtTimeToSeconds(startTime.trim());
            }
          }
          // Check if line contains text content
          else if (
            line &&
            currentEntry &&
            !line.includes("[") &&
            !line.includes("]")
          ) {
            currentEntry.text += (currentEntry.text ? " " : "") + line;
          }
        }

        // Add the last entry
        if (currentEntry && currentEntry.text) {
          entries.push(currentEntry);
        }

        return entries;
      };

      if (transcriptData && typeof transcriptData === "object") {
        // Handle new RapidAPI response structure - array of language objects
        if (Array.isArray(transcriptData)) {
          console.log(
            "Transcript data is an array with",
            transcriptData.length,
            "languages"
          );

          // Store available languages and raw data
          const languages = transcriptData.map((item) => item.languageCode);
          setAvailableLanguages(languages);
          setRawTranscriptData(transcriptData);
          console.log("Available languages:", languages);

          // Find selected language or default to English
          let selectedLanguage =
            transcriptData.find((item) => item.languageCode === lang) ||
            transcriptData.find((item) => item.languageCode === "en") ||
            transcriptData[0];

          if (selectedLanguage && selectedLanguage.subtitle) {
            console.log("Using language:", selectedLanguage.languageCode);
            console.log(
              "First part of subtitle:",
              selectedLanguage.subtitle.substring(0, 200)
            );

            // Parse the SRT format subtitle text
            const parsedEntries = parseSrtSubtitle(selectedLanguage.subtitle);
            formattedTranscript = parsedEntries.map((entry) => ({
              text: entry.text,
              timestamp: entry.timestamp,
            }));

            console.log(
              "Parsed",
              formattedTranscript.length,
              "transcript entries"
            );
          }
        }
        // Handle other possible response structures (fallback)
        else if (
          transcriptData.subtitles &&
          Array.isArray(transcriptData.subtitles)
        ) {
          console.log("First transcript item:", transcriptData.subtitles[0]);
          formattedTranscript = transcriptData.subtitles.map((item, index) => {
            const text =
              item.text || item.content || item.subtitle || "No text available";
            return {
              text,
              timestamp:
                item.start || item.timestamp || item.time || item.offset || 0,
            };
          });
        } else if (
          transcriptData.transcript &&
          Array.isArray(transcriptData.transcript)
        ) {
          console.log("First transcript item:", transcriptData.transcript[0]);
          formattedTranscript = transcriptData.transcript.map((item, index) => {
            const text =
              item.text || item.content || item.subtitle || "No text available";
            return {
              text,
              timestamp:
                item.start || item.timestamp || item.time || item.offset || 0,
            };
          });
        } else if (transcriptData.text) {
          // If it's a single text response, convert to array format
          formattedTranscript = [
            {
              text: transcriptData.text,
              timestamp: 0,
            },
          ];
        } else {
          // Fallback: try to extract any text content
          console.log("Raw transcript data:", transcriptData);
          formattedTranscript = [
            {
              text: JSON.stringify(transcriptData),
              timestamp: 0,
            },
          ];
        }
      }

      setTranscript(formattedTranscript);
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

  // Function to switch transcript language
  const switchTranscriptLanguage = (languageCode) => {
    if (!rawTranscriptData || !Array.isArray(rawTranscriptData)) return;

    const selectedLanguage = rawTranscriptData.find(
      (item) => item.languageCode === languageCode
    );

    if (selectedLanguage && selectedLanguage.subtitle) {
      console.log("Switching to language:", selectedLanguage.languageCode);

      // Parse the SRT format subtitle text
      const parseSrtSubtitle = (srtText) => {
        const entries = [];
        const lines = srtText.split("\n");
        let currentEntry = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          // Check if line is a number (entry index)
          if (/^\d+$/.test(line)) {
            if (currentEntry) {
              entries.push(currentEntry);
            }
            currentEntry = { index: parseInt(line), text: "", timestamp: 0 };
          }
          // Check if line contains timestamp (format: 00:00:07,180 --> 00:00:13,980)
          else if (line.includes("-->")) {
            if (currentEntry) {
              const [startTime] = line.split(" --> ");
              const srtTimeToSeconds = (srtTime) => {
                const [time, ms] = srtTime.split(",");
                const [hours, minutes, seconds] = time.split(":").map(Number);
                return hours * 3600 + minutes * 60 + seconds + ms / 1000;
              };
              currentEntry.timestamp = srtTimeToSeconds(startTime.trim());
            }
          }
          // Check if line contains text content
          else if (
            line &&
            currentEntry &&
            !line.includes("[") &&
            !line.includes("]")
          ) {
            currentEntry.text += (currentEntry.text ? " " : "") + line;
          }
        }

        // Add the last entry
        if (currentEntry && currentEntry.text) {
          entries.push(currentEntry);
        }

        return entries;
      };

      const parsedEntries = parseSrtSubtitle(selectedLanguage.subtitle);
      const formattedTranscript = parsedEntries.map((entry) => ({
        text: entry.text,
        timestamp: entry.timestamp,
      }));

      setTranscript(formattedTranscript);
      console.log(
        "Switched to",
        formattedTranscript.length,
        "transcript entries"
      );
    }
  };

  // Helper function to get language display info
  const getLanguageInfo = (code) => {
    const languageMap = {
      ar: { name: "Arabic", flag: "🇸🇦" },
      "zh-CN": { name: "Chinese (Simplified)", flag: "🇨🇳" },
      en: { name: "English", flag: "🇺🇸" },
      "en-GB": { name: "English (UK)", flag: "🇬🇧" },
      el: { name: "Greek", flag: "🇬🇷" },
      pt: { name: "Portuguese", flag: "🇵🇹" },
      es: { name: "Spanish", flag: "🇪🇸" },
      tr: { name: "Turkish", flag: "🇹🇷" },
    };
    return languageMap[code] || { name: code, flag: "🌐" };
  };

  const handleLanguageChange = async (e) => {
    const language = e.target.value;
    setLang(language);

    // If we have raw transcript data, switch language directly
    if (rawTranscriptData && Array.isArray(rawTranscriptData)) {
      switchTranscriptLanguage(language);
    } else {
      // Fallback to translation API if no raw data
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
    }
  };

  return (
    <div className="flex flex-col relative min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 ">
      <SidebarOnHover
        link={"https://explified.com/youtube-summariser/"}
        toolName={"Youtube Summarizer"}
        id={"ytsummarizer"}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-minimal-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-minimal-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-minimal-primary to-white bg-clip-text text-transparent mb-4">
            YouTube Video Summarizer
          </h1>
          <p className="text-minimal-muted text-lg">
            Transform videos into insights with AI-powered summaries
          </p>
        </div>

        {/* History Button */}
        <div className="flex justify-center mb-6">
          <button
            className="group flex items-center gap-2 px-6 py-3 bg-minimal-dark-100/80 hover:bg-minimal-dark-100 backdrop-blur-sm rounded-xl border border-minimal-border hover:border-minimal-primary/50 transition-all duration-300 hover:transform hover:scale-105"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="w-4 h-4 text-minimal-muted group-hover:text-minimal-primary transition-colors" />
            <span className="capitalize text-minimal-gray-300 group-hover:text-white transition-colors">
              history
            </span>
            <ChevronDown
              className={`w-4 h-4 text-minimal-muted group-hover:text-minimal-primary transition-all duration-300 ${
                historyOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* History Section Modal */}
      {historyVideos.length !== 0 && historyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative bg-minimal-card rounded-lg shadow-lg max-w-4xl w-full mx-4 p-6 overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setHistoryOpen(false)}
              className="absolute top-3 right-3 text-minimal-gray-300 hover:text-white"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-minimal-white mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-minimal-primary" />
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

      {/* API Key Modal */}
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
              <div>
                <label className="block text-sm font-medium text-minimal-gray-300 mb-2">
                  RapidAPI Key (for video info)
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-minimal-gray-300 mb-2">
                  Summarizer API Key (for video summaries)
                </label>
                <div className="relative">
                  <input
                    type={showSummarizerApiKey ? "text" : "password"}
                    value={summarizerApiKeyInput}
                    onChange={(e) => setSummarizerApiKeyInput(e.target.value)}
                    placeholder="Paste your Summarizer API key"
                    className="w-full p-4 pr-24 rounded-xl bg-minimal-dark-200/80 backdrop-blur-sm text-white placeholder-minimal-muted border border-minimal-border focus:border-minimal-primary focus:outline-none focus:ring-2 focus:ring-minimal-primary/25 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSummarizerApiKey((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-minimal-muted hover:text-white text-sm px-3 py-1 rounded-lg border border-minimal-border hover:border-minimal-primary/50"
                  >
                    {showSummarizerApiKey ? "Hide" : "Show"}
                  </button>
                </div>
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
                    const summarizerTrimmed = summarizerApiKeyInput.trim();

                    if (rapidTrimmed) {
                      localStorage.setItem(
                        "ytSummarizerRapidApiKey",
                        rapidTrimmed
                      );
                    } else {
                      localStorage.removeItem("ytSummarizerRapidApiKey");
                    }

                    if (summarizerTrimmed) {
                      localStorage.setItem(
                        "ytSummarizerApiKey",
                        summarizerTrimmed
                      );
                    } else {
                      localStorage.removeItem("ytSummarizerApiKey");
                    }

                    setApiModalOpen(false);
                  }}
                  disabled={
                    !rapidApiKeyInput.trim() && !summarizerApiKeyInput.trim()
                  }
                  className={`px-4 py-2 rounded-lg border-2 ${
                    rapidApiKeyInput.trim() || summarizerApiKeyInput.trim()
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

                {/* Video Stats */}
                <div className="flex items-center gap-6 mt-4 text-sm">
                  {videoData?.viewCount && (
                    <div className="flex items-center gap-2 text-minimal-muted">
                      <span className="text-minimal-gray-300">
                        {parseInt(videoData.viewCount).toLocaleString()} views
                      </span>
                    </div>
                  )}
                  {videoData?.likeCount && (
                    <div className="flex items-center gap-2 text-minimal-muted">
                      <span className="text-minimal-gray-300">
                        {parseInt(videoData.likeCount).toLocaleString()} likes
                      </span>
                    </div>
                  )}
                  {videoData?.duration && (
                    <div className="flex items-center gap-2 text-minimal-muted">
                      <Clock className="w-4 h-4" />
                      <span className="text-minimal-gray-300">
                        {videoData.duration}
                      </span>
                    </div>
                  )}
                  {videoData?.publishedAt && (
                    <div className="flex items-center gap-2 text-minimal-muted">
                      <span className="text-minimal-gray-300">
                        {new Date(videoData.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
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
                {availableLanguages.length > 0 ? (
                  availableLanguages.map((languageCode) => {
                    const languageInfo = getLanguageInfo(languageCode);
                    return (
                      <option key={languageCode} value={languageCode}>
                        {languageInfo.flag} {languageInfo.name}
                      </option>
                    );
                  })
                ) : (
                  <>
                    <option value="en">🇺🇸 English</option>
                    <option value="hi">🇮🇳 Hindi</option>
                  </>
                )}
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
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-minimal-white mb-4">
              What would you like to do?
            </h2>
            <p className="text-minimal-muted text-lg">
              Choose how you want to process your YouTube video
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
            <button
              onClick={() => setActiveTab("transcript")}
              className={`group relative overflow-hidden bg-minimal-dark-100 backdrop-blur-sm border border-minimal-border hover:border-minimal-primary/50 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-minimal-primary/10 ${
                activeTab === "transcript"
                  ? "border-minimal-primary shadow-lg shadow-minimal-primary/25"
                  : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-minimal-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-minimal-primary/30 transition-colors">
                  <FileText className="w-8 h-8 text-minimal-primary" />
                </div>
                <h3 className="text-xl font-semibold text-minimal-white mb-2 group-hover:text-minimal-primary transition-colors">
                  Full Transcript
                </h3>
                <p className="text-minimal-muted group-hover:text-minimal-gray-300 transition-colors">
                  Get the complete text transcript with timestamps
                </p>
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
              <div className="relative z-10">
                <div className="w-16 h-16 bg-minimal-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-minimal-primary/30 transition-colors">
                  <Sparkles className="w-8 h-8 text-minimal-primary" />
                </div>
                <h3 className="text-xl font-semibold text-minimal-white mb-2 group-hover:text-minimal-primary transition-colors">
                  AI Summary
                </h3>
                <p className="text-minimal-muted group-hover:text-minimal-gray-300 transition-colors">
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
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-minimal-primary/50 via-minimal-primary/20 to-transparent"></div>
            <div className="space-y-8">
              {transcript?.map((item, index) => (
                <TranscriptCard key={index} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Input Section */}
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
              {/* <Video className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-minimal-muted" /> */}
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

            {/* <button
              onClick={() => setActiveTab("transcript")}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-minimal-primary text-minimal-primary hover:bg-minimal-primary/10
               ${
                 loading
                   ? "opacity-50 cursor-not-allowed"
                   : "hover:transform hover:scale-105"
               } disabled:hover:transform-none disabled:hover:scale-100`}
            >
              <FileText className="w-4 h-4" />
              Transcript
            </button> */}

            {/* <button
              onClick={() => setActiveTab("summary")}
              disabled={loading}
              className={`flex items-center gap-2 px-6 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-minimal-primary text-minimal-primary hover:bg-minimal-primary/10
               ${
                 loading
                   ? "opacity-50 cursor-not-allowed"
                   : "hover:transform hover:scale-105"
               } disabled:hover:transform-none disabled:hover:scale-100`}
            >
              <Sparkles className="w-4 h-4" />
              Summarize
            </button> */}

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
