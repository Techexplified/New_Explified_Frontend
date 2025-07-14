import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../../network/axiosInstance";
import { FaSpinner } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../../../utils/subtitler_slice/SubtitlerSlice";

export default function AISubtitler() {
  // const [uploadedFile, setUploadedFile] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
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
    navigate("/ai-subtitler-ui");
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

  return (
    <div className="min-h-screen bg-black text-white ">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1"></div>
        <h1 className="text-2xl font-normal">AI Subtitler Tool</h1>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <span className="text-lg">5</span>
          <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-12">
        {/* Left Column - Main Title */}
        <div className="space-y-4">
          <h2 className="text-4xl font-normal leading-tight">
            AUTO SUBTITLE GENERATOR
          </h2>
          <p className="text-xl text-gray-300">
            Generate all the subtitles to enhance your video's
          </p>
        </div>

        {/* Right Column - Video Player */}
        <div className="flex flex-col items-center">
          <div className="w-full border border-gray-600 rounded-lg overflow-hidden">
            {/* Video Player */}
            <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
              {/* 3D Cube Icon */}
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                className="text-gray-400"
              >
                <path
                  d="M25 40 L50 25 L75 40 L75 60 L50 75 L25 60 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M50 25 L50 45 L75 60 L75 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M25 40 L50 45 L50 65 L25 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <path
                  d="M50 45 L75 60 L50 65 L25 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>

              {/* Person icon below cube */}
              <div className="absolute bottom-6">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  className="text-gray-400"
                >
                  <circle
                    cx="20"
                    cy="15"
                    r="6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path
                    d="M10 35 Q10 25 20 25 Q30 25 30 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>

            {/* Subtitle Style Options */}
            {/* <div className="flex border-t border-gray-600">
                <button className="flex-1 p-3 border-r border-gray-600 text-center hover:bg-gray-800 transition-colors">
                  <div className="text-sm font-bold mb-1">Aa</div>
                  <div className="text-xs">Black bar</div>
                </button>
                <button className="flex-1 p-3 border-r border-gray-600 text-center hover:bg-gray-800 transition-colors">
                  <div className="text-sm font-bold mb-1">Aa</div>
                  <div className="text-xs">No border</div>
                </button>
                <button className="flex-1 p-3 text-center hover:bg-gray-800 transition-colors">
                  <div className="text-sm font-bold mb-1">Aa</div>
                  <div className="text-xs">Translucent</div>
                </button>
              </div> */}
          </div>
        </div>
      </div>

      {/* Bottom Section - What can I do and Upload buttons */}
      <div className="space-y-8">
        {/* What can I do section */}
        <div className="space-y-6">
          <h3 className="text-xl font-normal">What can I do?</h3>

          <div className="border border-gray-600 rounded-lg p-4 inline-block">
            <span className="text-lg">Auto-generate subtitles</span>
          </div>

          {/* Three lines representing content */}
          <div className="space-y-3">
            <div className="h-0.5 bg-white"></div>
            <div className="h-0.5 bg-white"></div>
            <div className="h-0.5 bg-white"></div>
          </div>
        </div>

        {/* Upload and Paste buttons */}
        <form className="flex gap-4 justify-between">
          {/* Hidden file input */}
          <input
            type="file"
            name="video"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".mp4,.mp3,.wav,.avi,.mov,.mkv,.flv,.wmv,.m4a,.aac,.ogg,.flac"
            className="hidden"
          />

          <div
            onClick={handleUploadClick}
            className="flex-1 bg-transparent border-2 border-[#23b5b5] text-[#23b5b5] rounded-full py-2 px-4 hover:bg-[#23b5b5] hover:text-black transition-colors"
          >
            <div className="text-center">
              <div className="text-lg font-medium">
                {uploadedFile ? `${uploadedFile.name}` : "Upload File"}
              </div>
              <div className="text-sm opacity-80">
                {uploadedFile
                  ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`
                  : "In MP4, MP3, WAV"}
              </div>
            </div>
          </div>

          {/* <button type="submit">
            {isLoading ? <FaSpinner className="animate-spin" /> : "Submit"}
          </button> */}

          <button className="flex-1 bg-transparent border-2 border-[#23b5b5] text-[#23b5b5] rounded-full py-2 px-4 hover:bg-[#23b5b5] hover:text-black transition-colors">
            <div className="text-center">
              <div className="text-lg font-medium">Paste URL</div>
            </div>
          </button>
        </form>

        {/* {uploadedFile && vttURL ? (
          <video controls width="640">
            <source src={URL.createObjectURL(uploadedFile)} type="video/mp4" />
            {vttURL && (
              <track
                label="English"
                kind="subtitles"
                srcLang="en"
                src={vttURL}
                default
              />
            )}
            Your browser does not support the video tag.
          </video>
        ) : null} */}
      </div>
    </div>

    // <div className="min-h-screen bg-black text-white">
    //   <div className="max-w-6xl mx-auto">
    //     {/* Header */}
    //     <div className="flex items-center justify-between mb-8">
    //       <div className="flex-1"></div>
    //       <h1 className="text-2xl font-normal">AI Subtitler Tool</h1>
    //       <div className="flex items-center gap-2 flex-1 justify-end">
    //         <span className="text-lg">5</span>
    //         <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
    //       </div>
    //     </div>

    //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
    //       {/* Left Column */}
    //       <div className="space-y-8">
    //         {/* Main Title */}
    //         <div className="space-y-4">
    //           <h2 className="text-4xl font-normal leading-tight">
    //             AUTO SUBTITLE
    //             <br />
    //             GENERATOR
    //           </h2>
    //           <p className="text-lg text-gray-300">
    //             Generate all the subtitles
    //             <br />
    //             to enhance your video's
    //           </p>
    //         </div>

    //         {/* What can I do section */}
    //         <div className="space-y-6">
    //           <h3 className="text-xl font-normal">What can I do?</h3>

    //           <div className="border border-gray-600 rounded-lg p-4 inline-block">
    //             <span className="text-lg">
    //               Auto-generate
    //               <br />
    //               subtitles
    //             </span>
    //           </div>

    //           {/* Three lines representing content */}
    //           <div className="space-y-3">
    //             <div className="h-0.5 bg-white"></div>
    //             <div className="h-0.5 bg-white"></div>
    //             <div className="h-0.5 bg-white"></div>
    //           </div>
    //         </div>

    //         {/* Upload and Paste buttons */}
    //         <div className="flex gap-4">
    //           {/* Hidden file input */}
    //           <input
    //             type="file"
    //             ref={fileInputRef}
    //             onChange={handleFileUpload}
    //             accept=".mp4,.mp3,.wav,.avi,.mov,.mkv,.flv,.wmv,.m4a,.aac,.ogg,.flac"
    //             className="hidden"
    //           />

    //           <button
    //             onClick={handleUploadClick}
    //             className="flex-1 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-full py-4 px-6 hover:bg-cyan-400 hover:text-black transition-colors"
    //           >
    //             <div className="text-center">
    //               <div className="text-lg font-medium">
    //                 {uploadedFile ? `${uploadedFile.name}` : "Upload File"}
    //               </div>
    //               <div className="text-sm opacity-80">
    //                 {uploadedFile
    //                   ? `${(uploadedFile.size / 1024 / 1024).toFixed(1)} MB`
    //                   : "In MP4, MP3, WAV"}
    //               </div>
    //             </div>
    //           </button>

    //           <button className="flex-1 bg-transparent border-2 border-cyan-400 text-cyan-400 rounded-full py-4 px-6 hover:bg-cyan-400 hover:text-black transition-colors">
    //             <div className="text-center">
    //               <div className="text-lg font-medium">Paste URL</div>
    //             </div>
    //           </button>
    //         </div>
    //       </div>

    //       {/* Right Column */}
    //       <div className="flex flex-col items-center space-y-8">
    //         {/* Video Player Section */}
    //         <div className="w-full max-w-md border border-gray-600 rounded-lg overflow-hidden">
    //           {/* Video Player */}
    //           <div className="aspect-video bg-gray-900 relative flex items-center justify-center">
    //             {/* 3D Cube Icon */}
    //             <svg
    //               width="100"
    //               height="100"
    //               viewBox="0 0 100 100"
    //               className="text-gray-400"
    //             >
    //               <path
    //                 d="M25 40 L50 25 L75 40 L75 60 L50 75 L25 60 Z"
    //                 fill="none"
    //                 stroke="currentColor"
    //                 strokeWidth="1"
    //               />
    //               <path
    //                 d="M50 25 L50 45 L75 60 L75 40"
    //                 fill="none"
    //                 stroke="currentColor"
    //                 strokeWidth="1"
    //               />
    //               <path
    //                 d="M25 40 L50 45 L50 65 L25 60"
    //                 fill="none"
    //                 stroke="currentColor"
    //                 strokeWidth="1"
    //               />
    //               <path
    //                 d="M50 45 L75 60 L50 65 L25 60"
    //                 fill="none"
    //                 stroke="currentColor"
    //                 strokeWidth="1"
    //               />
    //             </svg>

    //             {/* Person icon below cube */}
    //             <div className="absolute bottom-6">
    //               <svg
    //                 width="40"
    //                 height="40"
    //                 viewBox="0 0 40 40"
    //                 className="text-gray-400"
    //               >
    //                 <circle
    //                   cx="20"
    //                   cy="15"
    //                   r="6"
    //                   fill="none"
    //                   stroke="currentColor"
    //                   strokeWidth="1"
    //                 />
    //                 <path
    //                   d="M10 35 Q10 25 20 25 Q30 25 30 35"
    //                   fill="none"
    //                   stroke="currentColor"
    //                   strokeWidth="1"
    //                 />
    //               </svg>
    //             </div>
    //           </div>

    //           {/* Subtitle Style Options */}
    //           <div className="flex border-t border-gray-600">
    //             <button className="flex-1 p-3 border-r border-gray-600 text-center hover:bg-gray-800 transition-colors">
    //               <div className="text-sm font-bold mb-1">Aa</div>
    //               <div className="text-xs">Black bar</div>
    //             </button>
    //             <button className="flex-1 p-3 border-r border-gray-600 text-center hover:bg-gray-800 transition-colors">
    //               <div className="text-sm font-bold mb-1">Aa</div>
    //               <div className="text-xs">No border</div>
    //             </button>
    //             <button className="flex-1 p-3 text-center hover:bg-gray-800 transition-colors">
    //               <div className="text-sm font-bold mb-1">Aa</div>
    //               <div className="text-xs">Translucent</div>
    //             </button>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
