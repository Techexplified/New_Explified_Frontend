import React, { useState } from 'react';
import axios from 'axios';

const Aibackground = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [color, setColor] = useState('#23b5b5');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    if (!image || !color) {
      alert('Please select an image and color');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('color', color);

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/bg/color',
        formData,
        { responseType: 'blob' }
      );

      const imageBlob = new Blob([res.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setResult(imageUrl);
    } catch (err) {
      console.error('Upload error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" text-white p-6 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8">
        <h2 className="text-3xl font-bold text-center text-[#23b5b5]">
          Replace Background with Solid Color
        </h2>

        <div className=" p-6 rounded-2xl shadow-xl space-y-6">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md"
          />

          <div>
            <label htmlFor="color" className="block mb-2 text-sm text-gray-300">
              Select Background Color
            </label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 rounded-md border-2 border-[#23b5b5] cursor-pointer"
              style={{ backgroundColor: '#1f2937' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#23b5b5] hover:bg-[#1ab0b0] text-white font-semibold py-2 rounded-md transition duration-200"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Processing...
              </div>
            ) : (
              'Submit'
            )}
          </button>
        </div>

        {(imagePreview || result) && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {imagePreview && (
              <div>
                <h3 className="font-semibold text-[#23b5b5] text-lg mb-2">Original Image:</h3>
                <img
                  src={imagePreview}
                  alt="Original Preview"
                  className="w-full rounded-md border-2 border-[#23b5b5]"
                />
              </div>
            )}

            {result && (
              <div>
                <h3 className="font-semibold text-[#23b5b5] text-lg mb-2">Result:</h3>
                <img
                  src={result}
                  alt="Result"
                  className="w-full rounded-md border-2 border-[#23b5b5]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Aibackground;
