import React, { useState, useEffect } from "react";
import DownloadButtons from "./DownloadButtons";
export default function AIGIFGenerator() {
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState("Humor");
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [inspirationGifs, setInspirationGifs] = useState({});
  const [isInspirationLoading, setIsInspirationLoading] = useState(false);

  const tabs = ["Humor", "Witty", "Relatable", "Work"];

  const fetchCategoryGifs = async (category) => {
    setIsInspirationLoading(true);
    try {
      const API_KEY =
        import.meta.env.VITE_GIPHY_API_KEY || "your_giphy_api_key";
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(
          category
        )}&limit=6&rating=g&lang=en`
      );
      const json = await response.json();
      const gifs = Array.isArray(json?.data) ? json.data : [];
      setInspirationGifs((prev) => ({ ...prev, [category]: gifs }));
    } catch (error) {
      console.error("Failed to fetch inspiration GIFs:", error);
      setInspirationGifs((prev) => ({ ...prev, [category]: [] }));
    } finally {
      setIsInspirationLoading(false);
    }
  };

  useEffect(() => {
    if (!inspirationGifs[activeTab]) {
      fetchCategoryGifs(activeTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Removed upload/camera/mic helpers

  // Removed generation logic

  // Removed all fallback generation helpers

  // Removed server-side getGIF helper

  // Finds the "best" existing GIF for the given text using Giphy's translate endpoint
  const translateToGif = async (text) => {
    const API_KEY = import.meta.env.VITE_GIPHY_API_KEY || "your_giphy_api_key";
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${encodeURIComponent(
        text
      )}`
    );
    const data = await response.json();
    return data.data; // Returns single GIF object
  };

  const handleFindBestGif = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text to search for a GIF.");
      return;
    }

    setIsLoading(true);
    try {
      const gifData = await translateToGif(inputText.trim());
      const imageUrl =
        gifData?.images?.downsized_medium?.url ||
        gifData?.images?.downsized?.url ||
        gifData?.images?.original?.url;

      if (imageUrl) {
        setUrl(imageUrl);
      } else {
        alert("No GIF found for the given text. Try different words.");
      }
    } catch (error) {
      console.error("Error fetching GIF from Giphy:", error);
      alert("Failed to fetch GIF. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {url ? (
        <div className="flex flex-col gap-2 items-center w-full">
          <h1 className="text-3xl mb-6">Selected GIF</h1>
          <div className="flex items-center gap-4">
            <DownloadButtons url={url} />
            <img
              src={url}
              alt="gif"
              className="h-72 w-72 object-cover rounded-lg border border-gray-300 shadow"
            />
          </div>
          <div className="flex relative items-center gap-2"></div>
          <button
            onClick={() => setUrl("")}
            className="mt-4 bg-[#23b5b5] hover:bg-[#1da3a3] text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200"
          >
            Find Another
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-12">
            AI GIF Generator
          </h1>

          {/* Generate GIF Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">
              Tell me about a GIF you want
            </h2>

            {/* Input Container */}
            <div className="relative mb-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe what the GIF should communicate — the story, the mood, or the core message behind the visual"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-400 resize-none h-24 pr-32"
              />

              <div className="absolute right-3 bottom-3">
                <button
                  onClick={handleFindBestGif}
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLoading
                      ? "bg-indigo-600/60 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isLoading ? "Searching..." : "Find Best GIF"}
                </button>
              </div>
            </div>

            {/* Upload Status removed */}
          </div>

          {/* Camera mic/upload UI removed */}

          <div className="flex flex-col items-center gap-6 mt-6"></div>

          {/* Looking for Inspiration Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Looking for Inspiration?
            </h2>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-white text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {isInspirationLoading && !inspirationGifs[activeTab]
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="aspect-square bg-gray-800 animate-pulse rounded-lg"
                    />
                  ))
                : (inspirationGifs[activeTab] || []).map((gif) => {
                    const imgUrl =
                      gif?.images?.fixed_width_small?.url ||
                      gif?.images?.downsized_small?.mp4 ||
                      gif?.images?.downsized_medium?.url ||
                      gif?.images?.original?.url;
                    return (
                      <button
                        key={gif.id}
                        onClick={() => {
                          const urlToUse =
                            gif?.images?.downsized_medium?.url ||
                            gif?.images?.original?.url ||
                            imgUrl;
                          if (urlToUse) setUrl(urlToUse);
                        }}
                        className="aspect-square bg-gray-700 rounded-lg overflow-hidden hover:opacity-90 transition"
                        title={gif?.title || activeTab}
                      >
                        {imgUrl ? (
                          <img
                            src={imgUrl}
                            alt={gif?.title || activeTab}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-800" />
                        )}
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
