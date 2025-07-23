import { useSelector } from "react-redux";
import axiosInstance from "../../../network/axiosInstance";
import { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

export default function SubtitleToolUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  // const [downloadPath, setDownloadPath] = useState("");
  const [changeLanguage, setChangeLanguage] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [activeWordIds, setActiveWordIds] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);

  const uploadedFile = useSelector((state) => state.video);
  const videoRef = useRef(null);
  const tooltipRef = useRef(null);

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

      // const filePath = response?.data?.videoFile;
      // const fileName = filePath.split("\\").pop();
      // const finalPath = `${import.meta.env.VITE_APP_URL}uploads/${fileName}`;

      const backendString = response?.data?.content;
      console.log(response?.data?.content);

      // setDownloadPath(finalPath);
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

      let idCounter = 0;

      for (let i = 0; i < lines.length - 1; i++) {
        const timeLine = lines[i];
        const wordLine = lines[i + 1];

        // Match the time range line (e.g., "00:00,001 --> 00:00,008")
        if (timeLine.includes("-->")) {
          const [startStr, endStr] = timeLine.split("-->").map((s) => s.trim());
          console.log(startStr, endStr);

          const start = timeToSeconds(startStr);
          const end = timeToSeconds(endStr);

          // Push the next line as the word with the above time
          if (wordLine && !wordLine.includes("-->")) {
            wordsWithTime.push({
              id: `${idCounter}-0`,
              word: wordLine.trim(),
              start,
              end,
            });
            idCounter++;
          }
        }
      }

      setParsedWords(wordsWithTime);
    }
  }, [subtitleText]);

  const timeToSeconds = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return NaN;

    const [hms, ms] = timeStr.trim().split(",");
    if (!hms || !ms) return NaN;

    const parts = hms.split(":").map(Number);

    // Handle formats like mm:ss, ss, or hh:mm:ss
    let h = 0,
      m = 0,
      s = 0;

    if (parts.length === 3) {
      [h, m, s] = parts;
    } else if (parts.length === 2) {
      [m, s] = parts;
    } else if (parts.length === 1) {
      [s] = parts;
    }

    const milliseconds = parseInt(ms, 10);

    if ([h, m, s, milliseconds].some(isNaN)) return NaN;

    return h * 3600 + m * 60 + s + milliseconds / 1000;
  };

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

  useEffect(() => {
    const handleSelection = (e) => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      const clickedInsideTooltip = tooltipRef.current?.contains(e.target);

      if (!selectedText && !clickedInsideTooltip) {
        setSelectedWord(null);
        return;
      }

      const match = parsedWords.find(
        (w) => w.word.toLowerCase() === selectedText.toLowerCase()
      );

      if (match) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        setSelectedWord(match);
        setTooltipPosition({
          top: rect.top - containerRect.top - 30,
          left: rect.left - containerRect.left,
        });
      }
    };

    document.addEventListener("mouseup", handleSelection);
    return () => document.removeEventListener("mouseup", handleSelection);
  }, [parsedWords]);

  console.log(selectedWord);

  // const handleWordClick = (e, word) => {
  //   const rect = e.target.getBoundingClientRect();
  //   const containerRect = containerRef.current.getBoundingClientRect();

  //   setSelectedWord(word);
  //   setTooltipPosition({
  //     top: rect.top - containerRect.top - 30,
  //     left: rect.left - containerRect.left,
  //   });
  // };
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
      const synonymsArr = synonyms.split(/[,*\s]+/);
      setSynonyms(synonymsArr);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSynonymClick = (newWord) => {
    if (!selectedWord) return;

    const updatedWords = parsedWords.map((w) =>
      w.id === selectedWord.id ? { ...w, word: newWord.trim() } : w
    );

    setParsedWords(updatedWords);
    setSelectedWord(null);
    setSynonyms([]);
    window.getSelection().removeAllRanges();
  };

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
          {!isLoading && !subtitleText && parsedWords.length === 0 && (
            <>
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

              <button
                onClick={handleSubmit}
                className="border border-gray-600 text-lg font-normal leading-tight hover:bg-[#23b5b5] rounded-lg p-6 w-full text-center"
              >
                Personalised
                <br />
                Subtitle
                <br />
                Editing
              </button>

              <button
                onClick={handleSubmit}
                className="border border-gray-600 text-lg font-normal leading-tight hover:bg-[#23b5b5] rounded-lg p-6 w-full text-center"
              >
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
            </>
          )}

          {(isLoading || subtitleText || parsedWords.length > 0) && (
            <>
              {isLoading && (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin" />
                </div>
              )}

              <h1 className="text-3xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1b5d5d] to-[#23b5b5] border border-[#23b5b5] p-2 rounded-full shadow-md ">
                Subtitle
              </h1>

              {subtitleText && (
                <select
                  name="language"
                  className="border border-[#23b5b5] bg-black py-1 px-2 rounded-md"
                  value={changeLanguage}
                  onChange={handleLanguageChange}
                >
                  <option value="">Language</option>
                  <option value="hindi">Hindi</option>
                  <option value="english">English</option>
                </select>
              )}

              {parsedWords.length > 0 && (
                <div
                  className="relative select-text text-white [&_*::selection]:bg-[#23b5b5] [&_*::selection]:text-black"
                  ref={containerRef}
                >
                  <div className="space-y-2">
                    {parsedWords.map((w) => (
                      <span
                        key={w.id}
                        className={`inline-block mr-1 px-1 rounded transition-all select-text ${
                          activeWordIds.includes(w.id)
                            ? "bg-yellow-300 text-black"
                            : "text-gray-400"
                        }`}
                      >
                        {w.word}
                      </span>
                    ))}
                  </div>

                  {selectedWord && (
                    <div
                      ref={tooltipRef}
                      className="absolute z-50 bg-gray-800 text-[#23b5b5] px-2 py-1 rounded shadow-md border border-[#23b5b5] text-sm cursor-pointer"
                      style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                      }}
                    >
                      <div
                        className="cursor-pointer"
                        onClick={handleTooltipClick}
                      >
                        Generate Synonyms
                      </div>
                      {synonyms.length > 0 && (
                        <div
                          className="absolute z-50 bg-gray-800 text-[#23b5b5] px-4 py-2 rounded-xl shadow-lg border border-[#23b5b5] text-sm"
                          style={{
                            top: tooltipPosition.top,
                            left: tooltipPosition.left,
                          }}
                        >
                          <ul className="space-y-1">
                            {synonyms.map((syn, idx) => (
                              <li
                                key={idx}
                                onClick={() => handleSynonymClick(syn)}
                                className="border-b border-gray-600 py-1 last:border-0"
                              >
                                {syn.trim()}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
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

            {/* {downloadPath && (
              <div className="text-right">
                <a href={downloadPath} download>
                  <button className="bg-[#23b5b5] py-3 px-6 rounded-lg">
                    Download
                  </button>
                </a>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}
