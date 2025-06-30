import { useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Send,
  Heart,
  MessageCircle,
  Share,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InstagramPostsPage() {
  const [selectedFilter, setSelectedFilter] = useState("Recents");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [likedPosts, setLikedPosts] = useState(new Set());
  const navigate = useNavigate();
  const filterOptions = [
    "Recents",
    "Most Liked",
    "Most Viewed",
    "Most Commented",
  ];

  const posts = [
    {
      id: 1,
      preview: "/api/placeholder/120/120",
      views: 5000,
      likes: 200,
      shares: 50,
      comments: 100,
      caption: [
        "Summer vibes are finally here! ☀️",
        "Perfect day for some outdoor adventures",
        "What's your favorite summer activity?",
      ],
      hashtags: ["#summer", "#vibes", "#outdoors"],
    },
    {
      id: 2,
      preview: "/api/placeholder/120/120",
      views: 3200,
      likes: 150,
      shares: 30,
      comments: 75,
      caption: [
        "Coffee and creativity go hand in hand",
        "Starting the day with some fresh ideas",
        "What fuels your creativity?",
      ],
      hashtags: ["#coffee", "#creative", "#morning"],
    },
    {
      id: 3,
      preview: "/api/placeholder/120/120",
      views: 7500,
      likes: 320,
      shares: 80,
      comments: 180,
      caption: [
        "Golden hour magic never gets old",
        "Nature's perfect lighting setup",
        "Capturing moments that matter",
      ],
      hashtags: ["#goldenhour", "#photography", "#nature"],
    },
    {
      id: 4,
      preview: "/api/placeholder/120/120",
      views: 4100,
      likes: 180,
      shares: 40,
      comments: 95,
      caption: [
        "Weekend mood: relaxed and recharged",
        "Sometimes the best plans are no plans",
        "How do you spend your weekends?",
      ],
      hashtags: ["#weekend", "#relax", "#mood"],
    },
  ];

  const handleLike = (postId) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      console.log("Question submitted:", inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      <div className="relative z-10">
        <div className="flex flex-wrap items-center text-sm text-gray-300 py-6 gap-1">
          <span className="hover:text-[#23b5b5] cursor-pointer">Socials</span>
          <ChevronDown className="w-4 h-4 rotate-[-90deg] text-[#23b5b5]" />
          <span className="hover:text-[#23b5b5] cursor-pointer">Instagram</span>
          <ChevronDown className="w-4 h-4 rotate-[-90deg] text-[#23b5b5]" />
          <span className="text-white font-medium">Posts</span>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-white to-[#23b5b5] bg-clip-text text-transparent">
            Posts
          </h1>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-[#23b5b5] rounded-full px-4 md:px-6 py-2 text-sm hover:bg-[#23b5b5]/10"
            >
              {selectedFilter}
              <ChevronDown
                className={`w-4 h-4 ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-20">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#23b5b5]/10 hover:text-[#23b5b5]"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border border-gray-700 rounded-2xl p-6 bg-gray-900/30"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                {/* Preview */}
                <div className="sm:col-span-2 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center text-xs text-gray-300">
                    <div className="text-center text-[#23b5b5] font-semibold">
                      Preview
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <div className="sm:col-span-4 flex flex-col items-center">
                  <h3 className="text-[#23b5b5] font-medium text-lg mb-2 flex items-center gap-2">
                    Caption <MessageCircle className="w-4 h-4" />
                  </h3>
                  <div className="space-y-1">
                    {post.caption.map((line, i) => (
                      <p
                        key={i}
                        className="text-gray-300 hover:text-white cursor-pointer"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Hashtags */}
                <div className="sm:col-span-3 flex flex-col items-center">
                  <h3 className="text-[#23b5b5] font-medium text-lg mb-2">
                    Hashtags
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {post.hashtags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[#23b5b5] bg-[#23b5b5]/10 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-[#23b5b5]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="sm:col-span-2 flex flex-col gap-4 items-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400">
                      <Eye className="w-4 h-4" /> Views
                    </div>
                    <div className="text-white font-medium">
                      {post.views.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400">
                      <Share className="w-4 h-4" /> Share
                    </div>
                    <div className="text-white font-medium">{post.shares}</div>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="text-center group"
                  >
                    <div className="flex items-center justify-center gap-1 text-gray-400 group-hover:text-red-400">
                      <Heart
                        className={`w-4 h-4 ${
                          likedPosts.has(post.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />{" "}
                      Likes
                    </div>
                    <div
                      className={`font-medium ${
                        likedPosts.has(post.id) ? "text-red-500" : "text-white"
                      }`}
                    >
                      {likedPosts.has(post.id) ? post.likes + 1 : post.likes}
                    </div>
                  </button>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-gray-400">
                      <MessageCircle className="w-4 h-4" /> Comments
                    </div>
                    <div className="text-white font-medium">
                      {post.comments}
                    </div>
                  </div>
                </div>

                {/* External Link */}
                <div className="sm:col-span-1 h-full flex justify-center items-center">
                  <button
                    className="p-3 hover:bg-[#23b5b5]/10 rounded-xl"
                    onClick={() => navigate("/socials/instagram/posts/recents")}
                  >
                    <ExternalLink className="w-4 h-4 text-gray-400 hover:text-[#23b5b5]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full sm:w-[80%] mt-8 mb-6 mx-auto">
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Ask me questions..."
              className="w-full bg-gray-900/50 border border-gray-600 rounded-full py-4 px-6 pr-14 placeholder-gray-400 focus:outline-none focus:border-[#23b5b5]"
            />
            <button
              onClick={handleSubmit}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#23b5b5]/10 rounded-full"
            >
              <Send className="w-5 h-5 text-gray-400 hover:text-[#23b5b5]" />
            </button>
          </div>
        </div>
      </div>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
}
