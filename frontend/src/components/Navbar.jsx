import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUserApi } from "../api/auth.api";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const { status, userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Handle User Logout
  const handleLogout = async () => {
    try {
      await logoutUserApi();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-yt-bg border-b border-yt-border px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-yt-accent text-black font-black px-2.5 py-1 rounded text-xl tracking-wider">
          VT
        </div>
        <span className="text-xl font-bold text-white hidden sm:inline">
          VideoTube
        </span>
      </Link>

      {/* Middle: Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-xl flex items-center"
      >
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-yt-card border border-yt-border rounded-l-full px-4 py-2 text-sm text-white focus:outline-none focus:border-yt-accent"
        />
        <button
          type="submit"
          className="bg-yt-hover border border-l-0 border-yt-border rounded-r-full px-5 py-2 text-gray-300 hover:text-white hover:bg-yt-border transition"
        >
          🔍
        </button>
      </form>

      {/* 3. Right: Dynamic User Avatar & Login Button */}
      <div className="flex items-center gap-3">
        {status && userData ? (
          <div className="flex items-center gap-3">
            {/* User Avatar */}
            <Link to={`/c/${userData.username}`}>
              <img
                src={userData.avatar}
                alt={userData.username}
                className="w-9 h-9 rounded-full object-cover border border-yt-accent"
              />
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-yt-hover hover:bg-red-950/50 hover:text-red-400 text-gray-300 text-xs px-3 py-2 rounded-lg border border-yt-border transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-yt-accent text-black font-semibold text-sm px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
