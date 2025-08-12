import React, { useState, useEffect } from "react";
import DownloadButtons from "./DownloadButtons";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";
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
    <div className="relative min-h-screen bg-black text-gray-100">
      <WorkFlowButton id={"gifgenerator"} />

      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10">
        {url ? (
          <div className="flex flex-col items-center">
            <h1 className="mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
              Selected GIF
            </h1>
            <div className="flex w-full max-w-3xl flex-col items-center gap-6 rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-2xl backdrop-blur">
              <img
                src={url}
                alt="gif"
                className="h-auto max-h-[420px] w-full rounded-xl object-contain"
              />
              <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                <DownloadButtons url={url} />
                <button
                  onClick={() => setUrl("")}
                  className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white shadow-lg ring-1 ring-inset ring-teal-400/20 transition-colors hover:bg-teal-500"
                >
                  Find Another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <header className="mb-10 text-center">
              <h1 className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-4xl font-bold text-transparent">
                AI GIF Generator
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-400">
                Search the perfect reaction or moment. Describe the vibe, and
                we’ll find the best matching GIF instantly.
              </p>
            </header>

            <section className="mb-12 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 shadow-xl">
              <h2 className="mb-4 text-lg font-semibold text-white/90">
                What GIF are you looking for?
              </h2>
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe the mood, moment, or message..."
                  className="h-28 w-full resize-none rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 pr-36 text-gray-100 placeholder-gray-500 outline-none transition focus:border-neutral-700 focus:ring-2 focus:ring-teal-600/30"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={handleFindBestGif}
                    disabled={isLoading}
                    className={`rounded-xl px-4 py-2 font-medium text-white shadow-lg ring-1 ring-inset transition-colors ${
                      isLoading
                        ? "cursor-not-allowed bg-indigo-600/60 ring-indigo-400/20"
                        : "bg-indigo-600 ring-indigo-400/20 hover:bg-indigo-500"
                    }`}
                  >
                    {isLoading ? "Searching..." : "Find Best GIF"}
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-16">
              <h2 className="mb-6 text-center text-2xl font-semibold text-white/90">
                Looking for Inspiration?
              </h2>

              <div className="mx-auto mb-8 flex w-full max-w-md items-center justify-between rounded-full border border-neutral-800 bg-neutral-900/60 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab
                        ? "bg-neutral-800 text-white shadow"
                        : "text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                {isInspirationLoading && !inspirationGifs[activeTab]
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="aspect-square animate-pulse rounded-xl border border-neutral-800 bg-neutral-900"
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
                          className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-transform hover:-translate-y-0.5 hover:ring-1 hover:ring-neutral-700"
                          title={gif?.title || activeTab}
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={gif?.title || activeTab}
                              className="h-full w-full object-cover transition-opacity group-hover:opacity-95"
                              loading="lazy"
                            />
                          ) : (
                            <div className="h-full w-full bg-neutral-900" />
                          )}
                        </button>
                      );
                    })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
