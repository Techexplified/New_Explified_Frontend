import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const GEMINI_API_KEY = 'AIzaSyCjxEkSZKRdCohde0z5FKaZAO624gF3wms';
const PEXELS_API_KEY = 'RsRRug5EPDttr3Pb7rh56YkcYoyJcDQZgqYJ0eEGbZR4VzOwNuTVuGLu';

const ZapResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('query');
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const [suggestion, setSuggestion] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [finalFeedback, setFinalFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!query) return navigate('/');

    fetch(`https://api.pexels.com/videos/search?query=${query}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const video = data.videos?.[0];
        if (video) {
          setVideoUrl(video.video_files.find((v) => v.quality === 'hd')?.link || video.video_files[0].link);
        }
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleSuggestionSubmit = async () => {
    if (!suggestion.trim()) return;

    const payload = {
      contents: [{
        parts: [
          {
            text: `Given a video about "${query}", and the user suggests "${suggestion}", generate:\n\n1. A compelling description for this video\n2. Relevant hashtags (comma-separated)\n3. 3 related helpful links\n\nFormat output as:\n\n**Description:**\n...\n\n**Hashtags:**\n...\n\n**Related Links:**\n- Link 1\n- Link 2\n- Link 3`
          }
        ]
      }]
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No AI response';
    setResponseData(text);
  };

  const handleFinalSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      alert('Thanks for your feedback!');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-4">🎬 Your AI-Generated Video</h2>

      {loading ? (
        <p>Loading...</p>
      ) : videoUrl ? (
        <>
          <video controls className="w-full max-w-3xl rounded-lg mb-4">
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <a
            href={videoUrl}
            download
            className="bg-indigo-500 px-4 py-2 rounded-lg font-semibold text-white mb-6"
          >
            ⬇ Download Video
          </a>

          {/* Suggest Changes Section */}
          <div className="w-full max-w-3xl mb-6">
            <label className="block text-sm mb-2 text-gray-300">Suggest any changes:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="flex-grow p-2 rounded-md bg-gray-800 text-white"
                placeholder="e.g., make it more funny / include dogs / add narration"
              />
              <button
                onClick={handleSuggestionSubmit}
                className="bg-teal-600 px-4 py-2 rounded-md text-white font-semibold"
              >
                Send
              </button>
            </div>
          </div>

          {/* AI Response Output */}
          {responseData && (
            <div className="bg-zinc-800 p-4 rounded-lg w-full max-w-3xl space-y-4">
              {responseData.split('\n').map((line, idx) => (
                <p key={idx} className="text-gray-100 whitespace-pre-line">{line}</p>
              ))}

              {/* Final Confirmation Textbox */}
              <div className="mt-6">
                <label className="block text-sm mb-2 text-gray-400">Are these changes OK?</label>
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
        </>
      ) : (
        <p>No video found for "{query}"</p>
      )}
    </div>
  );
};

export default ZapResult;
