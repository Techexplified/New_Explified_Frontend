import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../../../utils/subtitler_slice/SubtitlerSlice";
import SubtitlerHeader from "./components/SubtitlerHeader";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";
import { FileVideo, Link2, Mic, Music, Sparkles, Upload } from "lucide-react";

export default function AISubtitler() {
  // const [uploadedFile, setUploadedFile] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [vttURL, setVttURL] = useState();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const uploadedFile = useSelector((state) => state.video);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // setUploadedFile(file);
      dispatch(addVideo(file));
      console.log("File uploaded:", file.name, file.type, file.size);
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     const formData = new FormData(event.currentTarget);

  //     const response = await axiosInstance.post("api/aiSubtitler", formData);

  //     const srtString = response?.data?.content;
  //     const vttString = "WEBVTT\n\n" + srtString.replace(/,/g, ".");

  //     const blob = new Blob([vttString], { type: "text/vtt" });
  //     const vttURL = URL.createObjectURL(blob);

  //     setVttURL(vttURL);
  //     // const blob = new Blob([response.data.subs], { type: "text/plain" });
  //     // const link = document.createElement("a");
  //     // link.href = URL.createObjectURL(blob);
  //     // link.download = "subtitle.srt";
  //     // document.body.appendChild(link);
  //     // link.click();
  //     // link.remove();

  //     // navigate("/ai-subtitler-ui");
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  const handleGenerate = () => {
    navigate("/ai-subtitler-ui");
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 text-white flex overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#23b5b5] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-[#23b5b5] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-[#23b5b5] rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-500"></div>
      </div>

      {/* Sidebar hover trigger area */}
      <div
        className="absolute left-0 top-0 h-full w-6 cursor-pointer z-20 transition-colors"
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-black/95 backdrop-blur-xl border-r border-[#23b5b5]/20 
        flex flex-col justify-between transition-all duration-300 z-10
        ${sidebarOpen ? "w-56 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
              AI Subtitler
            </h2>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mb-8">
          <Link to="https://explified.com/subtitler-tool-landing-page/">
            <button className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#23b5b5]/25">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 ml-0 relative z-0">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#23b5b5] to-[#1a9999] rounded-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-200 to-[#23b5b5] bg-clip-text text-transparent">
              AI SUBTITLER
            </h1>
          </div>
          <p className="text-2xl text-[#23b5b5] font-light mb-2">
            Your Voice. Global Impact. One Subtitle at a Time.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transform your audio and video content with AI-powered subtitle
            generation. Support multiple languages and formats with professional
            accuracy.
          </p>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-5xl">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-[#23b5b5]/20 shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#23b5b5]/5 to-transparent pointer-events-none"></div>

            <div className="text-center mb-4 relative">
              <h2 className="text-3xl font-bold text-white mb-3">
                Drop your file here
              </h2>
              <p className="text-lg text-gray-300">
                Let us subtitle it for you with AI precision
              </p>
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-4">
              <button className="group flex-1 bg-gray-800/80 hover:bg-gray-700/80 border-2 border-[#23b5b5]/30 hover:border-[#23b5b5]/60 text-white rounded-2xl py-2  transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#23b5b5]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#23b5b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-center relative z-10">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-[#23b5b5] group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-semibold mb-2">Upload File</div>
                  <div className="text-sm text-gray-400 flex items-center justify-center gap-2">
                    <span>MP4</span>
                    <span>•</span>
                    <span>MP3</span>
                    <span>•</span>
                    <span>WAV</span>
                  </div>
                </div>
              </button>

              <button className="group flex-1 bg-gray-800/80 hover:bg-gray-700/80 border-2 border-[#23b5b5]/30 hover:border-[#23b5b5]/60 text-white rounded-2xl py-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#23b5b5]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#23b5b5]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-center relative z-10">
                  <Link2 className="w-8 h-8 mx-auto mb-4 text-[#23b5b5] group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-semibold mb-2">Paste URL</div>
                  <div className="text-sm text-gray-400">
                    YouTube, Vimeo & more
                  </div>
                </div>
              </button>
            </div>

            {/* Additional Options */}
            <div className="border-t border-[#23b5b5]/20 pt-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-[#23b5b5] rounded-full"></div>
                  <span className="text-sm">Multi-language support</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-[#23b5b5] rounded-full"></div>
                  <span className="text-sm">Real-time processing</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-[#23b5b5] rounded-full"></div>
                  <span className="text-sm">Export in SRT, VTT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-row-reverse mt-8">
            <button className="group bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] text-white rounded-2xl py-5 px-16 text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#23b5b5]/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3">
                Generate
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
