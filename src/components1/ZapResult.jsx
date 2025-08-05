import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Play,
  Download,
} from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms';
const PEXELS_API_KEY = 'RsRRug5EPDttr3Pb7rh56YkcYoyJcDQZgqYJ0eEGbZR4VzOwNuTVuGLu';

const ZapResultStyled = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const type = new URLSearchParams(location.search).get('type') || 'video'; // short or video

  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!query) return navigate('/');

    fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=5`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let video = null;

        // Prefer vertical (short) videos if type is short
        if (type === 'short') {
          video =
            data.videos?.find((v) => {
              const { width, height } = v.video_files?.[0] || {};
              return height > width;
            }) || data.videos?.[0];
        } else {
          video = data.videos?.[0];
        }

        if (video) {
          setVideoUrl(
            video.video_files.find((v) => v.quality === 'hd')?.link ||
              video.video_files[0].link
          );
        }
      })
      .finally(() => setLoading(false));
  }, [query, type]);

  const handleFinalSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      alert('Thanks for your feedback!');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Title and Download Icon */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-4">
        <h1 className="text-3xl font-semibold">Text to video generator</h1>
        {videoUrl && (
          <a href={videoUrl} download>
            <Download className="w-5 h-5 cursor-pointer" />
          </a>
        )}
      </div>

      {/* Video or Placeholder */}
      <div
        className={`w-full ${
          type === 'short' ? 'max-w-xs aspect-[9/16]' : 'max-w-3xl aspect-video'
        } bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden`}
      >
        {loading ? (
          <p className="text-black font-semibold">Loading...</p>
        ) : videoUrl ? (
          <video controls className="w-full h-full object-cover">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p className="text-black font-bold text-lg">
            No video found for "{query}"
          </p>
        )}
      </div>

      {/* Suggestion Input */}
      <div className="w-full max-w-3xl mt-10">
        <label className="block text-sm mb-2 text-gray-300">
          Suggest any changes:
        </label>
        <div className="flex items-center bg-transparent border border-teal-500 rounded-full px-4 py-2">
          <input
            type="text"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder="e.g., make it more funny / include dogs / add narration"
            className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-400"
          />
          <button
            onClick={() => {
              if (!videoUrl) return;
              navigate('/enhanced', { state: { videoUrl, query, type } });
            }}
            className="ml-2"
          >
            <Play className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* AI Response (if any) */}
      {responseData && (
        <div className="bg-zinc-800 p-4 rounded-lg w-full max-w-3xl mt-8 space-y-4">
          {responseData.split('\n').map((line, idx) => (
            <p key={idx} className="text-gray-100 whitespace-pre-line">
              {line}
            </p>
          ))}

          {/* Final Confirmation */}
          <div className="mt-6">
            <label className="block text-sm mb-2 text-gray-400">
              Are these changes OK?
            </label>
            <input
              type="text"
              value={finalFeedback}
              onChange={(e) => setFinalFeedback(e.target.value)}
              placeholder="Yes / No / Needs more..."
              className="w-full p-2 rounded-md bg-gray-700 text-white"
            />
          </div>

          <button
            onClick={handleFinalSubmit}
            className="mt-3 bg-blue-600 px-4 py-2 rounded-md font-semibold"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ZapResultStyled;

