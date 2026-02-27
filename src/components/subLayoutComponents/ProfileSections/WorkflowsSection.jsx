import React from "react";
import { Workflow, FileText, ExternalLink, Zap, Mail } from "lucide-react";
import { motion } from "framer-motion";

const WorkflowsSection = () => {
  const workflows = [
    {
      id: "expli",
      title: "Expli",
      description: "Create and manage your Expli workflows",
      icon: <Zap className="w-5 h-5" />,
      url: "/expli",
      color: "from-cyan-500 to-teal-500",
    },
    {
      id: "notes",
      title: "Notes",
      description: "Organize notes and collaborate seamlessly",
      icon: <FileText className="w-5 h-5" />,
      url: "/notes",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "email-updates",
      title: "Daily Email Updates",
      description: "AI-powered email summaries sent to Telegram",
      icon: <Mail className="w-5 h-5" />,
      url: "/email-updates",
      color: "from-teal-500 to-cyan-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl" // Reduced overall width
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">My Workflows</h2>
        <p className="text-gray-400 text-sm">
          Access and manage your workflow tools
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {" "}
        {/* Reduced gap */}
        {workflows.map((workflow, index) => (
          <motion.a
            key={workflow.id}
            href={workflow.url}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.1 }}
            whileHover={{ translateY: -3 }}
            className="group relative overflow-hidden rounded-lg border border-[#23b5b5]/20 hover:border-[#23b5b5]/60 transition-all"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${workflow.color} opacity-0 group-hover:opacity-10 transition-opacity`}
            />

            <div className="relative bg-gradient-to-br from-[#1a2530] to-[#0f1a20] p-4">
              {" "}
              {/* Reduced padding */}
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-2.5 rounded-lg bg-gradient-to-br ${workflow.color} text-white`}
                >
                  {workflow.icon}
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-1 group-hover:text-[#23b5b5]">
                {workflow.title}
              </h3>
              <p className="text-gray-400 text-xs mb-2">
                {workflow.description}
              </p>
              <div className="flex items-center gap-1.5 text-[#23b5b5] font-medium text-xs group-hover:gap-2 transition-all">
                Open Workflow
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Bottom info box also made compact */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-6 p-4 bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-lg"
      >
        <h3 className="text-white text-sm font-semibold mb-1 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-[#23b5b5]" />
          More Workflows Coming Soon
        </h3>
        <p className="text-gray-400 text-xs">
          We’re adding more workflow tools to automate and streamline your
          tasks.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WorkflowsSection;
