import React, { useState } from "react";
import { User, Mail, Edit2, Camera, Check, X } from "lucide-react";
import { motion } from "framer-motion";

const AccountsSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john@example.com",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  });

  const [editData, setEditData] = useState(userData);

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400">Manage your account information and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-6 mb-6">
        <div className="flex items-start gap-6">
          {/* Profile Image */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#23b5b5]/40 bg-[#23b5b5]/10">
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {!isEditing && (
              <button className="absolute bottom-0 right-0 bg-[#23b5b5] p-2 rounded-full hover:bg-[#23b5b5]/80 transition-colors duration-200 shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </motion.div>

          {/* User Info */}
          <div className="flex-1">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg text-white focus:outline-none focus:border-[#23b5b5] transition-colors duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({ ...editData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-[#0d1418] border border-[#23b5b5]/40 rounded-lg text-white focus:outline-none focus:border-[#23b5b5] transition-colors duration-200"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <motion.button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-[#23b5b5] text-white rounded-lg hover:bg-[#23b5b5]/80 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Check className="w-4 h-4" />
                    Save Changes
                  </motion.button>
                  <motion.button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div>
                  <p className="text-sm text-gray-400 mb-1">Full Name</p>
                  <p className="text-lg font-semibold text-white">{userData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email Address</p>
                  <p className="text-lg font-semibold text-white">{userData.email}</p>
                </div>
                <motion.button
                  onClick={() => {
                    setEditData(userData);
                    setIsEditing(true);
                  }}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#23b5b5]/15 border border-[#23b5b5]/40 text-[#23b5b5] rounded-lg hover:bg-[#23b5b5]/25 hover:border-[#23b5b5]/60 transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-4 flex items-center justify-between hover:border-[#23b5b5]/40 transition-colors duration-200">
          <div>
            <p className="text-white font-medium">Email Notifications</p>
            <p className="text-sm text-gray-400">Receive email updates about your account</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
        </div>
        <div className="bg-gradient-to-br from-[#1a2530] to-[#0f1a20] border border-[#23b5b5]/20 rounded-xl p-4 flex items-center justify-between hover:border-[#23b5b5]/40 transition-colors duration-200">
          <div>
            <p className="text-white font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-gray-400">Enhance your account security</p>
          </div>
          <input type="checkbox" className="w-5 h-5 rounded" />
        </div>
      </div>
    </motion.div>
  );
};

export default AccountsSection;
