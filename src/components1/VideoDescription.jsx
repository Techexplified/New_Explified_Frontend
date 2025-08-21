import React, { useState } from "react";
import { X, Link, Play } from "lucide-react";

const NewPost = () => {
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [links, setLinks] = useState("");
  const [sections, setSections] = useState(["", ""]);
  const [bestTime, setBestTime] = useState("");

  const timeOptions = ["08:00 Am", "09:00 Pm", "12:00 Pm", "Custom"];

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center text-lg">
      {/* Title */}
      <h1 className="text-3xl font-semibold mb-4">New Post</h1>

      {/* Video Placeholder */}
      <div className="w-full max-w-3xl bg-gray-300 aspect-video mb-8" />

      {/* Description Field */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1 text-xl">Description:</label>
        <div className="relative border rounded-xl p-3" style={{ borderColor: "#23b5b5" }}>
          <textarea
            className="w-full bg-transparent outline-none resize-none h-24"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {description && (
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setDescription("")}
            />
          )}
        </div>
      </div>

      {/* Hashtags */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1">Hashtags:</label>
        <div className="relative border rounded-xl p-3" style={{ borderColor: "#23b5b5" }}>
          <input
            type="text"
            className="w-full bg-transparent outline-none"
            placeholder="Enter hashtags..."
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
          {hashtags && (
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setHashtags("")}
            />
          )}
        </div>
      </div>

      {/* Relevant Links */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1">Relevant links:</label>
        <div
          className="relative border rounded-xl p-3 flex items-center"
          style={{ borderColor: "#23b5b5" }}
        >
          <Link className="mr-2" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none"
            placeholder="https://"
            value={links}
            onChange={(e) => setLinks(e.target.value)}
          />
          {links && (
            <X className="ml-2 cursor-pointer" onClick={() => setLinks("")} />
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-1">Sections:</label>
        <div className="border rounded-xl p-3 space-y-3" style={{ borderColor: "#23b5b5" }}>
          {sections.map((text, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-400" />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none border-b border-gray-500 py-1"
                placeholder={`Section ${idx + 1}`}
                value={text}
                onChange={(e) => {
                  const updated = [...sections];
                  updated[idx] = e.target.value;
                  setSections(updated);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Best Time to Post */}
      <div className="w-full max-w-3xl mb-8">
        <label className="block mb-4">Best time to post:</label>
        <div className="flex flex-wrap gap-4">
          {timeOptions.map((time) => (
            <button
              key={time}
              className={`px-4 py-1 rounded-full border transition ${
                bestTime === time
                  ? "text-black"
                  : "text-white"
              }`}
              style={{
                backgroundColor: bestTime === time ? "#23b5b5" : "transparent",
                borderColor: "#23b5b5",
              }}
              onClick={() => setBestTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Ask & Post Buttons */}
      <div className="w-full max-w-3xl flex justify-between items-center">
        {/* Ask Question */}
        <div
          className="flex items-center rounded-full px-4 py-2 w-[75%]"
          style={{ border: "1px solid #23b5b5" }}
        >
          <input
            type="text"
            placeholder="Ask me questions"
            className="flex-1 bg-transparent outline-none text-white"
          />
          <Play className="w-5 h-5 cursor-pointer text-white" />
        </div>

        {/* Post Button */}
        <button
          className="ml-4 px-6 py-2 rounded-full transition text-white"
          style={{
            border: "1px solid #23b5b5",
            backgroundColor: "#000",
          }}
          onClick={() => alert("Post submitted (stub)")}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#23b5b5")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#000")}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default NewPost;
