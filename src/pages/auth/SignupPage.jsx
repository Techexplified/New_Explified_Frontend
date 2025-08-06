import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../utils/auth_slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Logo from "../../reusable_components/Logo";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user?.user); // adjust based on your reducer structure

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, email, password } = formData;
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/users/signup", formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        localStorage.setItem("explified", JSON.stringify(response.data.user));
        dispatch(loginUser(response.data.user));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4">
      <div className="flex gap-6 w-screen p-4">
        <Logo />
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 p-6">
          <div>
            <h2 className="text-4xl font-bold">
              Welcome to <span className="text-white">Explified</span>
            </h2>
            <p className="mt-2 text-gray-300">
              Where creative video editing meets the efficiency of AI. We
              deliver polished results and provide intelligent tools to enhance
              your own projects.
            </p>
          </div>

          <div className="border border-gray-700 rounded-md p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-semibold text-center mb-4">Signup</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="firstName" className="block text-sm mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm mb-1">
                  Email
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
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {isLoading ? (
                <p className="text-blue-400 text-sm">Signing up...</p>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-[#23b5b5] text-white py-2 rounded hover:bg-teal-600"
                >
                  Signup
                </button>
              )}
            </form>

            <GoogleLogin
              onSuccess={(resp) => {
                try {
                  const decoded = jwtDecode(resp.credential);
                  localStorage.setItem("explified", JSON.stringify(decoded));
                  dispatch(loginUser(decoded));
                  navigate("/");
                } catch (error) {
                  console.error("Google login error:", error);
                }
              }}
              onError={() => {
                console.log("Google Signup Failed");
              }}
            />

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-[#23b5b5] cursor-pointer hover:underline">
                  LogIn
                </span>
              </Link>
            </p>
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
};

export default SignupPage;
