// src/pages/UserPage.jsx
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
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { clearUser } from "../utils/auth_slice/UserSlice";

const UserPage = () => {
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

  const handleFeedbackClick = () => {
    window.location.href = "https://admin.explified.com/";
  };

  return (
    <div className="w-full h-screen bg-black p-6 lg:p-8">
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0">
        {/* Left Column */}
        <div className="flex flex-col items-center justify-center gap-4 p-6 lg:p-8 w-full max-w-sm mx-auto">
          {/* User Profile */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[#23b5b5] rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-2xl">
                {userData.name[0]}
              </span>
            </div>
            <h2 className="mt-4 text-white text-2xl font-bold break-words">
              {userData.name}
            </h2>
            <p className="text-gray-400 text-sm break-all">{userData.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-10 w-full">
            {/* Login / Logout */}
            <button
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
              className="flex items-center justify-center w-full px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
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
                    onClick={handleFeedbackClick}
                    className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" /> Feedback
                  </button>
                  <button
                    onClick={() => navigate("/socials")}
                    className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
                  >
                    <BoomBox className="w-5 h-5 mr-2" /> Socials
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate("/integrations")}
                    className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
                  >
                    <Zap className="w-5 h-5 mr-2" /> Integrations
                  </button>
                  <button
                    onClick={() => navigate("/history")}
                    className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
                  >
                    <History className="w-5 h-5 mr-2" /> History
                  </button>
                </div>
              </>
            )}

            <button className="flex items-center justify-center w-full px-4 py-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-500/20 hover:border-green-500/70 transition-all">
              <Mail className="w-5 h-5 mr-3" /> Contact Us
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px bg-[#23b5b5]/30 mx-4"></div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 items-center justify-center text-center px-6 lg:px-12">
          <p className="text-3xl text-gray-300">Time saved</p>
          <p className="text-3xl mb-4">
            Using{" "}
            <span className="text-[#23b5b5] font-semibold">Explified</span>
          </p>
          <h1 className="text-5xl font-bold">00 Hours</h1>
          <span className="text-3xl font-semibold">&</span>
          <h1 className="text-5xl font-bold">00 Minutes</h1>
          <p className="mt-6 text-lg text-gray-400 cursor-pointer hover:underline">
            See how?
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
