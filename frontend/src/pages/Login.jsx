import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUserApi } from "../api/auth.api";
import { login } from "../store/authSlice";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and Password are required!");
      return;
    }

    setLoading(true);

    try {
      // API Call -> Email + Password
      const response = await loginUserApi({ email, password });

      // Redux State Update
      if (response?.data?.user) {
        dispatch(login(response.data.user));
      }

      // Login success -> Redirect to Home Page
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yt-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-yt-card border border-yt-border rounded-xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-yt-accent mb-1">VideoTube</h1>
          <p className="text-gray-400 text-sm">Sign in to your account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-yt-bg border border-yt-border rounded-lg text-white focus:outline-none focus:border-yt-accent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-yt-bg border border-yt-border rounded-lg text-white focus:outline-none focus:border-yt-accent text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-yt-accent text-black font-semibold rounded-lg hover:bg-opacity-90 transition duration-200 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-yt-accent hover:underline font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
