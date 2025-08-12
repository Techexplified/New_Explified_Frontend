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
    <div
  className="w-full h-screen p-8"
  style={{
    background:
      "black",
  }}
>
  <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2">
    
    {/* Left Column */}
    <div className="flex flex-col justify-center p-8  border-r border-[#23b5b5]/40">
      {/* User Profile */}
      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-[#23b5b5] rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-2xl">{userData.name[0]}</span>
        </div>
        <div>
          <h2 className="text-white text-3xl font-bold">{userData.name}</h2>
          <p className="text-gray-400">{userData.email}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
        >
          {isLoggedIn ? <LogOut size={16} className="mr-2" /> : <LogIn className="w-5 h-5 mr-3" />}
          {isLoggedIn ? "Log Out" : "Login"}
        </button>

        {isLoggedIn && (
          <>
            <button
              onClick={handleFeedbackClick}
              className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
            >
              <MessageSquare className="w-5 h-5 mr-3" /> Feedback
            </button>

            <button
              onClick={() => navigate("/socials")}
              className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
            >
              <BoomBox className="w-5 h-5 mr-3" /> Socials
            </button>

            <button
              onClick={() => navigate("/integrations")}
              className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
            >
              <Zap className="w-5 h-5 mr-3" /> Integrations
            </button>

            <button
              onClick={() => navigate("/history")}
              className="flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all"
            >
              <History className="w-5 h-5 mr-3" /> History
            </button>
          </>
        )}

        {/* Contact */}
        <button
          className="flex items-center justify-center px-4 py-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-500/20 hover:border-green-500/70 transition-all"
        >
          <Mail className="w-5 h-5 mr-3" /> Contact Us
        </button>
      </div>
    </div>

    {/* Right Column */}
    <div className="flex items-center justify-center p-8">
      <img
        src="/images/login.png"
        alt="Decorative"
        className="w-full h-full object-fit rounded-2xl border border-[#23b5b5]/40 shadow-lg shadow-[#23b5b5]/30 "
      />
    </div>
  </div>
</div>




  );
};

export default UserPage;
