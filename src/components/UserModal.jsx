import { X, LogIn, MessageSquare, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "JD",
};

const UserModal = ({ showUserModal, setShowUserModal }) => {
  const navigate = useNavigate();
  if (!showUserModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 w-96 max-w-[90vw]">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowUserModal(false)}
            className="p-2 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 transition-all duration-200 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">
              {userData.avatar}
            </span>
          </div>
          <h2 className="text-white text-xl font-bold mb-1">{userData.name}</h2>
          <p className="text-gray-400 text-sm">{userData.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              setShowUserModal(false);
              navigate("/login");
              // Handle logout logic
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
          >
            <LogIn className="w-5 h-5 mr-3" />
            <span className="font-medium">Login</span>
          </button>

          <button
            onClick={() => {
              setShowUserModal(false);
              // Handle feedback logic
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            <span className="font-medium">Feedback</span>
          </button>

          <button
            onClick={() => {
              setShowUserModal(false);
              // Handle contact us logic
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 rounded-xl hover:from-green-500/30 hover:to-emerald-500/30 hover:border-green-500/50 transition-all duration-200"
          >
            <Mail className="w-5 h-5 mr-3" />
            <span className="font-medium">Contact Us</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
