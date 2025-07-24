import { useSelector } from "react-redux";
import axiosInstance from "../../../network/axiosInstance";
import { useState, useEffect, useRef } from "react";
import { FaSpinner } from "react-icons/fa";
import { Loader2, Play, Globe, Edit, Bot, User, Settings } from "lucide-react";
import { ChevronDown } from "lucide-react";

const fillerWords = ["um,", "um", "umm", "hmm", "uh", "ah", "er"];

export default function SubtitleToolUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [subtitleText, setSubtitleText] = useState("");
  const [subtitleUrl, setSubtitleUrl] = useState("");
  // const [downloadPath, setDownloadPath] = useState("");
  const [changeLanguage, setChangeLanguage] = useState("");
  const [parsedWords, setParsedWords] = useState([]);
  const [activeWordIds, setActiveWordIds] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [dropdownA, setDropdownA] = useState(false);
  const [selectedFont, setSelectedFont] = useState("");
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

      // Convert SRT to WebVTT
      const webVTT = convertSRTtoWebVTT(backendString);

      // Create a Blob URL
      const subtitleBlob = new Blob([webVTT], { type: "text/vtt" });
      const subtitleUrl = URL.createObjectURL(subtitleBlob);

      // setDownloadPath(finalPath);
      setSubtitleUrl(subtitleUrl);
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

  function convertSRTtoWebVTT(rawSubtitle) {
    // Step 1: Clean and split the string
    const lines = rawSubtitle.trim().split("\n");

    let srtFormatted = "";
    let index = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Match timing line
      const timeRegex = /^\d{2}:\d{2},\d{3} --> \d{2}:\d{2},\d{3}$/;

      if (timeRegex.test(line)) {
        // Add sequence number
        srtFormatted += `${index++}\n`;
        // Add time
        srtFormatted += line + "\n";
        // Add next line as subtitle text (skip blank or invalid ones)
        const nextLine = lines[i + 1]?.trim();
        if (nextLine && !timeRegex.test(nextLine)) {
          srtFormatted += nextLine + "\n\n";
          i++; // Skip the next line (already processed)
        }
      }
    }

    // Step 2: Convert SRT → WebVTT
    const vttText = "WEBVTT\n\n" + srtFormatted.replace(/,/g, "."); // VTT uses '.' instead of ',' for time

    return vttText;
  }

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
  const handleRemoveFiller = () => {
    setParsedWords((prevWords) =>
      prevWords.filter(
        (wordObj) => !fillerWords.includes(wordObj.word.toLowerCase())
      )
    );
  };

  console.log(parsedWords);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white min-h-screen">
      {/* Enhanced Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-gray-800/50">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Bot className="text-white w-5 h-5" />
            </div>
            <div className="flex-1"></div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Subtitler Tool
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Generate and customize subtitles with AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full border border-gray-700/50">
              <span className="text-lg font-semibold">5</span>
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 p-6">
        {/* Enhanced Sidebar */}
        <div className="w-96 space-y-6 overflow-y-auto max-h-[85vh]">
          {!isLoading && !subtitleText && parsedWords.length === 0 && (
            <div className="space-y-6">
              {/* Feature Buttons Section */}
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Features
                </h3>

                <button
                  onClick={handleSubmit}
                  className="group relative w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-teal-600 hover:to-teal-500 border border-gray-600 hover:border-teal-400 rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Bot className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">
                        AI Subtitle Generation
                      </h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-200">
                        Automatically generate subtitles using AI
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleSubmit}
                  className="group relative w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-purple-600 hover:to-purple-500 border border-gray-600 hover:border-purple-400 rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Edit className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">
                        Personalized Editing
                      </h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-200">
                        Customize and edit your subtitles
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={handleSubmit}
                  className="group relative w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-blue-600 hover:to-blue-500 border border-gray-600 hover:border-blue-400 rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Globe className="text-white w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">
                        Language Based
                      </h4>
                      <p className="text-sm text-gray-400 group-hover:text-gray-200">
                        Multi-language subtitle support
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                <span className="text-xs text-gray-500 font-medium">
                  ACTION
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              </div>

              {/* Action Button Section */}
              <button className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white py-6 px-8 rounded-xl text-lg font-semibold flex items-center justify-between gap-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-teal-500/30 group">
                <span className="flex-1 text-left">Get Subtitles</span>
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg">
                  <span className="text-lg font-bold">5</span>
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg group-hover:animate-pulse"></div>
                </div>
              </button>
            </div>
          )}

          {(isLoading || subtitleText || parsedWords.length > 0) && (
            <div className="space-y-6">
              {/* Processing Header */}
              <div className="text-center px-2">
                <div className="flex items-center gap-3 bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 px-6 py-3 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="text-white w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
                    Subtitle
                  </h2>
                </div>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
                <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <Loader2 className="animate-spin text-4xl text-teal-400 w-12 h-12" />
                    <div className="absolute inset-0 animate-ping">
                      <Loader2 className="text-4xl text-teal-400/30 w-12 h-12" />
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Processing your video...
                  </p>
                </div>
              )}

              {subtitleText && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">
                    Language Selection
                  </label>
                  <select
                    name="language"
                    className="w-full bg-gray-800 border border-gray-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 rounded-lg py-3 px-4 text-white transition-all duration-200"
                    value={changeLanguage}
                    onChange={handleLanguageChange}
                  >
                    <option value="">Select Language</option>
                    <option value="hindi">Hindi</option>
                    <option value="english">English</option>
                  </select>
                </div>
              )}

              {parsedWords.length > 0 && (
                <div className="space-y-4">
                  {/* Separator */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                    <span className="text-xs text-gray-500 font-medium">
                      SUBTITLE TEXT
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
                  </div>

                  <div
                    className="relative select-text text-white bg-gray-800/30 border border-gray-700 rounded-xl p-6 [&_*::selection]:bg-teal-400 [&_*::selection]:text-black max-h-80 overflow-y-auto"
                    ref={containerRef}
                  >
                    <div className="space-y-2 leading-relaxed">
                      {parsedWords.map((w) => (
                        <span
                          key={w.id}
                          className={`inline-block mr-1 px-2 py-1 rounded-md transition-all duration-200 select-text cursor-pointer ${
                            activeWordIds.includes(w.id)
                              ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-medium shadow-lg transform scale-105"
                              : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                          }`}
                        >
                          {w.word}
                        </span>
                      ))}
                    </div>

                    {selectedWord && (
                      <div
                        ref={tooltipRef}
                        className="absolute z-50 bg-gray-900 border border-teal-400 rounded-lg shadow-2xl overflow-hidden"
                        style={{
                          top: tooltipPosition.top,
                          left: tooltipPosition.left,
                        }}
                      >
                        <div
                          className="px-4 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white cursor-pointer hover:from-teal-500 hover:to-blue-500 transition-all duration-200 text-sm font-medium"
                          onClick={handleTooltipClick}
                        >
                          Generate Synonyms
                        </div>
                        {synonyms.length > 0 && (
                          <div className="max-h-48 overflow-y-auto">
                            <ul>
                              {synonyms.map((syn, idx) => (
                                <li
                                  key={idx}
                                  onClick={() => handleSynonymClick(syn)}
                                  className="px-4 py-2 text-sm text-gray-300 hover:bg-teal-600/20 hover:text-teal-400 cursor-pointer border-b border-gray-800 last:border-0 transition-all duration-150"
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
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Video Preview */}

        {uploadedFile && (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300">
                  Video Preview
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Ready</span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  controls
                  className="w-full h-auto max-w-4xl mx-auto bg-black rounded-xl"
                  style={{ aspectRatio: "16/9" }}
                >
                  <source
                    src={URL.createObjectURL(uploadedFile)}
                    type="video/mp4"
                  />
                  {subtitleUrl && (
                    <track
                      key={subtitleUrl}
                      src={subtitleUrl}
                      kind="subtitles"
                      srcLang="en"
                      label="English"
                      default
                    />
                  )}
                  Your browser does not support the video tag.
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-xl"></div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-4">
                {/* A Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownA(!dropdownA)}
                    className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-colors min-w-[80px] justify-center hover:from-teal-600/30 hover:to-blue-600/30"
                  >
                    <span className="text-lg font-bold">A</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {dropdownA && (
                    <div className="absolute top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-10 min-w-[120px] right-0">
                      <div className="py-1">
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                          Option A1
                        </button>
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                          Option A2
                        </button>
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors">
                          Option A3
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* T Dropdown */}
                <div className="relative">
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 text-white px-6 py-3 rounded-full font-medium transition-colors appearance-none cursor-pointer hover:from-teal-600/30 hover:to-blue-600/30 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                  >
                    <option value="" className="bg-gray-800 text-white">
                      Select
                    </option>
                    <option
                      value="arial"
                      className="bg-gray-800 text-white font-sans"
                    >
                      Arial
                    </option>
                    <option
                      value="times"
                      className="bg-gray-800 text-white font-serif"
                    >
                      Times New Roman
                    </option>
                    <option
                      value="helvetica"
                      className="bg-gray-800 text-white font-sans"
                    >
                      Helvetica
                    </option>
                    <option
                      value="georgia"
                      className="bg-gray-800 text-white font-serif"
                    >
                      Georgia
                    </option>
                  </select>
                </div>

                {/* Remove Filler Button */}
                <button
                  onClick={handleRemoveFiller}
                  className="bg-gradient-to-r from-teal-600/20 to-blue-600/20 border border-teal-500/30 px-6 py-3 rounded-full hover:from-teal-600/30 hover:to-blue-600/30 transition-colors"
                >
                  Remove Filler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for when no video is uploaded */}
        {!uploadedFile && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Video Selected
                </h3>
                <p className="text-gray-500">
                  Upload a video to start generating subtitles
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
