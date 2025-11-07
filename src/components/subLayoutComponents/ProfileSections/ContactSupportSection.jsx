import React, { useState } from "react";
import { HelpCircle, Mail, MessageSquare, ExternalLink, Send } from "lucide-react";
import { motion } from "framer-motion";

const ContactSupportSection = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim()) {
      console.log("Support message:", message);
      setMessage("");
      // Add your support submission logic here
    }
  };

  const supportLinks = [
    {
      title: "Documentation",
      description: "Explore our comprehensive guides and tutorials",
      icon: <Mail className="w-5 h-5" />,
      url: "#",
    },
    {
      title: "Community",
      description: "Join our community and get help from other users",
      icon: <MessageSquare className="w-5 h-5" />,
      url: "#",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Contact Support</h2>
        <p className="text-gray-400">
          Get help from our support team or explore resources
        </p>
      </div>

      {/* Support Links */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        {supportLinks.map((link, index) => (
          <motion.a
            key={index}
            href={link.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ translateY: -2 }}
            className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-5 flex items-center justify-between hover:border-[#23b5b5]/40 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[#23b5b5]/15 text-[#23b5b5] group-hover:bg-[#23b5b5]/25 transition-colors duration-200">
                {link.icon}
              </div>
              <div>
                <p className="text-white font-medium">{link.title}</p>
                <p className="text-sm text-gray-400">{link.description}</p>
              </div>
            </div>
            <ExternalLink className="w-5 h-5 text-gray-500 group-hover:text-[#23b5b5] transition-colors duration-200" />
          </motion.a>
        ))}
      </div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#23b5b5]" />
          Send us a Message
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g., Issue with integration"
              className="w-full px-4 py-2 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg text-white focus:outline-none focus:border-[#23b5b5] transition-colors duration-200 placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue or question in detail..."
              rows={5}
              className="w-full px-4 py-2 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg text-white focus:outline-none focus:border-[#23b5b5] transition-colors duration-200 placeholder:text-gray-600 resize-none"
            />
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#23b5b5] text-white rounded-lg hover:bg-[#23b5b5]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Send className="w-4 h-4" />
            Send Message
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-8 p-5 bg-green-500/10 border border-green-500/30 rounded-xl"
      >
        <p className="text-green-300 text-sm">
          ✅{" "}
          <span className="font-medium">Response time:</span> Our support team
          typically responds within 24 hours.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ContactSupportSection;
