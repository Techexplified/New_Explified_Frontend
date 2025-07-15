import { useSelector } from "react-redux";
import axiosInstance from "../../../network/axiosInstance";
import { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

export default function SubtitleToolUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [activeWordIds, setActiveWordIds] = useState([]);

  const uploadedFile = useSelector((state) => state.video);
  const videoRef = useRef(null);

  const handleSubmit = async () => {
    if (!uploadedFile) {
      console.error("No file uploaded");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("video", uploadedFile);

      const response = await axiosInstance.post("api/aiSubtitler", formData);

      const backendString = response?.data?.content;
      setSubtitleText(backendString);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Parse the backend string into [{ start, end, word }]
  // useEffect(() => {
  //   if (subtitleText) {
  //     const lines = subtitleText.split("\n").filter(Boolean);
  //     const wordsWithTime = [];

  //     for (let i = 0; i < lines.length; i++) {
  //       const line = lines[i];
  //       const [timePart, ...words] = line.trim().split(" ");
  //       const startTime = timeToSeconds(timePart);

  //       // Estimate endTime: next word's start or +0.5s if last
  //       let endTime;
  //       if (i < lines.length - 1) {
  //         const nextTimePart = lines[i + 1].split(" ")[0];
  //         endTime = timeToSeconds(nextTimePart);
  //       } else {
  //         endTime = startTime + 0.5;
  //       }

  //       words.forEach((word, index) => {
  //         wordsWithTime.push({
  //           id: `${i}-${index}`,
  //           word,
  //           start: startTime,
  //           end: endTime,
  //         });
  //       });
  //     }

  //     setParsedWords(wordsWithTime);
  //   }
  // }, [subtitleText]);

  useEffect(() => {
    if (subtitleText) {
      const lines = subtitleText.split("\n").filter(Boolean);
      const wordsWithTime = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const [timePart, ...words] = line.trim().split(" ");
        const startTime = timeToSeconds(timePart);

        let nextTime;
        if (i < lines.length - 1) {
          const nextTimePart = lines[i + 1].split(" ")[0];
          nextTime = timeToSeconds(nextTimePart);
        } else {
          nextTime = startTime + 0.5; // fallback for last word
        }

        const lineDuration = Math.max(nextTime - startTime, 0.1);
        const wordDuration = lineDuration / words.length;

        words.forEach((word, index) => {
          const wordStart = startTime + index * wordDuration;
          const wordEnd = wordStart + wordDuration;

          wordsWithTime.push({
            id: `${i}-${index}`,
            word,
            start: wordStart,
            end: wordEnd,
          });
        });
      }

      setParsedWords(wordsWithTime);
    }
  }, [subtitleText]);

  function timeToSeconds(timeStr) {
    const [h, m, s] = timeStr.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  }

  // Listen for video time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;

      const active = parsedWords
        .filter((w) => currentTime >= w.start && currentTime <= w.end)
        .map((w) => w.id);

      setActiveWordIds(active);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [parsedWords]);

  return (
    <div className="bg-black text-white h-screen p-6">
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
        {/* Sidebar */}
        <div className="w-80 space-y-4 overflow-y-auto max-h-[80vh]">
          <button
            onClick={handleSubmit}
            className="border border-gray-600 text-lg font-normal leading-tight hover:bg-[#23b5b5] rounded-lg p-6 w-full text-center"
          >
            AI
            <br />
            Subtitle
            <br />
            Generations
          </button>

          {isLoading && (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin" />
            </div>
          )}

          {/* Word-by-word rendering */}
          <div className="space-y-2">
            {parsedWords.map((w) => (
              <span
                key={w.id}
                className={`inline-block mr-1 px-1 rounded transition-all ${
                  activeWordIds.includes(w.id)
                    ? "bg-yellow-300 text-black"
                    : "text-gray-400"
                }`}
              >
                {w.word}
              </span>
            ))}
          </div>

          <button className="border border-gray-600 text-lg font-normal leading-tight hover:bg-[#23b5b5] rounded-lg p-6 w-full text-center">
            Personalised
            <br />
            Subtitle
            <br />
            Editing
          </button>

          <button className="border border-gray-600 text-lg font-normal leading-tight hover:bg-[#23b5b5] rounded-lg p-6 w-full text-center">
            Language
            <br />
            Based
            <br />
            Subtitles
          </button>

          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 rounded-lg text-lg font-normal flex items-center justify-center gap-2 transition-colors">
            Get Subtitle's
            <div className="flex items-center gap-1">
              <span>5</span>
              <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            </div>
          </button>
        </div>

        {/* Video preview */}
        {uploadedFile && (
          <div className="flex-1 flex flex-col">
            <video ref={videoRef} controls width="720" className="mx-auto">
              <source
                src={URL.createObjectURL(uploadedFile)}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
}
