import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const CLIENT_ID = "1080089039501-2rkku1lknn3d0ukj3a3oh8hi3rg496hl.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:8000/api/youtube/oauth2callback";
const SCOPE = "https://www.googleapis.com/auth/youtube.upload";

const YouTubeUpload = () => {
  const location = useLocation();
  const { videoUrl } = location.state || {};
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

  const handleUpload = async (isShort) => {
  if (!videoBlob) return alert("Video not ready.");

  const accessToken = localStorage.getItem("yt_access_token");
  if (!accessToken) return alert("User not authenticated with YouTube.");

  setUploading(true);

  const formData = new FormData();
  formData.append("video", videoBlob);
  formData.append("isShort", isShort); // <-- distinguish short vs video
  formData.append("access_token", accessToken); // ✅ send token to backend

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
    console.error("❌ Upload failed:", err);
    alert("Upload failed.");
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="bg-black text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-2xl shadow-lg p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#23b5b5]">Upload to YouTube</h1>
          <div className="flex gap-2">
            <button
              onClick={() => handleUpload(true)}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={!videoBlob || uploading}
            >
              {uploading ? "Uploading..." : "Upload as Short"}
            </button>
            <button
              onClick={() => handleUpload(false)}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
              disabled={!videoBlob || uploading}
            >
              {uploading ? "Uploading..." : "Upload as Video"}
            </button>
          </div>
        </div>

        <div className="mt-8">
          {videoBlob ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <a
                  href={URL.createObjectURL(videoBlob)}
                  download="video.mp4"
                  className="text-sm text-blue-400 underline hover:text-blue-300"
                >
                  Download Video
                </a>
              </div>

              <video controls className="mt-2 w-full rounded-md">
                <source src={URL.createObjectURL(videoBlob)} type="video/mp4" />
              </video>
            </>
          ) : (
            <p className="mt-4 text-sm text-gray-400 italic">Preparing video...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubeUpload;
