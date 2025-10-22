import { useState } from "react";
import {
  X,
  Cog,
  Bell,
  User,
  Lock,
  LogOut,
  LogIn,
  MessageSquare,
  BoomBox,
  Zap,
  Mail,
  History,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { clearUser } from "../utils/auth_slice/UserSlice";
import { auth } from "../firebase";

export default function ProfileSettingsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("Account");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isLoggedIn = user;

  const userData = {
    name: user?.given_name || "Guest",
    email: user?.email || "guest@example.com",
    avatar:
      user?.given_name?.[0]?.toUpperCase() +
        user?.family_name?.[0]?.toUpperCase() || "JD",
  };

  const handleFeedbackClick = () => {
    window.location.href = "https://admin.explified.com/";
  };

  const tabs = [
    { name: "Account", icon: User },
    { name: "Settings", icon: Cog },
    { name: "Personalisation", icon: Bell },
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex w-[90%] sm:w-[800px] h-[520px] bg-[#111] rounded-2xl border border-gray-700 shadow-2xl overflow-hidden animate-in fade-in">
        {/* Left Panel */}
        <div className="w-1/4 bg-[#1a1a1a] border-r border-gray-700 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {/* <h2 className="text-lg font-semibold text-gray-200">Settings</h2> */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tabs.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => setActiveTab(name)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm transition ${
                  activeTab === name
                    ? "bg-gray-800 text-cyan-400"
                    : "text-gray-300 hover:bg-gray-800/60"
                }`}
              >
                <Icon size={18} />
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "Settings" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                Settings
              </h3>
              <p className="text-gray-400 text-sm">
                Manage your notification preferences.
              </p>
            </div>
          )}

          {activeTab === "Personalisation" && (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-200">
                Personalisation
              </h3>
              <p className="text-gray-400 text-sm">
                Manage your notification preferences.
              </p>
            </div>
          )}

          {activeTab === "Account" && (
            <div className="flex flex-col gap-8 w-full">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#23b5b5] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-2xl">
                    {userData.name[0]}
                  </span>
                </div>
                <h2 className="mt-4 text-white text-2xl font-bold break-words">
                  {userData.name}
                </h2>
                <p className="text-gray-400 text-sm break-all">
                  {userData.email}
                </p>
              </div>

              {/* Login / Logout */}
              <button
                type="button"
                onClick={() => {
                  if (isLoggedIn) {
                    signOut(auth)
                      .then(() => {
                        dispatch(clearUser());
                        localStorage.removeItem("explified");
                        navigate("/login");
                      })
                      .catch((error) => console.error("Logout failed:", error));
                  } else {
                    navigate("/login");
                  }
                }}
                className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
              >
                {isLoggedIn ? (
                  <LogOut size={16} className="mr-2" />
                ) : (
                  <LogIn className="w-5 h-5 mr-3" />
                )}
                {isLoggedIn ? "Log Out" : "Login"}
              </button>

              {isLoggedIn && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={handleFeedbackClick}
                      className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" /> Feedback
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/socials")}
                      className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                    >
                      <BoomBox className="w-5 h-5 mr-2" /> Socials
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/integrations")}
                      className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                    >
                      <Zap className="w-5 h-5 mr-2" /> Integrations
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/history")}
                      className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-white shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
                    >
                      <History className="w-5 h-5 mr-2" /> History
                    </button>
                  </div>
                </>
              )}

              <button
                type="button"
                className="flex items-center justify-center min-w-[120px] h-11 px-6 rounded-[22px] border-2 border-[#23b5b5] text-base font-bold bg-gradient-to-r from-[#10191f] via-[#18272e] to-[#10191f] text-green-300 shadow-md hover:border-[#7ce4de] hover:bg-gradient-to-r hover:from-[#18272e] hover:via-[#23b5b5]/30 hover:to-[#18272e] hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#23b5b5]/40"
              >
                <Mail className="w-5 h-5 mr-3" />{" "}
                <Link
                  className="text-white text-sm font-semibold hover:text-[#23b5b5]"
                  to={"https://explified.com/explified-labs"}
                >
                  For Enterprises
                </Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
