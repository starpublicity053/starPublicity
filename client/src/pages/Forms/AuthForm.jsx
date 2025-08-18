import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../features/auth/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();

      // Save in Redux
      dispatch(setCredentials(res));

      // Save token to localStorage
      localStorage.setItem("adminToken", res.token);

      // Role check
      if (res.role === "admin" || res.role === "superAdmin") {
        navigate("/admin");
      } else {
        setMessage("Access denied: You are not authorized.");
        localStorage.removeItem("adminToken"); // Clean up if not admin
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-teal-100 font-serif relative overflow-hidden mt-14">
      <motion.div
        className="absolute w-[500px] h-[500px] bg-indigo-300 rounded-full opacity-20 blur-3xl -top-40 -left-40 z-0"
        animate={{ y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-teal-300 rounded-full opacity-20 blur-3xl -bottom-40 -right-40 z-0"
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row shadow-2xl bg-white/30 backdrop-blur-lg border border-white/30 rounded-3xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center p-10 w-1/2 bg-gradient-to-br from-blue-500 via-blue-500 to-blue-400 text-white">
          <Lottie animationData={animationData} className="w-72 h-72" loop autoplay />
          <h2 className="text-3xl font-bold mt-6 text-center leading-tight">Welcome Admin</h2>
          <p className="text-center mt-2 text-white/90 text-sm">
            Manage and monitor your platform efficiently.
          </p>
        </div>

        <div className="flex-1 p-10 bg-white rounded-3xl md:rounded-none">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">Admin Login</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={6}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
              />
            </div>

            {message && (
              <div className="text-center font-medium text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-900 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-600 transition"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
