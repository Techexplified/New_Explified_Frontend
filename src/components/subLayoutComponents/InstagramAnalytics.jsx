import React, { useState } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  Share2,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const InstagramAnalytics = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const metrics = [
    {
      label: "Followers",
      value: "24.8K",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-minimal-primary to-minimal-gray-400",
    },
    {
      label: "Engagement",
      value: "8.2%",
      change: "+2.1%",
      trend: "up",
      icon: Heart,
      color: "from-minimal-primary to-minimal-gray-500",
    },
    {
      label: "Reach",
      value: "156K",
      change: "-5.3%",
      trend: "down",
      icon: Eye,
      color: "from-minimal-primary to-minimal-gray-600",
    },
    {
      label: "Impressions",
      value: "89.2K",
      change: "+18.7%",
      trend: "up",
      icon: BarChart3,
      color: "from-minimal-primary to-minimal-gray-700",
    },
  ];

  const recentPosts = [
    { likes: 1234, comments: 89, shares: 23, engagement: 9.2 },
    { likes: 2156, comments: 156, shares: 45, engagement: 12.1 },
    { likes: 987, comments: 67, shares: 18, engagement: 7.8 },
    { likes: 1789, comments: 134, shares: 32, engagement: 10.5 },
  ];

  const topHashtags = ["#photography", "#lifestyle", "#travel", "#inspiration"];

  return (
    <div className="min-w-[30%] h-fit  bg-minimal-card rounded-2xl border border-minimal-border p-5 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-minimal-white">
            Analytics that matter
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-minimal-primary animate-pulse"></div>
            <span className="text-xs text-minimal-muted">Live</span>
          </div>
        </div>
        <p className="text-minimal-muted text-xs">@yourhandle • Last 30 days</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <div
              key={index}
              className="bg-minimal-dark-100 rounded-lg p-3 border border-minimal-border hover:border-minimal-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg bg-gradient-to-r ${metric.color}`}
                >
                  <IconComponent className="w-3 h-3 text-minimal-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-xs ${
                    metric.trend === "up"
                      ? "text-minimal-gray-300"
                      : "text-minimal-gray-500"
                  }`}
                >
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{metric.change}</span>
                </div>
              </div>
              <div>
                <p className="text-lg font-bold text-minimal-white group-hover:text-minimal-primary transition-colors">
                  {metric.value}
                </p>
                <p className="text-xs text-minimal-muted">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapsible Section */}
      {/* <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-minimal-white mb-2 flex items-center">
            <Calendar className="w-3 h-3 mr-2 text-minimal-primary" />
            Recent Posts
          </h3>
          <div className="space-y-2">
            {recentPosts.slice(0, 3).map((post, index) => (
              <div
                key={index}
                className="bg-minimal-dark-100 rounded-lg p-2 border border-minimal-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3 text-xs">
                    <div className="flex items-center text-minimal-gray-300">
                      <Heart className="w-3 h-3 mr-1 text-minimal-gray-400" />
                      {post.likes > 999
                        ? `${(post.likes / 1000).toFixed(1)}k`
                        : post.likes}
                    </div>
                    <div className="flex items-center text-minimal-gray-300">
                      <MessageCircle className="w-3 h-3 mr-1 text-minimal-gray-400" />
                      {post.comments}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-minimal-primary font-medium">
                      {post.engagement}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-xs font-semibold text-minimal-white mb-2 flex items-center">
            <span className="text-minimal-primary mr-2">#</span>
            Top Hashtags
          </h3>
          <div className="flex flex-wrap gap-1">
            {topHashtags.slice(0, 3).map((hashtag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-gradient-to-r from-minimal-primary/20 to-minimal-gray-600/20 border border-minimal-primary/30 rounded-full text-xs text-minimal-primary hover:border-minimal-primary/50 transition-colors cursor-pointer"
              >
                {hashtag}
              </span>
            ))}
          </div>
        </div>
      </div> */}

      {/* Toggle Button */}
      {/* <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 mb-3 bg-minimal-dark-100 hover:bg-minimal-cardHover border border-minimal-border hover:border-minimal-primary/50 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 text-minimal-muted hover:text-minimal-primary"
      >
        <span className="text-xs font-medium">
          {isExpanded ? "Show Less" : "Show More"}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button> */}
    </div>
  );
};

export default InstagramAnalytics;
