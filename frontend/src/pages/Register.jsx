import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUserApi } from "../api/auth.api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!avatar) {
      setError("Avatar image is required!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", fullName);
      formData.append("username", username.toLowerCase().trim());
      formData.append("email", email);
      formData.append("password", password);
      formData.append("avatar", avatar);

      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      await registerUserApi(formData);

      navigate("/login");
    } catch (error) {
      setError(error.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yt-bg flex items-center justify-center p-4 my-6">
      <div className="w-full max-w-md bg-yt-card border border-yt-border rounded-xl p-8 shadow-2xl">
        {/* Branding Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-yt-accent mb-1">VideoTube</h1>
          <p className="text-gray-400 text-sm">
            Create a new VideoTube account
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-400 bg-red-950/50 border border-red-800 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 bg-yt-bg border border-yt-border rounded-lg text-white focus:outline-none focus:border-yt-accent text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-yt-bg border border-yt-border rounded-lg text-white focus:outline-none focus:border-yt-accent text-sm"
            />
          </div>

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

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Avatar Image <span className="text-red-400">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setAvatar(e.target.files[0])}
              className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-yt-border file:text-white hover:file:bg-yt-hover cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Cover Image <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
              className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-yt-border file:text-white hover:file:bg-yt-hover cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-yt-accent text-black font-semibold rounded-lg hover:bg-opacity-90 transition duration-200 disabled:opacity-50 text-sm mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yt-accent hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
