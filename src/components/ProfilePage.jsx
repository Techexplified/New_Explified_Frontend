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
    <div className="min-h-screen flex items-center justify-center p-4"
     style={{
       background: "radial-gradient(circle at 20% 20%, #23b5b520, transparent), radial-gradient(circle at 80% 80%, #23b5b520, transparent), black",
     }}>

      <div className="bg-black border border-[#23b5b5]/40 rounded-2xl p-8 w-96 max-w-[90vw] shadow-lg shadow-[#23b5b5]/20">
        {/* Close button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-[#23b5b5]/10 hover:bg-[#23b5b5]/20 transition-all duration-200 text-[#23b5b5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#23b5b5] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-bold text-2xl">
              {userData.name[0]}
            </span>
          </div>
          <h2 className="text-white text-xl font-bold mb-1">{userData.name}</h2>
          <p className="text-gray-400 text-sm">{userData.email}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* login/logout */}
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
            className="w-full flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all duration-200"
          >
            {isLoggedIn ? (
              <>
                <LogOut size={16} className="mr-2" />
                <span className="font-medium cursor-pointer">Log Out</span>
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
              {/* Feedback */}
              <button
                onClick={handleFeedbackClick}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all duration-200"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                <span className="font-medium">Feedback</span>
              </button>

              {/* Socials */}
              <button
                onClick={() => navigate("/socials")}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all duration-200"
              >
                <BoomBox className="w-5 h-5 mr-3" />
                <span className="font-medium">Socials</span>
              </button>

              {/* Integrations */}
              <button
                onClick={() => navigate("/integrations")}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all duration-200"
              >
                <Zap className="w-5 h-5 mr-3" />
                <span className="font-medium">Integrations</span>
              </button>

              {/* History */}
              <button
                onClick={() => navigate("/history")}
                className="w-full flex items-center justify-center px-4 py-3 bg-[#23b5b5]/10 border border-[#23b5b5]/50 text-[#23b5b5] rounded-xl hover:bg-[#23b5b5]/20 hover:border-[#23b5b5]/70 transition-all duration-200"
              >
                <History className="w-5 h-5 mr-3" />
                <span className="font-medium">History</span>
              </button>
            </>
          )}

          {/* Contact */}
          <button
            onClick={() => {
              // contact logic
            }}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-500/10 border border-green-500/50 text-green-400 rounded-xl hover:bg-green-500/20 hover:border-green-500/70 transition-all duration-200"
          >
            <Mail className="w-5 h-5 mr-3" />
            <span className="font-medium">Contact Us</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
