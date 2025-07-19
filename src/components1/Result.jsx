import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PEXELS_API_KEY = 'RsRRug5EPDttr3Pb7rh56YkcYoyJcDQZgqYJ0eEGbZR4VzOwNuTVuGLu';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
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
          const suitableVideo = data.videos[0].video_files.find(v => v.width === 600 && v.height === 300);
          const defaultVideo = data.videos[0].video_files[0];
          setVideoUrl((suitableVideo || defaultVideo).link);
        }
      } catch (err) {
        console.error('Failed to fetch video:', err);
      }
    };

    fetchVideo();
  }, [query]);

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'meme-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTryMore = () => {
    navigate('/meme');
  };

  return (
    <div className="bg-black text-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="text-cyan-400 text-xl">⏵</div>
        <div className="text-white text-xl font-bold">Explified</div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-white font-semibold">▴ Explore</span>
        <button className="bg-teal-700 text-white text-xs px-3 py-1 rounded-full">
          AI VIDEO GENERATOR ✕
        </button>
      </div>

      <h1 className="text-center text-3xl font-bold mb-8">AI Meme Generator</h1>

      {/* Video Result */}
      <div className="flex justify-center items-start gap-4">
        {/* Side Icons */}
        <div className="flex flex-col items-center gap-4">
          <span className="text-white text-lg">⬇</span>
          <img src="https://img.icons8.com/color/48/youtube-play.png" alt="YouTube" />
          <img src="https://img.icons8.com/color/48/google-drive.png" alt="Drive" />
        </div>

        {/* Video Display */}
        <div className="bg-gray-400 flex items-center justify-center relative" style={{ width: '600px', height: '300px' }}>
          {videoUrl ? (
            <video style={{ width: '600px', height: '300px' }} controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <span className="text-black text-xl font-bold">Final Meme</span>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-8 flex justify-center gap-4">
        <button onClick={handleDownload} className="bg-teal-600 px-6 py-2 text-white rounded-md">Download</button>
        <button onClick={handleTryMore} className="bg-teal-600 px-6 py-2 text-white rounded-md">Try More</button>
      </div>
    </div>
  );
};

export default Result;
