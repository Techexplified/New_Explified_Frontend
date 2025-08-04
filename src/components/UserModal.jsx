import {
  X,
  LogIn,
  LogOut,
  MessageSquare,
  Mail,
  BoomBox,
  Zap,
  History,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { clearUser } from "../utils/auth_slice/UserSlice";
import { useDispatch } from "react-redux";

const UserModal = ({ showUserModal, setShowUserModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = !!user;

  const userData = {
    name: user?.given_name || "Guest",
    email: user?.email || "guest@example.com",
    avatar:
      user?.given_name?.[0]?.toUpperCase() +
        user?.family_name?.[0]?.toUpperCase() || "JD",
  };

  const handleAuthClick = () => {
    setShowUserModal(false);
    if (isLoggedIn) {
      localStorage.clear();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const handleFeedbackClick = () => {
    window.location.href = "https://admin.explified.com/";
  };

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
          {/* logout button */}
          <button
            onClick={handleAuthClick}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
          >
            {isLoggedIn ? (
              <>
                <LogOut size={16} />
                <span
                  className="w-full py-2 flex justify-center items-center space-x-2"
                  onClick={() => {
                    signOut(auth)
                      .then(() => {
                        dispatch(clearUser());
                      })
                      .catch((error) => {
                        console.error("Logout failed:", error);
                      });
                  }}
                >
                  Log Out
                </span>

                <LogOut size={16} />
                <span
                  className="w-full py-2 flex justify-center items-center space-x-2 cursor-pointer"
                  onClick={() => {
                    signOut(auth)
                      .then(() => {
                        dispatch(clearUser());
                        navigate("/login"); // Redirect after logout
                      })
                      .catch((error) => {
                        console.error("Logout failed:", error);
                      });
                  }}
                >
                  Log Out
                </span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-3" />
                <span className="font-medium">Login</span>
              </>
            )}
          </button>

          {isLoggedIn && (
            <>
              {/* feedback button */}
              <button
                onClick={() => {
                  setShowUserModal(false);
                  handleFeedbackClick();
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                <span className="font-medium">Feedback</span>
              </button>

              {/* socials button */}
              <button
                onClick={() => {
                  setShowUserModal(false);
                  navigate("/socials");
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
              >
                <BoomBox className="w-5 h-5 mr-3" />
                <span className="font-medium">Socials</span>
              </button>

              {/* Integrations button */}
              <button
                onClick={() => {
                  setShowUserModal(false);
                  navigate("/integrations");
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
              >
                <Zap className="w-5 h-5 mr-3" />
                <span className="font-medium">Integrations</span>
              </button>

              {/* History button */}
              <button
                onClick={() => {
                  setShowUserModal(false);
                  navigate("/history");
                }}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-500/50 transition-all duration-200"
              >
                <History className="w-5 h-5 mr-3" />
                <span className="font-medium">History</span>
              </button>
            </>
          )}

          {/* contact us button */}
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
