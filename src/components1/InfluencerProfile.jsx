// pages/InfluencerProfile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import SocialCard from "./SocialCard"; // ✅ import your SocialCard component
import { User } from "lucide-react";

export default function InfluencerProfile() {
  const { name } = useParams();

  // Dummy array of similar creators
  const similarInfluencers = Array(3).fill({
    name: "Ankit Bisht",
    content: "Tech",
    price: "1500",
  });

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
    <div className="p-6 text-white">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">{name}</h1>
        <p className="text-sm text-gray-400">Diamond Creator 💎</p>
        <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full" />
      </div>

      {/* Cost section */}
      <div className="mt-6 bg-gray-800 p-4 rounded border border-gray-600">
        <h2 className="text-lg font-semibold mb-2">Cost</h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>1 Instagram Story - 1500🪙</p>
          <p>1 Youtube Short - 1500🪙</p>
          <p>1 Instagram Post - 1500🪙</p>
          <p>1 Youtube Video - 1500🪙</p>
          <p>1 Instagram Reel - 1500🪙</p>
          <p>1 YouTube Live - 1500🪙</p>
        </div>
      </div>

      {/* Proof of Work */}
      <div className="my-6 text-center">
        <button className="bg-gray-700 hover:bg-[#23b5b5] px-6 py-2 rounded text-white font-semibold">
          Proof of work
        </button>
      </div>

      {/* Live Analytics */}
      <div className="my-6">
        <h2 className="text-xl font-semibold mb-4 text-center">LIVE ANALYTICS</h2>
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
        </div>
      </div>

      {/* Chat with Creator */}
      <div className="text-center mt-8">
        <button className="bg-gray-700 px-6 py-2 rounded hover:bg-[#23b5b5]">
          Chat with {name}
        </button>
      </div>
      {/* More like Ankit section */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">More like {name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {similarInfluencers.map((influencer, i) => (
            <div
              key={i}
              className="bg-[#444] border border-gray-500 rounded-lg text-center p-4 hover:border-[#23b5b5] transition cursor-pointer"
              // Optional: navigate onClick
              // onClick={() => navigate(`/influmark/${encodeURIComponent(influencer.name)}`)}
            >
              <div className="text-sm flex justify-between mb-2">
                <span>{influencer.content}</span>
                <span>💎</span>
              </div>
              <div className="bg-gray-600 rounded w-full h-24 flex items-center justify-center mb-2">
                <User size={40} className="text-gray-300" />
              </div>
              <div className="font-medium">{influencer.name}</div>
              <div className="text-sm text-gray-300 mt-1">{influencer.price}©</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
