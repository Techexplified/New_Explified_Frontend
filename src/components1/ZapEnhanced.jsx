import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GEMINI_API_KEY = 'AIzaSyA3iqoMW6g81LMjWdyS24WHM32M0ie7AEs';

const ZapEnhanced = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get('query');
  const suggestion = params.get('suggestion');
  const videoUrl = params.get('video');

  const [responseData, setResponseData] = useState('');
  const [finalFeedback, setFinalFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const runGemini = async () => {
      const payload = {
        contents: [{
          parts: [
            {
              text: `Given a video about "${query}", and the user suggests "${suggestion}", generate:\n\n1. A compelling description\n2. Relevant hashtags\n3. 3 related helpful links\n\nFormat:\n\n**Description:**\n...\n\n**Hashtags:**\n...\n\n**Related Links:**\n- Link 1\n- Link 2\n- Link 3`
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
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
      setResponseData(text);
    };

    runGemini();
  }, [query, suggestion]);

  const handleFinalSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      alert('✅ Thank you for your feedback!');
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">✨ Enhanced Video Content</h1>

      {videoUrl && (
        <video controls className="w-full max-w-3xl rounded-lg mb-6">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* AI Content Output */}
      <div className="bg-zinc-800 p-5 rounded-md w-full max-w-3xl space-y-4 mb-6">
        {responseData.split('\n').map((line, idx) => (
          <p key={idx} className="whitespace-pre-line text-gray-100">{line}</p>
        ))}
      </div>

      {/* Feedback Input */}
      <div className="w-full max-w-3xl">
        <label className="text-sm text-gray-400 mb-2 block">Are these changes okay?</label>
        <input
          type="text"
          className="w-full p-2 rounded-md bg-gray-800 text-white"
          placeholder="Yes / No / Needs more..."
          value={finalFeedback}
          onChange={(e) => setFinalFeedback(e.target.value)}
        />
        <button
          onClick={handleFinalSubmit}
          className="mt-3 bg-blue-600 px-4 py-2 rounded-md font-semibold"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default ZapEnhanced;
