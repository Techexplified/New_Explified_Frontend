import { useSelector } from "react-redux";
import axiosInstance from "../../../network/axiosInstance";
import { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

export default function SubtitleToolUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [subtitleText, setSubtitleText] = useState(
    "year, due to planning a lot of changes"
  );
  const [downloadPath, setDownloadPath] = useState("");
  const [changeLanguage, setChangeLanguage] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [activeWordIds, setActiveWordIds] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

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

      const filePath = response?.data?.videoFile;
      const fileName = filePath.split("\\").pop();
      const finalPath = `${import.meta.env.VITE_APP_URL}uploads/${fileName}`;
      console.log(fileName);

      const backendString = response?.data?.content;
      setDownloadPath(finalPath);
      setSubtitleText(backendString);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (e) => {
    const ln = e.target.value;
    setChangeLanguage(ln);
    setIsLoading(true);
    try {
      const formData = { language: ln, text: subtitleText };
      const response = await axiosInstance.post(
        "api/aiSubtitler/language",
        formData
      );

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

  // useEffect(() => {
  //   const handleMouseUp = () => {
  //     const selection = window.getSelection();
  //     const selectedText = selection.toString().trim();

  //     if (selectedText && parsedWords.find((w) => w.word === selectedText)) {
  //       const range = selection.getRangeAt(0);
  //       const rect = range.getBoundingClientRect();
  //       const containerRect = containerRef.current.getBoundingClientRect();

  //       setTooltipPosition({
  //         top: rect.top - containerRect.top - 30,
  //         left: rect.left - containerRect.left,
  //       });

  //       const matchedWord = parsedWords.find((w) => w.word === selectedText);
  //       setSelectedWord(matchedWord);
  //     } else {
  //       setSelectedWord(null);
  //     }
  //   };

  //   document.addEventListener("mouseup", handleMouseUp);
  //   return () => {
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };
  // }, [parsedWords]);
  const handleWordClick = (e, word) => {
    const rect = e.target.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setSelectedWord(word);
    setTooltipPosition({
      top: rect.top - containerRect.top - 30,
      left: rect.left - containerRect.left,
    });
  };
  const handleTooltipClick = async () => {
    console.log("a");

    setIsLoading(true);
    try {
      const formData = { word: selectedWord.word };
      const response = await axiosInstance.post(
        "api/aiSubtitler/synonyms",
        formData
      );

      const synonyms = response?.data?.content;
      const synonymsArr = synonyms.split(",");
      setSynonyms(synonymsArr);
      console.log(response?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setSelectedWord(null);
      window.getSelection().removeAllRanges();
    }
  };

  console.log(synonyms);

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

          {subtitleText && (
            <select
              name="language"
              className="border border-[#23b5b5] bg-black py-1 px-2 rounded-md"
              value={changeLanguage}
              onChange={handleLanguageChange}
            >
              <option value="">Select</option>
              <option value="hindi">Hindi</option>
              <option value="english">English</option>
            </select>
          )}

          {/* Word-by-word rendering */}
          {/* <div className="space-y-2">
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
          </div> */}

          <div className="relative" ref={containerRef}>
            <div className="space-y-2">
              {parsedWords.map((w) => (
                <span
                  key={w.id}
                  className={`inline-block mr-1 px-1 rounded transition-all cursor-pointer ${
                    activeWordIds.includes(w.id)
                      ? "bg-yellow-300 text-black"
                      : "text-gray-400"
                  }`}
                  onClick={(e) => handleWordClick(e, w)}
                >
                  {w.word}
                </span>
              ))}
            </div>

            {selectedWord && (
              <div
                className="absolute z-50 bg-white text-black px-2 py-1 rounded shadow-md border border-gray-300 text-sm cursor-pointer"
                style={{
                  top: tooltipPosition.top,
                  left: tooltipPosition.left,
                }}
                onClick={handleTooltipClick}
              >
                Generate Synonyms
              </div>
            )}

            {synonyms.length > 0 && (
              <div
                className="absolute z-50 bg-gray-800 text-white px-4 py-2 rounded-xl shadow-lg border border-gray-600 text-sm"
                style={{
                  top: tooltipPosition.top,
                  left: tooltipPosition.left,
                }}
              >
                <ul className="space-y-1">
                  {synonyms.map((syn, idx) => (
                    <li
                      key={idx}
                      className="border-b border-gray-600 py-1 last:border-0"
                    >
                      {syn.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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

            {downloadPath && (
              <div className="text-right">
                <a href={downloadPath} download>
                  <button className="bg-[#23b5b5] py-3 px-6 rounded-lg">
                    Download
                  </button>
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* <a href={downloadUrl} download>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Download Subtitled Video
        </button>
      </a> */}
    </div>
  );
}
