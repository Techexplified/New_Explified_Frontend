import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Facebook,
  Link2,
  Unlink2,
} from "lucide-react";
import { motion } from "framer-motion";

const SocialSection = () => {
  const [socials, setSocials] = useState([
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      connected: false,
      url: "https://linkedin.com",
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      connected: true,
      username: "johndoe",
      url: "https://twitter.com",
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: <Youtube className="w-5 h-5" />,
      connected: false,
      url: "https://youtube.com",
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      connected: false,
      url: "https://instagram.com",
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      connected: false,
      url: "https://facebook.com",
    },
  ]);

  const toggleSocial = (id) => {
    setSocials(
      socials.map((social) =>
        social.id === id ? { ...social, connected: !social.connected } : social
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Social Accounts</h2>
        <p className="text-gray-400">
          Connect your social media profiles to your account
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {socials.map((social, index) => (
          <motion.div
            key={social.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-5 flex items-center justify-between hover:border-[#23b5b5]/40 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg transition-all duration-200 ${
                  social.connected
                    ? "bg-[#23b5b5]/20 text-[#23b5b5]"
                    : "bg-gray-700/20 text-gray-500 group-hover:text-gray-300"
                }`}
              >
                {social.icon}
              </div>
              <div>
                <p className="text-white font-medium">{social.label}</p>
                {social.connected && social.username ? (
                  <p className="text-sm text-[#23b5b5]">@{social.username}</p>
                ) : (
                  <p className="text-sm text-gray-400">Not connected</p>
                )}
              </div>
            </div>

            <motion.button
              onClick={() => toggleSocial(social.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                social.connected
                  ? "bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25"
                  : "bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5] hover:bg-[#23b5b5]/25"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {social.connected ? (
                <>
                  <Unlink2 className="w-4 h-4" />
                  Disconnect
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  Connect
                </>
              )}
            </motion.button>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p className="text-blue-300 text-sm">
          💡 <span className="font-medium">Tip:</span> Connecting your social
          accounts helps you integrate with workflows and share your profile
          easily.
        </p>
      </div>
    </motion.div>
  );
};

export default SocialSection;
