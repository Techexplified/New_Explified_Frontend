import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/auth_slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../network/axiosInstance";

const initialState = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(initialState);
  const [isSignInLoading, setIsSignInLoading] = useState(false);

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
      // dispatch(
      //   loginSuccess({
      //     user: res.data.user,
      //   })
      // );

      dispatch(loginUser(res.data.user));
      navigate("/subtitling");
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>
      <div className="flex flex-col justify-center mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 outline-gray-300 placeholder:text-black focus:outline-2 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <div className="text-sm">
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline-1 outline-gray-300 placeholder:text-black focus:outline-2 focus:outline-indigo-600"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
        <GoogleLogin
          onSuccess={(resp) => {
            try {
              const decoded = jwtDecode(resp.credential);
              console.log("Login Success: currentUser:", decoded);
              dispatch(loginUser(decoded));
              navigate("/subtitling");
            } catch (error) {
              console.error("Error decoding JWT:", error);
            }
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        <p className="mt-10 text-center text-sm text-white">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Start a 14-day free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
