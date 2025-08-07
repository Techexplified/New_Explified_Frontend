import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addVideo } from "../../../utils/subtitler_slice/SubtitlerSlice";
import SubtitlerHeader from "./components/SubtitlerHeader";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";

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
    <div className="min-h-screen relative bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      {/* Main Content */}
      <WorkFlowButton />
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
                  </div>
                </div>
              </button>

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
      </div>
    </div>
  );
}
