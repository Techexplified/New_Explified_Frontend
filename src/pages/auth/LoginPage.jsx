import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/auth_slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../network/axiosInstance";
import Logo from "../../reusable_components/Logo";

const initialState = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState(initialState);

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post("/api/users/login", formData, {
        withCredentials: true,
      });
      console.log("Success Login:", res.data.user);

      localStorage.setItem("explified", JSON.stringify(res.data.user));
      setFormData(initialState);
      dispatch(loginUser(res.data.user));
      navigate("/");





    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4">
      <div className="p-4">
        <Logo />
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Section */}
        <div className="space-y-6 p-6 flex flex-col items-center justify-center">
          <div>
            <h2 className="text-4xl text-center font-bold">
              Welcome back to <span className="text-white">Explified</span> ,
            </h2>
            <p className="mt-2 text-gray-300">
              Where creative video editing meets the efficiency of AI. We
              deliver polished results and provide the intelligent tools to
              enhance your own projects.
            </p>
          </div>

          {/* Login Box */}
          <div className="border border-gray-700 rounded-md p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">Login</h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email Id
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#23b5b5] text-white py-2 rounded hover:bg-teal-600"
              >
                Login
              </button>

              <GoogleLogin
                onSuccess={(resp) => {
                  try {
                    const decoded = jwtDecode(resp.credential);
                    console.log("Login Success: currentUser:", decoded);
                    localStorage.setItem(
                      "explified",
                      JSON.stringify({ isLoggedIn: "true" })
                    );
                    console.log("clicked");

                    window.postMessage({
                      source: "explified-auth",
                      type: "store_token",
                      token: "jwt_token_from_explified"
                    }, "*");
                    console.log("Token postMessage sent");
                    dispatch(loginUser(decoded));
                    navigate("/");
                  } catch (error) {
                    console.error("Error decoding JWT:", error);
                  }
                }}
                onError={() => {
                  console.log("Login Failed");
                }}
              />

              <p className="text-center text-sm text-gray-400">
                Create an account?{" "}
                <Link to="/signup">
                  <span className="text-[#23b5b5] cursor-pointer hover:underline">
                    SignUp
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <img
            src="/images/login.png"
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
