import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineFileDownload, MdOutlineFileUpload } from "react-icons/md";
import WorkFlowButton from "../../../reusable_components/WorkFlowButton";

// Replace this with your real API key before deploying.
const REMOVE_BG_API_KEY = import.meta.env.VITE_REMOVE_BG_API_KEY;

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitExceeded, setLimitExceeded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cleanup previous object URLs
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResultUrl("");
    setError("");
    setLimitExceeded(false);
  };

  const handleBgRemoval = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setLoading(true);
    setError("");
    if (!REMOVE_BG_API_KEY) {
      setLoading(false);
      setError(
        "API key not configured. Please set VITE_REMOVE_BG_API_KEY and redeploy."
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append("size", "auto");
      formData.append("image_file", selectedFile);

      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": REMOVE_BG_API_KEY },
        body: formData,
      });

      if (!response.ok) {
        let messageText = await response.text();
        try {
          const json = JSON.parse(messageText);
          if (json?.errors?.length) {
            messageText = json.errors
              .map((e) => e.title || e.detail)
              .filter(Boolean)
              .join(", ");
          }
        } catch (_) {
          // keep raw text if not JSON
        }

        let friendlyMessage = messageText || response.statusText;
        if (response.status === 402) {
          friendlyMessage =
            "API credits exhausted for remove.bg. Please top up your credits and try again.";
          setLimitExceeded(true);
        } else if (response.status === 429) {
          friendlyMessage =
            "Rate limit reached. Please wait a moment and retry.";
        } else if (response.status === 401 || response.status === 403) {
          friendlyMessage = "Invalid or unauthorized API key.";
        }

        throw new Error(friendlyMessage);
      }

      const blob = await response.blob();
      // Cleanup old result URL if present
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const outputUrl = URL.createObjectURL(blob);
      setResultUrl(outputUrl);
    } catch (err) {
      setError(err?.message || "Failed to remove background.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Left-edge activator to open when collapsed */}
      <div
        className="fixed left-0 top-[70px] h-[calc(100vh-70px)] w-2 z-50"
        onMouseEnter={() => setSidebarOpen(true)}
      />

      {/* Replacement sidebar (below navbar) */}
      <div
        className={`fixed top-[70px] left-0 h-[calc(100vh-70px)] bg-black/95 backdrop-blur-xl border-r border-[#23b5b5]/20 
        flex flex-col justify-between transition-all duration-300 z-40
        ${sidebarOpen ? "w-56 px-6" : "w-0 px-0 overflow-hidden"}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        {/* Top section */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
              Background Remover
            </h2>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mb-8">
          <button
            onClick={() =>
              window.location.assign(
                "https://explified.com/background-remover-ai/"
              )
            }
            className="w-full bg-gradient-to-r from-[#23b5b5] to-[#1a9999] hover:from-[#1a9999] hover:to-[#23b5b5] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#23b5b5]/25"
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="min-h-[calc(100vh-70px)] w-full flex items-center justify-center bg-gradient-to-br from-minimal-background via-minimal-dark-100 to-minimal-dark-200 p-6">
        <div className="w-full max-w-3xl bg-minimal-card border border-minimal-border rounded-2xl p-6 shadow-lg">
          <h1 className="text-xl font-semibold text-minimal-white mb-2">
            Background Remover
          </h1>
          <p className="text-minimal-muted text-sm mb-5">
            Upload an image and remove its background using the remove.bg API.
            The output is a high-quality PNG with a transparent background.
            Note: this tool requires active API credits.
          </p>

          {limitExceeded && (
            <div className="mb-4 text-sm text-amber-300 bg-amber-900/20 border border-amber-900/40 rounded-md px-3 py-2">
              You have exhausted the remove.bg API credits. Please top up your
              credits and try again.
            </div>
          )}

          <form onSubmit={handleBgRemoval} className="flex flex-col gap-4">
            <div>
              <h2 className="text-minimal-white text-sm font-medium mb-2">
                Upload
              </h2>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="flex-1 px-3 py-2 rounded-md bg-minimal-dark-100/50 text-minimal-white placeholder-minimal-muted border border-minimal-border focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 px-5 py-2 rounded-md border transition-all duration-200 ${
                  loading
                    ? "bg-minimal-gray-800 text-minimal-muted border-minimal-border cursor-not-allowed"
                    : "bg-minimal-primary/20 text-minimal-primary border-minimal-primary/30 hover:bg-minimal-primary/30"
                }`}
              >
                <MdOutlineFileUpload className="size-5" />
                {loading ? "Processing..." : "Upload & Remove"}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-900/40 rounded-md px-3 py-2">
                {error}
              </div>
            )}

            {previewUrl && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <h2 className="md:col-span-2 text-minimal-white text-sm font-medium">
                  Preview
                </h2>
                <div className="bg-minimal-dark-100/50 border border-minimal-border rounded-xl p-3">
                  <div className="text-minimal-muted text-sm mb-2">
                    Original
                  </div>
                  <img
                    src={previewUrl}
                    alt="Original"
                    className="w-full h-auto rounded-md object-contain"
                  />
                </div>
                {resultUrl && (
                  <div className="bg-minimal-dark-100/50 border border-minimal-border rounded-xl p-3">
                    <div className="text-minimal-muted text-sm mb-2">
                      No Background
                    </div>
                    <img
                      src={resultUrl}
                      alt="No Background"
                      className="w-full h-auto rounded-md object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {resultUrl && (
              <div className="mt-3">
                <a href={resultUrl} download="no-bg.png">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md px-5 py-2 bg-minimal-primary/20 text-minimal-primary border border-minimal-primary/30 hover:bg-minimal-primary/30"
                  >
                    <MdOutlineFileDownload className="size-5" /> Download PNG
                  </button>
                </a>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default RemoveBackground;
