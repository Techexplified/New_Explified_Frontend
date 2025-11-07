import React, { useState } from "react";
import { History, Trash2, Download } from "lucide-react";
import { motion } from "framer-motion";

const HistorySection = () => {
  const [historyItems] = useState([
    {
      id: "1",
      action: "Login",
      description: "Signed in from Chrome on macOS",
      timestamp: "Today at 9:32 PM",
      type: "login",
    },
    {
      id: "2",
      action: "Profile Updated",
      description: "Changed profile picture and name",
      timestamp: "Nov 5, 2025",
      type: "update",
    },
    {
      id: "3",
      action: "Integration Connected",
      description: "Connected GitHub integration",
      timestamp: "Nov 3, 2025",
      type: "integration",
    },
    {
      id: "4",
      action: "Workflow Created",
      description: "Created new automation workflow",
      timestamp: "Oct 28, 2025",
      type: "workflow",
    },
  ]);

  const getTypeColor = (type) => {
    switch (type) {
      case "login":
        return "bg-blue-500/15 text-blue-300";
      case "update":
        return "bg-green-500/15 text-green-300";
      case "integration":
        return "bg-purple-500/15 text-purple-300";
      case "workflow":
        return "bg-cyan-500/15 text-[#23b5b5]";
      default:
        return "bg-gray-500/15 text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Account History</h2>
        <p className="text-gray-400">
          View your recent account activity and changes
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {historyItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-5 flex items-center justify-between hover:border-[#23b5b5]/40 transition-all duration-200"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-2.5 rounded-lg ${getTypeColor(item.type)}`}>
                <History className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.action}</p>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
              {item.timestamp}
            </p>
          </motion.div>
        ))}
      </div>

      {/* History Actions */}
      <div className="flex gap-3">
        
        <motion.button
          className="flex items-center gap-2 px-4 py-2 bg-red-500/15 border border-red-500/40 text-red-400 rounded-lg hover:bg-red-500/25 transition-all duration-200 font-medium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Trash2 className="w-4 h-4" />
          Clear History
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8 p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl"
      >
        <p className="text-blue-300 text-sm">
          💡 <span className="font-medium">Info:</span> Your history is private
          and only visible to you. We keep logs for security and troubleshooting
          purposes.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default HistorySection;
