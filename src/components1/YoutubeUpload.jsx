import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CLIENT_ID =
  "318413348080-2s9aqq746ih1lvpcdr9ib9guglbctlio.apps.googleusercontent.com";
const REDIRECT_URI = "http://localhost:8000/api/youtube/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/youtube.upload";

const YouTubeUpload = () => {
  const location = useLocation();
  const { videoUrl } = location.state || "";
  const [videoBlob, setVideoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(videoUrl);
        const blob = await response.blob();
        const file = new File([blob], "video.mp4", { type: "video/mp4" });
        setVideoBlob(file);
      } catch (err) {
        console.error("Failed to fetch video from URL:", err);
      }
    };

    if (videoUrl) fetchVideo();
  }, [videoUrl]);

  const handleLogin = () => {
    const returnTo = encodeURIComponent(window.location.href);
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
      SCOPE
    )}&access_type=offline&prompt=consent&state=${returnTo}`;

    window.location.href = authUrl;
  };

  const handleUpload = async () => {
    if (!videoBlob) return alert("Video not ready.");

    setUploading(true);
    const formData = new FormData();
    formData.append("video", videoBlob);

    try {
      const res = await fetch("http://localhost:8000/api/youtube/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await res.json();

      if (result.videoId) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${result.videoId}`;
        window.open(youtubeUrl, "_blank");
      } else {
        alert("Upload succeeded but no video ID returned.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=" bg-black text-white flex items-center justify-center px-4 py-10">
      <div className=" w-full max-w-3xl rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-[#23b5b5] mb-6">
          Upload to YouTube
        </h1>

        <button
          className="bg-[#23b5b5] hover:bg-[#1aa2a2] text-white px-6 py-2 rounded-md font-semibold transition"
          onClick={handleLogin}
        >
          Sign in with Google
        </button>

        <div className="mt-8">
          {videoBlob && (
            <>
              <video controls className="mt-4 w-full rounded-md">
                <source src={URL.createObjectURL(videoBlob)} type="video/mp4" />
              </video>

              <button
                onClick={handleUpload}
                className="mt-6 bg-[#23b5b5] hover:bg-[#1aa2a2] text-white px-6 py-2 rounded-md font-semibold transition disabled:opacity-50"
                disabled={!videoBlob || uploading}
              >
                {uploading ? "Uploading..." : "Upload Video"}
              </button>
            </>
          )}

          {!videoBlob && (
            <p className="mt-4 text-sm text-gray-400 italic">
              Preparing video...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeUpload;
