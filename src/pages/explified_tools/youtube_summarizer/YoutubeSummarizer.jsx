import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../network/axiosInstance";
// import axios from "axios";
import { useSelector } from "react-redux";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import axios from "axios";
const API_URL = "https://api.supadata.ai/v1/youtube/transcript";

const YoutubeSummarizer = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [searchParams] = useSearchParams();
  const videoIdYt = searchParams.get("videoId");

  // const [historyVideos, setHistoryVideos] = useState([]);

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
      console.log(response);
      let content = response.data?.content;
      console.log(content);
      setSummary(content);
      setVideoUrl("");
      setVideoId("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // const getSummary = async (videoIdYt) => {
  //   if (!videoIdYt) return;

  //   setLoading(true);
  //   setSummary("");

  //   try {
  //     const response = await axios.get(API_URL, {
  //       params: {
  //         url: `https://www.youtube.com/watch?v=${videoIdYt}`,
  //         text: true,
  //       },
  //       headers: {
  //         "x-api-key": `${import.meta.env.VITE_SUPADATA_API}`,
  //       },
  //     });
  //     let content = response.data?.content;
  //     console.log(response);

  //     const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  //     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  //     const prompt = `Generate a summary of this text - ${content}`;
  //     const result = await model.generateContent(prompt);
  //     const summary = result.response.text();
  //     // console.log(response);
  //     // let content = response.data?.content;
  //     // content = content.replaceAll("&amp;#39;", "'");

  //     setSummary(summary || "No summary found.");
  //     setVideoUrl("");
  //     setVideoId("");
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl font-semibold text-center mb-6">
        Summarize YouTube Videos
      </h1>

      {/* Scrollable summary section */}

      {/* <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto p-4 pb-20 rounded-md ">
        {summary}
      </div> */}
      {summary.length === 0 ? (
        <p className="text-center text-gray-400">No summary found.</p>
      ) : (
        <div className="max-w-4xl mx-auto w-full flex-1 overflow-y-auto p-4 pb-20 rounded-md space-y-6">
          {summary?.map((item, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] text-white p-4 rounded-lg shadow"
            >
              <p className="text-sm text-gray-400 mb-2">
                Time: {item.timeRange}
              </p>
              <p className="text-base whitespace-pre-line">{item.summary}</p>
            </div>
          ))}
        </div>
      )}

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
            onClick={() => getSummary(videoId)}
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
