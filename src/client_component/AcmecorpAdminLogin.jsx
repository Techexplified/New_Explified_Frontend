import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../reusable_components/Logo";

const initialState = {
  email: "hello@explified.com",
  password: "explified@123",
};

export default function AcmecorpAdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false); // loader state

  function handleChange(e) {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      navigate("/flowsense/acmecorp/admin");
    } catch (error) {
      console.error(
        "Error during login:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4">
      <div className="p-4">
        <Logo />
      </div>
      <div className="w-full grid grid-cols-1 gap-8 items-center">
        {/* Left Section */}
        <div className="space-y-6 p-6 flex flex-col items-center justify-center">
          <div>
            <h2 className="text-4xl text-center font-bold">
              Acmecorp Admin Login
            </h2>
            {/* <p className="mt-2 text-gray-300">
              Where creative video editing meets the efficiency of AI. We
              deliver polished results and provide the intelligent tools to
              enhance your own projects.
            </p> */}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className={`w-full py-2 rounded text-white ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#23b5b5] hover:bg-teal-600"
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

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
      </div>
    </div>
  );
}
