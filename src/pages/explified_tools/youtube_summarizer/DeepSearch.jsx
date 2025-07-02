import { useState } from "react";
import { FaLocationArrow, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../../network/axiosInstance";
import JSON5 from "json5";
// import { formatResource } from "../../../utils/formatResource";

function DeepSearch() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState();
  const [links, setLinks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  // const resources =
  insights.length !== 0 ? insights.map((i) => i.reference) : [];

  const [expanded, setExpanded] = useState({}); // Track expanded states by index

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  console.log(links);
  const videos =
    links.length !== 0
      ? links.filter(
          (item) => item.type === "youtube_video" || item.type === "youtube"
        )
      : [];
  const research =
    links.length !== 0
      ? links.filter((item) => item.type === "research_paper")
      : [];
  const blogs =
    links.length !== 0
      ? links.filter(
          (item) => item.type === "blog_post" || item.type === "blog"
        )
      : [];

  const togglePanel = () => setShowPanel(!showPanel);
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

      let content = response?.data?.content;
      let links = response?.data?.links;

      console.log(links);

      const codeBlockRegex = /```(json|javascript)\s*([\s\S]*?)```/i;
      const match1 = content.match(codeBlockRegex);
      const match2 = links.match(codeBlockRegex);

      let insightsArray = [];
      let linksArray = [];

      if (match1 && match1[2]) {
        let arrayString = match1[2].trim();

        try {
          insightsArray = JSON5.parse(arrayString);
        } catch (jsonErr) {
          console.error("❌ JSON5 failed to parse:", jsonErr);
          console.log("💥 String that failed:", arrayString);
        }
      }
      if (match2 && match2[2]) {
        let arrayString = match2[2].trim();
        try {
          linksArray = JSON.parse(arrayString);
        } catch (err) {
          console.error("❌ JSON parse failed:", err);
          console.log("💥 String that failed:", arrayString);
        }
      }

      setInsights(insightsArray);
      setLinks(linksArray);
      setText(response?.data?.summary);
      setVideoUrl("");
      setVideoId("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl font-semibold text-center mb-8">
        💡 Deep Search
      </h1>
      <div className="relative inline-block text-left">
        {/* Button */}
        <button
          onClick={togglePanel}
          className="px-3 py-1 bg-gray-800 rounded-md capitalize text-white"
        >
          Resources
        </button>

        {/* Dropdown panel */}
        {showPanel && links.length !== 0 && (
          // <div className="absolute mt-2 w-[1000px] bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-lg z-50">
          //   <h1 className="text-white mb-4">Resources</h1>
          //   <div className="grid grid-cols-3 gap-4">
          //     {resources.map((url) => {
          //       const { siteName, shortUrl } = formatResource(url);
          //       return (
          //         <div key={url} className="text-white">
          //           <p className="font-semibold">{siteName}</p>
          //           <a
          //             href={url}
          //             target="_blank"
          //             rel="noopener noreferrer"
          //             className="text-blue-400 underline break-words"
          //           >
          //             {shortUrl}
          //           </a>
          //         </div>
          //       );
          //     })}
          //   </div>
          // </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900 p-4 text-white rounded-lg">
            {/* Video's */}
            <div>
              <h2 className="text-center font-bold mb-4">Video's</h2>
              <div className="flex flex-col gap-4">
                {videos.map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-500 rounded-lg p-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>→</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline break-words flex-1 text-blue-500"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research */}
            <div>
              <h2 className="text-center font-bold mb-4">Research</h2>
              <div className="flex flex-col gap-4">
                {research.map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-500 rounded-lg p-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>→</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline break-words flex-1 text-blue-500"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blog's and Posts */}
            <div>
              <h2 className="text-center font-bold mb-4">Blog's and Posts</h2>
              <div className="flex flex-col gap-4">
                {blogs.map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-500 rounded-lg p-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>→</span>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline break-words flex-1 text-blue-500"
                      >
                        {item.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {text && (
        <div className="max-w-4xl mx-auto pb-20 ">
          <h2 className=" text-xl font-bold mb-4 mt-8">Combined Overview</h2>
          <p> {text}</p>
        </div>
      )}

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

      {insights.length !== 0 && (
        <div className="max-w-4xl w-[896px] mx-auto pb-20 text-white bg-black px-4">
          <h2 className="flex items-center text-lg font-bold mb-6">
            Key Insights <span className="ml-2">→</span>
          </h2>
          {/* {insights.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between border-t border-white py-4">
                <div className="flex items-center gap-2">
                  <span>→</span>
                  <span className="text-md">{item.insight}</span>
                </div>
              </div>

              <div className="flex justify-end  mt-1 ">
                <a
                  href={item.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#23b5b5] "
                >
                  Visit Site
                </a>
              </div>
            </div>
          ))} */}
          {insights.map((item, i) => (
            <div key={i} className="mb-4">
              <div className="flex items-center justify-between border-t border-white py-4">
                <div className="flex items-center gap-2">
                  <span>→</span>
                  <span className="text-md">{item.insight}</span>
                </div>
              </div>

              {/* Show details conditionally */}
              {expanded[i] && <p className=" mt-2 px-2">{item.details}</p>}

              <div className="flex justify-between items-center gap-4 mt-1 px-2">
                <button
                  onClick={() => toggleExpand(i)}
                  className=" underline text-gray-400"
                >
                  {expanded[i] ? "Show less" : "Show more"}
                </button>
                <a
                  href={item.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-[#23b5b5]"
                >
                  Visit Site
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-48  right-0 bg-black z-10">
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
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaLocationArrow />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeepSearch;

{
  /* <div className="absolute mt-2 w-[700px] bg-[#1c1f2e] border border-gray-700 rounded-lg p-4 shadow-lg flex gap-4 z-50">
  <div className="flex-1">
    <h3 className="text-white text-sm mb-2">Video's</h3>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border border-gray-500 rounded-lg p-2 text-white"
        >
          <div className="flex items-center gap-2">
            <span>→</span>
            <span className="flex-1">1st Video’s title in link ______</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>● Name</span>
            <span>Date</span>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="flex-1">
    <h3 className="text-white text-sm mb-2">Research</h3>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border border-gray-500 rounded-lg p-2 text-white"
        >
          <div className="flex items-center gap-2">
            <span>→</span>
            <span className="flex-1">Research paper link ______</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>By ______</span>
            <span>Date</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>; */
}
