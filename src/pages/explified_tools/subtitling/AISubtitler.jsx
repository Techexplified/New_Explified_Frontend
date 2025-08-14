<<<<<<< HEAD
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
=======
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
>>>>>>> fb4b60570db27d0b4c4841adb8c28c93450d8346
import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../../../utils/subtitler_slice/SubtitlerSlice";
import SubtitlerHeader from "./components/SubtitlerHeader";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";
<<<<<<< HEAD
=======
import { FileVideo, Link2, Mic, Music, Sparkles, Upload } from "lucide-react";
import SidebarOnHover from "../../../reusable_components/SidebarOnHover";
>>>>>>> fb4b60570db27d0b4c4841adb8c28c93450d8346

export default function AISubtitler() {
  // const [uploadedFile, setUploadedFile] = useState(null);

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
<<<<<<< HEAD
    <div className="min-h-screen relative bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      {/* Main Content */}
      <WorkFlowButton id={"subtitler"} />
      <div className="flex flex-col items-center justify-center px-4 py-12">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-wide">
            AI SUBTITLE GENERATOR
          </h1>
          <p className="text-xl text-[#23b5b5] font-light">
            Your Voice. Global Impact. One Subtitle at a Time.
          </p>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-4xl">
          <div className="bg-[#111827] backdrop-blur-sm rounded-2xl p-12 border border-slate-600/50">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-white mb-2">
                Drop your file here and let us subtitle it for you
              </h2>
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {/* Hidden file input */}
              <input
                type="file"
                name="video"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".mp4,.mp3,.wav,.avi,.mov,.mkv,.flv,.wmv,.m4a,.aac,.ogg,.flac"
                className="hidden"
              />

              <button
                onClick={handleUploadClick}
                className="flex-1 bg-slate-800 hover:bg-slate-600 border border-slate-500 text-white rounded-xl py-4 px-6 transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-lg font-medium mb-1">
                    {uploadedFile ? uploadedFile.name : "Upload File"}
                  </div>
                  <div className="text-sm text-slate-300">
                    {uploadedFile
                      ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`
                      : "in MP4, MP3,WAV"}
=======
    <div className="min-h-screen relative bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 text-white flex overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-minimal-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-minimal-primary rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-minimal-primary rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse delay-500"></div>
      </div>

      <SidebarOnHover
        link={"https://explified.com/subtitler-tool-landing-page/"}
        toolName={"AI Subtitler"}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 ml-0 relative z-0">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-minimal-primary to-minimal-primary/80 rounded-2xl flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-gray-200 to-minimal-primary bg-clip-text text-transparent">
              AI SUBTITLER
            </h1>
          </div>
          <p className="text-2xl text-minimal-primary font-light mb-2">
            Your Voice. Global Impact. One Subtitle at a Time.
          </p>
          <p className="text-minimal-muted max-w-2xl mx-auto">
            Transform your audio and video content with AI-powered subtitle
            generation. Support multiple languages and formats with professional
            accuracy.
          </p>
        </div>

        {/* Upload Section */}
        <div className="w-full max-w-5xl">
          <div className="bg-minimal-card backdrop-blur-xl rounded-3xl p-8 border border-minimal-primary/20 shadow-2xl shadow-black/50 relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-minimal-primary/5 to-transparent pointer-events-none"></div>

            <div className="text-center mb-4 relative">
              <h2 className="text-3xl font-bold text-minimal-white mb-3">
                Drop your file here
              </h2>
              <p className="text-lg text-minimal-gray-300">
                Let us subtitle it for you with AI precision
              </p>
            </div>

            {/* Upload Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-4">
              <button
                onClick={handleFileUpload}
                className="group flex-1 bg-minimal-dark-100/80 hover:bg-minimal-dark-100 border-2 border-minimal-primary/30 hover:border-minimal-primary/60 text-white rounded-2xl py-2  transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-minimal-primary/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-center relative z-10">
                  <Upload className="w-8 h-8 mx-auto mb-4 text-minimal-primary group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-semibold mb-2">Upload File</div>
                  <div className="text-sm text-minimal-muted flex items-center justify-center gap-2">
                    <span>MP4</span>
                    <span>•</span>
                    <span>MP3</span>
                    <span>•</span>
                    <span>WAV</span>
>>>>>>> fb4b60570db27d0b4c4841adb8c28c93450d8346
                  </div>
                </div>
              </button>

<<<<<<< HEAD
              <button className="flex-1 bg-slate-800 hover:bg-slate-600 border border-slate-500 text-white rounded-xl py-4 px-6 transition-all duration-300 hover:scale-105">
                <div className="text-center">
                  <div className="text-lg font-medium">Paste URL</div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-row-reverse mt-6">
            <button
              onClick={handleGenerate}
              className="bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white rounded-xl py-4 px-12 text-lg font-medium transition-all duration-300 hover:scale-105"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Video Preview Section (when file is uploaded) */}
        {/* {uploadedFile && (
          <div className="w-full max-w-4xl mt-8">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50">
              <video
                controls
                className="w-full rounded-lg"
                style={{ maxHeight: "400px" }}
              >
                <source
                  src={URL.createObjectURL(uploadedFile)}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )} */}
=======
              <button className="group flex-1 bg-minimal-dark-100/80 hover:bg-minimal-dark-100 border-2 border-minimal-primary/30 hover:border-minimal-primary/60 text-white rounded-2xl py-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-minimal-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-minimal-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-center relative z-10">
                  <Link2 className="w-8 h-8 mx-auto mb-4 text-minimal-primary group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-semibold mb-2">Paste URL</div>
                  <div className="text-sm text-minimal-muted">
                    YouTube, Vimeo & more
                  </div>
                </div>
              </button>
            </div>

            {/* Additional Options */}
            <div className="border-t border-minimal-primary/20 pt-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="flex items-center justify-center gap-2 text-minimal-muted">
                  <div className="w-2 h-2 bg-minimal-primary rounded-full"></div>
                  <span className="text-sm">Multi-language support</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-minimal-muted">
                  <div className="w-2 h-2 bg-minimal-primary rounded-full"></div>
                  <span className="text-sm">Real-time processing</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-minimal-muted">
                  <div className="w-2 h-2 bg-minimal-primary rounded-full"></div>
                  <span className="text-sm">Export in SRT, VTT</span>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex flex-row-reverse mt-8">
            <button className="group bg-gradient-to-r from-minimal-primary to-minimal-primary/80 hover:from-minimal-primary/80 hover:to-minimal-primary text-white rounded-2xl py-5 px-16 text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-minimal-primary/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-3">
                Generate
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>
        </div>
>>>>>>> fb4b60570db27d0b4c4841adb8c28c93450d8346
      </div>
    </div>
  );
}
