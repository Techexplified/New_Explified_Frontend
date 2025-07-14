import { useSelector } from "react-redux";
import axiosInstance from "../../../network/axiosInstance";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

export default function SubtitleToolUI() {
  const [isLoading, setIsLoading] = useState(false);
  const [vttURL, setVttURL] = useState();
  const [subtitleText, setSubtitleText] = useState("");
  const uploadedFile = useSelector((state) => state.video);

  function shiftSrtTimestamps(srtString, offsetMs) {
    return srtString.replace(
      /(\d{2}:\d{2}:\d{2}),(\d{3}) --> (\d{2}:\d{2}:\d{2}),(\d{3})/g,
      (_, h1, ms1, h2, ms2) => {
        const start = timeToMs(h1, ms1) + offsetMs;
        const end = timeToMs(h2, ms2) + offsetMs;
        return `${msToTime(start)} --> ${msToTime(end)}`;
      }
    );
  }

  function timeToMs(time, ms) {
    const [h, m, s] = time.split(":").map(Number);
    return (h * 3600 + m * 60 + s) * 1000 + Number(ms);
  }

  function msToTime(ms) {
    ms = Math.max(ms, 0); // avoid negative time
    const hours = Math.floor(ms / 3600000);
    ms %= 3600000;
    const minutes = Math.floor(ms / 60000);
    ms %= 60000;
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad3(
      milliseconds
    )}`;
  }

  function pad(num) {
    return String(num).padStart(2, "0");
  }

  function pad3(num) {
    return String(num).padStart(3, "0");
  }

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

      const srtString = response?.data?.content;
      setSubtitleText(srtString);
      const shiftedSrt = shiftSrtTimestamps(srtString, -300);

      const vttString = "WEBVTT\n\n" + shiftedSrt.replace(/,/g, ".");

      const blob = new Blob([vttString], { type: "text/vtt" });
      const vttURL = URL.createObjectURL(blob);

      setVttURL(vttURL);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
        {/* Left Sidebar */}
        <div className="w-80 space-y-4">
          {/* Feature Cards */}
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

          {isLoading ? (
            <div className="flex items-center justify-center">
              <FaSpinner className="animate-spin" />
            </div>
          ) : null}

          {subtitleText && <div className="text-gray-400">{subtitleText}</div>}

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

          {/* Get Subtitles Button */}
          <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-4 px-6 rounded-lg text-lg font-normal flex items-center justify-center gap-2 transition-colors">
            Get Subtitle's
            <div className="flex items-center gap-1">
              <span>5</span>
              <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            </div>
          </button>
        </div>

        {/* {isLoading && (
          <div className="flex-1 flex items-center justify-center ">
            <FaSpinner className="animate-spin" />
          </div>
        )} */}

        {uploadedFile ? (
          <div className="flex-1 flex flex-col">
            {/* Preview Section */}

            <video controls width="720" className="mx-auto">
              <source
                src={URL.createObjectURL(uploadedFile)}
                type="video/mp4"
              />
              {vttURL && (
                <track
                  label="English"
                  kind="subtitles"
                  srcLang="en"
                  src={vttURL}
                  default
                />
              )}
              Your browser does not support the video tag.
            </video>

            {/* <span className="text-black text-lg font-medium">PREVIEW</span> */}

            {/* Timeline Section */}
            <div className="flex-1">
              {/* Timeline ruler */}
              <div className="border-t border-gray-600 mb-2 relative">
                <div className="flex">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex-1 relative">
                      <div className="absolute top-0 left-0 w-px h-4 bg-gray-600"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtitle blocks */}
              <div className="grid grid-cols-6 gap-1 mt-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-gray-400 h-16 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* Right Content Area */}
      </div>
    </div>
  );
}
