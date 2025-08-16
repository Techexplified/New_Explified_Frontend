import React from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import SocialCard from "./SocialCard";

export default function SocialsPage() {
  // Dummy data for social media analytics
  const socialData = {
    instagram: {
      followers: 500,
      following: 200,
      viewsIncrease: 41,
      followersIncrease: 10,
      reach: 15,
      views: 41,
      likes: -2,
      chartData: [
        { name: "Mon", views: 120 },
        { name: "Tue", views: 190 },
        { name: "Wed", views: 300 },
        { name: "Thu", views: 250 },
        { name: "Fri", views: 390 },
        { name: "Sat", views: 480 },
        { name: "Sun", views: 520 },
      ],
    },
    linkedin: {
      connections: 500,
      profileVisits: 300,
      profileViewsIncrease: 10,
      likesDecrease: -5,
      reach: 15,
      views: 41,
      likes: -2,
      chartData: [
        { name: "Mon", views: 80 },
        { name: "Tue", views: 120 },
        { name: "Wed", views: 180 },
        { name: "Thu", views: 220 },
        { name: "Fri", views: 280 },
        { name: "Sat", views: 350 },
        { name: "Sun", views: 400 },
      ],
    },
    youtube: {
      subscribers: 500,
      members: 40,
      subscribersLost: -10,
      viewsIncrease: 21,
      reach: 15,
      views: 41,
      likes: -2,
      chartData: [
        { name: "Mon", views: 200 },
        { name: "Tue", views: 280 },
        { name: "Wed", views: 350 },
        { name: "Thu", views: 320 },
        { name: "Fri", views: 420 },
        { name: "Sat", views: 380 },
        { name: "Sun", views: 450 },
      ],
    },
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-6xl font-bold text-white">
          Socials <span className="text-2xl">(Coming Soon)</span>
        </h1>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <Plus size={16} />
          <span>Add Profile</span>
        </button>
      </div>

      {/* Growth Update Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recent Growth Update
        </h2>
        <div className="flex justify-around space-x-4">
          <div className="bg-gray-900 border border-green-500 rounded-lg px-4 py-2 flex items-center space-x-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">41%</span>
            <span className="text-white">Instagram</span>
          </div>
          <div className="bg-gray-900 border border-red-500 rounded-lg px-4 py-2 flex items-center space-x-2">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-red-400">20%</span>
            <span className="text-white">Twitter</span>
          </div>
          <div className="bg-gray-900 border border-green-500 rounded-lg px-4 py-2 flex items-center space-x-2">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">21%</span>
            <span className="text-white">Youtube</span>
          </div>
        </div>
      </div>

      {/* Social Media Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SocialCard
          platform="instagram"
          data={socialData.instagram}
          icon={Instagram}
          username="sleepy_srijan"
          platformColor="text-pink-400"
        />
        <SocialCard
          platform="linkedin"
          data={socialData.linkedin}
          icon={Linkedin}
          email="rsrijan05@gmail.com"
          platformColor="text-blue-400"
        />
        <SocialCard
          platform="youtube"
          data={socialData.youtube}
          icon={Youtube}
          username="Explified"
          platformColor="text-red-400"
        />
        <SocialCard
          platform="youtube"
          data={socialData.youtube}
          icon={Youtube}
          username="Explified"
          platformColor="text-red-400"
        />
        <SocialCard
          platform="linkedin"
          data={socialData.linkedin}
          icon={Linkedin}
          email="rsrijan05@gmail.com"
          platformColor="text-blue-400"
        />
        <SocialCard
          platform="instagram"
          data={socialData.instagram}
          icon={Instagram}
          username="sleepy_srijan"
          platformColor="text-pink-400"
        />
      </div>
    </div>
  );
}
