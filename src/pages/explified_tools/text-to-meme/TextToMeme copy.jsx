import { useState } from "react";
import axiosInstance from "../../../network/axiosInstance";

export default function AIMemeGenerator() {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUid] = useState("cmdrhmmv703yxzd0znr6bd33q");
  const [url, setUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTone, setSelectedTone] = useState("");

  const handleMemeGenerate = async () => {
    setShowModal(true);
  };

  const handleToneClick = (tone) => {
    setSelectedTone(tone);
  };

  const handleGoClick = async () => {
    setShowModal(false);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "http://localhost:8000/api/aiMemeGenerator",
        {
          topic: inputText,
          template: selectedTone,
        }
      );

      console.log("uid-client", response?.data?.content);
      setUid(response?.data?.content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getMeme = async () => {
    console.log("getMeme");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "http://localhost:8000/api/aiMemeGenerator/get-meme",
        {
          uid,
        }
      );
      console.log(response);
      setUrl(response?.data?.content);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 text-white flex flex-col p-6">
      {/* <SidebarOnHover
        link={"https://explified.com/video-meme-generator-ai/"}
        toolName={"AI Meme Generator"}
        id={"memegenerator"}
      /> */}

      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Text to Meme Generator
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4">
        {/* Input Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">
            Describe your meme!
          </h2>

          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What's on your mind? Type it out or attach a link — we'll meme it!"
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 resize-none"
            />

            {/* Input Actions */}
            <div className="flex items-center justify-between mt-3">
              <div></div>

              <div className="">
                <button
                  disabled={!inputText}
                  onClick={handleMemeGenerate}
                  className={`px-6 py-2 disabled:opacity-50 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors`}
                >
                  Meme
                </button>

                {showModal && (
                  <div className="fixed inset-0 text-white bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-700  px-8 py-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-200 scale-100">
                      <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold  mb-2">
                          Choose Your Meme Style
                        </h2>
                        <p className=" text-sm">
                          Select a template to bring your idea to life
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {[
                          {
                            name: "Random",
                            image: "/images/random.jpg",
                          },
                          {
                            name: "Drake Hotline Bling",
                            image: "/images/drake.jpg",
                          },
                          {
                            name: "Galaxy Brain",
                            image: "/images/galaxybrain.jpg",
                          },
                          {
                            name: "Two Buttons",
                            image: "/images/twobuttons.jpg",
                          },
                          {
                            name: "Gru's Plan",
                            image: "/images/grusplan.jpg",
                          },
                          {
                            name: "Tuxedo Winnie the Pooh",
                            image: "/images/pooh.jpg",
                          },
                          {
                            name: "Is This a Pigeon",
                            image: "/images/pigeon.jpg",
                          },
                          {
                            name: "Panik Kalm Panik",
                            image: "/images/panik.jpg",
                          },
                        ].map((tone) => (
                          <button
                            key={tone.name}
                            onClick={() => handleToneClick(tone.name)}
                            className={`group relative p-4 text-white rounded-xl border-2 transition-all duration-200 text-left hover:scale-105 ${
                              selectedTone === tone.name
                                ? "border-teal-500 bg-gray-700 shadow-lg shadow-teal-200"
                                : "border-gray-200 bg-gray-800 text-white hover:border-gray-300 hover:bg-gray-900"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={tone.image}
                                alt={tone.name}
                                className="w-12 h-12 rounded-lg object-cover group-hover:scale-110 transition-transform duration-200 shadow-sm"
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`font-medium text-sm leading-tight text-white`}
                                >
                                  {tone.name}
                                </p>
                              </div>
                              {selectedTone === tone.name && (
                                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowModal(false)}
                          className="flex-1 px-6 py-3 rounded-xl border border-gray-300  font-medium hover:bg-gray-900 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleGoClick}
                          disabled={!selectedTone}
                          className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                            selectedTone
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Create Meme
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 mt-6">
            <button
              onClick={getMeme}
              disabled={!uid || isLoading}
              className="bg-[#23b5b5] hover:bg-[#1da3a3] disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-full shadow-md transition-all duration-200"
            >
              Get GIF
            </button>

            {url && (
              <div className="flex flex-col items-center gap-4">
                <img
                  src={url}
                  alt="gif"
                  className="h-48 w-72 object-cover rounded-lg border border-gray-300 shadow"
                />
                <a href={url} download="my-gif.gif">
                  <button className="bg-[#23b5b5] hover:bg-[#1da3a3] text-white font-medium px-4 py-2 rounded-full shadow transition duration-200">
                    Download GIF
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <Inspiration /> */}
    </div>
  );
}
