import React, { useState } from "react";
import {
  Upload,
  ArrowLeft,
  Calendar,
  Clock,
  Image,
  Video,
  FileText,
  Hash,
  AtSign,
  Send,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
} from "lucide-react";

export default function SchedulerForm() {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [mention, setMention] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [mediaType, setMediaType] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  const handlePost = () => {
    if (selectedDate && selectedTime) {
      setIsScheduled(true);
      setTimeout(() => setIsScheduled(false), 3000);
    }
  };

  const characterCount = caption.length;
  const maxCharacters = 3000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white">
      {/* Header */}
      <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">LinkedIn Scheduler</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Section */}
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-xl font-bold">
                  SR
                </div>
                <div>
                  <h2 className="text-xl font-semibold">@srijan_ranjan</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      500 Followers
                    </span>
                    <span>•</span>
                    <span>500+ Connections</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <label className="block text-white mb-4 text-lg font-medium flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Media Upload
              </label>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  {
                    type: "image",
                    icon: Image,
                    label: "Image",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    type: "video",
                    icon: Video,
                    label: "Video",
                    color: "from-red-500 to-orange-500",
                  },
                  {
                    type: "document",
                    icon: FileText,
                    label: "Document",
                    color: "from-blue-500 to-cyan-500",
                  },
                ].map((media) => (
                  <button
                    key={media.type}
                    onClick={() => setMediaType(media.type)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      mediaType === media.type
                        ? `bg-gradient-to-r ${media.color} border-transparent text-white`
                        : "border-gray-600 hover:border-gray-500 bg-gray-700 bg-opacity-50"
                    }`}
                  >
                    <media.icon className="w-6 h-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{media.label}</span>
                  </button>
                ))}
              </div>

              {mediaType && (
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-400">
                    Drop your {mediaType} here or click to browse
                  </p>
                </div>
              )}
            </div>

            {/* Content Creation */}
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <div className="space-y-6">
                {/* Caption */}
                <div>
                  <label className="block text-white mb-3 text-lg font-medium flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Caption
                  </label>
                  <div className="relative">
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full bg-gray-700 bg-opacity-60 border-2 border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-500 transition-all duration-200 min-h-[120px]"
                      placeholder="What's on your mind? Share your thoughts with your network..."
                    />
                    <div
                      className={`absolute bottom-3 right-3 text-sm ${
                        characterCount > maxCharacters * 0.9
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {characterCount}/{maxCharacters}
                    </div>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block text-white mb-3 text-lg font-medium flex items-center gap-2">
                    <Hash className="w-5 h-5" />
                    Hashtags
                  </label>
                  <textarea
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="w-full bg-gray-700 bg-opacity-60 border-2 border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-500 transition-all duration-200"
                    rows={3}
                    placeholder="#AI #Technology #LinkedInTips #Innovation #Career"
                  />
                </div>

                {/* Mentions */}
                <div>
                  <label className="block text-white mb-3 text-lg font-medium flex items-center gap-2">
                    <AtSign className="w-5 h-5" />
                    Mentions
                  </label>
                  <input
                    type="text"
                    value={mention}
                    onChange={(e) => setMention(e.target.value)}
                    className="w-full bg-gray-700 bg-opacity-60 border-2 border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-all duration-200"
                    placeholder="@username @company @influencer"
                  />
                </div>
              </div>
            </div>

            {/* Scheduling */}
            <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule Post
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-gray-700 bg-opacity-60 border-2 border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-gray-700 bg-opacity-60 border-2 border-gray-600 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 transition-all duration-200 rounded-xl py-4 text-white font-medium text-lg flex items-center justify-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handlePost}
                disabled={!caption.trim()}
                className={`flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 rounded-xl py-4 text-white font-medium text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isScheduled ? "animate-pulse" : ""
                }`}
              >
                {isScheduled ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Scheduled!
                  </>
                ) : selectedDate && selectedTime ? (
                  <>
                    <Calendar className="w-5 h-5" />
                    Schedule Post
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Post Now
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h3>

                {/* Mock LinkedIn Post */}
                <div className="bg-white rounded-lg p-4 text-gray-900">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      SR
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Srijan Ranjan</div>
                      <div className="text-xs text-gray-500">Just now • 🌍</div>
                    </div>
                  </div>

                  <div className="mb-3 text-sm">
                    {caption || "Your caption will appear here..."}
                  </div>

                  {hashtags && (
                    <div className="mb-3 text-sm text-blue-600">{hashtags}</div>
                  )}

                  {mention && (
                    <div className="mb-3 text-sm text-blue-600">{mention}</div>
                  )}

                  {mediaType && (
                    <div className="mb-3 bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-500">
                      {mediaType === "image" && <Image className="w-8 h-8" />}
                      {mediaType === "video" && <Video className="w-8 h-8" />}
                      {mediaType === "document" && (
                        <FileText className="w-8 h-8" />
                      )}
                      <span className="ml-2 capitalize">
                        {mediaType} Preview
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        Like
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="w-4 h-4" />
                        Repost
                      </span>
                      <span className="flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        Send
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
