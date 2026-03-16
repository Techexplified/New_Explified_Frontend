import React, { useState } from "react";
import {
  X,
  User,
  Users,
  Workflow,
  Zap,
  Building2,
  History,
  HelpCircle,
  LogOut,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Palette,
  Key,
  Bell,
  Lock,
  Globe,
  FileText,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AccountsSection from "./ProfileSections/AccountsSection";
import SocialSection from "./ProfileSections/SocialSection";
import WorkflowsSection from "./ProfileSections/WorkflowsSection";
import IntegrationsSection from "./ProfileSections/IntegrationsSection";
import EnterpriseSection from "./ProfileSections/EnterpriseSection";
import HistorySection from "./ProfileSections/HistorySection";
import ContactSupportSection from "./ProfileSections/ContactSupportSection";
import FAQSection from "./ProfileSections/FAQSection";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProfileSettingsModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("accounts");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleSectionChange = (section) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsTransitioning(false);
    }, 150);
  };

  const generalSections = [
    {
      id: "accounts",
      label: "Accounts",
      icon: User,
      description: "Manage your account details",
    },
    {
      id: "social",
      label: "Social",
      icon: Users,
      description: "Connect social media accounts",
    },
    {
      id: "workflows",
      label: "Workflows",
      icon: Workflow,
      description: "Manage your workflows",
    },
  ];

  const otherSections = [
    {
      id: "integrations",
      label: "Integrations",
      icon: Zap,
      description: "Manage integrations",
    },
    {
      id: "enterprise",
      label: "Enterprise",
      icon: Building2,
      description: "Enterprise settings",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      description: "View history",
    },
    {
      id: "faq",
      label: "FAQ",
      icon: BookOpen,
      description: "Frequently asked questions",
    },
    {
      id: "contact",
      label: "Contact Support",
      icon: HelpCircle,
      description: "Get help",
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "accounts":
        return <AccountsSection />;
      case "social":
        return <SocialSection />;
      case "workflows":
        return <WorkflowsSection />;
      case "integrations":
        return <IntegrationsSection />;
      case "enterprise":
        return <EnterpriseSection />;
      case "history":
        return <HistorySection />;
      case "faq":
        return <FAQSection />;
      case "contact":
        return <ContactSupportSection />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-6xl h-[85vh] max-h-[85vh] bg-gradient-to-br from-[#0d1418] to-[#111c20] rounded-2xl border border-[#23b5b5]/30 shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#23b5b5]/20">
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#23b5b5]/10 rounded-lg transition-colors duration-200 text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="w-64 border-r border-[#23b5b5]/20 bg-gradient-to-b from-[#0d1418]/50 to-[#111c20]/50 overflow-y-auto"
                >
                  <div className="p-4 space-y-6">
                    {/* General Section */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#23b5b5]/60 mb-3">
                        General
                      </h3>
                      <div className="space-y-2">
                        {generalSections.map((section) => {
                          const Icon = section.icon;
                          const isActive = activeSection === section.id;

                          return (
                            <motion.button
                              key={section.id}
                              onClick={() => handleSectionChange(section.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                                isActive
                                  ? "bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5]"
                                  : "text-gray-400 hover:text-white hover:bg-[#23b5b5]/5"
                              }`}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Active Indicator */}
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#23b5b5]"
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                />
                              )}

                              <Icon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isActive
                                    ? "text-[#23b5b5]"
                                    : "text-gray-500 group-hover:text-[#23b5b5]"
                                }`}
                              />
                              <span className="font-medium text-sm">
                                {section.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#23b5b5]/10" />

                    {/* Other Section */}
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#23b5b5]/60 mb-3">
                        Other
                      </h3>
                      <div className="space-y-2">
                        {otherSections.map((section) => {
                          const Icon = section.icon;
                          const isActive = activeSection === section.id;

                          return (
                            <motion.button
                              key={section.id}
                              onClick={() => handleSectionChange(section.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                                isActive
                                  ? "bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5]"
                                  : "text-gray-400 hover:text-white hover:bg-[#23b5b5]/5"
                              }`}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicator"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#23b5b5]"
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                />
                              )}

                              <Icon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isActive
                                    ? "text-[#23b5b5]"
                                    : "text-gray-500 group-hover:text-[#23b5b5]"
                                }`}
                              />
                              <span className="font-medium text-sm">
                                {section.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#23b5b5]/10" />

                    {/* Sign Out Button */}
                    <motion.button
                      // onClick={handleSignOut}
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-200 group"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium text-sm">Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* Right Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="p-8"
                    >
                      {renderContent()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileSettingsModal;
