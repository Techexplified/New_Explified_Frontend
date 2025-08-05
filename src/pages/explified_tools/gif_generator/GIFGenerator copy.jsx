import axios from "axios";
import React, { useState } from "react";
const BANNERBEAR_API_KEY = "bb_pr_1152d90e39f2f4f9a95b6589c60504";
export default function AIGIFGenerator() {
  const [frames, setFrames] = useState([{ text: "", imageUrl: "" }]);
  const [uid, setUid] = useState("2wambxDJJYQzD4vLWQ");
  const [gif, setGif] = useState("");

  const handleChange = (index, field, value) => {
    const updatedFrames = [...frames];
    updatedFrames[index][field] = value;
    setFrames(updatedFrames);
  };

  const addFrame = () => {
    setFrames([...frames, { text: "", imageUrl: "" }]);
  };

  const removeFrame = (index) => {
    const updatedFrames = frames.filter((_, i) => i !== index);
    setFrames(updatedFrames);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedFrames = frames.map((frame) => [
      { name: "layer1", text: frame.text },
      { name: "photo", image_url: frame.imageUrl },
    ]);

    // console.log(formattedFrames);

    const data = {
      template: "lzw71BD6E4jB50eYkn",
      frames: formattedFrames,
    };

    const response = await axios.post(
      "https://api.bannerbear.com/v2/animated_gifs",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BANNERBEAR_API_KEY}`,
        },
      }
    );
    console.log(response);
    console.log(response.data.uid);
    setUid(response.data.uid);
  };

  const getGIFStatus = async () => {
    try {
      console.log(uid);

      const response = await axios.get(
        `https://api.bannerbear.com/v2/animated_gifs/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${BANNERBEAR_API_KEY}`,
          },
        }
      );

      console.log("GIF Status:", response.data);
      setGif(response?.data?.image_url);
    } catch (error) {
      console.error("Error fetching GIF status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 bg-white shadow-md rounded space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center">
          GIF Frame Creator
        </h2>

        {frames.map((frame, index) => (
          <div
            key={index}
            className="border p-4 rounded bg-gray-50 relative space-y-2"
          >
            <div className="text-gray-600 font-medium">Frame {index + 1}</div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Text (Layer 1)
              </label>
              <input
                type="text"
                value={frame.text}
                onChange={(e) => handleChange(index, "text", e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Image URL (Photo)
              </label>
              <input
                type="url"
                value={frame.imageUrl}
                onChange={(e) =>
                  handleChange(index, "imageUrl", e.target.value)
                }
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {frames.length > 1 && (
              <button
                type="button"
                onClick={() => removeFrame(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addFrame}
            className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
          >
            ➕ Add Frame
          </button>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Generate GIF
          </button>
        </div>
      </form>

      <button onClick={getGIFStatus} className="bg-blue-500 rounded-md p-">
        Get GIF
      </button>

      {gif && <img src={gif} alt="gif" />}
    </div>
  );
}
