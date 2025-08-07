import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Video,
  Download,
  Play,
  ArrowLeft,
  Share2,
  Youtube,
  HardDrive,
} from "lucide-react";

const PEXELS_API_KEY =
  "RsRRug5EPDttr3Pb7rh56YkcYoyJcDQZgqYJ0eEGbZR4VzOwNuTVuGLu";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query");
  const duration =
    parseInt(new URLSearchParams(location.search).get("duration")) || 5;
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `https://api.pexels.com/videos/search?query=${query}&per_page=1`,
          {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          }
        );
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          const suitableVideo = data.videos[0].video_files.find(
            (v) => v.width === 600 && v.height === 300
          );
          const defaultVideo = data.videos[0].video_files[0];
          setVideoUrl((suitableVideo || defaultVideo).link);
        }
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [query]);

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement("a");
      link.href = videoUrl;
      link.download = "meme-video.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTryMore = () => {
    navigate("/meme");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this AI-generated meme!",
        text: "I created this meme using AI",
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 p-6 flex items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-minimal-primary/20 rounded-xl border border-minimal-primary/30">
              <Video className="w-8 h-8 text-minimal-primary" />
            </div>
            <h1 className="text-4xl font-bold text-minimal-white">
              Your Meme is Ready!
            </h1>
          </div>
          <p className="text-minimal-muted text-lg">
            Generated from: "{query}"
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-minimal-dark-100/50 backdrop-blur-lg rounded-2xl border border-minimal-border/50 p-8 mb-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video Display */}
            <div className="flex-1">
              <div className="bg-minimal-card/30 backdrop-blur-sm rounded-xl border border-minimal-border/50 p-4">
                <div className="relative">
                  {isLoading ? (
                    <div className="w-full h-[300px] bg-minimal-card/50 rounded-lg flex items-center justify-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-minimal-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-minimal-muted">Fetching video...</p>
                      </div>
                    </div>
                  ) : videoUrl ? (
                    <video
                      className="w-full h-[300px] rounded-lg object-cover"
                      controls
                      autoPlay
                      muted
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support HTML5 video.
                    </video>
                  ) : (
                    <div className="w-full h-[300px] bg-minimal-card/50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-minimal-muted mx-auto mb-3" />
                        <p className="text-minimal-muted">No video available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:w-80">
              <div className="space-y-4">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={!videoUrl || isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-minimal-primary to-minimal-primary/80 text-minimal-white rounded-xl font-semibold hover:from-minimal-primary/90 hover:to-minimal-primary/70 transition-all duration-200 shadow-lg shadow-minimal-primary/25 hover:shadow-xl hover:shadow-minimal-primary/30 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Meme</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  disabled={!videoUrl || isLoading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-minimal-card/50 backdrop-blur-sm text-minimal-white rounded-xl border border-minimal-border/50 hover:bg-minimal-cardHover hover:border-minimal-primary/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Meme</span>
                </button>

                {/* Try More Button */}
                <button
                  onClick={handleTryMore}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-minimal-card/50 backdrop-blur-sm text-minimal-white rounded-xl border border-minimal-border/50 hover:bg-minimal-cardHover hover:border-minimal-primary/50 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Create Another</span>
                </button>

                {/* Quick Actions */}
                <div className="bg-minimal-card/30 backdrop-blur-sm rounded-xl border border-minimal-border/30 p-4">
                  <h3 className="text-minimal-white font-semibold mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-minimal-white hover:bg-minimal-cardHover rounded-lg transition-all duration-200">
                      <Youtube className="w-4 h-4" />
                      <span className="text-sm">Upload to YouTube</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-minimal-white hover:bg-minimal-cardHover rounded-lg transition-all duration-200">
                      <HardDrive className="w-4 h-4" />
                      <span className="text-sm">Save to Drive</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
