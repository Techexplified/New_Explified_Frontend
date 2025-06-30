import { useState } from "react";
import { FaLocationArrow } from "react-icons/fa";
import axiosInstance from "../../../network/axiosInstance";
import JSON5 from "json5";

function DeepSearch() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState();
  const [insights, setInsights] = useState([]);

  function handleUrl(e) {
    const Url = e.target.value;
    const match = Url.match(/v=([^&]+)/);
    const id = match[1];
    setVideoUrl(e.target.value);
    setVideoId(id);
  }

  //   const handleDeepSearch = async (videoId) => {
  //     if (!videoId) return;
  //     setLoading(true);

  //     try {
  //       const response = await axiosInstance.post("api/ytSummarize/deepsearch", {
  //         videoId,
  //       });

  //       let content = response.data?.content;

  //       const codeBlockRegex = /```javascript\s*([\s\S]*?)```/;
  //       const match = content.match(codeBlockRegex);

  //       let insightsArray = [];

  //       if (match && match[1]) {
  //         let arrayString = match[1].trim();

  //         // 1. Replace backticks with double quotes
  //         arrayString = arrayString.replace(/`([^`]*)`/g, '"$1"');

  //         // 2. Add quotes around unquoted keys (e.g., insight: → "insight":)
  //         arrayString = arrayString.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

  //         // 3. Remove trailing commas before } or ]
  //         arrayString = arrayString.replace(/,\s*(\}|\])/g, "$1");

  //         try {
  //           insightsArray = JSON.parse(arrayString);
  //         } catch (jsonErr) {
  //           console.error("❌ Failed to parse cleaned array:", jsonErr);
  //           console.log("💥 Cleaned string:", arrayString);
  //         }
  //       }

  //       setInsights(insightsArray);
  //       setVideoUrl("");
  //       setVideoId("");
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const handleDeepSearch = async (videoId) => {
    if (!videoId) return;
    setLoading(true);

    try {
      const response = await axiosInstance.post("api/ytSummarize/deepsearch", {
        videoId,
      });

      let content = response.data?.content;

      const codeBlockRegex = /```javascript\s*([\s\S]*?)```/;
      const match = content.match(codeBlockRegex);

      let insightsArray = [];

      if (match && match[1]) {
        const arrayString = match[1].trim();

        try {
          insightsArray = JSON5.parse(arrayString); // JSON5 handles relaxed JS
        } catch (jsonErr) {
          console.error("❌ JSON5 failed to parse:", jsonErr);
          console.log("💥 String that failed:", arrayString);
        }
      }

      setInsights(insightsArray);
      setVideoUrl("");
      setVideoId("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  //   function extractInsights(rawText) {
  //     // Step 1: Extract the content inside ```javascript ... ```
  //     const codeBlockRegex = /```javascript\s*([\s\S]*?)```/;
  //     const match = rawText.match(codeBlockRegex);

  //     if (!match || match.length < 2) {
  //       throw new Error("No valid javascript code block found");
  //     }

  //     let arrayString = match[1].trim();

  //     try {
  //       // Use Function constructor instead of eval for safety in Node/browser:
  //       const parsedArray = new Function(`return ${arrayString}`)();
  //       return parsedArray;
  //     } catch (err) {
  //       console.error("Error parsing insights:", err);
  //       return [];
  //     }
  //   }

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl font-semibold text-center mb-8">
        💡 Deep Search
      </h1>
      <div>
        <button className="px-3 py-1 bg-gray-800 rounded-md capitalize">
          Resources
        </button>
      </div>
      {text && <div className="max-w-4xl mx-auto pb-20 ">{text}</div>}

      {/* <div className="max-w-4xl mx-auto pb-20 ">
        {insights.length !== 0 &&
          insights.map((item, i) => (
            <div key={i} className="mb-4">
              <h3 className="font-semibold">{item.insight}</h3>
              <p>{item.details}</p>
              <a
                href={item.reference}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#23b5b5] underline"
              >
                Read more
              </a>
            </div>
          ))}
      </div> */}

      <div className="max-w-4xl mx-auto pb-20 text-white bg-black px-4">
        <h2 className="flex items-center text-lg font-bold mb-6">
          Key Insights <span className="ml-2">→</span>
        </h2>

        {insights.length !== 0 &&
          insights.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between border-t border-white py-4">
                <div className="flex items-center gap-2">
                  <span>→</span>
                  <span className="text-sm">{item.insight}</span>
                </div>
              </div>

              <div className="flex justify-end  mt-1 ">
                <a
                  href={item.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#23b5b5] text-lg"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-20  right-0 bg-black z-10">
        <div className="max-w-4xl mx-auto w-full p-4 flex gap-4 items-center">
          <input
            type="text"
            value={videoUrl}
            onChange={handleUrl}
            placeholder="Enter YouTube URL"
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]"
          />

          <button
            onClick={() => handleDeepSearch(videoId)}
            disabled={loading}
            className={`px-6 py-3  bg-[#23b5b5] rounded-lg font-semibold flex items-center gap-2 transition`}
          >
            <FaLocationArrow />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeepSearch;
